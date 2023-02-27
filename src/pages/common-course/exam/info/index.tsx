import { useEffect } from 'react';
import TabMenu from '../tabMenu';
import { Form, Input, Button, Space, Switch, message } from 'antd';
const { TextArea } = Input;
import { getExamById, updateExam } from '@/services/teacher/course/exam';
// import "flatpickr/dist/themes/material_green.css";
import "flatpickr/dist/flatpickr.css";
import { history } from 'umi';

/**
 * Flatpickr https://flatpickr.js.org/themes/
 */

const ExamInfo = (props: any) => {
  const courseId = props.courseId;
  const examId = props.examId;

  const [form] = Form.useForm();

  useEffect(() => {
    getExamById(examId).then((result) => form.setFieldsValue(result.obj))
  }, []);

  /**
   * 点击保存
   * @param values 
   */
  const onFinish = async (values: any) => {
    updateExam({ ...values, courseId: courseId, id: examId }).then((result) => {
      if (result.success) {
        message.success("保存成功");
        history.push(`/teacher/course/${courseId}/exam/${examId}/exercise`)
      } else {
        message.error("保存失败，" + result.message);
      }
    })
  }
  return (
    <div>
      <TabMenu {...props} />

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <div className="title-4" style={{ marginTop: '10px' }}>
          <Button type="primary" htmlType="submit" style={{ margin: '10px' }}>保存设置</Button>
        </div>
        <div className="course-info">
          <div className="flex">
            <div style={{ width: '70%', marginRight: 50 }}>
              <Form.Item label="作业名称" name="testName" rules={[{ required: true, message: '请输入作业名称' }]}>
                <Input placeholder="请输入作业名称" />
              </Form.Item>
              <Form.Item label="作业简介" name="testDesc">
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入作业简介"
                  rows={3}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </div >
  );
};
export default ExamInfo;
