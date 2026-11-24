// Codex Resets 仪表盘：追踪 OpenAI Codex 额度重置公告（codex-resets.com）。
// 常驻 ES Module Worker 入口：宿主（Metrix.Bar）拉取式渲染，本模块只导出三个钩子。

import { refresh, launchRefresh, loading, state } from "./state.js";
import { trayTree, panelTree } from "./ui.js";

export default {
  // 定时刷新（refresh="2m"）；env.inputs.notifyEnabled 控制新公告提醒
  async scheduled(env) {
    await refresh(env);
  },

  render() {
    return { tray: trayTree(), panel: panelTree() };
  },

  event(name, payload) {
    // 面板展开超过 120s 未加载时补拉一次（避免展示陈旧数据）
    if (name === "lifecycle" && payload && payload.type === "expand" &&
        !loading() && Date.now() - state.lastLoadedAt > 120e3) launchRefresh();
  },
};
