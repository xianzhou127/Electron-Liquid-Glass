# 提取来源

提取日期：2026-09-26（机器记录精确 UTC 时间见 extraction.json）。

主要来源为 LearningWithYou 正式 `desktop/glass/`，源 HEAD：
`e4510f52dabf0e2cf64b0bbf92d158de735e5518`，T15 / 0.15.10，源 STATUS.md 记录其于 2026-09-24 经用户验收。

开始时源项目有未提交 T16 / 0.16.4 业务、页面和主进程工作区改动；其 STATUS 仍将 T15 标为最近已验收版本。源 AGENTS 中较早的 T13 状态是历史记录。本次没有把 T16 或旧 T14.8 实验包装成另一正式版本，也没有启动源项目的新编号任务。

`desktop/glass/` 与源 HEAD 无工作区差异。当前 main.ts / preload.ts 用作接线核对，分别编写独立主进程与白名单桥；不复制 T16 业务内容。完整文件来源、源 SHA-256、换行标准化后 SHA-256 和是否改编见 [extraction.json](extraction.json)。文件换行在新仓库统一为 LF；版权与许可文字不改写。

## 保留与改编

- 保留正式光学核心 `glass.ts`、SDF、distance-light、elevation、panel-shaders、geometry、deformation、elastic、frame-scheduler、readability、foreground-mask、adaptive-ink/frost、spatial-ink，及正式 capture/display-streams、desktop-layout、display-adaptation、menu-material/menu-geometry 算法。
- `motion.ts` 只将原 Snapshot 类型/方法入口改为 `VisualState` / `visualState`，用 cycle/step/phase/notify 触发原有去重、过渡与提示通道；求解器与姿态算法不重写。
- `host.ts` 去掉业务 Snapshot/反馈消费依赖，保留显示器库存、单次采集 grant、权限、命中、拖动提交和生命周期；独立 scheme 与角色类型，新加中性开关、恢复已保存值入口。
- `capsule.tsx` / `menu.tsx` 只替换业务 hooks、工具条与菜单回调；保留统一呈现事务、形变命中、菜单预热与关闭门控。`demo-controls.tsx` 是中性演示控件，没有学习控制器。
- `settings-store.ts`、`display-cache.ts` 改用独立应用标识；单独 app/userData/Session 分区。只携带核实过的两份验收预设，不读取任何真实用户保存文件。
- 新主进程沿用正式 menu focus/blur、Esc、透明置顶宿主及强制截图排除约束；调参窗口关闭仅隐藏自己。菜单普通操作依赖真实失焦关闭，不强制关闭所有动作。
- Windows 原生工具由 `desktop/native/source-catalog.cs` 收窄，保留显示器 ID/物理坐标/DPI 所需源码，删除应用窗口标题/进程枚举。`sources.ts` 只保留受控原生调用；`window-placement.ts` 只提取 Rect/constrain/adjacentBounds。
- 复用正式材质单测与 GPU/DOM 测试，替换业务测试夹具，移除只测试 DesktopSession 的用例；保留明确来源，新增独立接线、数据隔离和重启测试。没有复制实验日志与完整实验工程。

## 历史参考

查阅源 AGENTS.md、STATUS.md、最近提交、T14.7、T14.8、T15 说明及其多屏/显示器缓存/菜单跟随/失焦/采集排除修正。T14.8 candidate10 / `74aa059` 用于理解正式版的派生来源；T14.7 candidate24 为静态预设依据。正式版后续多屏、菜单、池化和预热处理均从当前 glass 目录保留。

`src/glass/UPSTREAM.md` 原样复制。旧实验的细分派生说明另原样保存在 HISTORICAL-UPSTREAM.md；其中旧实验路径、旧性能/失败说明仅属来源记录，不代表本仓库包含对应资源或通过相同验收。上游 LICENSE 与固定 commit 实际文件再次核对一致，详见 extraction.json。

主项目未发现原创部分的明确项目级许可证；根 LICENSE.md 如实限定授权范围，没有新增全仓库 MIT 授权。没有复制第三方图片、视频、字体、Apple 资产或上游参数编辑器/WebGPU 后端。

源项目全程只读，不 reset/clean/stash、不改 remote、不在其目录构建或安装。开始/结束 Git 状态、工作区 diff 摘要及 remote 对比记录在 extraction.json；未知文件保留，任务文档只写本仓库。另一个 App 仓库没有被访问或修改。
