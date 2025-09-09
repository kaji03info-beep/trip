import React, { useMemo, useState } from "react";

// 単一ファイルの簡易ページ。
// ・日本語/英語併記
// ・検索フィルタ
// ・各スポットはワンクリックで Google Maps 検索を開く
// ・モバイル最適化（Tailwind 利用）

const DATA = [
  {
    regionJa: "ロサンゼルス",
    regionEn: "Los Angeles",
    groups: [
      { nameJa: "チャイニーズシアター", nameEn: "TCL Chinese Theatre" },
      { nameJa: "ハリウッドサイン", nameEn: "Hollywood Sign" },
      { nameJa: "オリジナルファーマーズマーケット", nameEn: "The Original Farmers Market" },
      { nameJa: "メルローズ", nameEn: "Melrose" },
      { nameJa: "リトルトーキョー", nameEn: "Little Tokyo" },
      { nameJa: "オールドパサディナ", nameEn: "Old Pasadena" },
      { nameJa: "グラミー博物館", nameEn: "GRAMMY Museum" },
    ],
  },
  {
    regionJa: "マリブ",
    regionEn: "Malibu",
    groups: [
      { nameJa: "ビーチ", nameEn: "Beaches" },
      { nameJa: "Becker Surfboards(サーフショップ)", nameEn: "Becker Surfboards" },
      { nameJa: "Adamson House & the Malibu Lagoon Museum(家)", nameEn: "Adamson House & Malibu Lagoon Museum" },
      { nameJa: "The Getty Villa(美術館)", nameEn: "The Getty Villa" },
    ],
  },
  {
    regionJa: "サンタバーバラ",
    regionEn: "Santa Barbara",
    groups: [
      { nameJa: "ミッション・サンタバーバラ(礼拝堂)", nameEn: "Old Mission Santa Barbara" },
      { nameJa: "サンタバーバラ裁判所", nameEn: "Santa Barbara County Courthouse" },
      { nameJa: "ダウンタウン", nameEn: "Downtown" },
      { nameJa: "ファンクゾーン", nameEn: "Funk Zone" },
    ],
  },
  {
    regionJa: "サンルイスオビスポ",
    regionEn: "San Luis Obispo",
    groups: [
      { nameJa: "エドナ・バレー・ヴィンヤード(ワイナリー)", nameEn: "Edna Valley Vineyard" },
      { nameJa: "バブルガムアレイ(ガムの壁画)", nameEn: "Bubblegum Alley" },
      { nameJa: "ファーマーズマーケット(歩行者天国) ※木曜 18–21時のみ", nameEn: "Downtown SLO Farmers' Market (Thu evenings)" },
      { nameJa: "ビショップ・ピーク(山脈)", nameEn: "Bishop Peak" },
      { nameJa: "タップ・イット・ブルーイング・カンパニー(ビール工場)", nameEn: "Tap It Brewing Company" },
      { nameJa: "貯水池キャニオントレイル(滝)", nameEn: "Reservoir Canyon Trail" },
    ],
  },
  {
    regionJa: "モロベイ",
    regionEn: "Morro Bay",
    groups: [
      { nameJa: "モロビーチ(港)", nameEn: "Morro Bay / Morro Beach" },
      { nameJa: "モロロック(岩)", nameEn: "Morro Rock" },
      { nameJa: "カリフォルニア州道1号線", nameEn: "California State Route 1" },
    ],
  },
  {
    regionJa: "ビッグサー",
    regionEn: "Big Sur",
    groups: [
      { nameJa: "ハイウェイ", nameEn: "Highway 1 Scenic Drive" },
      { nameJa: "マクウェイ滝(ハイキング)", nameEn: "McWay Falls" },
      { nameJa: "ファイファービーチ", nameEn: "Pfeiffer Beach" },
      { nameJa: "ジュリア・フェイファー・バーンズ州立公園(ビーチ)", nameEn: "Julia Pfeiffer Burns State Park" },
      { nameJa: "Bixby Bridge(橋)", nameEn: "Bixby Creek Bridge" },
    ],
  },
  {
    regionJa: "モントレー",
    regionEn: "Monterey",
    groups: [
      { nameJa: "モントレーベイ水族館", nameEn: "Monterey Bay Aquarium" },
      { nameJa: "17マイルドライブ(ドライブの道)", nameEn: "17-Mile Drive" },
      { nameJa: "ホエールウォッチング", nameEn: "Whale Watching" },
    ],
  },
  {
    regionJa: "カーメル・バイ・ザ・シー",
    regionEn: "Carmel-by-the-Sea",
    groups: [
      { nameJa: "信号がない街", nameEn: "No Traffic Lights Town" },
      { nameJa: "童話の街", nameEn: "Fairy-tale Cottages" },
    ],
  },
  {
    regionJa: "サンタクルーズ",
    regionEn: "Santa Cruz",
    groups: [
      { nameJa: "ビーチ", nameEn: "Beaches" },
    ],
  },
  {
    regionJa: "サンフランシスコ",
    regionEn: "San Francisco",
    groups: [
      { nameJa: "ゴールデンゲートブリッジ", nameEn: "Golden Gate Bridge" },
      { nameJa: "アルカトラズ島", nameEn: "Alcatraz Island" },
      { nameJa: "ピア39(アシカが寝てるスーパー)", nameEn: "PIER 39 (sea lions)" },
      { nameJa: "アラモ スクエア(フルハウスロケ地の家)", nameEn: "Alamo Square (Painted Ladies)" },
      { nameJa: "ツインピークス(夜景スポット)", nameEn: "Twin Peaks" },
      { nameJa: "パレス・オブ・ファイン・アーツ(フォレストガンプのロケ地)", nameEn: "Palace of Fine Arts" },
      { nameJa: "ウォルト・ディズニー・ファミリー博物館", nameEn: "Walt Disney Family Museum" },
      { nameJa: "カリフォルニア科学アカデミー(世界最大級の自然博物館)", nameEn: "California Academy of Sciences" },
      { nameJa: "聖ピーター＆ポール教会(天使にラブソングを2の舞台)", nameEn: "Saints Peter and Paul Church" },
      { nameJa: "グレース大聖堂(教会)", nameEn: "Grace Cathedral" },
      { nameJa: "ジャパンタウン(日本食)", nameEn: "Japantown" },
      { nameJa: "アンカー醸造所(ビール)", nameEn: "Anchor Brewing" },
      { nameJa: "サンフランシスコ近代美術館", nameEn: "SFMOMA" },
      { nameJa: "ベイカービーチ", nameEn: "Baker Beach" },
      { nameJa: "サンフランシスコ動物園", nameEn: "San Francisco Zoo" },
    ],
  },
  {
    regionJa: "サウサリート",
    regionEn: "Sausalito",
    groups: [
      { nameJa: "ハウスボート(ヒッピーが作ったコミューン)", nameEn: "Houseboats" },
      { nameJa: "リゾート地", nameEn: "Resort Town" },
    ],
  },
  {
    regionJa: "バデガベイ",
    regionEn: "Bodega Bay",
    groups: [
      { nameJa: "ソノマジプラインアドベンチャー(アクティビティ)", nameEn: "Sonoma Zipline Adventures" },
      { nameJa: "ホエールウォッチ", nameEn: "Whale Watching" },
    ],
  },
  {
    regionJa: "メンドシーノ",
    regionEn: "Mendocino",
    groups: [
      { nameJa: "19世紀の街並み", nameEn: "19th-century Townscape" },
      { nameJa: "カリフォルニアワインの産地", nameEn: "Wine Country" },
      { nameJa: "カヌー体験", nameEn: "Canoeing" },
    ],
  },
  {
    regionJa: "ユーレカ",
    regionEn: "Eureka",
    groups: [
      { nameJa: "カーソンマンション(建築物)", nameEn: "Carson Mansion" },
      { nameJa: "Sequoia Park(動物園)", nameEn: "Sequoia Park Zoo" },
    ],
  },
  // Oregon
  {
    regionJa: "ブルッキングズ",
    regionEn: "Brookings (Oregon)",
    groups: [
      { nameJa: "ハリスビーチ", nameEn: "Harris Beach" },
      { nameJa: "シークレットビーチ", nameEn: "Secret Beach" },
    ],
  },
  {
    regionJa: "ゴールドビーチ",
    regionEn: "Gold Beach (Oregon)",
    groups: [
      { nameJa: "アイザックリーパターン橋", nameEn: "Isaac Lee Patterson Bridge" },
      { nameJa: "マルトノマ滝", nameEn: "Multnomah Falls (far)" },
      { nameJa: "クレイターレイク国立公園", nameEn: "Crater Lake National Park (inland)" },
    ],
  },
  {
    regionJa: "バンドン",
    regionEn: "Bandon (Oregon)",
    groups: [
      { nameJa: "ゴルフの名所", nameEn: "Golf Destination" },
      { nameJa: "フェイスロック(岩)", nameEn: "Face Rock" },
    ],
  },
  {
    regionJa: "クーズベイ",
    regionEn: "Coos Bay (Oregon)",
    groups: [
      { nameJa: "コース歴史博物館", nameEn: "Coos History Museum" },
      { nameJa: "クースアートミュージアム", nameEn: "Coos Art Museum" },
      { nameJa: "クースベイ(ビーチ)", nameEn: "Coos Bay / Beaches" },
      { nameJa: "マッカロウ記念橋", nameEn: "McCullough Memorial Bridge" },
      { nameJa: "スリーリバーズカジノ", nameEn: "Three Rivers Casino" },
      { nameJa: "ケープ・アラゴ灯台(展望台)", nameEn: "Cape Arago Lighthouse" },
      { nameJa: "ミンガスパークプール", nameEn: "Mingus Park Pool" },
      { nameJa: "エンパイア湖", nameEn: "Empire Lakes" },
      { nameJa: "ミッドウェイRVパーク(キャンプ場)", nameEn: "Midway RV Park" },
    ],
  },
  {
    regionJa: "フローレンス",
    regionEn: "Florence (Oregon)",
    groups: [
      { nameJa: "シーライオンケイブ(洞窟)", nameEn: "Sea Lion Caves" },
      { nameJa: "シアスロー川橋", nameEn: "Siuslaw River Bridge" },
      { nameJa: "John Dellenback Dunes Trail(砂漠)", nameEn: "John Dellenback Dunes Trail" },
    ],
  },
  {
    regionJa: "ニューポート",
    regionEn: "Newport (Oregon)",
    groups: [
      { nameJa: "ヤキナヘット特別自然地区(海岸線)", nameEn: "Yaquina Head Outstanding Natural Area" },
      { nameJa: "パーペチュア岬(潮溜り)", nameEn: "Cape Perpetua (tide pools)" },
      { nameJa: "オレゴンコースト水族館", nameEn: "Oregon Coast Aquarium" },
    ],
  },
  {
    regionJa: "リンカーンシティ",
    regionEn: "Lincoln City (Oregon)",
    groups: [
      { nameJa: "リンカーンシティアウトレット", nameEn: "Lincoln City Outlets" },
      { nameJa: "リンカーンシティグラスセンター(ガラス工房)", nameEn: "Lincoln City Glass Center" },
    ],
  },
  {
    regionJa: "ティラムック",
    regionEn: "Tillamook (Oregon)",
    groups: [
      { nameJa: "Tillamook(チーズ)", nameEn: "Tillamook Creamery" },
      { nameJa: "牧場", nameEn: "Dairy Farms" },
    ],
  },
  {
    regionJa: "シーサイド",
    regionEn: "Seaside (Oregon)",
    groups: [
      { nameJa: "Lewis & Clark Salt Works(建物)", nameEn: "Lewis & Clark Salt Works" },
      { nameJa: "Camp 18 Logging Museum(博物館)", nameEn: "Camp 18 Logging Museum" },
      { nameJa: "シーサイドビーチ", nameEn: "Seaside Beach" },
    ],
  },
  {
    regionJa: "キャノンビーチ",
    regionEn: "Cannon Beach (Oregon)",
    groups: [
      { nameJa: "ヘイスタロック(岩)", nameEn: "Haystack Rock" },
    ],
  },
  {
    regionJa: "アストリア",
    regionEn: "Astoria (Oregon)",
    groups: [
      { nameJa: "オレゴンフィルムミュージアム(ザ グーニーズの舞台)", nameEn: "Oregon Film Museum" },
      { nameJa: "ジョン・ジェイコブ・アスター小学校(キンダーガートン・コップの舞台)", nameEn: "John Jacob Astor Elementary School" },
    ],
  },
  // Washington
  {
    regionJa: "ロングビュー",
    regionEn: "Longview (Washington)",
    groups: [
      { nameJa: "和光市の姉妹都市", nameEn: "Sister city of Wakō, Saitama" },
      { nameJa: "エイプケイブ(洞窟)", nameEn: "Ape Cave" },
      { nameJa: "トライアングルボウリング場(ボウリング場)", nameEn: "Triangle Bowl" },
    ],
  },
  {
    regionJa: "オリンピア",
    regionEn: "Olympia (Washington)",
    groups: [
      { nameJa: "ワシントン州議会議事堂", nameEn: "Washington State Capitol" },
      { nameJa: "ニスカリーデルタ(自然保護地区)", nameEn: "Nisqually National Wildlife Refuge" },
    ],
  },
  {
    regionJa: "タコマ",
    regionEn: "Tacoma (Washington)",
    groups: [
      { nameJa: "チフーリ・ガーデン＆ガラス美術館", nameEn: "Chihuly Bridge of Glass / Museum of Glass" },
      { nameJa: "タコマ美術館", nameEn: "Tacoma Art Museum" },
      { nameJa: "ワシントン州歴史博物館", nameEn: "Washington State History Museum" },
      { nameJa: "ブリッジ・オブ・グラス(歩行者専用ガラス橋)", nameEn: "Bridge of Glass" },
      { nameJa: "プロクター地区(ショップエリア)", nameEn: "Proctor District" },
      { nameJa: "ファイブ・マイル・ドライブ(ドライブルート)", nameEn: "Five Mile Drive" },
    ],
  },
  {
    regionJa: "シアトル",
    regionEn: "Seattle (Washington)",
    groups: [
      { nameJa: "ケリー・パーク(高級住宅街)", nameEn: "Kerry Park" },
      { nameJa: "Amazon go(無人コンビニ)", nameEn: "Amazon Go" },
      { nameJa: "ポップカルチャー博物館", nameEn: "Museum of Pop Culture (MoPOP)" },
      { nameJa: "スペースニードル(展望台)", nameEn: "Space Needle" },
      { nameJa: "スタバ1号店", nameEn: "Original Starbucks (Pike Place)" },
    ],
  },
];

