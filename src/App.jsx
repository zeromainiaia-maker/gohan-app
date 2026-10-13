import { useState } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";

const FAKE_SHOPS = [
  {
    id: 1,
    name: "らーめん太郎",
    genre: "ラーメン",
    distance: 250,
    rating: 4.2,
    hours: "11:00〜22:00",
  },
  {
    id: 2,
    name: "寿司まる",
    genre: "寿司",
    distance: 600,
    rating: 4.5,
    hours: "17:00〜23:00",
  },
  {
    id: 3,
    name: "カレー屋インド",
    genre: "カレー",
    distance: 1200,
    rating: 3.8,
    hours: "11:30〜21:00",
  },
  {
    id: 4,
    name: "カレー屋山下",
    genre: "カレー",
    distance: 20000,
    rating: 5.0,
    hours: "00:00〜23:59",
  },
];

const NAGOYA_STATION = { lat: 35.1709, lng: 136.8815 };

function ShopList({ shops, onSelect }) {
  return (
    <ul>
      {shops.map((shop) => (
        <ShopItem key={shop.id} shop={shop} onSelect={onSelect} />
      ))}
    </ul>
  );
}

function ShopItem({ shop, onSelect }) {
  return (
    <li onClick={() => onSelect(shop)}>
      {shop.name}（{shop.genre}／
      {shop.distance < 1000
        ? shop.distance + "m"
        : (shop.distance / 1000).toFixed(1) + "km"}
      ／⭐{shop.rating?.toFixed(1) ?? "評価なし"}／
      {shop.openNow ? "営業中" : "営業時間外"}）
    </li>
  );
}

function ShopMap({ lat, lng }) {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        style={{ width: "100%", height: "250px" }}
        defaultCenter={{ lat, lng }}
        defaultZoom={17}
        mapId="DEMO_MAP_ID"
        disableDefaultUI
      >
        <AdvancedMarker position={{ lat, lng }} />
      </GoogleMap>
    </APIProvider>
  );
}

function ShopDetail({ shop }) {
  return (
    <div>
      <h2>{shop.name}</h2>
      <p>ジャンル：{shop.genre}</p>
      <ul>
        {shop.hours.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {shop.photoName && (
        <img
          src={`/api/photo?name=${encodeURIComponent(shop.photoName)}`}
          alt={shop.name}
          style={{ width: "100%" }}
        />
      )}
      <a href={shop.mapUrl} target="_blank" rel="noreferrer">
        Googleマップで開く
      </a>
      <ShopMap lat={shop.lat} lng={shop.lng} />
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("start");
  const [selectedShop, setSelectedShop] = useState(null);
  const [location, setLocation] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function searchAt(lat, lng, isDefault) {
    setLocation({ lat, lng, isDefault });
    try {
      const response = await fetch(`/api/search?lat=${lat}&lng=${lng}`);
      if (!response.ok) {
        throw new Error("サーバーエラー: " + response.status);
      }
      const data = await response.json();
      setShops(data.shops ?? []);
      setScreen("list");
    } catch (e) {
      console.error(e);
      setError(
        "通信エラーが発生しました。電波の良い場所でもう一度お試しください。",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) =>
        searchAt(position.coords.latitude, position.coords.longitude, false), // 成功：本当の現在地
      () => searchAt(NAGOYA_STATION.lat, NAGOYA_STATION.lng, true), // 失敗：名古屋駅
      { timeout: 10000 },
    );
  }

  return (
    <div>
      <h1>近くのごはん探し</h1>
      {screen === "start" && (
        <>
          {error && <p>{error}</p>}
          {loading ? (
            <div className="spinner" />
          ) : (
            <button onClick={handleSearch}>検索</button>
          )}
        </>
      )}

      {screen === "list" && (
        <>
          <button onClick={() => setScreen("start")}>戻る</button>
          {location.isDefault && (
            <p>
              現在地を取得できなかったため、名古屋駅周辺を表示しています（
              iPhone の設定 → プライバシー →
              位置情報サービスを確認してください）{" "}
            </p>
          )}
          <p>
            現在地：{location.lat}, {location.lng}
          </p>
          {shops.length === 0 && <p>近くにお店が見つかりませんでした</p>}
          <ShopList
            shops={shops}
            onSelect={(shop) => {
              setSelectedShop(shop);
              setScreen("detail");
            }}
          />
        </>
      )}
      {screen === "detail" && (
        <>
          <button onClick={() => setScreen("list")}>戻る</button>
          <ShopDetail shop={selectedShop} />
        </>
      )}
    </div>
  );
}

export default App;
