export interface Movie {
  id: string;
  title: string;
  year: string;
  genre: string;
  description: string;
  director: string;
  rating: string;
  backdropUrl?: string;
  indie: boolean;
  roleOpportunities?: string[];
  matchReason?: string;
  createdAt?: number; // Dynamic relative time
  tags?: string[];
}

export interface SakoPortfolioItem {
  id: string;
  title: string;
  type: "image" | "video";
  url: string;
  description?: string;
  aspect?: "landscape" | "portrait" | "square";
}

export interface SakoCreator {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  location: string;
  rating: string;
  views: number;
  joinedDate: string;
  portfolio: SakoPortfolioItem[];
  age?: string | number;
  gender?: string;
}

export interface ChatMessage {
  id: string;
  senderId: "me" | string; // 'me' is current user, otherwise creator's id
  text: string;
  timestamp: string; // Formatting localized time
  mediaUrl?: string; // Optional image or video attachment
  mediaType?: "image" | "video";
  liveLocation?: {
    lat: number;
    lng: number;
    expiresAt: number; // UTC time in ms
  };
}

export interface ChatConversation {
  id: string;
  creatorId: string; // For groups, can be a group key
  creatorName: string;
  creatorAvatar: string;
  creatorRole: string;
  messages: ChatMessage[];
  unread: boolean;
  isGroup?: boolean;
  groupMembers?: string[]; // IDs of creators in group
}
