import { useEffect, useState } from 'react';
import './index.less';
import { getShareScene, removeScene, exportSceneList, exportSceneById }
  from '@/services/teacher/course/scene';
import { Tooltip, Button, message, Modal } from 'antd';
import ViewModal from './components/ViewModal';
import { history } from 'umi';
import * as APP from '@/app';
import ImportSceneModal from './components/ImportSceneModal'
import { API } from '@/common/entity/typings';
import logo from '@/img/logo-itol.png'
import { useParams } from 'umi'
import { ValidateIntegerParam } from '@/utils/utils'


const SceneIndex = () => {
  const [sceneList, setSceneList] = useState<API.SceneListRecord[]>([]);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<API.SceneListRecord>();
  const [importSceneModalVisible, setImportSceneModalVisible] = useState<boolean>(false);
  const params: any = useParams();
  const courseId = params.courseId;

  useEffect(() => {
    ValidateIntegerParam(courseId);
    fetchSceneList();
  }, []);

  /**
   * 查询场景列表
   */
  const fetchSceneList = () => {
    getShareScene(courseId).then((result) => {
      setSceneList(result.obj);
    });
  }

  /**
   * 删除场景弹窗
   * @param record 
   */
  const handleDel = (record: API.SceneListRecord) => {
    console.log(record)
    Modal.confirm({
      title: '删除场景',
      content: `确定删除 "${record.sceneName}" 场景吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => delScene(record.sceneId),
    });
  };
  /**
   * 删除场景
   * @param sceneId 
   * @returns 
   */
  const delScene = async (sceneId?: number) => {
    try {
      const result = await removeScene(sceneId);
      if (result.message) {
        message.warn(result.message);
        return;
      }
      fetchSceneList();
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };
  /**
   *  根据课程id，导出全部场景
   */
  const handExportScene = async () => {
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
  /**
   *  根据场景id，导出场景
   */
  const handExportSceneById = async (record: API.SceneListRecord) => {
    exportSceneById(record.sceneId).then((result) => {
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

  /**
   * 场景每行点击后的按钮提示
   * @param record 
   * @returns 
   */
  const hoverContent = (record: API.SceneListRecord) => {
    return <div className="card-buttons">
      <Button style={{ marginRight: 8 }} className="gray-button" onClick={() => { handExportSceneById(record) }}>导出</Button>
      <Button style={{ marginRight: 8 }} className="gray-button" onClick={() => { setViewModalVisible(true); setStepFormValues(record) }}>查看</Button>
      <Button type="primary" style={{ marginRight: 8 }}
        onClick={() => history.push(`/scene/update/${courseId}/${record.sceneId}`)}>编辑</Button>
      <Button type="primary" onClick={() => { handleDel(record) }} danger>删除</Button>
    </div>
  };
  return (
    <div className='custom-single'>
      <div className='custom-header-row' style={{ position: 'fixed', top: 0 }}>
        <div className='custom-header-row' style={{ position: 'fixed', top: 0 }}>
          <div className='header-logo'>
            <img src={logo} alt="" onClick={() => history.push('/')} />
          </div>
        </div>
      </div>

      <div className='main-container scene'>
        <div className="title-4">场景</div>
        <div className="scene-tool">
          <Button type="primary" onClick={() => window.open(`/scene/create/${courseId}`)}>添加场景</Button>
          <Button type="primary" onClick={() => handExportScene()}>导出场景</Button>
          <Button type="primary" onClick={() => setImportSceneModalVisible(true)}>导入场景</Button>
        </div>
        <div className="flex wrap scene-list">
          {
            sceneList?.map((item, index) => {
              return <Tooltip
                placement="right"
                title={hoverContent(item)}
                trigger="click"
                key={index}
                overlayClassName="scene-card-buttons"
                align={{
                  offset: [-320, 0],//x,y
                }}
              >
                <div key={index} className="flex scene-card" >
                  {/* style={{ margin: index >= 1 && index % 2 === 1 ? '0px 0px 16px 0px' : '0px 1% 16px 0px' }} */}
                  <div className="card-index">
                    {index + 1}
                  </div>
                  <span className="title-2">{item.sceneName}</span>
                </div>
              </Tooltip>
            })
          }
        </div>
      </div>
      {viewModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
        <ViewModal
          onCancel={() => {
            setViewModalVisible(false);
          }}
          viewModalVisible={viewModalVisible}
          scene={stepFormValues}
        />
      ) : null}

      <ImportSceneModal
        onCancel={() => {
          setImportSceneModalVisible(false);
        }}
        fetchSceneList={() => fetchSceneList()}
        modalVisible={importSceneModalVisible}
        courseId={courseId}
      />
    </div>
  );
};

export default SceneIndex;