import { Movie, SakoCreator } from "./types";

export const initialTrendingMovies: Movie[] = [
  {
    id: "m1",
    title: "Dune: Part Two",
    year: "2024",
    genre: "Sci-Fi / Epic",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    director: "Denis Villeneuve",
    rating: "8.9/10",
    indie: false,
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80",
    roleOpportunities: ["Director of Photography", "VFX Supervisor", "Sound Editor", "Lead Combat Choreographer"]
  },
  {
    id: "m2",
    title: "Chroma Drift",
    year: "2025",
    genre: "Indie / Cyberpunk Noir",
    description: "A digital fugitive hides in the decaying dark sectors of Neo-Kobe, selling synthesized sensory memories to survive.",
    director: "Kaito Sato",
    rating: "8.2/10",
    indie: true,
    backdropUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80",
    roleOpportunities: ["Analog Sound Synthesizer", "Laser Lighting Technician", "Costume Modder", "UI Hologram Artist"]
  },
  {
    id: "m3",
    title: "Everything Everywhere All at Once",
    year: "2022",
    genre: "Sci-Fi / Absurdist Drama",
    description: "An aging Chinese immigrant is swept up in an insane adventure, in which she alone can save the world by exploring other universes.",
    director: "Daniel Kwan, Daniel Scheinert",
    rating: "8.7/10",
    indie: true, // Distributed by A24
    backdropUrl: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=1000&auto=format&fit=crop&q=80",
    roleOpportunities: ["Key Grip", "Visual FX Compositor", "Whip-pan Specialist", "Production Designer"]
  },
  {
    id: "m4",
    title: "Vesper's Echo",
    year: "2026",
    genre: "Local Indie / Ambient Sci-Fi",
    description: "On an isolated listening post in the Nordic highlands, a lone acoustic engineer intercepts an audio wave that mirrors her own heartbeat.",
    director: "Astrid Lindqvist",
    rating: "7.8/10",
    indie: true,
    backdropUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1000&auto=format&fit=crop&q=80",
    roleOpportunities: ["Ambient Foley Mixer", "Scenic Drone Pilot", "Color Grader (Deep Nordics)", "Minimalist Wardrobe Stylist"]
  },
  {
    id: "m5",
    title: "The Creator",
    year: "2023",
    genre: "Sci-Fi / Action",
    description: "Amid a future war between the human race and the forces of artificial intelligence, a hardened ex-special forces agent is recruited to hunt down and kill the Creator.",
    director: "Gareth Edwards",
    rating: "7.0/10",
    indie: false,
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1000&auto=format&fit=crop&q=80",
    roleOpportunities: ["Lightweight Camera Operator", "VFX Matte Painter", "Co-Editor", "Location Scout (Asia)"]
  }
];

