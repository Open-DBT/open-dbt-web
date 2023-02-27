import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { getSceneDetail } from '@/services/teacher/course/publicLib';
import SceneInfo from '@/pages/components/SceneInfo'
import { API } from '@/common/entity/typings';
const ViewScene: React.FC<{}> = (props: any) => {
  const [scene, setScene] = useState<API.PublicSceneRecord>();

  useEffect(() => {
    if (props.match.params.sceneId) {
      getSceneDetail(props.match.params.sceneId).then((data) => {
        setScene(data.obj);
      });
    }
  }, []);

  return (
    <Card bordered={false}>
      {
        scene ? <SceneInfo scene={scene} /> : null
      }
    </Card>
  );
};

export default ViewScene;
