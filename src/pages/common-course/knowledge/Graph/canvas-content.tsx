
import { Menu, message, Modal } from 'antd';
import { Graph, Node } from "@antv/x6";
import { FileAddOutlined, DeleteOutlined, DownSquareOutlined, UpSquareOutlined } from '@ant-design/icons';
import { getKnowLedgeInfo, getKnowLedgeParent } from '../utils/knowledge'
import MindMap, { treeObj, attrsType } from '@/pages/knowledgeTree/Graph/MindMap'
import { API } from '@/common/entity/typings';

interface IProps {
  setData: (data: treeObj) => void;
  setGraph: (graph: Graph) => void;
  graphData: treeObj;
  knowExercise: API.KnowledgeItemExerciseCount
  setCellA: (graph: Graph) => void;
  setPromptState: (v: boolean) => void;
};

export default class CanvasContent extends MindMap {
  constructor(props: IProps) {
    super(props);
    this.state = {
      nodeIndex: -2  //新增情况下-1是root
    };
  }

  cellRef: HTMLDivElement | undefined = undefined;

  componentDidMount() {
    super.componentDidMount();
    this.props.setGraph(this.graph)
    this.graph.zoom(-0.2);
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    super.UNSAFE_componentWillReceiveProps(nextProps);
  }
  /**
   * 监听自定义事件
   */
  setup = () => {
    const that: any = this;
    //双击事件
    this.graph.on('node:dblclick', ({ cell, e }) => {
      const p = this.graph.clientToGraph(e.clientX, e.clientY)
      console.log('node', p.x, p.y)
      cell.addTools([
        {
          name: 'editableCell',
          args: {
            x: p.x,
            y: p.y,
            onHide() {
              // console.log('this.graph',cell,that.props.graphData)
              const text = cell.attr('name/textWrap/text');
              console.log('hide...', text, cell.id, that.props.graphData)
              that.props.setCellA(cell);
              /**
               * a.修改上层知识树字符串的值
               * b.验证是否是root节点
               * c.同ConfigPanel inputChange方法相同
               */
              if (that.graph.isRootNode(cell)) {
                that.props.graphData['text'] = text;
                that.props.setPromptState(true)
              } else {
                const leafId: number = cell.attr(attrsType.id);
                let leafData: any = getKnowLedgeInfo(that.props.graphData.children, leafId)
                leafData['text'] = text;
              }
            }
          },
        },
      ])
    })

    //右键菜单
    this.graph.on('node:contextmenu', ({ cell, e }) => {
      console.log('node:contextmenu cell =======', cell)
      const id = cell.attr(attrsType.id) as number;
      // console.log(this.props.graphData)
      //default menu status
      var delFlag = false, topFlag = false, downFlag = false;
      if (this.graph.isRootNode(cell)) {
        //is root node
        delFlag = true;
        topFlag = true;
        downFlag = true;
      } else {
        //查找选中节点父类数据对象,同层的集合
        const children = getKnowLedgeParent(this.props.graphData, id)?.children as treeObj[];
        if (children.length === 1) {
          //同层只有1个元素，禁用上下
          topFlag = true;
          downFlag = true;
        } else {
          const index = children.findIndex(info => info.id === id);
          if (index === 0) topFlag = true //最上层禁用上移
          else if (index === children.length - 1) downFlag = true //最下层禁用下移
        }
      }
      const p = this.graph.clientToGraph(e.clientX, e.clientY)
      const menu = (
        <Menu className="x6-menu" onClick={(e: Event) => this.handleMenuClick(e, cell)}>
          <Menu.Item key="1" icon={<FileAddOutlined />}>添加</Menu.Item>
          <Menu.Item key="2" icon={<DeleteOutlined />} disabled={delFlag}>删除</Menu.Item>
          <Menu.Item key="3" icon={<UpSquareOutlined />} disabled={topFlag}>上移</Menu.Item>
          <Menu.Item key="4" icon={<DownSquareOutlined />} disabled={downFlag}>下移</Menu.Item>
        </Menu>
      )
      // debugger
      cell.addTools([
        {
          name: 'contextmenu',
          args: {
            menu,
            x: p.x,
            y: p.y,
            onHide() {
              console.log('cell.addTools onHide......')
              cell.removeTools()
            },
          },
        },
      ])
    })
  }

  /**
 * 菜单点击事件
 * @param {*} event 点击事件
 * @param {*} node 选中当前节点
 */
  handleMenuClick = (event: Event, node: Node) => {
    const { key } = event;
    const id = node.attr(attrsType.id);
    this.props.setPromptState(true);//使用菜单后修改为未保存状态

    if (key === '1') {
      //添加的节点数据
      const newData = { id: this.state.nodeIndex, text: '新建节点', children: [] };
      this.setState({ nodeIndex: this.state.nodeIndex - 1 })
      /**
       * 添加节点方法二，不刷新数据，限画布内层处理
       */
      // 对数据进行处理
      if (this.graph.isRootNode(node)) {
        //root节点特殊处理
        this.props.graphData.children.push(newData)
      } else {
        //查找选中节点对象，往children添加数据
        const currentData = getKnowLedgeInfo(this.props.graphData.children, id as number)
        currentData?.children.push(newData)
      }

      //对画布进行处理
      const newNode = this.createNode(newData)
      this.graph.freeze()
      this.graph.addCell([newNode, this.createEdge(node, newNode)])
      this.graph.unfreeze()
      //这里需要提前移除，避免因为layout后，再次弹窗
      node.removeTools()
      this.layout()
    } else if (key === '2') {
      //删除节点
      Modal.confirm({
        title: '删除知识点',
        content: `确定删除 “${node.attr(attrsType.text)}”  吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          //画布冻结
          this.graph.freeze()
          const cells = this.graph.getSuccessors(node);//获取后续节点
          if (cells.length > 0) {
            //有子节点的父节点，不允许被删除
            message.warn('请先删除叶子节点', 10)
          } else {
            this.graph.removeCell(node) //删除当前节点            
            //对数据进行处理
            const id: number = node.attr(attrsType.id);
            //查找选中节点父类数据对象
            const parentData = getKnowLedgeParent(this.props.graphData, id)
            console.log('currentData ==', parentData);
            parentData?.children.splice(parentData?.children.findIndex((item => item.id === id)), 1)
          }
          this.layout()
        },
      });
    } else if (key === '3' || key === '4') {
      //上/下移动
      // debugger
      //复制原始对象
      const copyData = Object.assign({}, this.props.graphData)
      //查找选中节点父类数据对象
      const parentData = getKnowLedgeParent(copyData, id);
      const children = parentData?.children as treeObj[];
      //获取选中元素下标
      const currentIndex = children?.findIndex(info => info.id === id) as number;
      //上移-1，下移+1
      const firstParam = key === '3' ? currentIndex - 1 : currentIndex + 1;
      //删除top元素，把选中元素添加到top位置,并返回被删除的top元素
      const topElement = children?.splice(firstParam, 1, children[currentIndex])[0]
      //将被删除的top元素插入到触发节点位置
      children.splice(currentIndex, 1, topElement) //
      console.log('parentData ', parentData)
      this.props.setData(copyData)
    }
  }
}
