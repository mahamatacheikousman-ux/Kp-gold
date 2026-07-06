import React, { useState, useMemo } from "react";
import { MapPin, Phone, MessageCircle, Share2, Wifi, WifiOff, ChevronLeft, Search, ShieldCheck, Wheat, Smartphone, Shirt, Wrench, HeartPulse, Car, Store, ShoppingBag, Clock, PiggyBank, Globe2, X, Briefcase, UtensilsCrossed, Newspaper, Heart, MessageSquare, Star, Video, Users } from "lucide-react";

// ============ THEME ============
const GOLD = "#D4AF37";
const GREEN = "#1B5E3C";
const BLACK = "#0A0A0A";
const CARD = "#151512";

// ============ DONNEES DE DEMO ============
const LANGS = [
  { code: "fr", label: "Français" }, { code: "ha", label: "Hausa" }, { code: "ff", label: "Fulfulde" },
  { code: "bm", label: "Bambara" }, { code: "ar", label: "العربية" }, { code: "sw", label: "Kiswahili" },
  { code: "yo", label: "Yorùbá" }, { code: "wo", label: "Wolof" }, { code: "ln", label: "Lingala" },
  { code: "zu", label: "Zulu" }, { code: "am", label: "አማርኛ" }, { code: "en", label: "English" },
];

const COUNTRIES = [
  "Afghanistan","Afrique du Sud","Albanie","Algérie","Allemagne","Andorre","Angola","Arabie Saoudite","Argentine","Arménie",
  "Australie","Autriche","Azerbaïdjan","Bahamas","Bahreïn","Bangladesh","Barbade","Belgique","Belize","Bénin",
  "Bhoutan","Biélorussie","Birmanie","Bolivie","Bosnie-Herzégovine","Botswana","Brésil","Brunei","Bulgarie","Burkina Faso",
  "Burundi","Cambodge","Cameroun","Canada","Cap-Vert","Chili","Chine","Chypre","Colombie","Comores",
  "Congo-Brazzaville","Congo-Kinshasa","Corée du Nord","Corée du Sud","Costa Rica","Côte d'Ivoire","Croatie","Cuba","Danemark","Djibouti",
  "Égypte","Émirats arabes unis","Équateur","Érythrée","Espagne","Estonie","Eswatini","États-Unis","Éthiopie","Fidji",
  "Finlande","France","Gabon","Gambie","Géorgie","Ghana","Grèce","Grenade","Guatemala","Guinée",
  "Guinée-Bissau","Guinée équatoriale","Guyana","Haïti","Honduras","Hongrie","Inde","Indonésie","Irak","Iran",
  "Irlande","Islande","Israël","Italie","Jamaïque","Japon","Jordanie","Kazakhstan","Kenya","Kirghizistan",
  "Kiribati","Kosovo","Koweït","Laos","Lesotho","Lettonie","Liban","Liberia","Libye","Liechtenstein",
  "Lituanie","Luxembourg","Macédoine du Nord","Madagascar","Malaisie","Malawi","Maldives","Mali","Malte","Maroc",
  "Marshall","Maurice","Mauritanie","Mexique","Micronésie","Moldavie","Monaco","Mongolie","Monténégro","Mozambique",
  "Namibie","Nauru","Népal","Nicaragua","Niger","Nigeria","Norvège","Nouvelle-Zélande","Oman","Ouganda",
  "Ouzbékistan","Pakistan","Palaos","Palestine","Panama","Papouasie-Nouvelle-Guinée","Paraguay","Pays-Bas","Pérou","Philippines",
  "Pologne","Portugal","Qatar","République centrafricaine","République dominicaine","République tchèque","Roumanie","Royaume-Uni","Russie","Rwanda",
  "Saint-Kitts-et-Nevis","Saint-Marin","Saint-Vincent-et-les-Grenadines","Sainte-Lucie","Salomon","Salvador","Samoa","São Tomé-et-Principe","Sénégal","Serbie",
  "Seychelles","Sierra Leone","Singapour","Slovaquie","Slovénie","Somalie","Soudan","Soudan du Sud","Sri Lanka","Suède",
  "Suisse","Suriname","Syrie","Tadjikistan","Tanzanie","Tchad","Thaïlande","Timor oriental","Togo","Tonga",
  "Trinité-et-Tobago","Tunisie","Turkménistan","Turquie","Tuvalu","Ukraine","Uruguay","Vanuatu","Vatican","Venezuela",
  "Vietnam","Yémen","Zambie","Zimbabwe",
];

