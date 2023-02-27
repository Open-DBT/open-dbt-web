import React, { useState } from 'react';
import { Form, Modal, Input, Button, Space, message } from 'antd';
import moment from 'moment';
import BraftEditor from '@/pages/editor/braft';
import { testSceneSQLShell } from '@/services/teacher/course/scene';
import { API } from '@/common/entity/typings';

const { TextArea } = Input;
const FormItem = Form.Item;

interface IProps {
  onCancel: (flag?: boolean, formVals?: API.SceneListRecord) => void;
  onSubmit: (values: API.SceneListRecord) => void;
  updateModalVisible: boolean;
  scene: API.SceneListRecord
};

const UpdateForm: React.FC<IProps> = (props) => {
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    scene,
  } = props;
  const [form] = Form.useForm();
  const [formVals, setFormVals] = useState({
    sceneId: scene.sceneId,
    sceneName: scene.sceneName,
    sceneDesc: scene.sceneDesc,
    initShell: scene.initShell
  });
  console.log('props',scene.sceneName)

  /**
   * 下载脚本
   */
  const downLoadShell = () => {
    const sceneName = form.getFieldValue('sceneName');
    const initShell = form.getFieldValue('initShell');
    console.log('sceneName == ', sceneName, ', initShell == ', initShell);

    if (sceneName.trim().length == 0 || initShell.trim().length == 0) {
      message.error('应用场景名称和初始化的脚本不可为空！');
    } else {
      const blob = new Blob([initShell]);
      const fileName = `${sceneName}_${moment(new Date()).format('YYYYMMDDHHmmss')}.sql`;
      if (window.navigator.msSaveOrOpenBlob!) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement('a');
        const evt = document.createEvent('MouseEvents');
        link.style.display = 'none';
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link); // 此写法兼容可火狐浏览器
        evt.initEvent('click', false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);// 下载完成移除元素
        window.URL.revokeObjectURL(link.href); // 释放掉blob对象
      }
    }
  };

  const testShell = async() => {
    const initShell: string = form.getFieldValue('initShell');
    console.log('initShell == ', initShell);
    if(initShell.length === 0){
      message.warning('请输入脚本内容')
      return;
    }
    const result = await testSceneSQLShell({ initShell: initShell })
    if (result.success) {
      message.success('脚本语法正确');
    } else {
      message.error(result.message);
    }
  };

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    if(formVals?.sceneDesc !== fieldsValue.sceneDesc){
      fieldsValue.sceneDesc = fieldsValue.sceneDesc.toHTML();
    }
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  return (
    <Modal
      width={"75%"}
      maskClosable={false}
      destroyOnClose
      title="场景编辑"
      open={updateModalVisible}
      okText="确定"
      onOk={() => handleNext()}
      onCancel={() => handleUpdateModalVisible(false)}
    >
      <Form
        form={form}
        initialValues={{
          sceneId: formVals.sceneId,
          sceneName: formVals.sceneName,
          sceneDesc: formVals.sceneDesc,
          initShell: formVals.initShell
        }}
      >
        <FormItem name="sceneId" hidden={true}><Input /></FormItem>
        <FormItem
          name="sceneName"
          label="应用场景名称"
          rules={[{ required: true, message: '请输入应用场景名称' }]}
        >
          <Input placeholder="请输入应用场景名称" />
        </FormItem>
        <FormItem name="sceneDesc" label="应用场景描述" >
          <BraftEditor placeholder="请输入正文内容" />
        </FormItem>
        <div style={{ height: 50, lineHeight: '50px' }}>
          <Space>
            <h3>初始化脚本</h3>
            {/* <Button type="primary" style={{ marginLeft: 60 }} onClick={() => generateShell()}>生成脚本</Button> */}
            <Button type="primary" style={{ marginLeft: 20 }} onClick={() => downLoadShell()}>脚本下载</Button>
            <Button type="primary" style={{ marginLeft: 20 }} onClick={() => testShell()}>检查脚本</Button>
          </Space>
        </div>
        <FormItem name="initShell">
          <TextArea
            style={{ minHeight: 100 }}
            placeholder={"请输入脚本"}
            rows={10}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
