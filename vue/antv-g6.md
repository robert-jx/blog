# AntV G6 树图与拓扑图实战

G6 是蚂蚁金服开源的图可视化引擎，可用于绘制树图、拓扑图、流程图等。在工作中需要展示组织架构、依赖关系等场景时，G6 是一个很好的选择。

## 安装

```bash
npm install @antv/g6 -s
```

## 基础用法

```html
<template>
  <div id="mountNode"></div>
</template>

<script>
import G6 from "@antv/g6";

export default {
  name: "g6-basic",
  mounted() {
    const graph = new G6.Graph({
      container: "mountNode",
      width: 800,
      height: 500,
      modes: {
        default: ["drag-canvas", "zoom-canvas", "drag-node"],
      },
      defaultNode: {
        type: "rect",
        style: {
          fill: "#e6f7ff",
          stroke: "#1890ff",
          radius: 4,
        },
        labelCfg: {
          style: {
            fill: "#000",
            fontSize: 14,
          },
        },
      },
      defaultEdge: {
        type: "cubic-horizontal",
        style: {
          stroke: "#a0a0a0",
          endArrow: true,
        },
      },
    });

    const data = {
      nodes: [
        { id: "node1", label: "根节点" },
        { id: "node2", label: "子节点1" },
        { id: "node3", label: "子节点2" },
      ],
      edges: [
        { source: "node1", target: "node2" },
        { source: "node1", target: "node3" },
      ],
    };

    graph.data(data);
    graph.render();
  },
};
</script>
```

## 树图实现

G6 提供了专门的树图布局，使用 `Mindmap` 或 `Dendrogram` 类型：

```html
<template>
  <div id="treeContainer"></div>
</template>

<script>
import G6 from "@antv/g6";

export default {
  name: "g6-tree",
  mounted() {
    const data = {
      id: "root",
      label: "技术架构",
      children: [
        {
          id: "frontend",
          label: "前端",
          children: [
            { id: "vue", label: "Vue" },
            { id: "react", label: "React" },
            { id: "angular", label: "Angular" },
          ],
        },
        {
          id: "backend",
          label: "后端",
          children: [
            { id: "node", label: "Node.js" },
            { id: "java", label: "Java" },
            { id: "python", label: "Python" },
          ],
        },
      ],
    };

    const graph = new G6.TreeGraph({
      container: "treeContainer",
      width: 800,
      height: 600,
      linkCenter: true,
      modes: {
        default: [
          "drag-canvas",
          "zoom-canvas",
          "drag-node",
          "collapse-expand",
        ],
      },
      defaultNode: {
        type: "rect",
        size: [120, 40],
        style: {
          fill: "#f0f5ff",
          stroke: "#adc6ff",
          radius: 4,
        },
        labelCfg: {
          style: {
            fill: "#000",
            fontSize: 14,
          },
        },
      },
      defaultEdge: {
        type: "cubic-horizontal",
        style: {
          stroke: "#a3b1bf",
        },
      },
      layout: {
        type: "mindmap",
        direction: "H",
        getHeight: () => 40,
        getWidth: () => 120,
        getVGap: () => 20,
        getHGap: () => 50,
      },
    });

    graph.data(data);
    graph.render();
    graph.fitView();
  },
};
</script>
```

### 树图节点收缩展开

G6 内置了 `collapse-expand` 行为，配合节点的 `collapsed` 属性控制：

```js
// 节点默认折叠
{
  id: "frontend",
  label: "前端",
  collapsed: true,  // 默认折叠
  children: [...]
}
```

## 拓扑图实现

拓扑图通常用于展示网络结构、设备连接等场景：

```html
<template>
  <div id="topoContainer"></div>
</template>

<script>
import G6 from "@antv/g6";

export default {
  name: "g6-topology",
  mounted() {
    const data = {
      nodes: [
        { id: "server1", label: "服务器1", type: "circle", style: { fill: "#ff7875" } },
        { id: "server2", label: "服务器2", type: "circle", style: { fill: "#ff7875" } },
        { id: "database", label: "数据库", type: "rect", style: { fill: "#95de64" } },
        { id: "cache", label: "缓存", type: "rect", style: { fill: "#fff566" } },
        { id: "loadBalancer", label: "负载均衡", type: "diamond", style: { fill: "#69c0ff" } },
        { id: "client1", label: "客户端1", type: "rect", style: { fill: "#d9d9d9" } },
        { id: "client2", label: "客户端2", type: "rect", style: { fill: "#d9d9d9" } },
      ],
      edges: [
        { source: "loadBalancer", target: "server1" },
        { source: "loadBalancer", target: "server2" },
        { source: "server1", target: "database" },
        { source: "server1", target: "cache" },
        { source: "server2", target: "database" },
        { source: "server2", target: "cache" },
        { source: "client1", target: "loadBalancer" },
        { source: "client2", target: "loadBalancer" },
      ],
    };

    const graph = new G6.Graph({
      container: "topoContainer",
      width: 800,
      height: 600,
      modes: {
        default: ["drag-canvas", "zoom-canvas", "drag-node", "click-select"],
      },
      defaultNode: {
        type: "circle",
        size: 60,
        style: {
          fill: "#e6f7ff",
          stroke: "#1890ff",
          lineWidth: 2,
        },
        labelCfg: {
          position: "bottom",
          offset: 10,
          style: {
            fontSize: 12,
          },
        },
      },
      defaultEdge: {
        type: "polyline",
        style: {
          stroke: "#87e8de",
          lineWidth: 2,
          endArrow: {
            path: G6.Arrow.triangle(),
            fill: "#87e8de",
          },
        },
      },
      layout: {
        type: "dagre",
        rankdir: "LR",
        nodesep: 30,
        ranksep: 50,
      },
    });

    graph.data(data);
    graph.render();
  },
};
</script>
```