const CLIENT_TABS = [
  { id: "marche", label: "Marché", icon: ShoppingBag },
  { id: "artisans", label: "Artisans", icon: Wrench },
  { id: "travail", label: "Travail", icon: Briefcase },
  { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { id: "sante", label: "Santé", icon: HeartPulse },
  { id: "transport", label: "Transport", icon: Car },
  { id: "actu", label: "Fil d'actu", icon: Newspaper },
];

const MARKET_FILTERS = [
  { id: "local", label: "Local", icon: Wheat, sample: "Soumbala, Mil, Daba" },
  { id: "tech", label: "Tech", icon: Smartphone, sample: "Téléphones, réparation" },
  { id: "habit", label: "Habit", icon: Shirt, sample: "Boubous, sandales, tissus" },
];

const PRODUCTS = [
  { id: 1, title: "Boubou brodé homme - style Tchad", price: 15000, category: "habit", isLocal: false,
    market: "Grand Marché Kousseri", stall: "R12B", pro: "Boutique Al-Amin", urgent: true, tag: "Habit Musulman" },
  { id: 2, title: "Sandales cuir fait main", price: 4000, category: "habit", isLocal: true,
    market: "Grand Marché Kousseri", stall: "R08", pro: "Cordonnerie Haoua", urgent: false, tag: "Chaussures" },
  { id: 3, title: "Soumbala frais 1kg", price: 1000, category: "local", isLocal: true,
    market: "Marché N'Djamena Centre", stall: "C22", pro: "Mama Fatouma", urgent: true, tag: "Produit local" },
  { id: 4, title: "Sac de mil 25kg", price: 12500, category: "local", isLocal: true,
    market: "Grand Marché Kousseri", stall: "M03", pro: "Coopérative Daba", urgent: false, tag: "Produit local" },
  { id: 5, title: "Téléphone Tecno reconditionné", price: 45000, category: "tech", isLocal: false,
    market: "Marché N'Djamena Centre", stall: "T14", pro: "GSM Doumbe", urgent: true, tag: "Tech" },
  { id: 6, title: "Réparation écran smartphone", price: 5000, category: "tech", isLocal: false,
    market: "Bureau MAMAT - Kousseri", stall: "Box 1", pro: "Bureau MAMAT", urgent: true, tag: "Service pro" },
  { id: 7, title: "Boubou femme wax - style Bénin", price: 18000, category: "habit", isLocal: false,
    market: "Marché N'Djamena Centre", stall: "H09", pro: "Chez Sista Abiodun", urgent: false, tag: "Habit" },
  { id: 8, title: "Crème visage locale karité", price: 2500, category: "local", isLocal: true,
    market: "Grand Marché Kousseri", stall: "R21", pro: "Beauté Sahel", urgent: false, tag: "Produit local" },
  { id: 9, title: "Réparation téléphone express", price: 15, category: "tech", isLocal: false,
    market: "Marché Barbès, Paris", stall: "B2", pro: "GSM Barbès", urgent: true, tag: "Tech", country: "France" },
  { id: 10, title: "Tissus imprimés faits main", price: 25, category: "habit", isLocal: true,
    market: "Feira da Madrugada, São Paulo", stall: "F19", pro: "Ateliê Bahia", urgent: false, tag: "Habit", country: "Brésil" },
  { id: 11, title: "Épices fraîches du marché", price: 200, category: "local", isLocal: true,
    market: "Chandni Chowk, Delhi", stall: "C7", pro: "Spice House Verma", urgent: true, tag: "Produit local", country: "Inde" },
  { id: 12, title: "Chaussures cuir sur mesure", price: 30, category: "habit", isLocal: false,
    market: "Grand Bazaar, Istanbul", stall: "GB44", pro: "Cordonnerie Yilmaz", urgent: false, tag: "Chaussures", country: "Turquie" },
];

const ARTISANS = [
  { id: 1, metier: "Menuisier", pro: "Atelier Boukar", market: "Kousseri Zone Artisanale", stall: "A5", verified: true },
  { id: 2, metier: "Tailleur", pro: "Couture Zenaba", market: "Grand Marché Kousseri", stall: "R15", verified: true },
  { id: 3, metier: "Électricien", pro: "Élec Service Adam", market: "N'Djamena Centre", stall: "-", verified: false },
];

const RESTOS = [
  { id: 1, name: "Restaurant Le Sahel", type: "Restaurant pro", market: "Kousseri Centre", stall: "-", note: "Cuisine tchadienne", cuisine: "Tchadienne", menu: [{ name: "Poulet DG", price: 3500 }, { name: "Capitaine braisé", price: 4000 }] },
  { id: 2, name: "Chez Maman Aïcha", type: "Restaurant local", market: "Grand Marché Kousseri", stall: "R30", note: "Plats du jour, cash", cuisine: "Locale", menu: [{ name: "Riz sauce gombo", price: 800 }, { name: "Boule + soupe", price: 500 }] },
  { id: 3, name: "Toilettes publiques R12", type: "Toilette", market: "Grand Marché Kousseri", stall: "R12", note: "200F, la plus proche" },
];

const JOBS = [
  { id: 1, title: "Vendeur boutique textile", pro: "Boutique Al-Amin", market: "Grand Marché Kousseri", contract: "Journalier", salary: "3 000 F / jour" },
  { id: 2, title: "Livreur moto (interne boutique)", pro: "GSM Doumbe", market: "N'Djamena Centre", contract: "CDD", salary: "60 000 F / mois" },
  { id: 3, title: "Couturière expérimentée", pro: "Couture Zenaba", market: "Grand Marché Kousseri", contract: "CDI", salary: "À négocier" },
];

const POSTS = [
  { id: 1, pro: "Bureau MAMAT", type: "publication", caption: "Nouveaux services d'impression et clés USB personnalisées disponibles cette semaine !", likes: 42, comments: 6 },
  { id: 2, pro: "Chez Maman Aïcha", type: "video", caption: "Plat du jour : riz sauce gombo, prêt dès 12h. Venez chaud chaud !", likes: 118, comments: 14 },
  { id: 3, pro: "Boutique Al-Amin", type: "defi", caption: "Défi look de la semaine : montre-nous ton boubou porté avec notre tissu !", likes: 76, comments: 21 },
];

function formatFCFA(n) {
  return n.toLocaleString("fr-FR") + " F";
}

// ============ ECRANS ============

function OfflineBar({ online }) {
  return (
    <div
      className="flex items-center justify-center gap-2 text-xs py-1.5 font-medium tracking-wide"
      style={{ background: online ? "#123322" : "#3a1414", color: online ? "#8fd6ab" : "#ff9b9b" }}
    >
      {online ? <Wifi size={13} /> : <WifiOff size={13} />}
      {online ? "En ligne — synchronisation active" : "Hors ligne — 500 produits + 200 pros en cache (10km)"}
    </div>
  );
}

function Onboarding({ onChoose, lang, setLang, showLangPicker, setShowLangPicker, country, setShowCountryPicker }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-between px-6 py-10" style={{ background: BLACK }}>
      <div className="self-end flex items-center gap-2">
        <button
          onClick={() => setShowCountryPicker(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border"
          style={{ borderColor: "#3a3a30", color: "#c9c9be" }}
        >
          <MapPin size={13} /> {country}
        </button>
        <button
          onClick={() => setShowLangPicker(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border"
          style={{ borderColor: "#3a3a30", color: GOLD }}
        >
          <Globe2 size={13} /> {LANGS.find((l) => l.code === lang)?.label}
        </button>
      </div>

      <div className="flex flex-col items-center text-center mt-4">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border-2"
          style={{ borderColor: GOLD, background: "linear-gradient(135deg,#151512,#0A0A0A)" }}
        >
          <span className="text-3xl font-black" style={{ color: GOLD }}>KP</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">KP AFRIQUE</h1>
        <p className="mt-2 text-sm italic" style={{ color: "#9c9c8f" }}>
          "Le Marché de Mama. Pas l'app de Paris."
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <div
          className="rounded-xl px-4 py-3 text-center text-xs font-semibold border"
          style={{ borderColor: "#3a3a30", color: "#c9c9be" }}
        >
          0 Wallet · 0 Livraison · Cash sur place
        </div>
        <p className="text-center text-[11px]" style={{ color: "#6b6b62" }}>
          Tous services, tous pays — {COUNTRIES.length} pays disponibles
        </p>

        <button
          onClick={() => onChoose("client")}
          className="w-full rounded-2xl py-4 flex items-center justify-center gap-3 font-bold text-base active:scale-[0.98] transition"
          style={{ background: GOLD, color: BLACK }}
        >
          <ShoppingBag size={20} /> JE SUIS CLIENT
        </button>
        <button
          onClick={() => onChoose("pro")}
          className="w-full rounded-2xl py-4 flex items-center justify-center gap-3 font-bold text-base border-2 active:scale-[0.98] transition"
          style={{ borderColor: GREEN, color: "#8fd6ab" }}
        >
          <Store size={20} /> JE SUIS UN PRO
        </button>
      </div>

      {showLangPicker && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="w-full rounded-t-3xl p-5 max-h-[70vh] overflow-y-auto" style={{ background: CARD }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Choisir la langue</h3>
              <button onClick={() => setShowLangPicker(false)}><X size={20} color="#9c9c8f" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setShowLangPicker(false); }}
                  className="rounded-xl py-3 text-sm font-medium border"
                  style={{
                    borderColor: lang === l.code ? GOLD : "#2a2a24",
                    color: lang === l.code ? GOLD : "#c9c9be",
                    background: lang === l.code ? "rgba(212,175,55,0.08)" : "transparent",
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-center mt-4" style={{ color: "#6b6b62" }}>
              STT/TTS hors ligne disponible pour chaque langue.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CountryPickerModal({ open, onClose, country, setCountry }) {
  const [q, setQ] = useState("");
  if (!open) return null;
  const filtered = COUNTRIES.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full rounded-t-3xl p-5 max-h-[75vh] flex flex-col" style={{ background: CARD }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">Choisir le pays</h3>
          <button onClick={onClose}><X size={20} color="#9c9c8f" /></button>
        </div>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3" style={{ background: BLACK }}>
          <Search size={15} color="#6b6b62" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Chercher un pays..."
            className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-[#6b6b62]"
          />
        </div>
        <div className="overflow-y-auto space-y-1">
          {filtered.map((c) => (
            <button
              key={c}
              onClick={() => { setCountry(c); onClose(); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm"
              style={{
                color: country === c ? GOLD : "#c9c9be",
                background: country === c ? "rgba(212,175,55,0.08)" : "transparent",
              }}
            >
              {c}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-xs py-6" style={{ color: "#6b6b62" }}>Aucun pays trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#1f1f1a", background: BLACK }}>
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="p-1 -ml-1">
            <ChevronLeft size={22} color={GOLD} />
          </button>
        )}
        <h2 className="text-white font-bold text-lg">{title}</h2>
      </div>
      {right}
    </div>
  );
}

function ClientTabs({ active, setActive }) {
  return (
    <div className="flex overflow-x-auto border-t" style={{ borderColor: "#1f1f1a", background: "#0d0d0a" }}>
      {CLIENT_TABS.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className="shrink-0 flex flex-col items-center gap-1 py-2.5 px-4"
            style={{ color: isActive ? GOLD : "#6b6b62" }}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium whitespace-nowrap">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ProductCard({ item, onOpen }) {
  return (
    <button
      onClick={() => onOpen(item)}
      className="w-full text-left rounded-2xl p-3.5 mb-3 border active:scale-[0.99] transition"
      style={{ background: CARD, borderColor: "#241f13" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            {item.isLocal && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(27,94,60,0.25)", color: "#8fd6ab" }}>
                <Wheat size={10} /> PRODUIT LOCAL
              </span>
            )}
            {item.urgent && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.15)", color: GOLD }}>
                🚨 IL VIENT dispo
              </span>
            )}
          </div>
          <p className="text-white font-semibold text-sm leading-snug truncate">{item.title}</p>
          <p className="text-xs mt-0.5" style={{ color: "#8f8f83" }}>{item.pro}</p>
          <div className="flex items-center gap-1 mt-1.5 text-[11px]" style={{ color: "#6b6b62" }}>
            <MapPin size={11} /> {item.market} · Stand {item.stall}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-black text-base" style={{ color: GOLD }}>{formatFCFA(item.price)}</p>
        </div>
      </div>
    </button>
  );
}

function MarketScreen({ onOpenProduct }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => (filter === "all" || p.category === filter))
      .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.pro.toLowerCase().includes(query.toLowerCase()));
  }, [filter, query]);

  return (
    <div className="px-4 pt-3 pb-2">
      <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3" style={{ background: CARD }}>
        <Search size={16} color="#6b6b62" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chercher un produit, un vendeur..."
          className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-[#6b6b62]"
        />
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter("all")}
          className="shrink-0 px-3.5 py-2 rounded-full text-xs font-bold border"
          style={{ borderColor: filter === "all" ? GOLD : "#2a2a24", color: filter === "all" ? GOLD : "#9c9c8f" }}
        >
          Tout
        </button>
        {MARKET_FILTERS.map((f) => {
          const Icon = f.icon;
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border"
              style={{ borderColor: isActive ? GOLD : "#2a2a24", color: isActive ? GOLD : "#9c9c8f" }}
            >
              <Icon size={13} /> {f.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm py-10" style={{ color: "#6b6b62" }}>Aucun résultat. Essaie un autre mot.</p>
      )}
      {filtered.map((p) => (
        <ProductCard key={p.id} item={p} onOpen={onOpenProduct} />
      ))}
    </div>
  );
}

function ListScreen({ data, onOpenProduct, kind }) {
  return (
    <div className="px-4 pt-3 pb-2">
      {data.map((item) => (
        <button
          key={item.id}
          onClick={() => onOpenProduct({ ...item, title: item.pro || item.name, price: null, tag: item.metier || item.type })}
          className="w-full text-left rounded-2xl p-3.5 mb-3 border active:scale-[0.99] transition flex items-center justify-between"
          style={{ background: CARD, borderColor: "#241f13" }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              {item.verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(27,94,60,0.25)", color: "#8fd6ab" }}>
                  <ShieldCheck size={10} /> VÉRIFIÉ
                </span>
              )}
            </div>
            <p className="text-white font-semibold text-sm truncate">{item.pro || item.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "#8f8f83" }}>{item.metier || item.type || item.note}</p>
            <div className="flex items-center gap-1 mt-1.5 text-[11px]" style={{ color: "#6b6b62" }}>
              <MapPin size={11} /> {item.market} {item.stall && item.stall !== "-" ? `· Stand ${item.stall}` : ""}
            </div>
          </div>
          <ChevronLeft size={18} className="rotate-180 shrink-0" color="#6b6b62" />
        </button>
      ))}
    </div>
  );
}

function TransportScreen() {
  return (
    <div className="px-4 pt-6 text-center">
      <Car size={40} color={GOLD} className="mx-auto mb-3" />
      <p className="text-white font-bold">Transport local</p>
      <p className="text-sm mt-1" style={{ color: "#8f8f83" }}>
        Moto-taxis et taxis de ton quartier, bientôt listés ici avec contact direct — sans réservation, sans commission.
      </p>
    </div>
  );
}

function JobsScreen({ onOpenProfile }) {
  return (
    <div className="px-4 pt-3 pb-2">
      {JOBS.map((j) => (
        <button
          key={j.id}
          onClick={() => onOpenProfile({ name: j.pro, niche: j.title, market: j.market })}
          className="w-full text-left rounded-2xl p-3.5 mb-3 border active:scale-[0.99] transition"
          style={{ background: CARD, borderColor: "#241f13" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.12)", color: GOLD }}>
              {j.contract}
            </span>
            <span className="text-xs font-black" style={{ color: GOLD }}>{j.salary}</span>
          </div>
          <p className="text-white font-semibold text-sm mt-1">{j.title}</p>
          <p className="text-xs mt-0.5" style={{ color: "#8f8f83" }}>{j.pro}</p>
          <div className="flex items-center gap-1 mt-1.5 text-[11px]" style={{ color: "#6b6b62" }}>
            <MapPin size={11} /> {j.market}
          </div>
        </button>
      ))}
    </div>
  );
}

function RestaurantScreen({ onOpenProfile }) {
  const restos = RESTOS.filter((r) => r.type !== "Toilette");
  return (
    <div className="px-4 pt-3 pb-2">
      {restos.map((r) => (
        <button
          key={r.id}
          onClick={() => onOpenProfile({ name: r.name, niche: r.type, market: r.market, stall: r.stall, menu: r.menu })}
          className="w-full text-left rounded-2xl p-3.5 mb-3 border active:scale-[0.99] transition"
          style={{ background: CARD, borderColor: "#241f13" }}
        >
          <p className="text-white font-semibold text-sm">{r.name}</p>
          <p className="text-xs mt-0.5" style={{ color: "#8f8f83" }}>{r.type} · {r.note}</p>
          {r.menu && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {r.menu.map((m) => (
                <span key={m.name} className="text-[10px] px-2 py-1 rounded-full" style={{ background: "rgba(27,94,60,0.2)", color: "#8fd6ab" }}>
                  {m.name} · {formatFCFA(m.price)}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 mt-1.5 text-[11px]" style={{ color: "#6b6b62" }}>
            <MapPin size={11} /> {r.market} {r.stall !== "-" ? `· Stand ${r.stall}` : ""}
          </div>
        </button>
      ))}
    </div>
  );
}

function FeedScreen() {
  return (
    <div className="px-4 pt-3 pb-2">
      {POSTS.map((p) => (
        <div key={p.id} className="rounded-2xl p-3.5 mb-3 border" style={{ background: CARD, borderColor: "#241f13" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold text-sm">{p.pro}</p>
            {p.type === "video" && <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: GOLD }}><Video size={11} /> Vidéo</span>}
            {p.type === "defi" && <span className="text-[10px] font-bold" style={{ color: GOLD }}>🔥 Défi</span>}
          </div>
          <div className="w-full h-32 rounded-xl mb-2 flex items-center justify-center" style={{ background: "#1c1c16" }}>
            {p.type === "video" ? <Video size={28} color="#4a4a3f" /> : <Store size={28} color="#4a4a3f" />}
          </div>
          <p className="text-sm" style={{ color: "#c9c9be" }}>{p.caption}</p>
          <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: "#8f8f83" }}>
            <span className="flex items-center gap-1"><Heart size={13} /> {p.likes}</span>
            <span className="flex items-center gap-1"><MessageSquare size={13} /> {p.comments}</span>
            <span className="flex items-center gap-1 ml-auto"><Share2 size={13} /> Partager</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProProfileDetail({ pro, onBack }) {
  const rating = 4.6;
  const reviewsCount = 38;
  return (
    <div className="pb-6">
      <TopBar title="Profil professionnel" onBack={onBack} />
      <div className="w-full h-36" style={{ background: "linear-gradient(135deg,#1c1c16,#0A0A0A)" }} />
      <div className="px-4 -mt-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 mb-3"
          style={{ borderColor: GOLD, background: BLACK }}
        >
          <Store size={26} color={GOLD} />
        </div>
        <h1 className="text-lg font-black text-white">{pro.name}</h1>
        <p className="text-sm" style={{ color: GOLD }}>{pro.niche}</p>

        <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "#9c9c8f" }}>
          <span className="flex items-center gap-1"><Star size={13} color={GOLD} fill={GOLD} /> {rating} ({reviewsCount} avis)</span>
          <span className="flex items-center gap-1"><Users size={13} /> 214 abonnés</span>
        </div>

        <div className="mt-3 rounded-2xl p-3.5 border flex items-start gap-2.5" style={{ background: CARD, borderColor: "#241f13" }}>
          <MapPin size={18} color={GOLD} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-white text-sm font-semibold">{pro.market}</p>
            {pro.stall && pro.stall !== "-" && <p className="text-xs" style={{ color: "#8f8f83" }}>Stand / Box {pro.stall}</p>}
            <p className="text-xs mt-1" style={{ color: "#6b6b62" }}>Ouvert 08:00 – 19:00 · Lun–Sam</p>
          </div>
        </div>

        {pro.menu && (
          <div className="mt-3 rounded-2xl p-3.5 border" style={{ background: CARD, borderColor: "#241f13" }}>
            <p className="text-white font-semibold text-sm mb-2">Menu</p>
            {pro.menu.map((m) => (
              <div key={m.name} className="flex items-center justify-between text-sm py-1.5 border-b" style={{ borderColor: "#1f1f1a" }}>
                <span style={{ color: "#c9c9be" }}>{m.name}</span>
                <span className="font-bold" style={{ color: GOLD }}>{formatFCFA(m.price)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2.5 mt-4">
          <button className="rounded-xl py-3 flex flex-col items-center gap-1 border" style={{ borderColor: "#2a2a24" }}>
            <MessageCircle size={17} color={GOLD} />
            <span className="text-[11px] font-bold" style={{ color: "#c9c9be" }}>Chat</span>
          </button>
          <button className="rounded-xl py-3 flex flex-col items-center gap-1 border" style={{ borderColor: "#2a2a24" }}>
            <Phone size={17} color={GOLD} />
            <span className="text-[11px] font-bold" style={{ color: "#c9c9be" }}>Appeler</span>
          </button>
          <button className="rounded-xl py-3 flex flex-col items-center gap-1" style={{ background: GOLD }}>
            <MapPin size={17} color={BLACK} />
            <span className="text-[11px] font-bold" style={{ color: BLACK }}>Y aller</span>
          </button>
        </div>

        <p className="text-[11px] text-center mt-3" style={{ color: "#6b6b62" }}>
          "Appeler" nécessite un abonnement Client Premium.
        </p>
      </div>
    </div>
  );
}

function ProductDetail({ item, onBack }) {
  const [mode, setMode] = useState(null); // 'urgent' | 'boutique'
  const [reserved, setReserved] = useState(false);

  const waMessage = encodeURIComponent(
    `Bonjour, je suis intéressé par "${item.title}" chez ${item.pro} — ${item.market}${item.stall && item.stall !== "-" ? ", Stand " + item.stall : ""}. Vu sur KP AFRIQUE.`
  );

  return (
    <div className="pb-6">
      <TopBar title="Fiche" onBack={onBack} />
      <div className="px-4 pt-4">
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          {item.isLocal && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(27,94,60,0.25)", color: "#8fd6ab" }}>
              <Wheat size={10} /> PRODUIT LOCAL
            </span>
          )}
          {item.tag && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.12)", color: GOLD }}>
              {item.tag}
            </span>
          )}
        </div>

        <h1 className="text-xl font-black text-white leading-snug">{item.title}</h1>
        <p className="text-sm mt-1" style={{ color: "#9c9c8f" }}>Vendu par <span style={{ color: GOLD }}>{item.pro}</span></p>

        {item.price != null && (
          <p className="text-2xl font-black mt-3" style={{ color: GOLD }}>{formatFCFA(item.price)}</p>
        )}

        <div className="mt-2 text-xs font-bold" style={{ color: "#ff6b6b" }}>
          ⚠ Paiement cash sur place.
        </div>

        <div className="mt-4 rounded-2xl p-3.5 border flex items-start gap-2.5" style={{ background: CARD, borderColor: "#241f13" }}>
          <MapPin size={18} color={GOLD} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-white text-sm font-semibold">{item.market}</p>
            {item.stall && item.stall !== "-" && <p className="text-xs" style={{ color: "#8f8f83" }}>Stand / Box {item.stall}</p>}
          </div>
        </div>

        {!mode && (
          <div className="mt-5 space-y-2.5">
            {item.urgent && (
              <button
                onClick={() => setMode("urgent")}
                className="w-full rounded-2xl py-3.5 font-bold text-sm flex items-center justify-center gap-2"
                style={{ background: GOLD, color: BLACK }}
              >
                🚨 IL VIENT — GPS live + appel
              </button>
            )}
            <button
              onClick={() => setMode("boutique")}
              className="w-full rounded-2xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 border-2"
              style={{ borderColor: GREEN, color: "#8fd6ab" }}
            >
              🛍️ VA À {item.stall && item.stall !== "-" ? item.stall : "LA BOUTIQUE"} — Itinéraire
            </button>
          </div>
        )}

        {mode === "urgent" && (
          <div className="mt-5 rounded-2xl p-4 border" style={{ background: CARD, borderColor: GOLD }}>
            <p className="text-sm text-white font-semibold mb-2">Le vendeur est notifié en GPS live.</p>
            <p className="text-xs mb-3" style={{ color: "#9c9c8f" }}>
              Fonction "Appel Premium" — réservée aux abonnés Client Premium (500F/mois).
            </p>
            <button className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 font-bold text-sm" style={{ background: GOLD, color: BLACK }}>
              <Phone size={16} /> Appeler le vendeur
            </button>
          </div>
        )}

        {mode === "boutique" && (
          <div className="mt-5 rounded-2xl p-4 border" style={{ background: CARD, borderColor: "#241f13" }}>
            <p className="text-sm text-white font-semibold mb-1">Itinéraire vers {item.market}</p>
            <p className="text-xs mb-3" style={{ color: "#9c9c8f" }}>Ouvre la carte pour te guider jusqu'au stand.</p>
            <button className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 font-bold text-sm mb-2" style={{ background: GREEN, color: "#eafff2" }}>
              <MapPin size={16} /> Voir l'itinéraire
            </button>
            <button className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 font-bold text-sm border" style={{ borderColor: "#3a3a30", color: "#c9c9be" }}>
              <MessageCircle size={16} /> Chat avec le vendeur (0F)
            </button>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <a
            href={`https://wa.me/?text=${waMessage}`}
            target="_blank" rel="noreferrer"
            className="rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-bold border"
            style={{ borderColor: "#2a2a24", color: "#c9c9be" }}
          >
            <Share2 size={14} /> Partager WhatsApp
          </a>
          <button
            onClick={() => setReserved(true)}
            className="rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-bold border"
            style={{ borderColor: reserved ? GOLD : "#2a2a24", color: reserved ? GOLD : "#c9c9be" }}
          >
            <PiggyBank size={14} /> {reserved ? "Réservé 365j ✓" : "Réserver (épargne)"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProDashboard({ onBack }) {
  const [plan, setPlan] = useState("essai");

  const PLANS = [
    {
      id: "essai", label: "Essai gratuit", price: "0 F", sub: "30 jours pour les nouveaux vendeurs", color: "#8fd6ab", border: GREEN,
      features: [
        "1 fiche boutique (produits illimités)",
        "Visibilité GPS 5 km",
        "Chat client 0F",
        "Partage WhatsApp",
      ],
    },
    {
      id: "6mois", label: "6 mois", price: "5 000 F", sub: "≈ 833 F / mois", color: GOLD, border: GOLD,
      features: [
        "Tout l'essai gratuit, plus :",
        "Visibilité GPS 10 km",
        "Badge ✓ Vérifié",
        "Position prioritaire dans les résultats",
      ],
    },
    {
      id: "1an", label: "1 an", price: "25 000 F", sub: "≈ 2 083 F / mois — formule max", color: GOLD, border: GOLD,
      features: [
        "Tout le 6 mois, plus :",
        "Visibilité GPS illimitée (tout le pays)",
        "Badge 🏆 Pro Gold",
        "Statistiques de boutique (vues, contacts)",
        "Jusqu'à 3 stands / marchés liés",
        "Support prioritaire",
      ],
    },
  ];
  const current = PLANS.find((p) => p.id === plan);

  return (
    <div className="pb-6">
      <TopBar title="Espace Pro" onBack={onBack} />
      <div className="px-4 pt-4 space-y-3">
        <div className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: GOLD }}>
          <p className="text-white font-bold text-sm mb-3">Abonnement Pro — visibilité sur le marché GPS</p>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {PLANS.map((p) => {
              const isActive = plan === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className="rounded-xl px-2 py-3 text-center border"
                  style={{
                    borderColor: isActive ? p.border : "#2a2a24",
                    background: isActive ? "rgba(212,175,55,0.08)" : "transparent",
                  }}
                >
                  <p className="text-[10px] font-bold" style={{ color: isActive ? p.color : "#9c9c8f" }}>{p.label}</p>
                  <p className="text-sm font-black mt-1" style={{ color: isActive ? "white" : "#c9c9be" }}>{p.price}</p>
                </button>
              );
            })}
          </div>

          <p className="text-xs" style={{ color: "#9c9c8f" }}>{current.sub}</p>
          {plan === "essai" && (
            <p className="text-[11px] mt-1" style={{ color: "#8fd6ab" }}>
              Réservé aux nouveaux vendeurs — un seul essai par boutique, ensuite passage automatique en formule payante.
            </p>
          )}

          <div className="mt-3 rounded-xl p-3 space-y-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: current.color }}>Outils inclus</p>
            {current.features.map((f, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs" style={{ color: f.startsWith("Tout") ? "#6b6b62" : "#c9c9be" }}>
                {!f.startsWith("Tout") && <ShieldCheck size={12} className="mt-0.5 shrink-0" color={current.color} />}
                <span className={f.startsWith("Tout") ? "italic" : ""}>{f}</span>
              </div>
            ))}
          </div>

          <p className="text-xs mt-3" style={{ color: "#ff6b6b" }}>Paiement CinetPay uniquement</p>

          <button
            className="mt-3 w-full rounded-xl py-2.5 font-bold text-sm"
            style={{ background: plan === "essai" ? GREEN : GOLD, color: plan === "essai" ? "#eafff2" : BLACK }}
          >
            {plan === "essai" ? "Activer mon essai gratuit" : `Payer ${current.price} avec CinetPay`}
          </button>
        </div>

        <div className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: "#241f13" }}>
          <p className="text-white font-bold text-sm mb-2">Ma fiche boutique</p>
          <div className="space-y-2 text-xs">
            <input placeholder="Nom du métier / boutique" className="w-full rounded-lg px-3 py-2 bg-transparent border text-white placeholder:text-[#6b6b62]" style={{ borderColor: "#2a2a24" }} />
            <input placeholder="Nom du marché (obligatoire)" className="w-full rounded-lg px-3 py-2 bg-transparent border text-white placeholder:text-[#6b6b62]" style={{ borderColor: "#2a2a24" }} />
            <input placeholder="Numéro de stand — ex. R12B" className="w-full rounded-lg px-3 py-2 bg-transparent border text-white placeholder:text-[#6b6b62]" style={{ borderColor: "#2a2a24" }} />
            <button className="w-full rounded-lg py-2.5 font-bold" style={{ background: GREEN, color: "#eafff2" }}>
              Ajouter un produit
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: "#241f13" }}>
          <p className="text-white font-bold text-sm mb-1">Booster ma visibilité</p>
          <p className="text-xs mb-3" style={{ color: "#9c9c8f" }}>
            Achète des vues supplémentaires pour ta fiche boutique, en plus de ton abonnement.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { views: "100k vues", price: "100 F" },
              { views: "500k vues", price: "500 F" },
              { views: "1M vues", price: "1 000 F" },
            ].map((b) => (
              <button
                key={b.views}
                className="rounded-xl px-2 py-3 text-center border active:scale-[0.97] transition"
                style={{ borderColor: "#2a2a24" }}
              >
                <p className="text-sm font-black" style={{ color: GOLD }}>{b.price}</p>
                <p className="text-[10px] mt-1" style={{ color: "#9c9c8f" }}>{b.views}</p>
              </button>
            ))}
          </div>
          <p className="text-[11px] mt-3" style={{ color: "#ff6b6b" }}>Paiement CinetPay uniquement</p>
        </div>

        <div className="rounded-2xl p-4 border flex items-center gap-2" style={{ background: CARD, borderColor: "#241f13" }}>
          <Clock size={16} color={GOLD} />
          <p className="text-xs" style={{ color: "#9c9c8f" }}>Cache hors ligne : 500 produits + 200 pros dans 10km, synchronisés dès que le réseau revient.</p>
        </div>
      </div>
    </div>
  );
}

// ============ APP ============
export default function KPAfrique() {
  const [door, setDoor] = useState(null); // null | 'client' | 'pro'
  const [tab, setTab] = useState("marche");
  const [openItem, setOpenItem] = useState(null);
  const [openProfile, setOpenProfile] = useState(null);
  const [online] = useState(true);
  const [lang, setLang] = useState("fr");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [country, setCountry] = useState("Cameroun");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: BLACK, fontFamily: "system-ui, sans-serif", minHeight: 640 }}>
      <OfflineBar online={online} />

      {!door && (
        <div className="flex-1">
          <Onboarding
            onChoose={setDoor}
            lang={lang}
            setLang={setLang}
            showLangPicker={showLangPicker}
            setShowLangPicker={setShowLangPicker}
            country={country}
            setShowCountryPicker={setShowCountryPicker}
          />
          <CountryPickerModal open={showCountryPicker} onClose={() => setShowCountryPicker(false)} country={country} setCountry={setCountry} />
        </div>
      )}

      {door === "pro" && !openItem && (
        <div className="flex-1 overflow-y-auto">
          <ProDashboard onBack={() => setDoor(null)} />
        </div>
      )}

      {door === "client" && !openItem && !openProfile && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar
            title={CLIENT_TABS.find((t) => t.id === tab)?.label}
            onBack={() => setDoor(null)}
            right={
              <button onClick={() => setShowCountryPicker(true)} className="flex items-center gap-1 text-[10px] font-bold" style={{ color: GOLD }}>
                <MapPin size={11} /> {country} · 10km
              </button>
            }
          />
          <div className="flex-1 overflow-y-auto">
            {tab === "marche" && <MarketScreen onOpenProduct={setOpenItem} />}
            {tab === "artisans" && <ListScreen data={ARTISANS} onOpenProduct={setOpenItem} kind="artisan" />}
            {tab === "travail" && <JobsScreen onOpenProfile={setOpenProfile} />}
            {tab === "restaurant" && <RestaurantScreen onOpenProfile={setOpenProfile} />}
            {tab === "sante" && (
              <div className="px-4 pt-6 text-center">
                <HeartPulse size={40} color={GOLD} className="mx-auto mb-3" />
                <p className="text-white font-bold">Santé de proximité</p>
                <p className="text-sm mt-1" style={{ color: "#8f8f83" }}>Pharmacies et toilettes les plus proches, cash sur place.</p>
                <div className="mt-4"><ListScreen data={RESTOS.filter(r => r.type === "Toilette")} onOpenProduct={setOpenItem} /></div>
              </div>
            )}
            {tab === "transport" && <TransportScreen />}
            {tab === "actu" && <FeedScreen />}
          </div>
          <ClientTabs active={tab} setActive={setTab} />
        </div>
      )}

      {openItem && (
        <div className="flex-1 overflow-y-auto">
          <ProductDetail item={openItem} onBack={() => setOpenItem(null)} />
        </div>
      )}

      {openProfile && (
        <div className="flex-1 overflow-y-auto">
          <ProProfileDetail pro={openProfile} onBack={() => setOpenProfile(null)} />
        </div>
      )}

      {door && (
        <CountryPickerModal open={showCountryPicker} onClose={() => setShowCountryPicker(false)} country={country} setCountry={setCountry} />
      )}
    </div>
  );
}
