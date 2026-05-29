# module-map.md

这个文件是本仓库的模块地图，用来帮助维护者和 AI Agent 快速判断应该看哪里、改哪里。

## 仓库根目录

- `README.md`：公开项目简介和免责声明。
- `AGENTS.md`：AI Agent 的长期协作规则。
- `module-map.md`：项目结构和关键文件职责说明。
- `dev-log.md`：开发日志和任务记录。
- `package.json`：npm 命令、Node/npm 版本要求、Quartz 依赖。
- `package-lock.json`：锁定依赖版本，用于可复现安装。
- `quartz.config.yaml`：当前网站实际使用的 Quartz 配置。
- `quartz.config.default.yaml`：Quartz 默认配置参考。
- `quartz.ts`：Quartz 入口文件。
- `.github/workflows/deploy.yml`：GitHub Pages 自动部署流程。
- `.gitignore`：忽略本地文件、生成物、缓存和私有配置。

## 网站内容目录

- `content/`：Quartz 构建网站时读取的 Markdown 内容。
- `content/index.md`：生成出来的网站首页。
- `content/` 中的语法笔记：由 `scripts/sync-jlpt-content.mjs` 从本地 Obsidian 源笔记库复制而来。

重要规则：

`content/` 是生成内容。正常更新时，应该先改 Obsidian 源笔记，再运行：

```bash
npm run sync-jlpt-content
```

## 项目脚本

- `scripts/sync-jlpt-content.mjs`：从本地 Obsidian 源笔记库复制公开笔记到 `content/`，生成 `content/index.md`，并扫描复制后的内容是否可能包含隐私信息。
- `scripts/local-source-root.txt`：本地私有文件，保存源笔记库路径，已被忽略，不要提交。
- `scripts/jlpt-content-report.json`：最近一次同步生成的检查报告，已被忽略。同步出现警告时优先查看它。

如果 `scripts/local-source-root.txt` 不存在，且也没有设置 `JLPT_SOURCE_ROOT`，应该询问用户源笔记库位置，不要猜测路径或把本机路径写进仓库文件。

同步脚本从这些入口笔记开始：

- `N2・N3 文法点整合索引`
- `N2文法7项接口分类`
- `日语文法接续入口判断`
- `日语动词活用总表`
- `文法整理`

脚本会递归读取 Obsidian `[[双链]]`，复制能从入口笔记连到的公开笔记。明确排除的标题不会复制。

## Quartz 核心代码

- `quartz/`：Quartz 的核心源码和构建流程。
- `quartz/components/`：Quartz 页面组件。
- `quartz/plugins/`：Quartz 插件，包括转换、过滤、输出和页面类型。
- `quartz/styles/`：Quartz 全局样式。
- `quartz/i18n/`：多语言文本。
- `quartz/cli/`：Quartz 命令行实现。
- `quartz/util/`：Quartz 公共工具函数。

`quartz/` 基本属于上游框架代码。除非配置、内容或小型项目脚本无法解决问题，否则不要优先修改它。

## Quartz 文档

- `docs/`：随 Quartz 仓库自带的上游文档。

这个目录用于查 Quartz 功能，不是 JLPT 网站内容。

## 构建产物和缓存

- `public/`：Quartz 构建生成的静态网站文件，已被忽略。
- `node_modules/`：npm 安装的依赖，已被忽略。
- `.quartz/`：本地 Quartz 状态或缓存，已被忽略。
- `.quartz-cache/`：Quartz 缓存目录，如生成也应保持忽略。
- `dev-log.md`：如果用户决定只把开发日志留在本地，也应该加入 `.gitignore`。

不要提交构建产物或依赖缓存。

## 部署模块

- `.github/workflows/deploy.yml`：推送 `v5` 分支后自动部署网站。

部署流程大致是：

1. 拉取仓库代码。
2. 设置 Node 24。
3. 运行 `npm ci`。
4. 运行 `npx quartz plugin install --from-config`。
5. 运行 `npx quartz build`。
6. 上传 `public/`。
7. 部署到 GitHub Pages。

## 修改不同功能时优先查看哪里

笔记内容同步：

1. `scripts/sync-jlpt-content.mjs`
2. `content/`
3. `scripts/jlpt-content-report.json`
4. 如果部署失败，再看 `.github/workflows/deploy.yml`

首页文字、推荐入口、免责声明：

1. `scripts/sync-jlpt-content.mjs`
2. 重新生成 `content/index.md`

网站标题、语言、搜索、链接解析、主题、插件：

1. `quartz.config.yaml`
2. `docs/`
3. 只有配置不够时才看 `quartz/`

依赖、命令、Node 版本：

1. `package.json`
2. `package-lock.json`
3. `.github/workflows/deploy.yml`
4. `AGENTS.md`

GitHub Pages 部署：

1. `.github/workflows/deploy.yml`
2. `quartz.config.yaml`
3. GitHub 仓库的 Pages 设置

## 测试和检查入口

根据改动类型选择命令：

- `npm run sync-jlpt-content`：同步笔记时必须运行。
- `npx quartz build`：发布网站改动前必须运行。
- `npm run check`：修改代码、配置、格式时建议运行。
- `npm test`：修改 Quartz 核心代码时建议运行。

公开部署验证通常检查：

- 网站首页返回 HTTP 200。
- `static/contentIndex.json` 可以访问。
- 搜索索引里能找到代表性语法点。

代表性搜索词：

- `にすぎない`
- `ものだ`
- `はずだ`
- `べきだ`
