import React from 'react';
import { Modal, Typography, Divider, Tag } from 'antd';
import ExerciseInfo from '@/pages/components/ExerciseInfo'
const { Title, Paragraph } = Typography;
import { getKnowledgeColor } from '@/utils/utils';
import { API } from '@/common/entity/typings';
interface IProps {
  onCancel: () => void;
  viewModalVisible: boolean;
  values: API.ExerciseRecord;
}

const ViewModal: React.FC<IProps> = (props) => {
  console.log('updateExercise props ', props);
  const {
    onCancel: handleCreateModalVisible,
    viewModalVisible,
    values,
  } = props;
  const title = '#' + values.exerciseId + '  ' + values.exerciseName

  return (
    <Modal
      className="exercise"
      width={"75%"}
      destroyOnClose
      title={title}
      open={viewModalVisible}
      footer={null}
      onCancel={() => { handleCreateModalVisible() }}
    >
      <ExerciseInfo exercise={values} type={1} />

      <Typography>
        <Title level={4}>习题知识点</Title>
        <Divider />
        <Paragraph style={{ fontSize: '1.05rem' }}>
          {

            values.knowledgeNames.length > 0
              ? values.knowledgeNames.map((ele: string, index) => {
                return <Tag key={index} color={getKnowledgeColor()[index]}>{ele}</Tag>
              })
              : '无'
          }
        </Paragraph>
      </Typography>
    </Modal>
  )
}

export default ViewModal;
