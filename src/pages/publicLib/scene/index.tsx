import { useRef } from 'react';
import PublicMenu from '../menu';
import './index.less';
import '@/pages/common-course/course-common.less';
import { getPublicSceneList, removeScene } from '@/services/teacher/course/publicLib';
import { Button, message, Modal } from 'antd';
import { API } from '@/common/entity/typings';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

const SceneIndex = (props: any) => {

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.PublicSceneRecord>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      align: 'center',
      render: (dom, record, index, action) => {
        return index + 1;
      },
    },
    {
      title: 'sceneId',
      dataIndex: 'sceneId',
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '场景名称',
      dataIndex: 'sceneName',
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      search: false,
      render: (_, record) => {
        let buttons = [];
        buttons.push(
          <a key='1' onClick={() => history.push(`/expert/public_library/scene/${record.sceneId}/update`)}>编辑</a>,
          <a key='2' style={{ marginLeft: '15px' }} onClick={() => handleDelScene(record)}>删除</a>
        )
        return buttons;
      }
    }
  ];

  // 删除场景
  const handleDelScene = (record: API.PublicSceneRecord) => {
    Modal.confirm({
      title: '删除场景',
      content: `确定删除【${record.sceneName}】场景吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await removeScene(record.sceneId);
          if (result.success) {
            message.success('删除成功');
            if (actionRef.current) {
              actionRef.current.reload();
            }
          } else {
            message.error(`删除失败, ${result!.message}`);
          }
        } catch (error) {
          message.error(`删除失败，请重试, ${error}`);
        }
      }
    });
  };

  const menuProps = { active: 'scene' };

  return (
    <div className="flex course">
      <PublicMenu {...menuProps} />
      <div style={{ width: '97%' }}>

        <div className="course-content">
          <div className="title-4">场景</div>
          <div className="scene-tool">
            <Button type="primary" onClick={() => history.push('/expert/public_library/scene/create')}>添加场景</Button>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: 20, marginTop: '20px', borderRadius: '7px' }}>
            <ProTable
              actionRef={actionRef}
              rowKey="id"
              request={(params, sorter, filter) => getPublicSceneList({ ...params, sorter, filter })}
              columns={columns}
              search={false}
              toolBarRender={false}
            />
          </div>
          {/* <div className="flex wrap scene-list">
            {
              sceneList?.map((item, index) => {
                return <Tooltip
                  placement="right"
                  title={hoverContent(item)}
                  trigger="click"
                  key={index}
                  overlayClassName="scene-card-buttons"
                  align={{
                    offset: [-250, 0],//x,y
                  }}
                >
                  <div key={index} className="flex scene-card" style={{ margin: index >= 1 && index % 2 === 1 ? '0px 0px 16px 0px' : '0px 1% 16px 0px' }}>
                    <div className="card-index">
                      {index + 1}
                    </div>
                    <span className="title-2">{item.sceneName}</span>
                  </div>
                </Tooltip>
              })
            }
          </div> */}
        </div>
      </div>

      {/* {viewModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
        <ViewModal
          onCancel={() => {
            setViewModalVisible(false);
          }}
          viewModalVisible={viewModalVisible}
          scene={stepFormValues}
        />
      ) : null} */}
    </div>
  );
};
export default SceneIndex;
