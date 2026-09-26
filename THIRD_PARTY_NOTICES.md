# 第三方来源与许可

## Liquid Glass Studio

- 作者：Charles Yin（iyinchao）
- 演示：https://liquid-glass.iyinchao.cn/
- 源码：https://github.com/iyinchao/liquid-glass-studio
- 核对提交：`f7b28c36305a862f5cffed3ddd51511cf1204f56`
- 完整 MIT 版权及许可：[原文](src/glass/upstream/LICENSE.txt)
- 正式源记录：[UPSTREAM.md](src/glass/UPSTREAM.md)，原样保留。
- 历史派生说明：[HISTORICAL-UPSTREAM.md](docs/provenance/HISTORICAL-UPSTREAM.md)，原样保留，提及的旧实验文件不属于本仓库交付内容。

`src/glass/glass.ts` 的加权可分离高斯模糊、SDF 覆盖管线、折射/色散采样、STEP 9 的菲涅尔范围与肩部，以及外部阴影处理，直接复用或改编上游 shader 思路和代码；这是派生实现，不能仅标注“受到启发”。固定胶囊解析法线、预乘透明输出和受限 ROI 均有改动，不保证与上游数值等价。`panel-shaders.ts` 在此派生材质上替换菜单轮廓。

主项目增加了 Electron 真实桌面采集与池化、多显示器坐标/DPI 映射、显示器适配缓存、透明窗口命中与拖动、清晰前景颜色场、自适应磨砂、弹性形变、菜单预热、参数校验/持久化与交互调度。本次增加独立应用身份、中性演示接口和启动/验证工程。

Apple WWDC25 内容仅作设计原则参考；GGX/Smith/Schlick、PBRT 和 Karis 文献作数学参考，详见历史来源说明。未复制 Apple 实现、文献图片、上游网页截图、视频、字体、参数编辑器或 WebGPU 后端。不代表 Apple 或上游官方 Electron 版本，也无其背书。

## npm 依赖

运行时 React / React DOM（Meta，MIT）；Electron（Electron contributors，MIT 及其 Chromium、Node.js 等第三方许可）。构建与测试使用 esbuild（MIT）、TypeScript（Apache-2.0）、ESLint 与 typescript-eslint（MIT）、tsx（MIT）、Playwright（Apache-2.0）、DefinitelyTyped 类型包（MIT）。准确版本及传递依赖见 package-lock.json；完整依赖许可由 npm 安装保留在相应包中。分发 Electron 二进制时须保留其 LICENSE、LICENSES.chromium.html 与各依赖的许可文本。

本仓库仅使用系统字体，不打包字体；演示图标为本次简单 SVG 几何路径，托盘图标由程序生成。实际运行截图仅使用本项目生成的无个人内容测试文档。原创代码许可范围见 LICENSE.md。
