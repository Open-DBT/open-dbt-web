import React from 'react';
import { Modal } from 'antd';
import { API } from '@/common/entity/typings';
interface IProps {
  onCancel: (flag?: boolean) => void;
  viewModalVisible: boolean;
  values: API.FeedbackListRecord;
};

const ViewModal: React.FC<IProps> = (props) => {

  const {
    onCancel: setViewModalVisible,
    viewModalVisible,
    values
  } = props;

  return (
    <Modal
      forceRender
      width={"75%"}
      destroyOnClose
      title="意见反馈查看"
      open={viewModalVisible}
      footer={null}
      onCancel={() => { setViewModalVisible(false) }}
    >
      <div dangerouslySetInnerHTML={{ __html: values?.content }} />
    </Modal>
  );
};

export default ViewModal;
