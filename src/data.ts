import { Movie, SakoCreator, ChatConversation } from "./types";

export const initialTrendingMovies: Movie[] = [
  {
    id: "m_1",
    title: "Neon Horizon",
    year: "2025",
    genre: "Videographer",
    description: "In a rain-slicked futuristic metropolis, a rogue neural editor uncovers a conspiracy that could shift global consciousness.",
    director: "Elena Vance",
    rating: "8.1/10",
    backdropUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&fit=crop&q=80",
    indie: true
  },
  {
    id: "m_2",
    title: "The Quiet Depth",
    year: "2023",
    genre: "Editor",
    description: "Deep in the Pacific Northwest, an oceanographer uncovers a mysterious sound frequency from the ocean bed that stirs memories she buried decades ago.",
    director: "Marcus Thorne",
    rating: "7.9/10",
    backdropUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop&q=80",
    indie: true
  },
  {
    id: "m_3",
    title: "Alpine Freeride Cinematic",
    year: "2024",
    genre: "Athlete",
    description: "Freeride journey down vertical glacial couloirs in the Swiss Alps, capturing unmatched action speeds and high-altitude elements.",
    director: "Marcus Thorne",
    rating: "8.6/10",
    backdropUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&fit=crop&q=80",
    indie: true
  },
  {
    id: "m_4",
    title: "Synthetic Solitude Titles",
    year: "2026",
    genre: "Designer",
    description: "A gorgeous award-winning visual exploration of post-industrial brutalist monoliths mixed with neon cybernetic projection.",
    director: "Saman Farhad",
    rating: "9.1/10",
    backdropUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop&q=80",
    indie: false
  }
];

export const initialCreators: SakoCreator[] = [
  {
    id: "c-marcus",
    name: "Marcus Thorne",
    role: "Action Athlete & Cinematographer",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80",
    bio: "Specializing in high-intensity action sports cinematography. Former extreme freerider turned award-winning director of photography and action choreographer.",
    location: "Erbil, Kurdistan",
    rating: "4.9",
    views: 310,
    joinedDate: "Jan 2025",
    portfolio: [
      {
        id: "p-marcus-1",
        title: "Alpine Freeride Cinematic Epic",
        type: "video",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&fit=crop&q=80",
        description: "Behind-the-scenes extreme sports filming showcase."
      }
    ]
  },
  {
    id: "c-dara",
    name: "Dara Ahmad",
    role: "Lead Aerial Videographer",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80",
    bio: "Licensed commercial drone pilot and cinematic videographer. Capturing breathtaking mountain views, architectural symmetry, and dynamic sports layouts.",
    location: "Slemani, Kurdistan",
    rating: "5.0",
    views: 450,
    joinedDate: "Mar 2025",
    portfolio: [
      {
        id: "p-dara-1",
        title: "Kingdom in the Clouds",
        type: "image",
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&fit=crop&q=80",
        description: "Aerial cinematic series tracking mountainous autumn horizons."
      }
    ]
  },
  {
    id: "c-zara",
    name: "Zara Kamal",
    role: "Post-Production Film Editor",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80",
    bio: "Passionate about timing, narrative rhythm, and sensory auditory layers. Over 6 years of experience editing deep indie features, trailers, and color suites.",
    location: "Erbil, Kurdistan",
    rating: "4.8",
    views: 280,
    joinedDate: "Aug 2024",
    portfolio: [
      {
        id: "p-zara-1",
        title: "Subterranean Echoes Montage",
        type: "image",
        url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&fit=crop&q=80",
        description: "Atmospheric teaser trailer montage and dynamic visual cuts."
      }
    ]
  },
  {
    id: "c-saman",
    name: "Saman Farhad",
    role: "Visual Effects & Motif Designer",
    avatarUrl: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=400&fit=crop&q=80",
    bio: "Blending digital physical simulation with artistic layouts. Creative designer and title specialist handling volumetric particles, overlays, and cybernetic UI/UX motifs.",
    location: "Duhok, Kurdistan",
    rating: "5.0",
    views: 390,
    joinedDate: "Nov 2024",
    portfolio: [
      {
        id: "p-saman-1",
        title: "Synthetic Solitude UI Motifs",
        type: "image",
        url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop&q=80",
        description: "Minimalist interactive HUD overlay interface styles."
      }
    ]
  }
];

export const initialConversations: ChatConversation[] = [
  {
    id: "conv-marcus",
    creatorId: "c-marcus",
    creatorName: "Marcus Thorne",
    creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80",
    creatorRole: "Action Athlete & Cinematographer",
    unread: true,
    messages: [
      {
        id: "m-init-1",
        senderId: "c-marcus",
        text: "Hey! I saw your profile and loved your color editing options. Do you have slots open to grade our next Alpine snowreel?",
        timestamp: "02:14 PM"
      }
    ]
  }
];
