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
