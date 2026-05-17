import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Activity {
  time: string;
  place: string;
  desc: string;
  tag: string;
  estimatedCost?: string;
}

interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
}

interface SavedTrip {
  id: string;
  city: string;
  date: string;
  days: number;
  route: DayPlan[];
}

interface WeatherDay {
  label: string;
  outdoor: boolean;
  maxT: number;
  minT: number;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const tagStyles: { [key: string]: { bg: string; text: string; border: string; accent: string; badge: string } } = {
  'Ekonomik': {
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/70',
    text: 'text-emerald-950',
    border: 'border-l-4 border-l-emerald-500 border border-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.06)]',
    accent: 'text-emerald-600 font-black',
    badge: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-sm'
  },
  'Sokak Lezzeti': {
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/70',
    text: 'text-emerald-950',
    border: 'border-l-4 border-l-emerald-500 border border-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.06)]',
    accent: 'text-emerald-600 font-black',
    badge: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-sm'
  },
  'Lüks': {
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50/60',
    text: 'text-amber-950',
    border: 'border-l-4 border-l-amber-500 border border-amber-100 shadow-[0_4px_20px_rgba(245,158,11,0.06)]',
    accent: 'text-amber-600 font-black',
    badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold shadow-sm'
  },
  'Şık Restoran': {
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50/60',
    text: 'text-amber-950',
    border: 'border-l-4 border-l-amber-500 border border-amber-100 shadow-[0_4px_20px_rgba(245,158,11,0.06)]',
    accent: 'text-amber-600 font-black',
    badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold shadow-sm'
  },
  'Tarih': {
    bg: 'bg-gradient-to-br from-orange-50 to-rose-50/60',
    text: 'text-orange-950',
    border: 'border-l-4 border-l-orange-500 border border-orange-100 shadow-[0_4px_20px_rgba(249,115,22,0.06)]',
    accent: 'text-orange-600 font-black',
    badge: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold shadow-sm'
  },
  'Müze': {
    bg: 'bg-gradient-to-br from-orange-50 to-rose-50/60',
    text: 'text-orange-950',
    border: 'border-l-4 border-l-orange-500 border border-orange-100 shadow-[0_4px_20px_rgba(249,115,22,0.06)]',
    accent: 'text-orange-600 font-black',
    badge: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold shadow-sm'
  },
  'Gece Hayatı': {
    bg: 'bg-gradient-to-br from-purple-50 to-indigo-100/70',
    text: 'text-purple-950',
    border: 'border-l-4 border-l-purple-600 border border-purple-200 shadow-[0_4px_20px_rgba(147,51,234,0.08)]',
    accent: 'text-purple-700 font-black',
    badge: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold shadow-sm'
  },
  'Macera': {
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-50/70',
    text: 'text-cyan-950',
    border: 'border-l-4 border-l-cyan-500 border border-cyan-100 shadow-[0_4px_20px_rgba(6,182,212,0.06)]',
    accent: 'text-cyan-600 font-black',
    badge: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold shadow-sm'
  },
  'Doğa': {
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-50/70',
    text: 'text-cyan-950',
    border: 'border-l-4 border-l-cyan-500 border border-cyan-100 shadow-[0_4px_20px_rgba(6,182,212,0.06)]',
    accent: 'text-cyan-600 font-black',
    badge: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold shadow-sm'
  },
  'Alışveriş': {
    bg: 'bg-gradient-to-br from-pink-50 to-rose-50/70',
    text: 'text-pink-950',
    border: 'border-l-4 border-l-pink-500 border border-pink-100 shadow-[0_4px_20px_rgba(236,72,153,0.06)]',
    accent: 'text-pink-600 font-black',
    badge: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold shadow-sm'
  },
  'Genel': {
    bg: 'bg-gradient-to-br from-blue-50 to-sky-50/70',
    text: 'text-blue-950',
    border: 'border-l-4 border-l-purple-500 border border-purple-100 shadow-[0_4px_20px_rgba(147,51,234,0.06)]',
    accent: 'text-purple-600 font-black',
    badge: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold shadow-sm'
  },
};

const CITY_IMAGES: { [key: string]: string } = {
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  rome: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80',
  barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
  istanbul: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80',
};

// Şehir bazlı para birimi + dil ipuçları
const CITY_META: { [key: string]: { currency: string; lang: string; tip: string } } = {
  tokyo: { currency: '¥ JPY', lang: 'Japonca', tip: 'Nakit taşıyın, kartlar her yerde geçmez' },
  paris: { currency: '€ EUR', lang: 'Fransızca', tip: 'Bonjour demeyi unutmayın' },
  'new york': { currency: '$ USD', lang: 'İngilizce', tip: '%15-20 bahşiş kültür normu' },
  rome: { currency: '€ EUR', lang: 'İtalyanca', tip: 'Pek çok müze Pazartesi kapalı' },
  barcelona: { currency: '€ EUR', lang: 'Katalanca/İspanyolca', tip: 'Akşam yemeği 21:00\'den önce gitmeyin' },
  istanbul: { currency: '₺ TRY', lang: 'Türkçe', tip: 'Kapalıçarşı\'da pazarlık bekleniyor' },
  bali: { currency: 'Rp IDR', lang: 'Endonezyaca', tip: 'Tapınaklara girerken sarong zorunlu' },
  london: { currency: '£ GBP', lang: 'İngilizce', tip: 'Oyster kart al, günlük ücret sınırı var' },
};

const MODES = [
  { id: "Yerel & Gizli Cevherler", icon: "🕵️", desc: "Gizli sokaklar, yerel kafeler", fromColor: "from-emerald-500", toColor: "to-teal-600", borderHover: "hover:border-purple-400" },
  { id: "Teknoloji & Gelecek", icon: "🚀", desc: "İnovasyon, modern müzeler", fromColor: "from-purple-500", toColor: "to-indigo-600", borderHover: "hover:border-purple-400" },
  { id: "Sanat & Estetik", icon: "🎨", desc: "Galeriler, mimari, tasarım", fromColor: "from-purple-500", toColor: "to-pink-600", borderHover: "hover:border-purple-400" },
  { id: "Gece & Yüksek Enerji", icon: "🌆", desc: "Gece hayatı, manzara noktaları", fromColor: "from-orange-500", toColor: "to-rose-600", borderHover: "hover:border-purple-400" },
];

const travelSchema: any = {
  type: "object",
  properties: {
    route: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "integer" },
          theme: { type: "string" },
          activities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                time: { type: "string" },
                place: { type: "string" },
                desc: { type: "string" },
                tag: { type: "string" },
                estimatedCost: { type: "string" },
              },
              required: ["time", "place", "desc", "tag", "estimatedCost"]
            }
          }
        },
        required: ["day", "theme", "activities"]
      }
    }
  },
  required: ["route"]
};

