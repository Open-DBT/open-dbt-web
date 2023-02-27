import React, { useState, useEffect } from 'react';
import { Modal, Tabs } from 'antd';
import CreateForm from './CreateForm';
import ImportForm from './ImportForm';
import { API } from '@/common/entity/typings';
interface AddStuFormProps {
  onCancel: (flag?: boolean, formVals?: API.SclassStuParam) => void;
  createModalVisible: boolean;
  sclassId: number;
  tabPage: string;//传入当前tab page
};

const AddStuForm: React.FC<AddStuFormProps> = (props) => {

  const {
    onCancel: handleCreateModalVisible,
    createModalVisible,
    sclassId,
    tabPage
  } = props;
  const [tabCurrent, setTabCurrent] = useState<string>(tabPage);//显示当前tab

  useEffect(() => {
    setTabCurrent(tabPage)
  }, [tabPage]);

  return (
    <Modal
      width={640}
      destroyOnClose
      open={createModalVisible}
      footer={null}
      onCancel={() => { handleCreateModalVisible(false) }}
    >
      <Tabs type="card" defaultActiveKey="1" activeKey={tabCurrent} onChange={(activeKey) => setTabCurrent(activeKey)}
        items={[
          {
            key: "1",
            label: '手动添加',
            children:
              <CreateForm sclassId={sclassId} />
          }, {
            key: "2",
            label: '导入',
            children:
              <ImportForm sclassId={sclassId} />
          }
        ]}
      />
    </Modal>
  );
};

export default AddStuForm;
