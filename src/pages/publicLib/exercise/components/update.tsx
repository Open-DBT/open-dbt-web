import { useEffect, useState } from 'react';
import { Form, Input, Button, Space, message, Select } from 'antd';
import ResultSetModal from './components/ResultSetModal'
import BraftEditor from '@/pages/editor/braft';
import '@/pages/common-course/course-common.less';
import PublicMenu from '@/pages/publicLib/menu';
import { history } from 'umi';
import { getExerciseById, getSceneNameList, updateExercise, testRunAnswer } from '@/services/teacher/course/publicLib';
import { API } from '@/common/entity/typings';
const { TextArea } = Input;
const FormItem = Form.Item;

const updateIndex = (props: any) => {
  const exerciseId = props.match.params.exerciseId;

  const [form] = Form.useForm();
  const [selectSceneId, setSelectSceneId] = useState<number>(-1);
  const [viewSceneDetailDisabled, setViewSceneDetailDisabled] = useState<boolean>(false);
  const [resultSetModalVisible, setResultSetModalVisible] = useState<boolean>(false);
  const [columnList, setColumnList] = useState([]);
  const [datatype, setDatatype] = useState([]);
  const [resultSet, setResultSet] = useState([]);
  const [allScene, setAllScene] = useState<API.PublicSceneRecord[]>([]);//场景列表

  useEffect(() => {
    getSceneNameList().then((result) => {
      setAllScene(result.obj);
    });
    getExerciseById(exerciseId).then((result) => {
      const sceneId = result.obj ? (result.obj.sceneId ? result.obj.sceneId : -1) : -1

      if (sceneId == -1) {
        result.obj.sceneId = undefined;
        setViewSceneDetailDisabled(true);
      }

      form.setFieldsValue(result.obj);
      setSelectSceneId(sceneId)
    });
  }, []);

  //保存
  const onFinish = async () => {
    const fieldsValue = await form.validateFields();
    fieldsValue.exerciseDesc = fieldsValue.exerciseDesc.toHTML();
    const result = await updateExercise({ ...fieldsValue })
    if (result.success) {
      history.push(`/expert/public_library/exercise`);
    } else {
      message.error(result.message);
    }
  };

  // 场景选择事件
  const onSelect = (value: number) => {
    setSelectSceneId(value);
    setViewSceneDetailDisabled(false);
  };

  //测试运行
  const testRunClick = async () => {
    const values: API.PublicExerciseList = await form.validateFields();
    if (values) {
      const result = await testRunAnswer({ sceneId: values.sceneId, answer: values.answer });
      if (result.success) {
        if (result.obj.isSelect) {
          setColumnList(result.obj.column);
          setDatatype(result.obj.datatype);
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

  const menuProps = { active: 'exercise' };

  const answerForm = <Space>正确答案<Button type="primary" onClick={() => testRunClick()} style={{ marginLeft: 20 }}>测试运行</Button></Space>;

  return (
    <div className="flex course exercise">
      <PublicMenu {...menuProps} />
      <div style={{ width: '97%' }}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <div className="course-content">
            <div className="title-4">编辑习题</div>
            <div className="course-info">
              <FormItem name="exerciseId" hidden={true}><Input /></FormItem>

              <FormItem name="exerciseName" label="习题名称" rules={[{ required: true, message: '请输入习题名称' }]}>
                <Input placeholder="请输入习题名称" style={{ width: '40%' }} />
              </FormItem>

              <FormItem label="应用场景">
                <Space>
                  <FormItem name="sceneId" noStyle rules={[{ required: true, message: '请选择应用场景' }]}>
                    <Select style={{ width: '300px' }} placeholder="请选择应用场景" onSelect={onSelect}>
                      {
                        allScene.map((item, index) => {
                          return <Select.Option key={item.sceneId} value={item.sceneId}>{item.sceneName}</Select.Option>
                        })
                      }
                    </Select>
                  </FormItem>
                </Space>
                <Button
                  href={`/expert/publicLib/scene/view/${selectSceneId}`}
                  target="_blank"
                  type="link"
                  disabled={viewSceneDetailDisabled}
                  style={{ marginLeft: 10 }}
                >
                  查看场景详情
                </Button>
              </FormItem>

              <FormItem name="exerciseDesc" label="习题描述">
                <BraftEditor placeholder="请输入正文内容" readOnly={false} style={{ height: 200 }} />
              </FormItem>

              <FormItem name="answer" label={answerForm} rules={[{ required: true, message: '请输入正确答案' }]}>
                <TextArea style={{ marginRight: 14 }} placeholder={"请输入正确答案"} rows={3} />
              </FormItem>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Form.Item><Button type="primary" htmlType="submit">保存设置</Button></Form.Item>
          </div>
        </Form>
      </div>

      {/* 结果集 */}
      <ResultSetModal
        onCancel={() => { setResultSetModalVisible(false) }}
        resultSetModalVisible={resultSetModalVisible}
        columnList={columnList}
        datatype={datatype}
        resultSet={resultSet}
      />
    </div>
  )
}

export default updateIndex;