export const initialCreators: SakoCreator[] = [
  {
    id: "c1",
    name: "Elena Vance",
    role: "Director of Photography",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80",
    bio: "Cinematographer specializing in high-contrast neon-noir aesthetics, anamorphic frame compositions, and organic camera movement. Over 6 years filming award-winning indie sci-fi shorts.",
    location: "Berlin, DE",
    rating: "4.9",
    views: 1240,
    joinedDate: "Feb 2024",
    portfolio: [
      {
        id: "p1_1",
        title: "Chroma Noir (A4 Anamorphic Session)",
        type: "image",
        url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
        description: "Anamorphic test shoot exploring high dynamic range elements and neon gradients.",
        aspect: "landscape"
      },
      {
        id: "p1_2",
        title: "Cyberpunk Alleyway - Street Mood",
        type: "image",
        url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
        description: "Available light setup in rainy wet alleyways with neon highlights.",
        aspect: "portrait"
      },
      {
        id: "p1_3",
        title: "Dusk Silhouette Study",
        type: "image",
        url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
        description: "Silhouette exposure experiment utilizing high contrast dusk horizons.",
        aspect: "landscape"
      }
    ]
  },
  {
    id: "c2",
    name: "Marcus Thorne",
    role: "Video Editor & Colorist",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80",
    bio: "Obsessed with rhythm-based cuts, subtle pacing, and moody split-toning. Certified Resolve Colorist. Collaborated on multiple feature narratives streamed on major global platforms.",
    location: "Los Angeles, CA, USA",
    rating: "4.8",
    views: 890,
    joinedDate: "Oct 2023",
    portfolio: [
      {
        id: "p2_1",
        title: "Cold Graded Nordic Wilderness",
        type: "image",
        url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80",
        description: "Moody, cold-toned grading study emphasizing misty evergreens and soft blue highlights.",
        aspect: "landscape"
      },
      {
        id: "p2_2",
        title: "Sound of Metal - Timeline Structure",
        type: "image",
        url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80",
        description: "Showreel showcase consisting of quick pacing and intense scene transitions.",
        aspect: "landscape"
      }
    ]
  },
  {
    id: "c3",
    name: "Clara Zhang",
    role: "Lead Actress / Performer",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&fit=crop&q=80",
    bio: "Expressive physical actor, specializing in dramatic silence, psychological thrillers, and action choreography. Starred in independent features premiering at Sundance.",
    location: "Seoul, KR",
    rating: "5.0",
    views: 2150,
    joinedDate: "Jan 2025",
    portfolio: [
      {
        id: "p3_1",
        title: "The Quiet Depth - Character Portrait",
        type: "image",
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
        description: "Promotional portrait capturing intense physical focus for upcoming psychological horror.",
        aspect: "portrait"
      },
      {
        id: "p3_2",
        title: "Shadows of Seoul - Film Still",
        type: "image",
        url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80",
        description: "Action still showing atmospheric dark backlighting in street scene.",
        aspect: "landscape"
      }
    ]
  },
  {
    id: "c4",
    name: "Devon Cross",
    role: "Portrait & Unit Photographer",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80",
    bio: "Capturing the raw tension, authentic behind-the-scenes glances, and promotional promotional photography for cinematic ventures. Leica shooter, vintage lens enthusiast.",
    location: "London, UK",
    rating: "4.7",
    views: 740,
    joinedDate: "Sep 2024",
    portfolio: [
      {
        id: "p4_1",
        title: "Behind the Lens - Director's Cut",
        type: "image",
        url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
        description: "Set documentations visualizing creative chaos behind the monitors.",
        aspect: "landscape"
      },
      {
        id: "p4_2",
        title: "Tension in monochrome",
        type: "image",
        url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80",
        description: "High fidelity contrast study of leading actor waiting on stand-by.",
        aspect: "portrait"
      }
    ]
  }
];

export const initialConversations = [
  {
    id: "conv-elena",
    creatorId: "c1",
    creatorName: "Elena Vance",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80",
    creatorRole: "Director of Photography",
    messages: [
      {
        id: "m1",
        senderId: "c1",
        text: "Hey! Thanks for expressing interest in my anamorphic test stills. Are you planning a sci-fi project soon?",
        timestamp: "Yesterday, 6:42 PM"
      },
      {
        id: "m2",
        senderId: "me",
        text: "Hi Elena! Yes, I saw your 'Chroma Noir' set and fell in love with your low-light rendering. We're pitching a cyberpunk short.",
        timestamp: "Yesterday, 7:15 PM"
      },
      {
        id: "m3",
        senderId: "c1",
        text: "That sounds amazing. I have an RED V-Raptor package with vintage anamorphic lenses ready. Let's schedule a Zoom call this week!",
        timestamp: "Yesterday, 7:18 PM"
      }
    ],
    unread: true
  },
  {
    id: "conv-marcus",
    creatorId: "c2",
    creatorName: "Marcus Thorne",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80",
    creatorRole: "Video Editor & Colorist",
    messages: [
      {
        id: "m1",
        senderId: "me",
        text: "Hey Marcus, loved your cold grading study on Nordic landscapes. We might need your color grading expertise for our next teaser.",
        timestamp: "3 days ago"
      },
      {
        id: "m2",
        senderId: "c2",
        text: "Thank you! I absolutely love doing cold grades. Send over a rough cut or storyboard whenever you have it ready and we can do a test look.",
        timestamp: "2 days ago"
      }
    ],
    unread: false
  }
];
