import React from 'react';
import { Modal } from 'antd';
import SceneInfo from '@/pages/components/SceneInfo'
import { API } from '@/common/entity/typings';
interface IProps {
  onCancel: (flag?: boolean, formVals?: API.SceneListRecord) => void;
  viewModalVisible: boolean;
  scene: API.SceneListRecord;
};

const SceneViewModal: React.FC<IProps> = (props) => {

  const {
    onCancel: setViewModalVisible,
    viewModalVisible,
    scene
  } = props;

  return (
    <Modal
      forceRender
      width={"75%"}
      destroyOnClose
      title="场景查看"
      open={viewModalVisible}
      footer={null}
      onCancel={() => { setViewModalVisible(false) }}
    >
      <SceneInfo scene={scene} />
    </Modal>
  );
};

export default SceneViewModal;
