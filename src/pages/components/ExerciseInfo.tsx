import { Typography, Divider } from 'antd';
const { Title, Paragraph } = Typography;
import { isNotEmptyBraft } from '@/utils/utils';
import { API } from '@/common/entity/typings';

interface IProps {
  exercise: API.ExerciseRecord;
  type: number;//0:student,1:teacher
};

const ExerciseInfo: React.FC<IProps> = (props) => {
  const { exercise, type } = props;
  return (
    <Typography>
      <Title level={4}>习题描述</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {isNotEmptyBraft(exercise.exerciseDesc) ?
          <div dangerouslySetInnerHTML={{ __html: exercise.exerciseDesc }} />
          : '无'}
        <div style={{ clear: 'both' }} />
      </Paragraph>

      <Title level={4}>场景描述</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {isNotEmptyBraft(exercise.scene.sceneDesc) ?
          <div dangerouslySetInnerHTML={{ __html: exercise.scene.sceneDesc }} />
          : '无'}
        <div style={{ clear: 'both' }} />
      </Paragraph>

      {
        type === 1 ?
          <div>
            <Title level={4}>正确答案</Title>
            <Divider />
            <Paragraph style={{ fontSize: '1.05rem' }}>
              {exercise.answer && exercise.answer.trim().length > 0 ? <pre>
                <code style={{ fontSize: 14 }}>
                  {exercise.answer}
                </code>
              </pre> : '无'}
            </Paragraph>
          </div>
          : null
      }
    </Typography>
  );
}

export default ExerciseInfo;