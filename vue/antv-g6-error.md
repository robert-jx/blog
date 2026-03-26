# 通道档案树（G6 TreeGraph）问题记录与修复说明

本文档梳理「懒加载子节点先出现后又被父节点收起」等问题的排查过程与最终方案，对应实现文件：`ggTree.vue`。

---

## 1. 问题现象

- **现象 A**：点击需要懒加载的节点后，子节点会先渲染出来，随后整棵子树又被收起来，视觉上像「闪一下又折叠」。
- **现象 B（曾讨论）**：生产环境使用 HTTPS 是否会导致上述现象。

---

## 2. 技术背景

| 项 | 说明 |
|----|------|
| 图类型 | `G6.TreeGraph`（`@antv/g6` 4.8.x，实际由 `@antv/g6-pc` 提供行为与插件） |
| 交互 | `modes.default` 中配置了 `collapse-expand`，以及自定义 `node:click` 做接口懒加载 |
| 懒加载 | 点击节点后请求 `getTagRegionCount` / `getChannelByPage`，再 `changeData`、`layout` 等更新树 |

---

## 3. 排查过程（按时间线）

### 3.1 初步猜测：HTTPS 影响

- **结论**：HTTPS **通常不会**直接导致「先展开再收起」这种纯前端交互顺序问题。
- **例外**：若页面是 `https`，而接口被配置成明文 `http` 且非同源代理，浏览器可能拦截混合内容（Mixed Content），请求失败会导致子节点不出现或逻辑异常；但与本问题描述的「已出现再收起」不完全一致。
- 本项目业务请求多通过 `axios` + `process.env.VUE_APP_BASE_API`（相对同源或统一网关），与 G6 画布折叠无直接耦合；`public/ip-config.js` 中的 `window.httpType` 主要用于 WebSocket/登录等参数，与树懒加载 axios 路径无必然关系。

### 3.2 第一次尝试：在 `collapse-expand` 的 `onChange` 里 `return false`

- **设想**：通过 `onChange` 阻止折叠状态写入。
- **结果**：**无效**。
- **原因**：需对照 G6 4.8 源码（`node_modules/@antv/g6-pc/lib/behavior/collapse-expand.js`）：
  - `trigger === 'click'` 时，`onNodeClick` 内部使用 **`setTimeout(..., 200)`** 延迟执行 `toggle`。
  - `toggle` 中**先**根据源数据计算 `collapsed = !sourceData.collapsed`，**直接写入** `sourceData.collapsed` 与 `item.getModel().collapsed`，再 `emit('itemcollapsed')`，然后才调用 `onChange`，最后**无条件**执行 `this.graph.layout()`。
  - 因此：`onChange` 的返回值**不能**阻止前面已写入的 `collapsed`，也**不能**阻止最后的 `layout()`；与「在 onChange 里拦截」的预期不符。

### 3.3 根因归纳

1. **时序冲突**：懒加载是异步的；接口返回后子节点已挂上并布局，约 **200ms** 后 `collapse-expand` 的延迟 `toggle` 才执行，把父节点当成「用户再次点击要折叠」处理，触发 `layout`，子树被收起。
2. **误判修复点**：问题不在 HTTPS，而在 **G6 `collapse-expand` 的 200ms 防抖/延迟** 与 **异步懒加载** 叠加。

---

## 4. 最终方案（已实现）

### 4.1 使用 `shouldBegin` 在折叠逻辑入口拦截

`collapse-expand` 在 `toggle` 开头会调用 `shouldBegin(e, collapsed, this)`，若返回 `false`，则**不会**修改 `collapsed`、也不会继续 `layout`。

在 `ggTree.vue` 中为 `collapse-expand` 配置：

- **`shouldBegin`**：
  - 若节点带有 **`_lazyExpandLocked`**（短期锁），强制 `collapsed = false` 并 `return false`，避免延迟 200ms 的那次折叠生效。
  - 若为懒加载节点（`hasChildren && !loaded`）且仍在加载或尚无子数据（`loading` 或 `children` 为空），同样 `return false`，避免与懒加载展开冲突。
- **`onChange`**：仅同步 `item.getModel().collapsed` 与行为传入的 `collapsed`（在允许折叠时保持一致）。

### 4.2 懒加载点击时加短期锁

在 `node:click` 里，在发起请求前：

- `model.loading = true`
- `model._lazyExpandLocked = true`
- 使用 `model._lazyExpandTs` 记录本次锁的时间戳，`setTimeout(..., 260)` 后仅当时间戳仍匹配时解锁，避免与 `collapse-expand` 的 **200ms** 延迟撞车，并减少快速连点导致锁状态错乱。

### 4.3 与生产环境的关系

- 部署为 HTTPS 后，只要重新构建并带上上述前端逻辑，**不需要**为「收起闪烁」单独改协议。
- 若懒加载接口在生产失败，应查 Network 面板（4xx/5xx、混合内容、CORS），属于另一类问题。

---

## 5. 相关代码位置（便于维护）

| 内容 | 文件与位置 |
|------|------------|
| `collapse-expand` 的 `shouldBegin` / `onChange` | `ggTree.vue` → `modes.default` 内 |
| 懒加载锁 `_lazyExpandLocked` | `ggTree.vue` → `graph.on('node:click', ...)` 内 |
| G6 4.8 行为源码参考 | `node_modules/@antv/g6-pc/lib/behavior/collapse-expand.js` |

---

## 6. 附录：小地图（Minimap）与文档版本

- 官方文档 [Minimap 插件](https://g6.antv.antgroup.com/manual/plugin/minimap) 面向 **G6 5.x**，配置形如 `plugins: [{ type: 'minimap', ... }]`。
- 本项目为 **G6 4.8.x**，应使用 **`new G6.Minimap({ ... })`** 作为插件实例传入 `plugins`，并在样式中通过 `#treeGraph .g6-minimap` 等做定位与外观（详见 `ggTree.vue`）。

---

## 7. 小结

| 问题 | 根因 | 修复要点 |
|------|------|----------|
| 懒加载后子节点先出现后收起 | `collapse-expand` 在 click 下 **200ms 延迟 toggle**，与异步懒加载时序冲突 | 用 **`shouldBegin` + `_lazyExpandLocked`** 在写入 `collapsed` 之前拦截 |
| HTTPS 是否主因 | 否（除非接口被拦导致请求失败） | 区分网络错误与 G6 行为时序 |
