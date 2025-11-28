<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 项目运行与部署

该项目为 Vite + React（TypeScript）应用，提供烟花特效与情话生成。支持本地开发与 Vercel 部署。

View your app in AI Studio: https://ai.studio/apps/drive/1kFh8hiHrlf1CQ8VbOpbhniWn97n7WLw0

## 本地运行
**前置条件：** 安装 Node.js

1. 安装依赖：`npm install`
2. 新建 `.env.local` 并设置：`GEMINI_API_KEY=你的密钥`
3. 启动：`npm run dev`，访问日志中的本地地址
4. 自定义端口：在 `.env.local` 设置 `VITE_PORT=5173`

## 部署到 Vercel（推荐，密钥不暴露）
1. 代码推送到 GitHub/GitLab
2. 在 Vercel 新建项目并导入仓库
3. 在 Vercel 项目 Settings → Environment Variables 添加：`GEMINI_API_KEY=你的密钥`
4. 构建命令：`npm run build`；输出目录：`dist`
5. 部署完成后，前端通过 `/api/generate-love-note` 调用服务端函数，密钥仅在服务端使用

## 生产环境说明
- 开发环境（本地）：如设置了 `GEMINI_API_KEY`，前端会直接调用 Gemini 以便快速调试。
- 生产环境（构建后）：前端通过 `/api/generate-love-note` 调用服务端函数，不在前端打包任何密钥。

## 常见问题
- 端口被占用：修改 `.env.local` 的 `VITE_PORT` 或添加 `server.strictPort: true`。
- 预览空白：确保 `index.html` 包含 `<script type="module" src="/index.tsx"></script>`。
