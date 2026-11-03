# 第 2 课 · Transform Geometry 与 Join Geometry：移动、旋转、拼出第一个小场景

> **衔接说明**  
> 第 1 课你已经会：给物体挂 Geometry Nodes 修改器、打开 Geometry Node Editor、用 **Cube** 生成网格、把 **Size** 暴露到修改器面板。  
> 今天不讲 Field（场），也不讲 Instance on Points。我们只做两件「积木级」的事：  
> **整块挪动（Transform Geometry）**，以及 **把两块拼成一件（Join Geometry）**。  
> 目标软件：**Blender 5.2 LTS**。节点名一律用 **英文官方名**，旁边用中文解释。

---

## 这节课你要带走什么

学完这一课，你应该能自信地说出并亲手做到：

1. **Transform Geometry（变换几何）** 对 **一整块 Geometry** 做 Translation（平移）/ Rotation（旋转）/ Scale（缩放），**不改拓扑**（点数、面数、谁连谁都不变）。
2. **Join Geometry（合并几何）** 把 **多条 Geometry 流** 并成 **一条**，再送进 **Group Output**。
3. 你能自己搭：一条流生成 **Cube** 做底座，另一条流生成 **UV Sphere** 做上层；各自 Transform，再 Join。
4. 修改器面板上至少能拧三个参数：**Gap**（上下间距）、**TopScale**（上层缩放）、**Yaw**（整体绕 Z 旋转，单位是 **弧度**）。
5. （可选）用 **Set Material** 给上下两件不同颜色——好看，但不是考点。

**本课故意不讲：** Field、Instance on Points、Set Position 逐点挪动、Realize Instances。那些会在后面的课出现。

---

## 先讲为什么：只有「造」还不够，还要「摆」和「拼」

第 1 课像学会「用打印机打出一块积木」。  
可动效 Logo、小场景、标题底座……几乎从来不是一块积木搞定。

你会很快碰到两件很具体的事：

- **摆**：球想浮在方块上方一点，不能永远叠在原点。  
- **拼**：方块和球是两条生成线，但 **Group Output 只有一个 Geometry 入口**——你总得先把它们合成「一件东西」再交出去。

Transform 负责「摆」，Join 负责「拼」。  
学完这两个，你就能搭出今天的极简 Logo 底座：**暖色大方块 + 上方蓝球**，像一个会呼吸的品牌底座草稿。

---

## 案例先打开：先看结果，再拆菜谱

请在云电脑打开：

`C:\Users\Grace\Documents\GeometryNodesCourse\blends\L02_transform_and_join.blend`

场景主物体名：**`L02_Transform_Join`**。  
节点组同名：**`L02_Transform_Join`**。

选中物体，看 **Modifier Properties**：

| 参数 | 默认大约 | 你拧它时会发生什么 |
|------|----------|--------------------|
| **Gap** | 0.85 | 上层球沿 Z 升高 / 降低（上下间距） |
| **TopScale** | 0.55 | 上层球整体变大 / 变小 |
| **Yaw** | 0.4 | 整件（方块+球）绕 Z 旋转；单位是 **弧度**（0.4 ≈ 23°） |

先拧三下玩一会儿。玩完再往下读——你会带着画面感听概念。

案例渲染参考（Eevee 棚拍光，**保持原样**，未做美化；可当作「视口结果」对照）：

![案例结果 · 斜角](../assets/L02/01_viewport_logo_result.png)

![案例结果 · 偏正面](../assets/L02/02_viewport_logo_front.png)

> 说明：这两张是案例文件用相机渲染出来的参考图，不是手工 P 过的宣传图。你本机视口角度不同、主题不同，颜色和阴影略有差别完全正常。

---

## 概念一：Transform Geometry 在做什么

请先看概念图：

![Transform Geometry 概念](../assets/L02/03_transform_geometry.png)

### 一句话

> **Transform Geometry = 把整块几何当成一件积木，用手挪、转、放大缩小。**  
> 它 **不改** 积木内部结构（拓扑），只改「这件东西在空间里怎么放」。

### 三个旋钮分别是什么

| 英文插座 | 中文 | 直观理解 |
|----------|------|----------|
| **Translation** | 平移 | 往哪挪：XYZ 三个方向的位移 |
| **Rotation** | 旋转 | 怎么转：在几何节点里通常是 **欧拉角，单位弧度** |
| **Scale** | 缩放 | 放大还是缩小：可分轴，也可三轴同一数值 |

### 和「在物体模式按 G/R/S」的异同

- **像**：都是动整件。  
- **不像**：这里动的是 **节点树算出来的那块 Geometry**，参数可以暴露、可动画、可跟别的节点连线；不是一次性的手工变换。

### 和后面会学的 Set Position 有什么不同（先建立边界）

- **Transform Geometry**：整块统一变换。  
- **Set Position**（后课）：可以按「每个点自己的便签（Field）」分别挪——那是另一套思维。  
今天请只记住 Transform 这一边。

