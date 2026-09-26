# 当前状态

- 当前任务：液态玻璃独立提取，代码和文档已建立；本机及全新 Git 检出的自动检查均通过。所有者视觉验收待完成。
- 来源：LearningWithYou T15 / `e4510f52dabf0e2cf64b0bbf92d158de735e5518`，正式 glass 目录；原项目 Git 状态、diff 和 remote 对比未变，另一个 App 仓库未访问或修改。
- 保留：正式 shader、弹性求解、胶囊/菜单、显示器池化与 DPI、透明命中/拖动、独立调参与预设。移除学习、音频、模型与历史依赖，userData 独立。
- 检查：69 项单元测试、类型检查、lint、构建、38,942 组 GPU 输入及 19 项真实桌面短程检查通过；全新克隆从 `npm ci` 重跑通过。原生失焦/系统指针手感、多屏实机、HDR 和长期稳定性未确认。详见 docs/VALIDATION.md。
- 许可：完整上游 MIT 与固定提交核对一致，保留 UPSTREAM、派生关系与 notices；原创部分不擅自授予开源许可。
- GitHub：已创建并推送 [xianzhou127/Electron-Liquid-Glass](https://github.com/xianzhou127/Electron-Liquid-Glass)，API 核验为 Private，默认分支 main。只发布本仓库源码，未发布 npm、网站或二进制。
