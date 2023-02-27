import { useEffect, useState, useRef } from 'react';
import { saveCourseStorage } from '@/pages/common-course/utils'
import styles from './index.less';
import './index.less';
import '@/pages/common-course/course-common.less';
import { getCourseDetail, updateKnowledge } from '@/services/teacher/course/course';
import { getKnowExerciseCountByCourseId } from '@/services/student/progress';
import { Button, message, Drawer, Modal } from 'antd';
import { history, Prompt } from 'umi';
import MindCanvas from './Graph/canvas-content'
import ConfigPanel from './ConfigPanel';
import { UnorderedListOutlined } from '@ant-design/icons';
import {
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { API } from '@/common/entity/typings';

const CourseKnowIndex = (props: any) => {
  const [graphData, setGraphData] = useState<any>();//图形数据
  const [graph, setGraph] = useState<any>();//图形空间
  const [isReady, setIsReady] = useState<boolean>(false);//
  const [visible, setVisible] = useState<boolean>(true);//属性栏显示和隐藏控制按钮
  const [knowExerciseList, setKnowExerciseList] = useState<API.KnowledgeItemExerciseCount[]>([]);
  const [promptState, setPromptState] = useState<boolean>(false);//跳转是否弹窗
  const courseId = props.courseId;

  const closeStyle: React.CSSProperties = {
    right: '0px',
  };

  useEffect(() => {
    fetch();
  }, []);


  /**
   * 请求数据
   */
  const fetch = () => {
    //查询课程
    getCourseDetail(courseId).then((result) => {
      const defaultRoot = {
        id: -1,
        text: result.obj.courseName,
        keyword: '',
        children: []
      }
      setGraphData(result.obj.knowledgeTree ? JSON.parse(result.obj.knowledgeTree) : defaultRoot)
      setIsReady(true);

      //查询每个知识点习题总数
      getKnowExerciseCountByCourseId(courseId).then(k => {
        if (k.obj) setKnowExerciseList(k.obj)
      })
    })
  }
  const configRef = useRef<any>(); // 命名最好还是user开头
  /**
   * 双击知识点单元格，进行编辑后，更新到右侧属性栏
   * @param val 
   */
  const updateConfigText = (val: any) => {
    console.log('this.ref.current', val, configRef);
    setPromptState(true)
    if (configRef.current) configRef.current.toUpdateKnowText(val)
  }
  /**
   * 点击保存
   * @param values 
   */
  const onSubmit = () => {
    const data = { courseId: courseId, knowledgeTree: graphData }
    updateKnowledge(data).then((data) => {
      message.info('保存成功！')
      setPromptState(false)//设置为已改动状态
      console.log('updateKnowledge then data ', data)
      //缓存当前保存页为成功
      saveCourseStorage(courseId, 2);
      //刷新数据
      fetch();
    })
  }
  return (
    <>
      <div className="title-4">知识体系<Button type="primary" onClick={() => onSubmit()} style={{ marginLeft: 50 }}>保存设置</Button></div>
      <div>
        <div className="mind-canvas-div">
          <MindCanvas
            graphData={graphData}
            knowExercise={knowExerciseList}
            setGraph={(v: any) => setGraph(v)}
            setData={(v: string) => setGraphData(v)}
            setCellA={(v: string) => updateConfigText(v)}
            setPromptState={(v: boolean) => setPromptState(v)}
          />
        </div>
        <Drawer
          placement="right"
          mask={false}
          open={visible}
          width={250}
          onClose={() => setVisible(false)}
        >
          <div className={styles.config}>
            {isReady && <ConfigPanel
              graphData={graphData}
              graph={graph}
              ref={configRef}
            />
            }
          </div>
          <div style={{ width: '202px', height: '35px', marginTop: '0px', background: '#FDDF66', borderRadius: '5px', color: '#333333', padding: '8px' }}>
            <img style={{ margin: '-5px 5px 0px 5px' }} src={require('@/img/student/icon-warn.svg')} />
            <span style={{ color: '#333333', fontWeight: 'bold' }}>双击知识点</span>
            <span>可快速重命名</span>
          </div>
        </Drawer>
        <div
          className={styles.close}
          style={!visible ? closeStyle : undefined}
          onClick={() => setVisible(true)}
        >
          <UnorderedListOutlined />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Button type="primary" onClick={() => onSubmit()}>保存设置</Button>
      </div>

      <Prompt
        when={promptState}
        // message={(location) => {
        //   return window.confirm(`confirm to leave to ${location.pathname}?`);
        // }}
        message={(location) => {
          if (!promptState) {
            return true;
          }
          console.log('message', location)
          Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '暂未保存您所做的更改，是否保存？',
            okText: '保存',
            cancelText: '不保存',
            onOk() {
              onSubmit()
            },
            onCancel() {
              setPromptState(false)
              setTimeout(() => {
                history.push(location.pathname);
              });
            }
          });
          return false
        }}
      />
    </>
  );
};
export default CourseKnowIndex;
