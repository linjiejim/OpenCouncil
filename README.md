# OpenCouncil 思想议事厅

**中文** · [English](README.en.md)

问一个人生问题，请几位不同传统的思想家各自引原文作答，最后给出他们的共识和点名的分歧。

- **演示站**：<https://council.linjiejim.com>
- **设计说明**：[DESIGN.md](DESIGN.md)（为什么这样做、刻意没做什么）
- **内容来源与许可**：[NOTICE.md](NOTICE.md)

![议事厅](docs/assets/council.png)

## 它是什么

深夜睡不着，想知道“怎么面对失去”“该不该辞职”。OpenCouncil 不给一个标准答案，而是请来孔子、庄子、马可·奥勒留、康德、鲁米……让他们各说各的，每一句都附原文：

- **多**：同一个问题，儒、道、佛、基督教、伊斯兰、斯多葛、古希腊、启蒙、现代思想并排作答。
- **真**：引文不是模型写的。原文和译文从公版或开放许可的版本里**逐字**取得，过了校验闸门才入库；点开任何一句都能看到原文、译者和出处链接。
- **境**：每段原文附一条语境说明，减少断章取义。
- **共识与分歧**：最后一句说他们在哪里一致，再点名说出一到三处具体的分歧。超出原文的推断会明确标出。

收录 16 位思想家与经典的 242 段原文：

| 传统 | 收录 |
| --- | --- |
| 儒家 | 孔子《论语》26 段（Legge）· 孟子《孟子》11 段（Legge）· 王阳明《传习录》8 段（Henke） |
| 道家 | 老子《道德经》20 段（Legge）· 庄子《庄子》11 段（Giles） |
| 佛教 | 《法句经》45 段（巴利原文，Sujato 英译） |
| 基督教 | 《福音书》21 段（SBLGNT 希腊文，World English Bible） |
| 伊斯兰 | 《古兰经》39 段（Tanzil 阿拉伯文，Pickthall 英译） |
| 苏菲 | 鲁米《玛斯纳维》1 段（波斯原文，Whinfield 英译） |
| 古希腊 | 柏拉图《对话录》9 段（Jowett）· 亚里士多德《尼各马可伦理学》《政治学》9 段（Chase、Ellis） |
| 斯多葛 | 马可·奥勒留《沉思录》6 段（Long）· 塞涅卡《道德书简》与对话录 8 段（Stewart、Gummere）· 爱比克泰德《论说集》《手册》10 段（Long） |
| 启蒙 | 康德《纯粹理性批判》《实践理性批判》《永久和平论》10 段（Meiklejohn、Abbott、Hastie） |
| 现代 | 尼采《查拉图斯特拉如是说》《善恶的彼岸》《偶像的黄昏》8 段（Common、Zimmern） |

佛教、基督教、伊斯兰以经典本身出场（“佛教 · 法句经”等），议事厅只用第三人称转述经文的教导，不以佛陀、耶稣、先知或神的口吻说话。每位思想家用一枚取自其著作的徽记代替肖像：不编造引文，也不编造面孔。

## 本地运行

需要 Node 22+、pnpm、Docker。

```bash
pnpm install
```

```bash
cp .env.example .env
```

在 `.env` 里填上 `DEEPSEEK_API_KEY`（议事厅和中文检索要用；浏览著作和英文检索不需要）。

```bash
docker compose up -d
```

```bash
npx drizzle-kit push --force && pnpm content:import
```

```bash
pnpm dev
```

打开 <http://localhost:5173>。API 在 3001 端口，前端开发服务器会代理 `/api`。

## 内容管线

```bash
pnpm content:excerpt-check marcus-aurelius   # 检查某部著作的锚点摘录，打印每段原文和译文
pnpm content:collect marcus-aurelius         # 取原文 → 校验 → 写入 packages/content/src/data/*.json
pnpm content:import                          # 把 data/*.json 导入数据库（幂等，不联网）
pnpm content:notice                          # 由数据重新生成 NOTICE.md
```

- 原文和译文只能来自 `packages/content/src/sources/` 里的来源适配器，或 `packages/content/src/excerpts/` 里的锚点摘录：给出整本公版书的地址和一段话的起止原句，程序切出中间的部分；起止原句找不到或不唯一，这一段就不会入库。
- 摘要、相似问题、语境说明是编辑性元数据，和原文分开存放。
- `pnpm test` 会逐段检查已提交的数据是否都已校验、带齐出处，也会检查 `NOTICE.md` 有没有和数据同步。

想加一位思想家：在 `packages/db/src/seed/index.ts` 加人物，在 `packages/content/src/excerpts/` 照 `marcus-aurelius.ts` 写一份摘录清单，注册到 `excerpts/index.ts`，跑一遍上面的命令。

## 目录

```
apps/web          React 19 + Vite + Tailwind v4，中英双语界面
apps/api          Hono API，同时托管构建好的前端
packages/db       Drizzle ORM + PostgreSQL 全文检索
packages/content  来源适配器、锚点摘录、校验闸门、导入
packages/types    共享类型
docs/agent-api.md 给其他 agent 用的只读检索接口
```

自己部署见 [DEPLOY.md](DEPLOY.md)。

## 许可

代码使用 MIT 许可（[LICENSE](LICENSE)）。原文、译文、编辑性元数据和徽记图片不在 MIT 范围内，各自的许可见 [NOTICE.md](NOTICE.md)：大多是公有领域；Perseus 的希腊文、拉丁文是 CC BY-SA 4.0，SBLGNT 是 CC BY 4.0，Tanzil 古兰经文本是 CC BY 3.0（不得改动）；编辑性元数据和徽记是 CC BY 4.0。

议事厅里的解释由语言模型根据引文生成，可能出错；可以核对的是引文本身。这里的经典和哲学文本供思考之用，不构成宗教、医疗、法律等任何专业意见。
