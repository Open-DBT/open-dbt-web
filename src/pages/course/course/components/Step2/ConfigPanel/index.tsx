import styles from "./index.less";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useImperativeHandle
} from 'react';
import { Tabs, Row, Col, Input } from 'antd';
import { Cell, Node } from '@antv/x6';
import { getKnowLedgeInfo } from '../utils/knowledge';
import { Knowledge } from '../typing'
import { attrsType } from '@/pages/knowledgeTree/Graph/MindMap'

export interface IProps {
  id: string;
  graph: any;
  graphData: any;
  cellA: any;
  refInstance?: any;
}

const KnowProperties: React.FC<IProps> = (props) => {
  const { refInstance } = props;

  const cellRef = useRef<Cell>();
  const [id, setId] = useState("");
  const [attrs, setAttrs] = useState<Knowledge.NodeAttrs>({
    keyword: '',
    text: '',
  });

  /* 暴露子组件保存数据方法给父组件 */
  useImperativeHandle(refInstance, () => ({
    toUpdateKnowText: (node: Node) => {
      return updateKnowText(node);
    }
  }));
  const updateKnowText = (node: Node) => {
    console.log(123, node)
    setAttrs({
      text: node.attr(attrsType.text),
      keyword: node.attr(attrsType.keyword)
    });
  }
  useEffect(() => {
    console.log('properties useEffect[]', props.graph)
    const graph = props.graph;
    graph.on("node:click", ({ cell }) => {
      console.log(cellRef.current === cell)
      setId(cell.id);
    });
  }, []);

  useEffect(() => {
    console.log('useEffect id', id)
    if (id) {
      const graph = props.graph;
      const cell = graph.getCellById(id);
      if (!cell || !cell.isNode()) {
        return;
      }
      /**
       * 设置节点背景色为白色
       */
      graph.getNodes().map((item: Node) => item.attr('body/fill', '#ffffff'))
      /**
       * 设置选中节点背景色为紫色
       */
      cell.attr('body/fill', 'pink')
      /**
       * 右侧属性栏赋值
       */
      cellRef.current = cell;
      setAttrs({
        text: cell.attr(attrsType.text),
        keyword: cell.attr(attrsType.keyword)
      });
    }
  }, [id]);


  /**
   * 更新属性页数据
   * @param key 
   * @param val 
   */
  const setAttr = (key: string, val: any) => {
    setAttrs((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  /**
   * e:val
   * attrType:文本存储路径
   * attrKey:字段名
   */
  const inputChange: Knowledge.EventChange<
    React.ChangeEvent<HTMLInputElement>,
    attrsType,
    Knowledge.NodeAttrs
  > = useCallback(
    (e, attrType, attrKey) => {
      const val = e.target.value;
      setAttr(attrKey, val);//更新表单(属性页)数据
      console.log('cellRef ', attrType, val, cellRef.current)
      cellRef.current!.attr(attrType, val);//给画布节点json更新数据
      //更新props.graphData
      /**
       * a)验证是否是根节点
       */
      if (props.graph.isRootNode(cellRef.current)) {
        props.graphData[attrKey] = val;
      } else {
        const leafId = cellRef.current!.attr(attrsType.id);
        let leafData = getKnowLedgeInfo(props.graphData.children, leafId)
        leafData[attrKey] = val;
      }
    },
    [attrs],
  );

  useEffect(() => {
    props.graph.on("cell:click", ({ cell }) => {
      console.log('click ', cell.id, cell)
      //root节点从1开始
      setId(cell.id);
    });
  }, []);

  return (
    <div className={styles.config}>
      <Tabs defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: '属性',
            children: <>
              <Row align="middle">
                <Col span={8}>知识点</Col>
                <Col span={14}>
                  <Input
                    value={attrs.text}
                    style={{ width: '100%' }}
                    onChange={(val) => inputChange(val, attrsType.text, 'text')}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={8}>关键字</Col>
                <Col span={14}>
                  <Input
                    value={attrs.keyword}
                    style={{ width: '100%' }}
                    onChange={(val) => inputChange(val, attrsType.keyword, 'keyword')}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={22} style={{ color: 'red', fontSize: 13 }}>多个关键字，请用";"号间隔</Col>
                <Col span={22} style={{ color: 'red', fontSize: 13 }}>例如：select;insert;delete</Col>
              </Row>
            </>
          }
        ]}
      />
    </div>
  );
}

export default React.forwardRef((props: IProps, ref: any) => <KnowProperties {...props} refInstance={ref} />);


