# Codex Resets Bar

Codex 额度什么时候重置，你不用再盯着官网刷新。

一个常驻菜单栏的 [Metrix.Bar](https://metrix.bar) 看板，盯着 OpenAI Codex 的重置公告，一有新动静就告诉你。

[English](README.md)

## 安装

**下载后打开** —— 点击 [`codex-resets.bar`](https://cdn.jsdelivr.net/gh/0tt0/codex-resets-bar@v0.1.1/codex-resets.bar)，再打开下载好的文件。Metrix.Bar 已关联 `.bar` 文件类型，打开即进入导入确认。

**直连导入链接** —— 把下面这行粘到浏览器地址栏：

```text
metrixbar://install?url=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2F0tt0%2Fcodex-resets-bar%40v0.1.1%2Fcodex-resets.bar&sha256=073339c4e820d96ce23eb2726d10e2758d24f90e58e8d15e220c9c7dd014d3bd
```

GitHub 渲染 Markdown 时会剥离自定义协议，所以这里以可复制的文本给出。两种方式都不经过注册表。

## 它能帮你做什么

- **一眼知道上次重置过去多久** —— 大号相对时间配精确时间戳，可切换本地时间与 UTC。
- **分清是哪一种重置** —— 常规重置和备用额度用不同标签标出，不用再猜。
- **看到节奏，而不只是最新一次** —— 近四个月的日历热力图，一眼看出重置频率。
- **顺手了解当前进度** —— 近 30 天次数、平均间隔、距上次天数。
- **提醒不会误报** —— 新公告出现才发通知和 toast；刚装完不会蹦出一条过期的。
- **分享不用自己截图** —— 点一下就把面板截图复制到剪贴板。

## 网络出问题时

刷新失败会保留上一次成功的数据，并给出重试入口，不会因为一次网络抖动就变成空面板。请求直连 `codex-resets.com`，本机需要能访问该域名。

## 配置

只有一个开关，在面板设置里：**新重置提醒**，默认开启。其余都是刻意的固定选择——每 2 分钟刷新、只展示最近 3 条公告，并给出完整归档的入口。

## 数据从哪来

[codex-resets.com](https://codex-resets.com) 提供公开 API，本看板读取其中的 `/status` 与 `/resets`，并回链到该站。本项目与 **codex-resets.com、OpenAI 均无隶属关系**。

## 许可

[Apache-2.0](LICENSE)。Vue 运行时在启动时从 jsDelivr 加载，不随本仓库分发，仍适用其 MIT 协议。「OpenAI」「Codex」为 OpenAI 商标，此处仅用于标识本看板所监控的服务。
