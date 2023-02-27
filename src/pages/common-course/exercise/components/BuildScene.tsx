import React from 'react';
import { Form, Modal, Select, Button } from 'antd';
const FormItem = Form.Item;
const formLayout = { labelCol: { span: 7 }, wrapperCol: { span: 13 } };
import { API } from '@/common/entity/typings';

type IProps = {
  onCancel: (flag?: boolean) => void;
  onSubmit: (value: { sceneId: number }) => void;
  createModalVisible?: boolean;
  sceneList: API.SceneListRecord[];
}

const BuildScene: React.FC<IProps> = (props) => {

  const [form] = Form.useForm();
  const {
    onSubmit: handleCreate,
    onCancel: handleCreateModalVisible,
    createModalVisible,
    sceneList
  } = props;

  const children = [];
  for (let i = 0; i < sceneList.length; i++) {
    children.push(<Select.Option key={sceneList[i].sceneId} value={sceneList[i].sceneId}>{sceneList[i].sceneName}</Select.Option>);
  }
  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    handleCreate({ ...fieldsValue });
  };

  return (
    <Modal
      // width={640}
      closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
      destroyOnClose
      title="批量绑定场景"
      open={createModalVisible}
      // okText="下一步"
      onCancel={() => { form.resetFields(); handleCreateModalVisible(false) }}
      footer={[
        <Button key="back" type="primary" onClick={() => handleNext()}>
          绑定
        </Button>
      ]}
      wrapClassName="modal-custom"
    >
      <Form
        {...formLayout}
        form={form}
        layout="vertical"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
      >
        <FormItem>
          <FormItem label="选择场景" name="sceneId" rules={[{ required: true, message: '请选择场景!' }]}>
            <Select placeholder="请选择绑定场景">
              {children}
            </Select>
          </FormItem>
          <div style={{ width: '360px', height: '35px', marginTop: '0px', background: '#FDDF66', borderRadius: '5px', color: '#333333', padding: '8px' }}>
            <img style={{ margin: '-5px 8px 0px 8px' }} src={require('@/img/student/icon-warn.svg')} />
            本功能是批量绑定场景，请谨慎选择！
          </div>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default BuildScene;
