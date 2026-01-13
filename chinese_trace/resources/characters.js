/**
 * Chinese character set grouped by difficulty levels.
 */
const charactersByLevel = {
  easy: [
    // Numbers & Basic
    '一', '二', '三', '十', '八', '九', '七', '六', '五', '四',
    // Nature & Basic Concepts
    '人', '口', '大', '小', '上', '下', '中', '天', '日', '月', '火', '水', '土', '山', '石', '木',
    // Directions & People
    '工', '子', '女', '父', '母'
  ],
  medium: [
    // Numbers & Body Parts
    '百', '千', '万', '手', '足', '目', '耳', '头', '心', '牙', '舌',
    // Nature & Directions
    '地', '星', '云', '风', '田', '禾', '左', '右', '前', '后', '东', '西', '南', '北', '里', '外',
    // Plants & Animals
    '牛', '羊', '马', '鸟', '鱼', '虫', '草', '花', '叶', '瓜', '果',
    // Basic Concepts & Actions
    '多', '少', '长', '短', '开', '关', '出', '入', '来', '去', '立', '走', '见'
  ],
  difficulty: [
    // More complex structures
    '雨', '雪', '高', '低', '坐', '跑', '飞', '问', '说', '读', '写',
    '的', '了', '是', '不', '我', '你', '他', '她', '它', '们', '也', '都',
    '农', '老', '少'
  ]
};

// For backward compatibility if needed, but we'll update trace.js
const characters = [
  ...charactersByLevel.easy,
  ...charactersByLevel.medium,
  ...charactersByLevel.difficulty
];
