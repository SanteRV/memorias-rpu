import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Award, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Winner {
  name: string;
  position: "gold" | "silver" | "bronze";
  emoji?: string;
}

interface AwardCategory {
  id: number;
  title: string;
  emoji: string;
  winners: Winner[];
}

const awardsData: AwardCategory[] = [
  {
    id: 1,
    title: "El/La más borracho",
    emoji: "🍺",
    winners: [
      { name: "Lewis", position: "gold" },
      { name: "Denzel", position: "silver" },
      { name: "Mario Irrivarren", position: "bronze" }
    ]
  },
  {
    id: 2,
    title: "El go a todo",
    emoji: "🔥",
    winners: [
      { name: "Piero", position: "gold" },
      { name: "Ayrton", position: "silver" },
      { name: "Lewis", position: "bronze" }
    ]
  },
  {
    id: 3,
    title: "El hablamamadas tres mil",
    emoji: "🗣️",
    winners: [
      { name: "Lewis", position: "gold" },
      { name: "Piero", position: "silver" },
      { name: "Oscar", position: "bronze" }
    ]
  },
  {
    id: 4,
    title: "El/La Migajera Oficial",
    emoji: "🍞",
    winners: [
      { name: "Alexandra", position: "gold" },
      { name: "Ale", position: "silver" },
      { name: "Anyeli", position: "bronze" }
    ]
  },
  {
    id: 5,
    title: "El/La Drama Claus",
    emoji: "🎭",
    winners: [
      { name: "Anyeli", position: "gold" },
      { name: "Lewis", position: "silver" },
      { name: "Alexandra", position: "bronze" }
    ]
  },
  {
    id: 6,
    title: "El más jarra",
    emoji: "🥃",
    winners: [
      { name: "Angely", position: "gold" },
      { name: "Fernando", position: "silver" },
      { name: "Mario Irrivarren", position: "bronze" }
    ]
  },
  {
    id: 7,
    title: "El/La más chismoso(a)",
    emoji: "👂",
    winners: [
      { name: "Keyla", position: "gold" },
      { name: "Piero", position: "silver" },
      { name: "Lewis", position: "bronze" }
    ]
  },
  {
    id: 8,
    title: "El/La duende energético",
    emoji: "⚡",
    winners: [
      { name: "Andree", position: "gold" },
      { name: "Ana", position: "silver" },
      { name: "Keyla", position: "bronze" }
    ]
  },
  {
    id: 9,
    title: "El Ángel Caído",
    emoji: "😇😈",
    winners: [
      { name: "Carlos Daniel", position: "gold" },
      { name: "Mario Irrivarren", position: "silver" },
      { name: "Piero", position: "bronze" }
    ]
  },
  {
    id: 10,
    title: "El sigue mujeres tres mil",
    emoji: "💃",
    winners: [
      { name: "Oscar", position: "gold" },
      { name: "Piero", position: "silver" },
      { name: "Carlos Daniel", position: "bronze" }
    ]
  },
  {
    id: 11,
    title: "El/La Tragapanetón Deluxe",
    emoji: "🍰",
    winners: [
      { name: "Denzel", position: "gold" },
      { name: "Oscar", position: "silver" },
      { name: "Miska", position: "bronze" }
    ]
  },
  {
    id: 12,
    title: "El/La más infiel",
    emoji: "💔",
    winners: [
      { name: "Andree", position: "gold" },
      { name: "Carlos Daniel", position: "silver" },
      { name: "Braulio", position: "bronze" }
    ]
  },
  {
    id: 13,
    title: "El/La más fiel",
    emoji: "❤️",
    winners: [
      { name: "Miska", position: "gold" },
      { name: "Piero", position: "silver" },
      { name: "Carlos", position: "bronze" }
    ]
  },
  {
    id: 14,
    title: "El más impuntual",
    emoji: "⏰",
    winners: [
      { name: "Piero", position: "gold" },
      { name: "Lucky", position: "silver" },
      { name: "Andree", position: "bronze" }
    ]
  },
  {
    id: 15,
    title: "El/La más competitivo",
    emoji: "🏆",
    winners: [
      { name: "Nataly", position: "gold" },
      { name: "Keyla", position: "silver" },
      { name: "Lewis", position: "bronze" }
    ]
  },
  {
    id: 16,
    title: "El/La mejor bailarín(a)",
    emoji: "💃🕺",
    winners: [
      { name: "Carbajal", position: "gold" },
      { name: "Mario Irrivarren", position: "silver" },
      { name: "Lewis", position: "bronze" }
    ]
  },
  {
    id: 17,
    title: "El/La que le va peor en el amor",
    emoji: "😭",
    winners: [
      { name: "Oscar", position: "gold" },
      { name: "Mario Irrivarren", position: "silver" },
      { name: "Lewis", position: "bronze" }
    ]
  },
  {
    id: 18,
    title: "El más bandido(a)",
    emoji: "😎",
    winners: [
      { name: "Hana", position: "gold" },
      { name: "Maria", position: "silver" },
      { name: "Lewis", position: "bronze" }
    ]
  },
  {
    id: 19,
    title: "El/La que se demora 3 días en responder",
    emoji: "📵",
    winners: [
      { name: "Ayrton", position: "gold" },
      { name: "Oscar", position: "silver" },
      { name: "Lewis", position: "bronze" }
    ]
  },
  {
    id: 20,
    title: "El/La más pisado(a)",
    emoji: "🪤",
    winners: [
      { name: "Miska", position: "gold" },
      { name: "Carlos Daniel", position: "silver" },
      { name: "David", position: "bronze" }
    ]
  },
  {
    id: 21,
    title: "El espíritu del grupo",
    emoji: "👻",
    winners: [
      { name: "Nataly", position: "gold" },
      { name: "Lucky", position: "silver" },
      { name: "Fabiana", position: "bronze" }
    ]
  },
  {
    id: 22,
    title: "El/La diva de las fotos",
    emoji: "📸",
    winners: [
      { name: "Oscar", position: "gold" },
      { name: "Miska", position: "silver" },
      { name: "David", position: "bronze" }
    ]
  },
  {
    id: 23,
    title: "El/La rompe-corazones accidental",
    emoji: "💘",
    winners: [
      { name: "Piero", position: "gold" },
      { name: "Braulio", position: "silver" },
      { name: "Denzel", position: "bronze" }
    ]
  },
  {
    id: 24,
    title: "Mejor desarrollo de personaje",
    emoji: "📈",
    winners: [
      { name: "Alexandra", position: "gold" },
      { name: "Edith", position: "silver" },
      { name: "Anhelle", position: "bronze" }
    ]
  },
  {
    id: 25,
    title: "El/La que no supera al ex",
    emoji: "🥲",
    winners: [
      { name: "Lewis", position: "gold" },
      { name: "Piero", position: "silver" },
      { name: "Denzel", position: "bronze" }
    ]
  },
  {
    id: 26,
    title: "Experto/a en crear situaciones incómodas",
    emoji: "😬",
    winners: [
      { name: "Lewis", position: "gold" },
      { name: "Oscar", position: "silver" },
      { name: "Ayrton", position: "bronze" }
    ]
  },
  {
    id: 27,
    title: "Mejor shippeo",
    emoji: "💞",
    winners: [
      { name: "Piero ❤️ Anyeli", position: "gold" },
      { name: "David ❤️ Hanna", position: "silver" },
      { name: "Lewis ❤️ Sheriff", position: "bronze" }
    ]
  }
];

