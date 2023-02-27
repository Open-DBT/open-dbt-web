import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { getSceneInfo } from '@/services/teacher/course/scene';
import SceneInfo from '@/pages/components/SceneInfo'
import { API } from '@/common/entity/typings';

const ViewScene: React.FC<{}> = (props: any) => {
  const [scene, setScene] = useState<API.SceneListRecord>();

  useEffect(() => {
    if (props.match.params.sceneId) {
      getSceneInfo(props.match.params.sceneId).then(data => {
        console.log('getSceneInfo data ', data)
        setScene(data.obj);
      });
    }
  }, []);

  return (
      <Card bordered={false}>
        {
          scene ? <SceneInfo scene={scene} />
            : null
        }
      </Card>
  );
};

export default ViewScene;