### 弧度小抄（Yaw 会用到）

Blender 几何节点的旋转，默认按 **弧度** 思考最省事：

| 角度 | 约等于弧度 |
|------|------------|
| 90° | π/2 ≈ 1.5708 |
| 180° | π ≈ 3.1416 |
| 360° | 2π ≈ 6.2832 |

案例默认 Yaw = 0.4，大约 23°，只是让 Logo 稍微「扭」一点，不至于正对相机太死板。

---

## 概念二：Join Geometry 在做什么

请看泳道图：

![Join Geometry 双流合并](../assets/L02/04_join_geometry.png)

### 一句话

> **Group Output 只收一条 Geometry 水管。**  
> 零件再多，也要先用 **Join Geometry** 并成「一件拼好的东西」，再交给 Output。

### 泳道怎么理解

本课案例就是两条泳道：

1. **泳道 A（底座）**  
   `Cube →（可选材质）→ Transform Geometry →` 流 A  
2. **泳道 B（上层）**  
   `UV Sphere →（可选材质）→ Transform Geometry（Gap / TopScale）→` 流 B  
3. **汇合**  
   `流 A + 流 B → Join Geometry →`（可选再 Transform 做 Yaw）`→ Group Output`

Join 节点在 Blender 5.x 里是一个 **可多次接入的 Geometry 多输入**：你把两根（或更多根）Geometry 线都拖到它的 Geometry 入口上即可。

### 常见误解

- **误解：** Join 是「布尔并集，融成一个流形」。  
  **其实：** 更像「把两袋零件倒进同一个袋子」。两边网格都还在，只是变成同一条 Geometry 流往下走。  
- **误解：** 可以把两根线都直接接到 Group Output。  
  **其实：** Output 通常只留一个 Geometry 结果；多件要先 Join（或用别的合并手段，本课只用 Join）。

---

## 本课参数地图（对照修改器面板）

![三个暴露参数](../assets/L02/05_exposed_parameters.png)

| 参数 | 接到哪里 | 视觉效果 |
|------|----------|----------|
| **Gap** | 上层 Transform 的 **Translation.Z** | 球离底座多远 |
| **TopScale** | 上层 Transform 的 **Scale.X/Y/Z**（同一值） | 球整体大小 |
| **Yaw** | Join **之后** 那层 Transform 的 **Rotation.Z** | 整件一起绕竖轴转 |

为什么 Yaw 放在 Join 之后？  
因为我们想要「方块和球锁在一起转」，而不是只转球、底座不动。  
**先拼，再整体转**——这个顺序本身就是动效思维。

---

## 手把手：从空白自己搭一遍（推荐）

下面假设你已会第 1 课的：Add Modifier → Geometry Nodes、打开 Geometry Node Editor、Shift+A 加节点。  
只把 **本课新增** 的步骤写细。

### 步骤 A：新建节点组载体

1. 新建场景，加任意网格物体当载体（叫什么都行）。  
2. Add Modifier → **Geometry Nodes** → New。  
3. 把节点组改名为 `L02_Transform_Join`（可与案例一致，方便对照）。  
4. **断开** Group Input → Group Output 的默认 Geometry 线（和第 1 课一样）。

### 步骤 B：搭底座泳道（Cube）

1. Shift+A → Mesh → **Cube**。  
2. 把 Cube 的 Size 调成「扁一点的大方块」感觉即可（案例大约 X/Y 较大、Z 较薄；版本若只有单一 Size，先用默认再靠 Transform 微调）。  
3. （可选）加 **Set Shade Smooth**，关掉平滑，棱角更清楚。  
4. （可选）加 **Set Material**，选一个暖色材质。  
5. 加 **Transform Geometry**，接到底座链末端。  
   - Translation 可略向下（例如 Z = -0.15），让整体更靠近世界原点。  
6. **先不要接 Output。** 这条线待会儿进 Join。

### 步骤 C：搭上层泳道（UV Sphere）

1. Shift+A → Mesh → **UV Sphere**（或 Ico Sphere，效果同类；案例用 UV Sphere）。  
2. （可选）Set Shade Smooth 打开；Set Material 选冷色。  
3. 再加一个 **Transform Geometry**。  
4. 在 Group 接口里新增 Float 输入：  
   - `Gap`（默认 0.85）  
   - `TopScale`（默认 0.55）  
5. 用 **Combine XYZ**：  
   - Gap → Combine 的 Z → 接到上层 Transform 的 **Translation**  
   - TopScale → Combine 的 X/Y/Z → 接到上层 Transform 的 **Scale**  
6. 同样 **先不要接 Output**。

### 步骤 D：Join，再整体 Yaw

1. Shift+A → Geometry → **Join Geometry**。  
2. 把底座 Transform 的 Geometry、上层 Transform 的 Geometry，**都接到** Join 的 Geometry 入口。  
3. 再加第三个 **Transform Geometry**，接在 Join 后面。  
4. 接口新增 Float：`Yaw`（默认 0.4）。  
5. Combine XYZ：Yaw → Z → 接到这个 Transform 的 **Rotation**。  
6. 最后：该 Transform 的 Geometry → **Group Output**。

