import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. CONSTANTS & CINEMATIC KNOWLEDGE BASE
// ==========================================
const KRD_CINEMA_KB = {
  directors: [
    { name: "Yılmaz Güney", films: ["Yol (1982)", "Sürü"], info: "باوکی سینەمای کوردی و براوەی خەڵاتی چڵە خورمای تەنکەر لە فێستیڤاڵی کان." },
    { name: "Bahman Ghobadi", films: ["A Time for Drunken Horses (2000)", "Turtles Can Fly (2004)"], info: "دەرهێنەرێکی لێهاتووی ڕۆژهەڵاتی کوردستان کە سینەمای کوردی گەیاندە ئاستی جیهانی." }
  ],
  techniques: [
    { name: "Rule of Thirds", desc: "دابەشکردنی شاشەکە بۆ ٩ چوارگۆشە بۆ ڕێکخستنی سەرنجڕاکێشی دیمەنەکە." },
    { name: "Color Grading", desc: "دەستکاری ڕەنگەکان (وەک Cinematic Noir یان Teal & Orange) بۆ بەخشینی هەستی قووڵ بە فیلم." },
    { name: "Anamorphic", desc: "بەکارهێنانی هاوێنەی عەدەسەی تایبەت بۆ گرتنی دیمەنی زۆر پان و لێڵاوی جوان لە باکگراوند (Bokeh)." }
  ],
  bannedKeywords: ["چەک", "دەمانچە", "خوێن", "gun", "blood", "weapon", "کوشتن", "18+"]
};

// ==========================================
// TIME-AGO UTILITY IN KURDISH
// ==========================================
const getKurdishTimeAgo = (lastActive: number | undefined) => {
  if (!lastActive) return null;
  const diff = Date.now() - lastActive;
  
  // Less than 5 minutes -> Online
  if (diff < 5 * 60 * 1000) {
    return {
      status: 'online',
      text: 'لەسەر خەتە / Online',
      dotColor: 'bg-emerald-500'
    };
  }

  // Elapsed minutes
  const diffMinutes = Math.floor(diff / (60 * 1000));
  if (diffMinutes < 60) {
    return {
      status: 'offline',
      text: `پێش ${diffMinutes} خولەک لەسەر خەت بوو`,
      dotColor: 'bg-zinc-600'
    };
  }

  // Elapsed hours
  const diffHours = Math.floor(diff / (60 * 60 * 1000));
  if (diffHours < 24) {
    return {
      status: 'offline',
      text: `پێش ${diffHours} کاتژمێر لەسەر خەت بوو`,
      dotColor: 'bg-zinc-600'
    };
  }

  // Elapsed days
  const diffDays = Math.floor(diff / (24 * 60 * 60 * 1000));
  return {
    status: 'offline',
    text: `پێش ${diffDays} ڕۆژ لەسەر خەت بوو`,
    dotColor: 'bg-zinc-600'
  };
};

