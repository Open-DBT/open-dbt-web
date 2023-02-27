import { Form, Button, Input, message, DatePicker, Select } from 'antd';
import styles from './index.less';
import { updateClass } from '@/services/teacher/clazz/sclass';
import { useEffect, useState } from 'react';
import moment from 'moment'
import { API } from '@/common/entity/typings';
const { TextArea } = Input;


type IProps = {
  sclass: API.SclassRecord,
  course: API.CourseDetailRecord[];
}

const Step1 = (props: IProps) => {
  const [form] = Form.useForm();
  const [formVals, setFormVals] = useState(props.sclass);

  useEffect(() => {
    console.log('Step1 useEffect ', props)
    if (props.sclass) {
      //此处没有太好的办法，除非逐一赋值
      if (props.sclass.classStart) {
        props.sclass.classStart = moment(props.sclass.classStart, 'YYYY-MM-DD')
        props.sclass.classEnd = moment(props.sclass.classEnd, 'YYYY-MM-DD')
      }
      form.setFieldsValue(props.sclass)
      setFormVals(props.sclass)
    }
  }, [props]);

  /**
   * 保存班级信息
   */
  const onValidateForm = async () => {
    const fieldsValue = await form.validateFields();
    fieldsValue.classStart = moment(fieldsValue.classStart).format('YYYY-MM-DD')
    fieldsValue.classEnd = moment(fieldsValue.classEnd).format('YYYY-MM-DD')
    const result = await updateClass({ ...formVals, ...fieldsValue })

    if (!result.success) {
      message.error(result.message)
    }else{
      message.success('保存成功')
    }
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      className={styles.stepForm}
      hideRequiredMark
    >
      <Form.Item name="id" hidden={true}><Input /></Form.Item>
      <Form.Item
        label="班级名称"
        name="className"
        rules={[
          {
            required: true,
            message: '请输入班级名称',
          },
        ]}
      >
        <Input placeholder="请输入班级名称" maxLength={20} style={{ width: '300px' }} />
      </Form.Item>
      <Form.Item label="班级简介" name="classDesc">
        <TextArea
          style={{ minHeight: 32 }}
          placeholder="请输入班级简介"
          rows={3}
        />
      </Form.Item>
      <Form.Item label="开班课程" name="courseId">
        <span>{formVals.course?.courseName}</span>
      </Form.Item>
      <Form.Item label="开课时间" name="classStart"
        rules={[
          {
            required: true,
          },
        ]}>
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item label="结课时间" name="classEnd"
        rules={[
          {
            required: true,
          },
        ]}>
        <DatePicker />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={onValidateForm}>保存设置</Button>
      </Form.Item>
    </Form>
  );
};
export default Step1;
