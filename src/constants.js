// 风格与尺寸常量（唯一定义处，build.mjs 打包进 .bar）。

export const C = {
  PAPER: "#fff4dd",  // 整体背景
  CARD: "#fffdf7",    // 卡片底色
  INK: "#26201a",     // 主文字色
  ACCENT: "#ff5c2b",  // 强调橙（常规重置）
  SUN: "#ffd84d",     // 太阳黄
  ROSE: "#ffb9cc",    // 玫瑰粉
  SKY: "#a5dcff",     // 天空蓝
  PEACH: "#ffb07a",   // 蜜桃（备用额度）
  MUTED: "#8a7a63",   // 低饱和辅助文字
  TILE: "#f1e6c8",    // 日历无重置日底色（低饱和）
  LINE: "#e8d9b0",    // 次级描边
  HOVER: "#f3e9cf",   // 悬停底色
  TODAY: "#b9a883",   // 日历"今天"标记描边（低对比，不抢眼）
  HAIR: "#f0e4c6",    // 极浅描边（白卡在奶油底上勾个边）
};

export const W = 380;
export const H = 600;

export const API = "https://codex-resets.com/api/v1";

// 分享态截图高度：常规面板 600 + Scroll 会裁内容，切 Column 溢出渲染后
// 内容实测 722 DIP（标题→页脚），取 722 正好贴合，底部不会露出系统灰底。
export const SHOT_HEIGHT = 722;

// 公告固定展示条数，其余引导官网查看完整归档。
export const FEED_COUNT = 3;
