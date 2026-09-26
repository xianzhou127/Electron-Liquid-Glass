# 参数与验收默认

由实际源码生成：`node --import tsx scripts/generate-parameters.ts`。单位未单列时见控件标签及面板说明。所有参数经过有限数值/字段白名单校验；预设默认来自 candidate24 与 candidate10。

## 材质

| 参数 | 名称 | 范围 | 步长 | 验收默认 |
| --- | --- | --- | --- | --- |
| `highlightStrength` | 高光强度  | 0–3 | 0.02 | 3 |
| `highlightWidth` | 高光宽度（DIP）  | 0.25–6 | 0.05 | 5.4 |
| `lightAngle` | 固定光照方向（°，90 为上方）  | 0–360 | 1 | 142 |
| `oppositeHighlight` | 反向高光比例  | 0–1.2 | 0.02 | 1 |
| `lightBalance` | 迎光／背光差异  | 0–1 | 0.02 | 0.62 |
| `distanceEffect` | 距离效果强度（0 对照旧版）  | 0–1 | 0.02 | 0.1 |
| `lightHeight` | 光源高度（屏幕短边倍数）  | 0.12–1.2 | 0.01 | 1.2 |
| `lightRadius` | 光源半径（高度倍数）  | 0.05–0.65 | 0.01 | 0.15 |
| `glareConvergence` | 高光集中度  | 0.35–4 | 0.05 | 3.55 |
| `glareChroma` | 高光保色  | 0–1 | 0.02 | 1 |
| `fresnelStrength` | 菲涅尔反射强度  | 0–1 | 0.01 | 0.15 |
| `fresnelRange` | 菲涅尔反射范围（向内 DIP）  | 1–16 | 0.25 | 7 |
| `fresnelHardness` | 菲涅尔反射硬度  | 0–1 | 0.02 | 0.16 |
| `lowerShade` | 暗瓣强度（单向时为下缘）  | 0–0.5 | 0.005 | 0.36 |
| `contourStrength` | 外侧细暗边  | 0–0.6 | 0.01 | 0 |
| `shadowStrength` | 阴影强度  | 0–0.4 | 0.01 | 0.16 |
| `shadowSpread` | 阴影扩散 σ（向外 DIP）  | 0.5–10 | 0.25 | 3.5 |
| `refractionPx` | 最大折射位移（DIP）  | 0–8 | 0.1 | 7 |
| `dispersionPx` | 折射色散宽度（DIP）  | 0–1.5 | 0.05 | 1.5 |
| `edgeWidth` | 折射边缘宽度（DIP）  | 2–16 | 0.25 | 7 |
| `ior` | 折射率  | 1–1.65 | 0.01 | 1.42 |
| `blurSigma` | 模糊强度 σ（DIP）  | 0.5–3 | 0.1 | 0.5 |
| `frostSigma` | 复杂背景模糊上限 σ（DIP）  | 0.5–6 | 0.1 | 6 |
| `frostThreshold` | 复杂度触发阈值（越低越容易变毛玻璃）  | 0.05–0.6 | 0.01 | 0.2 |
| `frostTransitionMs` | 毛玻璃过渡时间（毫秒，越小越快）  | 0–1500 | 50 | 350 |
| `frostWeightStatus` | 左侧状态文字权重  | 0–2 | 0.05 | 0.9 |
| `frostWeightPrimary` | 主按钮文字／图标权重  | 0–2 | 0.05 | 0.8 |
| `frostWeightIcons` | 右侧图标与拖柄权重  | 0–2 | 0.05 | 0.35 |
| `frostWeightEmpty` | 空白区域权重  | 0–2 | 0.05 | 0.05 |
| `tintStrength` | 染色强度  | 0–1.5 | 0.05 | 0 |

## 材质层开关

- `elevation`：悬浮轮廓（关闭对照23）；默认 true
- `regionalFrost`：按内容区域加权（关闭对照22）；默认 true
- `adaptiveFrost`：复杂背景自动毛玻璃（关闭对照20）；默认 true
- `adaptiveText`：文字自动明暗；默认 true
- `spatialText`：连续颜色场＋全部字形遮罩（关闭对照19）；默认 true
- `screenLight`：屏幕中心光源；默认 true
- `planoLens`：平凸透镜修正；默认 true
- `centerBalance`：中心亮度补偿；默认 true
- `highlight`：高光；默认 true
- `dualLight`：对角双向；默认 true
- `dispersion`：色散；默认 true
- `refraction`：折射；默认 true
- `blur`：模糊；默认 true
- `tint`：染色；默认 true
- `shade`：暗瓣；默认 true
- `contour`：细暗边；默认 true
- `shadow`：阴影；默认 true

`menuFrost` 默认 true：只对菜单使用固定 σ=6 DIP。关闭后跟随主体。`debugView` 为 normal / highlight / refraction，保存只保留 normal。采集目标 30 / 60 fps 不保证实际帧率。

## 动效

| 参数 | 名称 | 范围 | 步长 | 验收默认 |
| --- | --- | --- | --- | --- |
| `strength` | 总强度 × | 0.5–5 | 0.05 | 5 |
| `duration` | 整体时长 × | 0.75–1.25 | 0.05 | 1 |
| `bulge` | 鼓胀半径 DIP | 0–14 | 0.5 | 5 |
| `pull` | 拖拽形变 DIP | 0–22 | 0.5 | 22 |
| `light` | 接触光亮度 × | 0–5 | 0.05 | 2.5 |
| `waveRadius` | 光传播距离 DIP | 60–360 | 10 | 60 |
| `waveWidth` | 光波宽度 DIP | 8–72 | 2 | 8 |
| `waveMs` | 光传播时长 ms | 180–900 | 20 | 580 |
| `damping` | 松手阻尼（越低越弹）  | 0.18–0.8 | 0.01 | 0.27 |

`enabled`、`liquid` 默认 true；阶段 `stage` 为 1–4，默认 4。阶段依次增加按钮、抓起/松手、状态提示和焦点/拖动。`reduced` 默认 false，系统减少动态效果仍优先生效。

材质与动效独立保存，恢复预设和导入只影响预览。磁盘路径、失败回退和重启规则见 README。
