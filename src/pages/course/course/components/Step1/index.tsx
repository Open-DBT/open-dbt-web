import { Form, Button, Input, message } from 'antd';
import styles from './index.less';
import { updateCourse } from '@/services/teacher/course/course';
import React, { useEffect, useImperativeHandle } from 'react';
import BraftEditor from '@/pages/editor/braft';
import { API } from '@/common/entity/typings';

const { TextArea } = Input;

type IProps = {
  setCourse: (values: any) => void;
  ref: any;
  refInstance?: any;
  course: API.CourseDetailRecord,
}

const defaultState = {
  courseId: -1,
  courseName: '',
  courseDesc: '',
  courseOutline: '',
  isOpen: 0
}

const Step1 = (props: IProps) => {
  const [form] = Form.useForm();
  const { refInstance } = props;

  useEffect(() => {
    if (props.course) {
      form.setFieldsValue(props.course)
      /**
       * 课程信息，输入完资料，没有点击保存按钮
       * 切换到其他页面，先记录下资料，然后再切换
       * 切换回课程信息，读取之前写过的资料
       */
      if (localStorage.getItem('course-step1')) {
        const historyData = JSON.parse(localStorage.getItem('course-step1')!);
        console.log('historyData', historyData)
        if (historyData.courseId === props.course.courseId)
          form.setFieldsValue(historyData)
      }
    }

  }, [props]);

  /* 暴露子组件保存数据方法给父组件 */
  useImperativeHandle(refInstance, () => ({
    toSubmitData: () => {
      return saveCookie();
    }
  }));

  const saveCookie = async () => {
    const values = await validateFields();
    values.courseOutline = values.courseOutline.toHTML();
    localStorage.setItem('course-step1', JSON.stringify(values))
  }

  const { validateFields } = form;
  /**
   * 保存课程信息
   */
  const onValidateForm = async () => {
    const values = await validateFields();
    values.courseOutline = values.courseOutline.toHTML();
    const result = await updateCourse(values)
    if (result.success) {
      message.info('保存成功！')
      localStorage.setItem('course-step1', JSON.stringify(result.obj))
      props.setCourse(result.obj)
    } else {
      message.error(result.message)
    }
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      className={styles.stepForm}
      hideRequiredMark
      initialValues={defaultState}
    >
      <Form.Item name="courseId" hidden={true}><Input /></Form.Item>
      <Form.Item name="isOpen" hidden={true}><Input /></Form.Item>
      <Form.Item
        label="课程名称"
        name="courseName"
        rules={[
          {
            required: true,
            message: '请输入课程名称',
          },
        ]}
      >
        <Input placeholder="请输入课程名称" maxLength={20} style={{ width: '300px' }} />
      </Form.Item>
      <Form.Item label="课程简介" name="courseDesc">
        <TextArea
          style={{ minHeight: 32,width:'90%' }}
          placeholder="请输入课程简介"
          rows={3}
          cols={50}
        />
      </Form.Item>
      <Form.Item label="课程大纲" name="courseOutline">
        <BraftEditor className="border" placeholder="请输入正文内容"/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={onValidateForm}>保存</Button>
      </Form.Item>
    </Form>
  );
};

export default React.forwardRef((props: IProps, ref: any) => <Step1 {...props} refInstance={ref} />);
