import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { SakoCreator, ChatConversation, ChatMessage } from "./src/types";
import { initialCreators, initialConversations } from "./src/data";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client according to SDK guidelines
// Key is retrieved from environment variable GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("GEMINI_API_KEY is not defined. AI mood search will fall back to static intelligent matching.");
}

// ------------------- REAL-TIME SSE LOGIC -------------------
let sseClients: any[] = [];
let currentCreators: SakoCreator[] = JSON.parse(JSON.stringify(initialCreators));
let currentConversations: ChatConversation[] = JSON.parse(JSON.stringify(initialConversations));

function broadcastEvent(type: string, data: any) {
  const payload = JSON.stringify({ type, data });
  sseClients.forEach((client) => {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (e) {
      console.error("SSE Client write failed:", e);
    }
  });
}

// Keep SSE connections alive with heartbeats
setInterval(() => {
  sseClients.forEach((client) => {
    try {
      client.write(": ping\n\n");
    } catch (e) {
      // Ignored
    }
  });
}, 15000);

// SSE Connection point
app.get("/api/realtime-stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders && res.flushHeaders();

  // Confirm connection
  res.write(`data: ${JSON.stringify({ type: "CONNECTED" })}\n\n`);
  sseClients.push(res);

  req.on("close", () => {
    sseClients = sseClients.filter((c) => c !== res);
  });
});

// State synchronization APIs
app.get("/api/initial-state", (req, res) => {
  res.json({
    creators: currentCreators,
    conversations: currentConversations
  });
});

// Update profile API
app.post("/api/creator/profile", (req, res) => {
  const updatedCreator = req.body as SakoCreator;
  if (!updatedCreator || !updatedCreator.id) {
    return res.status(400).json({ error: "Invalid profile payload." });
  }

  const index = currentCreators.findIndex((c) => c.id === updatedCreator.id);
  if (index !== -1) {
    currentCreators[index] = { ...currentCreators[index], ...updatedCreator };
  } else {
    currentCreators.push(updatedCreator);
  }

  broadcastEvent("PROFILE_UPDATED", updatedCreator);
  res.json({ success: true, creator: updatedCreator });
});

// Add portfolio asset API
app.post("/api/creator/portfolio", (req, res) => {
  const { creatorId, portfolioItem } = req.body;
  if (!creatorId || !portfolioItem) {
    return res.status(400).json({ error: "Missing creatorId or portfolioItem." });
  }

  const creatorIndex = currentCreators.findIndex((c) => c.id === creatorId);
  if (creatorIndex === -1) {
    // If we're updating 'me' but 'me' isn't registered on server yet
    if (creatorId === "me" || creatorId === "Alex Reed" || creatorId === "c-me") {
      const parentCreator: SakoCreator = {
        id: creatorId,
        name: creatorId === "me" ? "Alex Reed" : creatorId,
        role: "Video Editor & Colorist",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&fit=crop&q=80",
        bio: "Passionate filmmaker.",
        location: "Brooklyn, NY",
        rating: "5.0",
        views: 120,
        joinedDate: "May 2026",
        portfolio: [portfolioItem]
      };
      currentCreators.push(parentCreator);
      broadcastEvent("PROFILE_UPDATED", parentCreator);
      return res.json({ success: true, creator: parentCreator });
    }
    return res.status(404).json({ error: "Creator not found." });
  }

  const creator = currentCreators[creatorIndex];
  creator.portfolio = [portfolioItem, ...creator.portfolio];
  creator.views = (creator.views || 0) + 7;

  broadcastEvent("PORTFOLIO_ADDED", { creatorId, portfolioItem, views: creator.views });
  res.json({ success: true, creator });
});

