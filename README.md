# dsh-reply-nav

**让长对话，变成一条可导航的时间线。**

[English README](./README.en.md)

![dsh-reply-nav live demo](./assets/reply-nav-demo.gif)

在 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的长对话右侧，按**用户回合**显示导航条：悬停即可预览显式回复，点击即可跳转。工具调用再多，也不会把一个回合拆成一堆难以定位的步骤。

## 为什么值得用

- **一条横杠 = 一轮对话**：按用户消息导航，而不是按工具拆分的 assistant step 导航
- **悬停即预览**：显示渲染后的 Markdown 回复，快速判断这一轮是否值得回看
- **点击即跳转**：滚动到对应回合，当前回合自动高亮
- **轻量且无侵入**：纯客户端、无后端、无构建步骤，跟随 DSH 主题

## 30 秒安装

```powershell
git clone https://github.com/nicolas-zhao-4/dsh-reply-nav.git
cd dsh-reply-nav
powershell -ExecutionPolicy Bypass -File ./install.ps1
```

刷新 DSH Web 页面即可。Linux/macOS 使用 `./install.sh`。

## 安装方式

### 一键脚本（推荐）

脚本会把插件复制到 `<profile>/node_modules/`，并幂等地写入 `cordis.patch.yml`。默认 profile 为 `web`。

### 手动安装

将 `package.json` 和 `lib/` 复制到 `~/.dsh/profiles/<profile>/node_modules/dsh-reply-nav/`，然后在 `cordis.patch.yml` 添加：

```yaml
- insert:
    - id: reply-nav
      name: dsh-reply-nav
```

### npm/GitHub

```bash
cd ~/.dsh/profiles/<profile>
npm i --no-save --package-lock=false github:nicolas-zhao-4/dsh-reply-nav
```

然后添加上面的 patch 并刷新页面。

## 包含与排除

- **包含**：显式回复文本、Markdown 预览、回合级跳转
- **排除**：thinking/reasoning、tool calls

## 验证与排错

- 刷新页面后，长对话右侧应出现导航条
- 确认 `http://127.0.0.1:3080/plugins/dsh-reply-nav/client.js` 返回 `200`
- “设置里已激活”只代表 Node 侧加载成功；UI 未出现时请查看浏览器控制台

## 原理

插件通过 `shell.overlay` 注册浮层 UI；客户端从 DSH session snapshot 中聚合每个用户回合的 assistant 显式文本，渲染为预览并绑定跳转。全部 UI 位于 `lib/client.js`，修改后刷新页面即可生效。

## 许可证

MIT
