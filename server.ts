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

// 1. Film Recommendations API (AI-Powered Mood Search)
app.post("/api/mood-search", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "A valid string prompt is required." });
  }

  // Fallback static dataset in case API key is missing or calls fail
  const fallbackMovies = [
    {
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
    // Return mock recommendations with a simulated reasoning delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return res.json({ films: fallbackMovies, isFallback: true });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Recommend 4 films matching the mood or prompt: "${prompt}". 
      Return realistic films (can be famous classics, popular masterpieces, or highly matching indie films).
      Format response as a JSON array inside a "films" property. Make sure to provide descriptive and beautiful field values.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["films"],
          properties: {
            films: {
              type: Type.ARRAY,
              description: "Array of recommended films matching the mood and prompt",
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
    if (parsedData && Array.isArray(parsedData.films)) {
      return res.json({ films: parsedData.films, isFallback: false });
    } else {
      throw new Error("Invalid output format from AI model response");
    }
  } catch (error) {
    console.error("Gemini API Error, falling back to static search:", error);
    // Find some films from fallbackMovies that match words, or return full list
    return res.json({ films: fallbackMovies, isFallback: true, error: "Using premium fallback recommendations due to transient model limits." });
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
