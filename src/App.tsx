import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Film, 
  Search, 
  Users, 
  MessageSquare, 
  Plus, 
  Send, 
  MapPin, 
  Star, 
  Eye, 
  Video, 
  X, 
  Edit, 
  CheckCircle,
  Globe,
  Briefcase,
  ChevronLeft,
  Sparkles
} from "lucide-react";
import { Movie, SakoCreator, SakoPortfolioItem, ChatConversation, ChatMessage } from "./types";
import { initialTrendingMovies, initialCreators, initialConversations } from "./data";

type Lang = "en" | "ckb";

const t = {
  en: {
    appLogo: "Krd Hub",
    tagline: "Cinematic Workspace",
    selectLang: "Select Language",
    selectLangSub: "Choose your workspace interface to discover films and connect with crew",
    enBtn: "English",
    ckbBtn: "کوردی (سۆرانی)",
    enterWorkspace: "Proceed to Workspace",
    navBiner: "Works",
    navSako: "Best Search",
    navChat: "Direct Messages",
    navMyProfile: "My Profile",
    featuredRelease: "Featured Release",
    trendingGlobal: "Trending Global",
    moodSearchTitle: "AI-Powered Mood Search",
    moodSearchSub: "Describe an atmosphere or prompt to find matching cinematic structures.",
    moodInputPlaceholder: "e.g., a dark neon cyberpunk suspense noir...",
    globalSearchTitle: "Global Search Directory",
    globalSearchInputPlaceholder: "Search movies, genres, opportunities, or crew...",
    noResults: "No results matched your search term.",
    searchCrewMatch: "Matched Crew Portfolio",
    searchMovieMatch: "Matched Movie Projects",
    viewProfile: "View Profile",
    messageCollaborator: "Message Collaborator",
    rating: "Rating",
    views: "Views",
    joinedSako: "Joined Krd Hub",
    bioTitle: "Biography",
    portfolioTitle: "High-Fidelity Portfolio",
    projectsUnit: "Projects",
    emptyPortfolio: "No portfolio items added yet.",
    dmFooterAction: "Direct Message",
    editProfileBtn: "Edit Profile Info",
    addAssetBtn: "Add Portfolio Asset",
    editHeading: "Edit Creator Identity",
    saveProfileBtn: "Save Profile",
    addAssetHeading: "Add High-Fi Workspace Asset",
    assetTitle: "Asset Title",
    assetUrl: "Visual URL (Unsplash or direct link)",
    assetDesc: "Short Description",
    aspectSelect: "Aspect Ratio",
    typeSelect: "Asset Type",
    typeImage: "High-Fi Image",
    typeVideo: "Showreel Link",
    aspectL: "Landscape (16:9)",
    aspectP: "Portrait (9:16)",
    aspectS: "Square (1:1)",
    cancel: "Cancel",
    addBtn: "Add to Portfolio",
    activeDms: "Active Threads",
    startChatting: "Select a conversation from the side menu or visit a creator profile to start chatting.",
    chatInputPlaceholder: "Type your production brief or message...",
    send: "Send",
    opportunityHeader: "Hiring Opportunity",
    whyMatchesHeader: "AI Matching Index",
    sysBroadcaster: "System Broadcaster",
    aiIndicator: "Gemini 3.5 Active",
    sysToastConn: "Connected to real-time sync stream.",
    sysToastMsg: "New real-time message from",
    sysToastProfile: "Creator profile updated:",
    sysToastPortfolio: "Portfolio item added by",
    sysToastSaved: "Profile saved & synced in Krd Hub!",
    sysToastAdded: "Asset published to portfolio!",
    hiring: "Hiring",
    indie: "Local Indie",
    globalPro: "Global Pro",
    quickPrompts: "Quick Prompts",
    runningRecommender: "Running Deep Recommender System",
    recommenderSub: "Analyzing cinematic structures & thematic relevance indices...",
    recommenderHint: "AI recommended matches loaded via smart dynamic index.",
    recommenderFail: "Failed to reach recommendation engine. Check connection.",
    regTitle: "Profile Registration",
    regSub: "Complete your Krd Hub identity to join the workspace.",
    regPhoto: "Photo",
    regName: "Name",
    regAge: "Age",
    regGender: "Gender",
    regGenderMale: "Male",
    regGenderFemale: "Female",
    regLocation: "Location",
    regWork: "Work",
    regBio: "Description",
    regSave: "Save Profile",
    regPhotoPlaceholder: "Drop image or enter direct photo URL...",
    regNamePlaceholder: "Alex Reed",
    regAgePlaceholder: "e.g., 27",
    regLocationPlaceholder: "e.g., Erbil, Kurdistan",
    regWorkPlaceholder: "e.g., Video Editor & Colorist",
    regBioPlaceholder: "Write a short summary about yourself...",
    regWelcome: "Welcome",
  },
  ckb: {
    appLogo: "Krd Hub",
    tagline: "مەکۆی کارکردنی سینەمایی",
    selectLang: "دیاریکردنی زمان",
    selectLangSub: "زمانی کارکردنی مەکۆکەت هەڵبژێرە بۆ گەڕان بەدوای فیلم و دۆزینەوەی ستاف",
    enBtn: "ئینگلیزی (English)",
    ckbBtn: "کوردی (سۆرانی)",
    enterWorkspace: "چوونە ناو مەکۆی کارکردن",
    navBiner: "کارەکان",
    navSako: "گەڕانی باشترین",
    navChat: "نامەکان",
    navMyProfile: "پڕۆفایلی من",
    featuredRelease: "بڵاوکراوەی سەرەکی",
    trendingGlobal: "دەنگدانەوەی جیهانی",
    moodSearchTitle: "گەڕانی کەشی فیلمەکان",
    moodSearchSub: "وەسفی کەش یان دروستکراوەیەک بکە بۆ دۆزینەوەی پێکهاتەی گونجاوی سینەمایی.",
    moodInputPlaceholder: "بۆ نموونە: فیلمێکی تاریکی سایبەرپەنک و نواری پڕ لە نهێنی...",
    globalSearchTitle: "نشینگەی گەڕانی گشتی",
    globalSearchInputPlaceholder: "بگەڕێ بۆ فیلم، ژانر، دەرفەتەکان یان ستاڤ...",
    noResults: "هیچ ئەنجامێک لەگەڵ پێوەری گەڕانەکەت ناگونجێت.",
    searchCrewMatch: "ستاڤی دۆزراوە",
    searchMovieMatch: "فیلمە دۆزراوەکان",
    viewProfile: "بینینی پڕۆفایل",
    messageCollaborator: "ناردنی نامە بۆ سینەماکار",
    rating: "هەڵسەنگاندن",
    views: "بینینەکان",
    joinedSako: "بەستراوە بە Krd Hub",
    bioTitle: "کورتەیەک دەربارەی من",
    portfolioTitle: "کارە هونەرییەکان (پۆرتفۆلیۆ)",
    projectsUnit: "پڕۆژەکان",
    emptyPortfolio: "هیچ کارێکی هونەری زیاد نەکراوە.",
    dmFooterAction: "نامەی ڕاستەوخۆ بنێرە",
    editProfileBtn: "دەستکاری زانیارییەکانی پڕۆفایل",
    addAssetBtn: "زیادکردنی کار لە پۆرتفۆلیۆ",
    editHeading: "دەستکاری ناسنامەی سینەماکار",
    saveProfileBtn: "پاشەکەوتکردنی پڕۆفایل",
    addAssetHeading: "زیادکردنی بەرهەمی کوالیتی بەرز",
    assetTitle: "ناونیشانی کار",
    assetUrl: "بەستەری وێنەی کار (Unsplash یان بەستەری ڕاستەوخۆ)",
    assetDesc: "کورتە وەسف",
    aspectSelect: "شێوازی پیشاندان",
    typeSelect: "جۆری بەرهەم",
    typeImage: "وێنەی کوالیتی بەرز",
    typeVideo: "بەستەری ڤیدیۆ (Showreel)",
    aspectL: "پاسکێپ (١٦:٩)",
    aspectP: "پۆرتریت (٩:١٦)",
    aspectS: "چوارگۆشە (١:١)",
    cancel: "پاشگەزبوونەوە",
    addBtn: "زیادکردن بۆ پۆرتفۆلیۆ",
    activeDms: "گفتوگۆکان",
    startChatting: "گفتوگۆیەک دیاری بکە بۆ دەستپێکردنی نامە ناردن بیبینە لە پڕۆفایلی ستاڤی کارەخان.",
    chatInputPlaceholder: "نامەکەت یان کورتەی پڕۆژەکەت لێرە بنووسە...",
    send: "بنێرە",
    opportunityHeader: "دەرفەتی هاوکاری",
    whyMatchesHeader: "پێوەری گونجانی ژیری دەستکرد",
    sysBroadcaster: "ڕاگەیەنەری گشتی",
    aiIndicator: "سیستەمی گەڕان چالاکە",
    sysToastConn: "پەیوەندی لەگەڵ سێرڤەری گەران زامن کرا.",
    sysToastMsg: "نامەیەکی نوێی ڕاستەوخۆ لەلایەن",
    sysToastProfile: "پڕۆفایلی سینەماکار نوێکرایەوە:",
    sysToastPortfolio: "بەرهەمێکی نوێ زیادکرا بەهۆی",
    sysToastSaved: "پڕۆفایلی تۆ بە سەرکەوتوویی نوێکرایەوە لە Krd Hub!",
    sysToastAdded: "بەرهەمەکەت بڵاوکرایەوە لە پۆرتفۆلیۆ!",
    hiring: "بڵاوکردنەوەی هەلی کار",
    indie: "فیلمی سەربەخۆ",
    globalPro: "بڵاوکراوەی جیهانی",
    quickPrompts: "کلیلەوانە خێراکان",
    runningRecommender: "سیستەمی پێشنیاری قوڵ کاردەکات",
    recommenderSub: "شیکردنەوەی پێکهاتەی تەوەرەیی پێشنیارەکان...",
    recommenderHint: "کار دەکات لە ڕێگەی پێوەرە پێشنیارکراوە زیرەکەکانەوە.",
    recommenderFail: "پەیوەندی لەگەڵ هاوشانکردنی ژیری دەستکرد سەرکەوتوو نەبوو.",
    regTitle: "تۆمارکردنی پڕۆفایل",
    regSub: "پڕۆفایلی کارکردنت لە مەکۆی Krd Hub تەواو بکە بە پێی زانیارییەکانت.",
    regPhoto: "وێنەی پڕۆفایل",
    regName: "ناو",
    regAge: "تەمەن",
    regGender: "ڕەگەز",
    regGenderMale: "نێر",
    regGenderFemale: "مێ",
    regLocation: "شوێن",
    regWork: "کار / پیشە",
    regBio: "کورتەیەک لە خۆیان",
    regSave: "پاشەکەوتکردن",
    regPhotoPlaceholder: "وێنەکە ڕابکێشە یان ناونیشانی وێنە بنووسە...",
    regNamePlaceholder: "ئالێکس ڕید",
    regAgePlaceholder: "بۆ نموونە: ٢٧",
    regLocationPlaceholder: "بۆ نموونە: هەولێر، کوردستان",
    regWorkPlaceholder: "بۆ نموونە: دەستکاری ڤیدیۆ / مۆنتاژکار",
    regBioPlaceholder: "بۆ نموونە: کورتەیەک دەربارەی کار و لێهاتوویییەکانت لێرە بنووسە...",
    regWelcome: "بەخێربێیت",
  }
};