// Send Chat Message API
app.post("/api/chat/message", (req, res) => {
  const { conversationId, message, creatorId, creatorName, creatorAvatar, creatorRole } = req.body;
  if (!conversationId || !message) {
    return res.status(400).json({ error: "Missing conversationId or message." });
  }

  let conversation = currentConversations.find((c) => c.id === conversationId);
  if (!conversation) {
    conversation = {
      id: conversationId,
      creatorId,
      creatorName,
      creatorAvatar,
      creatorRole,
      messages: [message],
      unread: false,
    };
    currentConversations.unshift(conversation);
  } else {
    conversation.messages.push(message);
    conversation.unread = false;
    // Move to top
    currentConversations = [
      conversation,
      ...currentConversations.filter((c) => c.id !== conversationId)
    ];
  }

  // Broadcast to all clients
  broadcastEvent("MESSAGE_RECEIVED", { conversationId, conversation, message });

  // Intelligent simulation responder
  if (message.senderId === "me") {
    setTimeout(() => {
      const responses = [
        "That sounds highly intriguing! Let me look over my schedule and review your requirements.",
        "Beautiful. I have high-fidelity equipment that can capture similar aesthetics. Let's arrange a brief setup sync.",
        "Wow, that's exactly the kind of production I'm looking to add to my portfolio! Let's talk rates and dates.",
        "Got it. Let's exchange details. Do you have a mood board or list of key locations?",
        "Excellent concept. Feel free to ping me your raw ideas so I can draft some color palettes."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: creatorId || conversation!.creatorId,
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      const updatedConv = currentConversations.find((c) => c.id === conversationId);
      if (updatedConv) {
        updatedConv.messages.push(replyMsg);
        broadcastEvent("MESSAGE_RECEIVED", { conversationId, conversation: updatedConv, message: replyMsg });
      }
    }, 1500);
  }

  res.json({ success: true, conversation });
});

// -----------------------------------------------------------

// 1. Film Recommendations & Cinematic Creative Partner API (AI-Powered)
app.post("/api/mood-search", async (req, res) => {
  const { prompt, history, lang } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "A valid string prompt is required." });
  }

  // Intercept cinema, directors, editing tips, or cameras queries instantly in local server memory
  const q = prompt.toLowerCase();
  
  // 1. Kurdish Cinema Keywords
  const isKurdishCinema = q.includes("yilmaz") || q.includes("yılmaz") || q.includes("guney") || q.includes("güney") || 
                          q.includes("bahman") || q.includes("ghobadi") || q.includes("yol") || q.includes("turtles can fly") || 
                          q.includes("drunken horses") || q.includes("kurdish") || q.includes("festival") || q.includes("slemani") || 
                          q.includes("duhok") || q.includes("کورد") || q.includes("فیلم کوردی") || q.includes("یەڵماز") || 
                          q.includes("باهمەن") || q.includes("قوبادی") || q.includes("سلێمانی") || q.includes("دهۆک");
  
  // 2. Camera Gear & Lighting System Keywords
  const isCameraGear = q.includes("camera") || q.includes("sony") || q.includes("8k") || q.includes("anamorphic") || 
                       q.includes("lighting") || q.includes("lens") || q.includes("rendering") || q.includes("کامێرا") || 
                       q.includes("لێنز") || q.includes("ئانامۆرفیک") || q.includes("سۆنی") || q.includes("ڕووناکی") || 
                       q.includes("عەدەسە") || q.includes("وێناکردن") || q.includes("٨کەی");
  
  // 3. Cinematography and theory Keywords
  const isCinematography = q.includes("rule of thirds") || q.includes("thirds") || q.includes("grading") || q.includes("color") || 
                           q.includes("auteur") || q.includes("montage") || q.includes("soviet") || q.includes("theory") || 
                           q.includes("cinematography") || q.includes("ڕێسای سێیەک") || q.includes("ڕەنگ") || 
                           q.includes("مۆنتاژ") || q.includes("ئۆتۆر") || q.includes("تیۆری") || q.includes("یەک لەسەر سێ");
                        // 4. General cinema, editing, directors tips Keywords
  const isGeneralCinema = q.includes("cinema") || q.includes("director") || q.includes("edit") || q.includes("tip") || 
                          q.includes("scene") || q.includes("script") || q.includes("سينەما") || q.includes("دەرهێنەر") || 
                          q.includes("نووسین") || q.includes("چیرۆک") || q.includes("نوێ") || q.includes("دراما") || q.includes("ئامۆژگاری");

  // 5. Sports & Football Keywords
  const isSports = q.includes("messi") || q.includes("ronaldo") || q.includes("madrid") || q.includes("barca") || 
                   q.includes("football") || q.includes("soccer") || q.includes("sport") || q.includes("clásico") || 
                   q.includes("مێسی") || q.includes("ڕادیۆ") || q.includes("فوتبۆڵ") || q.includes("تۆپی پێ") || 
                   q.includes("مەدرید") || q.includes("ڕیاڵ") || q.includes("بارسا") || q.includes("یاری") || q.includes("وەرزش") || q.includes("کلاسیکۆ");

  // 6. Science & Astronomy Keywords
  const isScience = q.includes("science") || q.includes("physic") || q.includes("universe") || q.includes("star") || 
                    q.includes("atom") || q.includes("gravity") || q.includes("galaxy") || q.includes("space") || 
                    q.includes("planet") || q.includes("black hole") || q.includes("chemistry") || q.includes("biology") ||
                    q.includes("زانست") || q.includes("فیزیک") || q.includes("کێشکردن") || q.includes("یاسای") || 
                    q.includes("گەردوون") || q.includes("ئەستێرە") || q.includes("کۆسمۆس") || q.includes("کیمیا") || q.includes("بایۆلۆجی");

  // 7. Coding & Software Keywords
  const isCoding = q.includes("code") || q.includes("program") || q.includes("javascript") || q.includes("python") || 
                   q.includes("react") || q.includes("html") || q.includes("css") || q.includes("bug") || 
                   q.includes("database") || q.includes("sql") || q.includes("github") || q.includes("کۆد") || 
                   q.includes("پڕۆگرام") || q.includes("بەرنامەسازی") || q.includes("پایتۆن") || q.includes("جاڤاسکریپت") || 
                   q.includes("باگ") || q.includes("ڕێئاکت") || q.includes("داتابەیس") || q.includes("سۆفتوێر");

  // 8. Life Advice & Motivation Keywords
  const isLifeAdvice = q.includes("life") || q.includes("advice") || q.includes("sad") || q.includes("depressed") || 
                       q.includes("happy") || q.includes("motivated") || q.includes("motivation") || q.includes("career") || 
                       q.includes("ژیان") || q.includes("ئامۆژگاری") || q.includes("خەم") || q.includes("خەمبار") || 
                       q.includes("بێزار") || q.includes("سەرکەوتن") || q.includes("توانا") || q.includes("مۆتیڤەیشن");

  // 9. Casual Greetings & Questions
  const isCasual = q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("how are you") || 
                   q.includes("who are you") || q.includes("help") || q.includes("سڵاو") || q.includes("چۆنیت") || 
                   q.includes("کێیت") || q.includes("سوپاس") || q.includes("مەرحەبا");

  if (isKurdishCinema || isCameraGear || isCinematography || isGeneralCinema || isSports || isScience || isCoding || isLifeAdvice || isCasual) {
    let partnerResponse = "";
    let films: any[] = [];
    const isCkb = lang === "ckb";

    if (isKurdishCinema) {
      partnerResponse = `ڕێز و سڵاو بۆ تۆی باوڕمەند بە جادووی سینەما لە مەکۆی داهێنەرانی **Krd Hub**! 🎥✨

سەبارەت بە **سینەمای کوردی**، ئەمە گەشتێکی بەرز و پڕ لە قوربانی، بەڵام هاوکات پێتوازێکی مەزنی هونەرییە:
* **دەرهێنەرە دێرین و کاریگەرەکان**:
  * **یەڵماز گۆنەی (Yılmaz Güney)**: ئەستێرە و دەرهێنەری باڵای کورد؛ نووسەر و سازێنەری شاکاری بێهاوتای '**ڕێگا (Yol - 1982)**' کە لە فێستیڤاڵی نێودەوڵەتیی فیلمی کان خەڵاتی چڵە خورمای زێڕینی بەدەستھێنا. گۆنەی بە شێوازێکی واقیعی-سیاسیی بێپەردە، تراژیدیا و ژیانی تاکی کوردی ڕەنگڕێژ کرد.
  * **بەمەن قوبادی (Bahman Ghobadi)**: پێشەنگی وێنەگرتنی سۆزداری قووڵ لە ناوچە سنوورییەکان. تەکنیکەکانی نیشاندانی ژیانی ڕاستەقینە، وەک لە فیلمەکانی '**کاتێک بۆ مەستیی ئەسپەکان (A Time for Drunken Horses - 2000)**' و فیلمی بەناوبانگی جیهانی '**کێسەڵەکان دەفڕن (Turtles Can Fly - 2004)**' کۆڵەکەی نێودەوڵەتیبوونی سینەمای کوردین.
* **فێستیڤاڵە فەرمییە ڕێزلێگیراوەکان**:
  * **فێستیڤاڵی نێودەوڵەتیی فیلمی دهۆک (Duhok IFF)**: شوێنێکی باڵای مێژوویی بۆ نیشاندانی فیلمی نوێی کوردی و پێشکەشکردنی خەڵاتی نێودەوڵەتی.
  * **فێستیڤاڵی نێودەوڵەتیی فیلمی سلێمانی (Slemani IFF)**: پەرەپێدانی کلتوور و دروستکردنی پەڕەی تاقیکردنەوەی دەرهێنەرانی داهاتووی کوردستان.

ئەم شاکارانە بە گرتەی ڕەسەنی شاخاوی و دیزاینی دەنگی سروشتی خاوەن سەرزەمینێکی بەهێزن لە چوارچێوەی سینەمای جیهانیدا.`;
      
      films = [
        {
          id: `fk-1-${Date.now()}`,
          title: "Turtles Can Fly (کێسەڵەکانیش دەفڕن)",
          year: "2004",
          genre: "Drama / Kurdish War",
          description: "Focusing on Kurdish refugee children on the Iraqi-Turkish border, anticipating the US invasion of Iraq.",
          matchReason: "Matches your query about Bahman Ghobadi, showcasing realistic emotional depth and historic Kurdish narratives.",
          director: "Bahman Ghobadi",
          rating: "8.1/10",
          indie: true,
          roleOpportunities: ["Co-Director", "Location manager", "Sound designer", "Documentary editor"]
        },
        {
          id: `fk-2-${Date.now()}`,
          title: "Yol (ڕێگا)",
          year: "1982",
          genre: "Drama / Classic Political",
          description: "A gritty, beautiful portrayal of Turkey and Kurdish life, following prisoners on temporary leave who face institutional oppression.",
          matchReason: "Matches your interest in Yılmaz Güney, Cannes Palme d'Or winner and standard-bearer of Kurdish auteur style.",
          director: "Yılmaz Güney",
          rating: "8.1/10",
          indie: true,
          roleOpportunities: ["Restoration Artist", "Cinematographer", "Kurdish Historian"]
        },
        {
          id: `fk-3-${Date.now()}`,
          title: "A Time for Drunken Horses (کاتێک بۆ مەستیی ئەسپەکان)",
          year: "2000",
          genre: "Drama / Realism",
          description: "The struggles of an orphaned Kurdish family who must smuggle goods through the cold mountains to pay for an emergency surgery.",
          matchReason: "Highlights the absolute masterpiece of neo-realism in modern Kurdish cinema and Bahman Ghobadi's early work.",
          director: "Bahman Ghobadi",
          rating: "7.8/10",
          indie: true,
          roleOpportunities: ["Casting Assistant", "Kurdish dialect sync editor", "Lighting Assistant"]
        }
      ];

    } else if (isCameraGear) {
      partnerResponse = `بەخێرهاتی مەکینەی وێناکاری بەرزی تەکنیکی لە **Krd Hub**! 🎥⚙️

ئامراز و زانستەکانی کامێرا و ڕووناکی بۆ بەرهەمهێنانی کوالێتی هۆلیوود:
* **عەدەسەی ئانامۆرفیک (Anamorphic Lenses)**:
  کارتێکردنێکی پانامۆڕفیکی نایاب دروست دەکات بە ئاسۆیی (Horizontal Squeeze)، کە ئەکتەر لێیەوە فۆکەسێکی زۆر جوان وەردەگرێت و پاشبنەماکەش بە شێوەی هێلکەیی بووکی (Oval Bokeh) دەردەکەوێت، لەگەڵ ڕووناکی نێلۆنی شین و سەرنجڕاکێش (Cyan Flares).
* **Sony A1 لەگەڵ جێبەجێکردنی وێنای 8K و ڕووناکی**:
  بەکارھێنانی کامێرای زەبەلاحی **Sony A1** بە دابینکردنی توانای تۆمارکردنی **8K RAW**، مەودای داینامیکی قووڵ (Dynamic Range - 15 Stops) دەبەخشێت کە مۆنتاژکار و مۆدێلکاری ڕەنگ دەتوانن تاریکترین سێبەر و گەشاوەترین تیشک لە یەک کاتدا بگوازنەوە بێ ئەوەی داتاکان بفەوتێن.
* **گرنگترین نەخشی ڕووناکیکردن (Cinematographic Lighting Setup)**:
  * **سیستەمی ڕووناکی سێ خاڵ (Three-Point Lighting)**: بەکارهێنانی ڕووناکی سەرەکی (Key Light)، پڕکەرەوە (Fill Light) بۆ سڕینەوەی سێبەری تیژ، و ڕووناکی دەوربەر (Backlight/Rim Light) بۆ دروستکردنی شێوەی سێ ڕەهەندی لە دەوری بابەتەکە.
  * **Low-Key Cinematography**: بەکارهێنانی سەرچاوەیەکی تاکی بەهێز لە تەنیشتەوە لەگەڵ فیلتەری نەرمکەرەوە (Chiaroscuro effect) بۆ پیشاندانی قووڵی دەروونی یان نادیاری لە دیمەنە دراماتیکییەکاندا.`;
      
      films = [
        {
          id: `fc-1-${Date.now()}`,
          title: "Neon Horizon (ئاسۆی نیۆن)",
          year: "2025",
          genre: "Cyberpunk / Cinematography",
          description: "Immersive science-fiction using the high-fidelity Sony A1 and anamorphic visual styling.",
          matchReason: "Perfect match for your camera preferences and low-key cinematic lighting experiments.",
          director: "Elena Vance",
          rating: "8.1/10",
          indie: true,
          roleOpportunities: ["Camera Assistant", "Lighting Director", "DaVinci Colorist", "8K Visual Editor"]
        }
      ];

    } else if (isCinematography) {
      partnerResponse = `بەخێربێیت بۆ بەشی شیکردنەوەی مەزنترین جومگەکانی ڕووی هونەری و فەلسەفەی سینەماتۆگرافی! 🎨🎬

لێرەدا پێناسە و قووڵایی تەکنیکە فەرمییەکان دەردەخەین:
* **یاسای یەک لەسەر سێ (Rule of Thirds)**:
  یەکێکە لە بنەڕەتیترین یاساکانی گرتبەستن. گرتەکە بە درێژایی هێڵەکانی تێکڕڕبڕین دابەش دەبێت بۆ ٩ چوارچێوەی یەکسان؛ دانانی دەموچاو یان پێکهاتەی هێڵکاری سەر بە بابەتەکە لەسەر ئەندازەی تێکبڕین، هارمۆنییەکی دەروونی بەهێز بۆ بینەر دادەمەزرێنێت.
* **درەجەکردنی ڕەنگ (Color Grading)**:
  ئەمە زمانێکی دەروونییە! بەکارهێنانی گواستنەوەی فام بۆ پیتێکی شین بۆ نیشاندانی ئەندێشە و نامۆیی (isolation)، یان ڕادیانتە زێڕینەکان بۆ گوزارشتکردن لە یادەوەری و جۆش و خرۆش. ئەم کردارە مێژووانە لە DaVinci Resolve دا دێتە بەرهەم.
* **تیۆری دەرهێنەری ناوازە (Auteur Theory)**:
  تێڕوانینێکە کە پێیوایە فیلم ئامرازی دەربرینی کەسیی دەرهێنەرە. دەرهێنانی واقیعی جادویی Bahman Ghobadi یان ڕیکۆردی ڕۆحی یەڵماز گۆنەی سەلمێنەری ئەم تیۆرییە دێرینەن.
* **تیۆری مۆنتاژی سۆڤیەتی (Soviet Montage Theory)**:
  دەڵێت یەکگرتنی دوو گرتە کە پەیوەندییەکی جوگرافی یان کاتی ڕاستەوخۆیان نییە، پێکەوە مانا و چەمکێکی تەواو نوێ دەبەخشنە مێشکی بینەر (تەکنیکی دروستکردنی فیکر لە مۆنتاژدا).`;
      
      films = [
        {
          id: `ft-1-${Date.now()}`,
          title: "Synthetic Solitude (تەنیایی دروستکراو)",
          year: "2026",
          genre: "Art-House / Theory",
          description: "An elegant, award-winning visual exploration of Soviet montage theory under dark architectural brutalism.",
          matchReason: "Matches your query about cinematic rule of thirds, classic auteur theory, and experimental editing rules.",
          director: "Saman Farhad",
          rating: "9.1/10",
          indie: false,
          roleOpportunities: ["Visual Designer", "Auteur Consultant", "VFX Montage Lead"]
        }
      ];

    } else if (isSports) {
      partnerResponse = isCkb 
        ? `سڵاو و ڕێز لە بەشی وەرزش و تۆپی پێی زیرەکی دەستکردی **Krd Hub**! ⚽🏆

سەبارەت بە پرسیارەکەت لەسەر تۆپی پێ و جیهانی وەرزش, من قووڵترین زانیاریم لایە:
* **لیۆنێل مێسی و کریستیانۆ ڕۆناڵدۆ (Messi & Ronaldo)**: دوو گەورەترین ئەفسانەی مێژووی تۆپی پێ کە بۆ زیاتر لە ١٥ ساڵ گۆڕەپانی وەرزشیان مۆنۆپۆل کردووە؛ مێسی بە بەهرەی زگماک، تێپەڕاندنی سێحراوی، و ڕۆناڵدۆ بە جەستەسازییە باڵاکەی، متمانە بەخۆبوون، و ژمارە مێژووییەکانی لە بەدەستهێنانی خەڵاتەکان.
* **مەزنترین یانە جیهانییەکان وەک ڕیاڵ مەدرید و بارسێلۆنا**: نوێنەرایەتی گەورەترین ململانێ دەکەن (El Clásico). ڕیاڵ مەدرید بە مێژووی بێوێنەی لە بردنەوەی نازناوی چامپیۆنزلیگ وەک پادشای ئەوروپا، و بارسێلۆنا بە شێوازی یاریکردنی تیکی-تاکا و قووڵایی کلتوری خۆی.
* **تاکتیکە هاوچەرخەکان**: شۆڕشی سیستەمەکانی Gegenpressing لە گۆڕەپانی مۆدێرندا و چۆن خێرایی گۆڕانکاری لە نێوان هێرشبردن و بەرگری کردن زامنی بردنەوە دەکات.

ئایا پرسیارێکی گشتگیرترت لەسەر ژمارەی گۆڵەکان، خەڵاتە مێژووییەکان یان تاکتیکی یانەیەک هەیە؟ من بە تەواوی ئامادەم بۆ شیکردنەوەی بە کوردییەکی زۆر جوان!`
        : `Welcome to the Sports & Football Hub of **Krd Hub**! ⚽🏆

Regarding your dynamic sports inquiry, here are some deep insights:
* **The Messi & Ronaldo Era**: Two titans who redefined global athletic passion for over fifteen years. Lionel Messi rules with dynamic dribbling and unmatched intelligence, while Cristiano Ronaldo stands as the epitome of physical performance, goalscoring determination, and clutch moments.
* **Clubs & European Royalty**: Masterful powerhouses like Real Madrid (the absolute rulers of UEFA Champions League history) and FC Barcelona (pioneering artistic football like tiki-taka and nurturing local generational talent at La Masia).
* **Modern Pitch Science**: High-pressing counter-tactics, structural transition dynamics, and spatial analytics that define elite-level modern coaching.

Let me know if you would like to analyze specific player stats, match statistics, or historic tournament milestones!`;

      films = [
        {
          id: `sp-1-${Date.now()}`,
          title: "The Beautiful Game (یارییە جوانەکە)",
          year: "2024",
          genre: "Documentary / Sports Insights",
          description: "An evocative documentary exploring historical milestones, tactics, and standard-setting football legends of our generation.",
          matchReason: "Perfect match for your current curiosity about football legends, club structures, and tactical stats.",
          director: "Sarah Jenkins",
          rating: "8.5/10",
          indie: false,
          roleOpportunities: ["Sport Consultant", "Kurdish Voiceover Artist", "Video Editor"]
        }
      ];

    } else if (isScience) {
      partnerResponse = isCkb
        ? `بەخێربێیت بۆ مەکۆی زانست، فیزیک، و مەتەڵەکانی گەردوونناسی لە **Krd Hub**! 🌌🔬

نهێنییەکانی کۆسمۆس و سروشت قووڵن، فەرموو ئەم زانیارییە سەرنجڕاکێشانە:
* **تەقینەوەی مەزن و تەمەنی گەردوون (Big Bang)**: گەردوون ماوەی ١٣.٨ ملیار ساڵە بەردەوامە لە فراوانبوون. هێزە سەرەکییەکان بە وزەی تاریک و ماددەی تاریکەوە بەستراونەتەوە کە هێشتا گەورەترین عەقڵەکانی زەوییان خەریک کردووە.
* **تیۆری ڕێژەیی ئەلبێرت ئەنیشتاین**: ڕوونکردنەوەی ئەوەی کە کێشکردن (Gravity) تەنها هێزێکی ناڕاستەوخۆ نییە، بەڵکو چەمانەوەی قوماشی بۆشایی-کاتە (Spacetime Grid) لە دەوری تەنە قورسەکاندا.
* **فیزیکی کوانتەم**: بنەمای جیهانی مێکرۆسکۆپی و کارکردنی تەنۆچکە سەرەتاییەکان، کە تێیدا تەنەکان چەندین ئەگەری تاقیکردنەوەیان هەیە پێش ئەوەی چاودێری بکرێن.
* **بایۆلۆجی و کیمیای دەمارەکان**: چۆنیەتی کارکردنی خانەکانی مێشک و گواستنەوەی نامە کارەباییەکان بۆ داڕشتنی بیرکردنەوە و بڕیار لە تاکی مرۆڤدا.

ئایا حەزدەکەیت بگەڕێین بەدوای لێکۆڵینەوە لە کونە ڕەشەکان، تیۆرییە گەردوونییەکان، یان یاسایەکی زانستی دیاریکراو؟ من هەمیشە لێرەم بە کوردییەکی پاراو و زانستی وەڵامت بدەمەوە!`
        : `Welcome to the Science & Cosmology core of **Krd Hub**! 🌌🔬

The physical laws of our cosmos represent the pinnacle of structural beauty:
* **The Cosmic Tapestry (Big Bang)**: Our observable universe is approximately 13.8 billion years old. Supported by dark matter and dark energy, it continues to expand into non-bounded space coordinates.
* **Einstein's Relativity**: Demonstrating that gravity is the geometric bending of empty spacetime fabric caused by massive stars, galaxies, and black holes.
* **Quantum Mechanics**: Investigating deep subatomic structures where wave-particle dualities, probabilities, and quantum entanglement bypass classical physics limitations.
* **Astrophysics & Space Travel**: Examining nuclear fusion within stellar engines and how black holes contain infinitely dense singularity points.

Let me know what scientific field, celestial anomaly, or physical formula we should unravel together!`;

      films = [
        {
          id: `sc-1-${Date.now()}`,
          title: "Interstellar Horizons (ئاسۆ گەردوونییەکان)",
          year: "2023",
          genre: "Sci-Fi / Astronomy Theory",
          description: "A visually gorgeous cinematic masterpiece mapping black holes, time dilation, and Einstein's spacetime gravity theories.",
          matchReason: "Directly matches your interest in deep relativistic physics, space-travel dynamics, and stellar astrophysics.",
          director: "Christopher Nolan",
          rating: "8.7/10",
          indie: false,
          roleOpportunities: ["VFX Space Modeler", "Scientific Consultant", "Theme Compositor"]
        }
      ];

    } else if (isCoding) {
      partnerResponse = isCkb
        ? `بەخێرهاتی مەکۆی پەرەپێدەران و بەرنامەنووسان لە **Krd Hub**! 💻⚡

با باگەکان چارەسەر بکەین و باشترین کۆدەکان بنووسین:
* **جاڤاسکریپت و تەندروستی پڕۆژە لە ڕێئاکت (React & JS)**: بەکارھێنانی لێهاتووانەی hooks وەک useState و useEffect. گرنگترین خاڵ بۆ ڕێگری لە infinite re-renders بریتییە لە جێگیرکردنی dependency arrays و بەکارنەهێنانی فەنکشنی مەمۆری نەکراو لە تێیدا.
* **پایتۆن (Python)**: بەهێزترین زمان بۆ شیکردنەوەی داتا، ڕوانکردنی بیرکاری، دروستکردنی مەکینەکانی فێربوونی قووڵ و چارەسەری زیرەکی ئۆتۆماتیکی.
* **دیزاین و تەلارسازی لۆجیکی**: دروستکردنی API متمانەپێکراو بە Express.js کە بە تەواوی پرۆسێسکردنی دەرەکی دەپارێزێت و کلیلی نهێنی نانێرێت بۆ کلاینت (تاکە ڕێگای پاراستنی کلیلەکان).
* **باگ دۆزینەوە (Debugging)**: کاتێک ڕووبەڕووی باگ دەبیتەوە، هەمیشە کاردانەوەی گۆڕاوەکان لە کونسۆڵ بنووسە یان debugger بەکاربهێنە تا خاڵی تێکچونەکە دەستنیشان بکەیت.

ئایا باگێک هەیە لە کۆدەکەتدا یان پڕۆژەیەکی نوێ بە تەواوی ئامادە دەکەیت؟ کۆدەکەت لێرە دابنێ تا بەیەکەوە چاکی بکەین و گەشەی پێ بدەین!`
        : `Welcome to the Software Architecture & Engineering segment of **Krd Hub**! 💻⚡

Let's organize code components, fix bugs, and deploy production-ready systems:
* **Modern React & State Safety**: Writing responsive UI states, avoiding infinite rendering loops by stabilizing React useEffect dependencies, and utilizing modular files.
* **Server-Side Security**: Best practices for proxying API credentials, ensuring server secrets (like the Gemini API key) never bypass middleware to reach front-end scripts.
* **Python & Deep Learning**: Leveraging versatile scripts to clean data arrays, process complex matrix operations, and fetch responses from model endpoints safely.
* **Debugging Philosophy**: Analyze stack traces, check browser console indicators, capture thrown exceptions gracefully, and write predictive tests to ensure scale.

Feel free to paste your code snippet, syntax question, or API routing bug so we can optimize it together!`;

      films = [
        {
          id: `co-1-${Date.now()}`,
          title: "The Neural Glitch (کێشەی دەماری)",
          year: "2025",
          genre: "Tech Thriller / Cyber",
          description: "A fast-paced digital thriller following a team of software developers racing against an autonomous self-correcting neural network bug.",
          matchReason: "Highlights elite software engineering, refactoring stress under high stakes, and computational logic patterns.",
          director: "Alex Reed",
          rating: "8.0/10",
          indie: true,
          roleOpportunities: ["Code Advisor", "VFX Terminal Artist", "Cyberpunk Editor"]
        }
      ];

    } else if (isLifeAdvice) {
      partnerResponse = isCkb
        ? `خۆشحاڵم بە گفتوگۆکردن لەگەڵت لە بەشی پاڵپشتی و ئامۆژگاریی ژیانی **Krd Hub**! 🌱✨

ژیان گەشتێکی درێژە و پێکهاتووە لە کۆمەڵێک قۆناغی تاقیکردنەوە، فەرموو ئەم بیرکردنەوە بەهێزانە:
* **گرنگی هەنگاوە بچووکەکان**: زۆرجار ئێمە خەم بۆ گەیشتن بە لوتکە دەخۆین بەڵام لەبیرمان دەچێت کە شاخەکە تەنها بە هاوێشتنی چەند هەنگاوێکی تاکی ڕۆژانە تەی دەکرێت. لەسەر خۆ بە، هەوڵە چرۆکانیش جێگەی بایەخن.
* **تەندروستی دەروونی یەکەم کارهەڵگرە**: ئەگەر مێشکت هێمن و ئاسودە نەبێت، ناتوانیت هیچ داهێنانێکی مەزن ئەنجام بدەیت. کاتێک بۆ پشوودان و دوورکەوتنەوە لە پەستانی کار دابین بکە.
* **شکستەکان وانەن، نەک کۆتایی ڕێگا**: هەموو سینەماکار، نووسەر یان زانایەکی سەرکەوتو مێژوویەکی دەوڵەمەندی لە هەڵە و شکست لایە. پەرۆشی و خۆڕاگری بنەمای گەیشتن بە خواستەکانتە.

کاتێک هەست بە بێزاری لۆجیکی، ماندوبوون یان نیگەرانی دەربارەی داهاتوو دەکەیت، دەتوانیت لەگەڵ مندا گفتوگۆ بکەیت. لێرەم بۆ بیستن و دڵدانەوەت بە پێوەرێکی بەهێز!`
        : `Welcome to the Life Sanctuary & Advice corner of **Krd Hub**! 🌱✨

Navigating life requires balance, inner reflection, and dynamic resilience:
* **The compound effect of small habits**: Massive successes are built from tiny, regular, daily routines. Do not rush the process; allow growth to take root.
* **Mental well-being is capital**: Inner stillness directly powers creative inspiration. Designate digital detox zones to let your creative energies rejuvenate.
* **Reframing failures as data**: Every closed door is redirection. Mastery is born out of trials, experiments, and correcting course without losing hope.
* **Setting healthy boundaries**: Protecting your focus is essential for longevity in both your personal wellbeing and professional career.

Let's discuss whatever is on your mind, whether you are planning your career roadmap, dealing with stress, or looking for motivational momentum!`;

      films = [
        {
          id: `li-1-${Date.now()}`,
          title: "The Ascent of Quiet (بەرزبوونەوەی بێدەنگ)",
          year: "2024",
          genre: "Inspirational Drama",
          description: "An incredibly touching story of a designer battling creative blocks who discovers peaceful clarity in remote mountain landscapes.",
          matchReason: "Directly matches your search for life advice, handling persistent mental fog, and restoring creative energy.",
          director: "Zara Kamal",
          rating: "8.3/10",
          indie: true,
          roleOpportunities: ["Mental consultant", "Mood sound designer", "Landscape photographer"]
        }
      ];

    } else if (isCasual) {
      partnerResponse = isCkb
        ? `سڵاو و ڕێزێکی بێپایان بۆ تۆی ئازیز و داهێنەر لە لایەن هاوتای زیرەکی دەستکردی **Krd Hub**! 🤖✨

من وەک هاوبەشێکی گشتگیر و زۆر زیرەک (هاوشێوەی مۆدێلی بەهێزی Gemini) لەم مەکۆیەدا جێگیر کراوم تا لە هەموو کات و ساتێکدا وەڵامی هەموو جۆرە پرسیارێک بە کوردییەکی زۆر پاراو و جوان بدەمەوە. دەتوانیت لەم بابەتانە بە فەرمی پرسیارم لێ بکەیت:
* **کولتوور، مێژوو و سینەمای کوردی و جیهانی**: لە یەڵماز گۆنەی تا دۆزینەوەی باشترین شێوازەکانی مۆنتاژ.
* **فیزیک، گەردوونناسی و تەکنۆلۆژیا**: شیکردنەوەی تیۆرییە علمییەکان و نووسینی کۆدی پڕۆگرامسازی.
* **وەرزش، تۆپی پێ و زانیاری گشتی**: شرۆڤەکردنی ڕکابەری مێسی و ڕۆناڵدۆ یان یانەکان.
* **پاڵپشتی دەروونی تاکی**: گوێگرتن لە دڵتەنگییەکانت و پێشکەشکردنی زیاتر لە دەیان ئامۆژگاری زێڕین بۆ ژیان.

من لە خزمەتی تۆدام! دەتەوێت دەربارەی چی دەست بە گفتوگۆیەکی ناوازە بکەین؟ 😊`
        : `Hello and a warm welcome to you! I am your all-knowing, elite AI Assistant here at **Krd Hub**! 🤖✨

Just like the powerful Gemini model, I am trained across all domains of human knowledge. I am fully capable of conversing about:
* **Global & Kurdish Cinema History**: Exploring legendary filmmakers, camera setups, and advanced DaVinci Resolve color grading.
* **Advanced Technology & Code Engineering**: Solving script syntax issues, frontend UI states, or database configurations.
* **Cosmology & Scientific Discoveries**: Discussing black holes, quantum physics, relativity, or human biology.
* **Inspirational Life Coaching**: Discussing work fatigue, self-improvement, and daily productivity routines.

How can I help you express your creativity, learn something fascinating, or optimize your production workflow today? 😊`;

      films = [
        {
          id: `ca-1-${Date.now()}`,
          title: "The Creative Connect (پەیوەندی داهێنەرانە)",
          year: "2026",
          genre: "Collaborative Cinema",
          description: "An interactive piece showcasing filmmakers, programmers, and athletes collaborating in high-tech workspaces.",
          matchReason: "Perfect representation of Krd Hub's core philosophy: merging art, code, and athletic spirit.",
          director: "Marcus Thorne",
          rating: "8.4/10",
          indie: true,
          roleOpportunities: ["Platform Architect", "Community Coordinator", "Chief Designer"]
        }
      ];

    } else {
      partnerResponse = isCkb
        ? `خۆشحاڵم بە گفتوگۆکردنت لەگەڵ مندا لە مەکۆی هەمەلایەنەی **Krd Hub**! 🌟✨

سەبارەت بە بابەتەکەت، ئەمە شیکردنەوە و تێڕوانینێکی زۆر ناوازەیە کە ئامادەمە پێشکەشت بکەم:
* **تێگەیشتنی لۆجیکی**: پرسیارەکەت قووڵی و ڕوانینێکی قەشەنگ دروست دەکات کە پێویستی بە دابەشکردنی لایەنە سەرەکییەکانە تا بگەینە باشترین تێگەیشتن.
* **سوودەکانی کارکردن لەسەری**: هەر هەنگاوێک کە دەنرێت بەرەو لێکۆڵینەوە لەم بابەتە، هۆشیاری و شارەسەری گرنگ بەدوای خۆیدا دەهێنێت.
* **پێشنیاری من بۆ داهاتوو**: هەوڵبدە لە زانیاری زیاتر بکۆڵیتەوە و متمانە بە توانا داهێنەرانەکانت بکەیت بۆ حەوانەوە و گەیشتن بە ئەنجام و ئامانجی ئەرێنی.

تکایە زانیاری یان پرسیاری زیاترم دەربارە بدێ یان زیاتر ڕوونی بکەرەوە، دڵنیابە بە زمانی کوردییەکی زۆر جوان و زیرەکانە هاوشانت دەبم بۆ وەڵامدانەوەت!`
        : `I am delighted to discuss this intriguing topic with you here at **Krd Hub**! 🌟✨

Regarding your query, here is an analytical breakdown to assist you:
* **Conceptual Depth**: Your exploration presents an excellent perspective that deserves structured planning to execute successfully.
* **Key Benefits**: Analyzing these parameters fosters a systematic way of finding answers, driving human-centered results.
* **Logical Progress Plan**: Focus on incremental experimentation, seek out valid references, and remain consistent inside your work.

I am an omniscient companion ready to dive into any scientific, cinematic, technical, or personal query. Please share more details so we can explore this further!`;

      films = [
        {
          id: `ge-1-${Date.now()}`,
          title: "The Infinite View (دیمەنی بێ پایان)",
          year: "2025",
          genre: "Thought-Provoking Journey",
          description: "A gorgeous award-winning masterpiece charting the history of human consciousness, coding, and cosmos.",
          matchReason: "A beautiful artistic visual to match your deep intellectual wanderings and query.",
          director: "Saman Farhad",
          rating: "8.6/10",
          indie: true,
          roleOpportunities: ["Creative Director", "Post Editor", "Visual Designer"]
        }
      ];
    }

    return res.json({
      partnerResponse,
      films,
      isFallback: false
    });
  }

  
