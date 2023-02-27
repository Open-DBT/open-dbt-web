import React, { useState } from 'react';
import { Form, Input, Button, Space, message, Select, Modal } from 'antd';
import ResultSetModal from './ResultSetModal'
import { testRunAnswer } from '@/services/teacher/course/exercise';
import { treeObj } from '@/pages/knowledgeTree/Graph/MindMap'
import MindCanvas from '../Graph/canvas-content'
import BraftEditor from '@/pages/editor/braft';
import '../index.less'
import { API } from '@/common/entity/typings';

const { TextArea } = Input;
const FormItem = Form.Item;

interface IProps {
  onSubmit: (values: API.ExerciseListParams) => void;
  onCancel: (flag?: boolean, values?: API.ExerciseListParams) => void;
  sceneList: API.SceneListRecord[];
  graphData: treeObj;
  knowExercise: API.KnowledgeItemExerciseCount[];
  courseId: number;
  createModalVisible: boolean;
}

const AddExercise: React.FC<IProps> = (props) => {
  console.log('AddExercise props ', props);
  const [form] = Form.useForm();
  const {
    onSubmit: handleCreate,
    onCancel: handleCreateModalVisible,
    createModalVisible,
    courseId,
    sceneList,
    graphData,
    knowExercise
  } = props;

  console.log('graphData', graphData, sceneList)
  const [selectSceneId, setSelectSceneId] = useState<number>(-1);
  const [viewSceneDetailDisabled, setViewSceneDetailDisabled] = useState<boolean>(true);
  const [resultSetModalVisible, setResultSetModalVisible] = useState<boolean>(false);
  const [columnList, setColumnList] = useState([]);
  const [datatype, setDatatype] = useState([]);
  const [resultSet, setResultSet] = useState([]);
  const [knowledgeIds, setKnowledgeIds] = useState<number[]>([]);//选中知识点

  const children = [];
  for (let i = 0; i < sceneList.length; i++) {
    children.push(<Select.Option key={sceneList[i].sceneId} value={sceneList[i].sceneId!}>{sceneList[i].sceneName}</Select.Option>);
  }

  /**
   * 保存
   */
  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    fieldsValue.exerciseDesc = fieldsValue.exerciseDesc.toHTML();
    handleCreate({ ...fieldsValue, knowledgeIds: knowledgeIds });
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

  return (
    <Modal
      className="exercise"
      width={"75%"}
      maskClosable={false}
      destroyOnClose
      title="习题编辑"
      open={createModalVisible}
      okText="确定"
      onOk={() => handleNext()}
      onCancel={() => { handleCreateModalVisible(false); }}
      afterClose={() => { setKnowledgeIds([]);form.resetFields() }}
    >

      <Form
        preserve={false}
        form={form}
        initialValues={{
          courseId: courseId,
          sceneName: '',
          exerciseName: '',
          exerciseDesc: '',
          answer: ''
        }}
        requiredMark={false}
      >
        <FormItem name="courseId" hidden={true}><Input /></FormItem>
        <FormItem label="应用场景">
          <Space>
            <FormItem name="sceneId" noStyle rules={[{ required: true, message: '请选择应用场景' }]}>
              <Select
                style={{ width: '300px' }}
                placeholder="请选择应用场景"
                onSelect={onSelect}
              >
                {children}
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
        <FormItem name="exerciseName" label="习题名称" rules={[{ required: true, message: '请输入习题名称' }]}>
          <Input placeholder="请输入习题名称" />
        </FormItem>
        <FormItem name="exerciseDesc" label="习题描述" rules={[{ required: true, message: '请输入习题描述' }]}>
          {/* <TextArea style={{ minHeight: 32 }} placeholder={"请输入习题描述"} rows={3} /> */}
          <BraftEditor placeholder="请输入正文内容" readOnly={false}/>
        </FormItem>
        <FormItem name="answer" label="正确答案" rules={[{ required: true, message: '请输入正确答案' }]}>
          <TextArea style={{ minHeight: 32 }} placeholder={"请输入正确答案"} rows={3} />
        </FormItem>
        <FormItem wrapperCol={{ offset: 2 }}>
          <Button type="primary" onClick={() => testRunClick()}>测试运行</Button>
        </FormItem>
      </Form>
      <span>绑定知识点（点击选中知识点既可完成绑定）</span>
      <MindCanvas
        graphData={graphData}
        knowExercise={knowExercise}
        setIds={(v) => setKnowledgeIds(v)} ids={knowledgeIds}
      />

      {/* 结果集 */}
      <ResultSetModal
        onCancel={() => { setResultSetModalVisible(false) }}
        resultSetModalVisible={resultSetModalVisible}
        columnList={columnList}
        datatype={datatype}
        resultSet={resultSet}
      />
    </Modal>
  )
}

export default AddExercise;
