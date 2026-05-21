  // ==========================================
//   ゲームバランス調整用パラメータ
// ==========================================
// --- ゲームバランス調整用 ---
const PARAMS = {
  gravity: 0.5,          // 重力（落下の加速速度）
  maxFallSpeed: 7,        // 最大落下速度（リミッター）
  friction: 0.99,         // 空気抵抗（はじいた後の減速比。1に近づくほど止まらない）
  tossPower: 1.0005,         // はじく強さの倍率
  bounceLimit: -0.1,      // 壁に当たった時の跳ね返り係数
  gameTime: 2,            // 制限時間（秒）
};

// おみくじの種類と報酬の設定
// ==========================================
//   おみくじの種類・報酬・画像設定
// ==========================================
const OMIKUJI_TYPES = {
  '大吉': { color: '#ff1111', goodPay: 50, badPay: 0,  image: '1.png' },
  '吉':   { color: '#ff8800', goodPay: 30, badPay: 5,  image: '2.png' },
  '中吉': { color: '#ffcc00', goodPay: 20, badPay: 10, image: '3.png' },
  '小吉': { color: '#88ff00', goodPay: 10, badPay: 20,  image: '4.png' },
  '末吉': { color: '#00ffcc', goodPay: 5, badPay: 25,  image: '5.png' },
  '凶':   { color: '#555555', goodPay: 0,  badPay: 30, image: '6.png' }
};
// アイテムデータ
// --- ゲームの状態・アイテムレベル (最大3) ---
// --- ゲームの状態管理（初期値を設定） ---
const gameState = {
  spawnInterval: 600, // 最初は1.2秒に1回
  spawnRateLevel: 0,
  moneyMultiplier: 1,

  itemLevels: {
    "spawn_up": 0,
    "spawn_down": 0,
    "money": 0,
    "luck_daikichi": 0,
    "luck_kichi": 0,
    "luck_kyo": 0,

  }
};
// アイテムリストを効果付きで更新

const ITEM_LIST =[
  { id: "spawn_up",   name: "降る量アップ", price: 15, image: "daikichi.jpg",mode: "all" },
  { id: "spawn_down", name: "降る量ダウン", price: 10, image: ".png" ,mode: "all"}, // 追加
  { id: "luck_daikichi", name: "大吉の加護", price: 30, image: "1.png" ,mode: "all"},
  { id: "luck_kichi",    name: "吉の加護",   price: 15, image: "2.png" ,mode: "all"},
  { id: "luck_kyo",      name: "凶の呪い",   price: 10, image: "6.png" ,mode: "all"},
  { id: "money",      name: "報酬アップ",   price: 20, image: "kin.png" ,mode: "all"},
  { id: "mission_skip", name: "任務スキップ", price: 100, image: "4.png", isOneTime: true ,mode: "endless"},
  { id: "auto_timer", name: "自動タイマー", price: 50, image: "3.png", isPassive: true ,mode: "endless"},
  { id: "auto_refresh", name: "自動更新", price: 70,image: "5.png", isPassive: true ,mode: "endless"},
];

// 購入済みフラグを保持する変数
let hasAutoTimer = false;
let hasAutoRefresh = false;
let moneyBufferForTimer = 0; // 30円をカウントするためのバッファ
// ゲームの状態管理（初期値を設定） ---
let isEndless = false;
let durability = 100;
let currentMission = null;
let missionTimer = 0;
let missionGoal = 0;
let missionProgress = 0;  

const MISSIONS = [
  { text: "「大吉」を入れろ",         type: "daikichi",  count: 2, time: 50 },
  { text: "「凶」を入れろ",           type: "kyo",       count: 2, time: 55 },
  { text: "「お金」を稼げ",          type: "money",     count: 15, time: 55 },
  {text: "「大吉」「凶」以外を入れろ",type: "not_special", count: 2, time: 53 },
  { text: "種類問わず入れろ",   type: "total_count", count: 5, time: 54 },
  {  text: "得する方に入れろ",     type: "side_check", count: 2, time: 55 },
  {  text: "ショップで買い物しろ", type: "shop_action", count: 1, time: 50 },
  {  text: "皿を10個以下で保て",   type: "keep_limit", count: 2,  time: 54 },
];
