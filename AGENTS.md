# AGENTS.md

这个文件是 AI Agent 在本仓库中工作的长期协作规则。

## 项目背景

本仓库用于发布一个公开访问的 JLPT N2/N3 文法笔记网站。

网站内容来自本地 Obsidian Markdown 笔记库，通过 Quartz 5 构建为静态网站，并通过 GitHub Pages 发布。

公开网站：

<https://lapse-code.github.io/jlpt-grammar-site/>

当前发布分支：

```text
v5
```

## 技术栈

- Quartz 5：静态网站生成器。
- Node.js 22 或更高版本。
- npm 10.9.2 或更高版本。
- Markdown：网站内容格式，来源于 Obsidian 笔记。
- GitHub Actions：自动构建和部署。
- GitHub Pages：公开托管网站。

## 开发前必须阅读

开始修改前，优先阅读：

- `README.md`
- `module-map.md`
- `dev-log.md`
- `package.json`
- `scripts/sync-jlpt-content.mjs`
- `quartz.config.yaml`
- `.github/workflows/deploy.yml`

如果是同步或修改笔记内容，还要在运行同步脚本后检查：

- `scripts/jlpt-content-report.json`

这个报告文件只用于本地检查，不允许提交到 GitHub。

## 内容来源规则

Obsidian 笔记库是文法笔记的源头。

仓库里的 `content/` 目录是由同步脚本生成的公开网站内容：

```bash
npm run sync-jlpt-content
```

正常情况下，不要直接手动维护 `content/` 里的语法笔记。应该先修改 Obsidian 源笔记，再运行同步脚本。

如果要长期修改网站首页内容，不要直接改 `content/index.md`，应该改：

```text
scripts/sync-jlpt-content.mjs
```

因为 `content/index.md` 每次同步都会重新生成。

## 本地私有文件

本地 Obsidian 源笔记库路径通过下面两种方式之一提供：

- `JLPT_SOURCE_ROOT` 环境变量。
- `scripts/local-source-root.txt`。

如果这两种配置都不存在，不要猜测源笔记库位置，也不要在仓库里硬编码本机路径；应该直接询问用户。

不要把本地路径、邮箱、账号、token、密码、密钥或其他私人机器信息提交到 GitHub。

下面这些文件和目录是本地文件或生成物，应该保持忽略状态：

- `scripts/local-source-root.txt`
- `scripts/jlpt-content-report.json`
- `node_modules/`
- `public/`
- `.quartz/`
- `dev-log.md` 如果用户决定把开发日志只保留在本地。

## 常用命令

安装依赖：

```bash
npm ci
```

从本地 Obsidian 源笔记库同步公开内容：

```bash
npm run sync-jlpt-content
```

本地构建网站：

```bash
npx quartz build
```

本地预览网站：

```bash
npx quartz build --serve
```

运行 TypeScript 和格式检查：

```bash
npm run check
```

运行 Quartz 测试：

```bash
npm test
```

## 笔记更新流程

正常同步笔记时，按这个流程执行：

1. 先确认 Git 工作区是否干净，或明确当前已有改动是什么。
2. 运行 `npm run sync-jlpt-content`。
3. 阅读同步命令输出。
4. 如果 `missingCount` 或 `suspiciousCount` 不是 `0`，先停止，检查 `scripts/jlpt-content-report.json`。
5. 运行 `npx quartz build`。
6. 查看 `git diff --stat`，确认改动符合预期。
7. 只提交与当前任务相关的文件。
8. 推送到 `v5` 分支。
9. 确认 GitHub Actions 部署成功。
10. 验证公开网站和搜索索引。
11. 更新 `dev-log.md`；如果本地维护流程有变化，也更新外部项目备忘录。

## 部署规则

推送到 `v5` 分支会触发：

```text
.github/workflows/deploy.yml
```

部署流程会安装依赖、安装 Quartz 插件、构建网站、上传 `public/`，然后发布到 GitHub Pages。

## 修改规则

- 只修改和当前任务直接相关的文件。
- 优先遵守本仓库已有的 Quartz 和脚本结构。
- 不要无必要地引入新依赖。
- 不要无必要地重构 Quartz 上游代码。
- 不要把 `public/` 构建产物提交到 Git。
- 不要提交本地缓存或私有配置文件。
- 不要暴露本地路径、邮箱、token、密码或密钥。
- 如果内容问题应该在 Obsidian 源笔记里修正，不要只在 `content/` 里临时修。

## 文档更新规则

当项目规则或结构变化时，同步更新相关文档：

- 项目级工作规则变化时，更新 `AGENTS.md`。
- 关键目录、脚本、配置或部署流程变化时，更新 `module-map.md`。
- 每次完成任务后，更新 `dev-log.md`。
- 公开项目介绍或说明变化时，更新 `README.md`。
- 本地运行方式、部署方式、维护流程变化时，按需要更新用户的外部项目备忘录。
- 如果用户决定不公开 `dev-log.md`，仍应在本地更新它，但不要提交到 GitHub。

## 任务完成后的汇报要求

任务结束时，需要说明：

- 做了什么改动。
- 改了哪些文件。
- 运行了哪些命令。
- 检查或测试是否通过。
- 如果涉及部署，部署是否已验证。
- 是否还有未解决风险或后续建议。

没有实际运行过的测试、构建、部署或网站检查，不能说已经通过。
