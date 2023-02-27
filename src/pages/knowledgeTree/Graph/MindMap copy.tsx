import React from "react";
import dagre from 'dagre';
import { Graph, Node } from "@antv/x6";
import TreeNode from "./shape";
import "./app.css";
import { API } from '@/common/entity/typings';
export enum attrsType {
  id = 'id',
  keyword = 'keyword',
  text = 'text/text',
  stat_name = 'title/text',
  stat_color = 'title/fill',
  stat_name_mark = '：',
}

export type treeObj = {
  id: number,
  text: string,
  keyword: string,
  children: treeObj[]
};

interface IProps {
  graphData: treeObj;
  knowExercise: API.KnowledgeItemExerciseCount
};

export default class MindMap extends React.Component<IProps> {
  private container?: HTMLDivElement;
  public graph!: Graph;
  private graphDta: {} | undefined;

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,//1
      sorting: 'approx',
      background: {
        color: '#f5f5f5',
      },
      interacting: {//定制节点和边的交互行为
        nodeMovable: false, //节点禁止拖动
        edgeMovable: false //边禁止拖动
      },
      selecting: {
        enabled: true,//开启点击
        multiple: false,//禁止多选
        rubberband: false,//禁用框选
        movable: false,//禁止连带移动
      },
      /**
       * Scroller 使画布具备滚动、平移、居中、缩放等能力，默认禁用
       * https://x6.antv.vision/zh/docs/api/graph/scroller#pannable
       */
      scroller: {
        enabled: true,
        pannable: true,//是否启用画布平移能力
        // pageVisible: false,//是否分页
        // pageBreak: false,//是否显示分页符
      },
      /**
       * 鼠标滚轮的默认行为是滚动页面
       * https://x6.antv.vision/zh/docs/api/graph/mousewheel
       */
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta', 'alt'],
      }
    })
    this.graph.zoom(-0.1)//缩放比例 
    if (this.props.graphData) {
      // console.log('this.props.graphDta 111111111', this.props.graphData)
      this.UNSAFE_componentWillReceiveProps(this.props);
    }
    // 展开/收缩节点   
    this.graph.on('node:collapse', ({ node }: { node: TreeNode }) => {
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const run = (pre: TreeNode) => {
        const succ = this.graph.getSuccessors(pre, { distance: 1 })
        if (succ) {
          succ.forEach((node: TreeNode) => {
            node.toggleVisible(!collapsed)
            if (!node.isCollapsed()) {
              run(node)
            }
          })
        }
      }
      run(node)
    })
    //自定义事件    
    this.setup();
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    console.log('MindMap componentWillReceiveProps...', nextProps)
    const { graphData, knowExercise } = nextProps;
    //过滤重复绘制图形
    if (this.graphDta === graphData || JSON.stringify(graphData) == "{}") {
      //渲染习题总数
      this.drawExercise(knowExercise);
      return;
    }
    this.graphDta = graphData;
    //清空画布节点
    this.graph?.clearCells();
    //非空不再渲染
    if (graphData === null || graphData === undefined) {
      return;
    }
    const rootNode = this.createNode(graphData);
    graphData.children.map((info: treeObj) => {
      // info构建node
      const parentNode = this.createNode(info)
      //root添加子节点
      this.createEdge(rootNode, parentNode)
      //遍历子节点的children
      this.forEachChild(info, parentNode)
    })
    this.layout();
    //渲染习题总数
    this.drawExercise(knowExercise)
  }

  /**
   * 
   * @param info 
   * @param parentNode 
   */
  // drawExercise = (knowExercise: API.KnowledgeItemExerciseCount[]) => {
  drawExercise = (knowExercise: any) => {
    if (!knowExercise || knowExercise.length == 0) {
      //先请求graph，然后再请求knowExercise，所以一定会在后边
      return;
    }
    this.graph.getNodes().map((item: Node) => {
      const knowledgeId = item.attr(attrsType.id);
      const current = knowExercise.filter(item => item.knowledgeId === knowledgeId)
      if (current.length > 0) {
        item.attr(attrsType.stat_name, '习题' + attrsType.stat_name_mark + current[0].progress);
      }
    })
  }

  /**
   * 递归创建节点
   * @param {*} info api data
   * @param {*} parentNode X6 node
   */
  forEachChild = (info: treeObj, parentNode: Node) => {
    info.children.map((childInfo: any, childIndex: number) => {
      const childNode = this.createNode(childInfo)
      this.createEdge(parentNode, childNode)
      this.forEachChild(childInfo, childNode)
    })
  }
  // 添加节点
  createNode = (info: any) => {
    console.log('info.text', info.text)
    const node = new TreeNode({
      shape: 'mind-map-rect',
      attrs: {
        id:info.id,
        keyword: info.keyword,
        text:{
          text:info.text +'\n'
        },
        title:{
          text:'习题：0'
        }
      },

    })
    return this.graph.addNode(node)
  }
  // 添加连线
  createEdge = (source: Node, target: Node) => {
    return this.graph.addEdge({
      shape: 'org-edge',
      source: { cell: source },
      target: { cell: target },
    })
  }
  // 自动布局
  layout = () => {
    const nodes = this.graph.getNodes()
    const edges = this.graph.getEdges()
    const g = new dagre.graphlib.Graph()
    g.setGraph({ rankdir: 'LR', nodesep: 16, ranksep: 16 })
    g.setDefaultEdgeLabel(() => ({}))

    const width = 260
    const height = 40

    nodes.forEach((node) => {
      g.setNode(node.id, { width, height })
    })

    edges.forEach((edge) => {
      const source = edge.getSource()
      const target = edge.getTarget()
      g.setEdge(source.cell, target.cell)
    })

    dagre.layout(g)

    this.graph.freeze()

    g.nodes().forEach((id: string) => {
      const node = this.graph.getCell(id) as Node
      if (node) {
        const pos = g.node(id)
        node.position(pos.x, pos.y)
      }
    })

    edges.forEach((edge) => {
      const source = edge.getSourceNode()!
      const target = edge.getTargetNode()!
      const sourceBBox = source.getBBox()
      const targetBBox = target.getBBox()

      const gap = targetBBox.x - sourceBBox.x - sourceBBox.width
      const fix = sourceBBox.width
      const x = sourceBBox.x + fix + gap / 2
      edge.setVertices([
        { x, y: sourceBBox.center.y },
        { x, y: targetBBox.center.y },
      ])
    })
    this.graph.unfreeze()
  }

  setup = () => {
    //自定义TODO...  
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  render() {
    return (
      <div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    );
  }
}
