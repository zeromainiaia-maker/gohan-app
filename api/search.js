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
        "X-Goog-FieldMask": "places.id,places.displayName", // まずは2項目だけ
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

  // ③ Google の返事をそのまま返す（まずは中身を見るため）
  const data = await response.json();
  return Response.json(data);
}
