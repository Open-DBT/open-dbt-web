
import MindMap, { treeObj, attrsType } from '@/pages/knowledgeTree/Graph/MindMap'
import TreeNode from "@/pages/knowledgeTree/Graph/shape";
import { getZoom } from '@/utils/utils';


interface IProps {
    graphData: treeObj;
    ids: [];
    setIds: (ids: []) => void;
};

export default class CanvasContent extends MindMap {
    constructor(props: IProps) {
        super(props);
        this.state = {
            knowList: []
        }
    }

    componentDidMount() {
        super.componentDidMount();

        this.graph.on('node:click', ({ view, e }) => {
            const knowledgeId = view.cell.attr(attrsType.id);
            const nodeColor = view.cell.attr('body/fill')
            console.log('node:click ', this.props.ids, knowledgeId, nodeColor)

            if (nodeColor === '#ffd591') {
                //取消选中
                console.log('un selected...')
                view.cell.attr('body', {
                    fill: 'white',
                    stroke: '#4b4a67',
                })
                const newDate = this.props.ids.filter(num => num !== knowledgeId)
                this.props.setIds(newDate)
            } else {
                //选中变色
                console.log('selected...')
                const newData = [...this.props.ids, knowledgeId]
                this.props.setIds(newData)
                view.cell.attr('body', {
                    fill: '#ffd591',
                    stroke: '#ffa940',
                })
            }
        })
        this.graph.zoom(getZoom(this.graph.getNodes()));
        this.graph.centerContent();
        this.showAllPath(this.props.ids);
    }
    UNSAFE_componentWillReceiveProps(nextProps: any) {
        super.UNSAFE_componentWillReceiveProps(nextProps);
        console.log('CanvasContent UNSAFE_componentWillReceiveProps...', nextProps)
        this.showAllPath(nextProps.ids);
    }

    /**
     * 显示选中知识点路径
     */
    showAllPath = (ids: number[]): void => {
        const nodes = this.graph.getNodes();
        let pathArray: any = [];
        /**
         * 给已经绑定的知识点，显示绝对路径
         */
        ids.map((item: number, index) => {
            //遍历全部的graph节点
            nodes.map(node => {
                //找到选中节点
                const flag = node.attr(attrsType.id) === item;
                if (flag) {
                    const parentNode = this.graph.getPredecessors(node);
                    let path = node.attr(attrsType.text);
                    parentNode.map((e, index) => {
                        path = e.attr(attrsType.text) + '\\' + path;
                    })
                    pathArray.push(path)
                }
            })
        })
        this.setState({ knowList: pathArray })
    }
    createNode = (info: any) => {
        const node = new TreeNode({
            shape: 'mind-map-rect',
            attrs: {
                name: {
                    textWrap: {
                        id: info.id,
                        text: info.text,
                        keyword: info.keyword
                    },
                },
                stat: {
                    text: '习题' + attrsType.stat_name_mark + '0',
                    fill: 'red'
                }
            },
        })
        /**
         * 被选中变色
         */
        this.props.ids.forEach((item) => {
            if (item === info.id) {
                node.attr('body', {
                    fill: '#ffd591',
                    stroke: '#ffa940',
                })
            }
        })
        return this.graph.addNode(node)
    }
    render() {
        console.log('this.state.knowList', this.state.knowList)

        return (
            <div>
                <div className="flex wrap" style={{ height: 'auto', lineHeight: '30px', marginBottom: 6 }}>
                    已绑定：
                    {
                        this.state.knowList.map((item: string, index: number) => {
                            return <div key={index}
                                style={{ backgroundColor: '#FDDF66', padding: '0 10px 0 10px', margin: '0 10px 6px 0' }}>
                                {item}</div>
                        })
                    }
                </div>
                <div className="app-content" ref={this.refContainer} />
            </div>
        );
    }
}
