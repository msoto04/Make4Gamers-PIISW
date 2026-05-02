import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import GameCard from "../features/games/components/GameCard";
import { getGames, type Game } from "../features/games/services/getGames";
import { Link } from "react-router-dom";

function safeLower(value: unknown): string {
  return typeof value === "string" ? value.toLowerCase() : "";
}


export default function Juegos() {
  const [games, setGames] = useState<Game[]>([]);
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categoryOptions = [
    { value: "all", label: t("game.filters.all") },
    { value: "action", label: t("game.filters.action") },
    { value: "arcade", label: t("game.filters.arcade") },
    { value: "rpg", label: t("game.filters.rpg") },
    { value: "puzzle", label: t("game.filters.puzzle") },
  ];

useEffect(() => {
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

  const popularGames = [...games]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 3);

  const filteredGames = games.filter((game) => {
    const matchesSearch = safeLower(game.title).includes(safeLower(searchTerm));
    const matchesCategory =
      categoryFilter === "all" ||
      safeLower(game.genre) === safeLower(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const hasActiveFilters = searchTerm.trim().length > 0 || categoryFilter !== "all";

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-950/20 to-slate-950">

      {/* All Games */}
      <section className="container mx-auto pt-12 px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{t("game.allGames")}</h2>
          <span className="text-slate-400">{filteredGames.length} {t("game.gamesCount")}</span>
        </div>

        <div className="mb-6 border-b border-slate-800/80 pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="group relative w-full lg:max-w-2xl lg:flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-slate-300"
                size={17}
              />
              <input
                type="text"
                placeholder={t("game.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-800 bg-slate-900/40 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categoryOptions.map((option) => {
                const isActive = categoryFilter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCategoryFilter(option.value)}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-100"
                        : "border-slate-800 bg-transparent text-slate-300 hover:border-slate-600 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}

              {hasActiveFilters && (
                <div className="ml-1 border-l border-slate-800/80 pl-2 sm:ml-2 sm:pl-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                    }}
                    className="h-8 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 text-sm font-medium text-indigo-100 transition-colors hover:border-indigo-400/60 hover:bg-indigo-500/15"
                  >
                    Limpiar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <Link key={game.id} to={`/game/${game.id}`} className="block">
                <GameCard
                  title={game.title ?? "Unknown game"}
                  image={game.thumbnail_url ?? "https://via.placeholder.com/400x300?text=No+Image"}
                  genre={game.genre ?? t("gameplay.noGenre")}
                  rating={typeof game.rating === "number" ? game.rating : 0}
                  players={game.players ?? 0}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">{t("game.noResults")}</p>
          </div>
        )}
      </section>
    </div>
  );
}


const DUMMY_GAMES: any[] = [
  // --- ARCADE ---
  { id: "mock-1", title: "Neon Rider", genre: "arcade", rating: 4.8, players: 1243, thumbnail_url: "/assets/mock-games/neon-rider.jpg" },
  { id: "mock-2", title: "Ninja Dash", genre: "arcade", rating: 4.3, players: 750, thumbnail_url: "/assets/mock-games/ninja-dash.png" },
  { id: "mock-3", title: "Asteroid Miner", genre: "arcade", rating: 4.4, players: 890, thumbnail_url: "/assets/mock-games/asteroid-miner.jpg" },
  { id: "mock-4", title: "Retro Pinball", genre: "arcade", rating: 4.1, players: 320, thumbnail_url: "/assets/mock-games/retro-pinball.jpg" },
  { id: "mock-5", title: "Cyber Pong", genre: "arcade", rating: 4.5, players: 2100, thumbnail_url: "/assets/mock-games/cyber-pong.jpg" },
  { id: "mock-6", title: "Gravity Flip", genre: "arcade", rating: 4.2, players: 430, thumbnail_url: "/assets/mock-games/gravity-flip.jpg" },
  { id: "mock-7", title: "Pixel Kart", genre: "arcade", rating: 4.7, players: 3100, thumbnail_url: "/assets/mock-games/pixel-kart.jpg" },

  // --- ACTION ---
  { id: "mock-8", title: "Galactic Wars", genre: "action", rating: 4.6, players: 5120, thumbnail_url: "/assets/mock-games/galactic-wars.jpg" },
  { id: "mock-9", title: "Zombie Survival", genre: "action", rating: 4.1, players: 620, thumbnail_url: "/assets/mock-games/zombie-survival.jpg" },
  { id: "mock-10", title: "Super Platformer", genre: "action", rating: 4.9, players: 1560, thumbnail_url: "/assets/mock-games/super-platformer.jpg" },
  { id: "mock-11", title: "Mecha Assault", genre: "action", rating: 4.5, players: 890, thumbnail_url: "/assets/mock-games/mecha-assault.jpg" },
  { id: "mock-12", title: "Wild West Shootout", genre: "action", rating: 4.0, players: 300, thumbnail_url: "/assets/mock-games/wild-west.jfif" },
  { id: "mock-13", title: "Cyber Samurai", genre: "action", rating: 4.8, players: 2200, thumbnail_url: "/assets/mock-games/cyber-samurai.jpg" },
  { id: "mock-14", title: "Dino Hunter", genre: "action", rating: 4.2, players: 780, thumbnail_url: "/assets/mock-games/dino-hunter.png" },

  // --- RPG ---
  { id: "mock-15", title: "Dungeon Crawler X", genre: "rpg", rating: 4.9, players: 3420, thumbnail_url: "/assets/mock-games/dungeon-crawler.png" },
  { id: "mock-16", title: "Fantasy Quest", genre: "rpg", rating: 4.5, players: 1120, thumbnail_url: "/assets/mock-games/fantasy-quest.jpg" },
  { id: "mock-17", title: "Dragon Slayer", genre: "rpg", rating: 4.7, players: 4500, thumbnail_url: "/assets/mock-games/dragon-slayer.jpg" },
  { id: "mock-18", title: "Magic Academy", genre: "rpg", rating: 4.4, players: 900, thumbnail_url: "/assets/mock-games/magic-academy.jpg" },
  { id: "mock-19", title: "Wasteland Wanderer", genre: "rpg", rating: 4.6, players: 1800, thumbnail_url: "/assets/mock-games/wasteland-wanderer.jpg" },
  { id: "mock-20", title: "Pirate's Legacy", genre: "rpg", rating: 4.3, players: 600, thumbnail_url: "/assets/mock-games/pirates-legacy.png" },

  // --- PUZZLE ---
  { id: "mock-21", title: "Cyberpunk Tic-Tac-Toe", genre: "puzzle", rating: 4.8, players: 1205, thumbnail_url: "/assets/mock-games/cyber-tictactoe.jfif" },
  { id: "mock-22", title: "Tetris 3D Hologram", genre: "puzzle", rating: 4.6, players: 930, thumbnail_url: "/assets/mock-games/tetris-3d.jpg" },
  { id: "mock-23", title: "Chess Master AI", genre: "puzzle", rating: 4.9, players: 4100, thumbnail_url: "/assets/mock-games/chess-master.jfif" },
  { id: "mock-24", title: "Mystic Runes", genre: "puzzle", rating: 4.2, players: 350, thumbnail_url: "/assets/mock-games/mystic-runes.jpg" },

];
// --- FIN DE DATOS FALSOS ---