const singleActivitySchema: any = {
  type: "object",
  properties: {
    time: { type: "string" },
    place: { type: "string" },
    desc: { type: "string" },
    tag: { type: "string" },
    estimatedCost: { type: "string" },
  },
  required: ["time", "place", "desc", "tag", "estimatedCost"]
};

// ─── WEATHER (Open-Meteo, ücretsiz & keysiz) ─────────────────────────────────

async function fetchWeather(city: string): Promise<WeatherDay[] | null> {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=tr&format=json`
    );
    const geoData = await geoRes.json();
    if (!geoData.results?.length) return null;
    const { latitude, longitude, timezone } = geoData.results[0];
    const wxRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=${timezone}&forecast_days=7`
    );
    const wxData = await wxRes.json();
    const { weathercode, temperature_2m_max, temperature_2m_min } = wxData.daily;
    return weathercode.map((code: number, i: number) => ({
      ...weatherCodeToDesc(code),
      maxT: Math.round(temperature_2m_max[i]),
      minT: Math.round(temperature_2m_min[i]),
    }));
  } catch {
    return null;
  }
}

function weatherCodeToDesc(code: number): { label: string; outdoor: boolean } {
  if (code === 0) return { label: 'Güneşli ☀️', outdoor: true };
  if (code <= 3) return { label: 'Parçalı Bulutlu 🌤️', outdoor: true };
  if (code <= 49) return { label: 'Sisli 🌫️', outdoor: true };
  if (code <= 67) return { label: 'Yağmurlu 🌧️', outdoor: false };
  if (code <= 77) return { label: 'Karlı ❄️', outdoor: false };
  if (code <= 82) return { label: 'Sağanak 🌦️', outdoor: false };
  return { label: 'Fırtınalı ⛈️', outdoor: false };
}

// ─── CONFETTI ─────────────────────────────────────────────────────────────────

function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 130 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 8 + 4,
      color: ['#8b5cf6','#06b6d4','#f59e0b','#ec4899','#10b981'][Math.floor(Math.random() * 5)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 8,
    }));
    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += p.rv;
      });
      if (!pieces.every(p => p.y > canvas.height)) frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }} />;
}

// ─── SKELETON LOADING ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="animate-pulse p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <div className="h-4 w-12 bg-slate-200 rounded-lg" />
          <div className="h-4 w-36 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-5 w-16 bg-slate-200 rounded-lg" />
      </div>
      <div className="h-3 w-full bg-slate-100 rounded" />
      <div className="h-3 w-4/5 bg-slate-100 rounded" />
      <div className="h-6 w-24 bg-slate-100 rounded-lg" />
    </div>
  );
}

