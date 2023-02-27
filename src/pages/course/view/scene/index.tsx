import { useEffect, useState } from 'react';
import '@/pages/common-course/course-common.less';
import '@/pages/common-course/scene/index.less';
import '@/pages/home.less';
import { getShareScene, exportSceneList } from '@/services/teacher/course/scene';
import { Tooltip, Button, message } from 'antd';
import ViewModal from '@/pages/common-course/scene/components/ViewModal';
import * as APP from '@/app';
import { API } from '@/common/entity/typings';

const CourseViewScene = (props: { courseId: number }) => {
  const [sceneList, setSceneList] = useState<API.SceneListRecord[]>([]);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<API.SceneListRecord>();
  const courseId = props.courseId;

  useEffect(() => {
    fetchSceneList();
  }, []);

  /**
   * 查询场景列表
   */
  const fetchSceneList = () => {
    getShareScene(courseId).then((result) => {
      result.success && setSceneList(result.obj);
    });
  }

  // 导出场景
  const exportScene = async () => {
    exportSceneList(courseId).then((result) => {
      if (result.success) {
        const link = document.createElement('a');
        const evt = document.createEvent('MouseEvents');
        link.style.display = 'none';
        link.href = `${APP.request.prefix}/temp/${result.obj}`;
        link.download = result.obj;
        document.body.appendChild(link); // 此写法兼容可火狐浏览器
        evt.initEvent('click', false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);// 下载完成移除元素
        window.URL.revokeObjectURL(link.href); // 释放掉blob对象
      } else {
        message.error(result.message);
      }
    });
  }
  return (
    <div className="course-content">
      <div className="title-4">场景</div>
      <div className="scene-tool">
        <Button type="primary" onClick={() => exportScene()}>导出场景</Button>
      </div>
      <div className="flex wrap scene-list">
        {
          sceneList?.map((item, index) => {
            return <Tooltip
              title="点击查看场景详情"
              key={index}
            >
              <div key={index} className="flex scene-card" onClick={() => { setViewModalVisible(true); setStepFormValues(item) }}
                style={{ margin: index >= 1 && index % 2 === 1 ? '0px 0px 16px 0px' : '0px 1% 16px 0px' }}>
                <div className="card-index">
                  {index + 1}
                </div>
                <span className="title-2">{item.sceneName}</span>
              </div>
            </Tooltip>
          })
        }
      </div>
      {
        viewModalVisible && stepFormValues && Object.keys(stepFormValues).length && (
          <ViewModal
            onCancel={() => {
              setViewModalVisible(false);
            }}
            viewModalVisible={viewModalVisible}
            scene={stepFormValues}
          />
        )
      }
    </div>
  );
};
export default CourseViewScene;
