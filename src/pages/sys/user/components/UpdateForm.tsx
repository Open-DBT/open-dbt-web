import React, { useState } from 'react';
import { Form, Radio, Input, Modal, Select } from 'antd';
import { getGroup,getRoleIds } from '../utils'
const FormItem = Form.Item;
const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };
import { API } from '@/common/entity/typings';
interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: API.UserListItem) => void;
  onSubmit: (values: API.UserListItem) => void;
  updateModalVisible: boolean;
  values: Partial<API.UserListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {

  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
  } = props;

  const [formVals, setFormVals] = useState({
    ...props.values,
  });


  const group = getGroup(props.values!.roleList!);//角色分组，默认课程专家

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    //分组替换成真实角色id
    fieldsValue.roleIds = getRoleIds(fieldsValue.group)
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  return (
    <Modal
      width={640}
      maskClosable={false}
      destroyOnClose
      title="用户编辑"
      open={updateModalVisible}
      okText="更新"
      onOk={() => handleNext()}
      onCancel={() => handleUpdateModalVisible(false)}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          ...formVals,
          sex: formVals.sex + '',
          group: group
        }}
      >
        <FormItem
          name="code"
          label="学号/工号"
          rules={[{ required: true, message: '请输入学号/工号' }]}
        >
          <Input placeholder="请输入学号/工号" />
        </FormItem>
        <FormItem
          name="userName"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入姓名" />
        </FormItem>
        <FormItem
          name="sex"
          label="性别"
        >
          <Radio.Group>
            <Radio value="1">男</Radio>
            <Radio value="0">女</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          name="group"
          label="用户角色"
        >
          <Radio.Group>
            <Radio value="0">课程专家</Radio>
            <Radio value="1">教师</Radio>
            <Radio value="2">学生</Radio>
          </Radio.Group>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
