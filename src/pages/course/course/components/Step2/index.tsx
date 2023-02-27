import MindCanvas from './Graph/canvas-content'
// import 'antd/dist/antd.less';
import { getKnowledge, updateKnowledge } from '@/services/teacher/course/course';
import { getKnowExerciseCountByCourseId } from '@/services/student/progress';
import { Graph } from "@antv/x6";
import React from 'react';
import { UnorderedListOutlined } from '@ant-design/icons';
import ConfigPanel from '@/pages/course/course/components/Step2/ConfigPanel';
import { Drawer, Button } from 'antd';
import styles from './index.less';
import { message } from 'antd';
import { API } from '@/common/entity/typings';


const closeStyle: React.CSSProperties = {
  right: '0px',
};

type IProps = {
  course: API.CourseDetailRecord;
}

class Step2 extends React.Component<IProps> {
  public graph: Graph | undefined;
  private ref = React.createRef()

  state = {
    graphData: {},  //组件数据
    knowExercise: [],
    isReady: false,
    visible: true,
    graph: undefined, //图形组件
    course: {},
    defaultRoot: {
      id: -1,
      text: '数据库SQL',
      keyword: '',
      children: []
    },
    knowText: '',
    cellA: undefined
  };

  componentDidMount() {
    this.queryKnowledge(this.props.course.courseId)
  }
  componentDidUpdate(newProps, newState, Snapshot) {
    console.log('Step2 componentDidUpdate ', newProps.course)
    if (this.state.course !== newProps.course) {
      const newRoot = { ...this.state.defaultRoot, text: newProps.course.courseName }
      this.setState({ course: newProps.course, defaultRoot: newRoot })
    }
  }

  /**
   * 根据课程查询知识树
   * @param courseId 
   */
  queryKnowledge = (courseId: number) => {
    getKnowledge(courseId).then(data => {
      var graphData = this.state.defaultRoot;
      if (data.obj) {
        graphData = JSON.parse(data.obj);
      }
      this.setState({ graphData: graphData, isReady: true })
      //查询每个知识点习题总数
      getKnowExerciseCountByCourseId(courseId).then(k => {
        if (k.obj) this.setState({ knowExercise: k.obj })
      })
    })
  }
  onSubmit = () => {
    const data = { courseId: this.state.course.courseId, knowledgeTree: this.state.graphData }
    updateKnowledge(data).then((data) => {
      message.info('保存成功！')
      console.log('updateKnowledge then data ', data)
      this.queryKnowledge(this.state.course.courseId);
    })
  }
  toSubmitData = async () => {
    const data = { courseId: this.state.course.courseId, knowledgeTree: this.state.graphData }
    await updateKnowledge(data)
  }

  setCellA = (val: any) => {
    console.log('this.ref.current', val);
    this.ref.current.toUpdateKnowText(val)
  }

  render() {
    console.log('Step2 courseId=' + this.state.courseId)

    return (
      <div className={styles.wrap}>
        <div className={styles.content}>
          <div className={styles.panel}>
            <Button type="primary" onClick={() => this.onSubmit()} style={{marginRight:20}}>保存</Button>
            <span>知识点编辑（双击知识点可实现节点重命名）</span>
            <MindCanvas
              graphData={this.state.graphData}
              knowExercise={this.state.knowExercise}
              setGraph={(v) => this.setState({ graph: v })}
              setData={(v) => this.setState({ graphData: v })}
              setCellA={(v: string) => this.setCellA(v)}
            />
          </div>
          <Drawer
            placement="right"
            mask={false}
            open={this.state.visible}
            width={240}
            onClose={() => this.setState({ visible: false })}
          >
            <div className={styles.config}>
              {this.state.isReady && <ConfigPanel
                graphData={this.state.graphData}
                setData={(v) => this.setState({ graphData: v })}
                graph={this.state.graph}
                cellA={this.state.cellA}
                ref={this.ref}
              />}
            </div>
          </Drawer>
          <div
            className={styles.close}
            style={!this.state.visible ? closeStyle : undefined}
            onClick={() => this.setState({ visible: true })}
          >
            <UnorderedListOutlined />
          </div>
        </div>
      </div>
    )
  }
}
export default Step2;
