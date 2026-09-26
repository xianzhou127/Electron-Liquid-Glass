# 接入其他 Electron 项目

本示例是固定尺寸工具条的可运行参考，不是稳定 npm API。建议先完整运行本仓库，再移入目标项目的独立目录；目标项目需自行获得原创部分的复用许可，保留第三方版权。不能仅拷贝 shader 而漏掉坐标、前景与生命周期适配。

## 模块边界

| 模块 | 输入与责任 |
| --- | --- |
| `glass.ts`、`panel-shaders.ts` | WebGL2、背景视频纹理、Geometry、MaterialSettings、MotionPose、前景遮罩；SDF/模糊/折射/色散/光影/透明合成 |
| `motion.ts`、`elastic.ts`、`deformation.ts` | 数值参数、视觉状态、按压/抓起/速度/焦点；统一姿态，不执行应用动作 |
| `foreground-mask.ts`、`readability.ts`、`spatial-ink.ts` | 当前 DOM 六个前景分组，清晰字形与颜色场，DOM/GPU 共享形变 |
| `frame-scheduler.ts` | 视频新帧、指针与动效共用呈现事务；松手 flush 最新锚点 |
| `host.ts`、`desktop-layout.ts`、`display-adaptation.ts` | Electron 窗口、角色鉴权、物理像素/DIP、有限显示器适配缓存和主进程命中 |
| `display-streams.ts`、`capture.ts` | 可信采集 grant、全部屏幕视频池、ROI 映射、渲染预热、看门狗、失败释放 |
| `menu-material.ts`、`menu-geometry.ts` | 同池圆角菜单、跟随定位、高磨砂、首帧和关闭门控 |
| `settings-store.ts`、`presets.ts` | 严格数值范围、分开保存、原子替换与备份、预览与已保存值 |
| `demo-api.ts`、`demo-state.ts`、`demo-controls.tsx` | 可替换的演示状态与业务回调；不带学习控制器 |

## 入口与最小视觉接口

运行入口是 `src/main.ts` → `src/preload.ts` → `src/glass/entry.tsx`。当前 `AppearanceHost` 的角色固定为 `orb` / `appearance`，`window.appearance` 为白名单桥，`window.demo` 只公开中性按钮动作。其他项目可替换 demo 层，但应保留宿主角色鉴权，避免向任意页面暴露桌面采集或 IPC。

```ts
import { MotionEngine } from './glass/motion';
import { ACCEPTED_MOTION } from './glass/presets';
const motion = new MotionEngine();
motion.configure(ACCEPTED_MOTION, false, true, performance.now());
// cycle/step 仅用于去重；notify 是一次视觉提示，不携带业务正文。
motion.visualState({ phase: 'done', cycle: 1, step: 1, notify: true }, performance.now());
const pose = motion.sample(performance.now());
// 将同一 pose 交给 WebGL 材质、前景字形与 DOM 命中变换。
// 不要单独 scale 最终材质 canvas，否则背景取样会跟着拉伸。
```

状态标识相同的重复渲染不重复提示。隐藏/减少动效时收到的提示仍被消费，恢复不重播。宿主控制器应维持明确事件 ID；本演示不持久化视觉事件，重启清零。React 控件回调才执行应用动作，MotionInput 不派发合成业务点击。

## Electron 接线要点

1. 在 ready 前注册独立安全 scheme，设置独立 app 名与 userData；参考 main.ts 的静态资源白名单、CSP、网络阻断和 sandbox/contextIsolation。
2. 编译并随应用放入 `native/source-catalog.exe`，源为 `src/native/source-catalog.cs`。其只读枚举原生显示器和物理像素，不需要录屏库、窗口标题枚举或管理员权限。ASAR 打包时需将原生 exe 放在 app.asar.unpacked 对应路径。
3. 创建透明、无框、置顶 orb；先登记窗口再开启 content protection，首次显示前完成。永远不为了截图/测试关闭此保护。`AppearanceHost` 拒绝未受保护的采集宿主。
4. 初始化 `AppearanceHost(windows, auth, openTuner, aligned)`，`await load()` 后 install/attach。`aligned` 用 `menuPlacementFor(host.geometry(), menuHeight)` 更新共享菜单命中边界。
5. 将 Session 的 permission request/check 和 display media handler 接到 host。只准准确主框架、受信 origin、当前显示器、单次视频 grant，拒绝音频与摄像头。不要把媒体权限概括放行。
6. preload 只暴露 api.ts 中的具体操作；不要暴露 ipcRenderer 或任意频道/文件读写。
7. renderer 使用 Capsule/MaterialCapture，真实位置、视频取样、菜单位置和点击区域在同一帧提交。顶层透明区需 `setIgnoreMouseEvents`，拖动期间维持指针捕获。

本仓库的 `main.ts` 是完整可运行接线示例；直接参考它通常比零散拼接更可靠。主进程最后提交的 anchor 是物理屏幕像素；CSS 坐标先乘 devicePixelRatio，局部 SDF/材质参数为 DIP。屏幕原点不能重复乘缩放。多屏窗口横跨联合物理矩形，视频流各自的物理区域映射到当前材质局部坐标。

## 资源释放契约

- `capture.stop()` 释放所有背景轨道、视频引用、rVFC、RAF、看门狗和 WebGL，清除旧 canvas。迟到采集结果由 generation 检查立即停止。
- 菜单普通收起调用 `setOpen(false)`，只停止绘制并隐藏缓存画布；整个材质停止时调用 `menu.stop()`；卸载时 `menu.dispose()`。
- renderer 卸载调用 MotionInput.dispose、ForegroundMask.dispose、读取布局 observer 解除和所有订阅 off；参考 Capsule 的 effect cleanup 和 beforeunload。
- 主进程 dispose host，使待处理 grant/拓扑刷新失效，再销毁窗口和托盘。屏幕事件在窗口关闭时解除。
- 不要在拖动每个 pointermove 重枚举显示器、重建 shader 或请求新流；正常跨屏复用预热池，显示拓扑改变才重新准备。

采集来源结束、mute、看门狗或 context loss 必须进入明确降级；不能停在旧桌面图像上。宿主通过报告状态关闭失败配置，用户显式重新开启后恢复。

## 已知耦合

固定 SIZE、六个前景选择器、胶囊解析 SDF、菜单尺寸和 DOM 布局是共同约束。保留 `.learning-toolbar` 等类名只是避免改动已验证字形路径。若需要任意形状/任意尺寸或不同 UI 框架，需要独立设计和额外验收，本次不提供这种兼容承诺。
