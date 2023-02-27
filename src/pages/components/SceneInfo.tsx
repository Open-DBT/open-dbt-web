import { Typography, Divider } from 'antd';
const { Title, Paragraph } = Typography;
import { isNotEmptyBraft } from '@/utils/utils';
import { API } from '@/common/entity/typings';

interface IProps {
  scene: API.SceneListRecord | API.PublicSceneRecord;
};

const SceneInfo: React.FC<IProps> = (props) => {

  const { scene } = props;

  return (
    <Typography>
      <Title level={4}>应用场景名称</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {scene.sceneName}
      </Paragraph>

      <Title level={4}>应用场景描述</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>
        {isNotEmptyBraft(scene.sceneDesc) ?
          <div dangerouslySetInnerHTML={{ __html: scene.sceneDesc }} />
          : '无'}
        <div style={{ clear: 'both' }} />
      </Paragraph>

      <Title level={4}>初始化脚本</Title>
      <Divider />
      <Paragraph style={{ fontSize: '1.05rem' }}>

        {scene.initShell && scene.initShell.trim().length > 0 ? <pre>
          <code style={{ fontSize: 14 }}>
            {scene.initShell}
          </code>
        </pre> : '无'}
      </Paragraph>
    </Typography>
  );
}

export default SceneInfo;