### 步骤 E：验收

- 修改器上看得到 Gap / TopScale / Yaw。  
- 拧 Gap：球上下跑。  
- 拧 TopScale：球变大变小，底座基本不动。  
- 拧 Yaw：两件 **一起** 转。

如果你的结果和案例方向差 90°，多半是相机角度或 Yaw 正负不同——以「参数是否联动正确」为准，不必像素级对齐。

---

## 对照案例：每个节点为什么在

打开案例节点组 `L02_Transform_Join`，从左到右可以按框来读：

| 区域 | 主要节点（英文名） | 职责 |
|------|-------------------|------|
| 底座框 | **Cube** → Set Shade Smooth → Set Material → **Transform Geometry** | 生成底座并摆好 |
| 上层框 | **UV Sphere** → Set Shade Smooth → Set Material → **Transform Geometry** | 生成上层；Gap / TopScale 打进这里 |
| 汇合框 | **Join Geometry** → **Transform Geometry**（Yaw） | 先拼再整体转 |
| 两端 | **Group Input** / **Group Output** | 暴露参数；输出最终几何 |
| 辅助 | **Combine XYZ** ×3 | 把单个 Float 填进向量的某一个分量 |

**特意没有做的事：**

- 没有 Instance on Points  
- 没有用 Field 控制每个点的位置  
- 没有 Realize Instances  
- 没有把原始 Group Input.Geometry 拼进结果（它闲置，和第 1 课同款教学意图）

场景里还有一个深色地面和三盏 Area 灯，只为渲染参考好看；**它们不是节点树的一部分**。

---

## 小练习（做完才算上完课）

1. **只拧参数**  
   把 Gap 调到 0.2 和 2.0；TopScale 调到 0.2 和 1.2；Yaw 调到 0 和 1.57（约 90°）。用嘴巴说出每一次视口变化对应哪条连线。

2. **换上层基本体**  
   把 UV Sphere 换成 **Cylinder**（圆柱）或 **Ico Sphere**。  
   Transform / Join / 三个参数的逻辑应保持不变——你换的是「水源」，不是「水管结构」。

3. **（可选）错位摆放**  
   给上层 Transform 的 Translation 不只接 Z：让 X 或 Y 也有一个小偏移，做「球不在正中」的错位 Logo。  
   你可以再暴露一个 `OffsetX`，但不是必须。

4. **（可选）颜色**  
   没有材质也合格；有材质只是为了上下两件更好认。

---

## 常见卡点

### 1. Join 了但只看见一件

- 另一件是不是 Scale 成了 0？  
- Gap 是不是大到飞出视野？  
- 某一条泳道是不是根本没接到 Join？

### 2. 拧 Yaw 只转球、不转底座

- Yaw 的 Transform 是不是误接在上层泳道里、而不是 Join **后面**？  
- 记住口诀：**先 Join，再整体 Transform。**

### 3. 修改器没有 Gap / TopScale / Yaw

- 接口里创建了，但忘记从 Group Input 连出去。  
- 或者连到了节点内部默认值，没有接到 Group Input 的输出插座。

### 4. 旋转「转得好怪 / 转不动」

- 确认单位是弧度：拧到 1.57 才大约 90°。  
- Rotation 插座要接到 Combine XYZ 出来的向量（Z 分量是 Yaw）。

### 5. 和案例颜色、灯光不一致

- 完全没关系。本课考核的是 **Transform + Join + 参数暴露**，不是调色。

---

## 收工检查清单

- [ ] 能用自己的话解释 Transform Geometry 与「改拓扑」的区别  
- [ ] 能说清为什么多件零件要先 Join 再进 Group Output  
- [ ] 自己搭出 Cube + UV Sphere（或同类基本体）双流，再 Join  
- [ ] 修改器上可调 Gap、TopScale、Yaw，并且行为符合预期  
- [ ] 完成「换上层基本体」小练习  

---

## 下节预告

第 3 课会继续在「看得懂、搭得稳」上加一块：

**怎么读节点编辑器** —— 插座颜色、连线、Viewer（查看器）当手电筒，以及如何快速确认「这一截水管里现在流着什么」。

仍然把 Field 深水留到更后面；我们先把空间变换与合流用熟。

---

## 本课文件一览

| 类型 | 路径 |
|------|------|
| 课件 | `lessons/L02_transform_and_join.md` |
| 案例 | `blends/L02_transform_and_join.blend` |
| 配图 | `assets/L02/`（视口参考 ×2 + 概念图 ×3） |
| 脚本 | `scripts/create_L02.py`、`scripts/gen_l02_illustrations.py` |

Google Drive 同步文件夹：课程根目录 `GeometryNodesCourse`（与云电脑同结构）。

---

*L02 · Transform Geometry & Join Geometry · Blender 5.2 LTS*
