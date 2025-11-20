import { useState } from "react";
import "./index.css";
import LoadingScreen from "./LoadingScreen";
import logo from "./assets/logo.png"; // путь относительно App.tsx

interface UniqueData {
  ip: string;
  device: string;
  isp: string;
  country: string;
  city: string;
  user_agent: string;
}

export default function App() {
  const [data, setData] = useState<UniqueData | null>(null);
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const [showLoader, setShowLoader] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function refresh() {
  setShowLoader(true);
  setData(null);
  setVisibleFields([]);

  const result = await fetch(`${API_URL}/unique`);
  const json = await result.json();

  setData(json); // сразу сохраняем данные

  // показываем поля по анимации
  Object.keys(json).forEach((key, i) => {
    setTimeout(() => {
      setVisibleFields((prev) => [...prev, key]);
    }, 250 * i);
  });

  // показываем лоадер поверх
  setShowLoader(true);
}


  if (showLoader) {
    return <LoadingScreen onComplete={() => setShowLoader(false)} />;
  }

  return (
    <div className="app-wrapper">
        <img src={logo} alt="Logo" className={`background-logo ${data ? "center-logo" : "lower-logo"}`} />
        <h1 className="title">Уникализатор устройства</h1>
      <p className="subtitle">Система подмены ключевых параметров устройства.</p>


      <div className="card">
      

        {data && (
          <div className="field-list">
            {Object.entries(data).map(([key, value]) =>
              visibleFields.includes(key) ? (
                <div className="field animate" key={key}>
                  <div className="field-key">{key}</div>
                  <div className="field-value">{value}</div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      <button className="action-btn" onClick={refresh}>
        Обновить данные
      </button>
    </div>
  );
}
