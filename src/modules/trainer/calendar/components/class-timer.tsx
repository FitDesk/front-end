import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ClassTimerProps {
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  actualStartTime?: Date; // Hora real cuando se inició la clase
}

export function ClassTimer({ startTime, endTime, status, actualStartTime }: ClassTimerProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isOvertime, setIsOvertime] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'in_progress') {
      // Usar la hora real de inicio si está disponible, sino usar la hora programada
      const realStartTime = actualStartTime || startTime;
      const startTimeMs = new Date(realStartTime).getTime();
      const currentTime = Date.now();
      const elapsed = Math.max(0, currentTime - startTimeMs); // Asegurar que no sea negativo
      setTime(elapsed);
      setIsRunning(true);
      
      // Iniciar el intervalo inmediatamente para mantener el tiempo actualizado
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = Math.max(0, prevTime + 1000);
          // Verificar si se excedió el tiempo programado
          const startTimeMs = new Date(realStartTime).getTime();
          const endTimeMs = new Date(endTime).getTime();
          const scheduledDuration = Math.max(0, endTimeMs - startTimeMs);
          if (scheduledDuration > 0 && newTime > scheduledDuration) {
            setIsOvertime(true);
          }
          return newTime;
        });
      }, 1000);
    }
  }, [startTime, status, endTime, actualStartTime]);

  // Limpiar el intervalo cuando el componente se desmonta o cambia el estado
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Pausar/reanudar el cronómetro
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
    // Asegurar que el tiempo no sea negativo
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
  
  // Progreso basado en la duración total de la clase
  const startTimeMs = new Date(startTime).getTime();
  const endTimeMs = new Date(endTime).getTime();
  const scheduledDuration = Math.max(0, endTimeMs - startTimeMs); // Asegurar duración positiva
  const progress = scheduledDuration > 0 ? Math.min(100, (time / scheduledDuration) * 100) : 0;
  
  // Calculamos el stroke-dashoffset (circunferencia = 2πr = 2π×180 ≈ 1130.97)
  const circumference = 2 * Math.PI * 180;
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
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          
          {/* Título */}
          <h2 className="text-2xl font-bold text-white text-center mb-8 tracking-wider">
            CRONÓMETRO DE CLASE
          </h2>

          {/* Círculo de Progreso */}
          <div className="flex justify-center mb-8">
            <div className="relative w-96 h-96">
              
              {/* SVG Círculo */}
              <svg className="transform -rotate-90 w-full h-full">
                {/* Círculo de fondo */}
                <circle
                  cx="192"
                  cy="192"
                  r="180"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="14"
                  fill="none"
                />
                {/* Círculo de progreso */}
                <circle
                  cx="192"
                  cy="192"
                  r="180"
                  stroke={isOvertime ? "url(#gradient-red)" : "url(#gradient)"}
                  strokeWidth="14"
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
                  <div className="text-5xl md:text-6xl font-bold text-white font-mono mb-2">
                    {timeFormatted.hours}
                    <span className={isOvertime ? "text-red-400" : "text-orange-400"}>:</span>
                    {timeFormatted.minutes}
                    <span className={isOvertime ? "text-red-400" : "text-pink-400"}>:</span>
                    {timeFormatted.seconds}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest">
                    Horas : Minutos : Segundos
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Botones de Control */}
          <div className="flex gap-4 mb-6">
            
            {/* Botón Start/Pause */}
            <button
              type="button"
              onClick={handleStartPause}
              className={`btn-hover flex-1 h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 ${
                isRunning
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  : 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause size={24} fill="white" />
                  <span>PAUSAR</span>
                </>
              ) : (
                <>
                  <Play size={24} fill="white" />
                  <span>INICIAR</span>
                </>
              )}
            </button>

            {/* Botón Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="btn-hover h-16 px-8 rounded-2xl font-bold text-lg bg-white/10 text-white border-2 border-white/20 hover:border-white/40 flex items-center justify-center gap-3"
            >
              <RotateCcw size={24} />
            </button>

          </div>

          {/* Indicador de progreso */}
          <div className="text-center">
            <div className="text-sm text-gray-400">
              {isOvertime ? (
                <span className="text-red-400 font-bold">⚠️ TIEMPO EXCEDIDO - {progress.toFixed(0)}%</span>
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