export default function App() {
  // ==========================================
  // 2. STATE MANAGEMENT & FAIL-SAFES
  // ==========================================
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('krdHub_accounts_db');
      if (saved) return JSON.parse(saved);

      // Seed mock cinematic profiles if storage is completely empty
      const now = Date.now();
      return [
        {
          email: "sardar@krd.com",
          password: "password123",
          name: "Sardar Edit",
          bio: "مۆنتێر و گرافیک دیزاینەری سینەمایی 🎬",
          isProfileComplete: true,
          followers: [],
          following: [],
          friends: [],
          lastActive: now - 1.5 * 60 * 1000 // 1.5 minutes ago (Online)
        },
        {
          email: "twana@sport.com",
          password: "password123",
          name: "Twana Sport",
          bio: "سەرپەرشتیاری وەرزشی و ڕاهێنەری تاکتیکی تۆپی پێ ⚽",
          isProfileComplete: true,
          followers: [],
          following: [],
          friends: [],
          lastActive: now - 18 * 60 * 1000 // 18 minutes ago (Offline m)
        },
        {
          email: "zara@cinema.com",
          password: "password123",
          name: "Zara Cinema",
          bio: "تۆمارکەری دیمەنەکانی سروشتی جوانی کوردستان 🌄",
          isProfileComplete: true,
          followers: [],
          following: [],
          friends: [],
          lastActive: now - 5 * 60 * 60 * 1000 // 5 hours ago (Offline h)
        },
        {
          email: "saman@farhad.com",
          password: "password123",
          name: "Saman Farhad",
          bio: "دەرهێنەری دیمەنە فەنتازی و هاوچەرخەکان 🌟",
          isProfileComplete: true,
          followers: [],
          following: [],
          friends: [],
          lastActive: now - 6 * 24 * 60 * 60 * 1000 // 6 days ago (Offline d)
        }
      ];
    } catch { return []; }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('krdHub_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [currentScreen, setCurrentScreen] = useState(() => {
    if (!currentUser) return 'auth';
    return currentUser.isProfileComplete ? 'works' : 'profile-setup';
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('krdHub_chat_messages');
      return saved ? JSON.parse(saved) : [
        { id: 1, sender: 'ai', text: 'سڵاو لە شێرەکەی کوردستان! من یاریدەدەری زیرەکی Krd Hub م. پرسیار لەسەر سینەما، مۆنتاژ، تۆپی پێ، یان هەر شتێک هەیە بکە و دەستبەجێ وەڵامت دەدەمەوە. 🎬🔥', time: '08:00 PM' }
      ];
    } catch { return []; }
  });

  const [videos, setVideos] = useState([
    { id: 1, title: "Cinematic Kurdish Landscape 8K", author: "Sardar Edit", likes: 12, likedBy: [], comments: [], url: "#" },
    { id: 2, title: "Football Defensive Drills & Tactics", author: "Twana Sport", likes: 24, likedBy: [], comments: [], url: "#" }
  ]);

  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all'); // all, friends
  const [isLoading, setIsLoading] = useState(false);

  // Form Inputs
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [safetyWarning, setSafetyWarning] = useState('');

  const chatEndRef = useRef(null);

  // Sync state to LocalStorage Safely
  useEffect(() => {
    try { localStorage.setItem('krdHub_accounts_db', JSON.stringify(accounts)); } catch (e) {}
  }, [accounts]);

  useEffect(() => {
    try { localStorage.setItem('krdHub_active_user', JSON.stringify(currentUser)); } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try { localStorage.setItem('krdHub_chat_messages', JSON.stringify(messages)); } catch (e) {}
  }, [messages]);

  useEffect(() => {
    if (currentScreen === 'chat') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentScreen]);

  // ==========================================
  // 3. HEARTBEAT & HELPER ACTIONS
  // ==========================================
  const triggerHeartbeat = () => {
    if (!currentUser) return;
    const now = Date.now();
    setAccounts(prev => prev.map(acc => {
      if (acc.email === currentUser.email) {
        return { ...acc, lastActive: now };
      }
      return acc;
    }));
    setCurrentUser(prev => {
      if (!prev) return null;
      return { ...prev, lastActive: now };
    });
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
      audio.volume = 0.5;
      audio.play().catch(() => { /* Silent catch for autoplay blocks */ });
    } catch (e) {}
  };

  const validateContent = (text) => {
    if (!text) return true;
    const lowerText = text.toLowerCase();
    return !KRD_CINEMA_KB.bannedKeywords.some(keyword => lowerText.includes(keyword));
  };

  const triggerNotification = (text) => {
    setNotifications(prev => [{ id: Date.now(), text, read: false }, ...prev]);
    playNotificationSound();
  };

  // ==========================================
  // 4. CORE LOGIC ACTIONS (AUTH & SOCIAL)
  // ==========================================
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;

    const exists = accounts.find(acc => acc.email === emailInput);
    if (exists) {
      const activeUser = { ...exists, lastActive: Date.now() };
      setCurrentUser(activeUser);
      localStorage.setItem('krdHub_active_user', JSON.stringify(activeUser));
      setCurrentScreen(activeUser.isProfileComplete ? 'works' : 'profile-setup');
      return;
    }

    const newAccount = {
      email: emailInput,
      password: passwordInput,
      name: emailInput.split('@')[0],
      bio: '',
      isProfileComplete: false,
      followers: [],
      following: [],
      friends: [],
      lastActive: Date.now()
    };

    setAccounts(prev => [...prev, newAccount]);
    setCurrentUser(newAccount);
    setCurrentScreen('profile-setup');
  };

  const handleSaveProfileSetup = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    if (!validateContent(nameInput) || !validateContent(bioInput)) {
      setSafetyWarning("⚠️ ناو یان بایۆکەت شتی نەشیاو یان توندوتیژی تێدایە! تکایە بیگۆڕە.");
      return;
    }
    setSafetyWarning('');

    const updatedUser = { ...currentUser, name: nameInput, bio: bioInput, isProfileComplete: true, lastActive: Date.now() };
    setAccounts(prev => prev.map(acc => acc.email === currentUser.email ? updatedUser : acc));
    setCurrentUser(updatedUser);
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('works');
    }, 600);
  };

  const handleToggleFollow = (targetEmail) => {
    if (!currentUser || currentUser.email === targetEmail) return;

    setAccounts(prev => prev.map(acc => {
      if (acc.email === currentUser.email) {
        const isFollowing = acc.following.includes(targetEmail);
        const nextFollowing = isFollowing 
          ? acc.following.filter(e => e !== targetEmail)
          : [...acc.following, targetEmail];
        const updated = { ...acc, following: nextFollowing };
        if (currentUser.email === acc.email) setCurrentUser(updated);
        return updated;
      }
      if (acc.email === targetEmail) {
        const isFollowed = acc.followers.includes(currentUser.email);
        const nextFollowers = isFollowed
          ? acc.followers.filter(e => e !== currentUser.email)
          : [...acc.followers, currentUser.email];
        return { ...acc, followers: nextFollowers };
      }
      return acc;
    }));

    const targetAcc = accounts.find(a => a.email === targetEmail);
    if (targetAcc && !currentUser.following.includes(targetEmail)) {
      triggerNotification(`👤 ${currentUser.name} فۆڵۆی کردی.`);
    }
    triggerHeartbeat();
  };

  const handleFriendRequest = (targetEmail) => {
    if (!currentUser || currentUser.email === targetEmail) return;

    setAccounts(prev => prev.map(acc => {
      if (acc.email === targetEmail) {
        const alreadyFriend = acc.friends.includes(currentUser.email);
        if (!alreadyFriend) {
          setTimeout(() => {
            triggerNotification(`🤝 ${currentUser.name} داواکاری هاوڕێیەتی بۆ ناردویت.`);
          }, 200);
          return { ...acc, friends: [...acc.friends, currentUser.email] }; 
        }
      }
      if (acc.email === currentUser.email) {
        if (!acc.friends.includes(targetEmail)) {
          const updated = { ...acc, friends: [...acc.friends, targetEmail] };
          setCurrentUser(updated);
          return updated;
        }
      }
      return acc;
    }));
    triggerHeartbeat();
  };

  const handleLikeVideo = (id) => {
    triggerHeartbeat();
    setVideos(prev => prev.map(vid => {
      if (vid.id === id) {
        const hasLiked = vid.likedBy.includes(currentUser?.email);
        const nextLikedBy = hasLiked 
          ? vid.likedBy.filter(e => e !== currentUser?.email)
          : [...vid.likedBy, currentUser?.email];
        return { ...vid, likes: nextLikedBy.length, likedBy: nextLikedBy };
      }
      return vid;
    }));
  };

  const handleAddComment = (vidId) => {
    const text = commentInputs[vidId];
    if (!text || !text.trim() || !currentUser) return;

    if (!validateContent(text)) {
      alert("⚠️ کۆمێنتەکەت بلۆککرا! نووسینی وشەی نەشیاو، چەک، یان خوێن قەدەغەیە بۆ پاراستنی تەمەنی ژێر ١٨ ساڵ.");
      return;
    }

    triggerHeartbeat();
    setVideos(prev => prev.map(vid => {
      if (vid.id === vidId) {
        return { ...vid, comments: [...vid.comments, { user: currentUser.name, text: text }] };
      }
      return vid;
    }));
    setCommentInputs(prev => ({ ...prev, [vidId]: '' }));
  };

  // ==========================================
  // 5. OMNIPRESENT ULTRA-FAST LOCAL AI ENGINE
  // ==========================================
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentUser) return;

    triggerHeartbeat();

    if (!validateContent(chatInput)) {
      setMessages(prev => [...prev, 
        { id: Date.now(), sender: 'user', text: chatInput, time: 'Just Now' },
        { id: Date.now() + 1, sender: 'ai', text: '⚠️ یاسای پاراستنی گشتی: پۆست یان پرسیارکردن لە ناوەڕۆکی نەشیاو، توندوتیژی، خوێن، و چەک لە Krd Hub ڕێگەپێنەدراوە.', time: 'Just Now' }
      ]);
      setChatInput('');
      return;
    }

    const userMsg = { id: Date.now(), sender: 'user', text: chatInput, time: 'Just Now' };
    setMessages(prev => [...prev, userMsg]);
    const currentQuery = chatInput.toLowerCase();
    setChatInput('');

    // Dynamic AI Response Logic (Omnipresent Matching)
    setTimeout(() => {
      let aiReply = "ئەمە پرسیارێکی نایابە! وەک هاوڕێیەکی ژیر، پێشنیار دەکەم زیاتر لێی بکۆڵیتەوە یان پێکەوە پەرەی پێ بدەین لە ناو ئەپی Krd Hub. پڕۆژەکەت زۆر بەهێزە! 🚀";
      
      if (currentQuery.includes('cinema') || currentQuery.includes('فیلم') || currentQuery.includes('دەرهێنەر') || currentQuery.includes('blackhole') || currentQuery.includes('station')) {
        aiReply = "سەبارەت بە سینەما مێشکم پڕە! گەورەترین فیلم لەسەر کونی ڕەش و وێستگەی خولاوە (Spinning Station) فیلمی ناوازەی Interstellar (2014) ی دەرهێنەر کریستۆفەر نۆلانە. لە ڕووی سینەمای کوردیشەوە، فیلمی (Turtles Can Fly)ی بەهمەن قوبادی شاھکارێکی جیهانییە کە تیشک دەخاتە سەر ژیانی منداڵانی نیشتمانەکەمان.";
      } else if (currentQuery.includes('mۆنتاژ') || currentQuery.includes('editing') || currentQuery.includes('color')) {
        aiReply = "مۆنتاژ لێدانی دڵی فیلمە! هەمیشە هەوڵبدە یاسای (Rule of Thirds) جێبەجێ بکەیت و لە ڕێگەی Color Grading ەوە هەستی قووڵ بە دیمەنەکانت ببەخشیت. ستایلی Cinematic Noir ئێستا زۆر باوە.";
      } else if (currentQuery.includes('تۆپی پێ') || currentQuery.includes('football') || currentQuery.includes('یاسا')) {
        aiReply = "تۆپی پێ تەنها یاری نییە، بەڵکو لۆجیکە. بۆ یاریزانێکی بەرگریکار, گرنگترین شت پاراستنی هێڵ و پۆزیشنە (Positioning)، هەمیشە چاوت لەسەر جووڵەی هێرشبەر بێت نەک تەنها تۆپەکە!";
      } else if (currentQuery.includes('سڵاو') || currentQuery.includes('چۆنی')) {
        aiReply = "سڵاو شێری دڵ! من زۆر باشم، هیواخوازم پەرەپێدانی ئەپی Krd Hub بە باشترین شێوە بڕوات بەڕێوە. بۆ هەر پرسیارێک لێرەم!";
      }

      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: aiReply, time: 'Just Now' }]);
    }, 400);
  };

  const handleLogout = () => {
    localStorage.removeItem('krdHub_active_user');
    setCurrentUser(null);
    setCurrentScreen('auth');
  };

  // ==========================================
  // 6. VIEW RENDERING (ROBUST LAYOUTS)
  // ==========================================
  const filteredAccounts = accounts.filter(acc => {
    if (!acc || acc.email === currentUser?.email) return false;
    const nameStr = acc.name || "";
    const emailStr = acc.email || "";
    const queryStr = searchQuery || "";
    const matchesSearch = nameStr.toLowerCase().includes(queryStr.toLowerCase()) || emailStr.toLowerCase().includes(queryStr.toLowerCase());
    if (searchFilter === 'friends') {
      return matchesSearch && currentUser?.friends?.includes(acc.email);
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans select-none" style={{ direction: 'rtl' }}>
      
      {/* HEADER */}
      <header className="bg-zinc-950 border-b border-zinc-800 p-4 flex justify-between items-center sticky top-0 z-50 animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-xl font-black tracking-wider">✨ KRD HUB</span>
        </div>
        {currentUser && (
          <button onClick={handleLogout} className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md hover:bg-red-950/30 hover:border-red-900 text-red-400 transition-all cursor-pointer">
            دەرچوون
          </button>
        )}
      </header>

      {/* SKELETON LOADING OVERLAY */}
      {isLoading && (
        <div className="flex-1 p-6 space-y-4 animate-pulse">
          <div className="h-12 bg-zinc-900 rounded-lg w-3/4"></div>
          <div className="h-48 bg-zinc-900 rounded-lg"></div>
          <div className="h-32 bg-zinc-900 rounded-lg"></div>
        </div>
      )}

      {/* AUTH SCREEN */}
      {!isLoading && currentScreen === 'auth' && (
        <div className="flex-1 flex flex-col justify-center items-center p-6">
          <form onSubmit={handleSignUp} className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl w-full max-w-sm space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-center text-zinc-200">چوونەژوورەوە / دروستکردنی ئەکاونت</h2>
            <p className="text-xs text-zinc-500 text-center">تەنها یەکەمجار ئیمێڵەکەت بنووسە بۆ تۆمارکردنی خێرا</p>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">ئیمێڵ</label>
              <input type="email" required value={emailInput} onChange={e => setEmailInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 text-left font-mono" placeholder="name@domain.com" style={{ direction: 'ltr' }} />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">تێپەڕەوشە (Password)</label>
              <input type="password" required value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 text-left font-mono" placeholder="••••••••" style={{ direction: 'ltr' }} />
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 font-medium text-sm text-black py-2.5 rounded-lg transition-all shadow-lg shadow-cyan-950/20 cursor-pointer">
              دروستکردنی ئەکاونت و بەردەوامبوون
            </button>
          </form>
        </div>
      )}

      {/* PROFILE SETUP SCREEN */}
      {!isLoading && currentScreen === 'profile-setup' && (
        <div className="flex-1 flex flex-col justify-center items-center p-6">
          <form onSubmit={handleSaveProfileSetup} className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl w-full max-w-sm space-y-4 animate-fade-in">
            <h2 className="text-md font-bold text-cyan-400">📋 تەواوکردنی زانیارییەکانی پڕۆفایل</h2>
            {safetyWarning && <p className="text-xs text-red-400 bg-red-950/20 p-2 rounded border border-red-900">{safetyWarning}</p>}
            <div>
              <label className="block text-xs text-zinc-400 mb-1">ناو یان نازناو</label>
              <input type="text" required value={nameInput} onChange={e => setNameInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="وێنەگر یان ناوەکەت..." />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">بایۆ (کورتەیەک دەربارەی خۆت)</label>
              <textarea value={bioInput} onChange={e => setBioInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 h-20 resize-none" placeholder="حەزم لە مۆنتاژ و فیلمی سینەماییە..." />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm py-2.5 rounded-lg transition-all cursor-pointer">
              پاشەکەوتکردن و چوونە ناو ئەپ
            </button>
          </form>
        </div>
      )}

      {/* MAIN SCREEN CONTENTS */}
      {!isLoading && currentScreen !== 'auth' && currentScreen !== 'profile-setup' && (
        <main className="flex-1 p-4 pb-24 overflow-y-auto max-w-md mx-auto w-full">
          
          {/* WORKS / VIDEOS FEED */}
          {currentScreen === 'works' && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-2 flex justify-between items-center">
                <h2 className="text-sm font-bold tracking-wide text-zinc-400">🔥 بینراوترین و نوێترین کارەکان</h2>
                <span className="text-xs bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-900">سەروو تەمەنی ١٥</span>
              </div>
              
              {videos.map(vid => (
                <div key={vid.id} className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl animate-fade-in">
                  <div className="aspect-video bg-zinc-900 flex items-center justify-center relative border-b border-zinc-900">
                    <span className="text-zinc-600 text-xs">📸 Cinematic Media Player Overlay</span>
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-zinc-400">
                      by {vid.author}
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-zinc-200">{vid.title}</h3>
                    
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <button onClick={() => handleLikeVideo(vid.id)} className={`flex items-center gap-1 transition-all cursor-pointer ${vid.likedBy?.includes(currentUser?.email) ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-red-400'}`}>
                        ❤️ {vid.likes} لایک
                      </button>
                      <span className="text-zinc-600">|</span>
                      <span className="text-zinc-400">💬 {vid.comments.length} کۆمێنت</span>
                    </div>

                    {/* Comment rendering */}
                    <div className="bg-zinc-900/50 rounded-lg p-2 space-y-1.5 text-[11px] max-h-24 overflow-y-auto border border-zinc-900">
                      {vid.comments.length === 0 ? (
                        <p className="text-zinc-600 italic">هیچ کۆمێنتێک نییە، یەکەمکەس بە بنووسە...</p>
                      ) : (
                        vid.comments.map((c, i) => (
                          <p key={i} className="text-zinc-300"><strong className="text-cyan-500">{c.user}:</strong> {c.text}</p>
                        ))
                      )}
                    </div>

                    {/* Write Comment Box */}
                    <div className="flex gap-2">
                      <input type="text" value={commentInputs[vid.id] || ''} onChange={e => setCommentInputs({...commentInputs, [vid.id]: e.target.value})} placeholder="کۆمێنتێک بنووسە..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                      <button onClick={() => handleAddComment(vid.id)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded-lg text-xs transition-all cursor-pointer">ناردن</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EXPLORE / SEARCH */}
          {currentScreen === 'explore' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="🔍 گەڕان بەدوای هاوڕێ یان ناوەکەی..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 text-right" />
                
                <div className="flex gap-2 text-xs">
                  <button onClick={() => { setSearchFilter('all'); triggerHeartbeat(); }} className={`px-3 py-1 rounded-full border cursor-pointer ${searchFilter === 'all' ? 'bg-cyan-950 border-cyan-800 text-cyan-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>هەمووان</button>
                  <button onClick={() => { setSearchFilter('friends'); triggerHeartbeat(); }} className={`px-3 py-1 rounded-full border cursor-pointer ${searchFilter === 'friends' ? 'bg-cyan-950 border-cyan-800 text-cyan-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>تەنها هاوڕێکان</button>
                </div>
              </div>

              <div className="space-y-2">
                {filteredAccounts.length === 0 ? (
                  <p className="text-xs text-zinc-600 text-center py-6">هیچ ئەکاونتێک نەدۆزرایەوە.</p>
                ) : (
                  filteredAccounts.map(acc => {
                    const isConfirmedFriend = currentUser?.friends?.includes(acc.email) && acc.friends?.includes(currentUser.email);
                    const timeAgo = isConfirmedFriend ? getKurdishTimeAgo(acc.lastActive) : null;

                    return (
                      <div key={acc.email} className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex justify-between items-center shadow-md">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-zinc-200">{acc.name}</h4>
                            {timeAgo && (
                              <span className="flex items-center gap-1 text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full font-mono">
                                <span className={`w-1.5 h-1.5 rounded-full ${timeAgo.dotColor} ${timeAgo.status === 'online' ? 'animate-pulse' : ''}`}></span>
                                <span className={timeAgo.status === 'online' ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}>
                                  {timeAgo.text}
                                </span>
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-500 text-left font-mono" style={{ direction: 'ltr' }}>{acc.email}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => handleToggleFollow(acc.email)} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer">
                            {currentUser?.following?.includes(acc.email) ? '✓ فۆڵۆ کراوە' : '+ فۆڵۆو'}
                          </button>
                          <button onClick={() => handleFriendRequest(acc.email)} className="bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-900 text-cyan-400 px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer">
                            {currentUser?.friends?.includes(acc.email) ? '🤝 هاوڕێن' : '✉️ فرێند'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* OMNIPRESENT OMNISCIENT CHAT WITH AI */}
          {currentScreen === 'chat' && (
            <div className="flex flex-col h-[calc(100vh-180px)] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
              <div className="bg-zinc-900/60 p-3 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">🤖 جەمینای زانیاری گشتی و سینەمایی</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed shadow-md ${msg.sender === 'user' ? 'bg-cyan-600 text-black font-medium rounded-bl-none' : 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-br-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendChatMessage} className="p-2 border-t border-zinc-800 bg-zinc-900/40 flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="پرسیار لە هۆلیوود، سینەمای کوردی، مۆنتاژ یان هەر شتێک بکە..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" />
                <button type="submit" className="bg-cyan-600 text-black hover:bg-cyan-500 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-cyan-950/20 cursor-pointer">ناردن</button>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {currentScreen === 'notifications' && (
            <div className="space-y-3 animate-fade-in">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">🔔 نۆتیفیکەیشنەکانی چالاکی هێڵ</h2>
              {notifications.length === 0 ? (
                <p className="text-xs text-zinc-600 text-center py-8 italic">هیچ چالاکییەکی نوێ تۆمار نەکراوە.</p>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg flex items-center justify-between text-xs animate-fade-in">
                    <span className="text-zinc-300">{notif.text}</span>
                    <span className="text-[9px] text-zinc-600">ئێستا</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* EXPANDED PROFILE EDITING SCREEN */}
          {currentScreen === 'profile' && currentUser && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl p-6 space-y-6 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-xl font-bold text-black shadow-lg">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-md font-bold text-zinc-200">{currentUser.name}</h3>
                  <p className="text-[10px] text-zinc-500 text-left font-mono" style={{ direction: 'ltr' }}>{currentUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center bg-zinc-900/60 p-3 rounded-xl border border-zinc-900 font-mono">
                <div>
                  <span className="block text-sm font-black text-cyan-400">{currentUser.friends ? currentUser.friends.length : 0}</span>
                  <span className="text-[10px] text-zinc-500">هاوڕێ</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-purple-400">{currentUser.followers ? currentUser.followers.length : 0}</span>
                  <span className="text-[10px] text-zinc-500">فۆڵۆوەر</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-pink-400">{currentUser.following ? currentUser.following.length : 0}</span>
                  <span className="text-[10px] text-zinc-500">فۆڵۆوینگ</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-500 block">بایۆگرافی:</span>
                <p className="text-xs text-zinc-300 bg-zinc-900 p-2.5 rounded-lg border border-zinc-900 italic">
                  {currentUser.bio || "هیچ شتێک نییە..."}
                </p>
              </div>

              {/* LIST OF CONFIRMED FRIENDS WITH LAST SEEN INDICATORS */}
              <div className="border-t border-zinc-900 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 flex justify-between items-center">
                  <span>👥 هاوڕێکانی من / My Friends</span>
                  <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800 font-mono text-cyan-400">
                    {(currentUser.friends || []).length}
                  </span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(currentUser.friends || []).length === 0 ? (
                    <p className="text-[11px] text-zinc-650 italic">تۆ هێشتا هاوڕێت نییە. سەردانی بەشی گەڕان بکە بۆ دۆزینەوەی هاوڕێ!</p>
                  ) : (
                    accounts
                      .filter(acc => currentUser.friends.includes(acc.email))
                      .map(friend => {
                        const isConfirmedMutual = currentUser.friends.includes(friend.email) && friend.friends?.includes(currentUser.email);
                        const timeAgo = isConfirmedMutual ? getKurdishTimeAgo(friend.lastActive) : null;
                        return (
                          <div key={friend.email} className="bg-zinc-900/50 border border-zinc-900/80 p-2.5 rounded-lg flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-zinc-300">{friend.name}</span>
                              <p className="text-[9px] text-zinc-550 text-left font-mono" style={{ direction: 'ltr' }}>{friend.email}</p>
                            </div>
                            {timeAgo && (
                              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                                <span className={`w-1.5 h-1.5 rounded-full ${timeAgo.dotColor} ${timeAgo.status === 'online' ? 'animate-pulse' : ''}`}></span>
                                <span className={timeAgo.status === 'online' ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}>
                                  {timeAgo.text}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Edit Profile Form Sub-component */}
              <div className="border-t border-zinc-900 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-zinc-400">⚙️ دەستکاری خێرای پڕۆفایل</h4>
                <div className="space-y-2">
                  <input type="text" placeholder="گۆڕینی ناو" value={nameInput} onChange={e => setNameInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <textarea placeholder="گۆڕینی بایۆ" value={bioInput} onChange={e => setBioInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 h-14 resize-none" />
                  <button onClick={(e) => {
                    handleSaveProfileSetup(e);
                    alert("✓ گۆڕانکارییەکان بە سەرکەوتوویی لە داتابەیس پاشەکەوت کران!");
                  }} className="bg-zinc-100 hover:bg-white text-black text-xs font-bold px-4 py-2 rounded-lg transition-all w-full text-center cursor-pointer">
                    سەیڤکردنی گۆڕانکارییەکان
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      )}

      {/* FIXED CINEMATIC BOTTOM NAVIGATION FOOTER */}
      {currentUser && currentScreen !== 'auth' && currentScreen !== 'profile-setup' && (
        <footer className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 p-2 z-50">
          <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center font-sans">
            <button onClick={() => { setCurrentScreen('works'); triggerHeartbeat(); }} className={`flex flex-col items-center py-1.5 rounded-lg transition-all cursor-pointer ${currentScreen === 'works' ? 'text-cyan-400 bg-zinc-900/60' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <span className="text-sm">🎬</span>
              <span className="text-[10px] mt-0.5">کارەکان</span>
            </button>
            
            <button onClick={() => { setCurrentScreen('explore'); triggerHeartbeat(); }} className={`flex flex-col items-center py-1.5 rounded-lg transition-all cursor-pointer ${currentScreen === 'explore' ? 'text-cyan-400 bg-zinc-900/60' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <span className="text-sm">🔍</span>
              <span className="text-[10px] mt-0.5">گەڕان</span>
            </button>
            
            <button onClick={() => { setCurrentScreen('chat'); triggerHeartbeat(); }} className={`flex flex-col items-center py-1.5 rounded-lg transition-all cursor-pointer ${currentScreen === 'chat' ? 'text-cyan-400 bg-zinc-900/60' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <span className="text-sm">🤖</span>
              <span className="text-[10px] mt-0.5">چاتی AI</span>
            </button>
            
            <button onClick={() => { setCurrentScreen('notifications'); triggerHeartbeat(); }} className={`flex flex-col items-center py-1.5 rounded-lg transition-all relative cursor-pointer ${currentScreen === 'notifications' ? 'text-cyan-400 bg-zinc-900/60' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <span className="text-sm">🔔</span>
              <span className="text-[10px] mt-0.5">ئاگاداری</span>
              {notifications.length > 0 && (
                <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </button>
            
            <button onClick={() => {
              setNameInput(currentUser.name || '');
              setBioInput(currentUser.bio || '');
              setCurrentScreen('profile');
              triggerHeartbeat();
            }} className={`flex flex-col items-center py-1.5 rounded-lg transition-all cursor-pointer ${currentScreen === 'profile' ? 'text-cyan-400 bg-zinc-900/60' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <span className="text-sm">👤</span>
              <span className="text-[10px] mt-0.5">پڕۆفایل</span>
            </button>
          </div>
        </footer>
      )}

    </div>
  );
}
