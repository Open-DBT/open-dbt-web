import React from 'react';
import { Modal, Tabs } from 'antd';
import CreateForm from './CreateForm';
import ImportForm from './ImportForm';
import { API } from '@/common/entity/typings';
interface AddStuFormProps {
  onCancel: (flag?: boolean, formVals?: API.SclassStuParam) => void;
  createModalVisible: boolean;
  sclassId: number;
};

const AddStuForm: React.FC<AddStuFormProps> = (props) => {

  const {
    onCancel: handleCreateModalVisible,
    createModalVisible,
    sclassId
  } = props;

  return (
    <Modal
      width={640}
      destroyOnClose
      open={createModalVisible}
      footer={null}
      onCancel={() => { handleCreateModalVisible(false) }}
    >
      <Tabs defaultActiveKey="1" type="card"
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
