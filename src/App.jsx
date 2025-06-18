import React, { useState, useRef, useEffect } from 'react';

const RadioApp = () => {
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(new Audio());

  const stations = [
    {
      id: 4,
      name: "FM LUZ",
      url: "https://stream.zeno.fm/8txwexzvxzduv",
      genre: "Cristiana",
      country: "Honduras",
      description: "Transmite música cristiana y prédicas edificantes.",
    },
    {
      id: 6,
      name: "Los 40 Principales",
      url: "https://stream.zeno.fm/8txwexzvxzduv",
      genre: "Pop",
      country: "Internacional",
      description: "Éxitos del momento y música pop.",
    },
    {
      id: 7,
      name: "Radio Vida",
      url: "https://stream.zeno.fm/ejemplo1",
      genre: "Cristiana",
      country: "Guatemala",
      description: "Música cristiana y mensajes de esperanza.",
    },
    {
      id: 8,
      name: "Alabanza FM",
      url: "https://stream.zeno.fm/ejemplo2",
      genre: "Cristiana",
      country: "El Salvador",
      description: "Alabanzas y adoración las 24 horas.",
    },
    {
      id: 9,
      name: "Radio Bendición",
      url: "https://stream.zeno.fm/ejemplo3",
      genre: "Cristiana",
      country: "Nicaragua",
      description: "Predicaciones y música cristiana contemporánea.",
    },
    {
      id: 10,
      name: "Esperanza Stéreo",
      url: "https://stream.zeno.fm/ejemplo4",
      genre: "Cristiana",
      country: "Costa Rica",
      description: "Mensajes de fe y música inspiradora.",
    },
  ];

  const genreColors = {
    Pop: "#ff6b9d",
    Clásica: "#4ecdc4",
    Dance: "#45b7d1",
    Jazz: "#96ceb4",
    Romántica: "#feca57",
    Rock: "#ff9ff3",
    Cristiana: "#54a0ff",
  };

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const playStation = async (station) => {
    if (currentStation?.id === station.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      audioRef.current.src = station.url;
      audioRef.current.load();

      audioRef.current.oncanplaythrough = () => {
        audioRef.current.play().then(() => {
          setCurrentStation(station);
          setIsPlaying(true);
          setIsLoading(false);
        }).catch(() => {
          alert("No se puede reproducir esta estación.");
          setIsLoading(false);
        });
      };

      audioRef.current.onerror = () => {
        alert("Error al cargar la estación.");
        setIsLoading(false);
      };
    } catch (error) {
      console.error(error);
      alert("Error inesperado al reproducir.");
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => alert("No se puede continuar."));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const StationCard = ({ station }) => (
    <div
      className={`bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 shadow-lg border-2 ${
        currentStation?.id === station.id 
          ? "border-blue-400 shadow-blue-200" 
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="flex flex-col space-y-4">
        {/* Header de la tarjeta */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 flex items-center justify-center rounded-full text-white font-bold text-xl shadow-lg"
              style={{ backgroundColor: genreColors[station.genre] || "#6b7280" }}
            >
              {station.genre[0]}
            </div>
            <div className="flex-1">
              <h3 className="text-gray-800 font-bold text-lg leading-tight">{station.name}</h3>
              <p className="text-gray-500 text-sm font-medium">{station.country}</p>
              <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide">{station.genre}</p>
            </div>
          </div>
          <button 
            onClick={() => toggleFavorite(station.id)} 
            className="text-2xl hover:scale-110 transition-transform"
            title="Favorito"
          >
            {favorites.includes(station.id) ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Descripción */}
        <p className="text-gray-600 text-sm leading-relaxed">{station.description}</p>

        {/* Botón de reproducción */}
        <button 
          onClick={() => playStation(station)} 
          disabled={isLoading && currentStation?.id === station.id}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
            currentStation?.id === station.id && isPlaying
              ? "bg-red-500 hover:bg-red-600 shadow-red-200"
              : "bg-blue-500 hover:bg-blue-600 shadow-blue-200"
          } shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading && currentStation?.id === station.id ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Cargando...</span>
            </>
          ) : currentStation?.id === station.id && isPlaying ? (
            <>
              <span className="text-xl">⏸️</span>
              <span>Pausar</span>
            </>
          ) : (
            <>
              <span className="text-xl">▶️</span>
              <span>Reproducir</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* NAVIGATION */}
      <nav className="bg-white shadow-lg border-b-2 border-blue-100">
        <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📻</span>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Mi Radio App</h1>
            </div>
            <ul className="hidden sm:flex gap-6 text-gray-600 font-medium">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Inicio</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Favoritos</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Contacto</li>
            </ul>
            {/* Menú móvil */}
            <div className="sm:hidden">
              <button className="text-gray-600 hover:text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow w-full max-w-1xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Título de sección */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            🎧 Rrd de Radio 
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Disfruta de las mejores estaciones de radio cristiana de Centroamérica
          </p>
        </div>

        {/* Grid de estaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-20">
          {stations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>

        {/* Sección de favoritos */}
        {favorites.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
              ❤️ Mis Favoritas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {stations
                .filter(station => favorites.includes(station.id))
                .map((station) => (
                  <StationCard key={station.id} station={station} />
                ))}
            </div>
          </div>
        )}
      </main>

      {/* REPRODUCTOR FIJO */}
      {currentStation && (
        <footer className="bg-white shadow-2xl border-t-2 border-blue-100 p-4 sm:p-6 fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full text-white font-bold shadow-lg"
                  style={{ backgroundColor: genreColors[currentStation.genre] }}
                >
                  {currentStation.genre[0]}
                </div>
                <div className="flex-1">
                  <span className="text-gray-800 font-bold text-lg block">{currentStation.name}</span>
                  <span className="text-gray-500 text-sm">{currentStation.country} • {currentStation.genre}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlayPause}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  {isPlaying ? "⏸️ Pausar" : "▶️ Reproducir"}
                </button>
                <button 
                  onClick={toggleMute}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-32 accent-blue-500"
                />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold shadow-lg"
                  style={{ backgroundColor: genreColors[currentStation.genre] }}
                >
                  {currentStation.genre[0]}
                </div>
                <div className="flex-1">
                  <span className="text-gray-800 font-bold block">{currentStation.name}</span>
                  <span className="text-gray-500 text-xs">{currentStation.country}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-3">
                <button 
                  onClick={togglePlayPause}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex-1"
                >
                  {isPlaying ? "⏸️ Pausar" : "▶️ Reproducir"}
                </button>
                <button 
                  onClick={toggleMute}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg"
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-20 accent-blue-500"
                />
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default RadioApp;