## 交互事件

G6 支持丰富的事件交互：

```js
// 点击节点
graph.on("node:click", (evt) => {
  const { item } = evt;
  console.log("点击了节点:", item.getModel());
});

// 悬停节点
graph.on("node:mouseenter", (evt) => {
  const { item } = evt;
  graph.setItemState(item, "hover", true);
});

graph.on("node:mouseleave", (evt) => {
  const { item } = evt;
  graph.setItemState(item, "hover", false);
});

// 节点双击
graph.on("node:dblclick", (evt) => {
  const { item } = evt;
  // 展开/折叠子节点
  graph.updateItem(item, {
    collapsed: !item.getModel().collapsed,
  });
});
```

## 样式主题

可以通过配置 `nodeStateStyles` 和 `edgeStateStyles` 实现不同状态下的样式：

```js
const graph = new G6.Graph({
  // ... 其他配置
  nodeStateStyles: {
    hover: {
      fill: "#bae7ff",
      stroke: "#1890ff",
      lineWidth: 3,
    },
    selected: {
      fill: "#91d5ff",
      stroke: "#096dd9",
      lineWidth: 4,
    },
  },
  edgeStateStyles: {
    hover: {
      stroke: "#1890ff",
      lineWidth: 3,
    },
  },
});
```

## 导出图片

G6 支持将画布导出为图片：

```js
// 导出为 base64
const dataURL = graph.toDataURL();

// 下载图片
graph.downloadFullImage("topology", "image/png");
```

## 性能优化

1. **大量节点时使用集群模式**：配置 `clusterNode` 
2. **使用 `layout`**：合理选择布局算法减少计算量
3. **设置 `animate`**：节点多时关闭动画提升性能
4. **使用 `graph.setAutoPaint(false)`**：批量更新时关闭自动重绘，手动调用 `graph.paint()`

```js
graph.setAutoPaint(false);
// 批量更新节点
data.nodes.forEach(node => {
  graph.updateItem(node.id, { style: { fill: 'red' } });
});
graph.paint();
graph.setAutoPaint(true);
```

## 懒加载实现

当图中节点数量非常多时，一次性渲染所有节点会导致性能问题。G6 提供了懒加载（只渲染可见区域节点）的能力。

### 方式一：使用插件实现懒加载

G6 提供了 `Grid` 插件配合视口裁剪实现懒加载：

```html
<template>
  <div id="lazyContainer"></div>
</template>

<script>
import G6 from "@antv/g6";
import { Grid } from "@antv/g6-plugin";

export default {
  name: "g6-lazy-load",
  mounted() {
    const grid = new Grid();

    const graph = new G6.Graph({
      container: "lazyContainer",
      width: 800,
      height: 600,
      plugins: [grid],
      viewport: {
        center: [400, 300],
        zoom: 1,
      },
      defaultNode: {
        type: "circle",
        size: 30,
        style: {
          fill: "#e6f7ff",
          stroke: "#1890ff",
        },
      },
      defaultEdge: {
        style: {
          stroke: "#a0a0a0",
          endArrow: true,
        },
      },
    });

    // 生成大量测试数据
    const data = { nodes: [], edges: [] };
    for (let i = 0; i < 1000; i++) {
      data.nodes.push({
        id: `node${i}`,
        label: `节点${i}`,
        x: Math.random() * 1600,
        y: Math.random() * 1200,
      });
      if (i > 0) {
        data.edges.push({
          source: `node${i - 1}`,
          target: `node${i}`,
        });
      }
    }

    graph.data(data);
    graph.render();
  },
};
</script>
```

### 方式二：手动实现分页加载

适用于数据量超大，需要从服务端分页获取的场景：