function SkeletonDay() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="animate-pulse h-9 w-52 bg-slate-200 rounded-xl" />
        <div className="flex-1 h-0.5 bg-slate-100" />
      </div>
      <div className="ml-4 pl-8 border-l-2 border-dashed border-slate-200 space-y-4">
        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<'planner' | 'profile'>('planner');
  const [isDark, setIsDark] = useState(false);

  // Form state (orijinaliyle aynı)
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [peopleCount, setPeopleCount] = useState(1);
  const [pace, setPace] = useState('Dengeli');
  const [transport, setTransport] = useState('Toplu Taşıma');
  const [mode, setMode] = useState('');
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState('Orta');
  const [startDate, setStartDate] = useState('');

  // Plan state (orijinaliyle aynı)
  const [showPlan, setShowPlan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedRoute, setGeneratedRoute] = useState<DayPlan[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [history, setHistory] = useState<SavedTrip[]>([]);
  const [currentTripId, setCurrentTripId] = useState<string>('');

  // Yeni feature state
  const [weather, setWeather] = useState<WeatherDay[] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [regeneratingIdx, setRegeneratingIdx] = useState<string | null>(null);
  const dragFrom = useRef<{ dayIdx: number; actIdx: number } | null>(null);

  // localStorage'dan geçmişi yükle
  useEffect(() => {
    const saved = localStorage.getItem('smarttrip_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Aktif seyahat değişince tikleri yükle
  useEffect(() => {
    if (currentTripId) {
      const saved = localStorage.getItem(`ticks_${currentTripId}`);
      setCompletedActivities(saved ? JSON.parse(saved) : []);
    }
  }, [currentTripId]);

  // Progress hesapla
  const allActivities = generatedRoute.flatMap(d => d.activities);
  const completedCount = allActivities.filter(a => completedActivities.includes(a.place)).length;
  const totalCount = allActivities.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Bütçe toplamı
  const totalBudgetNum = allActivities.reduce((sum, a) => {
    const match = a.estimatedCost?.match(/[\d.,]+/);
    return sum + (match ? parseFloat(match[0].replace(',', '.')) : 0);
  }, 0);

  // Gün tamamlama konfeti
  useEffect(() => {
    if (progress === 100 && totalCount > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4500);
    }
  }, [progress, totalCount]);

  // ── Gemini API (orijinal yaklaşım korundu) ─────────────────────────────────

  const getGenAI = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('VITE_GEMINI_API_KEY bulunamadı.');
    return new GoogleGenerativeAI(apiKey);
  };

  const generateTravelRoute = async (targetCity: string) => {
    setLoading(true);
    setShowPlan(true);
    setCompletedActivities([]);
    setWeather(null);
    const generatedId = Date.now().toString();
    setCurrentTripId(generatedId);

    // Hava durumu paralelde çek
    fetchWeather(targetCity).then(wx => setWeather(wx));

    try {
      const genAI = getGenAI();
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: travelSchema,
        },
      });

      const prompt = `
        Sen uzman bir dünya seyahat planlayıcısısın. ${targetCity} şehri için harika, özelleştirilmiş Türkçe bir seyahat rotası oluştur.
        Seyahat Detayları:
        - Süre: ${days} Gün, Gezgin: ${peopleCount} Kişi, Tempo: ${pace}, Ulaşım: ${transport}, Tarz: ${mode || 'Genel'}, Bütçe: ${budget}, Notlar: ${interests}
        Tüm çıktıları Türkçe yaz. Zaman formatını "09:30" yap.
        Etiketler: "Ekonomik", "Sokak Lezzeti", "Lüks", "Şık Restoran", "Tarih", "Müze", "Gece Hayatı", "Macera", "Doğa", "Alışveriş", veya "Genel".
        estimatedCost alanına kişi başı yaklaşık maliyet yaz (şehre uygun para biriminde, örn: "€5-15" veya "¥500-1200").
        Gerçek yerler üret.
      `;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text().trim();
      if (responseText.startsWith('```')) {
        responseText = responseText.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
      }
      const parsedData = JSON.parse(responseText);
      const newRoute: DayPlan[] = parsedData.route;
      setGeneratedRoute(newRoute);

      const newTrip: SavedTrip = {
        id: generatedId,
        city: targetCity,
        date: new Date().toLocaleDateString('tr-TR', { month: 'short', day: 'numeric', year: 'numeric' }),
        days,
        route: newRoute,
      };
      const updatedHistory = [newTrip, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('smarttrip_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Gemini API Error:', error);
      alert('Gemini ile iletişim kurulurken bir hata oluştu. .env dosyanızı veya bağlantınızı kontrol edin.');
      setShowPlan(false);
    } finally {
      setLoading(false);
    }
  };

  // ── Tek aktivite yenile ───────────────────────────────────────────────────

  const regenerateActivity = async (dayIdx: number, actIdx: number) => {
    const key = `${dayIdx}-${actIdx}`;
    setRegeneratingIdx(key);
    try {
      const genAI = getGenAI();
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: singleActivitySchema,
        },
      });
      const day = generatedRoute[dayIdx];
      const existing = day.activities.map(a => a.place).join(', ');
      const current = day.activities[actIdx];
      const prompt = `
        ${destination} şehri için tek bir aktivite öner.
        Şu yerler OLMAMALI: ${existing}.
        Aynı saat: ${current.time}, Gün teması: ${day.theme}, Bütçe: ${budget}.
        Türkçe açıklama yaz. estimatedCost şehre uygun para biriminde olsun.
      `;
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      if (text.startsWith('```')) text = text.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
      const newAct: Activity = JSON.parse(text);
      const updatedRoute = generatedRoute.map((d, di) =>
        di !== dayIdx ? d : {
          ...d,
          activities: d.activities.map((a, ai) => ai === actIdx ? { ...newAct, time: current.time } : a),
        }
      );
      setGeneratedRoute(updatedRoute);
    } catch (e) {
      console.error(e);
      alert('Aktivite yenilenemedi.');
    } finally {
      setRegeneratingIdx(null);
    }
  };

  // ── Drag & Drop ──────────────────────────────────────────────────────────

  const handleDragStart = (dayIdx: number, actIdx: number) => {
    dragFrom.current = { dayIdx, actIdx };
  };

  const handleDrop = (dayIdx: number, actIdx: number) => {
    if (!dragFrom.current) return;
    const { dayIdx: fromDay, actIdx: fromAct } = dragFrom.current;
    if (fromDay !== dayIdx || fromAct === actIdx) { dragFrom.current = null; return; }
    const updatedRoute = generatedRoute.map((d, di) => {
      if (di !== dayIdx) return d;
      const acts = [...d.activities];
      const [moved] = acts.splice(fromAct, 1);
      acts.splice(actIdx, 0, moved);
      return { ...d, activities: acts };
    });
    setGeneratedRoute(updatedRoute);
    dragFrom.current = null;
  };

  // ── Diğer handler'lar (orijinalle aynı) ─────────────────────────────────

  const handlePlanTrip = (e: React.FormEvent) => {
    e.preventDefault();
    generateTravelRoute(destination);
  };

  const handleSelectPopularCity = (cityName: string) => {
    setDestination(cityName);
    generateTravelRoute(cityName);
  };

  const handleSelectHistoryTrip = (trip: SavedTrip) => {
    setDestination(trip.city);
    setDays(trip.days);
    setGeneratedRoute(trip.route);
    setCurrentTripId(trip.id);
    setShowPlan(true);
    setActiveTab('planner');
    fetchWeather(trip.city).then(wx => setWeather(wx));
  };

  const toggleActivity = (placeName: string) => {
    const updated = completedActivities.includes(placeName)
      ? completedActivities.filter(i => i !== placeName)
      : [...completedActivities, placeName];
    setCompletedActivities(updated);
    if (currentTripId) localStorage.setItem(`ticks_${currentTripId}`, JSON.stringify(updated));
  };

  // ── Export (txt indir) ───────────────────────────────────────────────────

  const handleExport = () => {
    const text = generatedRoute.map(d =>
      `📅 ${d.day}. Gün — ${d.theme}\n` +
      d.activities.map(a => `  ${a.time}  ${a.place}  (${a.estimatedCost || ''})\n  ${a.desc}`).join('\n\n')
    ).join('\n\n' + '─'.repeat(40) + '\n\n');
    const blob = new Blob([`SmartTrip AI — ${destination} Rotası\n\n${text}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${destination.replace(/\s/g, '-')}-rota.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getCityImage = (city: string) => CITY_IMAGES[city.toLowerCase().trim()] || CITY_IMAGES['default'];
  const getCityMeta = (city: string) => CITY_META[city.toLowerCase().trim()] || null;
  const cityMeta = getCityMeta(destination);

  // dark mode kısa isimler
  const bg = isDark ? 'bg-[#0f0e17]' : 'bg-slate-50';
  const panelBg = isDark ? 'bg-[#1a1826] border-slate-800' : 'bg-white border-slate-100';
  const txt = isDark ? 'text-slate-100' : 'text-slate-900';
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputCls = isDark
    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-purple-500'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-300 focus:border-purple-400';
  const cardBase = isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/60 border-slate-100';

  return (
    <div className={`min-h-screen ${bg} font-sans flex flex-col md:flex-row transition-colors duration-300`}>
      <Confetti active={showConfetti} />

      {/* ═══════════════════════ LEFT PANEL ═══════════════════════════════════ */}
      <div className={`w-full md:w-[410px] flex-shrink-0 ${panelBg} flex flex-col overflow-y-auto max-h-screen shadow-[10px_0_30px_rgba(0,0,0,0.05)] z-10 border-r transition-colors duration-300`}>

        {/* Logo & nav tabs */}
        <div className={`px-8 pt-8 pb-4 sticky top-0 z-20 ${isDark ? 'bg-[#1a1826]' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black bg-gradient-to-r from-purple-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent tracking-tight">SmartTrip</span>
              <span className={`text-3xl font-black ${txt} tracking-tight`}>AI</span>
            </div>
            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={() => setIsDark(d => !d)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}
              title="Tema değiştir"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-100 border-slate-200/50'}`}>
            <button type="button" onClick={() => setActiveTab('planner')}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all uppercase tracking-wider ${activeTab === 'planner' ? (isDark ? 'bg-slate-700 text-purple-400 shadow-sm' : 'bg-white text-purple-600 shadow-sm') : muted}`}>
              🗺️ Planlayıcı
            </button>
            <button type="button" onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all uppercase tracking-wider ${activeTab === 'profile' ? (isDark ? 'bg-slate-700 text-purple-400 shadow-sm' : 'bg-white text-purple-600 shadow-sm') : muted}`}>
              👤 Profilim
            </button>
          </div>
        </div>

        {/* ─── TAB: PLANNER ──────────────────────────────────────────────────── */}
        {activeTab === 'planner' ? (
          <form onSubmit={handlePlanTrip} className="flex flex-col gap-6 px-8 pb-8 flex-1">

            {/* Destination */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gradient-to-br from-purple-50/40 to-indigo-50/20 border-slate-100'}`}>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${muted}`}>Nereye Gidiyorsun? 🌍</label>
              <input
                type="text"
                placeholder="Tokyo, Paris, İstanbul..."
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className={`w-full px-4 py-3.5 text-sm rounded-2xl border-2 font-bold transition-all ${inputCls} shadow-sm`}
                required
              />
            </div>

            {/* Başlangıç tarihi — hava durumu için */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${muted}`}>🗓️ Başlangıç Tarihi <span className="normal-case font-bold opacity-60">(opsiyonel — hava durumu için)</span></label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className={`w-full px-4 py-3 text-sm rounded-2xl border-2 font-bold transition-all ${inputCls} shadow-sm`}
              />
            </div>

            {/* Days + Travelers */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-2xl p-4 border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gradient-to-br from-purple-50/30 to-indigo-50/20 border-slate-100'} flex flex-col justify-between`}>
                <div className="flex justify-between items-center mb-3">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>Gün Sayısı</label>
                  <span className="text-sm font-black bg-purple-600 text-white px-2.5 py-0.5 rounded-lg shadow-sm">{days} Gün</span>
                </div>
                <input type="range" min="1" max="7" value={days}
                  onChange={e => setDays(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer" />
                <div className={`flex justify-between text-[9px] font-black mt-1.5 ${muted}`}><span>1 Gün</span><span>7 Gün</span></div>
              </div>

              <div className={`rounded-2xl p-4 border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gradient-to-br from-purple-50/30 to-indigo-50/20 border-slate-100'}`}>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 ${muted}`}>Gezgin Sayısı</label>
                <div className={`flex items-center justify-between px-2 py-1 rounded-xl border shadow-sm ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
                  <button type="button" onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                    className={`w-7 h-7 rounded-lg font-black hover:text-purple-500 transition-all text-base flex items-center justify-center ${isDark ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' : 'bg-slate-50 text-slate-600 hover:bg-purple-50'}`}>−</button>
                  <span className={`text-xl font-black ${txt}`}>{peopleCount}</span>
                  <button type="button" onClick={() => setPeopleCount(Math.min(20, peopleCount + 1))}
                    className={`w-7 h-7 rounded-lg font-black hover:text-purple-500 transition-all text-base flex items-center justify-center ${isDark ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' : 'bg-slate-50 text-slate-600 hover:bg-purple-50'}`}>+</button>
                </div>
                <p className={`text-[10px] font-black text-center mt-2 uppercase tracking-wide ${muted}`}>
                  {peopleCount === 1 ? 'Solo Gezgin' : peopleCount <= 3 ? 'Küçük Grup' : 'Büyük Grup'}
                </p>
              </div>
            </div>

            {/* Bütçe seviyesi */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${muted}`}>💰 Bütçe Seviyesi</label>
              <div className="grid grid-cols-3 gap-2">
                {['Ekonomik', 'Orta', 'Lüks'].map(b => (
                  <button key={b} type="button" onClick={() => setBudget(b)}
                    className={`py-2.5 rounded-2xl text-center border-2 transition-all text-[11px] font-black ${budget === b
                      ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-300'
                      : `${cardBase} ${isDark ? 'text-slate-300' : 'text-slate-700'} hover:border-purple-200`}`}>
                    {b === 'Ekonomik' ? '🪙' : b === 'Orta' ? '💳' : '💎'} {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-3 ${muted}`}>Seyahat Modu</label>
              <div className="grid grid-cols-2 gap-2">
                {MODES.map(m => (
                  <button key={m.id} type="button" onClick={() => setMode(m.id)}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all duration-200 ${m.borderHover} ${
                      mode === m.id
                        ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50/30 shadow-md ring-1 ring-purple-300'
                        : `${cardBase}`
                    }`}>
                    <span className="text-2xl block mb-1.5 filter drop-shadow-sm">{m.icon}</span>
                    <p className={`text-[11px] font-black leading-tight ${mode === m.id ? 'text-purple-700' : txt}`}>{m.id}</p>
                    <p className={`text-[10px] font-bold mt-0.5 leading-tight ${muted}`}>{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Pace */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${muted}`}>Seyahat Temposu</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Sakin', sub: 'Rahat', activeColor: 'bg-teal-600 border-teal-500 text-teal-50' },
                  { id: 'Dengeli', sub: 'Karma', activeColor: 'bg-purple-600 border-purple-500 text-purple-50' },
                  { id: 'Yoğun', sub: 'Dolu Dolu', activeColor: 'bg-indigo-600 border-indigo-500 text-indigo-50' },
                ].map(p => (
                  <button key={p.id} type="button" onClick={() => setPace(p.id)}
                    className={`py-2.5 rounded-2xl text-center border-2 transition-all shadow-sm ${
                      pace === p.id ? `${p.activeColor} ring-2 ring-white shadow-md` : `${cardBase} ${isDark ? 'text-slate-300' : 'text-slate-700'} hover:border-purple-200`
                    }`}>
                    <p className="text-xs font-black tracking-wide">{p.id}</p>
                    <p className={`text-[9px] font-bold ${pace === p.id ? 'opacity-80' : muted}`}>{p.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Transport */}
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${muted}`}>Şehir İçi Ulaşım</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Yürüyüş', label: 'Yürüyüş', icon: '🚶' },
                  { id: 'Toplu Taşıma', label: 'Metro/Otobüs', icon: '🚇' },
                  { id: 'Araç / Taksi', label: 'Taksi/Araç', icon: '🚕' },
                ].map(t => (
                  <button key={t.id} type="button" onClick={() => setTransport(t.id)}
                    className={`py-2.5 rounded-2xl text-center border-2 transition-all ${
                      transport === t.id
                        ? 'border-purple-400 bg-purple-50 shadow-sm'
                        : `${cardBase} hover:border-slate-200`
                    }`}>
                    <span className="text-xl block mb-0.5">{t.icon}</span>
                    <p className={`text-[10px] font-black ${transport === t.id ? 'text-purple-700' : (isDark ? 'text-slate-300' : 'text-slate-700')}`}>{t.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gradient-to-br from-purple-50/40 to-indigo-50/20 border-slate-100'}`}>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${muted}`}>Özel İstekler & İlgi Alanları</label>
              <textarea rows={2} placeholder="Teras barlar, yerel kahveciler, ucuz sokak lezzetleri..."
                value={interests} onChange={e => setInterests(e.target.value)}
                className={`w-full px-4 py-3 text-xs rounded-2xl border-2 font-bold resize-none transition-all leading-relaxed ${inputCls} shadow-sm`} />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-violet-600 hover:opacity-95 text-white font-black py-4 rounded-2xl shadow-[0_10px_25px_rgba(124,58,237,0.3)] transform active:scale-[0.98] transition-all text-sm tracking-widest uppercase disabled:opacity-50">
              {loading ? 'Rota Çiziliyor... 🧠' : 'Rotamı Oluştur ✦'}
            </button>
          </form>

        ) : (
          /* ─── TAB: PROFILE ─────────────────────────────────────────────────── */
          <div className="flex-1 px-8 pb-8 flex flex-col gap-4 animate-in fade-in duration-300">
            <div className={`border-b pb-3 mt-2 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <h3 className={`text-sm font-black uppercase tracking-wider ${muted}`}>Seyahat Günlüğüm</h3>
              <p className={`text-[11px] font-bold mt-0.5 ${muted}`}>{history.length} rota kayıtlı</p>
            </div>
            {history.length === 0 ? (
              <div className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed text-center mt-4 ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
                <span className="text-3xl mb-2">🎒</span>
                <h4 className={`text-xs font-black uppercase tracking-wide ${txt}`}>Henüz Rota Yok</h4>
                <p className={`text-[10px] font-bold max-w-[180px] mt-1 leading-normal ${muted}`}>İlk rotanı oluşturduğunda burada listelenecek!</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1">
                {history.map(trip => (
                  <div key={trip.id} onClick={() => handleSelectHistoryTrip(trip)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all group flex items-center justify-between gap-4 hover:border-purple-400 hover:shadow-md hover:translate-x-0.5 ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gradient-to-br from-white to-slate-50/50 border-slate-200/80 shadow-sm'}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-sm" />
                        <h4 className={`font-black text-sm tracking-tight group-hover:text-purple-600 transition-colors ${txt}`}>{trip.city}</h4>
                      </div>
                      <p className={`text-[10px] font-extrabold uppercase tracking-wider pl-3.5 ${muted}`}>
                        {trip.date} • <span className="text-purple-500">{trip.days} Günlük</span>
                      </p>
                    </div>
                    <span className={`text-lg p-2 rounded-xl border transition-all group-hover:bg-purple-600 group-hover:text-white shadow-sm ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-purple-50 border-purple-100'}`}>✈️</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════ RIGHT PANEL ══════════════════════════════════ */}
      <div className={`flex-1 overflow-y-auto max-h-screen ${isDark ? 'bg-[#0f0e17]' : 'bg-slate-50/30'} transition-colors duration-300`}>

        {/* Hero */}
        <div className="relative h-72 md:h-96 overflow-hidden rounded-b-[2.5rem] shadow-md">
          <img src={getCityImage(destination)} alt={destination || 'Travel Hero'}
            className="w-full h-full object-cover transition-all duration-700 filter brightness-[0.85]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/75" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <p className="text-purple-300 text-xs font-black uppercase tracking-widest mb-1.5 drop-shadow-sm">
              {showPlan ? '⚡ YAPAY ZEKA DESTEKLİ GEZİ ROTAN' : '✦ Akıllı Seyahat Asistanın'}
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-md capitalize">
              {destination || 'Maceran Burada Başlıyor'}
            </h2>
            {showPlan && (
              <div className="flex items-center gap-2.5 flex-wrap">
                {[`${days} GÜN`, `${peopleCount} KİŞİ`, `${pace} TEMPO`, mode || 'Özel Mod', budget].map(tag => (
                  <span key={tag} className="bg-white/15 backdrop-blur-md text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-sm border border-white/10 uppercase">{tag}</span>
                ))}
              </div>
            )}
            {!showPlan && (
              <p className="text-white/80 text-sm font-semibold max-w-lg leading-relaxed">
                Sol taraftan hedefini ve modunu seçip butona bastığında, Gemini yapay zekası senin için gün gün optimize edilmiş harika bir akış hazırlayacak.
              </p>
            )}
          </div>
        </div>

        {/* Şehir meta bilgisi */}
        {cityMeta && showPlan && (
          <div className={`mx-6 md:mx-10 mt-4 p-4 rounded-2xl border flex items-center gap-4 flex-wrap text-xs ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
            <span className="text-xl">🌐</span>
            <span className={`font-black ${txt}`}>💱 {cityMeta.currency}</span>
            <span className={`font-black ${txt}`}>🗣️ {cityMeta.lang}</span>
            <span className={muted}>💡 {cityMeta.tip}</span>
          </div>
        )}

        {/* ─── LOADING: Skeleton ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-12">
            {Array.from({ length: days }).map((_, i) => <SkeletonDay key={i} />)}
          </div>

        ) : !showPlan ? (
          /* ─── LANDING ─────────────────────────────────────────────────────── */
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { step: '01', title: 'Hedef Şehir', desc: 'Hayalindeki şehri seç', icon: '🌍' },
                { step: '02', title: 'Seyahat Tarzı', desc: 'Sana uyan modu seç', icon: '✨' },
                { step: '03', title: 'Özelleştir', desc: 'Tempo & bütçe ayarla', icon: '⚡' },
                { step: '04', title: 'Yolculuk', desc: 'AI rotanı keşfet', icon: '🗺️' },
              ].map(s => (
                <div key={s.step} className={`rounded-2xl p-5 border transition-all hover:shadow-md ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'}`}>
                  <span className="text-3xl block mb-3 filter drop-shadow-sm">{s.icon}</span>
                  <p className="text-[10px] font-black text-purple-500 tracking-widest mb-1">{s.step}</p>
                  <p className={`text-sm font-black mb-1 ${txt}`}>{s.title}</p>
                  <p className={`text-xs font-bold leading-relaxed ${muted}`}>{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h3 className={`text-lg font-black mb-4 tracking-tight ${txt}`}>Popüler Şehirler</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { city: 'Tokyo', country: 'Japonya' },
                  { city: 'Paris', country: 'Fransa' },
                  { city: 'Bali', country: 'Endonezya' },
                  { city: 'New York', country: 'ABD' },
                  { city: 'Istanbul', country: 'Türkiye' },
                  { city: 'Barcelona', country: 'İspanya' },
                ].map(dest => (
                  <div key={dest.city} onClick={() => handleSelectPopularCity(dest.city)}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300">
                    <img src={getCityImage(dest.city)} alt={dest.city}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
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
          /* ─── PLAN VIEW ───────────────────────────────────────────────────── */
          <div className="animate-in fade-in duration-300">

            {/* Progress bar (sticky) */}
            <div className={`sticky top-0 z-10 px-8 py-4 flex items-center justify-between border-b shadow-sm backdrop-blur-md transition-colors ${isDark ? 'bg-[#1a1826]/90 border-slate-800' : 'bg-white/90 border-slate-100'}`}>
              <div className="flex items-center gap-4 min-w-0">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>Rota İlerlemesi</p>
                  <p className={`text-sm font-black ${txt}`}>{completedCount} / {totalCount} Yer Gezildi</p>
                </div>
                <div className={`w-36 h-2.5 rounded-full overflow-hidden border shadow-inner ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200/50'}`}>
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }} />
                </div>
                <span className="text-sm font-black text-purple-500 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">%{progress}</span>

                {/* Bütçe özeti (kompakt) */}
                {totalBudgetNum > 0 && (
                  <span className={`hidden md:inline-flex text-[10px] font-black px-2.5 py-1 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    💰 ~{totalBudgetNum.toFixed(0)} toplam
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={handleExport}
                  className={`text-xs font-black px-3 py-2 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
                  📤 Dışa Aktar
                </button>
                <button onClick={() => { setShowPlan(false); setDestination(''); setGeneratedRoute([]); setWeather(null); }}
                  className="text-xs font-black text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition-all">
                  ✦ Yeni Rota
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6 md:p-10 max-w-3xl mx-auto">
              <div className="space-y-12">
                {generatedRoute.map((dayPlan, dayIdx) => {
                  const wxDay = weather?.[dayPlan.day - 1] ?? null;
                  const dayCompleted = dayPlan.activities.length > 0 &&
                    dayPlan.activities.every(a => completedActivities.includes(a.place));

                  return (
                    <div key={dayPlan.day} className="space-y-6">
                      {/* Day header */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className={`px-4 py-2 rounded-xl shadow-md flex items-center gap-2 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-900'}`}>
                          <span className="text-[11px] font-black tracking-wider uppercase text-purple-400">{dayPlan.day}. Gün</span>
                          <span className="w-1 h-2 bg-slate-600 rounded-full" />
                          <span className="text-xs font-bold text-slate-300">{dayPlan.theme}</span>
                          {dayCompleted && <span className="text-sm ml-1">🎉</span>}
                        </div>

                        {/* Hava durumu badge */}
                        {wxDay && (
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}>
                            <span>{wxDay.label}</span>
                            <span className="font-black">{wxDay.minT}–{wxDay.maxT}°C</span>
                            {!wxDay.outdoor && (
                              <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">İç mekan öner!</span>
                            )}
                          </div>
                        )}

                        <div className="flex-1 h-0.5 bg-gradient-to-r from-slate-200 to-transparent" />
                      </div>

                      {/* Activities */}
                      <div className="relative ml-4 pl-8 border-l-2 border-dashed border-slate-300 space-y-5">
                        {dayPlan.activities.map((act, actIdx) => {
                          const isCompleted = completedActivities.includes(act.place);
                          const style = tagStyles[act.tag] || tagStyles['Genel'];
                          const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(act.place + ' ' + destination)}`;
                          const regKey = `${dayIdx}-${actIdx}`;

                          return (
                            <div
                              key={actIdx}
                              draggable
                              onDragStart={() => handleDragStart(dayIdx, actIdx)}
                              onDragOver={e => e.preventDefault()}
                              onDrop={() => handleDrop(dayIdx, actIdx)}
                              className={`relative group transition-all duration-300 ${isCompleted ? 'opacity-30 scale-[0.98]' : 'cursor-grab active:cursor-grabbing'}`}
                            >
                              {/* Checkpoint */}
                              <button
                                type="button"
                                onClick={() => toggleActivity(act.place)}
                                className={`absolute -left-[38px] top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 z-10 ${
                                  isCompleted
                                    ? 'bg-gradient-to-br from-purple-500 to-indigo-500 border-purple-600 scale-110 shadow-md shadow-purple-200'
                                    : `${isDark ? 'bg-slate-700 border-slate-500' : 'bg-white border-slate-400'} group-hover:border-purple-400 group-hover:scale-110 shadow-sm`
                                }`}
                              >
                                {isCompleted && <span className="text-white text-[10px] font-black">✓</span>}
                              </button>

                              {/* Card */}
                              <div className={`p-5 rounded-2xl transition-all duration-200 border ${
                                isCompleted
                                  ? `opacity-30 ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-200/60 border-slate-300'} shadow-none scale-[0.99]`
                                  : `${isDark ? 'bg-slate-800/60' : style.bg} ${style.border} hover:shadow-lg hover:translate-x-0.5`
                              }`}>
                                <div className="flex justify-between items-start gap-4 mb-2">
                                  <div className="flex items-center gap-3 flex-wrap min-w-0">
                                    <span className={`text-xs font-black tracking-wide flex-shrink-0 ${isCompleted ? (isDark ? 'text-slate-500 line-through' : 'text-slate-400 line-through') : style.accent}`}>
                                      {act.time}
                                    </span>
                                    <h4 className={`font-black text-sm tracking-tight ${isCompleted ? 'line-through text-slate-400' : (isDark ? 'text-slate-100' : 'text-slate-800')}`}>
                                      {act.place}
                                    </h4>
                                    {/* Tahmini maliyet */}
                                    {act.estimatedCost && !isCompleted && (
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${isDark ? 'bg-slate-700 text-slate-300 border border-slate-600' : 'bg-white/70 text-slate-500 border border-slate-200'}`}>
                                        ~{act.estimatedCost}
                                      </span>
                                    )}
                                  </div>
                                  <span className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-lg border shadow-sm flex-shrink-0 ${
                                    isCompleted ? 'bg-slate-300 text-slate-500 border-transparent' : style.badge
                                  }`}>
                                    {act.tag}
                                  </span>
                                </div>

                                <p className={`text-xs leading-relaxed font-semibold mb-3 ${isCompleted ? 'line-through text-slate-400' : (isDark ? 'text-slate-300' : 'text-slate-600')}`}>
                                  {act.desc}
                                </p>

                                {!isCompleted && (
                                  <div className="flex gap-2 flex-wrap">
                                    <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                                      className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all active:scale-95 ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600' : 'bg-white/80 hover:bg-white text-purple-700 border-purple-200'}`}>
                                      📍 Haritada Gör
                                    </a>
                                    {/* Aktiviteyi yenile butonu */}
                                    <button
                                      type="button"
                                      onClick={() => regenerateActivity(dayIdx, actIdx)}
                                      disabled={regeneratingIdx === regKey}
                                      className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all active:scale-95 disabled:opacity-50 ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600' : 'bg-white/80 hover:bg-white text-rose-600 border-rose-200'}`}>
                                      {regeneratingIdx === regKey ? '⏳ Yükleniyor...' : '🔄 Beğenmedim, Değiştir'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Bütçe özet kartı */}
                {totalBudgetNum > 0 && (
                  <div className={`p-5 rounded-2xl border mt-4 ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <h3 className={`text-sm font-black mb-3 ${txt}`}>💰 Tahmini Bütçe Özeti</h3>
                    <div className="grid grid-cols-3 gap-3 text-center mb-3">
                      {generatedRoute.map(d => {
                        const dayTotal = d.activities.reduce((s, a) => {
                          const m = a.estimatedCost?.match(/[\d.,]+/);
                          return s + (m ? parseFloat(m[0].replace(',', '.')) : 0);
                        }, 0);
                        return (
                          <div key={d.day} className={`p-3 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                            <p className={`text-[10px] font-black uppercase ${muted}`}>{d.day}. Gün</p>
                            <p className={`text-sm font-black mt-0.5 ${txt}`}>~{dayTotal.toFixed(0)}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className={`pt-3 border-t flex justify-between items-center ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                      <span className={`text-xs font-black ${muted}`}>Toplam (kişi başı, tahmini)</span>
                      <span className="text-base font-black text-purple-600">~{totalBudgetNum.toFixed(0)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE BOTTOM NAV ──────────────────────────────────────────────────── */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t z-50 flex backdrop-blur-md transition-colors ${isDark ? 'bg-[#1a1826]/95 border-slate-800' : 'bg-white/95 border-slate-100'}`}>
        {[
          { id: 'planner' as const, icon: '🗺️', label: 'Planlayıcı' },
          { id: 'profile' as const, icon: '👤', label: 'Profilim' },
        ].map(tab => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-wide transition-all ${activeTab === tab.id ? 'text-purple-600' : muted}`}>
            <span className="text-xl">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}