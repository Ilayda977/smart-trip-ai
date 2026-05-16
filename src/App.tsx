import { useState } from 'react';

// Maksimum kontrastlı, gölgeli ve canlı kategori renk motorumuz
const tagStyles: { [key: string]: { bg: string; text: string; border: string; accent: string; badge: string } } = {
  Budget: { 
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/70', 
    text: 'text-emerald-950', 
    border: 'border-l-4 border-l-emerald-500 border border-emerald-100 shadow-[0_4px_20px_rgba(16,_185,_129,_0.06)]', 
    accent: 'text-emerald-600 font-black', 
    badge: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-sm' 
  },
  'Street Food': { 
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/70', 
    text: 'text-emerald-950', 
    border: 'border-l-4 border-l-emerald-500 border border-emerald-100 shadow-[0_4px_20px_rgba(16,_185,_129,_0.06)]', 
    accent: 'text-emerald-600 font-black', 
    badge: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-sm' 
  },
  Luxury: { 
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50/60', 
    text: 'text-amber-950', 
    border: 'border-l-4 border-l-amber-500 border border-amber-100 shadow-[0_4px_20px_rgba(245,_158,_11,_0.06)]', 
    accent: 'text-amber-600 font-black', 
    badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold shadow-sm' 
  },
  'Fine Dining': { 
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50/60', 
    text: 'text-amber-950', 
    border: 'border-l-4 border-l-amber-500 border border-amber-100 shadow-[0_4px_20px_rgba(245,_158,_11,_0.06)]', 
    accent: 'text-amber-600 font-black', 
    badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold shadow-sm' 
  },
  History: { 
    bg: 'bg-gradient-to-br from-orange-50 to-rose-50/60', 
    text: 'text-orange-950', 
    border: 'border-l-4 border-l-orange-500 border border-orange-100 shadow-[0_4px_20px_rgba(249,_115,_22,_0.06)]', 
    accent: 'text-orange-600 font-black', 
    badge: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold shadow-sm' 
  },
  Museum: { 
    bg: 'bg-gradient-to-br from-orange-50 to-rose-50/60', 
    text: 'text-orange-950', 
    border: 'border-l-4 border-l-orange-500 border border-orange-100 shadow-[0_4px_20px_rgba(249,_115,_22,_0.06)]', 
    accent: 'text-orange-600 font-black', 
    badge: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold shadow-sm' 
  },
  Nightlife: { 
    bg: 'bg-gradient-to-br from-purple-50 to-indigo-100/70', 
    text: 'text-purple-950', 
    border: 'border-l-4 border-l-purple-600 border border-purple-200 shadow-[0_4px_20px_rgba(147,_51,_234,_0.08)]', 
    accent: 'text-purple-700 font-black', 
    badge: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold shadow-sm' 
  },
  Adventure: { 
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-50/70', 
    text: 'text-cyan-950', 
    border: 'border-l-4 border-l-cyan-500 border border-cyan-100 shadow-[0_4px_20px_rgba(6,_182,_212,_0.06)]', 
    accent: 'text-cyan-600 font-black', 
    badge: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold shadow-sm' 
  },
  Nature: { 
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-50/70', 
    text: 'text-cyan-950', 
    border: 'border-l-4 border-l-cyan-500 border border-cyan-100 shadow-[0_4px_20px_rgba(6,_182,_212,_0.06)]', 
    accent: 'text-cyan-600 font-black', 
    badge: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold shadow-sm' 
  },
  Shopping: { 
    bg: 'bg-gradient-to-br from-pink-50 to-rose-50/70', 
    text: 'text-pink-950', 
    border: 'border-l-4 border-l-pink-500 border border-pink-100 shadow-[0_4px_20px_rgba(236,_72,_153,_0.06)]', 
    accent: 'text-pink-600 font-black', 
    badge: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold shadow-sm' 
  },
  Default: { 
    bg: 'bg-gradient-to-br from-blue-50 to-sky-50/70', 
    text: 'text-blue-950', 
    border: 'border-l-4 border-l-purple-500 border border-purple-100 shadow-[0_4px_20px_rgba(147,_51,_234,_0.06)]', 
    accent: 'text-purple-600 font-black', 
    badge: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold shadow-sm' 
  },
};

