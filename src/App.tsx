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
  Apple,
  Mail,
  Chrome, 
  Facebook,
  Edit, 
  CheckCircle,
  Globe,
  Briefcase,
  ChevronLeft,
  Sparkles,
  Camera,
  Clapperboard,
  Heart,
  Image as ImageIcon,
  Navigation,
  Volume2,
  VolumeX,
  UserPlus,
  UserCheck,
  Share2,
  Trash2,
  Settings
} from "lucide-react";
import { Movie, SakoCreator, SakoPortfolioItem, ChatConversation, ChatMessage } from "./types";
import { initialTrendingMovies, initialCreators, initialConversations } from "./data";

type Lang = "en" | "ckb";

interface LocationBubbleProps {
  lat: number;
  lng: number;
  expiresAt: number;
  lang: "en" | "ckb";
}

const LiveLocationBubble: React.FC<LocationBubbleProps> = ({ lat, lng, expiresAt, lang }) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, timeLeft]);

  const isExpired = timeLeft <= 0;

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-1.5 p-1 w-44 text-xs font-mono text-left">
      <div className="flex items-center gap-1.5 border-b border-gray-950 pb-1 mb-1 justify-between">
        <span className="flex items-center gap-1 text-[9px] font-bold text-cyan-400">
          <span className={`w-1.5 h-1.5 rounded-full ${isExpired ? "bg-red-500" : "bg-cyan-400 animate-pulse"}`} />
          {isExpired 
            ? (lang === "en" ? "EXPIRED" : "بەسەرچوو") 
            : (lang === "en" ? "LIVE LOCATION" : "شوێنی ڕاستەوخۆ")}
        </span>
        {!isExpired && (
          <span className="text-red-400 text-[9px] font-bold bg-red-950/40 px-1 py-0.5 rounded border border-red-900/30">
            {formatTime(timeLeft)}
          </span>
        )}
      </div>
      
      {!isExpired ? (
        <div className="space-y-1 bg-black/40 p-1.5 rounded border border-cyan-950/40">
          <div className="flex items-center gap-1 text-gray-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div>
              <p className="text-[9px] text-gray-400">Lat: {lat.toFixed(4)}</p>
              <p className="text-[9px] text-gray-400">Lng: {lng.toFixed(4)}</p>
            </div>
          </div>
          <div className="text-[8px] text-cyan-400/85 animate-pulse text-center uppercase tracking-wider font-bold">
            📡 {lang === "en" ? "Transmitting GPS..." : "سیگنال ناردرا..."}
          </div>
        </div>
      ) : (
        <div className="p-1 px-1.5 bg-gray-950 rounded text-center text-gray-600 border border-gray-900 text-[8px] uppercase tracking-wider font-bold">
          🔒 {lang === "en" ? "Signal Expired" : "سیگناڵ بڕا"}
        </div>
      )}
    </div>
  );
};

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
    moodSearchTitle: "AI Cinematic Creative Partner",
    moodSearchSub: "Ask for movie ideas, film concepts, script feedback, or identify movies from vague plots contextually.",
    moodInputPlaceholder: "Ask anything, e.g., 'Identify a movie about space docking with rotating scene' or 'Give me a sci-fi idea'...",
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
    moodSearchTitle: "هاوبەشی داهێنەری سینەمایی AI",
    moodSearchSub: "وەسفی کەش یان چیرۆکێک بکە بۆ دۆزینەوەی فیلم، فیدباکی نووسین، فێربوونی بیرۆکە بە سۆرانی ناوازە.",
    moodInputPlaceholder: "پرسیار بکە، بۆ نموونە: 'پێشنیاری فیلمێکی نهێنی ئامێز بکە' یان 'فیدباک بۆ ئەم کورتە چیرۆکە بدە'...",
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

interface InstagramReelCardProps {
  key?: any;
  reel: any;
  lang: "en" | "ckb" | null;
  followingIds: string[];
  setFollowingIds: React.Dispatch<React.SetStateAction<string[]>>;
  setReels: React.Dispatch<React.SetStateAction<any[]>>;
  creators: SakoCreator[];
  setCreators: React.Dispatch<React.SetStateAction<SakoCreator[]>>;
  handleStartDM: (creator: SakoCreator) => void;
  setChatInputText: (text: string) => void;
  activeReelCommentsId: string | null;
  setActiveReelCommentsId: (id: string | null) => void;
  newReelComment: string;
  setNewReelComment: (text: string) => void;
  myProfile: any;
  showToast: (msg: string) => void;
}

