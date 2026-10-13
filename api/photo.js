export async function GET(request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  // 写真の名前の形をチェック（関係ない使われ方を防ぐ）
  if (!name || !/^places\/[^/]+\/photos\/[^/]+$/.test(name)) {
    return Response.json({ error: "name が正しくありません" }, { status: 400 });
  }

  // Google に「この写真のURLを教えて」と頼む
  const response = await fetch(
    `https://places.googleapis.com/v1/${name}/media?maxWidthPx=600&skipHttpRedirect=true`,
    { headers: { "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY } },
  );
  const data = await response.json();

  if (!response.ok) {
    console.error("Photo API error:", data);
    return Response.json(
      { error: "写真の取得に失敗しました" },
      { status: 502 },
    );
  }

  // キーなしで見られる画像URLへ、ブラウザを転送する
  return Response.redirect(data.photoUri, 302);
}