```html
<template>
  <div id="paginationContainer"></div>
</template>

<script>
import G6 from "@antv/g6";

export default {
  name: "g6-pagination",
  data() {
    return {
      graph: null,
      pageSize: 100,
      currentPage: 0,
      totalNodes: 5000,
      loadedData: { nodes: [], edges: [] },
    };
  },
  mounted() {
    this.initGraph();
    this.loadMoreData();
  },
  methods: {
    initGraph() {
      this.graph = new G6.Graph({
        container: "paginationContainer",
        width: 800,
        height: 600,
        modes: {
          default: ["drag-canvas", "zoom-canvas", "drag-node"],
        },
        defaultNode: {
          type: "circle",
          size: 30,
          style: {
            fill: "#e6f7ff",
            stroke: "#1890ff",
          },
        },
      });
    },
    async loadMoreData() {
      const start = this.currentPage * this.pageSize;
      const end = Math.min(start + this.pageSize, this.totalNodes);

      // 模拟从服务端获取数据
      const newNodes = [];
      for (let i = start; i < end; i++) {
        newNodes.push({
          id: `node${i}`,
          label: `节点${i}`,
          x: Math.random() * 800,
          y: Math.random() * 600,
        });
      }

      // 添加新数据
      this.loadedData.nodes = [...this.loadedData.nodes, ...newNodes];
      this.graph.changeData(this.loadedData);

      this.currentPage++;

      // 如果还有更多数据，可以继续加载
      if (end < this.totalNodes) {
        console.log(`已加载 ${end}/${this.totalNodes} 个节点`);
      }
    },
  },
  beforeDestroy() {
    if (this.graph) {
      this.graph.destroy();
    }
  },
};
</script>
```

### 方式三：点击加载子节点

适用于树形结构的动态加载：

```html
<template>
  <div id="expandContainer"></div>
</template>

<script>
import G6 from "@antv/g6";

export default {
  name: "g6-expand-load",
  mounted() {
    const graph = new G6.Graph({
      container: "expandContainer",
      width: 800,
      height: 600,
      modes: {
        default: ["drag-canvas", "zoom-canvas", "drag-node"],
      },
      defaultNode: {
        type: "rect",
        size: [100, 40],
        style: {
          fill: "#e6f7ff",
          stroke: "#1890ff",
          radius: 4,
        },
      },
      defaultEdge: {
        type: "cubic-vertical",
        style: {
          stroke: "#a0a0a0",
          endArrow: true,
        },
      },
    });

    // 初始数据 - 只有根节点
    const data = {
      nodes: [
        {
          id: "root",
          label: "根节点",
          hasChildren: true, // 标记是否有子节点未加载
          loaded: false, // 标记是否已加载子节点
        },
      ],
      edges: [],
    };

    graph.data(data);
    graph.render();

    // 点击节点时加载子节点
    graph.on("node:click", async (evt) => {
      const { item } = evt;
      const model = item.getModel();

      // 如果节点已经有子节点且未加载
      if (model.hasChildren && !model.loaded) {
        // 模拟异步加载子节点
        const children = await this.loadChildren(model.id);

        // 添加子节点
        children.forEach((child) => {
          graph.addItem("node", child);
          graph.addItem("edge", {
            source: model.id,
            target: child.id,
          });
        });

        // 更新父节点状态
        graph.updateItem(item, {
          loaded: true,
          style: {
            fill: "#d9f7be", // 已加载的节点改变颜色
            stroke: "#52c41a",
          },
        });

        // 重新布局
        graph.layout();
      }
    });
  },
  methods: {
    loadChildren(parentId) {
      // 模拟从服务端获取子节点
      return new Promise((resolve) => {
        setTimeout(() => {
          const children = [];
          const childCount = Math.floor(Math.random() * 5) + 1;
          for (let i = 0; i < childCount; i++) {
            children.push({
              id: `${parentId}-${i}`,
              label: `子节点${i}`,
              hasChildren: Math.random() > 0.5,
              loaded: false,
            });
          }
          resolve(children);
        }, 500);
      });
    },
  },
};
</script>
```

### 懒加载性能优化建议

1. **设置合适的 `animate`**：大量节点时关闭动画
   ```js
   animate: false,
   ```

2. **使用 `lruCache`**：缓存已渲染的节点
   ```js
   nodeStateStyles: {
     // 配置缓存
   }
   ```

3. **合理设置视口大小**：根据实际容器大小设置，避免渲染过多不可见节点

4. **使用 `fitView`**：初始加载时自动适应视图
   ```js
   graph.fitView();
   ```

5. **分批渲染**：使用 `requestAnimationFrame` 分批添加大量节点
   ```js
   const nodes = [...]; // 大量节点
   const batchSize = 50;
   let index = 0;

   function renderBatch() {
     const batch = nodes.slice(index, index + batchSize);
     batch.forEach(node => graph.addItem('node', node));
     index += batchSize;

     if (index < nodes.length) {
       requestAnimationFrame(renderBatch);
     }
   }

   renderBatch();
   ```
