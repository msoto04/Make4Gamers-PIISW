import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Star, Crown, X, Sparkles } from "lucide-react";
import GameCard from "../features/games/components/GameCard";
import { getGames, type Game } from "../features/games/services/getGames";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { AnimatePresence, motion } from "framer-motion";

function safeLower(value: unknown): string {
  return typeof value === "string" ? value.toLowerCase() : "";
}

type ExtendedGame = Game & { isPremium?: boolean };

export default function Juegos() {
  const [games, setGames] = useState<ExtendedGame[]>([]);
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const navigate = useNavigate();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const categoryOptions = [
    { value: "all", label: t("game.filters.all") },
    { value: "action", label: t("game.filters.action") },
    { value: "arcade", label: t("game.filters.arcade") },
    { value: "rpg", label: t("game.filters.rpg") },
    { value: "puzzle", label: t("game.filters.puzzle") },
  ];

  useEffect(() => {
    const checkUserTier = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', session.user.id)
          .single();
          
        if (profile?.subscription_tier === 'premium') {
          setIsPremiumUser(true);
        }
      }
    };
    checkUserTier();

    const loadGames = async () => {
      try {
        const gamesData = await getGames();
        setGames([...gamesData, ...DUMMY_GAMES]);
      } catch (error) {
        console.error("Error loading games:", error);
        setGames(DUMMY_GAMES);
      }
    };

    loadGames();
  }, []);

  const filteredGames = games.filter((game) => {
    const matchesSearch = safeLower(game.title).includes(safeLower(searchTerm));
    const matchesCategory =
      categoryFilter === "all" ||
      safeLower(game.genre) === safeLower(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const handleGameClick = (game: ExtendedGame) => {
    if (game.isPremium && !isPremiumUser) {
      setShowPremiumModal(true);
      return;
    }
    navigate(`/game/${game.id}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-950/20 to-slate-950">
      <section className="container mx-auto pt-12 px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{t("game.allGames")}</h2>
          <span className="text-slate-400">{filteredGames.length} {t("game.gamesCount")}</span>
        </div>

        <div className="mb-6 border-b border-slate-800/80 pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder={t("game.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-slate-600"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCategoryFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === option.value
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <div 
                key={game.id} 
                onClick={() => handleGameClick(game)}
                className="block"
              >
                <GameCard
                  title={game.title ?? "Unknown game"}
                  image={game.thumbnail_url ?? "https://via.placeholder.com/400x300?text=No+Image"}
                  genre={game.genre ?? t("gameplay.noGenre")}
                  rating={typeof game.rating === "number" ? game.rating : 0}
                  players={game.players ?? 0}
                  isPremium={game.isPremium}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">{t("game.noResults")}</p>
          </div>
        )}
      </section>

      {/* MODAL PREMIUM */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPremiumModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Tarjeta del Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-900 shadow-2xl shadow-indigo-500/20">
              <div className="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-transparent via-yellow-500 to-transparent opacity-70" />

              <div className="p-6">
                {/* Cerrar */}
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Contenido */}
                <div className="flex flex-col items-center text-center mt-4">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 ring-1 ring-yellow-500/30">
                    <Crown className="text-yellow-500" size={32} />
                  </div>
                  
                  <h3 className="mb-2 text-2xl font-bold text-white flex items-center gap-2">
                    Acceso Exclusivo <Sparkles className="text-yellow-500" size={20} />
                  </h3>
                  
                  <p className="mb-8 text-slate-400 leading-relaxed">
                    Este juego es contenido exclusivo. Sube de nivel tu cuenta a <span className="font-semibold text-indigo-400">Next Gen</span> para desbloquear este y muchos otros juegos premium.
                  </p>

                  {/* Botones */}
                  <div className="flex w-full flex-col gap-3">
                    <button
                      onClick={() => navigate('/cuenta')}
                      className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    >
                      Mejorar mi cuenta
                    </button>
                    <button
                      onClick={() => setShowPremiumModal(false)}
                      className="w-full rounded-xl bg-slate-800 px-4 py-3 font-semibold text-slate-300 transition-colors hover:bg-slate-700"
                    >
                      Quizás más tarde
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DUMMY_GAMES: any[] = [
  // --- ARCADE ---
  { id: "mock-1", title: "Neon Rider", genre: "arcade", rating: 4.8, players: 1243, thumbnail_url: "/assets/mock-games/neon-rider.jpg", isPremium: true },
  { id: "mock-2", title: "Ninja Dash", genre: "arcade", rating: 4.3, players: 750, thumbnail_url: "/assets/mock-games/ninja-dash.png" },
  { id: "mock-3", title: "Asteroid Miner", genre: "arcade", rating: 4.4, players: 890, thumbnail_url: "/assets/mock-games/asteroid-miner.jpg" },
  { id: "mock-4", title: "Retro Pinball", genre: "arcade", rating: 4.1, players: 320, thumbnail_url: "/assets/mock-games/retro-pinball.jpg",  isPremium: true },
  { id: "mock-5", title: "Cyber Pong", genre: "arcade", rating: 4.5, players: 2100, thumbnail_url: "/assets/mock-games/cyber-pong.jpg" },
  { id: "mock-6", title: "Gravity Flip", genre: "arcade", rating: 4.2, players: 430, thumbnail_url: "/assets/mock-games/gravity-flip.jpg" },
  { id: "mock-7", title: "Pixel Kart", genre: "arcade", rating: 4.7, players: 3100, thumbnail_url: "/assets/mock-games/pixel-kart.jpg", isPremium: true },

  // --- ACTION ---
  { id: "mock-8", title: "Galactic Wars", genre: "action", rating: 4.6, players: 5120, thumbnail_url: "/assets/mock-games/galactic-wars.jpg" },
  { id: "mock-9", title: "Zombie Survival", genre: "action", rating: 4.1, players: 620, thumbnail_url: "/assets/mock-games/zombie-survival.jpg" },
  { id: "mock-10", title: "Super Platformer", genre: "action", rating: 4.9, players: 1560, thumbnail_url: "/assets/mock-games/super-platformer.jpg" },
  { id: "mock-11", title: "Mecha Assault", genre: "action", rating: 4.5, players: 890, thumbnail_url: "/assets/mock-games/mecha-assault.jpg", isPremium: true },
  { id: "mock-12", title: "Wild West Shootout", genre: "action", rating: 4.0, players: 300, thumbnail_url: "/assets/mock-games/wild-west.jfif" },
  { id: "mock-13", title: "Cyber Samurai", genre: "action", rating: 4.8, players: 2200, thumbnail_url: "/assets/mock-games/cyber-samurai.jpg" },
  { id: "mock-14", title: "Dino Hunter", genre: "action", rating: 4.2, players: 780, thumbnail_url: "/assets/mock-games/dino-hunter.png" },

  // --- RPG ---
  { id: "mock-15", title: "Dungeon Crawler X", genre: "rpg", rating: 4.9, players: 3420, thumbnail_url: "/assets/mock-games/dungeon-crawler.png" },
  { id: "mock-16", title: "Fantasy Quest", genre: "rpg", rating: 4.5, players: 1120, thumbnail_url: "/assets/mock-games/fantasy-quest.jpg", isPremium: true },
  { id: "mock-17", title: "Dragon Slayer", genre: "rpg", rating: 4.7, players: 4500, thumbnail_url: "/assets/mock-games/dragon-slayer.jpg" },
  { id: "mock-18", title: "Magic Academy", genre: "rpg", rating: 4.4, players: 900, thumbnail_url: "/assets/mock-games/magic-academy.jpg" },
  { id: "mock-19", title: "Wasteland Wanderer", genre: "rpg", rating: 4.6, players: 1800, thumbnail_url: "/assets/mock-games/wasteland-wanderer.jpg", isPremium: true },
  { id: "mock-20", title: "Pirate's Legacy", genre: "rpg", rating: 4.3, players: 600, thumbnail_url: "/assets/mock-games/pirates-legacy.png" },

  // --- PUZZLE ---
  { id: "mock-21", title: "Cyberpunk Tic-Tac-Toe", genre: "puzzle", rating: 4.8, players: 1205, thumbnail_url: "/assets/mock-games/cyber-tictactoe.jfif", isPremium: true },
  { id: "mock-22", title: "Tetris 3D Hologram", genre: "puzzle", rating: 4.6, players: 930, thumbnail_url: "/assets/mock-games/tetris-3d.jpg" },
  { id: "mock-23", title: "Chess Master AI", genre: "puzzle", rating: 4.9, players: 4100, thumbnail_url: "/assets/mock-games/chess-master.jfif" },
  { id: "mock-24", title: "Mystic Runes", genre: "puzzle", rating: 4.2, players: 350, thumbnail_url: "/assets/mock-games/mystic-runes.jpg" },

];
// --- FIN DE DATOS FALSOS ---