function InstagramReelCard({
  reel,
  lang,
  followingIds,
  setFollowingIds,
  setReels,
  creators,
  setCreators,
  handleStartDM,
  setChatInputText,
  activeReelCommentsId,
  setActiveReelCommentsId,
  newReelComment,
  setNewReelComment,
  myProfile,
  showToast
}: InstagramReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayStateIndicator, setShowPlayStateIndicator] = useState<"play" | "pause" | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Fallback if autoplay is blocked
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setShowPlayStateIndicator(!isPlaying ? "play" : "pause");
    setTimeout(() => {
      setShowPlayStateIndicator(null);
    }, 600);
  };

  const handleShareReel = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: reel.title,
          text: reel.desc,
          url: window.location.href
        });
        showToast(lang === "en" ? "Shared successfully!" : "بە سەرکەوتوویی هاوبەش کرا!");
      } catch (e) {
        console.log("Share skipped or failed", e);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast(lang === "en" ? "Reel link copied to clipboard!" : "بەستەری ڤیدیۆکە کۆپی کرا!");
      } catch (err) {
        showToast(lang === "en" ? "Failed to copy link" : "کۆپیکردن سەرکەوتوو نەبوو");
      }
    }
  };

  const hasCommentsActive = activeReelCommentsId === reel.id;

  const placeholderUrl = reel.id === "reel_1" 
    ? "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=400&q=40"
    : reel.id === "reel_2"
    ? "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=400&q=40"
    : "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=40";

  return (
    <div className="w-full h-full snap-start relative bg-black flex flex-col justify-end overflow-hidden">
      {/* Video Stream Element */}
      <div className="absolute inset-0 w-full h-full z-10 cursor-pointer select-none" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={reel.videoUrl}
          loop
          muted
          autoPlay
          playsInline
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => {
            setIsBuffering(false);
            setIsLoaded(true);
          }}
          onCanPlay={() => setIsLoaded(true)}
          onLoadedData={() => setIsLoaded(true)}
          className="w-full h-full object-contain bg-black"
        />
      </div>

      {/* Play/Pause state HUD overlay feedback */}
      {showPlayStateIndicator && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-ping">
          <div className="bg-black/80 p-5 rounded-full border border-cyan-400/30 text-cyan-400">
            {showPlayStateIndicator === "play" ? (
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Seamless Blurred Loader Shimmer Proxy */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out z-20 ${
          isLoaded && !isBuffering ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <img 
          src={placeholderUrl} 
          className="w-full h-full object-cover filter blur-xl scale-110 brightness-[0.4]"
          alt=""
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 border-r-cyan-400/60 animate-spin" />
            <div className="absolute w-10 h-10 rounded-full border-4 border-cyan-800/10 border-b-cyan-500/80 border-l-cyan-500/40 animate-spin" style={{ animationDirection: 'reverse' }} />
            <Clapperboard className="absolute w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <span className="text-[10px] font-mono text-cyan-400 tracking-widest font-bold mt-4 uppercase animate-pulse">
            {lang === "en" ? "Streaming Proxy..." : "بۆردکاردی ڤیدیۆ..."}
          </span>
          <span className="text-[8px] font-mono text-gray-500 uppercase mt-1 tracking-wider">
            REC.709 GRADING ENGINE
          </span>
        </div>
      </div>

      {/* BOTTOM GRADIENT OVERLAY (increases readability of profile information) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/25 z-20 pointer-events-none" />

      {/* OVERLAY SECTION - BOTTOM LEFT Profile info */}
      <div className="absolute bottom-6 left-4 right-16 z-30 flex flex-col items-start gap-2 text-left p-2.5 rounded-xl max-w-[75%] pointer-events-auto">
        <div className="flex items-center gap-2">
          <img 
            src={reel.creatorAvatar} 
            className="w-9 h-9 rounded-full object-cover border-2 border-cyan-400 bg-black/80 shadow-md" 
            alt="" 
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-xs font-bold text-white shadow-sm leading-none">{reel.creatorName}</h4>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const isFollowing = followingIds.includes(reel.creatorId);
                  if (isFollowing) {
                    setFollowingIds(prev => prev.filter(id => id !== reel.creatorId));
                    showToast(lang === "en" ? `Unfollowed @${reel.creatorId}` : `فۆڵۆوت لادا بۆ @${reel.creatorId}`);
                  } else {
                    setFollowingIds(prev => [...prev, reel.creatorId]);
                    showToast(lang === "en" ? `Following @${reel.creatorId}!` : `فۆڵۆوت کرد @${reel.creatorId}!`);
                  }
                }}
                className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-extrabold uppercase tracking-wider transition-all border ${
                  followingIds.includes(reel.creatorId)
                    ? "bg-gray-900/90 border-gray-800 text-gray-500"
                    : "bg-cyan-500 border-cyan-400 text-black hover:bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                }`}
              >
                {followingIds.includes(reel.creatorId) 
                  ? (lang === "en" ? "Following" : "فۆڵۆو کراوە") 
                  : (lang === "en" ? "Follow" : "فۆڵۆو")}
              </button>
            </div>
            <span className="text-[9.5px] font-mono text-cyan-400 leading-none">@{reel.creatorId}</span>
          </div>
        </div>
        
        <div>
          <h5 className="text-[11px] font-bold text-white tracking-wide leading-tight mb-1">{reel.title}</h5>
          <p className="text-[10px] text-gray-300 leading-normal line-clamp-2 max-w-xs">{reel.desc}</p>
        </div>
      </div>

      {/* OVERLAY SECTION - SIDE ACTION BAR (BOTTOM RIGHT) */}
      <div className="absolute right-3 bottom-6 flex flex-col gap-3.5 z-30 items-center">
        {/* Like Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setReels(prev => prev.map(r => {
              if (r.id === reel.id) {
                return {
                  ...r,
                  likes: r.liked ? r.likes - 1 : r.likes + 1,
                  liked: !r.liked
                };
              }
              return r;
            }));
          }}
          className="flex flex-col items-center justify-center bg-black/60 hover:bg-black/95 p-2 rounded-full border border-gray-800 text-white cursor-pointer transition-all hover:scale-110 active:scale-90 shadow-2xl w-10 h-10"
        >
          <Heart className={`w-4.5 h-4.5 transition-colors ${reel.liked ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
          <span className="text-[8px] font-mono font-bold mt-0.5 text-gray-300">{reel.likes}</span>
        </button>

        {/* Comment Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setActiveReelCommentsId(hasCommentsActive ? null : reel.id);
          }}
          className="flex flex-col items-center justify-center bg-black/60 hover:bg-black/95 p-2 rounded-full border border-gray-800 text-white cursor-pointer transition-all hover:scale-110 active:scale-90 shadow-2xl w-10 h-10"
        >
          <MessageSquare className="w-4.5 h-4.5 text-cyan-400" />
          <span className="text-[8px] font-mono font-bold mt-0.5 text-gray-300">{reel.comments.length}</span>
        </button>

        {/* Share Button (Native/Clipboard) */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleShareReel();
          }}
          className="flex flex-col items-center justify-center bg-black/60 hover:bg-black/95 p-2 rounded-full border border-gray-800 text-white cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-2xl w-10 h-10"
          title="Share Reel"
        >
          <Share2 className="w-4.5 h-4.5 text-green-400" />
          <span className="text-[8px] font-mono font-bold mt-0.5 text-gray-300 uppercase tracking-tighter">{lang === "en" ? "Share" : "بنێرە"}</span>
        </button>

        {/* Meet/DM Shortcut */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            let matchedCr = creators.find(c => c.name.toLowerCase() === reel.creatorName.toLowerCase());
            if (!matchedCr) {
              matchedCr = {
                id: reel.creatorId,
                name: reel.creatorName,
                role: "Cinematographer",
                avatarUrl: reel.creatorAvatar,
                bio: "Cinematic reel creator",
                location: "Sulaymaniyah, Kurdistan",
                rating: "5.0",
                views: 180,
                joinedDate: "May 2026",
                portfolio: []
              };
              setCreators(prev => [...prev, matchedCr!]);
            }
            handleStartDM(matchedCr);
            
            setTimeout(() => {
              setChatInputText(lang === "en" 
                ? `Loved your cinematic reel: "${reel.title}"! Let's collaborate model setups.` 
                : `بێگومان ڤیدیۆکەتم زۆر بەلاوە سەرنجڕاکێش بوو: "${reel.title}"! با پێکەوە کار بکەین.`);
            }, 200);
          }}
          className="flex flex-col items-center justify-center bg-cyan-950/80 hover:bg-cyan-900 p-2 rounded-full border border-cyan-800/40 text-cyan-400 cursor-pointer transition-all hover:scale-110 active:scale-90 shadow-2xl w-10 h-10"
          title="Connect DM"
        >
          <Send className="w-4 h-4 text-cyan-400" />
          <span className="text-[8px] font-mono font-bold mt-0.5 text-cyan-400 uppercase tracking-tighter">{lang === "en" ? "DM" : "نامە"}</span>
        </button>
      </div>

      {/* Slide-Up Comments Overlay Drawer */}
      {hasCommentsActive && (
        <div className="absolute inset-x-0 bottom-0 max-h-[55%] bg-[#040404]/95 backdrop-blur-md rounded-t-3xl border-t border-cyan-500/20 z-40 p-4 flex flex-col text-left space-y-3 animate-slideUp">
          <div className="flex items-center justify-between border-b border-gray-900 pb-2">
            <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 leading-none">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{lang === "en" ? "Comments Feed" : "کۆمێنتەکان"} ({reel.comments.length})</span>
            </h5>
            <button 
              onClick={() => setActiveReelCommentsId(null)} 
              className="p-1 cursor-pointer text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 py-1 max-h-[140px]">
            {reel.comments.map((comment, idx) => (
              <div key={idx} className="bg-black/60 p-2.5 rounded-xl border border-gray-950 text-[10px] space-y-0.5">
                <p className="font-bold text-cyan-400 text-[9.5px]">@{comment.author}</p>
                <p className="text-gray-300 leading-normal">{comment.text}</p>
              </div>
            ))}
            {reel.comments.length === 0 && (
              <p className="text-[9px] text-gray-600 font-mono text-center py-4">{lang === "en" ? "No comments yet. Start the buzz!" : "کۆمێنت بڵاونەکراوەتەوە."}</p>
            )}
          </div>

          <div className="flex gap-1.5 pt-1 border-t border-gray-950">
            <input 
              type="text" 
              placeholder={lang === "en" ? "Add respectful critique..." : "کۆمێنتێک بنووسە..."}
              className="flex-1 bg-black rounded-xl border border-gray-900 px-3 py-2 text-[10.5px] text-white focus:outline-none focus:border-cyan-400/50"
              value={newReelComment}
              onChange={(e) => setNewReelComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newReelComment.trim()) {
                  setReels(prev => prev.map(r => {
                    if (r.id === reel.id) {
                      return {
                        ...r,
                        comments: [...r.comments, { author: myProfile.name, text: newReelComment.trim() }]
                      };
                    }
                    return r;
                  }));
                  setNewReelComment("");
                  showToast(lang === "en" ? "Comment added!" : "کۆمێنتەکەت بڵاوکرایەوە!");
                }
              }}
            />
            <button 
              onClick={() => {
                if (!newReelComment.trim()) return;
                setReels(prev => prev.map(r => {
                  if (r.id === reel.id) {
                    return {
                      ...r,
                      comments: [...r.comments, { author: myProfile.name, text: newReelComment.trim() }]
                    };
                  }
                  return r;
                }));
                setNewReelComment("");
                showToast(lang === "en" ? "Comment added!" : "کۆمێنتەکەت بڵاوکرایەوە!");
              }}
              className="bg-cyan-950 border border-cyan-800 text-cyan-400 px-3 py-2 rounded-xl text-[10px] font-mono font-bold hover:bg-cyan-900 cursor-pointer transition-colors"
            >
              {lang === "en" ? "POST" : "بنێ"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  // Markdown & formatting helper for the Cinematic Creative Partner response
  const renderFormattedResponse = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Check for bullet points
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        return (
          <li key={i} className="ml-4 list-disc text-gray-300 text-[11px] leading-relaxed my-0.5">
            {line.trim().substring(2)}
          </li>
        );
      }
      // Check for headers (e.g. ### Header or **Header**)
      if (line.startsWith("###")) {
        return (
          <h5 key={i} className="text-xs font-bold text-cyan-400 font-mono mt-2 mb-1">
            {line.replace("###", "").trim()}
          </h5>
        );
      }
      if (line.startsWith("##")) {
        return (
          <h4 key={i} className="text-[11px] uppercase tracking-wider font-bold text-[#00f0ff] font-mono mt-3 mb-1.5">
            {line.replace("##", "").trim()}
          </h4>
        );
      }
      // Handle inline bold markers like **text**
      const parts = [];
      let currentLine = line;
      let boldIndex = currentLine.indexOf("**");
      while (boldIndex !== -1) {
        if (boldIndex > 0) {
          parts.push(currentLine.substring(0, boldIndex));
        }
        const nextBold = currentLine.indexOf("**", boldIndex + 2);
        if (nextBold !== -1) {
          parts.push(
            <strong key={boldIndex} className="text-white font-semibold">
              {currentLine.substring(boldIndex + 2, nextBold)}
            </strong>
          );
          currentLine = currentLine.substring(nextBold + 2);
        } else {
          parts.push(currentLine.substring(boldIndex));
          currentLine = "";
        }
        boldIndex = currentLine.indexOf("**");
      }
      if (currentLine) {
        parts.push(currentLine);
      }

      return (
        <p key={i} className="text-[11px] text-gray-300 leading-relaxed my-1">
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  // First Launch state
  const [lang, setLang] = useState<Lang | null>(() => {
    return localStorage.getItem("krdhub_lang") as Lang | null;
  });

  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    return localStorage.getItem("krdhub_registered") === "true";
  });

  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);

  const [authMethod, setAuthMethod] = useState<'google' | 'facebook' | 'apple' | 'gmail' | null>(() => {
    return localStorage.getItem("krdhub_auth_method") as 'google' | 'facebook' | 'apple' | 'gmail' | null;
  });
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showGmailAuthForm, setShowGmailAuthForm] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [regPhoto, setRegPhoto] = useState<string>(() => {
    const stored = localStorage.getItem("krdhub_my_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.avatarUrl) return parsed.avatarUrl;
      } catch (e) {}
    }
    return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&fit=crop&q=80";
  });

  const [regName, setRegName] = useState(() => {
    const stored = localStorage.getItem("krdhub_my_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.name) return parsed.name;
      } catch (e) {}
    }
    return "";
  });

  const [regAge, setRegAge] = useState(() => {
    const stored = localStorage.getItem("krdhub_my_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.age) return String(parsed.age);
      } catch (e) {}
    }
    return "";
  });

  const [regGender, setRegGender] = useState(() => {
    const stored = localStorage.getItem("krdhub_my_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.gender) return parsed.gender;
      } catch (e) {}
    }
    return "male";
  });

  const [regLocation, setRegLocation] = useState(() => {
    const stored = localStorage.getItem("krdhub_my_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.location) return parsed.location;
      } catch (e) {}
    }
    return "";
  });

  const [regWork, setRegWork] = useState(() => {
    const stored = localStorage.getItem("krdhub_my_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.role) return parsed.role;
      } catch (e) {}
    }
    return "";
  });

  const [regBio, setRegBio] = useState(() => {
    const stored = localStorage.getItem("krdhub_my_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.bio) return parsed.bio;
      } catch (e) {}
    }
    return "";
  });
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

  const handleMockSignIn = (method: 'google' | 'facebook' | 'apple' | 'gmail', customEmail?: string) => {
    setIsAuthenticating(true);
    setAuthMethod(null);
    if (method !== 'gmail') {
      setShowGmailAuthForm(false);
    }
    
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthMethod(method);
      localStorage.setItem("krdhub_auth_method", method);
      
      // Look up if we have a saved profile for this specific provider
      const savedProviderProfileStr = localStorage.getItem(`krdhub_profile_${method}`);
      if (savedProviderProfileStr) {
        try {
          const parsed = JSON.parse(savedProviderProfileStr);
          if (parsed) {
            // Found existing user! Automatically restore profile and skip Step 2
            setMyProfile(parsed);
            
            // Sync edit inputs
            setEditName(parsed.name || "");
            setEditRole(parsed.role || "");
            setEditLocation(parsed.location || "");
            setEditBio(parsed.bio || "");
            setEditAvatarUrl(parsed.avatarUrl || "");
            
            // Set registration success inputs for sync
            setRegName(parsed.name || "");
            setRegPhoto(parsed.avatarUrl || "");
            setRegWork(parsed.role || "");
            setRegLocation(parsed.location || "");
            setRegBio(parsed.bio || "");
            setRegAge(parsed.age || "24");
            setRegGender(parsed.gender || "male");

            // Persist the active profile
            localStorage.setItem("krdhub_my_profile", JSON.stringify(parsed));
            localStorage.setItem("krdhub_registered", "true");
            setIsRegistered(true);
            
            // Sync with backend mock if any
            fetch("/api/creator/profile", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(parsed)
            }).catch((err) => console.error("Auto login profile sync fail:", err));

            showToast(
              lang === "en" 
                ? `Welcome back, ${parsed.name}! (via ${method.toUpperCase()})` 
                : `بەخێربێیتەوە، ${parsed.name}! (لە ڕێگەی ${method.toUpperCase()})`
            );
            return;
          }
        } catch (e) {
          console.error("Failed to parse saved provider-specific profile", e);
        }
      }

      // If NO existing profile was found for this provider, we proceed to Step 2 ("Complete Profile Screen")
      // Initialize some starting fields for the new profile depending on the social auth source
      let sampleName = "";
      let samplePhoto = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&fit=crop&q=80";

      if (method === 'google') {
        sampleName = "Dosty Karkuke";
        samplePhoto = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80";
      } else if (method === 'apple') {
        sampleName = "Apple Cinematic Director";
        samplePhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80";
      } else if (method === 'facebook') {
        sampleName = "Facebook Producer Studio";
        samplePhoto = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80";
      } else {
        const emailAddress = customEmail || authEmail || "creator@gmail.com";
        sampleName = emailAddress ? emailAddress.split("@")[0] : "Kurdish Indie Creator";
        samplePhoto = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80";
      }

      setRegName(sampleName);
      setRegPhoto(samplePhoto);
      
      // Transition to Step 2
      setOnboardingStep(2);

      showToast(
        lang === "en" 
          ? `Authenticated with ${method.toUpperCase()}. Let's set up your profile!` 
          : `بە سەرکەوتوویی ناسنامەکرا لە ڕێگەی ${method.toUpperCase()}. با پڕۆفایلەکەت ڕێکبخەین!`
      );
    }, 1200);
  };

  const handleSaveRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast(lang === "en" ? "Please enter your name." : "تکایە ناوی خۆت بنووسە.");
      return;
    }

    if (!authMethod) {
      showToast(
        lang === "en" 
          ? "Please select a standard authentication method first." 
          : "تکایە سەرەتا یەکێک لە ڕێگاکانی ناسنامەکردن دیاریبکە."
      );
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
    localStorage.setItem("krdhub_auth_method", authMethod);
    localStorage.setItem("krdhub_registered", "true");
    
    // Combined persistence (Global profile and Provider profile)
    localStorage.setItem("krdhub_my_profile", JSON.stringify(updatedProfile));
    localStorage.setItem(`krdhub_profile_${authMethod}`, JSON.stringify(updatedProfile));

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
  const [activeTab, setActiveTab] = useState<"biner" | "sako" | "videos" | "chat" | "my-profile">("biner");

  // App Relative Time Indicator Utility
  const getRelativeTime = (timestamp: number | string | undefined, lang: "en" | "ckb"): string => {
    if (!timestamp) {
      return lang === "en" ? "2 days ago" : "٢ ڕۆژ پێش ئێستا";
    }
    const now = Date.now();
    const past = typeof timestamp === "number" ? timestamp : new Date(timestamp).getTime();
    const diffMs = now - past;
    if (isNaN(past) || diffMs < 0) {
      return lang === "en" ? "Just now" : "ئێستا";
    }
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return lang === "en" ? "Just now" : "ئێستا";
    } else if (diffMin < 60) {
      return lang === "en" ? `${diffMin}m ago` : `${diffMin} خولەک پێش ئێستا`;
    } else if (diffHour < 24) {
      return lang === "en" ? `${diffHour}h ago` : `${diffHour} کاتژمێر پێش ئێستا`;
    } else if (diffDay === 1) {
      return lang === "en" ? "Yesterday" : "دوێنێ";
    } else {
      return lang === "en" ? `${diffDay}d ago` : `${diffDay} ڕۆژ پێش ئێستا`;
    }
  };

  // Lightbox visual zoom variables
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const [followingIds, setFollowingIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("krdhub_following") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("krdhub_following", JSON.stringify(followingIds));
  }, [followingIds]);

  // Group chat configuration variables
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);

  // Scenic cinematic video reels matching
  const [reels, setReels] = useState([
    {
      id: "reel_1",
      title: "Alpine Freeride Journey",
      desc: "Testing high-altitude camera stabilizers in heavy powder snow slopes. Fully graded.",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cinematic-view-of-a-snowy-mountain-range-43285-large.mp4",
      creatorId: "c-marcus",
      creatorName: "Marcus Thorne",
      creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80",
      likes: 142,
      liked: false,
      comments: [
        { author: "Zara Kamal", text: "Stunning grading!" },
        { author: "Dara Ahmad", text: "The shutter speed looks so crisp." }
      ]
    },
    {
      id: "reel_2",
      title: "Neon Dreams Sequence",
      desc: "Late night study overlay mockup using glowing cybernetic title sequences.",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-neon-lights-40082-large.mp4",
      creatorId: "c-saman",
      creatorName: "Saman Farhad",
      creatorAvatar: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=400&fit=crop&q=80",
      likes: 219,
      liked: false,
      comments: [
        { author: "Marcus Thorne", text: "Mind-blowing kinetic typography!" }
      ]
    },
    {
      id: "reel_3",
      title: "Golden Forest Stream",
      desc: "An atmospheric study tracking cinematic light rays piercing through dense morning mist.",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
      creatorId: "c-dara",
      creatorName: "Dara Ahmad",
      creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80",
      likes: 98,
      liked: false,
      comments: [
        { author: "Zara Kamal", text: "Organic and relaxing frame composition." }
      ]
    }
  ]);

  // Active comments drawer state for video reels
  const [activeReelCommentsId, setActiveReelCommentsId] = useState<string | null>(null);
  const [newReelComment, setNewReelComment] = useState("");

  // Hidden references for chat attachments
  const chatMediaInputRef = useRef<HTMLInputElement>(null);

  // Synchronized and fully live data states
  const [creators, setCreators] = useState<SakoCreator[]>(initialCreators);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>(() => {
    const stored = localStorage.getItem("krdhub_works_posts");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse stored works", e);
      }
    }
    return initialTrendingMovies;
  });

  // Save trendingMovies to localStorage
  useEffect(() => {
    if (trendingMovies && trendingMovies.length > 0) {
      localStorage.setItem("krdhub_works_posts", JSON.stringify(trendingMovies));
    }
  }, [trendingMovies]);

  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);

  // Active interaction states
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [chatInputText, setChatInputText] = useState("");
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  const [moodSearchQuery, setMoodSearchQuery] = useState("");
  const [isMoodSearching, setIsMoodSearching] = useState(false);
  const [moodSearchResults, setMoodSearchResults] = useState<Movie[]>([]);
  const [moodSearchError, setMoodSearchError] = useState<string | null>(null);
  const [aiPartnerResponse, setAiPartnerResponse] = useState<string | null>(null);
  const [aiConversationContext, setAiConversationContext] = useState<{ id: string; role: 'user' | 'assistant'; text: string; timestamp: string }[]>([]);

  // Selection states
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  // Self Profile status
  const [myProfile, setMyProfile] = useState<SakoCreator>(() => {
    const stored = localStorage.getItem("krdhub_my_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse stored myProfile", e);
      }
    }
    return {
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
    };
  });

  // Editor detail models
  const [isEditingMyProfile, setIsEditingMyProfile] = useState(false);
  const [editName, setEditName] = useState(myProfile.name);
  const [editRole, setEditRole] = useState(myProfile.role);
  const [editLocation, setEditLocation] = useState(myProfile.location);
  const [editBio, setEditBio] = useState(myProfile.bio);
  const [editAvatarUrl, setEditAvatarUrl] = useState(myProfile.avatarUrl);

  // Sync edit fields when myProfile updates or is loaded from localStorage
  useEffect(() => {
    if (myProfile) {
      setEditName(myProfile.name);
      setEditRole(myProfile.role);
      setEditLocation(myProfile.location);
      setEditBio(myProfile.bio);
      setEditAvatarUrl(myProfile.avatarUrl);
    }
  }, [myProfile]);

  // Persist myProfile to localStorage whenever it changes
  useEffect(() => {
    if (myProfile) {
      localStorage.setItem("krdhub_my_profile", JSON.stringify(myProfile));
      if (authMethod) {
        localStorage.setItem(`krdhub_profile_${authMethod}`, JSON.stringify(myProfile));
      }
    }
  }, [myProfile, authMethod]);

  // Follows state mapping to handle Followers / Following lists
  const [modalUserList, setModalUserList] = useState<{ title: string; users: string[] } | null>(null);

  const [followsMap, setFollowsMap] = useState<Record<string, { followers: string[]; following: string[] }>>(() => {
    const stored = localStorage.getItem("krdhub_follows_map");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse krdhub_follows_map", e);
      }
    }
    // Pre-seeded defaults for a highly realistic platform experience
    const loadedFollowing = (() => {
      try {
        return JSON.parse(localStorage.getItem("krdhub_following") || "[]");
      } catch {
        return [];
      }
    })();
    return {
      "me": {
        followers: ["c-marcus", "c-zara"],
        following: loadedFollowing
      },
      "c-marcus": {
        followers: ["c-dara", "c-saman"],
        following: ["c-zara", "me"]
      },
      "c-dara": {
        followers: loadedFollowing.includes("c-dara") ? ["me"] : [],
        following: ["c-marcus", "c-saman"]
      },
      "c-zara": {
        followers: loadedFollowing.includes("c-zara") ? ["c-marcus", "me"] : ["c-marcus"],
        following: ["me"]
      },
      "c-saman": {
        followers: loadedFollowing.includes("c-saman") ? ["c-marcus", "c-dara", "me"] : ["c-marcus", "c-dara"],
        following: ["c-marcus"]
      }
    };
  });

  // Persist followsMap to localStorage
  useEffect(() => {
    localStorage.setItem("krdhub_follows_map", JSON.stringify(followsMap));
  }, [followsMap]);

  // Synchronize followsMap whenever followingIds changes
  useEffect(() => {
    setFollowsMap(prev => {
      const currentFollowingInMap = prev["me"]?.following || [];
      const isSyncNeeded = 
        currentFollowingInMap.length !== followingIds.length || 
        !followingIds.every(id => currentFollowingInMap.includes(id));

      if (!isSyncNeeded) return prev;

      const nextMap = { ...prev };
      nextMap["me"] = {
        ...(nextMap["me"] || { followers: ["c-marcus", "c-zara"], following: [] }),
        following: followingIds
      };

      Object.keys(nextMap).forEach(creatorId => {
        if (creatorId === "me") return;
        
        const isFollowingThisCreator = followingIds.includes(creatorId);
        const currentFollowers = nextMap[creatorId]?.followers || [];
        const containsMe = currentFollowers.includes("me");

        if (isFollowingThisCreator && !containsMe) {
          nextMap[creatorId] = {
            ...(nextMap[creatorId] || { followers: [], following: [] }),
            followers: [...currentFollowers, "me"]
          };
        } else if (!isFollowingThisCreator && containsMe) {
          nextMap[creatorId] = {
            ...(nextMap[creatorId] || { followers: [], following: [] }),
            followers: currentFollowers.filter(id => id !== "me")
          };
        }
      });

      return nextMap;
    });
  }, [followingIds]);

  const toggleFollowCreator = (creatorId: string) => {
    const isFollowing = followingIds.includes(creatorId);
    if (isFollowing) {
      setFollowingIds(prev => prev.filter(id => id !== creatorId));
      showToast(lang === "en" ? `Unfollowed @${creatorId}` : `فۆڵۆوت لادا بۆ @${creatorId}`);
    } else {
      setFollowingIds(prev => [...prev, creatorId]);
      showToast(lang === "en" ? `Following @${creatorId}!` : `فۆڵۆوت کرد @${creatorId}!`);
    }
  };

  const getFollowersCount = (id: string) => {
    return followsMap[id]?.followers?.length || 0;
  };

  const getFollowingCount = (id: string) => {
    return followsMap[id]?.following?.length || 0;
  };

  // Portfolio publication models
  const [newPortTitle, setNewPortTitle] = useState("");
  const [newPortUrl, setNewPortUrl] = useState("");
  const [newPortDesc, setNewPortDesc] = useState("");
  const [newPortType, setNewPortType] = useState<"image" | "video">("image");
  const [newPortAspect, setNewPortAspect] = useState<"landscape" | "portrait" | "square">("landscape");
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);

  // New Post publication models
  const [worksSubTab, setWorksSubTab] = useState<"feed" | "portfolios">("feed");
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [newPostTagInput, setNewPostTagInput] = useState("");
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDesc, setNewPostDesc] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Videographer");
  const [newPostPhoto, setNewPostPhoto] = useState("");
  const [newPostYear, setNewPostYear] = useState("2026");
  const postImgInputRef = useRef<HTMLInputElement>(null);

  // Notification states
  const [notification, setNotification] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const profileImgInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePhotoChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast(lang === "en" ? "Please upload an image file." : "تکایە تەنها وێنە باربکە.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const photoUrl = e.target.result as string;
        
        // Update both the registration state image and actual live myProfile
        setRegPhoto(photoUrl);
        
        const updated = {
          ...myProfile,
          avatarUrl: photoUrl
        };
        setMyProfile(updated);
        
        // Synchronize updated profile to the server database
        fetch("/api/creator/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated)
        })
          .then(() => {
            showToast(lang === "en" ? "Profile photo updated successfully!" : "وێنەی پرۆفایل بە سەرکەوتوویی نوێکرایەوە!");
          })
          .catch((err) => console.error("Profile photo server sync failed:", err));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostPhoto) {
      showToast(lang === "en" ? "Please select an image or media file to publish!" : "تکایە سەرەتا وێنەیەک دیاریبکە بۆ بڵاوکردنەوە!");
      return;
    }
    
    const captionText = newPostTitle.trim() || (lang === "en" ? "Visual Asset Share" : "بڵاوکردنەوەی کار");
    
    const newPost: Movie = {
      id: "m_user_" + Date.now(),
      title: captionText,
      year: newPostYear.trim() || "2026",
      genre: newPostCategory || myProfile.role || "Creator",
      description: newPostDesc.trim() || (lang === "en" ? "Creative artwork shared by verified artist." : "کاری هونەری هاوبەشکراو لەلایەن سینەماکار."),
      director: myProfile.name,
      rating: "9.8",
      backdropUrl: newPostPhoto,
      indie: true,
      tags: newPostTags, // Pass tags to the movie object
      createdAt: Date.now() // Absolute current timestamp for relative date calculation
    };

    setTrendingMovies((prev) => [newPost, ...prev]);
    setShowAddPostModal(false);
    
    // Reset form fields
    setNewPostTitle("");
    setNewPostDesc("");
    setNewPostPhoto("");
    setNewPostTags([]);
    setNewPostTagInput("");

    showToast(lang === "en" ? "Post published to feed!" : "پۆستەکە بە سەرکەوتوویی بڵاوکرایەوە!");
  };

  const handlePostPhotoUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast(lang === "en" ? "Please upload an image file." : "تکایە تەنها وێنە باربکە.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setNewPostPhoto(e.target.result as string);
        showToast(lang === "en" ? "Image loaded successfully" : "وێنەکە بە سەرکەوتوویی بارکرا");
      }
    };
    reader.readAsDataURL(file);
  };

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
        if (data.conversations) {
          setConversations(data.conversations);
        }

        let loadedCreators: SakoCreator[] = data.creators || [];

        // Check localStorage to retrieve previous profile details (Name, Age, Bio, etc.)
        const storedProfileStr = localStorage.getItem("krdhub_my_profile");
        const isUserRegistered = localStorage.getItem("krdhub_registered") === "true";

        if (isUserRegistered && storedProfileStr) {
          try {
            const localProfile = JSON.parse(storedProfileStr);
            if (localProfile) {
              setMyProfile(localProfile);

              // Instantly sync the locally saved profile to the server database memory/SSE
              fetch("/api/creator/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(localProfile)
              }).catch((e) => console.error("Initial load server sync failed:", e));

              // Ensure the registered user's profile is in the local creators feed list
              const exists = loadedCreators.some((c) => c.id === localProfile.id);
              if (!exists) {
                loadedCreators = [localProfile, ...loadedCreators];
              } else {
                loadedCreators = loadedCreators.map((c) => c.id === localProfile.id ? localProfile : c);
              }
            }
          } catch (e) {
            console.error("Failed to parse stored profile on fetch initial state", e);
          }
        } else {
          const selfCreator = loadedCreators.find((c: SakoCreator) => c.id === "me" || c.id === "Alex Reed");
          if (selfCreator) {
            setMyProfile(selfCreator);
          }
        }

        setCreators(loadedCreators);
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
    
    // Add user prompt to conversation history immediately
    const userTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = {
      id: `ai-msg-usr-${Date.now()}`,
      role: "user" as const,
      text: prompt,
      timestamp: userTimestamp
    };
    
    const updatedHistory = [...aiConversationContext, userMsg];
    setAiConversationContext(updatedHistory);
    setMoodSearchQuery(""); // clear input field for a fluid DM feel
    
    try {
      const response = await fetch("/api/mood-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, history: updatedHistory, lang }),
      });
      const data = await response.json();
      if (data.films) {
        setMoodSearchResults(data.films);
        setAiPartnerResponse(data.partnerResponse || null);
        
        // Add assistant's response to history
        const assistantTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const assistantMsg = {
          id: `ai-msg-ast-${Date.now()}`,
          role: "assistant" as const,
          text: data.partnerResponse || "Consultation draft generated.",
          timestamp: assistantTimestamp
        };
        setAiConversationContext(prev => [...prev, assistantMsg]);
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

  // Direct Messaging trigger from post feed card
  const handleStartDMFromFeed = (movie: Movie) => {
    let targetCreator = creators.find(
      (c) => c.name.toLowerCase() === movie.director.toLowerCase()
    );

    if (!targetCreator) {
      const randomAvatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80`;
      targetCreator = {
        id: `c-dyn-${Date.now()}`,
        name: movie.director,
        role: movie.genre || "Film Director",
        avatarUrl: randomAvatar,
        bio: `Cinematographic project director of "${movie.title}". Join the workspace to negotiate terms!`,
        location: "Erbil, Kurdistan",
        rating: "5.0",
        views: 220,
        joinedDate: "May 2026",
        portfolio: [
          {
            id: `p-dyn-${Date.now()}`,
            title: movie.title,
            type: "image",
            url: movie.backdropUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&fit=crop&q=80",
            description: movie.description
          }
        ]
      };
      setCreators((prev) => [...prev, targetCreator!]);
    }

    handleStartDM(targetCreator);
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

  // Send photo or video directly inside active thread
  const handleSendMediaMessage = (file: File) => {
    if (!activeConvId) return;
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      showToast(lang === "en" ? "Only images or video files supported as chat media attachments." : "تەنها وێنە و فیدیۆ گونجاوە بۆ نامەکەت.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const mediaResult = e.target?.result as string;
      if (!mediaResult) return;
      
      const targetConv = conversations.find((c) => c.id === activeConvId);
      if (!targetConv) return;

      const msgId = `msg-me-media-${Date.now()}`;
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const newMsg: ChatMessage = {
        id: msgId,
        senderId: "me",
        text: isVideo ? "Sent video brief attachment" : "Sent high-fidelity photo share",
        timestamp,
        mediaUrl: mediaResult,
        mediaType: isVideo ? "video" : "image"
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

      showToast(lang === "en" ? "Media attachment shared!" : "میدیاکە بە سەرکەوتوویی نێردرا!");
    };
    reader.readAsDataURL(file);
  };

  // Share Live Location with a strict 10-minute timer limits
  const handleSendLiveLocation = () => {
    if (!activeConvId) return;

    // Standard high-accuracy simulated Erbil coordinates with decimal shifts
    const randomFuzzLat = (Math.random() - 0.5) * 0.02;
    const randomFuzzLng = (Math.random() - 0.5) * 0.02;
    const lat = 36.1912 + randomFuzzLat;
    const lng = 44.0091 + randomFuzzLng;
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes strictly in milliseconds

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msgId = `msg-me-loc-${Date.now()}`;

    const newMsg: ChatMessage = {
      id: msgId,
      senderId: "me",
      text: "[Live Location Shared]",
      timestamp,
      liveLocation: {
        lat,
        lng,
        expiresAt
      }
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

    showToast(lang === "en" ? "Live Location Shared (active 10 mins)!" : "شوێنی ڕاستەوخۆ دەستنیشانکرا بۆ ١٠ خولەک!");
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

  // Launch live creative team group workspace
  const handleCreateGroupChat = () => {
    if (!groupName.trim()) {
      showToast(lang === "en" ? "Please enter a group name!" : "تکایە ناوی گرووپەکە بنووسە!");
      return;
    }
    if (selectedGroupMembers.length === 0) {
      showToast(lang === "en" ? "Select at least 1 member to initiate group!" : "تکایە لانی کەم یەک ئەندام دیاری بکە!");
      return;
    }
    if (selectedGroupMembers.length > 11) { // total members = self + 11 = 12 members max
      showToast(lang === "en" ? "Max limit of 12 group members reached!" : "تکایە لە ١٢ ئەندام زیاتر نابێت بە خۆتەوە!");
      return;
    }

    const newGroupId = `group-${Date.now()}`;
    const initialMessage: ChatMessage = {
      id: `m-gr-init-${Date.now()}`,
      senderId: "system",
      text: lang === "en" 
        ? `Group chat "${groupName}" created by verified workspace agent.` 
        : `گروپی "${groupName}" دروستکرا لە لایەن خاوەن کارەوە.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newGroupConv: ChatConversation = {
      id: newGroupId,
      creatorId: newGroupId, 
      creatorName: groupName.trim(),
      creatorAvatar: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&fit=crop&q=80", 
      creatorRole: `${selectedGroupMembers.length + 1} MEMBERS`,
      messages: [initialMessage],
      unread: false,
      isGroup: true,
      groupMembers: ["me", ...selectedGroupMembers]
    };

    setConversations([newGroupConv, ...conversations]);
    setActiveConvId(newGroupId);
    setShowGroupModal(false);

    showToast(lang === "en" ? `Group chat "${groupName}" initialized!` : `گروپی نوێی "${groupName}" دەستپێکرا!`);
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
          className="w-full animate-fade-in"
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
                id="locale-switch-onboarding"
                onClick={() => handleSelectLanguage(lang === "en" ? "ckb" : "en")}
                className="bg-[#0a0a0a]/95 hover:bg-cyan-950/50 border border-cyan-800/30 font-semibold py-1.5 px-4 rounded-full text-cyan-400 shadow-xl flex items-center gap-1.5 text-xs transition-all active:scale-95 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === "en" ? "کوردی (سۆرانی)" : "English"}</span>
              </button>
            </div>

            {/* Step 1: Social Sign-In Screen */}
            {onboardingStep === 1 ? (
              <div id="onboarding-step-1-card" className="w-full max-w-md bg-[#080808]/90 border border-gray-900 rounded-3xl p-6 md:p-8 space-y-6 relative z-10 shadow-2xl shadow-cyan-950/20 backdrop-blur-md my-8 text-center animate-fade-in">
                <div className="space-y-2">
                  <div className="inline-flex p-3 bg-cyan-950/40 rounded-2xl border border-cyan-800/20 text-cyan-400 mb-1">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h1 className="text-2xl font-black tracking-wide text-white font-display">
                    {lang === "en" ? "Enter Krd Hub" : "چوونە ژوورەوەی Krd Hub"}
                  </h1>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    {lang === "en"
                      ? "The cinematic creative platform for Kurdish filmmakers & portfolio builders."
                      : "سەکۆی سینەمایی پێشکەوتوو بۆ مۆنتاژکاران و بەرهەمهێنەرانی کورد."}
                  </p>
                </div>

                {/* Social Buttons Container */}
                <div className="space-y-3.5 pt-2">
                  {/* Google Button */}
                  <button
                    id="social-continue-google"
                    type="button"
                    onClick={() => handleMockSignIn('google')}
                    disabled={isAuthenticating}
                    className="w-full flex items-center justify-between py-3.5 px-5 bg-[#0f0f0f] hover:bg-[#141414] border border-gray-800 hover:border-gray-700 rounded-xl text-xs font-semibold text-gray-100 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      {/* Google G logo stylized as vector */}
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      <span className="font-sans tracking-wide">{lang === "en" ? "Continue with Google" : "بەردەوامبە لەگەڵ Google"}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">GOOGLE.OAUTH</span>
                  </button>

                  {/* Facebook Button */}
                  <button
                    id="social-continue-facebook"
                    type="button"
                    onClick={() => handleMockSignIn('facebook')}
                    disabled={isAuthenticating}
                    className="w-full flex items-center justify-between py-3.5 px-5 bg-[#0f0f0f] hover:bg-[#141414] border border-gray-800 hover:border-gray-700 rounded-xl text-xs font-semibold text-gray-100 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      {/* Facebook Logo as official styled brand vector */}
                      <svg className="w-4 h-4 shrink-0 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="font-sans tracking-wide">{lang === "en" ? "Continue with Facebook" : "بەردەوامبە لەگەڵ Facebook"}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">FB.SECURE</span>
                  </button>

                  {/* Apple Button */}
                  <button
                    id="social-continue-apple"
                    type="button"
                    onClick={() => handleMockSignIn('apple')}
                    disabled={isAuthenticating}
                    className="w-full flex items-center justify-between py-3.5 px-5 bg-[#0f0f0f] hover:bg-[#141414] border border-gray-800 hover:border-gray-700 rounded-xl text-xs font-semibold text-gray-100 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <Apple className="w-4 h-4 text-white shrink-0" />
                      <span className="font-sans tracking-wide">{lang === "en" ? "Continue with Apple" : "بەردەوامبە لەگەڵ Apple"}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">APPLE.ID</span>
                  </button>

                  <div className="relative py-2 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-900"></div>
                    </div>
                    <span className="relative px-3 bg-[#080808] text-[10px] font-mono tracking-widest text-gray-600 uppercase">
                      {lang === "en" ? "Alternate Method" : "ڕێگای جێگرەوە"}
                    </span>
                  </div>

                  {/* Email/Password Button */}
                  <button
                    id="social-continue-email"
                    type="button"
                    onClick={() => setShowGmailAuthForm(!showGmailAuthForm)}
                    className="w-full flex items-center justify-between py-3 px-5 bg-[#080808] hover:bg-[#0d0d0d] border border-gray-900 hover:border-gray-800 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-all active:scale-98 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span className="font-sans tracking-wide">{lang === "en" ? "Continue with Email/Password" : "بەردەوامبە بە ایمێڵ و تێپەڕەوشە"}</span>
                    </div>
                    <span className="text-xs text-cyan-500">{showGmailAuthForm ? "▼" : "▶"}</span>
                  </button>

                  {/* Gmail Expandable Drawer Sub-form */}
                  <AnimatePresence>
                    {showGmailAuthForm && (
                      <motion.div
                        key="gmail-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-[#0c0c0c]/80 rounded-2xl border border-gray-900/40 p-4.5 space-y-3 mt-1.5 text-left"
                      >
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Email Address / ئیمێڵ</label>
                          <input 
                            type="email"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="creator@krdhub.com"
                            className="w-full bg-[#050505] border border-gray-800 rounded-lg p-2 text-xs focus:outline-none focus:border-cyan-500/80 text-white transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Secure Password / تێپەڕەوشە</label>
                          <input 
                            type="password"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#050505] border border-gray-800 rounded-lg p-2 text-xs focus:outline-none focus:border-cyan-500/80 text-white transition-colors"
                          />
                        </div>
                        <button
                          type="button"
                          id="submit-email-auth-btn"
                          onClick={() => {
                            if (!authEmail.includes("@")) {
                              showToast(lang === "en" ? "Please enter a valid email address." : "تکایە ئیمێڵێکی دروست بنووسە.");
                              return;
                            }
                            if (authPassword.length < 4) {
                              showToast(lang === "en" ? "Password must exceed 4 characters." : "تێپەڕەوشە دەبێت لانی کەم ٤ پیت بێت.");
                              return;
                            }
                            handleMockSignIn('gmail');
                          }}
                          className="w-full mt-1.5 py-2 px-4 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 hover:text-white font-mono text-xs font-semibold cursor-pointer border border-cyan-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{lang === "en" ? "Sign In & Initialize" : "چوونەژوورەوە و چالاککردن"}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Verification Spinner */}
                  {isAuthenticating && (
                    <div id="auth-loading-state" className="flex items-center gap-3 p-3 bg-cyan-950/20 border border-cyan-800/20 rounded-xl justify-center">
                      <div className="w-4 h-4 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin shrink-0" />
                      <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase animate-pulse">
                        {lang === "en" ? "Verifying signature token..." : "ناسنامەکردن و دەستبەکاربوونی مۆڵەت..."}
                      </span>
                    </div>
                  )}
                </div>

                {/* Nice footer message for the auth screen */}
                <div className="pt-3 border-t border-gray-950 flex items-center justify-between text-[10px] text-gray-600 font-mono">
                  <span>SSL SECURED PROTOCOL 256-BIT</span>
                  <span>KRDHUB.NET</span>
                </div>
              </div>
            ) : (
              /* Step 2: Complete Profile Screen */
              <div id="onboarding-step-2-card" className="w-full max-w-lg bg-[#080808]/90 border border-gray-900 rounded-3xl p-6 md:p-8 space-y-6 relative z-10 shadow-2xl shadow-cyan-950/20 backdrop-blur-md my-8">
                {/* Back button and Header */}
                <div className="flex items-start gap-4 pb-2 border-b border-gray-900/60">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(1)}
                    className="p-2 bg-gray-950 hover:bg-cyan-950/30 rounded-xl border border-gray-800 hover:border-cyan-800/40 text-cyan-400 transition-all cursor-pointer shrink-0"
                    title={lang === "en" ? "Go back to Step 1" : "گەڕانەوە بۆ هەنگاوی ١"}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="space-y-1 text-left">
                    <h1 className="text-xl font-black text-white font-display">
                      {currentT.regTitle}
                    </h1>
                    <p className="text-xs text-gray-400">
                      {lang === "en" 
                        ? `Customize your workspace profile under standard auth: ${authMethod?.toUpperCase()}`
                        : `زانیارییەکانی دەلاقەی پڕۆفایلەکەت لە سیستم بنووسە: ${authMethod?.toUpperCase()}`}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveRegistration} className="space-y-5">
                  {/* Photo picker container */}
                  <div className="p-4 bg-black/40 rounded-2xl border border-gray-900/60 space-y-3.5">
                    <div className="space-y-1 text-left">
                      <label className="block text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                        {currentT.regPhoto} <span className="text-red-500">*</span>
                      </label>
                      <p className="text-[10px] text-gray-500 leading-normal">
                        {lang === "en" ? "Upload an elegant circular visual portrait representing your artistic style" : "پڕۆترێتێکی شایستە بۆ پڕۆفایلەکەت بنووسە یان لێرەدا دایبنێ"}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      {/* Live Image Circle Preview */}
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500 shrink-0 bg-gray-950 shadow-md">
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
                        onClick={() => document.getElementById("profile-upload-file-onboarding")?.click()}
                      >
                        <p className="text-xs text-cyan-400/80 font-medium">
                          {lang === "en" ? "Drag & drop file here or click to browse" : "وێنەکە ڕابکێشە ئێرە یان کرتە بکە بۆ گەڕان"}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          {lang === "en" ? "PNG, JPG up to 5MB" : "PNG, JPG تا ٥ مێگابایت"}
                        </p>
                        <input 
                          id="profile-upload-file-onboarding"
                          type="file" 
                          accept="image/*"
                          onChange={handleFileInput}
                          className="hidden" 
                        />
                      </div>
                    </div>

                    {/* Photo Direct Link Input Box */}
                    <div className="space-y-1.5 mt-2 text-left">
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
                    id="submit-register-onboarding-btn"
                    className="w-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-900/60 font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-cyan-500/10 cursor-pointer active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 mt-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{currentT.regSave}</span>
                  </button>
                </form>
              </div>
            )}
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

      {/* Language Switch Quick Toggle Relocated to Profile Screen Settings */}

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
          {!(activeTab === "chat" && activeConvId !== null) && (
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
          )}

          {/* Main viewport */}
          <div className={`flex-1 relative bg-[#030303] flex flex-col ${
            (activeTab === "chat" || activeTab === "videos") ? "overflow-hidden h-full" : "overflow-y-auto no-scrollbar"
          } ${(activeTab === "chat" && activeConvId !== null) ? "pb-0" : "pb-24"}`}>
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

                      {/* Redesigned Centered Circular Avatar and details over cover photo */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 px-4 text-center">
                        <div className="relative mb-2 shrink-0">
                          <img 
                            src={targetCreator.avatarUrl} 
                            className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400 bg-black shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            alt={targetCreator.name}
                          />
                          <span className="absolute -bottom-1 -right-1 bg-cyan-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-black text-black inline" /> {targetCreator.rating}
                          </span>
                        </div>
                        <div className="min-w-0 max-w-full">
                          <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-mono font-bold bg-cyan-950/75 px-2.5 py-1 rounded-md border border-cyan-500/30">
                            {targetCreator.role}
                          </span>
                          <h1 className="text-lg font-semibold font-display text-white mt-1.5 truncate max-w-xs sm:max-w-md">
                            {targetCreator.name}
                          </h1>
                          <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-1 leading-none">
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

                      {/* Followers and Following Clickable Stats Counters for target creator */}
                      <div id="creator-profile-stats" className="grid grid-cols-2 gap-3">
                        <button
                          id="creator-followers-trigger"
                          type="button"
                          onClick={() => {
                            setModalUserList({
                              title: lang === "en" ? `${targetCreator.name}'s Followers` : `فۆڵۆوەرەکانی ${targetCreator.name}`,
                              users: followsMap[targetCreator.id]?.followers || []
                            });
                          }}
                          className="bg-black/60 hover:bg-cyan-950/20 border border-gray-900 hover:border-cyan-500/30 rounded-xl p-3 flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-98 text-center"
                        >
                          <span className="text-md font-bold font-mono text-cyan-400 group-hover:scale-105 transition-transform">
                            {getFollowersCount(targetCreator.id)}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 group-hover:text-cyan-300 transition-colors">
                            {lang === "en" ? "Followers" : "فۆڵۆوەران"}
                          </span>
                        </button>

                        <button
                          id="creator-following-trigger"
                          type="button"
                          onClick={() => {
                            setModalUserList({
                              title: lang === "en" ? `${targetCreator.name} is Following` : `فۆڵۆوکراوەکانی ${targetCreator.name}`,
                              users: followsMap[targetCreator.id]?.following || []
                            });
                          }}
                          className="bg-black/60 hover:bg-cyan-950/20 border border-gray-900 hover:border-cyan-500/30 rounded-xl p-3 flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-98 text-center"
                        >
                          <span className="text-md font-bold font-mono text-cyan-400 group-hover:scale-105 transition-transform">
                            {getFollowingCount(targetCreator.id)}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 group-hover:text-cyan-300 transition-colors">
                            {lang === "en" ? "Following" : "فۆڵۆوکراو"}
                          </span>
                        </button>
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

                    <div className="p-4 pt-2 grid grid-cols-2 gap-3">
                      <button 
                        id="follow-creator-btn"
                        onClick={() => toggleFollowCreator(targetCreator.id)}
                        className={`py-3 rounded-lg font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-95 ${
                          followingIds.includes(targetCreator.id)
                            ? "bg-gray-900 text-gray-400 border-2 border-gray-800"
                            : "bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border-2 border-cyan-400 shadow-lg shadow-cyan-950/50"
                        }`}
                      >
                        {followingIds.includes(targetCreator.id) ? (
                          <>
                            <UserCheck className="w-4 h-4 text-gray-400" />
                            {lang === "en" ? "Following" : "فۆڵۆوکراوە"}
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 text-cyan-400" />
                            {lang === "en" ? "Follow" : "فۆڵۆو بکە"}
                          </>
                        )}
                      </button>

                      <button 
                        id="profile-dm-primary-btn"
                        onClick={() => handleStartDM(targetCreator)}
                        className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border-2 border-cyan-400 py-3 rounded-lg font-bold font-display uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer hover:scale-[1.01] active:scale-95 text-center"
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
                    {/* Header Row with Title & AI Sparkle Button */}
                    <div className="flex items-center justify-between pb-1 border-b border-gray-900/40">
                      <div className="text-left">
                        <h2 className="text-sm font-bold font-mono uppercase tracking-widest text-cyan-400">
                          {currentT.navBiner}
                        </h2>
                        <p className="text-[10px] text-gray-500 font-mono">
                          {lang === "en" ? "Explore works & portfolios" : "نمایشکردنی کار و پۆرتفۆلیۆکان"}
                        </p>
                      </div>

                      {/* AI Sparkle Button */}
                      <button
                        id="open-ai-chat"
                        onClick={() => setIsAIChatOpen(true)}
                        className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-800/40 hover:border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:scale-[1.04] transition-all cursor-pointer w-11 h-11 shrink-0 group"
                        title={lang === "en" ? "AI Cinema Partner" : "هاوبەشی سینەمایی بگری"}
                      >
                        <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                        <span className="text-[8.5px] font-mono font-bold text-cyan-400 mt-1 leading-none uppercase tracking-wider">AI</span>
                      </button>
                    </div>

                    {/* Unified Selector: Cinema Feed vs Community Portfolios */}
                    <div className="grid grid-cols-2 p-1 bg-black/80 rounded-xl border border-gray-900 shrink-0">
                      <button
                        onClick={() => setWorksSubTab("feed")}
                        className={`py-2 text-[10px] uppercase font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer text-center ${
                          worksSubTab === "feed"
                            ? "bg-cyan-950/80 text-cyan-400 border border-cyan-800/40 shadow-sm"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        🎥 {lang === "en" ? "Cinema Feed" : "فیدی بەرهەمەکان"}
                      </button>
                      <button
                        onClick={() => setWorksSubTab("portfolios")}
                        className={`py-2 text-[10px] uppercase font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer text-center ${
                          worksSubTab === "portfolios"
                            ? "bg-cyan-950/80 text-cyan-400 border border-cyan-800/40 shadow-sm"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        📂 {lang === "en" ? "Crew Portfolios" : "پۆرتفۆلیۆی ستاف"}
                      </button>
                    </div>

                    {worksSubTab === "feed" ? (
                      <>
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

                        {/* Inline AI panel relocated to floating top-corner Chat Overlay/Modal */}

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
                              <div key={movie.id} className="bg-[#050505] border border-gray-900 p-3 rounded-xl flex gap-3 relative overflow-hidden items-center group">
                                {movie.backdropUrl && (
                                  <div 
                                    onClick={() => {
                                      setZoomedImage(movie.backdropUrl);
                                      setZoomScale(1);
                                    }}
                                    className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-950 border border-gray-900/60 shadow-[0_0_10px_rgba(0,0,0,0.5)] relative cursor-zoom-in group-hover:border-cyan-500/30 transition-all text-center self-start"
                                    title="Click to Zoom Frame"
                                  >
                                    <img 
                                      src={movie.backdropUrl} 
                                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" 
                                      alt={movie.title} 
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="text-[7px] font-mono text-cyan-400 font-bold">ZOOM</span>
                                    </div>
                                  </div>
                                )}
                                <div className="space-y-1 flex-1 text-left min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[8px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded uppercase font-mono border border-cyan-900/40 font-bold truncate">
                                      {movie.genre || (movie.indie ? currentT.indie : currentT.globalPro)}
                                    </span>
                                    <span className="text-[8px] text-gray-500 font-mono font-semibold uppercase tracking-wider shrink-0">
                                      BY {movie.director.split(" ")[0]}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-white mt-1 leading-tight truncate">{movie.title}</h4>
                                  <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{movie.description}</p>
                                  
                                  {/* Tags displaying inside feed card */}
                                  {movie.tags && movie.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1 font-mono">
                                      {movie.tags.map((tag) => (
                                        <span key={tag} className="text-[8.5px] text-[#00f0ff] bg-cyan-950/20 px-1 rounded">
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-950 mt-1">
                                    <span className="text-[8.5px] text-gray-500 font-mono font-medium">
                                      🕒 {getRelativeTime(movie.createdAt, lang)}
                                    </span>
                                    <button 
                                      onClick={() => handleStartDMFromFeed(movie)}
                                      className="ml-auto flex items-center gap-1 px-2.5 py-1 text-[9px] bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/40 text-cyan-400 rounded-lg cursor-pointer transition-all hover:scale-[1.04] shrink-0 font-bold uppercase tracking-wider font-mono shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                                      title="Instant Direct Message"
                                    >
                                      <Send className="w-2.5 h-2.5" />
                                      {lang === "en" ? "Message" : "نامە"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                      </>
                    ) : (
                      /* PORTFOLIOS SUB-TAB: The community portfolio items grid */
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h2 className="text-xs uppercase font-mono tracking-widest text-[#00f0ff] font-bold">
                            {lang === "en" ? "Unified Portfolios Showcase" : "نشینگەی پۆرتفۆلیۆی گشتی"}
                          </h2>
                          <p className="text-[10px] text-gray-500 leading-normal">
                            {lang === "en" 
                              ? "Browse high-precision masterworks uploaded by verified workspace creators." 
                              : "سەیری کارە تەکنیکییە ئاستبەرزەکانی سینەماکارە ڕێپێدراوەکان بکە."}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {(() => {
                            const communityPortfolioItems = creators.flatMap(creator => 
                              creator.portfolio.map(portItem => ({
                                ...portItem,
                                creatorId: creator.id,
                                creatorName: creator.name,
                                creatorAvatar: creator.avatarUrl,
                                creatorRole: creator.role
                              }))
                            );
                            
                            const userPortfolioItems = myProfile.portfolio.map(portItem => ({
                              ...portItem,
                              creatorId: "me",
                              creatorName: myProfile.name,
                              creatorAvatar: myProfile.avatarUrl,
                              creatorRole: myProfile.role
                            }));
                            
                            const allUnifiedPortfolios = [...userPortfolioItems, ...communityPortfolioItems];
                            
                            if (allUnifiedPortfolios.length === 0) {
                              return (
                                <div className="col-span-2 py-12 text-center text-xs text-gray-500 font-mono uppercase tracking-wider border border-dashed border-gray-900/40 rounded-2xl">
                                  {lang === "en" ? "No portfolios found" : "هیچ پۆرتفۆلیۆیەک نییە"}
                                </div>
                              );
                            }
                            
                            return allUnifiedPortfolios.map((item, index) => (
                              <div 
                                key={`${item.id}-${index}`}
                                className="group bg-[#060606] border border-gray-950 rounded-xl overflow-hidden cursor-pointer relative hover:border-cyan-500/20 transition-all flex flex-col h-full shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                              >
                                <div 
                                  onClick={() => setActiveLightboxImage(item.url)}
                                  className="aspect-video relative overflow-hidden bg-black shrink-0 relative cursor-zoom-in"
                                  title="Expand Project Image"
                                >
                                  <img 
                                    src={item.url} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                                    alt={item.title} 
                                    referrerPolicy="no-referrer"
                                  />
                                  {item.type === "video" && (
                                    <span className="absolute top-1.5 right-1.5 bg-black/80 text-cyan-400 text-[7px] font-mono border border-cyan-900/40 px-1 rounded font-bold tracking-widest">
                                      SHOWREEL
                                    </span>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40" />
                                </div>
                                <div className="p-2.5 text-left flex-1 flex flex-col justify-between">
                                  <div className="space-y-0.5">
                                    <h4 
                                      onClick={() => setActiveLightboxImage(item.url)}
                                      className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors"
                                    >
                                      {item.title}
                                    </h4>
                                    {item.description && (
                                      <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 pt-2 border-t border-gray-950 mt-2.5 shrink-0">
                                    <div 
                                      className="flex items-center gap-1.5 min-w-0 flex-1 hover:text-cyan-300 transition-all cursor-pointer"
                                      onClick={() => {
                                        if (item.creatorId !== "me") {
                                          setSelectedCreatorId(item.creatorId);
                                        }
                                      }}
                                    >
                                      <img src={item.creatorAvatar} className="w-5 h-5 rounded-full object-cover border border-gray-900 shrink-0" alt="" referrerPolicy="no-referrer" />
                                      <div className="min-w-0 flex-1">
                                        <p className="text-[9.5px] font-bold text-gray-300 truncate leading-none">{item.creatorName}</p>
                                        <p className="text-[7.5px] text-cyan-400 font-mono truncate leading-none mt-0.5">{item.creatorRole || "Verified Artist"}</p>
                                      </div>
                                    </div>
                                    
                                    {item.creatorId !== "me" && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const originalCreatorObj = creators.find(c => c.id === item.creatorId);
                                          if (originalCreatorObj) {
                                            handleStartDM(originalCreatorObj);
                                          } else {
                                            const dynamicMovieDummy: Movie = {
                                              id: `m-dyn-${Date.now()}`,
                                              title: item.title,
                                              year: "2026",
                                              genre: item.creatorRole || "Videographer",
                                              description: item.description || "Portfolio item collaboration",
                                              director: item.creatorName,
                                              rating: "5.0",
                                              backdropUrl: item.url,
                                              indie: true
                                            };
                                            handleStartDMFromFeed(dynamicMovieDummy);
                                          }
                                        }}
                                        className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 border border-cyan-800/40 p-1.5 rounded-lg transition-transform active:scale-95 cursor-pointer shrink-0"
                                        title="Send message to creator"
                                      >
                                        <Send className="w-2.5 h-2.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB SAKO */}
                {activeTab === "sako" && (
                  <div className="p-4 space-y-6 flex-1 flex flex-col text-left">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h2 className="text-sm uppercase font-mono tracking-widest text-[#00f0ff] font-bold">{currentT.navSako}</h2>
                        <p className="text-xs text-gray-500">
                          {lang === "en" 
                            ? "Discover and book verified film artists." 
                            : "باشترین و بەناوبانگترین سینەماکاران بدۆزەرەوە."}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <select
                          id="role-filter-select"
                          value={selectedRoleFilter}
                          onChange={(e) => setSelectedRoleFilter(e.target.value)}
                          className="bg-black text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider rounded-lg p-1.5 border border-cyan-800/50 focus:outline-none focus:border-cyan-400 cursor-pointer"
                        >
                          <option value="All">All</option>
                          <option value="Athlete">Athlete</option>
                          <option value="Videographer">Videographer</option>
                          <option value="Editor">Editor</option>
                          <option value="Designer">Designer</option>
                        </select>
                      </div>
                    </div>

                    {/* Filter chips for instant visual action */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {["All", "Athlete", "Videographer", "Editor", "Designer"].map((role) => (
                        <button
                          key={role}
                          onClick={() => setSelectedRoleFilter(role)}
                          className={`text-[9px] font-mono uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                            selectedRoleFilter === role 
                              ? "bg-cyan-950 text-cyan-400 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.1)]" 
                              : "bg-[#050505] text-gray-400 border-gray-900 hover:border-gray-800"
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {(() => {
                        const filtered = creators.filter((c) => {
                          if (selectedRoleFilter === "All") return true;
                          const roleLower = c.role.toLowerCase();
                          const filterLower = selectedRoleFilter.toLowerCase();
                          return roleLower.includes(filterLower);
                        });
                        
                        if (filtered.length === 0) {
                          return (
                            <div className="col-span-2 py-10 text-center text-xs text-gray-500 font-mono uppercase tracking-wider border border-dashed border-gray-900 rounded-2xl">
                              {lang === "en" ? "No profiles found for this role" : "هیچ پرۆفایلێک بۆ ئەم جۆرە نەدۆزرایەوە"}
                            </div>
                          );
                        }
                        
                        return filtered.map((c) => (
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
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {/* TAB VIDEOS (REELS/SHORTS STYLE DISPLAY) */}
                {activeTab === "videos" && (
                  <div className="absolute inset-x-0 top-0 bottom-16 bg-black flex flex-col z-20 overflow-hidden">
                    {/* Header Overlay */}
                    <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/95 via-black/30 to-transparent px-4 py-4.5 flex justify-between items-center z-30 pointer-events-none">
                      <div className="text-left">
                        <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 leading-none">
                          <Clapperboard className="w-4 h-4 text-cyan-400 animate-pulse" />
                          <span>{lang === "en" ? "Cinematic Feed" : "ڤیدیۆکانی کار"}</span>
                        </h2>
                        <p className="text-[8px] text-gray-400 font-mono tracking-wider uppercase mt-1.5 leading-none">
                          {lang === "en" ? "SWIPE VERTICALLY FOR RAW REELS" : "بۆ سەرەوە بیبەم بۆ بینینی فیلمەکان"}
                        </p>
                      </div>
                    </div>

                    {/* Reels Vertical Snap-Scroller */}
                    <div className="flex-1 w-full bg-black overflow-y-scroll snap-y snap-mandatory select-none no-scrollbar h-full">
                      {reels.map((reel) => (
                        <InstagramReelCard
                          key={reel.id}
                          reel={reel}
                          lang={lang}
                          followingIds={followingIds}
                          setFollowingIds={setFollowingIds}
                          setReels={setReels}
                          creators={creators}
                          setCreators={setCreators}
                          handleStartDM={handleStartDM}
                          setChatInputText={setChatInputText}
                          activeReelCommentsId={activeReelCommentsId}
                          setActiveReelCommentsId={setActiveReelCommentsId}
                          newReelComment={newReelComment}
                          setNewReelComment={setNewReelComment}
                          myProfile={myProfile}
                          showToast={showToast}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CHAT */}
                {activeTab === "chat" && (
                  <div className="flex-1 flex flex-row h-full min-h-0 divide-x divide-gray-900">
                    {/* Conversations Sidebar List */}
                    {activeConvId === null && (
                      <div className="w-full sm:w-24 shrink-0 flex flex-col bg-black/40 py-2 divide-y divide-gray-950 overflow-y-auto no-scrollbar">
                        <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest pb-2 text-center">{currentT.activeDms}</p>
                        
                        {/* Create Group Button */}
                        <button
                          onClick={() => {
                            setGroupName("");
                            setSelectedGroupMembers([]);
                            setShowGroupModal(true);
                          }}
                          className="py-3 px-1 my-1 mx-2 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-850/30 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer text-cyan-400 font-mono shrink-0 hover:scale-[1.03] active:scale-95"
                        >
                          <UserPlus className="w-4 h-4 mb-1" />
                          <span className="text-[8px] font-bold uppercase tracking-wider">{lang === "en" ? "+ Group" : "+ گرووپ"}</span>
                        </button>

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
                    )}

                    {/* Chat Window Panel */}
                    <div className="flex-1 flex flex-col bg-black/60 relative">
                      {activeConvId ? (
                        (() => {
                          const activeConv = conversations.find((c) => c.id === activeConvId);
                          if (!activeConv) return null;
                          return (
                            <div className="flex-1 flex flex-col min-h-0">
                              {/* Thread top banner with Custom Full-Screen Back Interaction */}
                              <div className="px-4 py-3 bg-black border-b border-gray-950 flex items-center gap-3 shrink-0">
                                <button 
                                  onClick={() => setActiveConvId(null)}
                                  className="p-1 text-cyan-400 hover:text-white cursor-pointer active:scale-90"
                                >
                                  <ChevronLeft className="w-5 h-5" />
                                </button>
                                
                                <img src={activeConv.creatorAvatar} className="w-8 h-8 rounded-lg object-cover border border-gray-850 shrink-0" alt="" />
                                
                                <div className="text-left flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-white leading-tight truncate">{activeConv.creatorName}</h4>
                                  <p className="text-[9px] font-mono text-cyan-400 leading-none mt-1 truncate">{activeConv.creatorRole}</p>
                                </div>
                              </div>

                              {/* Message bubble track fully expanded in viewport */}
                              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                                {activeConv.messages.map((m) => {
                                  const isMe = m.senderId === "me";
                                  const senderCreator = activeConv.isGroup && !isMe 
                                    ? creators.find(cr => cr.id === m.senderId)
                                    : null;

                                  return (
                                    <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                      {senderCreator && (
                                        <div className="flex items-center gap-1 mb-1 px-1">
                                          <img src={senderCreator.avatarUrl} className="w-3.5 h-3.5 rounded-full object-cover border border-cyan-800/40" alt="" />
                                          <span className="text-[8px] font-mono text-cyan-400 font-bold">{senderCreator.name}</span>
                                        </div>
                                      )}
                                      <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-xs text-left ${isMe ? "bg-cyan-950/70 text-cyan-400 border border-cyan-500/20 rounded-tr-none" : "bg-gray-950 text-gray-300 border border-gray-900 rounded-tl-none"}`}>
                                        {m.text && !m.mediaUrl && !m.liveLocation && (
                                          <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                                        )}

                                        {m.mediaUrl && (
                                          <div className="space-y-1.5 max-w-full">
                                            {m.mediaType === "video" ? (
                                              <div className="rounded-xl overflow-hidden max-w-[200px] aspect-video bg-black/80 border border-cyan-955/30 relative">
                                                <video src={m.mediaUrl} controls autoPlay loop muted className="w-full h-full object-cover" />
                                              </div>
                                            ) : (
                                              <div 
                                                className="rounded-xl overflow-hidden max-w-[200px] aspect-video bg-black/80 border border-gray-900 relative group cursor-pointer"
                                                onClick={() => {
                                                  setZoomedImage(m.mediaUrl);
                                                  setZoomScale(1);
                                                }}
                                              >
                                                <img src={m.mediaUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                  <span className="text-[7.5px] font-mono text-cyan-400 bg-black/90 px-1.5 py-0.5 rounded border border-cyan-800">CLICK TO ZOOM</span>
                                                </div>
                                              </div>
                                            )}
                                            <p className="text-[9px] text-gray-400 italic font-mono leading-tight">{m.text}</p>
                                          </div>
                                        )}

                                        {m.liveLocation && (
                                          <LiveLocationBubble 
                                            lat={m.liveLocation.lat} 
                                            lng={m.liveLocation.lng} 
                                            expiresAt={m.liveLocation.expiresAt} 
                                            lang={lang} 
                                          />
                                        )}
                                      </div>
                                      <span className="text-[8px] font-mono text-gray-500 mt-1 uppercase tracking-wider">{m.timestamp}</span>
                                    </div>
                                  );
                                })}
                                <div ref={chatBottomRef} />
                              </div>

                              {/* Chat typing field */}
                              <div className="p-3 bg-[#060606] border-t border-gray-950 shrink-0">
                                <div className="flex items-center gap-1.5 bg-black rounded-xl p-1.5 border border-gray-900 focus-within:border-cyan-400/40">
                                  <input 
                                    type="text" 
                                    placeholder={currentT.chatInputPlaceholder}
                                    value={chatInputText}
                                    onChange={(e) => setChatInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    className="flex-1 bg-transparent text-xs text-white px-2 focus:outline-none placeholder-gray-600 min-w-0"
                                  />
                                  
                                  <input 
                                    type="file" 
                                    ref={chatMediaInputRef}
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleSendMediaMessage(e.target.files[0]);
                                      }
                                    }}
                                  />
                                  
                                  <button 
                                    type="button"
                                    onClick={() => chatMediaInputRef.current?.click()}
                                    className="text-gray-500 hover:text-cyan-400 p-1 rounded transition-colors cursor-pointer shrink-0"
                                    title="Send Photo or Video"
                                  >
                                    <ImageIcon className="w-4 h-4" />
                                  </button>
                                  
                                  <button 
                                    type="button"
                                    onClick={handleSendLiveLocation}
                                    className="text-gray-500 hover:text-cyan-400 p-1 rounded transition-colors cursor-pointer shrink-0"
                                    title="Share 10-Min Live Location"
                                  >
                                    <Navigation className="w-4 h-4" />
                                  </button>

                                  <button 
                                    onClick={handleSendMessage}
                                    className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 p-2 rounded-lg border border-cyan-400/20 cursor-pointer shrink-0"
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
                    <div className="flex items-center justify-between border-b border-gray-900/60 pb-3">
                      <button
                        type="button"
                        id="profile-settings-btn"
                        onClick={() => setIsSettingsOpen(true)}
                        className="bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/20 text-cyan-400 p-2.5 rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center shrink-0"
                        title={lang === "en" ? "Settings" : "ڕێکخستنەکان"}
                      >
                        <Settings className="w-4.5 h-4.5" />
                      </button>
                      <h2 className="text-sm uppercase font-mono tracking-widest text-[#00f0ff] font-bold text-center flex-1">
                        {currentT.navMyProfile}
                      </h2>
                      <div className="w-9.5 h-9.5 shrink-0" /> {/* Spacer */}
                    </div>

                    {/* Self profile layout rendering - REDESIGNED PROPORTIONAL PROFILE CARD */}
                    <div className="space-y-4">
                      {/* Centered Circular Avatar and Identity layout */}
                      <div className="bg-[#080808] border border-gray-900 rounded-2xl px-6 py-8 md:px-8 md:py-10 w-full max-w-xl mx-auto flex flex-col items-center text-center gap-5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all">
                        <input 
                          type="file" 
                          ref={profileImgInputRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleProfilePhotoChange(e.target.files[0]);
                            }
                          }}
                          accept="image/*"
                          className="hidden"
                        />
                        
                        {/* perfectly circular avatar placed directly above description/bio */}
                        <div className="relative group/avatar shrink-0 mb-1">
                          <img 
                            src={myProfile.avatarUrl} 
                            className="w-24 h-24 rounded-full object-cover border border-cyan-400 bg-black shadow-[0_0_20px_rgba(6,182,212,0.25)] group-hover/avatar:border-cyan-300 transition-all duration-300" 
                            alt="" 
                          />
                          <button 
                            type="button"
                            onClick={() => profileImgInputRef.current?.click()}
                            className="absolute inset-0 bg-black/75 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center rounded-full transition-all text-cyan-400 cursor-pointer border border-cyan-400/30"
                            title="Change Photo"
                          >
                            <Camera className="w-5 h-5" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => profileImgInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 bg-cyan-950 text-cyan-400 p-1.5 rounded-full border border-cyan-850 hover:bg-cyan-900 shadow-md cursor-pointer flex items-center justify-center"
                            title="Change Photo"
                          >
                            <Camera className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">{myProfile.name}</h3>
                          
                          {/* Centered Role Badge */}
                          <div className="flex justify-center pt-0.5">
                            <span className="inline-block text-[9px] uppercase tracking-widest font-mono text-cyan-400 font-bold bg-cyan-950/65 px-3 py-1 rounded-md border border-cyan-800/25">
                              {myProfile.role}
                            </span>
                          </div>

                          <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-1 leading-none">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
                            {myProfile.location}
                          </p>
                        </div>

                        {/* Interactive Followers & Following counts next to/below avatar alongside views */}
                        <div className="flex items-center justify-center gap-4 py-2 px-4 rounded-xl bg-black/45 border border-gray-900/60 flex-wrap max-w-sm mt-1">
                          <button
                            id="header-followers-stats"
                            type="button"
                            onClick={() => {
                              setModalUserList({
                                title: lang === "en" ? "My Followers" : "فۆڵۆوەرەکانم",
                                users: followsMap["me"]?.followers || []
                              });
                            }}
                            className="hover:text-cyan-400 text-gray-300 transition-colors cursor-pointer text-left flex items-baseline gap-1"
                          >
                            <span className="text-xs sm:text-sm font-bold font-mono text-cyan-400">{getFollowersCount("me")}</span>
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold font-mono">{lang === "en" ? "Followers" : "فۆڵۆوەران"}</span>
                          </button>
                          
                          <span className="text-gray-800 font-bold text-xs">•</span>
                          
                          <button
                            id="header-following-stats"
                            type="button"
                            onClick={() => {
                              setModalUserList({
                                title: lang === "en" ? "Following Users" : "فۆڵۆوکراوەکان",
                                users: followsMap["me"]?.following || []
                              });
                            }}
                            className="hover:text-cyan-400 text-gray-300 transition-colors cursor-pointer text-left flex items-baseline gap-1"
                          >
                            <span className="text-xs sm:text-sm font-bold font-mono text-cyan-400">{getFollowingCount("me")}</span>
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold font-mono">{lang === "en" ? "Following" : "فۆڵۆوکراو"}</span>
                          </button>

                          <span className="text-gray-800 font-bold text-xs">•</span>

                          <div className="flex items-baseline gap-1">
                            <span className="text-xs sm:text-sm font-bold font-mono text-cyan-400">{myProfile.views}</span>
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold font-mono">{currentT.views}</span>
                          </div>
                        </div>

                        {/* Description / Bio Section located directly below the circular avatar elements */}
                        <div className="w-full text-center space-y-1.5 bg-black/40 border border-gray-900 px-4 py-3 pb-4 rounded-xl mt-1">
                          <h4 className="text-[9px] uppercase font-mono tracking-widest text-cyan-400 font-bold">{currentT.bioTitle}</h4>
                          <p className="text-xs text-gray-300 leading-relaxed font-normal">{myProfile.bio}</p>
                        </div>
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
          {!(activeTab === "chat" && activeConvId !== null) && (
            <div 
              className="absolute bottom-0 inset-x-0 bg-[#030303]/98 backdrop-blur-md border-t border-gray-900 h-16 flex items-stretch justify-around z-50"
            >
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
                id="nav-tab-plus"
                type="button"
                onClick={() => setShowAddPostModal(true)}
                className="flex-1 flex flex-col items-center justify-center transition-all cursor-pointer text-cyan-400 hover:text-white"
              >
                <div className="bg-cyan-950/50 hover:bg-cyan-900/60 p-2 rounded-full border border-cyan-800/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-[8px] font-mono font-bold mt-1 uppercase tracking-widest">{lang === "en" ? "New" : "نوێ"}</span>
              </button>

              <button 
                id="nav-tab-videos"
                onClick={() => {
                  setActiveTab("videos");
                  setSelectedCreatorId(null);
                }}
                className={`flex-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${activeTab === "videos" ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
              >
                <Clapperboard className="w-5 h-5 animate-pulse" />
                <span className="text-[9px] font-mono font-bold mt-1 uppercase tracking-widest">{lang === "en" ? "Videos" : "ڤیدیۆ"}</span>
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
          )}

          {/* NEW POST MODAL */}
          {showAddPostModal && (
            <div className="fixed inset-0 bg-[#020202]/92 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fadeIn">
              <div className="bg-[#080808] border border-cyan-500/20 rounded-2xl w-full max-w-md shadow-[0_0_80px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/20 text-left overflow-hidden flex flex-col">
                
                {/* Header resembling Facebook's composer header */}
                <div className="flex items-center justify-between border-b border-gray-900 p-4 shrink-0 bg-[#060606]">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-[#00f0ff] font-bold">
                    {lang === "en" ? "Create Post" : "دروستکردنی پۆست"}
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setShowAddPostModal(false)}
                    className="bg-gray-950 hover:bg-gray-900 border border-gray-900 text-gray-500 hover:text-white transition-all rounded-full p-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveNewPost} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[80vh] no-scrollbar">
                  
                  {/* Persona Identifier at Top */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={myProfile.avatarUrl} 
                      className="w-10 h-10 rounded-full object-cover border border-cyan-500/20 shadow-md referrer-no-referrer" 
                      alt="Creator Avatar" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white leading-none">{myProfile.name}</h4>
                      <p className="text-[9px] font-mono text-cyan-400 flex items-center gap-1 mt-1 leading-none">
                        <Globe className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                        {lang === "en" ? "Public / Workspace" : "گشتی / شوێنی کار"}
                      </p>
                    </div>
                  </div>

                  {/* Facebook style title input */}
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      required
                      className="w-full bg-transparent text-sm font-bold text-white border-b border-gray-900 pb-2 focus:outline-none focus:border-cyan-400/40 placeholder-gray-600 transition-colors" 
                      placeholder={lang === "en" ? "Project Title / Head ..." : "ناونیشانی کارەکە تاپۆ بکە..."}
                      value={newPostTitle} 
                      onChange={(e) => setNewPostTitle(e.target.value)} 
                    />
                  </div>

                  {/* Large text caption/desc area */}
                  <div className="space-y-1">
                    <textarea 
                      className="w-full bg-transparent text-xs text-gray-200 focus:outline-none placeholder-gray-600 h-20 resize-none leading-relaxed" 
                      placeholder={lang === "en" ? "What's on your cinematic mind, Vanya?" : "چی لە خەیاڵی داهێنەرانەی سینەماییتدایە...؟"}
                      value={newPostDesc} 
                      onChange={(e) => setNewPostDesc(e.target.value)} 
                    />
                  </div>

                  {/* Side-by-side meta metadata options */}
                  <div className="grid grid-cols-2 gap-3 pb-1">
                    <div className="space-y-1">
                      <label className="text-gray-500 font-mono font-bold uppercase tracking-wider text-[8px]">
                        {lang === "en" ? "Category / Role" : "جۆر / دەور"}
                      </label>
                      <select 
                        className="w-full bg-black rounded-lg p-2 border border-gray-900 text-white focus:outline-none focus:border-cyan-400/40 transition-colors cursor-pointer text-[11px]"
                        value={newPostCategory} 
                        onChange={(e) => setNewPostCategory(e.target.value)}
                      >
                        <option value="Artist">{lang === "en" ? "Artist" : "سینەماکار"}</option>
                        <option value="Videographer">{lang === "en" ? "Videographer" : "وێنەگر"}</option>
                        <option value="Editor">{lang === "en" ? "Editor" : "مۆنتێر"}</option>
                        <option value="Designer">{lang === "en" ? "Designer" : "دیزاینەر"}</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-500 font-mono font-bold uppercase tracking-wider text-[8px]">
                        {lang === "en" ? "Year" : "ساڵ"}
                      </label>
                      <input 
                        type="text" 
                        className="w-full bg-black rounded-lg p-2 border border-gray-900 text-white focus:outline-none focus:border-cyan-400/40 transition-colors text-[11.5px]" 
                        value={newPostYear} 
                        onChange={(e) => setNewPostYear(e.target.value)} 
                      />
                    </div>
                  </div>

                  {/* Facebook-style Tagging section (Capsules selector) */}
                  <div className="space-y-1.5 pb-1 border-t border-gray-950 pt-3">
                    <label className="text-gray-500 font-mono font-medium uppercase tracking-wider text-[8.5px]">
                      {lang === "en" ? "Add Hashtags" : "زیادکردنی تاگ یان هاشتاگ"}
                    </label>
                    <div className="flex items-center gap-1.5 bg-black rounded-xl p-1.5 border border-gray-900 focus-within:border-cyan-400/50">
                      <input
                        type="text"
                        className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-gray-700"
                        placeholder={lang === "en" ? "Type tag & press enter/button..." : "بنووسە و دوگمەکە دابگرە..."}
                        value={newPostTagInput}
                        onChange={(e) => setNewPostTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newPostTagInput.trim()) {
                              const cleanTag = newPostTagInput.trim().replace(/^#+/, "");
                              if (!newPostTags.includes(cleanTag)) {
                                setNewPostTags(prev => [...prev, cleanTag]);
                              }
                              setNewPostTagInput("");
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newPostTagInput.trim()) {
                            const cleanTag = newPostTagInput.trim().replace(/^#+/, "");
                            if (!newPostTags.includes(cleanTag)) {
                              setNewPostTags(prev => [...prev, cleanTag]);
                            }
                            setNewPostTagInput("");
                          }
                        }}
                        className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-400 py-1 px-2.5 rounded-lg text-[9.5px] font-bold uppercase cursor-pointer"
                      >
                        {lang === "en" ? "+ Add" : "+ زیادکردن"}
                      </button>
                    </div>
                    
                    {/* Active tag pills list */}
                    {newPostTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {newPostTags.map((tag) => (
                          <span 
                            key={tag} 
                            className="text-[9px] font-mono text-cyan-400 bg-cyan-950/35 border border-cyan-900/40 rounded-lg px-2 py-0.5 flex items-center gap-1.5 shrink-0"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => setNewPostTags(prev => prev.filter(t => t !== tag))}
                              className="text-gray-400 hover:text-red-400 transition-colors rounded-full font-bold text-[10px] w-2.5 h-2.5 flex items-center justify-center cursor-pointer"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* MEDIA BOX SECTION (Facebook style "Add Media") */}
                  <div className="space-y-2 border-t border-gray-950 pt-3">
                    <label className="text-gray-500 font-mono font-medium uppercase tracking-wider text-[8.5px] flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-gray-500" />
                      {lang === "en" ? "Cover Frame Upload / Media" : "بارکردنی وێنەی پاشبنەما"}
                    </label>
                    <input 
                      type="file" 
                      ref={postImgInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePostPhotoUpload(e.target.files[0]);
                        }
                      }}
                    />
                    
                    {newPostPhoto ? (
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-black/60 border border-cyan-800/40">
                        <img src={newPostPhoto} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                        <button 
                          type="button" 
                          onClick={() => setNewPostPhoto("")}
                          className="absolute top-2 right-2 bg-black/80 rounded-full p-1 border border-cyan-800 text-cyan-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => postImgInputRef.current?.click()}
                        className="border border-dashed border-gray-900 hover:border-cyan-400/40 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-black/40 hover:bg-cyan-950/15 transition-all text-center group"
                      >
                        <ImageIcon className="w-5 h-5 text-gray-700 group-hover:text-cyan-400 transition-colors" />
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-gray-400 font-medium">{lang === "en" ? "Drag / Click to Add Photo" : "کلیک بکە بۆ بارکردنی وێنە"}</p>
                          <p className="text-[8.5px] text-gray-600">{lang === "en" ? "Supports PNG, JPG, WebP metadata" : "پشتیگیری فایلی وێنەیی دەکات"}</p>
                        </div>
                      </div>
                    )}

                    <div className="text-center font-mono text-[7px] text-gray-600">
                      — {lang === "en" ? "OR PASTE FRAME LINK" : "یاخود بەستەری ڕاستەوخۆ بنووسە"} —
                    </div>

                    <input 
                      type="text" 
                      className="w-full bg-black rounded-lg p-2 border border-gray-900 text-gray-300 focus:outline-none focus:border-cyan-400/45 transition-colors text-[10px]" 
                      placeholder="https://images.unsplash.com/..."
                      value={newPostPhoto} 
                      onChange={(e) => setNewPostPhoto(e.target.value)} 
                    />
                  </div>

                  {/* Submission and Action Bar resembling Facebook's publish strip */}
                  <div className="flex gap-2 justify-end pt-3 border-t border-gray-900">
                    <button 
                      type="button"
                      onClick={() => setShowAddPostModal(false)} 
                      className="px-4 py-2.5 rounded-xl text-xs bg-gray-950 text-gray-400 hover:bg-gray-900 border border-gray-900/60 transition-colors cursor-pointer font-mono font-semibold"
                    >
                      {lang === "en" ? "Cancel" : "پاشگەزبوونەوە"}
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-cyan-950 text-cyan-400 border border-cyan-850 hover:bg-cyan-900/80 transition-colors cursor-pointer font-mono font-bold text-center uppercase tracking-widest"
                    >
                      {lang === "en" ? "Publish Work" : "بڵاوکردنەوە"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* AI CHAT MODAL OVERLAY */}
          <AnimatePresence>
            {isAIChatOpen && (
              <motion.div
                id="ai-chat-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-[#020202]/92 backdrop-blur-md flex items-center justify-center p-4 z-[100]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 35, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 35, scale: 0.96 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.5 }}
                  className="bg-[#080808] border border-cyan-500/20 rounded-2xl w-full max-w-lg shadow-[0_0_80px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/20 text-left overflow-hidden flex flex-col h-[85vh] max-h-[750px]"
                >
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-900 p-4 shrink-0 bg-[#060606]">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-cyan-950/60 rounded-xl border border-cyan-800/40 text-cyan-400">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xs uppercase font-mono tracking-widest text-[#00f0ff] font-bold leading-none">
                        {lang === "en" ? "AI Cinema Partner" : "هاوبەشی سینەمایی بگری"}
                      </h3>
                      <p className="text-[10px] text-gray-500 font-mono mt-1.5 leading-none">
                        {currentT.moodSearchSub}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {aiConversationContext.length > 0 && (
                      <button
                        id="clear-ai-context"
                        onClick={() => {
                          setAiConversationContext([]);
                          setAiPartnerResponse(null);
                          setMoodSearchResults([]);
                          showToast(lang === "ckb" ? "گفتوگۆکە پاککرایەوە" : "Conversation logs cleared.");
                        }}
                        className="text-[10px] uppercase font-mono text-gray-500 hover:text-cyan-400 p-2 hover:bg-gray-950 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title={lang === "ckb" ? "پاککردنەوە" : "Clear chat"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{lang === "ckb" ? "پاککردنەوە" : "Clear"}</span>
                      </button>
                    )}
                    <button 
                      type="button" 
                      id="close-ai-chat"
                      onClick={() => setIsAIChatOpen(false)}
                      className="bg-gray-950 hover:bg-gray-900 border border-gray-900 text-gray-500 hover:text-white transition-all rounded-full p-2 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-black/40">
                  {/* If history is empty, show a pleasant welcome screen with quick suggestions */}
                  {aiConversationContext.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-75" />
                        <div className="w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2 max-w-sm">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                          {lang === "en" ? "How can I help you, Creator?" : "چۆن دەتوانم هاوکاریت بکەم، سینەماکار؟"}
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {lang === "en" 
                            ? "I can brainstorm script concepts, design colors based on lighting moods, recommend reference films, or search specific plots." 
                            : "من دەتوانم بیرۆکەی نوێی سیناریۆ پێشنیار بکەم، یان هاوکارت بم لە دۆزینەوەی فیلمە دڵخوازە دێرینەکان."}
                        </p>
                      </div>

                      {/* Quick suggestions */}
                      <div className="space-y-2 w-full max-w-md pt-2 text-left">
                        <span className="text-[9px] uppercase font-mono tracking-wider text-gray-600 block text-center">
                          {currentT.quickPrompts}
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            {
                              label: lang === "ckb" ? "بیرۆکەی نوار" : "Neon Cyberpunk Film Concept",
                              prompt: "Give me a neon cyberpunk movie concept based in Erbil, Kurdistan"
                            },
                            {
                              label: lang === "ckb" ? "فیلمی ڕەشەبا" : "Identify movie with a blackhole dock",
                              prompt: "Identify the movie where a crew docks into a spinning station near a blackhole"
                            },
                            {
                              label: lang === "ckb" ? "فیدباکی چیرۆک" : "Psychological Script Feedback",
                              prompt: "Give me creative feedback on an independent short film script about a video editor who can slice reality."
                            }
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setMoodSearchQuery(item.label);
                                handleMoodSearch(item.prompt);
                              }}
                              className="text-xs text-left text-gray-400 bg-[#0d0d0d] hover:text-cyan-400 hover:border-cyan-400/40 border border-gray-900 rounded-xl px-4 py-3 cursor-pointer transition-all hover:scale-[1.01] active:scale-99 flex items-center justify-between"
                            >
                              <span className="font-semibold truncate pr-2">{item.label}</span>
                              <ChevronLeft className="w-3.5 h-3.5 text-cyan-400/50 rotate-180 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Chat logs thread history */
                    <div className="space-y-4">
                      {aiConversationContext.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col space-y-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
                        >
                          <div className="flex items-center gap-1.5 px-1">
                            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest leading-none">
                              {msg.role === "user" ? (lang === "ckb" ? "تۆ" : "You") : (lang === "ckb" ? "هاوبەشی سینەمایی" : "Cinematic Partner")}
                            </span>
                            <span className="text-[8px] font-mono text-gray-600 leading-none">
                              {msg.timestamp}
                            </span>
                          </div>
                          <div
                            className={`rounded-2xl px-4 py-3 text-xs leading-relaxed max-w-[85%] ${
                              msg.role === "user"
                                ? "bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 text-left"
                                : "bg-[#0d0d0d] border border-gray-900 text-gray-200 text-left"
                            }`}
                          >
                            {msg.role === "user" ? (
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            ) : (
                              <div className="space-y-1 text-left prose-invert">
                                {renderFormattedResponse(msg.text)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Loading status */}
                      {isMoodSearching && (
                        <div id="ai-loading-state" className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center shrink-0">
                            <div className="w-3.5 h-3.5 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
                          </div>
                          <div className="rounded-2xl px-4 py-3 bg-[#0d0d0d] border border-gray-900 space-y-1 max-w-[80%]">
                            <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase animate-pulse leading-none font-bold">
                              {lang === "ckb" ? "پەیوەندیکردن بە هاوبەشی داهێنەر..." : "Consulting Creative Partner..."}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {lang === "ckb" ? "بەدەستهێنان و لێکدانەوەی ڕەگەزەکانی سینەما..." : "Formulating suggestions..."}
                            </p>
                          </div>
                        </div>
                      )}

                      {moodSearchError && (
                        <p className="text-xs text-red-400 bg-red-950/20 border border-red-950 p-3 rounded-xl">
                          {moodSearchError}
                        </p>
                      )}

                      {/* Dynamic Movie results (Cinematic Reference Deck) rendered inside modal context */}
                      {moodSearchResults.length > 0 && (
                        <div id="mood-results-box" className="space-y-3 pt-4 border-t border-gray-900">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-widest font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                              <Film className="w-3.5 h-3.5 text-cyan-400" />
                              {lang === "ckb" ? "فیلمە هاوشێوەکان" : "Cinematic Reference Deck"}
                            </span>
                            <button 
                              onClick={() => setMoodSearchResults([])}
                              className="text-[10px] font-mono text-gray-500 hover:text-gray-300 cursor-pointer border border-gray-800 rounded px-1.5 py-0.5"
                            >
                              {currentT.cancel}
                            </button>
                          </div>

                          <div className="space-y-3 pr-1">
                            {moodSearchResults.map((movie, index) => (
                              <div key={movie.id || index} className="bg-black/80 border border-gray-900/60 p-3.5 rounded-xl space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[8px] bg-cyan-950 border border-cyan-850 text-cyan-400 px-1 py-0.2 rounded uppercase font-mono font-bold">
                                      {movie.indie ? currentT.indie : currentT.globalPro}
                                    </span>
                                    <h4 className="text-xs font-bold text-white inline-block">
                                      {movie.title} ({movie.year})
                                    </h4>
                                  </div>
                                  <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap">⭐ {movie.rating}</span>
                                </div>

                                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                                  {movie.description}
                                </p>

                                <p className="text-[10px] text-gray-500 text-left">
                                  <strong className="text-gray-400 font-medium">Director:</strong> {movie.director}
                                </p>

                                {movie.matchReason && (
                                  <div className="bg-cyan-950/20 border-l-2 border-cyan-400 px-2 py-1 space-y-0.5 rounded-r">
                                    <p className="text-[9px] uppercase font-mono tracking-widest text-cyan-400 font-bold">{currentT.whyMatchesHeader}</p>
                                    <p className="text-[10px] text-cyan-300 leading-normal text-left">{movie.matchReason}</p>
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
                                          setIsAIChatOpen(false);
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
                  )}
                </div>

                {/* Footer Input Area */}
                <div className="p-4 border-t border-gray-900 shrink-0 bg-[#060606] space-y-2">
                  <div className="flex items-center gap-2 bg-black/60 rounded-xl p-1.5 border border-gray-950 focus-within:border-cyan-400/50 transition-colors">
                    <input 
                      id="mood-search-input"
                      type="text" 
                      placeholder={currentT.moodInputPlaceholder}
                      value={moodSearchQuery}
                      onChange={(e) => setMoodSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && moodSearchQuery.trim()) {
                          handleMoodSearch(moodSearchQuery);
                        }
                      }}
                      className="flex-1 bg-transparent text-xs text-white px-2 focus:outline-none placeholder-gray-600 font-sans"
                    />
                    <button 
                      id="submit-mood-search"
                      onClick={() => handleMoodSearch(moodSearchQuery)}
                      disabled={isMoodSearching || !moodSearchQuery.trim()}
                      className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 p-2.5 rounded-lg border border-cyan-400/30 transition-all disabled:opacity-30 disabled:hover:bg-cyan-950 cursor-pointer shrink-0"
                    >
                      {isMoodSearching ? (
                        <div className="w-3.5 h-3.5 border-2 border-cyan-400/25 border-t-cyan-400 rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* IMAGE LIGHTBOX ZOOM OVERLAY */}
          {zoomedImage && (
            <div className="fixed inset-0 bg-black/95 z-[150] flex flex-col items-center justify-center p-4">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setZoomScale(prev => Math.max(1, prev - 0.5))}
                  className="bg-black/80 hover:bg-white/10 text-white px-3 py-2 rounded-full border border-gray-800 transition-all font-mono font-bold text-xs cursor-pointer"
                >
                  -
                </button>
                <button
                  onClick={() => setZoomScale(prev => Math.min(3, prev + 0.5))}
                  className="bg-black/80 hover:bg-white/10 text-white px-3 py-2 rounded-full border border-gray-800 transition-all font-mono font-bold text-xs cursor-pointer"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    setZoomedImage(null);
                    setZoomScale(1);
                  }}
                  className="bg-black/80 hover:bg-white/10 text-white p-2.5 rounded-full border border-gray-800 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div 
                className="max-w-full max-h-[82vh] overflow-auto flex items-center justify-center relative touch-none"
                onDoubleClick={() => setZoomScale(scale => scale === 1 ? 2 : 1)}
              >
                <img 
                  src={zoomedImage} 
                  style={{ transform: `scale(${zoomScale})`, transition: 'transform 0.2s ease-in-out' }}
                  className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl" 
                  alt="Zoomed Work Frame" 
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-[10px] text-gray-500 font-mono mt-4 uppercase tracking-widest text-center">
                {lang === "en" ? "Double-Tap to Quick Zoom 200% • Pinch/Use Buttons" : "دووجار کلیک بکە بۆ گەورەکردن • دوگمەکان بەکاربهێنە"}
              </p>
            </div>
          )}

          {/* FOLLOWERS / FOLLOWING LIST MODAL */}
          <AnimatePresence>
            {modalUserList && (
              <motion.div 
                id="user-list-modal-overlay" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-[#020202]/92 backdrop-blur-md flex items-center justify-center p-4 z-[110]"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 25, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 25, scale: 0.97 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.5 }}
                  className="bg-[#080808] border border-cyan-500/20 rounded-2xl w-full max-w-sm shadow-[0_0_85px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/20 text-left overflow-hidden flex flex-col h-[70vh] max-h-[500px]"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-gray-900 p-4 shrink-0 bg-[#060606]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs uppercase font-mono tracking-widest text-[#00f0ff] font-bold">
                        {modalUserList.title}
                      </h3>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setModalUserList(null)}
                      className="bg-gray-950 hover:bg-gray-900 border border-gray-900 text-gray-500 hover:text-white transition-all rounded-full p-1.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body with list of users */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-black/40">
                    {modalUserList.users.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <span className="text-gray-600 font-mono text-[11px] uppercase tracking-wider">
                          {lang === "en" ? "Empty List" : "لیستەکە بەتاڵە"}
                        </span>
                      </div>
                    ) : (
                      modalUserList.users.map((userId) => {
                        // Resolve user info
                        const isMe = userId === "me";
                        const userProfile = isMe 
                          ? { name: myProfile.name, avatarUrl: myProfile.avatarUrl, role: myProfile.role } 
                          : creators.find(c => c.id === userId);

                        if (!userProfile) return null;

                        return (
                          <div 
                            key={userId} 
                            className="bg-black/70 border border-gray-900/60 p-3 rounded-xl flex items-center justify-between gap-3 text-left"
                          >
                            {/* Profile Info Clickable (Name & Avatar takes to profile) */}
                            <div 
                              onClick={() => {
                                if (isMe) {
                                  setSelectedCreatorId(null);
                                  setActiveTab("my-profile");
                                } else {
                                  setSelectedCreatorId(userId);
                                }
                                setModalUserList(null);
                                showToast(lang === "en" ? `Viewing profile of ${userProfile.name}` : `سەیرکردنی پرۆفایلی ${userProfile.name}`);
                              }}
                              className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
                            >
                              <img 
                                src={userProfile.avatarUrl} 
                                className="w-9 h-9 rounded-lg object-cover border border-cyan-800/40 group-hover:border-cyan-400 group-hover:scale-105 transition-all shrink-0 bg-black" 
                                alt={userProfile.name} 
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors truncate">
                                  {userProfile.name} {isMe && <span className="text-[9px] text-cyan-400 bg-cyan-950/40 px-1.5 py-0.2 rounded font-mono ml-1">(You)</span>}
                                </h4>
                                <p className="text-[10px] text-gray-500 truncate">{userProfile.role}</p>
                              </div>
                            </div>

                            {/* Follow / Unfollow button next to each user (if not "me") */}
                            {!isMe && (
                              <button
                                type="button"
                                onClick={() => {
                                  toggleFollowCreator(userId);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${
                                  followingIds.includes(userId)
                                    ? "bg-gray-950/80 border-gray-800 text-gray-500"
                                    : "bg-cyan-950/40 border-cyan-500/30 text-cyan-400 hover:bg-cyan-900"
                                }`}
                              >
                                {followingIds.includes(userId) 
                                  ? (lang === "en" ? "Following" : "فۆڵۆو کراوە") 
                                  : (lang === "en" ? "Follow" : "فۆڵۆو")}
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SETTINGS OVERLAY MODAL */}
          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div 
                id="settings-modal-overlay" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-[#020202]/95 backdrop-blur-md flex items-center justify-center p-4 z-[120]"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 25, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 25, scale: 0.97 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.5 }}
                  className="bg-[#080808] border border-cyan-500/20 rounded-2xl w-full max-w-md shadow-[0_0_85px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/20 text-left overflow-hidden flex flex-col h-[85vh] max-h-[600px] text-xs"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-gray-905 p-4 shrink-0 bg-[#060606]">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                      <h3 className="text-[11px] uppercase font-mono tracking-widest text-[#00f0ff] font-bold">
                        {lang === "en" ? "Control & Settings" : "ڕێکخستن و کۆنترۆڵ"}
                      </h3>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setIsSettingsOpen(false)}
                      className="bg-gray-950 hover:bg-gray-900 border border-gray-900 text-gray-500 hover:text-white transition-all rounded-full p-1.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body - Scrollable content */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-black/40 no-scrollbar">
                    {/* 1. APP LANGUAGE */}
                    <div className="bg-[#0c0c0c] border border-gray-900 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#00f0ff] font-bold">
                          {lang === "en" ? "App Language" : "زمانی ئەپ"}
                        </h4>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-normal">
                        {lang === "en" 
                          ? "Select your interface language for the workspace." 
                          : "زمانی دڵخوازی خۆت دیاریبکە بۆ ڕووکاری کارکردنی ئەپەکە."}
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleSelectLanguage("en")}
                          className={`py-2 px-3 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                            lang === "en" 
                              ? "bg-cyan-950/45 text-cyan-400 border-cyan-500/40" 
                              : "bg-[#050505] text-gray-400 border-gray-900 hover:border-gray-800"
                          }`}
                        >
                          English (EN)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectLanguage("ckb")}
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            lang === "ckb" 
                              ? "bg-cyan-950/45 text-cyan-400 border-cyan-500/40" 
                              : "bg-[#050505] text-gray-400 border-gray-900 hover:border-gray-800"
                          }`}
                        >
                          کوردی (CKB)
                        </button>
                      </div>
                    </div>

                    {/* 2. EDIT PROFILE SECTION */}
                    <div className="bg-[#0c0c0c] border border-gray-900 rounded-xl p-4 space-y-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingMyProfile(!isEditingMyProfile);
                          setShowAddPortfolio(false);
                        }}
                        className="w-full flex items-center justify-between text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-2">
                          <Edit className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#00f0ff] font-bold">
                            {currentT.editProfileBtn}
                          </h4>
                        </div>
                        <span className="text-[10px] text-gray-500 hover:text-cyan-400 transition-colors">
                          {isEditingMyProfile ? (lang === "en" ? "Collapse" : "کۆکردنەوە") : (lang === "en" ? "Expand" : "ڕاکێشان")}
                        </span>
                      </button>

                      {isEditingMyProfile ? (
                        <div className="space-y-4 pt-3 border-t border-gray-900 text-xs">
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.name}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2.5 border border-gray-900 text-white focus:outline-none focus:border-cyan-500/40" value={editName} onChange={(e) => setEditName(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.role}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2.5 border border-gray-900 text-white focus:outline-none focus:border-cyan-500/40" value={editRole} onChange={(e) => setEditRole(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.location}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2.5 border border-gray-900 text-white focus:outline-none focus:border-cyan-500/40" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.bioTitle}</label>
                            <textarea className="w-full bg-black rounded-lg p-2.5 border border-gray-900 text-white focus:outline-none h-20 resize-none focus:border-cyan-500/40" value={editBio} onChange={(e) => setEditBio(e.target.value)} />
                          </div>
                          <div className="pt-1">
                            <button onClick={handleSaveProfile} className="w-full py-2.5 rounded-lg text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 font-mono font-semibold cursor-pointer">
                              {currentT.saveProfileBtn}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-500 leading-normal">
                          {lang === "en" ? "Update your cinematic name, location, and bio description details." : "زانیاری پێناسەی خۆت نوێبکەرەوە وەک ناو، کار یان شوێن."}
                        </p>
                      )}
                    </div>

                    {/* 3. ADD PORTFOLIO ASSET */}
                    <div className="bg-[#0c0c0c] border border-gray-900 rounded-xl p-4 space-y-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddPortfolio(!showAddPortfolio);
                          setIsEditingMyProfile(false);
                        }}
                        className="w-full flex items-center justify-between text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#00f0ff] font-bold">
                            {currentT.addAssetBtn}
                          </h4>
                        </div>
                        <span className="text-[10px] text-gray-500 hover:text-cyan-400 transition-colors">
                          {showAddPortfolio ? (lang === "en" ? "Collapse" : "کۆکردنەوە") : (lang === "en" ? "Expand" : "ڕاکێشان")}
                        </span>
                      </button>

                      {showAddPortfolio ? (
                        <div className="space-y-4 pt-3 border-t border-gray-900 text-xs">
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.assetTitle}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2.5 border border-gray-900 text-white focus:outline-none focus:border-cyan-500/40" placeholder="Lost Neon Studio still" value={newPortTitle} onChange={(e) => setNewPortTitle(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.assetUrl}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2.5 border border-gray-900 text-white focus:outline-none focus:border-cyan-500/40" placeholder="https://images.unsplash.com/..." value={newPortUrl} onChange={(e) => setNewPortUrl(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-gray-500 font-mono font-medium">{currentT.assetDesc}</label>
                            <input type="text" className="w-full bg-black rounded-lg p-2.5 border border-gray-900 text-white focus:outline-none focus:border-cyan-500/40" placeholder="Rec.709 color suite test" value={newPortDesc} onChange={(e) => setNewPortDesc(e.target.value)} />
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

                          <div className="pt-2">
                            <button onClick={handleAddPortfolioItem} className="w-full py-2.5 rounded-lg text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 font-mono font-bold cursor-pointer">
                              {currentT.addBtn}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-500 leading-normal">
                          {lang === "en" ? "Upload custom showreel links or high-fidelity frames to your profile." : "پڕۆژەکەت یان شوڕیڵی بەرهەمهێنانت زیاد بکە بۆ پۆرتفۆلیۆ."}
                        </p>
                      )}
                    </div>

                    {/* 4. LOG OUT */}
                    <div className="bg-[#0c0c0c] border border-gray-900 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-red-500/80" />
                        <h4 className="text-[10px] uppercase font-mono tracking-widest text-red-400 font-bold">
                          {lang === "en" ? "Danger Zone" : "ناوچەی مەترسی"}
                        </h4>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-normal">
                        {lang === "en" 
                          ? "This will log you out from your workspace session." 
                          : "ئەمە دەتکاتە دەرەوە لە ڕووتەختی کۆنترۆڵکردنی مەکۆکەت."}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSettingsOpen(false);
                          setIsRegistered(false);
                          localStorage.removeItem("krdhub_registered");
                          localStorage.removeItem("krdhub_auth_method");
                          setSelectedCreatorId(null);
                          setActiveTab("biner");
                          showToast(lang === "en" ? "Logged out successfully" : "بە سەرکەوتوویی چوویتە دەرەوە");
                        }}
                        className="w-full py-2 px-3 text-xs font-mono font-bold rounded-lg border border-red-900/40 bg-red-950/15 hover:bg-red-950/30 text-red-400 transition-all cursor-pointer text-center"
                      >
                        {lang === "en" ? "Log Out Profile" : "لۆگ ئاوت بکە"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* GROUP CHAT CREATOR MODAL */}
          {showGroupModal && (
            <div className="fixed inset-0 bg-[#020202]/90 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fadeIn">
              <div className="bg-[#080808] border border-cyan-500/20 rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-[0_0_50px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/20 text-left text-xs">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 font-bold">
                    <UserPlus className="w-4 h-4 text-cyan-400" />
                    {lang === "en" ? "Create Group Chat" : "دروستکردنی گرووپ"}
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setShowGroupModal(false)}
                    className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 font-mono font-bold uppercase tracking-wider text-[9px]">
                    {lang === "en" ? "Group Title" : "ناوی گرووپ"}
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-black rounded-xl p-2.5 border border-gray-900 text-white focus:outline-none focus:border-cyan-400/50 transition-colors" 
                    placeholder={lang === "en" ? "e.g., Kurdistan Creative Crew" : "بۆ نموونە: تیمی بەرهەمهێنانی کوردستان"}
                    value={groupName} 
                    onChange={(e) => setGroupName(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-400 font-mono font-bold uppercase tracking-wider text-[9px]">
                      {lang === "en" ? "Select Crew Members" : "دیاریکردنی ئەندامان"}
                    </label>
                    <span className="font-mono text-[9px] font-bold text-cyan-400">
                      {selectedGroupMembers.length + 1}/12 {lang === "en" ? "Max" : "ئەندام"}
                    </span>
                  </div>
                  
                  <div className="max-h-36 overflow-y-auto divide-y divide-gray-950 border border-gray-900 rounded-xl bg-black/40 p-1 no-scrollbar space-y-1">
                    {creators.map((c) => {
                      const isSelected = selectedGroupMembers.includes(c.id);
                      return (
                        <div 
                          key={c.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedGroupMembers(prev => prev.filter(id => id !== c.id));
                            } else {
                              if (selectedGroupMembers.length >= 11) {
                                showToast(lang === "en" ? "Maximum 12 members allowed in a group." : "تکایە لە ١٢ ئەندام زیاتر ڕێگەنەدراوە.");
                                return;
                              }
                              setSelectedGroupMembers(prev => [...prev, c.id]);
                            }
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-cyan-950/20 border border-cyan-800/10 text-cyan-300" : "hover:bg-white/5 text-gray-400"}`}
                        >
                          <div className="flex items-center gap-2">
                            <img src={c.avatarUrl} className="w-6 h-6 rounded-md object-cover border border-gray-900" alt="" />
                            <div className="text-left leading-tight">
                              <p className="font-bold text-[10px] text-gray-200">{c.name}</p>
                              <p className="text-[8px] font-mono text-cyan-400/80">{c.role}</p>
                            </div>
                          </div>
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-cyan-500 border-cyan-500 text-black" : "border-gray-800 bg-transparent"}`}>
                            {isSelected && <span className="font-bold text-[8px]">✓</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-gray-900">
                  <button 
                    type="button"
                    onClick={() => setShowGroupModal(false)} 
                    className="px-3.5 py-2 rounded-xl text-xs bg-gray-950 text-gray-400 hover:bg-gray-900 border border-gray-900/60 transition-colors cursor-pointer font-mono font-semibold"
                  >
                    {lang === "en" ? "Cancel" : "پاشگەزبوونەوە"}
                  </button>
                  <button 
                    type="button"
                    onClick={handleCreateGroupChat} 
                    className="px-3.5 py-2 rounded-xl text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 transition-colors cursor-pointer font-mono font-bold"
                  >
                    {lang === "en" ? "Initialize" : "دروستکردن"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
    )}
  </AnimatePresence>
  );
}
