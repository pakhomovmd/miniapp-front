import { useEffect, useState } from "react";
import "./index.css";

const steps = [
  "Инициализация системы...",
  "Сканирование устройства...",
  "Анализ fingerprint данных...",
  "Подмена IP хеша...",
  "Подмена Device-ID...",
  "Подмена User-Agent...",
  "Генерация сигнатуры...",
  "Применение маскировки...",
  "Завершение... ",
];

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const runStep = (i: number) => {
      if (cancelled) return;

      if (i >= steps.length) {
        setTimeout(onComplete, 500);
        return;
      }

      setCurrentStep(i);

      // случайная задержка между 1 и 3 секундами
      const delay = 1000 + Math.random() * 3000; 

      setTimeout(() => {
        runStep(i + 1);
      }, delay);
    };

    runStep(0);

    return () => {
      cancelled = true; // отменяем таймер при размонтировании
    };
  }, []);

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="loading-wrapper">
      <div className="loading-card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="loading-text">{steps[currentStep]}</div>

        <div className="terminal-window">
          {steps.slice(0, currentStep + 1).map((line, idx) => (
            <div key={idx} className="terminal-line">
              {"> "}
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