export default function App() {
  // First Launch state
  const [lang, setLang] = useState<Lang | null>(() => {
    return localStorage.getItem("krdhub_lang") as Lang | null;
  });

  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    return localStorage.getItem("krdhub_registered") === "true";
  });

  const [regPhoto, setRegPhoto] = useState<string>("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&fit=crop&q=80");
  const [regName, setRegName] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regGender, setRegGender] = useState("male");
  const [regLocation, setRegLocation] = useState("");
  const [regWork, setRegWork] = useState("");
  const [regBio, setRegBio] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // File Upload Handlers (for profile photo registration)
  const handlePhotoFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast(lang === "en" ? "Please upload an image file." : "تکایە تەنها وێنە باربکە.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setRegPhoto(e.target.result as string);
        showToast(lang === "en" ? "Photo loaded successfully" : "وێنەکە بە سەرکەوتوویی بارکرا");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoFile(e.target.files[0]);
    }
  };

  const handleSaveRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast(lang === "en" ? "Please enter your name." : "تکایە ناوی خۆت بنووسە.");
      return;
    }

    const updatedProfile: SakoCreator = {
      ...myProfile,
      name: regName,
      avatarUrl: regPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&fit=crop&q=80",
      role: regWork.trim() || (lang === "en" ? "Film Creator" : "سازکەری فیلم"),
      location: regLocation.trim() || (lang === "en" ? "Erbil, Kurdistan" : "هەولێر، کوردستان"),
      bio: regBio.trim() || (lang === "en" ? "Krd Hub filmmaker." : "کاندیدی سینەماکاری لە Krd Hub."),
      age: regAge || "24",
      gender: regGender
    };

    setMyProfile(updatedProfile);
    
    // Sync with edit inputs too
    setEditName(regName);
    setEditAvatarUrl(regPhoto);
    setEditRole(updatedProfile.role);
    setEditLocation(updatedProfile.location);
    setEditBio(updatedProfile.bio);

    // Save registration details to local storage
    localStorage.setItem("krdhub_registered", "true");
    setIsRegistered(true);

    // Sync to back-end
    fetch("/api/creator/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProfile)
    })
      .then(() => {
        showToast(lang === "en" ? "Workspace Booted! Profile registered." : "مەکۆ دەستبەکار بوو! پڕۆفایل تۆمارکرا.");
      })
      .catch((err) => console.error("Sync failed:", err));
  };

  const [useDeviceFrame, setUseDeviceFrame] = useState(true);
  const [activeTab, setActiveTab] = useState<"biner" | "sako" | "chat" | "my-profile">("biner");

  // Synchronized and fully live data states
  const [creators, setCreators] = useState<SakoCreator[]>(initialCreators);
  const [trendingMovies] = useState<Movie[]>(initialTrendingMovies);
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);

  // Active interaction states
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [chatInputText, setChatInputText] = useState("");
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [moodSearchQuery, setMoodSearchQuery] = useState("");
  const [isMoodSearching, setIsMoodSearching] = useState(false);
  const [moodSearchResults, setMoodSearchResults] = useState<Movie[]>([]);
  const [moodSearchError, setMoodSearchError] = useState<string | null>(null);

  // Selection states
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  // Self Profile status
  const [myProfile, setMyProfile] = useState<SakoCreator>({
    id: "me",
    name: "Alex Reed",
    role: "Video Editor & Colorist",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&fit=crop&q=80",
    bio: "Passionate storyteller with an eye for dramatic lighting and seamless pacing. Let's create something legendary.",
    location: "Brooklyn, NY",
    rating: "5.0",
    views: 120,
    joinedDate: "May 2026",
    portfolio: [
      {
        id: "p_me_1",
        title: "Lost High-Fi Neon Horizon Teaser",
        type: "image",
        url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
        description: "Behind-the-scenes grading profile for independent production.",
        aspect: "landscape"
      }
    ]
  });

  // Editor detail models
  const [isEditingMyProfile, setIsEditingMyProfile] = useState(false);
  const [editName, setEditName] = useState(myProfile.name);
  const [editRole, setEditRole] = useState(myProfile.role);
  const [editLocation, setEditLocation] = useState(myProfile.location);
  const [editBio, setEditBio] = useState(myProfile.bio);
  const [editAvatarUrl, setEditAvatarUrl] = useState(myProfile.avatarUrl);

  // Portfolio publication models
  const [newPortTitle, setNewPortTitle] = useState("");
  const [newPortUrl, setNewPortUrl] = useState("");
  const [newPortDesc, setNewPortDesc] = useState("");
  const [newPortType, setNewPortType] = useState<"image" | "video">("image");
  const [newPortAspect, setNewPortAspect] = useState<"landscape" | "portrait" | "square">("landscape");
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);

  // Notification states
  const [notification, setNotification] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto Scroll Chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConvId, conversations]);

  // Sync state & connect Real-time Listeners (SSE)
  useEffect(() => {
    // Sync initial state from server index
    fetch("/api/initial-state")
      .then((res) => res.json())
      .then((data) => {
        if (data.creators) {
          setCreators(data.creators);
          const selfCreator = data.creators.find((c: SakoCreator) => c.id === "me" || c.id === " Alex Reed");
          if (selfCreator) {
            setMyProfile(selfCreator);
          }
        }
        if (data.conversations) {
          setConversations(data.conversations);
        }
      })
      .catch((e) => console.log("Failed to load initial sync state:", e));

    // Connect to SSE stream
    const eventSource = new EventSource("/api/realtime-stream");

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "CONNECTED") {
          console.log("Real-time synchronization connected.");
        } else if (payload.type === "PROFILE_UPDATED") {
          const updatedCreator = payload.data as SakoCreator;
          setCreators((prev) => {
            const index = prev.findIndex((c) => c.id === updatedCreator.id);
            if (index !== -1) {
              const copy = [...prev];
              copy[index] = updatedCreator;
              return copy;
            } else {
              return [...prev, updatedCreator];
            }
          });
          if (updatedCreator.id === "me" || updatedCreator.id === "Alex Reed" || updatedCreator.id === "c-me") {
            setMyProfile(updatedCreator);
          }
          if (updatedCreator.id !== "me") {
            showToast(`${t[lang || "en"].sysToastProfile} ${updatedCreator.name}`);
          }
        } else if (payload.type === "PORTFOLIO_ADDED") {
          const { creatorId, portfolioItem, views } = payload.data;
          setCreators((prev) => {
            return prev.map((c) => {
              if (c.id === creatorId) {
                const updatedPortfolio = [portfolioItem, ...c.portfolio];
                return { ...c, portfolio: updatedPortfolio, views };
              }
              return c;
            });
          });
          if (creatorId === "me" || creatorId === "Alex Reed") {
            setMyProfile((prev) => ({
              ...prev,
              portfolio: [portfolioItem, ...prev.portfolio],
              views
            }));
          } else {
            showToast(`${t[lang || "en"].sysToastPortfolio} ${creatorId}`);
          }
        } else if (payload.type === "MESSAGE_RECEIVED") {
          const { conversationId, conversation, message } = payload.data;
          setConversations((prev) => {
            const index = prev.findIndex((c) => c.id === conversationId);
            if (index !== -1) {
              const copy = [...prev];
              copy[index] = conversation;
              return copy;
            } else {
              return [conversation, ...prev];
            }
          });
          if (message.senderId !== "me") {
            showToast(`${t[lang || "en"].sysToastMsg} ${conversation.creatorName}`);
          }
        }
      } catch (err) {
        console.error("Error parsing real-time message:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [lang]);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const currentT = t[lang || "en"];
  const isRtl = lang === "ckb";

  // AI powered recommendation
  const handleMoodSearch = async (prompt: string) => {
    if (!prompt.trim()) return;
    setIsMoodSearching(true);
    setMoodSearchError(null);
    try {
      const response = await fetch("/api/mood-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.films) {
        setMoodSearchResults(data.films);
        showToast(data.isFallback ? currentT.recommenderHint : currentT.aiIndicator);
      } else {
        setMoodSearchError("Invalid search schema");
      }
    } catch (e) {
      console.error(e);
      setMoodSearchError(currentT.recommenderFail);
    } finally {
      setIsMoodSearching(false);
    }
  };

  // Switch language logic
  const handleSelectLanguage = (selected: Lang) => {
    localStorage.setItem("krdhub_lang", selected);
    setLang(selected);
    showToast(`Workspace initialized in ${selected === "en" ? "English" : "سۆرانی"}`);
  };

  // Launch Chat thread
  const handleStartDM = (creator: SakoCreator) => {
    const existing = conversations.find((c) => c.creatorId === creator.id);
    if (existing) {
      setActiveConvId(existing.id);
    } else {
      const newId = `conv-${creator.id}-${Date.now()}`;
      const firstMsg: ChatMessage = {
        id: `msg-welcome-${Date.now()}`,
        senderId: creator.id,
        text: currentT.welcomeChatMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const newConv: ChatConversation = {
        id: newId,
        creatorId: creator.id,
        creatorName: creator.name,
        creatorAvatar: creator.avatarUrl,
        creatorRole: creator.role,
        messages: [firstMsg],
        unread: false
      };

      setConversations([newConv, ...conversations]);
      setActiveConvId(newId);

      // Save on server for syncing
      fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: newId,
          message: firstMsg,
          creatorId: creator.id,
          creatorName: creator.name,
          creatorAvatar: creator.avatarUrl,
          creatorRole: creator.role
        })
      }).catch(err => console.error("Sync message failed:", err));
    }
    setActiveTab("chat");
    setSelectedCreatorId(null);
    showToast(`${currentT.sysToastMsg} ${creator.name}`);
  };

  const handleSendMessage = () => {
    if (!chatInputText.trim() || !activeConvId) return;

    const targetConv = conversations.find((c) => c.id === activeConvId);
    if (!targetConv) return;

    const msgId = `msg-me-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg: ChatMessage = {
      id: msgId,
      senderId: "me",
      text: chatInputText,
      timestamp
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );
    setChatInputText("");

    fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: activeConvId,
        message: newMsg,
        creatorId: targetConv.creatorId,
        creatorName: targetConv.creatorName,
        creatorAvatar: targetConv.creatorAvatar,
        creatorRole: targetConv.creatorRole
      })
    }).catch(err => console.error("Transmit chat failed:", err));
  };

  const handleSaveProfile = () => {
    const updated = {
      ...myProfile,
      name: editName,
      role: editRole,
      location: editLocation,
      bio: editBio,
      avatarUrl: editAvatarUrl
    };

    setMyProfile(updated);
    setIsEditingMyProfile(false);

    fetch("/api/creator/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })
      .then(() => showToast(currentT.sysToastSaved))
      .catch((e) => console.error("Creator sync failed:", e));
  };

  const handleAddPortfolioItem = () => {
    if (!newPortTitle.trim() || !newPortUrl.trim()) {
      showToast("Please supply at least a Title and direct Image URL.");
      return;
    }

    const newItem: SakoPortfolioItem = {
      id: `p_me_${Date.now()}`,
      title: newPortTitle,
      type: newPortType,
      url: newPortUrl,
      description: newPortDesc || undefined,
      aspect: newPortAspect
    };

    setMyProfile((p) => ({
      ...p,
      portfolio: [newItem, ...p.portfolio]
    }));
    setShowAddPortfolio(false);

    fetch("/api/creator/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creatorId: myProfile.id, portfolioItem: newItem })
    })
      .then(() => {
        showToast(currentT.sysToastAdded);
        setNewPortTitle("");
        setNewPortUrl("");
        setNewPortDesc("");
      })
      .catch((e) => console.error("Asset publishing failed:", e));
  };

  // Search logic
  const filteredMovies = trendingMovies.filter((m) => {
    const q = globalSearchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.genre.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q) ||
      (m.roleOpportunities && m.roleOpportunities.some((role) => role.toLowerCase().includes(q)))
    );
  });

  const filteredCreators = creators.filter((c) => {
    const q = globalSearchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    );
  });

  return (
    <AnimatePresence mode="wait">
      {!lang ? (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="w-full"
        >
          <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 relative select-none antialiased overflow-hidden">
            {/* Cinematic Backdrop blur */}
            <div className="absolute inset-0 bg-radial-at-t from-cyan-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />

            <div className="w-full max-w-md bg-[#090909] border border-gray-900 rounded-3xl p-8 space-y-8 text-center relative z-10 shadow-2xl shadow-cyan-950/20">
              <div className="space-y-3">
                <div className="inline-flex p-3.5 bg-cyan-950/60 rounded-2xl border border-cyan-800/40 mb-1">
                  <Film className="w-8 h-8 text-cyan-400" />
                </div>
                <h1 className="text-3xl font-black font-display tracking-wider uppercase text-white leading-none">
                  Krd <span className="text-cyan-400">Hub</span>
                </h1>
                <p className="text-[11px] uppercase tracking-widest font-mono text-cyan-400 font-bold">
                  Cinematic Production Studio
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-semibold text-gray-300">Select Language / زمانەکە دیاریبکە</h3>
                  <p className="text-xs text-gray-400">Please choose your preference to boot up the workspace</p>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  <button 
                    id="select-lang-en-btn"
                    onClick={() => handleSelectLanguage("en")}
                    className="w-full bg-gray-950 hover:bg-cyan-950/40 hover:border-cyan-400 border border-gray-800 rounded-xl py-3.5 px-4 font-bold transition-all flex items-center justify-between cursor-pointer group active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 group-hover:bg-cyan-400 group-hover:text-black transition-colors">EN</span>
                      <span className="text-sm font-medium tracking-wide">English</span>
                    </div>
                    <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                  </button>

                  <button 
                    id="select-lang-ckb-btn"
                    onClick={() => handleSelectLanguage("ckb")}
                    className="w-full bg-gray-950 hover:bg-cyan-950/40 hover:border-cyan-400 border border-gray-800 rounded-xl py-3.5 px-4 font-bold transition-all flex items-center justify-between cursor-pointer group active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 group-hover:bg-cyan-400 group-hover:text-black transition-colors">CKB</span>
                      <span className="text-sm font-semibold">کوردی (سۆرانی)</span>
                    </div>
                    <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">هەڵبژاردن</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-950">
                <p className="text-[10px] text-gray-600 font-mono">WORKSPACE APPBUILD V3.0 (REALTIME MULTIPLAYER READY)</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : !isRegistered ? (
        <motion.div
          key="registration"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="w-full"
        >
          <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-4 md:p-8 relative select-none antialiased overflow-y-auto" dir={isRtl ? "rtl" : "ltr"}>
            {/* Cinematic Backdrop blur */}
            <div className="absolute inset-0 bg-radial-at-t from-cyan-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />

            {/* Global locale switcher for registration screen */}
            <div className="absolute top-6 right-6 z-20">
              <button
                type="button"
                onClick={() => handleSelectLanguage(lang === "en" ? "ckb" : "en")}
                className="bg-[#0a0a0a]/95 hover:bg-cyan-950/50 border border-cyan-800/30 font-semibold py-1.5 px-4 rounded-full text-cyan-400 shadow-xl flex items-center gap-1.5 text-xs transition-all active:scale-95 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === "en" ? "کوردی (سۆرانی)" : "English"}</span>
              </button>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-lg bg-[#080808]/90 border border-gray-900 rounded-3xl p-6 md:p-8 space-y-6 relative z-10 shadow-2xl shadow-cyan-950/20 backdrop-blur-md my-8">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-cyan-950/40 rounded-2xl border border-cyan-800/20 text-cyan-400 mb-1">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black tracking-wide text-white font-display">
                  {currentT.regTitle}
                </h1>
                <p className="text-xs text-gray-400">
                  {currentT.regSub}
                </p>
              </div>

              <form onSubmit={handleSaveRegistration} className="space-y-5">
                {/* Custom Photo Upload supporting drag and drop or manual select */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                    {currentT.regPhoto}
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Live Preview Circle */}
                    <div className="relative shrink-0 w-20 h-20 rounded-full border border-cyan-500/30 overflow-hidden bg-gray-950 group">
                      <img 
                        src={regPhoto} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={() => setRegPhoto("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&fit=crop&q=80")}
                      />
                    </div>

                    {/* Drag-&-Drop Upload Area */}
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`flex-1 w-full p-4 border rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        dragActive 
                          ? "border-cyan-400 bg-cyan-950/20" 
                          : "border-gray-800 bg-[#0d0d0d] hover:border-cyan-800/50"
                      }`}
                      onClick={() => document.getElementById("profile-upload-file")?.click()}
                    >
                      <p className="text-xs text-cyan-400/80 font-medium">
                        {lang === "en" ? "Drag & drop file here or click to browse" : "وێنەکە ڕابکێشە ئێرە یان کرتە بکە بۆ گەڕان"}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {lang === "en" ? "PNG, JPG up to 5MB" : "PNG, JPG تا ٥ مێگابایت"}
                      </p>
                      <input 
                        id="profile-upload-file"
                        type="file" 
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden" 
                      />
                    </div>
                  </div>

                  {/* Photo Direct Link Input Box */}
                  <div className="space-y-1.5 mt-2">
                    <input 
                      type="text"
                      value={regPhoto}
                      onChange={(e) => setRegPhoto(e.target.value)}
                      placeholder={currentT.regPhotoPlaceholder}
                      className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-1.5 px-3 text-xs text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] text-gray-500 font-mono font-semibold">{lang === "en" ? "Quick Avatars:" : "وێنەی خێرا:"}</span>
                      {[
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                      ].map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRegPhoto(url)}
                          className="w-6 h-6 rounded-full overflow-hidden border border-gray-900 hover:border-cyan-400 transition-all cursor-pointer shrink-0"
                        >
                          <img src={url} alt="" className="w-full h-full object-cover pointer-events-none" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Grid Layout for Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                      {currentT.regName} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={currentT.regNamePlaceholder}
                      className="w-full bg-[#0c0c0c] hover:border-gray-800 border border-gray-900 rounded-xl py-2.5 px-4 text-sm text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>

                  {/* Age Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                      {currentT.regAge}
                    </label>
                    <input 
                      type="number"
                      value={regAge}
                      onChange={(e) => setRegAge(e.target.value)}
                      placeholder={currentT.regAgePlaceholder}
                      className="w-full bg-[#0c0c0c] hover:border-gray-800 border border-gray-900 rounded-xl py-2.5 px-4 text-sm text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>

                  {/* Gender Selection */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                      {currentT.regGender}
                    </label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full bg-[#0c0c0c] hover:border-gray-800 border border-gray-900 rounded-xl py-2.5 px-4 text-sm text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all cursor-pointer"
                    >
                      <option value="male">{currentT.regGenderMale}</option>
                      <option value="female">{currentT.regGenderFemale}</option>
                    </select>
                  </div>

                  {/* Location Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                      {currentT.regLocation}
                    </label>
                    <input 
                      type="text"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder={currentT.regLocationPlaceholder}
                      className="w-full bg-[#0c0c0c] hover:border-gray-800 border border-gray-900 rounded-xl py-2.5 px-4 text-sm text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Work / Role Input */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                    {currentT.regWork}
                  </label>
                  <input 
                    type="text"
                    value={regWork}
                    onChange={(e) => setRegWork(e.target.value)}
                    placeholder={currentT.regWorkPlaceholder}
                    className="w-full bg-[#0c0c0c] hover:border-gray-800 border border-gray-900 rounded-xl py-2.5 px-4 text-xs md:text-sm text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                {/* Bio / Description */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                    {currentT.regBio}
                  </label>
                  <textarea 
                    rows={3}
                    value={regBio}
                    onChange={(e) => setRegBio(e.target.value)}
                    placeholder={currentT.regBioPlaceholder}
                    className="w-full bg-[#0c0c0c] hover:border-gray-800 border border-gray-900 rounded-xl py-2.5 px-4 text-xs md:text-sm text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
                  />
                </div>

                {/* Submit / Proceed Button */}
                <button
                  type="submit"
                  className="w-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-900/60 font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-cyan-500/10 cursor-pointer active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 mt-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{currentT.regSave}</span>
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="min-h-screen bg-[#020202] text-gray-100 flex flex-col items-center justify-center lg:p-6 select-none relative overflow-x-hidden antialiased w-full"
          dir={isRtl ? "rtl" : "ltr"}
        >
      {/* Toast Notifier */}
      {notification && (
        <div id="toast-notif" className="fixed top-4 z-50 bg-[#0a0a0a] border-l-4 border-cyan-400 p-4 rounded-r shadow-xl max-w-sm flex items-start gap-3 shadow-cyan-950/20 animate-pulse">
          <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-white uppercase text-[10px] tracking-wider">{currentT.sysBroadcaster}</p>
            <p className="text-gray-300 mt-0.5">{notification}</p>
          </div>
        </div>
      )}

      {/* Language Switch Quick Toggle */}
      <div className="fixed bottom-4 right-4 z-40">
        <button 
          id="lang-quick-toggle"
          onClick={() => handleSelectLanguage(lang === "en" ? "ckb" : "en")}
          className="bg-black/90 hover:bg-cyan-950 border border-gray-800 p-2.5 rounded-full text-cyan-400 shadow-xl flex items-center gap-1.5 text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer"
          title="Switch Language"
        >
          <Globe className="w-4 h-4" />
          <span>{lang === "en" ? "کوردی" : "EN"}</span>
        </button>
      </div>

      <div className={`w-full flex items-stretch justify-center gap-8 ${useDeviceFrame ? "max-w-6xl" : "max-w-none"}`}>
        {/* Desktop Left Console panel */}
        {useDeviceFrame && (
          <div className="hidden lg:flex flex-col justify-between w-[480px] p-6 rounded-3xl bg-[#070707] border border-gray-900 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-cyan-950 px-2.5 py-1 text-cyan-400 rounded border border-cyan-800 text-xs font-mono font-bold">
                  {currentT.appLogo}
                </span>
                <span className="text-[11px] uppercase font-mono text-gray-500">{currentT.tagline}</span>
              </div>

              <div>
                <h1 className="text-3xl font-extrabold font-display text-white tracking-tight leading-none">
                  Krd Hub<br/>
                  <span className="text-cyan-400">Collaboration Space</span>
                </h1>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {lang === "en" ? 
                    "The ultimate cinematic application to explore stellar works and connect with the best crew in the ecosystem." :
                    "مەکۆی فەرمی Krd Hub بۆ دۆزینەوەی باشترین کارەکان و پەیوەندیکردن لەگەڵ لێهاتووترین ستافەکان."}
                </p>
              </div>

              <div className="bg-black/40 border border-gray-900 rounded-xl p-3.5 space-y-2">
                <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Server state integrations</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-black/60 p-2 rounded border border-gray-900">
                    <p className="text-gray-500">Gemini LLM model</p>
                    <p className="text-green-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
                      On stream / Active
                    </p>
                  </div>
                  <div className="bg-black/60 p-2 rounded border border-gray-900">
                    <p className="text-gray-500">Real-time sync listeners</p>
                    <p className="text-cyan-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full inline-block"></span>
                      SSE Connection ok
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-900">
              <span className="text-[10px] text-gray-500 font-mono block">Built for producers, film-directors, and sound-designers worldwide.</span>
            </div>
          </div>
        )}

        {/* Center: Mobile Device mockup frame */}
        <div 
          className={`w-full transition-all duration-300 relative ${
            useDeviceFrame 
              ? "max-w-[420px] h-[840px] border-[10px] border-gray-900 rounded-[48px] shadow-2xl bg-black flex flex-col overflow-hidden relative" 
              : "max-w-2xl min-h-screen bg-black flex flex-col shadow-none"
          }`}
        >
          {/* Bezel frame status bar */}
          {useDeviceFrame && (
            <div className="relative h-10 bg-black text-gray-400 text-xs px-6 flex items-center justify-between shrink-0 select-none border-b border-gray-950">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-black rounded-b-2xl z-10" />
              <div className="text-[11px] font-mono text-gray-400 font-bold z-20">11:04 AM</div>
              <div className="flex items-center gap-1.5 z-20 text-[10px]">
                <span className="text-[8px] bg-cyan-950 text-cyan-400 font-mono px-1 rounded border border-cyan-800">5G</span>
                <span className="w-4 h-2.5 border border-gray-600 rounded-sm relative inline-block">
                  <span className="absolute top-0.5 left-0.5 bottom-0.5 right-1.5 bg-cyan-400" />
                </span>
                <span className="text-[10px] font-mono text-cyan-400">LT</span>
              </div>
            </div>
          )}

          {/* Core app top bar */}
          <div className="bg-[#030303]/95 backdrop-blur-md px-4 py-3 border-b border-gray-900 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-cyan-400" />
              <span id="app-logo" className="text-md font-bold font-display uppercase tracking-widest text-white">
                {currentT.appLogo}
              </span>
            </div>
            
            <div className="flex items-center gap-1 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              {currentT.aiIndicator}
            </div>
          </div>

          {/* Main viewport */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative bg-[#030303] flex flex-col">
            {/* LIGHTBOX PREVIEW */}
            {activeLightboxImage && (
              <div 
                id="lightbox-overlay"
                className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 transition-all"
                onClick={() => setActiveLightboxImage(null)}
              >
                <button 
                  onClick={() => setActiveLightboxImage(null)}
                  className="absolute top-4 right-4 text-white bg-gray-900 border border-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-800 active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
                <img 
                  src={activeLightboxImage} 
                  className="w-full max-h-[70%] object-contain rounded-lg border-2 border-cyan-500/30 shadow-2xl" 
                  alt="Review asset"
                />
              </div>
            )}

            {/* CREATOR DETAILED DISPLAY VIEW */}
            <AnimatePresence mode="wait">
              {selectedCreatorId ? (
                <motion.div
                  key="creator-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="min-h-full flex flex-col"
                >
                  {(() => {
                    const targetCreator = creators.find((c) => c.id === selectedCreatorId);
                    if (!targetCreator) return null;
                    return (
                      <div className="min-h-full bg-[#030303] text-gray-100 flex flex-col pb-24 relative">
                    <div className="relative h-64 bg-slate-900 overflow-hidden">
                      {targetCreator.portfolio.length > 0 ? (
                        <img 
                          src={targetCreator.portfolio[0].url} 
                          className="w-full h-full object-cover blur-xs opacity-45 transform scale-110" 
                          alt="bg-blur"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#0a0a0a] to-cyan-950" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-black/80" />
                      
                      <button 
                        id="back-profile-btn"
                        onClick={() => setSelectedCreatorId(null)}
                        className={`absolute top-4 ${isRtl ? "right-4" : "left-4"} bg-black/70 hover:bg-black/90 p-2.5 rounded-full border border-gray-800 text-cyan-400 backdrop-blur-md transition-all active:scale-95`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
                        <div className="relative">
                          <img 
                            src={targetCreator.avatarUrl} 
                            className="w-20 h-20 rounded-xl object-cover border-2 border-cyan-400 bg-black"
                            alt={targetCreator.name}
                          />
                          <span className="absolute -bottom-1 -right-1 bg-cyan-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-black text-black inline" /> {targetCreator.rating}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono font-bold bg-cyan-950/75 px-2 py-0.5 rounded-md border border-cyan-500/30">
                            {targetCreator.role}
                          </span>
                          <h1 className="text-xl font-bold font-display text-white mt-1.5 truncate">
                            {targetCreator.name}
                          </h1>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
                            {targetCreator.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-0.5 border-y border-gray-900 bg-black/60 divide-x divide-gray-900 text-center py-2.5">
                      <div>
                        <p className="text-[10px] uppercase font-mono text-gray-500 tracking-wider font-semibold">{currentT.rating}</p>
                        <p className="text-sm font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" /> {targetCreator.rating}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-mono text-gray-500 tracking-wider font-semibold">{currentT.views}</p>
                        <p className="text-sm font-bold text-cyan-400 flex items-center justify-center gap-1 mt-0.5">
                          <Eye className="w-3.5 h-3.5 animate-pulse" /> {targetCreator.views}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-mono text-gray-500 tracking-wider font-semibold">{currentT.joinedSako}</p>
                        <p className="text-sm font-bold text-white mt-0.5">{targetCreator.joinedDate}</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 mb-1.5 text-left">{currentT.bioTitle}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed bg-[#0a0a0a] p-3 rounded-lg border border-gray-900 text-left">
                          {targetCreator.bio}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-semibold">{currentT.portfolioTitle}</h3>
                          <span className="text-[10px] font-mono text-gray-500 bg-gray-950 px-2 py-0.5 rounded border border-gray-900">
                            {targetCreator.portfolio.length} {currentT.projectsUnit}
                          </span>
                        </div>

                        {targetCreator.portfolio.length === 0 ? (
                          <div className="text-center py-8 bg-[#0a0a0a] border border-dashed border-gray-900 rounded-lg">
                            <p className="text-sm text-gray-500">{currentT.emptyPortfolio}</p>
                          </div>
                        ) : (
                          <div id="portfolio-grid" className="grid grid-cols-2 gap-3">
                            {targetCreator.portfolio.map((item) => (
                              <div 
                                id={`portfolio-item-${item.id}`}
                                key={item.id}
                                onClick={() => setActiveLightboxImage(item.url)}
                                className="group relative bg-[#0a0a0a] rounded-lg overflow-hidden border border-gray-900 cursor-pointer transition-all hover:border-cyan-400/50"
                              >
                                <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                                  <img 
                                    src={item.url} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                    alt={item.title}
                                  />
                                  {item.type === "video" && (
                                    <div className="absolute top-1 right-1 bg-black/80 text-cyan-400 p-1 rounded-md text-[9px] font-mono flex items-center gap-0.5">
                                      <Video className="w-3 h-3 text-cyan-400" /> PROFILER
                                    </div>
                                  )}
                                </div>
                                <div className="p-2 space-y-0.5 text-left">
                                  <h4 className="text-xs font-semibold text-gray-200 truncate group-hover:text-cyan-400 transition-colors">
                                    {item.title}
                                  </h4>
                                  {item.description && (
                                    <p className="text-[10px] text-gray-500 line-clamp-1">{item.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-2">
                      <button 
                        id="profile-dm-primary-btn"
                        onClick={() => handleStartDM(targetCreator)}
                        className="w-full bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border-2 border-cyan-400 py-3 rounded-lg font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
                      >
                        <MessageSquare className="w-4 h-4 fill-cyan-400" />
                        {currentT.dmFooterAction} {targetCreator.name.split(" ")[0]}
                      </button>
                    </div>
                  </div>
                );
              })()}
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full flex-grow flex flex-col"
                >
                {/* TAB BINER */}
                {activeTab === "biner" && (
                  <div className="p-4 space-y-6 flex-1 flex flex-col text-left">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">{currentT.featuredRelease}</h2>
                        <span className="text-[10px] text-gray-500 font-mono font-semibold">{currentT.trendingGlobal}</span>
                      </div>
                      
                      <div className="relative rounded-2xl overflow-hidden border border-gray-900 group aspect-[2.1/1] bg-slate-950">
                        <img 
                          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80" 
                          className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-all duration-500" 
                          alt="Dune banner"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-black/30" />
                        <div className="absolute inset-x-4 bottom-4 space-y-1">
                          <span className="bg-cyan-500 text-black font-extrabold text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded">
                            CHROMA NOIR
                          </span>
                          <h3 className="text-sm font-bold font-display text-white">Curator's Top Indie Selection</h3>
                          <p className="text-[10px] text-gray-300 line-clamp-1">Explore moody rain-slicked visual assets and cybernetic landscapes.</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Mood search panel */}
                    <div className="bg-[#070707] rounded-2xl p-4 border border-[#111111] space-y-3.5 shadow-md relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
                          <h2 className="text-xs uppercase font-mono tracking-widest text-[#00f0ff] font-bold">
                            {currentT.moodSearchTitle}
                          </h2>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        {currentT.moodSearchSub}
                      </p>

                      <div className="flex items-center gap-1 bg-black/60 rounded-xl p-1.5 border border-gray-900 focus-within:border-cyan-400/50">
                        <input 
                          id="mood-search-input"
                          type="text" 
                          placeholder={currentT.moodInputPlaceholder}
                          value={moodSearchQuery}
                          onChange={(e) => setMoodSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleMoodSearch(moodSearchQuery)}
                          className="flex-1 bg-transparent text-xs text-white px-2 focus:outline-none placeholder-gray-600"
                        />
                        <button 
                          id="submit-mood-search"
                          onClick={() => handleMoodSearch(moodSearchQuery)}
                          disabled={isMoodSearching}
                          className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 p-2 rounded-lg border border-cyan-400/30 transition-transform disabled:opacity-50 cursor-pointer shrink-0"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[9px] font-mono text-gray-500">{currentT.quickPrompts}:</span>
                        {[
                          "dark suspense thriller",
                          "neon cyberpunk noir",
                          "Nordic ambient foley"
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => {
                              setMoodSearchQuery(suggestion);
                              handleMoodSearch(suggestion);
                            }}
                            className="text-[9px] font-mono text-gray-400 bg-black hover:text-cyan-400 hover:border-cyan-400/35 border border-gray-900 rounded-md px-1.5 py-0.5 cursor-pointer"
                          >
                            #{suggestion}
                          </button>
                        ))}
                      </div>

                      {isMoodSearching && (
                        <div id="ai-loading-state" className="py-8 bg-black/40 rounded-xl border border-gray-900/50 flex flex-col items-center justify-center space-y-3.5 text-center">
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
                            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                          </div>
                          <div className="space-y-1 px-4">
                            <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase animate-pulse">{currentT.runningRecommender}</p>
                            <p className="text-[10px] text-gray-500">{currentT.recommenderSub}</p>
                          </div>
                        </div>
                      )}

                      {moodSearchError && (
                        <p className="text-[11px] text-red-400 bg-red-950/20 border border-red-900 p-2 rounded-lg">
                          {moodSearchError}
                        </p>
                      )}

                      {moodSearchResults.length > 0 && (
                        <div id="mood-results-box" className="space-y-4 pt-2 border-t border-gray-900/40">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-widest font-mono text-cyan-400 font-bold">{currentT.whyMatchesHeader}</span>
                            <button 
                              onClick={() => setMoodSearchResults([])}
                              className="text-[10px] font-mono text-gray-500 hover:text-gray-300 cursor-pointer"
                            >
                              {currentT.cancel}
                            </button>
                          </div>

                          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                            {moodSearchResults.map((movie, index) => (
                              <div key={index} className="bg-black/80 border border-[#1a1a1a] p-3 rounded-xl space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <span className="text-[8px] bg-cyan-950 border border-cyan-800 text-cyan-400 px-1 py-0.2 rounded uppercase font-mono font-bold mr-1.5">
                                      {movie.indie ? currentT.indie : currentT.globalPro}
                                    </span>
                                    <h4 className="text-xs font-bold text-white inline-block">
                                      {movie.title} ({movie.year})
                                    </h4>
                                  </div>
                                  <span className="text-[10px] font-mono text-gray-400">⭐ {movie.rating}</span>
                                </div>

                                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                                  {movie.description}
                                </p>

                                {movie.matchReason && (
                                  <div className="bg-cyan-950/25 border-l-2 border-cyan-400 px-2 py-1 space-y-0.5 rounded-r">
                                    <p className="text-[9px] uppercase font-mono tracking-widest text-cyan-400 font-bold">{currentT.whyMatchesHeader}</p>
                                    <p className="text-[10px] text-gray-300 leading-normal">{movie.matchReason}</p>
                                  </div>
                                )}

                                {movie.roleOpportunities && movie.roleOpportunities.length > 0 && (
                                  <div className="pt-2 border-t border-gray-900/60 flex flex-wrap gap-1 items-center">
                                    <span className="text-[9px] font-mono text-gray-500 mr-1 flex items-center gap-0.5">
                                      <Briefcase className="w-2.5 h-2.5" /> {currentT.opportunityHeader}:
                                    </span>
                                    {movie.roleOpportunities.map((roleOpt) => (
                                      <button
                                        key={roleOpt}
                                        onClick={() => {
                                          setActiveTab("sako");
                                          setGlobalSearchQuery(roleOpt);
                                          showToast(`Filtering crew collaborators for '${roleOpt}'`);
                                        }}
                                        className="text-[9px] font-mono text-cyan-400 hover:text-white bg-cyan-950/40 border border-cyan-900/50 rounded-md px-1.5 py-0.5 transition-colors cursor-pointer"
                                      >
                                        {roleOpt}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Directory search segment */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">{currentT.globalSearchTitle}</h2>
                      </div>

                      <div className="flex items-center gap-2 bg-[#070707] rounded-xl p-2 border border-[#111111] focus-within:border-cyan-400/40">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input 
                          id="global-search-input"
                          type="text" 
                          placeholder={currentT.globalSearchInputPlaceholder}
                          value={globalSearchQuery}
                          onChange={(e) => setGlobalSearchQuery(e.target.value)}
                          className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-gray-600"
                        />
                        {globalSearchQuery && (
                          <button onClick={() => setGlobalSearchQuery("")} className="text-gray-400 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {globalSearchQuery ? (
                        <div id="search-results-tab" className="space-y-4">
                          {filteredCreators.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider font-semibold">{currentT.searchCrewMatch} ({filteredCreators.length})</p>
                              <div className="grid grid-cols-1 gap-2">
                                {filteredCreators.map((creator) => (
                                  <div 
                                    key={creator.id} 
                                    onClick={() => setSelectedCreatorId(creator.id)}
                                    className="bg-[#090909] hover:bg-cyan-950/10 border border-gray-900 hover:border-cyan-500/30 p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all active:scale-99"
                                  >
                                    <div className="flex items-center gap-3">
                                      <img src={creator.avatarUrl} className="w-9 h-9 rounded-lg object-cover" alt="" />
                                      <div className="text-left">
                                        <h4 className="text-xs font-semibold text-white">{creator.name}</h4>
                                        <p className="text-[10px] text-cyan-400 font-mono">{creator.role}</p>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-500">{creator.location}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {filteredMovies.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-[10px] uppercase font-mono text-cyan-400 tracking-wider font-semibold">{currentT.searchMovieMatch} ({filteredMovies.length})</p>
                              <div className="grid grid-cols-1 gap-2">
                                {filteredMovies.map((movie) => (
                                  <div key={movie.id} className="bg-[#090909] p-3 rounded-xl border border-gray-900 space-y-1">
                                    <div className="flex justify-between items-center">
                                      <h4 className="text-xs font-bold text-white">{movie.title} ({movie.year})</h4>
                                      <span className="text-[10px] font-mono text-gray-400">⭐ {movie.rating}</span>
                                    </div>
                                    <p className="text-[10px] text-cyan-400 font-mono">{movie.genre}</p>
                                    <p className="text-xs text-gray-400 line-clamp-2">{movie.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {filteredCreators.length === 0 && filteredMovies.length === 0 && (
                            <p className="text-center py-6 text-xs text-gray-500">{currentT.noResults}</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                          <p className="text-[10px] uppercase font-mono tracking-widest text-[#00f0ff] font-bold">{currentT.trendingGlobal}</p>
                          <div className="grid grid-cols-1 gap-3">
                            {trendingMovies.map((movie) => (
                              <div key={movie.id} className="bg-black/60 border border-gray-900 p-3 rounded-xl flex gap-3 relative overflow-hidden">
                                <div className="space-y-1 flex-1">
                                  <span className="text-[8px] bg-cyan-950 text-cyan-400 px-1 py-0.2 rounded uppercase font-mono border border-cyan-800">
                                    {movie.indie ? currentT.indie : currentT.globalPro}
                                  </span>
                                  <h4 className="text-xs font-bold text-white mt-1">{movie.title} ({movie.year})</h4>
                                  <p className="text-[10px] text-cyan-400/90 font-mono">{movie.genre}</p>
                                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{movie.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB SAKO */}
                {activeTab === "sako" && (
                  <div className="p-4 space-y-6 flex-1 flex flex-col text-left">
                    <div className="space-y-1">
                      <h2 className="text-sm uppercase font-mono tracking-widest text-[#00f0ff] font-bold">{currentT.navSako}</h2>
                      <p className="text-xs text-gray-500">
                        {lang === "en" 
                          ? "Discover and book verified film artists, coordinators, and directors of photography." 
                          : "باشترین و بەناوبانگترین سینەماکاران، دەرهێنەران و وێنەگران بدۆزەرەوە."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {creators.map((c) => (
                        <div 
                          key={c.id} 
                          onClick={() => setSelectedCreatorId(c.id)}
                          className="bg-[#080808] border border-gray-900 rounded-xl overflow-hidden cursor-pointer transition-all hover:border-cyan-400/40 active:scale-98"
                        >
                          <div className="h-28 relative bg-slate-900">
                            {c.portfolio.length > 0 ? (
                              <img src={c.portfolio[0].url} className="w-full h-full object-cover" alt="" />
                            ) : null}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            <span className="absolute bottom-2 left-2 bg-[#020202]/85 border border-gray-800 backdrop-blur-xs text-[9px] font-mono text-cyan-400 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              ⭐ {c.rating}
                            </span>
                          </div>
                          
                          <div className="p-3 space-y-1 text-left relative">
                            <div className="absolute -top-6 right-3">
                              <img src={c.avatarUrl} className="w-10 h-10 rounded-lg border border-cyan-400 object-cover bg-black" alt="" />
                            </div>
                            <h4 className="text-xs font-bold text-white pt-1 truncate max-w-[70%]">{c.name}</h4>
                            <p className="text-[9px] text-cyan-400 font-mono font-medium truncate">{c.role}</p>
                            <p className="text-[10px] text-gray-500 flex items-center gap-0.5 truncate">
                              <MapPin className="w-3 h-3 text-cyan-400/80 shrink-0" /> {c.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CHAT */}
                {activeTab === "chat" && (
                  <div className="flex-1 flex flex-row h-full min-h-0 divide-x divide-gray-900">
                    {/* Conversations Sidebar List */}
                    <div className="w-24 shrink-0 flex flex-col bg-black/40 py-2 divide-y divide-gray-950 overflow-y-auto no-scrollbar">
                      <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest pb-2 text-center">{currentT.activeDms}</p>
                      {conversations.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setActiveConvId(c.id)}
                          className={`w-full py-4 px-1 flex flex-col items-center justify-center transition-colors relative cursor-pointer ${activeConvId === c.id ? "bg-cyan-950/20 text-cyan-400" : "text-gray-400 hover:text-white"}`}
                        >
                          <div className="relative">
                            <img src={c.creatorAvatar} className="w-9 h-9 rounded-lg object-cover border border-gray-900" alt="" />
                            {c.unread && (
                              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-black animate-ping" />
                            )}
                          </div>
                          <span className="text-[9px] font-bold mt-1.5 truncate max-w-full text-center px-1 text-gray-200">{c.creatorName.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>

                    {/* Chat Window Panel */}
                    <div className="flex-1 flex flex-col bg-black/60 relative">
                      {activeConvId ? (
                        (() => {
                          const activeConv = conversations.find((c) => c.id === activeConvId);
                          if (!activeConv) return null;
                          return (
                            <div className="flex-1 flex flex-col min-h-0">
                              {/* Thread top banner */}
                              <div className="px-4 py-2 bg-black border-b border-gray-950 flex items-center justify-between shrink-0">
                                <div className="text-left">
                                  <h4 className="text-xs font-bold text-white leading-tight">{activeConv.creatorName}</h4>
                                  <p className="text-[9px] font-mono text-cyan-400">{activeConv.creatorRole}</p>
                                </div>
                              </div>

                              {/* Message bubble track */}
                              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar max-h-[580px]">
                                {activeConv.messages.map((m) => {
                                  const isMe = m.senderId === "me";
                                  return (
                                    <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                      <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-xs text-left ${isMe ? "bg-cyan-950/70 text-cyan-400 border border-cyan-500/20 rounded-tr-none" : "bg-gray-950 text-gray-300 border border-gray-900 rounded-tl-none"}`}>
                                        <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                                      </div>
                                      <span className="text-[8px] font-mono text-gray-500 mt-1 uppercase tracking-wider">{m.timestamp}</span>
                                    </div>
                                  );
                                })}
                                <div ref={chatBottomRef} />
                              </div>

                              {/* Chat typing field */}
                              <div className="p-3 bg-[#060606] border-t border-gray-950 shrink-0">
                                <div className="flex items-center gap-2 bg-black rounded-xl p-1.5 border border-gray-900 focus-within:border-cyan-400/40">
                                  <input 
                                    type="text" 
                                    placeholder={currentT.chatInputPlaceholder}
                                    value={chatInputText}
                                    onChange={(e) => setChatInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    className="flex-1 bg-transparent text-xs text-white px-2 focus:outline-none placeholder-gray-600"
                                  />
                                  <button 
                                    onClick={handleSendMessage}
                                    className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 p-2 rounded-lg border border-cyan-400/20 cursor-pointer"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                          <MessageSquare className="w-8 h-8 text-cyan-400 opacity-50 animate-bounce" />
                          <p className="text-xs text-gray-400 leading-relaxed max-w-xs">{currentT.startChatting}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB MY PROFILE */}
                {activeTab === "my-profile" && (
                  <div className="p-4 space-y-6 flex-1 flex flex-col text-left pb-24">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm uppercase font-mono tracking-widest text-[#00f0ff] font-bold">{currentT.navMyProfile}</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditingMyProfile(!isEditingMyProfile)}
                          className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 py-1.5 px-3 rounded-lg text-xs font-bold font-mono uppercase tracking-wider border border-cyan-800/40 cursor-pointer flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          {currentT.editProfileBtn}
                        </button>
                        <button
                          onClick={() => setShowAddPortfolio(true)}
                          className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 py-1.5 px-3 rounded-lg text-xs font-bold font-mono uppercase tracking-wider border border-cyan-800/40 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {currentT.addAssetBtn}
                        </button>
                      </div>
                    </div>

                    {/* MODAL EDIT PROFILE */}
                    {isEditingMyProfile && (
                      <div className="bg-[#090909] border border-cyan-400/20 p-4 rounded-xl space-y-4">
                        <h4 className="text-xs font-mono tracking-wider uppercase text-cyan-400 font-bold">{currentT.editHeading}</h4>
                        <div className="grid grid-cols-1 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.name}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2 border border-gray-900 text-white focus:outline-none" value={editName} onChange={(e) => setEditName(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.role}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2 border border-gray-900 text-white focus:outline-none" value={editRole} onChange={(e) => setEditRole(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.location}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2 border border-gray-900 text-white focus:outline-none" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.bioTitle}</label>
                            <textarea className="w-full bg-black rounded-lg p-2 border border-gray-900 text-white focus:outline-none h-20" value={editBio} onChange={(e) => setEditBio(e.target.value)} />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setIsEditingMyProfile(false)} className="px-3 py-1.5 rounded-lg text-xs bg-gray-950 hover:bg-gray-900 font-mono cursor-pointer">{currentT.cancel}</button>
                          <button onClick={handleSaveProfile} className="px-3 py-1.5 rounded-lg text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 font-mono font-semibold cursor-pointer">{currentT.saveProfileBtn}</button>
                        </div>
                      </div>
                    )}

                    {/* MODAL ADD PORTFOLIO ASSET */}
                    {showAddPortfolio && (
                      <div className="bg-[#090909] border border-cyan-400/20 p-4 rounded-xl space-y-4">
                        <h4 className="text-xs font-mono tracking-wider uppercase text-cyan-400 font-bold">{currentT.addAssetHeading}</h4>
                        <div className="grid grid-cols-1 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.assetTitle}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2 border border-gray-900 text-white focus:outline-none" placeholder="Lost Neon Studio still" value={newPortTitle} onChange={(e) => setNewPortTitle(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.assetUrl}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2 border border-gray-900 text-white focus:outline-none" placeholder="https://images.unsplash.com/..." value={newPortUrl} onChange={(e) => setNewPortUrl(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.assetDesc}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2 border border-gray-900 text-white focus:outline-none" placeholder="Rec.709 color suite test" value={newPortDesc} onChange={(e) => setNewPortDesc(e.target.value)} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-gray-500 font-mono font-medium">{currentT.typeSelect}</label>
                              <select className="w-full bg-black rounded-lg p-2 border border-gray-900 text-white focus:outline-none" value={newPortType} onChange={(e) => setNewPortType(e.target.value as any)}>
                                <option value="image">{currentT.typeImage}</option>
                                <option value="video">{currentT.typeVideo}</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-gray-500 font-mono font-medium">{currentT.aspectSelect}</label>
                              <select className="w-full bg-black rounded-lg p-2 border border-gray-900 text-white focus:outline-none" value={newPortAspect} onChange={(e) => setNewPortAspect(e.target.value as any)}>
                                <option value="landscape">{currentT.aspectL}</option>
                                <option value="portrait">{currentT.aspectP}</option>
                                <option value="square">{currentT.aspectS}</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setShowAddPortfolio(false)} className="px-3 py-1.5 rounded-lg text-xs bg-gray-950 hover:bg-gray-900 font-mono cursor-pointer">{currentT.cancel}</button>
                          <button onClick={handleAddPortfolioItem} className="px-3 py-1.5 rounded-lg text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 font-mono font-semibold cursor-pointer">{currentT.addBtn}</button>
                        </div>
                      </div>
                    )}

                    {/* Self profile layout rendering */}
                    <div className="space-y-4">
                      <div className="bg-[#080808] border border-gray-900 rounded-xl p-4 flex gap-4 items-center">
                        <img src={myProfile.avatarUrl} className="w-14 h-14 rounded-lg object-cover border border-cyan-400 bg-black" alt="" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] uppercase tracking-wider font-mono text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/20">{myProfile.role}</span>
                          <h3 className="text-md font-bold text-white mt-1 truncation">{myProfile.name}</h3>
                          <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5 leading-none">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
                            {myProfile.location}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] font-mono text-gray-500">{currentT.views}</p>
                          <p className="text-sm font-bold font-mono text-cyan-400">{myProfile.views}</p>
                        </div>
                      </div>

                      <div className="bg-black/40 border border-gray-900 p-3.5 rounded-xl space-y-1.5">
                        <h4 className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold">{currentT.bioTitle}</h4>
                        <p className="text-xs text-gray-300 leading-relaxed font-normal">{myProfile.bio}</p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold">{currentT.portfolioTitle}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {myProfile.portfolio.map((item) => (
                            <div 
                              key={item.id} 
                              onClick={() => setActiveLightboxImage(item.url)}
                              className="group bg-[#080808] border border-gray-900 rounded-lg overflow-hidden cursor-pointer relative"
                            >
                              <div className="aspect-video relative overflow-hidden bg-black">
                                <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-all" alt="" />
                                {item.type === "video" && (
                                  <span className="absolute top-1 right-1 bg-black/80 text-cyan-400 px-1 rounded text-[8px] font-mono">SHOWREEL</span>
                                )}
                              </div>
                              <div className="p-2 space-y-0.5">
                                <h5 className="text-xs font-semibold text-gray-200 truncate">{item.title}</h5>
                                {item.description && <p className="text-[9.5px] text-gray-500 truncate">{item.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* App primary bottom bar */}
          <div className="bg-[#030303] border-t border-gray-900 h-16 shrink-0 flex items-stretch justify-around relative z-10">
            <button 
              id="nav-tab-biner"
              onClick={() => {
                setActiveTab("biner");
                setSelectedCreatorId(null);
              }}
              className={`flex-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${activeTab === "biner" ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
            >
              <Film className="w-5 h-5" />
              <span className="text-[9px] font-mono font-bold mt-1 uppercase tracking-widest">{currentT.navBiner}</span>
            </button>

            <button 
              id="nav-tab-sako"
              onClick={() => {
                setActiveTab("sako");
                setSelectedCreatorId(null);
              }}
              className={`flex-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${activeTab === "sako" ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[9px] font-mono font-bold mt-1 uppercase tracking-widest">{currentT.navSako}</span>
            </button>

            <button 
              id="nav-tab-chat"
              onClick={() => {
                setActiveTab("chat");
                setSelectedCreatorId(null);
              }}
              className={`flex-1 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${activeTab === "chat" ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[9px] font-mono font-bold mt-1 uppercase tracking-widest">{lang === "en" ? "Chat" : "نامەکان"}</span>
              {conversations.some(c => c.unread) && (
                <span className="absolute top-3 right-8 w-2 h-2 bg-cyan-400 rounded-full" />
              )}
            </button>

            <button 
              id="nav-tab-my-profile"
              onClick={() => {
                setActiveTab("my-profile");
                setSelectedCreatorId(null);
              }}
              className={`flex-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${activeTab === "my-profile" ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[9px] font-mono font-bold mt-1 uppercase tracking-widest">{lang === "en" ? "Profile" : "من"}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
    )}
  </AnimatePresence>
  );
}
