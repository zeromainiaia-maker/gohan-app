import { useState } from "react";

const shops = [
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
      {shop.name} ({shop.genre}/
      {shop.distance < 1000 ? shop.distance + "m" : shop.distance / 1000 + "km"}
      /{shop.rating.toFixed(1)}/{shop.hours})
    </li>
  );
}

function ShopDetail({ shop }) {
  return (
    <div>
      <h2>{shop.name}</h2>
      <p>ジャンル：{shop.genre}</p>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("start");
  const [selectedShop, setSelectedShop] = useState(null);
  return (
    <div>
      <h1>ごはん探し</h1>
      {screen === "start" && (
        <button onClick={() => setScreen("list")}>検索</button>
      )}
      {screen === "list" && (
        <>
          <button onClick={() => setScreen("start")}>戻る</button>
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
