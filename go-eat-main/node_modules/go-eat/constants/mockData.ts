export const STORES = [
  { id: 1, name: "阿公手工糯米腸", cat: "夜市小吃", rate: 4.9, dist: "300m", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800", status: "營業中", price: "$60", tags: ["排隊名店", "純手工"] },
  { id: 2, name: "極致厚切豬排", cat: "日式料理", rate: 4.7, dist: "1.2km", img: "https://images.unsplash.com/photo-1591814447921-7cf7a5c6adbc?q=80&w=800", status: "即將休息", price: "$220", tags: ["大份量"] },
  { id: 3, name: "晨曦手作蛋餅", cat: "早午餐", rate: 4.8, dist: "500m", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800", status: "今日公休", price: "$45", tags: ["酥脆"] },
];

export const KOLS = [
  {
    id: 1,
    name: "美食水水 Angel",
    bio: "台北夜市女王 · 口袋名單最多人追蹤",
    followers: "12萬",
    postCount: 320,
    avgRate: "4.9",
    category: "夜市",
    verified: true,
    pick: "饒河街最強臭豆腐，外酥內嫩沒有之一",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
    recommendedStores: ["饒河臭豆腐", "花枝羹老店", "胡椒餅排隊王"],
  },
  {
    id: 2,
    name: "大胃王傑克",
    bio: "日式料理控 · 每週至少吃三家新店",
    followers: "8萬",
    postCount: 210,
    avgRate: "4.7",
    category: "日式",
    verified: true,
    pick: "這家肉圓我給100分，皮Q內嫩完全不油膩",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400",
    recommendedStores: ["極致厚切豬排", "海膽丼飯專門", "炸物天堂"],
  },
  {
    id: 3,
    name: "早午餐控 Mia",
    bio: "Brunch 成癮者 · 找遍台北最美早午餐",
    followers: "5.6萬",
    postCount: 180,
    avgRate: "4.8",
    category: "早午餐",
    verified: false,
    pick: "這間隱藏在民生社區的早午餐，週末一定大排長龍",
    img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400",
    recommendedStores: ["晨曦手作蛋餅", "法式吐司工坊", "北歐風咖啡廳"],
  },
];

export const POSTS = [
  { id: 1, user: "隱藏美食家", text: "昨天去吃了這家，隱藏在巷弄裡的味道...", img: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=500", likes: 342 },
  { id: 2, user: "天天外食族", text: "CP值超高，學生黨必看！", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500", likes: 128 },
];