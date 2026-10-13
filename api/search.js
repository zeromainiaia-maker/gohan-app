// 2点間の距離（メートル）を計算する
function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // 地球の半径（m）
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export async function GET(request) {
  // ① URL の ?lat=..&lng=.. を読み取る
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));

  // ② Google Places API に問い合わせる
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY, // 環境変数から読む
        "X-Goog-FieldMask": [
          "places.id",
          "places.displayName",
          "places.primaryTypeDisplayName", // ジャンル（例：ラーメン店）
          "places.location", // 緯度経度（距離の計算に使う）
          "places.rating", // 評価
          "places.currentOpeningHours.openNow", // 今営業中か
          "places.regularOpeningHours.weekdayDescriptions", // 曜日ごとの営業時間
          "places.googleMapsUri", // 「Googleマップで開く」用のURL
        ].join(","),
      },
      body: JSON.stringify({
        includedTypes: ["restaurant"], // 飲食店だけ
        maxResultCount: 10, // 最大10件
        rankPreference: "DISTANCE", // 近い順
        languageCode: "ja", // 日本語で
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 1000, // 半径1000m
          },
        },
      }),
    },
  );

  const data = await response.json();

  const shops = (data.places ?? []).map((place) => ({
    id: place.id,
    name: place.displayName?.text,
    genre: place.primaryTypeDisplayName?.text, // ← ジャンルの文字
    distance: calcDistance(
      lat,
      lng,
      place.location.latitude,
      place.location.longitude,
    ),
    rating: place.rating, // ← 評価
    openNow: place.currentOpeningHours?.openNow,
    hours: place.regularOpeningHours?.weekdayDescriptions ?? [],
    mapUrl: place.googleMapsUri,
  }));

  return Response.json({ shops });
}
