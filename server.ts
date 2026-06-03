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
                           q.includes("مۆنتاژ") || q.includes("ئۆتۆر") || q.includes("تیۆری") || q.includes("یەک لەسەر سێ") || 
                           q.includes("درەجەی ڕەنگ") || q.includes("سینەماتۆگرافی") || q.includes("رەنگ") || q.includes("مونتاژ") || q.includes("تیوری");

  // 4. General cinema, editing, directors tips Keywords
  const isGeneralCinema = q.includes("cinema") || q.includes("director") || q.includes("edit") || q.includes("tip") || 
                          q.includes("scene") || q.includes("script") || q.includes("سينەما") || q.includes("دەرهێنەر") || 
                          q.includes("نووسین") || q.includes("چیرۆک") || q.includes("نوێ") || q.includes("دراما") || q.includes("ئامۆژگاری");

  if (isKurdishCinema || isCameraGear || isCinematography || isGeneralCinema) {
    let partnerResponse = "";
    let films = [];

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

    } else {
      partnerResponse = `سڵاو و خۆشەویستی قووڵ بۆ تۆی داهێنەر لە **Krd Hub**! دڵخۆشم بە گفتوگۆکردن لەگەڵت دەربارەی سینەما. 🎥✨

ئەمەش کۆمەڵێک چرپەی تەکنیکی و ئامۆژگاری زێڕینی سینەمایی بۆ کارەکەت:
* **جڵەوکردنی سیناریۆ (The Story Engine)**: پێش دەست بردن بۆ تۆمارکردن، چیرۆکەکەت لەسەر سێ ئاستی سەرەکی دابەش بکە: دروستکردنی کێشە, گەیشتنە لوتکە (Climax)، و چارەسەرکردن. سیناریۆ ئەگەر بەهێز نەبێت پێشکەوتووترین کامێرا ڕزگاری ناکات.
* **ڕەسەنایەتی دەنگ (Auditory Realism)**: دەنگ نیوەی فیلمەکەتە! بەکارهێنانی مایکی ئاراستەیی (Shotgun) و دەستکاریکردنی دەنگە سروشتییەکانی دەوربەر (Ambient Sounds) بۆ بەرزکردنەوەی ئاستی سەرنجی بینەر بەکاربهێنە.
* **مۆنتاژی نەرم (Pacing & Timing)**: هەمیشە هەوڵبدە لە کاتی دیالۆگدا مۆنتاژی J-Cut و L-Cut بەکاربهێنیت تا گۆڕانکاری دیمەنەکان بەشێوەیەکی خۆڕسک دەربکەون.`;
      
      films = [
        {
          id: `fg-1-${Date.now()}`,
          title: "The Quiet Depth (قووڵایی بێدەنگ)",
          year: "2023",
          genre: "Psychological Drama",
          description: "A filmmaking marvel highlighting the usage of ambient sound design and slow-burn pacing.",
          matchReason: "Highlights top-tier practical advice for sound editing and low-key visual pacing.",
          director: "Marcus Thorne",
          rating: "7.9/10",
          indie: true,
          roleOpportunities: ["Lead Cine editor", "Sound Mixer", "Plot Advisor"]
        }
      ];
    }

    return res.json({
      partnerResponse,
      films,
      isFallback: false
    });
  }

  // Fallback static dataset in case API key is missing or calls fail
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