const getMedalColor = (position: "gold" | "silver" | "bronze") => {
  switch (position) {
    case "gold":
      return "from-yellow-400 via-yellow-500 to-yellow-600";
    case "silver":
      return "from-gray-300 via-gray-400 to-gray-500";
    case "bronze":
      return "from-orange-400 via-orange-500 to-orange-600";
  }
};

const getMedalEmoji = (position: "gold" | "silver" | "bronze") => {
  switch (position) {
    case "gold":
      return "🥇";
    case "silver":
      return "🥈";
    case "bronze":
      return "🥉";
  }
};

const getPodiumHeight = (position: "gold" | "silver" | "bronze") => {
  switch (position) {
    case "gold":
      return "h-48";
    case "silver":
      return "h-36";
    case "bronze":
      return "h-28";
  }
};

export function RPUAwards() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentAward = awardsData[selectedCategory];

  const nextCategory = () => {
    setSelectedCategory((prev) => (prev + 1) % awardsData.length);
  };

  const prevCategory = () => {
    setSelectedCategory((prev) => (prev - 1 + awardsData.length) % awardsData.length);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[var(--color-primary)] via-purple-900 to-pink-900 py-20 px-4 sm:px-6 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-accent) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-block mb-4"
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <Trophy className="w-20 h-20 text-[var(--color-accent)] mx-auto drop-shadow-2xl" />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
          RPU AWARDS
        </h1>
        <p className="text-xl md:text-2xl text-white/80 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6" />
          Los mejores del Intercambio Nacional
          <Sparkles className="w-6 h-6" />
        </p>
      </motion.div>

      {/* Menu Button */}
      <div className="relative z-10 flex justify-center mb-8">
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Award className="w-5 h-5" />
          {isMenuOpen ? "Cerrar Menú" : "Ver Todas las Categorías"}
          <span className="bg-[var(--color-accent)] text-[var(--color-primary)] px-2 py-1 rounded-full text-sm font-bold">
            {selectedCategory + 1}/{awardsData.length}
          </span>
        </motion.button>
      </div>

      {/* Categories Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="relative z-20 max-w-6xl mx-auto mb-12"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {awardsData.map((award, index) => (
                  <motion.button
                    key={award.id}
                    onClick={() => {
                      setSelectedCategory(index);
                      setIsMenuOpen(false);
                    }}
                    className={`p-4 rounded-xl text-left transition-all duration-300 ${
                      selectedCategory === index
                        ? "bg-[var(--color-accent)] text-[var(--color-primary)] shadow-xl scale-105"
                        : "bg-white/5 text-white hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{award.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{award.title}</p>
                        <p className="text-xs opacity-70">
                          🥇 {award.winners[0].name}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Award Display */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAward.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-8 md:p-12 border-2 border-white/20 shadow-2xl"
          >
            {/* Category Title */}
            <motion.div
              className="text-center mb-12"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="text-6xl sm:text-8xl mb-4"
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                {currentAward.emoji}
              </motion.div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 px-2 break-words">
                {currentAward.title}
              </h2>
            </motion.div>

            {/* Podium */}
            <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-8 mb-8">
              {/* Silver - 2nd Place */}
              <motion.div
                className="flex flex-col items-center flex-1 max-w-[36%] sm:max-w-none"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <motion.div
                  className="mb-4 w-full"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="text-4xl sm:text-6xl mb-2 text-center">🥈</div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 text-center w-full sm:min-w-[140px]">
                    <p className="text-white font-bold text-sm sm:text-lg break-words">
                      {currentAward.winners[1].name}
                    </p>
                  </div>
                </motion.div>
                <div className={`${getPodiumHeight("silver")} w-full sm:w-32 bg-gradient-to-b ${getMedalColor("silver")} rounded-t-lg shadow-xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl`}>
                  2°
                </div>
              </motion.div>

              {/* Gold - 1st Place (Winner with special animation) */}
              <motion.div
                className="flex flex-col items-center flex-1 max-w-[38%] sm:max-w-none"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <motion.div
                  className="mb-4 relative w-full"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Sparkles around winner */}
                  <motion.div
                    className="absolute -top-2 -left-2"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-[var(--color-accent)]" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 0.5,
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-[var(--color-accent)]" />
                  </motion.div>

                  <motion.div
                    className="text-6xl sm:text-8xl mb-2 text-center"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    🥇
                  </motion.div>
                  <div className="bg-gradient-to-br from-[var(--color-accent)] to-yellow-600 rounded-xl p-3 sm:p-5 text-center w-full sm:min-w-[160px] shadow-2xl border-4 border-white/30">
                    <p className="text-[var(--color-primary)] font-black text-base sm:text-xl break-words">
                      {currentAward.winners[0].name}
                    </p>
                    <p className="text-[var(--color-primary)]/70 text-xs sm:text-sm font-bold mt-1">
                      GANADOR(A)
                    </p>
                  </div>
                </motion.div>
                <div className={`${getPodiumHeight("gold")} w-full sm:w-36 bg-gradient-to-b ${getMedalColor("gold")} rounded-t-lg shadow-2xl flex items-center justify-center text-white font-bold text-2xl sm:text-3xl border-t-4 border-white/30`}>
                  1°
                </div>
              </motion.div>

              {/* Bronze - 3rd Place */}
              <motion.div
                className="flex flex-col items-center flex-1 max-w-[36%] sm:max-w-none"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <motion.div
                  className="mb-4 w-full"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <div className="text-4xl sm:text-6xl mb-2 text-center">🥉</div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 text-center w-full sm:min-w-[140px]">
                    <p className="text-white font-bold text-sm sm:text-lg break-words">
                      {currentAward.winners[2].name}
                    </p>
                  </div>
                </motion.div>
                <div className={`${getPodiumHeight("bronze")} w-full sm:w-32 bg-gradient-to-b ${getMedalColor("bronze")} rounded-t-lg shadow-xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl`}>
                  3°
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            onClick={prevCategory}
            className="bg-white/10 backdrop-blur-md text-white p-4 rounded-full border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            onClick={nextCategory}
            className="bg-white/10 backdrop-blur-md text-white p-4 rounded-full border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
