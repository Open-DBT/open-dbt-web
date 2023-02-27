import React from 'react';
import { Form, Input, Space, Select, Modal } from 'antd';
const FormItem = Form.Item;
import { API } from '@/common/entity/typings';

interface IProps {
  onSubmit: (values: { exerciseId: number, courseId: number }) => void;
  onCancel: () => void;
  courseList: API.CourseListItem[];
  copyModalVisible: boolean;
  values: API.ExerciseRecord;
}

const CopyExercise: React.FC<IProps> = (props) => {
  const [form] = Form.useForm();
  const {
    onSubmit: handleCreate,
    onCancel: handleCreateModalVisible,
    copyModalVisible,
    courseList,
    values
  } = props;

  const children = [];
  for (let i = 0; i < courseList.length; i++) {
    children.push(<Select.Option key={courseList[i].courseId} value={courseList[i].courseId!}>{courseList[i].courseName}</Select.Option>);
  }

  /**
   * 保存
   */
  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    handleCreate(fieldsValue);
  };

  return (
    <Modal
      className="exercise"
      maskClosable={false}
      destroyOnClose
      title="习题复制"
      open={copyModalVisible}
      okText="保存"
      onOk={() => handleNext()}
      onCancel={() => { handleCreateModalVisible(); }}
    >
      <Form
        preserve={false}
        form={form}
        initialValues={{
          exerciseId: values.exerciseId
        }}
        requiredMark={false}
      >
        <FormItem name="exerciseId" hidden={true}><Input /></FormItem>
        <FormItem label="我的课程">
          <Space>
            <FormItem name="courseId" noStyle rules={[{ required: true, message: '请选择课程' }]}>
              <Select
                style={{ width: '300px' }}
                placeholder="请选择课程"
              >
                {children}
              </Select>
            </FormItem>
          </Space>
        </FormItem>
      </Form>
    </Modal>
  )
}

export default CopyExercise;