function Section({ regionJa, regionEn, groups, query }: any) {
  const filtered = useMemo(() => {
    if (!query) return groups;
    const q = query.toLowerCase();
    return groups.filter((g: any) =>
      [g.nameJa, g.nameEn].some((t: string) => t?.toLowerCase().includes(q))
    );
  }, [groups, query]);

  if (filtered.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight">
        <span className="mr-2">{regionJa}</span>
        <span className="text-sm sm:text-base opacity-70">({regionEn})</span>
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((g: any, idx: number) => (
          <div key={idx} className="p-4 rounded-2xl shadow hover:shadow-md transition bg-white border border-gray-100 flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold leading-tight">{g.nameJa}</div>
              <div className="text-xs opacity-70">{g.nameEn}</div>
            </div>
            <button
              className="text-xs sm:text-sm px-3 py-1.5 rounded-full border hover:bg-gray-50"
              onClick={() => {
                const q = encodeURIComponent(`${g.nameEn || g.nameJa} ${regionEn}`);
                window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
              }}
            >
              地図で開く
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TripSimplePage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-lg sm:text-xl font-bold">LA → Seattle 旅程スポット</span>
          <span className="ml-auto text-xs opacity-60">軽量・単一ページ / JP+EN</span>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="スポット名を検索 (例: ハリウッド / aquarium / bridge)"
            className="w-full rounded-xl border px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <div className="mt-1 text-[10px] opacity-60">各カードの「地図で開く」→ Google Maps 検索を新規タブで表示します。</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {DATA.map((sec, i) => (
          <Section key={i} {...sec} query={query} />
        ))}

        <footer className="mt-12 text-xs opacity-70 pb-8">
          <p>※ 表記は簡易ガイドです。営業時間・イベント時間などは現地の最新情報をご確認ください。</p>
        </footer>
      </main>
    </div>
  );
}