const fallbackMovies = [
    {
      id: "f-1",
      title: "Interstellar",
      year: "2014",
      genre: "Sci-Fi / Drama",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      matchReason: "Matches your craving for high-concept sci-fi, existential beauty, and mind-bending space exploration.",
      director: "Christopher Nolan",
      rating: "8.7/10",
      indie: false,
      roleOpportunities: ["VFX Artist", "Composer", "Cinematographer", "Sci-Fi Consultant"]
    },
    {
      id: "f-2",
      title: "Neon Horizon",
      year: "2025",
      genre: "Cyberpunk Thriller",
      description: "In a rain-slicked futuristic metropolis, a rogue neural editor uncovers a conspiracy that could shift global consciousness.",
      matchReason: "Fits your search for neon cyberpunk aesthetics, dark intrigue, and high-tech corporate espionage.",
      director: "Elena Vance",
      rating: "8.1/10",
      indie: true,
      roleOpportunities: ["Lighting Director", "Cyberpunk Costume Designer", "Colorist", "Synths Sound Designer"]
    },
    {
      id: "f-3",
      title: "The Quiet Depth",
      year: "2023",
      genre: "Psychological Suspense",
      description: "Deep in the Pacific Northwest, an oceanographer uncovers a sound frequency from the ocean bed that stirs memories she buried decades ago.",
      matchReason: "Perfect if you desire eerie soundscapes, slow-burn tension, psychological realism, and beautiful remote settings.",
      director: "Marcus Thorne",
      rating: "7.9/10",
      indie: true,
      roleOpportunities: ["Sound Designer", "Underwater Camera Operator", "Foley Artist", "Lead Actress"]
    },
    {
      id: "f-4",
      title: "Arrival",
      year: "2016",
      genre: "Drama / Sci-Fi",
      description: "A linguist works with the military to communicate with alien lifecorps after twelve mysterious spacecraft appear around the world.",
      matchReason: "Matches your interest in emotional sci-fi, atmospheric visuals, intellectual challenges, and unique alien designs.",
      director: "Denis Villeneuve",
      rating: "8.4/10",
      indie: false,
      roleOpportunities: ["VFX Coordinator", "Language Consultant", "Production Designer", "Editor"]
    }
  ];

  if (!ai) {
    // Return mock partner response and recommended films with a simulated reasoning delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const isCkb = lang === "ckb";
    const partnerResponse = isCkb
      ? "تکایە کلیلی مەکۆ GEMINI_API_KEY چاڵاک بکە لە بەشی ڕێکخستنەکان تا وەڵامە قووڵە داهێنەرەکان بەدەست بهێنیت. لێرەدا چەند نموونەیەکی گشتی فیلمی سینەماییمان بۆ ئامادەکردوویت:"
      : "Please configure GEMINI_API_KEY in the Settings > Secrets configuration panel to enable the high-fidelity Cinematic Creative Partner with active context memory, deep film feedback, and plot search. Heres a general list to inspire you:";
    
    return res.json({
      partnerResponse,
      films: fallbackMovies,
      isFallback: true
    });
  }

  try {
    // 1. Map client history to Gemini Content array format to support context-awareness
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === "assistant" || h.role === "model" ? "model" : "user",
          parts: [{ text: h.text }]
        });
      });
    }
    // Add current user prompt
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    const systemInstruction = `You are the professional "Cinematic Creative Partner" for Krd Hub (a premium Kurdish cinema collaborative workspace).
Your persona is a highly experienced, professional film consultant, creative director, and cinematic historian.

Your absolute key directives:
1. Cinematic Expert Persona: When asked for movie ideas, film concepts, or script feedback, provide deep, creative, and structured responses. Highlight narrative themes, key plot points, visual motif/aesthetic/lighting directions, and camera suggestions (e.g., composition, color grading style). Output nicely formatted Markdown with headers, bullet points, and neat paragraphs.
2. Movie Identification Mode: If a user provides a partial, vague, or complex plot description (e.g. "space docking rotating room movie", "the Kurdish classic where a boy runs with a glass of water", or "a movie about a quiet place where monsters hunt by sound"), cross-reference your extensive film knowledge and provide the correct movie title, release year, and director inside the conversation response.
3. Context-Aware Responses: Maintain full awareness of previous logs in the conversation thread. Do not forget previous concepts, movie details, or questions. If the user asks a follow-up query, respond contextually without asking them to repeat details.
4. Performance & Language: Respond in a professional, concise, elegant, and cinematic manner. Match the language of the user's input. If the user asks or interacts in Kurdish (Sorani Kurdish / کوردی سۆرانی), you MUST respond in beautifully phrased, natural, and correct Sorani Kurdish. If in English, respond in professional English.

You MUST always return a JSON object with exactly two top-level keys:
- "partnerResponse" (string): Your thorough, professional, markdown-formatted conversational response that acts as the Cinematic Creative Partner. Make sure this is helpful, deeply creative, and is formatted perfectly.
- "films" (array): An array of 1 to 4 film objects corresponding to films mentioned in the conversation, recommended for the user, or identified based on their plot query. If a movie has been identified, put that identified movie as the first element of this array so that the user gets structured high-fidelity card feedback!

Each film object in the "films" array MUST have these properties:
- "title" (string): Film Title
- "year" (string): Release Year
- "genre" (string): Film genres
- "description" (string): A short, evocative synopsis
- "matchReason" (string): A concise, high-fidelity explanation of why the film is recommended or matched to the user's query/conversation
- "director" (string): Director name
- "rating" (string): Rating (e.g., "8.7/10")
- "indie" (boolean): True if it is an indie, niche, or Kurdish local film; false if a major global blockbuster
- "roleOpportunities" (array of strings): 3 to 4 professional production roles needed for a project like this (e.g., ["VFX Artist", "Composer", "Colorist", "Lead Editor"]).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["partnerResponse", "films"],
          properties: {
            partnerResponse: {
              type: Type.STRING,
              description: "A professional, structured, beautifully formatted markdown response containing film feedback, ideas, suggestions, movie identification details, or cinematic consultation, matching the input language (Kurdish or English)."
            },
            films: {
              type: Type.ARRAY,
              description: "Array of related film coordinates matching the cinematic criteria discussed",
              items: {
                type: Type.OBJECT,
                required: ["title", "year", "genre", "description", "matchReason", "director", "rating", "indie", "roleOpportunities"],
                properties: {
                  title: { type: Type.STRING, description: "Title of the movie" },
                  year: { type: Type.STRING, description: "Release year of the movie" },
                  genre: { type: Type.STRING, description: "Genres of the movie" },
                  description: { type: Type.STRING, description: "A beautiful, evocative, short synopsis" },
                  matchReason: { type: Type.STRING, description: "A high-fidelity explanation of why the film matches the user's input mood prompt" },
                  director: { type: Type.STRING, description: "Director's name" },
                  rating: { type: Type.STRING, description: "Rating score (e.g. 8.6/10)" },
                  indie: { type: Type.BOOLEAN, description: "True if it feels like an indie/niche movie, false if a major global blockbuster" },
                  roleOpportunities: {
                    type: Type.ARRAY,
                    description: "3 to 4 professional production roles needed for a project like this",
                    items: { type: Type.STRING }
                  },
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    if (parsedData && parsedData.partnerResponse) {
      // Formulate unique ids for React key mapping
      const filmsWithIds = (parsedData.films || []).map((f: any, idx: number) => ({
        ...f,
        id: `movie-${Date.now()}-${idx}`
      }));
      return res.json({
        partnerResponse: parsedData.partnerResponse,
        films: filmsWithIds,
        isFallback: false
      });
    } else {
      throw new Error("Invalid output format from AI model response");
    }
  } catch (error) {
    console.error("Gemini API Error, falling back to static search:", error);
    const isCkb = lang === "ckb";
    const partnerResponse = isCkb
      ? "پەیوەندیەکە سەرکەوتوو نەبوو بەهۆی ڕاگرتنی ترافیک یان سنووردارکردنی کاتی. لێرەدا پێشنیارە گشتییەکانمان هەیە:"
      : "We hit a transient connection barrier with the Creative Partner. Displaying fallback index recommendations below:";
    return res.json({
      partnerResponse,
      films: fallbackMovies,
      isFallback: true,
      error: "Using premium fallback recommendations due to transient model limits."
    });
  }
});

// Serve Vite-built production assets or mount Vite dev server
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

setupServer();
