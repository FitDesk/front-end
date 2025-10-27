import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ClassTimerProps {
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  actualStartTime?: Date;
  classId?: string;
}

export function ClassTimer({ startTime, endTime, status, actualStartTime, classId }: ClassTimerProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isOvertime, setIsOvertime] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);
  
  const storageKey = classId ? `class_timer_state_${classId}` : null;

  
  useEffect(() => {
 
    if (status === 'in_progress' && !hasInitialized.current) {
      hasInitialized.current = true;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
     
      if (storageKey) {
        const savedState = localStorage.getItem(storageKey);
        if (savedState) {
          try {
            const { time: savedTime, isRunning: savedIsRunning } = JSON.parse(savedState);
            setTime(savedTime);
            setIsRunning(savedIsRunning !== undefined ? savedIsRunning : true);
          } catch (e) {
       
            const realStartTime = actualStartTime || startTime;
            const startTimeMs = new Date(realStartTime).getTime();
            const currentTime = Date.now();
            const elapsed = Math.max(0, currentTime - startTimeMs);
            setTime(elapsed);
            setIsRunning(true);
          }
        } else {
     
          const realStartTime = actualStartTime || startTime;
          const startTimeMs = new Date(realStartTime).getTime();
          const currentTime = Date.now();
          const elapsed = Math.max(0, currentTime - startTimeMs);
          setTime(elapsed);
          setIsRunning(true);
        }
      }
      
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = Math.max(0, prevTime + 1000);
          const realStartTime = actualStartTime || startTime;
          const startTimeMs = new Date(realStartTime).getTime();
          const endTimeMs = new Date(endTime).getTime();
          const scheduledDuration = Math.max(0, endTimeMs - startTimeMs);
          if (scheduledDuration > 0 && newTime > scheduledDuration) {
            setIsOvertime(true);
          }
          return newTime;
        });
      }, 1000);
    } else if (status !== 'in_progress') {
      // Si no está en progreso, limpiar
      hasInitialized.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (status !== 'in_progress' && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, actualStartTime, startTime, endTime, storageKey, classId]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (status !== 'in_progress') {
      hasInitialized.current = false;
    }
  }, [status]);

  useEffect(() => {
    if (storageKey && status === 'in_progress') {
      localStorage.setItem(storageKey, JSON.stringify({ time, isRunning }));
    } else if (storageKey && status !== 'in_progress') {
   
      localStorage.removeItem(storageKey);
    }
  }, [time, isRunning, storageKey, status]);
  
 
  useEffect(() => {
    return () => {
      if (storageKey && status !== 'in_progress') {
        localStorage.removeItem(storageKey);
      }
    };
  }, [storageKey, status]);

 
  useEffect(() => {
    if (status === 'in_progress') {
      if (!isRunning && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isRunning, status]);

  const formatTime = (milliseconds: number) => {

    const safeTime = Math.max(0, milliseconds);
    const totalSeconds = Math.floor(safeTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setIsOvertime(false);
  };

  if (status !== 'in_progress') {
    return null;
  }

  const timeFormatted = formatTime(time);
  

  const startTimeMs = new Date(startTime).getTime();
  const endTimeMs = new Date(endTime).getTime();
  const scheduledDuration = Math.max(0, endTimeMs - startTimeMs);
  const progress = scheduledDuration > 0 ? Math.min(100, (time / scheduledDuration) * 100) : 0;
  

  const circumference = 2 * Math.PI * 84;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }

        .btn-hover {
          transition: all 0.3s ease;
        }

        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .btn-hover:active {
          transform: translateY(0);
        }
      `}</style>

      <div className="w-full">
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
          
          {/* Título */}
          <h2 className="text-lg font-bold text-white text-center mb-4">
            Cronómetro de Clase
          </h2>

          {/* Círculo de Progreso */}
          <div className="flex justify-center mb-4">
            <div className="relative w-48 h-48">
              
              {/* SVG Círculo */}
              <svg className="transform -rotate-90 w-full h-full">
                {/* Círculo de fondo */}
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Círculo de progreso */}
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke={isOvertime ? "url(#gradient-red)" : "url(#gradient)"}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#b91c1c" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Tiempo en el centro */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-center ${isRunning ? 'pulse-animation' : ''}`}>
                  <div className="text-2xl font-bold text-white font-mono mb-1">
                    {timeFormatted.hours}
                    <span className={isOvertime ? "text-red-400" : "text-orange-400"}>:</span>
                    {timeFormatted.minutes}
                    <span className={isOvertime ? "text-red-400" : "text-pink-400"}>:</span>
                    {timeFormatted.seconds}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Hor : Min : Seg
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Botones de Control */}
          <div className="flex gap-2 mb-3">
            
            {/* Botón Start/Pause */}
            <button
              type="button"
              onClick={handleStartPause}
              className={`btn-hover flex-1 h-10 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${
                isRunning
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  : 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause size={18} fill="white" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play size={18} fill="white" />
                  <span>Iniciar</span>
                </>
              )}
            </button>

            {/* Botón Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="btn-hover h-10 px-4 rounded-xl font-semibold text-sm bg-white/10 text-white border-2 border-white/20 hover:border-white/40 flex items-center justify-center"
            >
              <RotateCcw size={18} />
            </button>

          </div>

          {/* Indicador de progreso */}
          <div className="text-center">
            <div className="text-xs text-gray-400">
              {isOvertime ? (
                <span className="text-red-400 font-bold">⚠️ Tiempo excedido - {progress.toFixed(0)}%</span>
              ) : (
                <>
                  Progreso: <span className="text-white font-bold">{progress.toFixed(0)}%</span> de la clase
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