const CITY_IMAGES: { [key: string]: string } = {
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  'rome': 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80',
  'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
  'istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80',
};

const mockRoute = [
  {
    day: 1,
    theme: "High-Energy Exploration & Local Bites",
    activities: [
      { time: "09:30", place: "National Heritage Museum", desc: "Start your morning exploring incredible history halls, perfect for a high-tempo group walk.", tag: "Museum" },
      { time: "12:30", place: "Famous Corner Falafel", desc: "A budget-friendly local spot that can easily accommodate large groups for a legendary lunch.", tag: "Street Food" },
      { time: "15:00", place: "Vintage Vinyl & Shopping District", desc: "Walk through independent design studios, local apparel shops, and cool music stores.", tag: "Shopping" },
      { time: "18:00", place: "Sunset Ridge Hike", desc: "A breathtaking climb to capture the ultimate group photo overlooking the entire city.", tag: "Adventure" },
    ],
  },
  {
    day: 2,
    theme: "Culture Deep Dive & Night Scene",
    activities: [
      { time: "10:00", place: "Contemporary Art Gallery", desc: "Rotating exhibitions from both local and international artists in a stunning minimalist space.", tag: "Museum" },
      { time: "13:00", place: "Rooftop Fine Dining", desc: "A curated tasting menu with panoramic city views. Reserve in advance.", tag: "Fine Dining" },
      { time: "16:00", place: "Old Quarter Walking Tour", desc: "Winding alleys, hidden courtyards, and centuries of layered history at every corner.", tag: "History" },
      { time: "21:00", place: "Underground Jazz Club", desc: "Live performances every night. One of the best-kept secrets in the city.", tag: "Nightlife" },
    ],
  },
];

const MODES = [
  { id: "Local & Hidden Gems", icon: "🕵️", desc: "Gizli sokaklar, yerel kafeler", fromColor: "from-emerald-500", toColor: "to-teal-600", borderHover: "hover:border-purple-400" },
  { id: "Tech & Future", icon: "🚀", desc: "Inovasyon, müzeler, teknoloji", fromColor: "from-purple-500", toColor: "to-indigo-600", borderHover: "hover:border-purple-400" },
  { id: "Art & Aesthetic", icon: "🎨", desc: "Galeriler, mimari, tasarim", fromColor: "from-purple-500", toColor: "to-pink-600", borderHover: "hover:border-purple-400" },
  { id: "Night & Energy", icon: "🌆", desc: "Gece hayati, manzara, enerji", fromColor: "from-orange-500", toColor: "to-rose-600", borderHover: "hover:border-purple-400" },
];

