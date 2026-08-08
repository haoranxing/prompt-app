const db = require('./db');

// Clear existing prompts
const clear = db.prepare('DELETE FROM prompts');
clear.run();

const insert = db.prepare(`
  INSERT INTO prompts (title, content, content_en, description, tips, category_id, platform, price_type, image, is_featured, view_count, author_id)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const prompts = [
  {
    title: '人物形象',
    content: '4K超高清商业肖像摄影，一位40岁左右的亚洲男士，五官轮廓分明、皮肤质感细腻自然，面带自信而温和的浅笑。他身穿剪裁合体的炭黑色精纺羊毛西服外套，内搭纯白尖领衬衫，系一条深海蓝色基底配以细密浅蓝斜条纹的丝质领带，领带结为温莎式，挺括有型。右手自然抬起，手指轻握右侧西服前襟翻领处，微微向外提拉，形成优雅的立体褶皱。背景为柔和的浅灰渐变无缝纸背景，主光源采用左侧45°高位柔光箱，辅以右侧反光板补光，营造出面部立体光影与眼部高光，眼神明亮有神。整体风格为高端商务形象照，画质细腻，细节锐利，电影级色调，8K渲染质感。',
    content_en: '4K ultra-high-definition commercial portrait photography, an Asian man around 40 years old, with well-defined facial features, naturally delicate skin texture, and a confident yet gentle smile. He wears a tailored charcoal-black fine wool suit jacket, a pure white pointed-collar shirt, and a deep-sea-blue silk tie with fine light-blue diagonal stripes, tied in a Windsor knot. His right hand is naturally raised, lightly gripping the right lapel of the suit, slightly pulling it outward to create elegant three-dimensional folds. The background is a soft light-gray gradient seamless paper. The overall style is high-end business portrait photography with cinematic color grading and 8K rendering quality.',
    description: '人物形象照',
    tips: '1. 所有带【】标记字段均可自定义修改，可更换年龄、性别、服装颜色、背景色调、光影氛围。\n2. 生成参数搭配建议：\n   • 分辨率：4K / 8K\n   • 渲染风格：写实、商务、电影级色调\n   • 画面强度：面部细节拉满，眼神光明显\n3. 适配工具范围：可用于文生图、AI 人像生成工具，海外工具粘贴英文版效果更佳。',
    category_id: 1,
    platform: 'Seedream',
    price_type: 'free',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    is_featured: 1
  },
  {
    title: '粽子微距世界小厨房创意摄影',
    content: '微距摄影，粽子内部的迷你厨房，温暖的灯光，细腻的食材纹理，8K高清，商业摄影风格',
    content_en: 'Macro photography, a miniature kitchen inside a zongzi, warm lighting, delicate food textures, 8K high definition, commercial photography style',
    description: '适用于食品创意摄影，可快速生成具有故事感的微距画面',
    tips: '1. 所有带【】标记字段均可自定义修改，可更换粽子口味、古风地域、光影冷暖、氛围（热血/治愈/静谧）。\n2. 生成参数搭配建议：\n   • 分辨率：8K\n   • 帧率：60fps（丝滑运镜）\n   • 渲染风格：微距实景、卡通、二次元\n   • 画面强度：细节拉满，光影真实度拉满\n3. 适配工具范围：可用于图生视频、文生短视频、AI 动画生成工具，国内工具粘贴中文，海外 AI 工具粘贴英文。',
    category_id: 1,
    platform: 'Seedance',
    price_type: 'free',
    image: 'https://images.unsplash.com/photo-1560159752-1a8a5a6e4c3a?w=600',
    is_featured: 1
  },
  {
    title: '第一视角骑行一次性看遍城市',
    content: '第一人称视角骑行视频，城市街道，晨光，运动相机风格，流畅稳定，4K',
    content_en: 'First-person perspective cycling video, city streets, morning light, action camera style, smooth and stable, 4K',
    description: '生成身临其境的城市骑行视频片段',
    tips: '1. 可替换城市、时间段（晨光/黄昏/夜景）、运动类型（骑行/跑步/滑板）。\n2. 生成参数搭配建议：\n   • 分辨率：4K\n   • 帧率：30fps / 60fps\n   • 渲染风格：运动相机、电影感、Vlog\n3. 适配工具范围：适合 Veo、Runway、Pika 等文生视频工具。',
    category_id: 4,
    platform: 'Veo',
    price_type: 'free',
    image: 'https://images.unsplash.com/photo-1544191696-102f7e7d35d3?w=600',
    is_featured: 1
  },
  {
    title: '水果边卡通人提示词模型',
    content: '草莓拟人化卡通形象，圆润可爱，大眼睛，田园风光背景，3D渲染，皮克斯风格',
    content_en: 'Strawberry anthropomorphic cartoon character, round and cute, big eyes, pastoral scenery background, 3D rendering, Pixar style',
    description: '适合IP形象、表情包、儿童内容创作',
    tips: '1. 可替换水果种类、卡通风格（皮克斯/泡泡玛特/二次元）、场景背景。\n2. 生成参数搭配建议：\n   • 分辨率：4K\n   • 渲染风格：3D 卡通、IP 形象、盲盒风\n3. 适配工具范围：Midjourney、Stable Diffusion、Seedream 等文生图工具。',
    category_id: 2,
    platform: 'Midjourney',
    price_type: 'free',
    image: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=600',
    is_featured: 0
  },
  {
    title: '地标建筑日出摄影',
    content: '埃菲尔铁塔日出，金色光线，长曝光，云层流动，专业风光摄影',
    content_en: 'Eiffel Tower at sunrise, golden light, long exposure, flowing clouds, professional landscape photography',
    description: '生成大气磅礴的地标建筑日出风光大片',
    tips: '1. 可替换地标建筑、时间段、天气氛围、构图角度。\n2. 生成参数搭配建议：\n   • 分辨率：8K\n   • 渲染风格：专业风光摄影、长曝光、电影色调\n3. 适配工具范围：Seedream、Midjourney、Flux 等文生图工具。',
    category_id: 1,
    platform: 'Seedream',
    price_type: 'free',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    is_featured: 0
  },
  {
    title: '东方古典+赛博故障风人像',
    content: '汉服少女，赛博朋克霓虹故障效果，古典与未来融合，电影海报构图',
    content_en: 'Hanfu girl, cyberpunk neon glitch effect, fusion of classical and future, movie poster composition',
    description: '打造强烈的视觉冲突，适合国潮与科幻结合题材',
    tips: '1. 可替换朝代服饰、霓虹色彩、故障强度、画面比例。\n2. 生成参数搭配建议：\n   • 分辨率：4K\n   • 渲染风格：赛博朋克、国潮、故障艺术\n3. 适配工具范围：Midjourney、Seedream、Stable Diffusion。',
    category_id: 5,
    platform: 'Seedream',
    price_type: 'vip',
    image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=600',
    is_featured: 1
  },
  {
    title: '彩虹动物泡泡玛特风卡通设计',
    content: '超可爱羊驼，马卡龙彩虹渐变毛发，泡泡玛特风格，3D卡通IP，圆润饱满',
    content_en: 'Super cute alpaca, macaron rainbow gradient fur, Pop Mart style, 3D cartoon IP, round and full',
    description: '适合潮玩IP、盲盒设计、文创产品',
    tips: '1. 可替换动物、渐变色系、潮玩风格、表情动作。\n2. 生成参数搭配建议：\n   • 分辨率：4K\n   • 渲染风格：泡泡玛特、3D IP、盲盒\n3. 适配工具范围：Seedream、Midjourney。',
    category_id: 2,
    platform: 'Seedream',
    price_type: 'free',
    image: 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=600',
    is_featured: 1
  }
];

const insertMany = db.transaction((items) => {
  for (const p of items) {
    insert.run(p.title, p.content, p.content_en, p.description, p.tips, p.category_id, p.platform, p.price_type, p.image, p.is_featured, 0, 1);
  }
});

insertMany(prompts);
console.log(`Seeded ${prompts.length} prompts.`);
