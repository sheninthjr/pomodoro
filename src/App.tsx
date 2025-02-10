import { useEffect, useState, useRef } from "react";
import warningAudio from "./assets/warning.wav";
import { ActiveTab, TIMER_CONFIG } from "./types";

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("short");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.short);
  const [customMinutes, setCustomMinutes] = useState<string>("");
  const [customSeconds, setCustomSeconds] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(warningAudio);
  }, []);

  function handleActiveTab(tab: ActiveTab) {
    setIsActive(false);
    setActiveTab(tab);
    if (tab === "short") {
      setTimeLeft(TIMER_CONFIG.short);
    } else {
      setTimeLeft(TIMER_CONFIG.custom);
    }
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    const minutes = parseInt(customMinutes) || 0;
    const seconds = parseInt(customSeconds) || 0;

    if (minutes >= 0 && seconds >= 0 && seconds < 60) {
      const totalSeconds = minutes * 60 + seconds;
      if (totalSeconds > 0) {
        setTimeLeft(totalSeconds);
        setCustomMinutes("");
        setCustomSeconds("");
      }
    }
  }

  function toggleTimer() {
    if (timeLeft === 0 && !isActive) {
      setTimeLeft(
        activeTab === "short" ? TIMER_CONFIG.short : TIMER_CONFIG.custom
      );
    }
    setIsActive(!isActive);
  }

  function resetTimer() {
    setIsActive(false);
    setTimeLeft(
      activeTab === "short" ? TIMER_CONFIG.short : TIMER_CONFIG.custom
    );
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval = 0;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  return (
    <div className="flex justify-center items-center h-screen font-metrophobic bg-teal-50">
      <div className="w-80 text-white p-6 h-[450px] flex flex-col space-y-6 bg-black/90 shadow-lg">
        <div className="font-extrabold text-3xl font-metrophobic flex justify-center">
          Pomodoro Timer
        </div>

        <div className="flex justify-center gap-3 items-center">
          <button
            className={`${
              activeTab === "short" && "bg-white/30"
            } p-2 text-lg rounded-xl font-bold hover:bg-white/20 transition-colors`}
            onClick={() => handleActiveTab("short")}
          >
            Short Break
          </button>
          <button
            className={`${
              activeTab === "custom" && "bg-white/30"
            } p-2 text-lg rounded-xl font-bold hover:bg-white/20 backdrop-blur-2xl transition-colors`}
            onClick={() => handleActiveTab("custom")}
          >
            Custom Timer
          </button>
        </div>

        {activeTab === "custom" && (
          <form
            onSubmit={handleCustomSubmit}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex gap-2 items-center">
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="Min"
                  className="w-20 p-2 rounded-lg outline-none  text-black bg-white font-semibold"
                  min="0"
                />
                <label className="text-sm mt-1">Minutes</label>
              </div>
              <div className="text-2xl font-bold pb-6">:</div>
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  value={customSeconds}
                  onChange={(e) => setCustomSeconds(e.target.value)}
                  placeholder="Sec"
                  className="w-20 p-2 rounded-lg outline-none text-black bg-white font-semibold"
                  min="0"
                  max="59"
                />
                <label className="text-sm mt-1">Seconds</label>
              </div>
            </div>
            <button
              type="submit"
              className="bg-white/30 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              Set Timer
            </button>
          </form>
        )}

        <div className={`${activeTab === "short" ? "pt-14" : "pt-0"}`}>
          <div className="text-7xl font-bold flex justify-center font-mono">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={toggleTimer}
              className="bg-white/30 px-6 py-2 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
            >
              {isActive ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="bg-white/30 px-6 py-2 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
