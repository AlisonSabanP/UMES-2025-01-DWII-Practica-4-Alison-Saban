import { useState, useEffect, useCallback } from 'react';

type Balloon = {
  id: number;
  tamanio: number;
  color: string;
  left: number;
  top: number;
};

function App() {
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  const createBalloon = useCallback(() => {
    const colors = [
      'bg-red-400',
      'bg-blue-400',
      'bg-green-400',
      'bg-yellow-400',
      'bg-purple-400',
      'bg-pink-400',
    ];

    if (!gameActive) return;

    const id = Date.now();
    const tamanio = Math.floor(Math.random() * 76) + 25; 
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * (window.innerWidth - tamanio);
    const top = Math.random() * (window.innerHeight - tamanio);

    const newBalloon: Balloon = { id, tamanio, color, left, top };
    setBalloons((prev) => [...prev, newBalloon]);


    setTimeout(() => {
      setBalloons((prev) => prev.filter((b) => b.id !== id));
    }, 2000);
  }, [gameActive]);

  const popBalloon = (id: number) => {
    if (!gameActive) return;
    setScore((prev) => prev + 1);
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    createBalloon(); 
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setBalloons([]);
    setGameActive(true);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameActive, timeLeft]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameActive) {
      interval = setInterval(createBalloon, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameActive, createBalloon]);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">


      <div className="flex justify-between w-full max-w-2xl mb-6">
        <div className="badge badge-lg badge-primary">Tiempo: {timeLeft}s</div>
        <div className="badge badge-lg badge-secondary">Puntaje: {score}</div>
      </div>


      {!gameActive && (
        <button onClick={startGame} className="btn btn-primary btn-lg mb-6">
          {timeLeft === 0 ? 'Jugar de nuevo' : 'Iniciar juego'}
        </button>
      )}


      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className={`absolute rounded-full cursor-pointer ${balloon.color} select-none`}
          style={{
            width: `${balloon.tamanio}px`,
            height: `${balloon.tamanio}px`,
            left: `${balloon.left}px`,
            top: `${balloon.top}px`,
          }}
          onClick={() => popBalloon(balloon.id)}
        />
      ))}


      {timeLeft === 0 && !gameActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-base-100 p-6 rounded-box text-center shadow-xl">
            <h2 className="text-2xl font-bold mb-2">¡Juego terminado!</h2>
            <p className="text-lg mb-4">
              Tu puntaje final: <span className="font-bold">{score}</span>
            </p>
            <button onClick={startGame} className="btn btn-primary">
              Jugar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;