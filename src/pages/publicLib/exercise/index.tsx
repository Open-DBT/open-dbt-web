import { useRef, useState, useEffect } from 'react';
import PublicMenu from '../menu';
import './index.less';
import '@/pages/common-course/course-common.less';
import { Button, message, Modal } from 'antd';
import { history } from 'umi';
import * as APP from '@/app';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { API } from '@/common/entity/typings';
import { getPublicExerciseList, getSceneNameList, removeExercise, exportPublicExerciseList } from '@/services/teacher/course/publicLib';
import ImportExerciseModal from './components/components/ImportExerciseModal';

const ExerciseIndex = (props: any) => {

  const actionRef = useRef<ActionType>();
  const [sceneNameEnum, setSceneNameEnum] = useState({});
  const [importExerciseModalVisible, setImportExerciseModalVisible] = useState<boolean>(false);

  const columns: ProColumns<API.PublicExerciseList>[] = [
    {
      title: '习题ID',
      dataIndex: 'exerciseId',
      search: false,
      align: 'center',
    },
    {
      title: '关键字',
      dataIndex: 'exerciseDesc',
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '场景',
      dataIndex: 'sceneId',
      align: 'center',
      onFilter: true,
      valueType: 'select',
      valueEnum: sceneNameEnum,
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '习题名称',
      dataIndex: 'exerciseName',
      align: 'center',
      search: false,
    },
    {
      title: '场景名称',
      dataIndex: 'sceneName',
      align: 'center',
      search: false,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      align: 'center',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      search: false,
      render: (_, record) => {
        let buttons = [];
        buttons.push(
          <a key='1' onClick={() => history.push(`/expert/public_library/exercise/${record.exerciseId}/update`)}>编辑</a>,
          <a key='2' style={{ marginLeft: '15px' }} onClick={() => handleDelExercise(record.exerciseId!)}>删除</a>
        )
        return buttons;
      }
    }
  ];

  useEffect(() => {
    getSceneNameList().then((result) => {
      const valueEnum = {};
      result.obj.map((item: API.PublicSceneRecord) => {
        const text = item.sceneName;
        valueEnum[item.sceneId!] = { text };
      });
      setSceneNameEnum(valueEnum);
    });
  }, []);

  // 删除习题
  const handleDelExercise = (exerciseId: number) => {
    Modal.confirm({
      title: '删除习题',
      content: `确定删除该习题吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await removeExercise(exerciseId);
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
      },
    });
  };

  // 导出习题
  const exportPublicExercise = async () => {
    exportPublicExerciseList().then((result) => {
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

  const menuProps = { active: 'exercise' };

  return (
    <div className="flex course">
      <PublicMenu {...menuProps} />
      <div style={{ width: '97%' }}>

        <div className="course-content">
          <div className="title-4">习题</div>
          <div className="exercise-tool">
            <Button type="primary" onClick={() => history.push(`/expert/public_library/exercise/create`)}>新建习题</Button>
            <Button type="primary" onClick={() => exportPublicExercise()}>导出所有习题</Button>
            <Button type="primary" onClick={() => setImportExerciseModalVisible(true)}>导入习题</Button>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: 20, marginTop: '20px', borderRadius: '7px' }}>
            <ProTable
              actionRef={actionRef}
              rowKey="id"
              request={(params, sorter, filter) => getPublicExerciseList({ ...params, sorter, filter })}
              columns={columns}
              toolBarRender={false}
            />
          </div>
        </div>
      </div>

      <ImportExerciseModal
        onCancel={() => {
          setImportExerciseModalVisible(false);
        }}
        actionRef={actionRef}
        modalVisible={importExerciseModalVisible}
        courseId={props.courseId}
      />

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
export default ExerciseIndex;
