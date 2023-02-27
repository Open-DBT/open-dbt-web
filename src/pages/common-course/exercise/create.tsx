import { useEffect, useState } from 'react';
import { Form, Input, Button, Space, message, Select } from 'antd';
import ResultSetModal from './components/ResultSetModal'
import { testRunAnswer } from '@/services/teacher/course/exercise';
import MindCanvas from './Graph/canvas-content'
import BraftEditor from '@/pages/editor/braft';
import './index.less';
import { getCourseDetail } from '@/services/teacher/course/course';
import { updateExercise } from '@/services/teacher/course/exercise';
import { getKnowExerciseCountByCourseId } from '@/services/student/progress';
import { getShareScene } from '@/services/teacher/course/scene';
import { history } from 'umi';
import { saveCourseStorage } from '@/pages/common-course/utils'
import { API } from '@/common/entity/typings';

const { TextArea } = Input;
const FormItem = Form.Item;

const addIndex = (props: any) => {
  const courseId = props.courseId;
  const [form] = Form.useForm();

  const [selectSceneId, setSelectSceneId] = useState<number>(-1);
  const [viewSceneDetailDisabled, setViewSceneDetailDisabled] = useState<boolean>(true);
  const [resultSetModalVisible, setResultSetModalVisible] = useState<boolean>(false);
  const [columnList, setColumnList] = useState([]);
  const [datatype, setDatatype] = useState([]);
  const [resultSet, setResultSet] = useState([]);
  const [knowledgeIds, setKnowledgeIds] = useState<number[]>([]);//选中知识点
  const [allScene, setAllScene] = useState<API.SceneListRecord[]>([]);//场景列表
  const [graphData, setGraphData] = useState<any>();//知识树列表
  const [knowExercise, setKnowExercise] = useState<API.KnowledgeItemExerciseCount[]>([]);//知识树习题数量

  useEffect(() => {
    getCourseDetail(courseId).then((result) => {
      setGraphData(JSON.parse(result.obj.knowledgeTree))
    })
    //查询场景列表,下拉列表使用
    getShareScene(courseId).then((result) => {
      setAllScene(result.obj);
    });
    getKnowExerciseCountByCourseId(courseId).then(k => {
      if (k.obj) setKnowExercise(k.obj)
    })
  }, []);

  /**
   * 保存
   */
  const onFinish = async () => {
    const fieldsValue = await form.validateFields();
    fieldsValue.exerciseDesc = fieldsValue.exerciseDesc.toHTML();
    const result = await updateExercise({ ...fieldsValue, knowledgeIds: knowledgeIds })
    if (result.success) {
      message.success('保存成功');
      //缓存当前保存页为成功
      saveCourseStorage(courseId, 4);
      history.push(`/expert/course/${courseId}/exercise`);
    } else {
      message.error(result.message);
      return;
    }
  };

  /**
   * 场景选择事件
   * @param value 
   */
  const onSelect = (value: number) => {
    setSelectSceneId(value);
    setViewSceneDetailDisabled(false);
  };

  /**
   * 测试运行
   */
  const testRunClick = async () => {
    const values: API.ExerciseListParams = await form.validateFields();
    if (values) {
      const result = await testRunAnswer({ sceneId: values.sceneId, answer: values.answer });
      console.log('result == ', result);
      if (result.success) {
        if (result.obj.isSelect) {
          setColumnList(result.obj.column);
          setDatatype(result.obj.datatype)
          setResultSet(result.obj.result);
          setResultSetModalVisible(true);
        } else {
          message.success(`运行成功，更新行数为${result.obj.result}`);
        }
      } else {
        message.error(result.message);
      }
    }
  };

  const answerForm = <Space>正确答案<Button type="primary" onClick={() => testRunClick()} style={{ marginLeft: 20 }}>测试运行</Button></Space>;

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          courseId: courseId,
          exerciseName: '',
          exerciseDesc: '',
          answer: ''
        }}
      >
        <div className="title-4">新建习题</div>
        <div className="course-info">
          <FormItem name="courseId" hidden={true}><Input /></FormItem>
          <FormItem name="exerciseName" label="习题名称" rules={[{ required: true, message: '请输入习题名称' }]}>
            <Input placeholder="请输入习题名称" style={{ width: '40%' }} />
          </FormItem>
          <FormItem label="应用场景">
            <Space>
              <FormItem name="sceneId" noStyle rules={[{ required: true, message: '请选择应用场景' }]}>
                <Select
                  style={{ width: '300px' }}
                  placeholder="请选择应用场景"
                  onSelect={onSelect}
                >
                  {
                    allScene.map((item, index) => {
                      return <Select.Option key={item.sceneId} value={item.sceneId}>{item.sceneName}</Select.Option>
                    })
                  }
                </Select>
              </FormItem>
            </Space>
            <Button
              href={'/course/scene/view/' + selectSceneId}
              target="_blank"
              type="link"
              disabled={viewSceneDetailDisabled}
              style={{ marginLeft: 10 }}
            >
              查看场景详情
            </Button>
          </FormItem>
          <FormItem name="exerciseDesc" label="习题描述">
            {/* <TextArea style={{ minHeight: 32 }} placeholder={"请输入习题描述"} rows={3} /> */}
            <BraftEditor placeholder="请输入正文内容" readOnly={false} style={{ height: 200 }} />
          </FormItem>
          <FormItem name="answer" label={answerForm} rules={[{ required: true, message: '请输入正确答案' }]}>
            <TextArea style={{ marginRight: 14 }} placeholder={"请输入正确答案"} rows={3} />
          </FormItem>
          <span>绑定知识点（点击选中知识点既可完成绑定）</span>
          <MindCanvas
            graphData={graphData}
            knowExercise={knowExercise}
            setIds={(v) => setKnowledgeIds(v)} ids={knowledgeIds}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <Form.Item><Button type="primary" htmlType="submit">保存设置</Button></Form.Item>
        </div>
      </Form>

      {/* 结果集 */}
      <ResultSetModal
        onCancel={() => { setResultSetModalVisible(false) }}
        resultSetModalVisible={resultSetModalVisible}
        columnList={columnList}
        datatype={datatype}
        resultSet={resultSet}
      />
    </>
  )
}

export default addIndex;
