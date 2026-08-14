# dsh-reply-nav

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的浏览器端插件:在长对话右侧显示一条**导航条**,帮你快速检索和跳转到历史回合。

每条横杠 = **一条用户消息(一个回合)**,不是每条 assistant 步骤 —— 因为工具调用会把一次回复拆成很多步,按回合计才能真实反映对话节奏。

## 特性

- **每条横杠对应一轮用户消息**;点击横杠,对话滚动到该回合的位置
- **悬停预览**:鼠标移到横杠上,左侧弹出该轮模型回复的 Markdown 缩略预览(只含显式回复文本,不含思考过程、不含工具调用)
- **当前回合自动高亮**(跟随滚动更新)
- 纯客户端插件:无后端逻辑,半透明毛玻璃风格,跟随 DSH 主题变量
- 无构建步骤,改完刷新页面即生效

## 安装(三选一,都很简单)

> 前提:本机已安装并运行 DeepSeek Harness 的 web GUI。下文 `<profile>` 默认是 `web`(可在 `~/.dsh/profiles/` 下确认你自己的 profile 名;Windows 上 `~` 即 `C:\Users\<你>`)。

### 方式 A:一键安装脚本(推荐)

```powershell
# Windows (PowerShell)
git clone https://github.com/nicolas-zhao-4/dsh-reply-nav.git
cd dsh-reply-nav
./install.ps1            # 可选参数:profile 名,默认 web
```

> 若 PowerShell 提示执行策略限制,用:`powershell -ExecutionPolicy Bypass -File ./install.ps1`

```bash
# macOS / Linux
git clone https://github.com/nicolas-zhao-4/dsh-reply-nav.git
cd dsh-reply-nav
./install.sh             # 可选参数:profile 名,默认 web
```

脚本做的事:把插件拷贝到该 profile 的 `node_modules/`,并把注册行追加到 `cordis.patch.yml`(已存在则跳过,幂等)。然后**刷新浏览器页面**即可。

### 方式 B:手动拷贝

1. 把 `dsh-reply-nav` 文件夹(含 `package.json` 和 `lib/`)复制到 `~/.dsh/profiles/<profile>/node_modules/dsh-reply-nav/`
2. 编辑 `~/.dsh/profiles/<profile>/cordis.patch.yml`,追加:

   ```yaml
   - insert:
       - id: reply-nav
         name: dsh-reply-nav
   ```

3. 刷新浏览器页面。

### 方式 C:npm 安装(可选)

```bash
cd ~/.dsh/profiles/<profile>
npm i --no-save --package-lock=false github:nicolas-zhao-4/dsh-reply-nav
```

然后同样追加方式 B 里的 patch 行,再刷新页面。

## 验证与排错

- **刷新页面即可**(不需要重启 dsh);右侧应出现导航条
- 确认 `http://127.0.0.1:3080/plugins/dsh-reply-nav/client.js` 返回 200
- ⚠️ **"设置里显示已激活" ≠ 浏览器渲染成功**:设置页的激活状态只代表 node 半边加载成功。UI 没出现时,按 F12 打开浏览器控制台看报错,而不是看设置页
- 浏览器控制台若有与插件无关的扩展报错,可忽略

## 工作原理(给好奇的人)

- **纯客户端插件**:node 半边 `lib/index.js` 是空的 `apply`(只是为了在 Loader 里"激活");全部 UI 在 `lib/client.js`
- `package.json` 里 `dsh.client.platform: "web"` + `exports["./client"]` 声明它是一个 web bundle
- dsh 启动时,`dsh-client-modules` 扫描 loader 行,把 bundle 编入 `window.__DSH_BOOT__`,浏览器通过 `/plugins/dsh-reply-nav/client.js` 加载
- 组件在 `apply(ctx)` 里通过 `ctx.slots.inject("shell.overlay", ...)` 注册到覆盖层插槽,因此悬浮在页面最上层
- 注意 bundle 里的 `id` 必须与包名一致(`dsh-reply-nav`),它是浏览器模块表里的模块 id

## 开发

直接编辑 `lib/client.js` 即可,改完刷新页面生效,没有构建步骤。本仓库本身就是"把一个动态 Cordis 插件持久化为开机自启 bundle"的产物,想了解完整迁移过程可参考 DSH 的 `persisting-client-plugins` skill。

## 许可证

MIT

## Topics

`deepseek-harness` · `dsh` · `dsh-plugin` · `cordis` · `ai-agents`
