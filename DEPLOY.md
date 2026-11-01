# 部署：自己架一个 OpenCouncil

结构很简单：反向代理 → PM2 → `127.0.0.1:$API_PORT`，一个 Node 进程同时提供 `/api/*` 和构建好的前端（`apps/web/dist`）；PostgreSQL 用 docker compose 起在本机。下面用 Caddy + PM2 举例，换成 nginx、systemd 或别的也行。

| 项 | 说明 |
| --- | --- |
| 进程 | PM2 `opencouncil`（`ecosystem.config.cjs`，用 tsx 运行 `apps/api/src/index.ts`，工作目录是仓库所在目录） |
| 端口 | `.env` 里的 `API_PORT`（默认 3001），只听本机，由反向代理对外 |
| 数据库 | `docker compose` 的 `opencouncil-db`，只绑 `127.0.0.1:${OC_DB_PORT:-5433}` |
| 密钥 | 服务器上的 `.env`（不进仓库）。`DEEPSEEK_API_KEY` 必填，否则议事厅和中文检索不可用 |
| 内容 | 部署时跑 `pnpm content:import`：幂等，读仓库里的 `packages/content/src/data/*.json`，**不联网、不调用模型** |

## 第一次上线

需要 Node 22、pnpm、PM2、Docker 和一个反向代理。

1. 克隆仓库，写 `.env`（权限 600）：

   ```bash
   git clone https://github.com/linjiejim/OpenCouncil.git opencouncil && cd opencouncil
   cat > .env <<'EOF'
   DATABASE_URL=postgresql://opencouncil:opencouncil@localhost:5433/opencouncil
   OC_DB_PORT=5433
   API_PORT=3001
   DEEPSEEK_API_KEY=sk-...
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   EOF
   chmod 600 .env
   ```

   数据库口令只在本机回环上用；要改的话，`docker-compose.yml` 和 `DATABASE_URL` 一起改。

2. 起数据库，装依赖、构建、建表、导入内容、启动：

   ```bash
   docker compose up -d
   pnpm install --frozen-lockfile
   pnpm --filter @opencouncil/web build
   npx drizzle-kit push --force
   pnpm content:import
   mkdir -p logs && pm2 start ecosystem.config.cjs && pm2 save
   curl -s localhost:3001/api/health     # 期望 {"status":"ok",...}
   ```

   有的主机会跳过 esbuild 的安装脚本，启动报 esbuild 相关的错时补一句 `pnpm rebuild esbuild`。

3. 反向代理，例如在 Caddyfile 里加一段（Caddy 会自动签发证书）：

   ```
   council.example.com {
   	encode zstd gzip
   	reverse_proxy 127.0.0.1:3001
   }
   ```

4. 域名加一条 A 记录指向服务器。不要套 CDN 代理，否则 Caddy 过不了 ACME 的 HTTP 验证。

## 推送即部署（可选）

`.github/workflows/deploy.yml` 在每次推送和 PR 上跑类型检查和测试；推到 `main` 时再 SSH 到服务器拉代码、按需装依赖、构建、同步表结构、导入内容、`pm2 startOrRestart`，最后轮询 `/api/health`。部署这一步只在配了仓库变量 `DEPLOY_ENVIRONMENT` 的仓库里运行，fork 里不会触发。要启用：

- 建一个 GitHub environment（建议限定只有 `main` 能用），配好这些 secret：
  - `DEV_SERVER_HOST` / `DEV_SERVER_PORT` / `DEV_SERVER_USERNAME` / `DEV_SERVER_SSH_KEY`：用 CI 专用的登录钥匙，不要用个人钥匙；
  - `DEPLOY_APP_DIR`：服务器上的仓库目录。它不算机密，放 secrets 是为了在公开的运行日志里打码。
- 配一个仓库变量 `DEPLOY_ENVIRONMENT`，值是上面那个 environment 的名字。

服务器上的克隆用它自己配好的远端拉代码：仓库公开时用 HTTPS 地址即可；私有仓库就给它配一把只读 deploy key（`git config core.sshCommand "ssh -i <key>"`）。健康检查的端口从服务器的 `.env` 读，不会出现在日志里。

`.github/workflows/expand.yml` 是手动触发的语料扩充：沿着已对齐的经典往下取下一批原文，过校验闸门，提交回 `main`，再同步到服务器。它还需要 environment 里有 `DEEPSEEK_API_KEY`（只用来写摘要等编辑性元数据，不碰原文）。

## 日常

- 部署：推送到 `main`，或在 Actions 里手动运行 “CI & deploy”。
- 日志：`pm2 logs opencouncil`，或看 `logs/`。
- 重新导入内容：`pnpm content:import`（幂等）。
- 备份：`docker exec opencouncil-db pg_dump -U opencouncil opencouncil > backup-$(date +%F).sql`。
- 回滚：`git reset --hard <上一个提交> && pnpm --filter @opencouncil/web build && pnpm content:import && pm2 restart opencouncil`。