export default function App() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [peopleCount, setPeopleCount] = useState(1);
  const [pace, setPace] = useState('balanced');
  const [transport, setTransport] = useState('transit');
  const [mode, setMode] = useState('');
  const [interests, setInterests] = useState('');
  const [showPlan, setShowPlan] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  const handlePlanTrip = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPlan(true);
  };

  // Popüler şehir kartlarına tıklandığında hem state'i güncelleyen hem de planı anında açan akıllı fonksiyon
  const handleSelectPopularCity = (cityName: string) => {
    setDestination(cityName);
    setShowPlan(true);
  };

  const toggleActivity = (placeName: string) => {
    setCompletedActivities(prev =>
      prev.includes(placeName) ? prev.filter(i => i !== placeName) : [...prev, placeName]
    );
  };

  const getCityImage = (city: string) => {
    const key = city.toLowerCase();
    return CITY_IMAGES[key] || CITY_IMAGES['default'];
  };

  const completedCount = mockRoute.flatMap(d => d.activities).filter(a => completedActivities.includes(a.place)).length;
  const totalCount = mockRoute.flatMap(d => d.activities).length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">

      {/* LEFT PANEL */}
      <div className="w-full md:w-[410px] flex-shrink-0 bg-white flex flex-col overflow-y-auto max-h-screen shadow-[10px_0_30px_rgba(0,0,0,0.03)] z-10 border-r border-slate-100">

        {/* Logo */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-black bg-gradient-to-r from-purple-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent tracking-tight">SmartTrip</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight">AI</span>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Your AI-powered travel companion</p>
        </div>

        <form onSubmit={handlePlanTrip} className="flex flex-col gap-6 px-8 pb-8 flex-1">

          {/* Destination */}
          <div className="p-4 bg-gradient-to-br from-purple-50/40 to-indigo-50/20 rounded-2xl border border-slate-100">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Where to?</label>
            <input
              type="text"
              placeholder="Tokyo, Paris, Bali..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3.5 text-sm rounded-2xl bg-white border-2 border-slate-200 focus:outline-none focus:border-purple-400 font-bold text-slate-800 placeholder-slate-300 shadow-sm transition-all"
              required
            />
          </div>

          {/* Days + Travelers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-purple-50/30 to-indigo-50/20 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Days</label>
                <span className="text-sm font-black bg-purple-600 text-white px-2.5 py-0.5 rounded-lg shadow-sm">{days}</span>
              </div>
              <input type="range" min="1" max="7" value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer" />
              <div className="flex justify-between text-[9px] text-slate-400 font-black mt-1.5">
                <span>1 day</span><span>7 days</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50/30 to-indigo-50/20 rounded-2xl p-4 border border-slate-100">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Travelers</label>
              <div className="flex items-center justify-between bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-sm">
                <button type="button" onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-50 text-slate-600 font-black hover:bg-purple-50 hover:text-purple-500 transition-all text-base flex items-center justify-center">−</button>
                <span className="text-xl font-black text-slate-800">{peopleCount}</span>
                <button type="button" onClick={() => setPeopleCount(Math.min(20, peopleCount + 1))}
                  className="w-7 h-7 rounded-lg bg-slate-50 text-slate-600 font-black hover:bg-purple-50 hover:text-purple-500 transition-all text-base flex items-center justify-center">+</button>
              </div>
              <p className="text-[10px] text-slate-500 font-black text-center mt-2 uppercase tracking-wide">
                {peopleCount === 1 ? ' Solo' : peopleCount <= 3 ? ' Small' : ' Large'}
              </p>
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Travel Style</label>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => (
                <button key={m.id} type="button" onClick={() => setMode(m.id)}
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all duration-200 ${m.borderHover} ${
                    mode === m.id
                      ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50/30 shadow-md ring-1 ring-purple-300'
                      : 'border-slate-100 bg-slate-50/60'
                  }`}>
                  <span className="text-2xl block mb-1.5 filter drop-shadow-sm">{m.icon}</span>
                  <p className={`text-[11px] font-black leading-tight ${
                    mode === m.id ? 'text-purple-700' : 'text-slate-800'
                  }`}>{m.id}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5 leading-tight">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Pace */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Trip Pace</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'slow', label: 'Chill', sub: 'Relaxed', activeColor: 'bg-teal-600 border-teal-500 text-teal-50' },
                { id: 'balanced', label: 'Balanced', sub: 'Mixed', activeColor: 'bg-purple-600 border-purple-500 text-purple-50' },
                { id: 'packed', label: 'Intense', sub: 'Packed', activeColor: 'bg-indigo-600 border-indigo-500 text-indigo-50' }
              ].map((p) => (
                <button key={p.id} type="button" onClick={() => setPace(p.id)}
                  className={`py-2.5 rounded-2xl text-center border-2 transition-all shadow-sm ${
                    pace === p.id 
                      ? `${p.activeColor} ring-2 ring-white shadow-md` 
                      : 'border-slate-100 bg-slate-50/60 text-slate-700 hover:border-purple-200'
                  }`}>
                  <p className="text-xs font-black tracking-wide">{p.label}</p>
                  <p className={`text-[9px] font-bold ${pace === p.id ? 'opacity-80' : 'text-slate-400'}`}>{p.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Getting Around</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ id: 'walk', label: 'Walking', icon: '🚶' }, { id: 'transit', label: 'Public', icon: '🚇' }, { id: 'car', label: 'Car/Taxi', icon: '🚕' }].map((t) => (
                <button key={t.id} type="button" onClick={() => setTransport(t.id)}
                  className={`py-2.5 rounded-2xl text-center border-2 transition-all ${
                    transport === t.id ? 'border-purple-400 bg-purple-50 shadow-sm' : 'border-slate-100 bg-slate-50/60 hover:border-purple-200'
                  }`}>
                  <span className="text-xl block mb-0.5">{t.icon}</span>
                  <p className={`text-[10px] font-black ${transport === t.id ? 'text-purple-700' : 'text-slate-700'}`}>{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div className="p-4 bg-gradient-to-br from-purple-50/40 to-indigo-50/20 rounded-2xl border border-slate-100">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Special Requests</label>
            <textarea rows={2} placeholder="Rooftop bars, street food, hidden gems..."
              value={interests} onChange={(e) => setInterests(e.target.value)}
              className="w-full px-4 py-3 text-xs rounded-2xl bg-white border-2 border-slate-200 focus:outline-none focus:border-purple-300 font-bold resize-none text-slate-700 placeholder-slate-300 shadow-sm transition-all leading-relaxed" />
          </div>

          {/* Submit Button */}
          <button type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-violet-600 hover:opacity-95 text-white font-black py-4 rounded-2xl shadow-[0_10px_25px_rgba(124,58,237,0.3)] transform active:scale-[0.98] transition-all text-sm tracking-widest uppercase">
            Build My Route ✦
          </button>
        </form>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 overflow-y-auto max-h-screen bg-slate-50/30">
        
        {/* Her iki durumda da en üstte kalacak olan şık Uçak Penceresi Görseli */}
        <div className="relative h-72 md:h-96 overflow-hidden rounded-b-[2.5rem] shadow-md">
          <img
            src={showPlan ? getCityImage(destination) : "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80"}
            alt="Travel Hero"
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/75" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <p className="text-purple-300 text-xs font-black uppercase tracking-widest mb-1.5 drop-shadow-sm">
              {showPlan ? "⚡ AI-Curated Experience Roadmap" : "✦ Your AI-powered travel companion"}
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-md">
              {showPlan ? destination : "Maceran Burada Başlıyor"}
            </h2>
            
            {showPlan ? (
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="bg-white/15 backdrop-blur-md text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-sm border border-white/10">{days} days</span>
                <span className="bg-white/15 backdrop-blur-md text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-sm border border-white/10">{peopleCount} {peopleCount === 1 ? 'person' : 'people'}</span>
                <span className="bg-white/15 backdrop-blur-md text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-sm border border-white/10 capitalize">{pace} pace</span>
                <span className="bg-white/15 backdrop-blur-md text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-sm border border-white/10">{mode || 'Custom Mode'}</span>
              </div>
            ) : (
              <p className="text-white/80 text-sm font-semibold max-w-lg leading-relaxed shadow-sm">
                Sol taraftan hedefini ve modunu seçip butona bastığında, Gemini yapay zekası senin için gün gün optimize edilmiş harika bir akış hazırlayacak.
              </p>
            )}
          </div>
        </div>

        {!showPlan ? (
          /* INITIAL STATE CONTENTS (Steps + Popular) */
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { step: "01", title: "Destination", desc: "Pick your dream city", icon: "🌍" },
                { step: "02", title: "Your Style", desc: "Choose travel mode", icon: "✨" },
                { step: "03", title: "Customize", desc: "Set pace & transport", icon: "⚡" },
                { step: "04", title: "Generate", desc: "Get your AI route", icon: "🗺️" },
              ].map((s) => (
                <div key={s.step} className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200">
                  <span className="text-3xl block mb-3 filter drop-shadow-sm">{s.icon}</span>
                  <p className="text-[10px] font-black text-purple-500 tracking-widest mb-1">{s.step}</p>
                  <p className="text-sm font-black text-slate-900 mb-1">{s.title}</p>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* POPULAR DESTINATIONS AREA */}
            <div className="mt-4">
              <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Popular Destinations</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { city: "Tokyo", country: "Japan", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80" },
                  { city: "Paris", country: "France", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80" },
                  { city: "Bali", country: "Indonesia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" },
                  { city: "New York", country: "USA", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80" },
                  { city: "Istanbul", country: "Turkey", img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80" },
                  { city: "Barcelona", country: "Spain", img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80" },
                ].map((dest) => (
                  <div 
                    key={dest.city} 
                    className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300"
                    onClick={() => handleSelectPopularCity(dest.city)} // Artik hem ismi yaziyor hem de plani aninda aciyor!
                  >
                    <img src={dest.img} alt={dest.city} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-black text-sm tracking-tight">{dest.city}</p>
                      <p className="text-white/70 text-xs font-bold">{dest.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE TIMELINE STATE CONTENTS */
          <div>
            {/* Progress Bar */}
            <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Progress</p>
                  <p className="text-sm font-black text-slate-800">{completedCount} of {totalCount} completed</p>
                </div>
                <div className="w-40 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500 shadow-sm" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-sm font-black text-purple-500 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">{progress}%</span>
              </div>
              <button onClick={() => setShowPlan(false)}
                className="text-xs font-black text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition-all">
                ✦ New Journey
              </button>
            </div>

            {/* Timeline Workspace */}
            <div className="p-6 md:p-10 max-w-3xl mx-auto">
              <div className="space-y-12">
                {mockRoute.map((dayPlan) => (
                  <div key={dayPlan.day} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
                        <span className="text-[11px] font-black tracking-wider uppercase text-purple-400">Day {dayPlan.day}</span>
                        <span className="w-1 h-2 bg-slate-700 rounded-full" />
                        <span className="text-xs font-bold text-slate-300">{dayPlan.theme}</span>
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-slate-200 to-transparent" />
                    </div>
                    
                    <div className="relative ml-4 pl-8 border-l-2 border-dashed border-slate-300 space-y-5">
                      {dayPlan.activities.map((act, index) => {
                        const isCompleted = completedActivities.includes(act.place);
                        const style = tagStyles[act.tag] || tagStyles.Default;
                        return (
                          <div key={index} className="relative group cursor-pointer" onClick={() => toggleActivity(act.place)}>
                            
                            {/* Checkpoint Check Circle */}
                            <div className={`absolute -left-[38px] top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              isCompleted 
                                ? 'bg-gradient-to-br from-purple-500 to-indigo-500 border-purple-600 scale-110 shadow-md shadow-purple-200' 
                                : 'bg-white border-slate-400 group-hover:border-purple-400 group-hover:scale-110 shadow-sm'
                            }`}>
                              {isCompleted && <span className="text-white text-[10px] font-black">✓</span>}
                            </div>
                            
                            {/* DYNAMIC CARD */}
                            <div className={`p-5 rounded-2xl transition-all duration-200 border ${
                              isCompleted 
                                ? 'opacity-30 bg-slate-200/60 border-slate-300 shadow-none scale-[0.99]' 
                                : `${style.bg} ${style.border} hover:shadow-lg hover:translate-x-0.5 hover:border-slate-300`
                            }`}>
                              <div className="flex justify-between items-start gap-4 mb-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className={`text-xs font-black tracking-wide ${isCompleted ? 'text-slate-400 line-through' : style.accent}`}>{act.time}</span>
                                  <h4 className={`font-black text-sm tracking-tight ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{act.place}</h4>
                                </div>
                                <span className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-lg border shadow-sm ${
                                  isCompleted ? 'bg-slate-300 text-slate-500 border-transparent' : style.badge
                                }`}>{act.tag}</span>
                              </div>
                              <p className={`text-xs leading-relaxed font-semibold ${isCompleted ? 'text-slate-400 line-through' : style.text}`}>{act.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}