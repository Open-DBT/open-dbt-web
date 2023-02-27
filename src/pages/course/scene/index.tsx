import React, { useRef, useState, useEffect } from 'react';
import { Button, Divider, message, Modal } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { queryScene, removeScene, copySceneToMyCourse, saveScene } 
from '@/services/teacher/course/scene';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import ViewModal from './components/ViewModal';
import { useModel } from 'umi';
import { getLastCourseList } from '@/services/teacher/course/course';
import CopyForm from './components/CopyModal';
import { API } from '@/common/entity/typings';

interface IProps {
  course: API.CourseDetailRecord;
  type: number; //权限,-1只有查看权限
};

const SceneList: React.FC<IProps> = (props) => {
  const courseId = props.course.courseId;
  const type = props.type;
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);//新建
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);//修改  
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [copyModalVisible, handleCopyModalVisible] = useState<boolean>(false);//拷贝
  const [courseList, setCourseList] = useState<API.CourseListItem[]>([]);//课程列表

  const [stepFormValues, setStepFormValues] = useState<API.SceneListRecord>();
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  if (!initialState || !initialState.settings) {
    return null;
  }
  const { currentUser } = initialState || {};
  const isCurrent = currentUser?.userId === props.course.creator;
  useEffect(() => {
    //我的课程列表，用于习题复制
    getLastCourseList().then((resp) => {
      setCourseList(resp.obj)
    })
  }, []);
  const columns: ProColumns<API.SceneListRecord>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      align: 'center',
      render: (dom, record, index, action) => {
        if (actionRef.current?.pageInfo?.current! > 1) {
          return (actionRef.current?.pageInfo?.current! - 1) * actionRef.current?.pageInfo?.pageSize! + index + 1;
        } else {
          return index + 1;
        }
      },
    },
    {
      title: 'sceneId',
      dataIndex: 'sceneId',
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: 'courseId',
      dataIndex: 'courseId',
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '场景名称',
      dataIndex: 'sceneName',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      render: (_, record) => {
        let buttons = [];
        buttons.push(
          <a key='0' onClick={() => { setViewModalVisible(true); setStepFormValues(record) }}>查看</a>,
        )
        if (type > 0) {
          buttons.push(
            <Divider key='00' type="vertical" />,
            <a key='1' onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record) }}>修改</a>,
            <Divider key='11' type="vertical" />,
            <a key='2' onClick={() => { handleDel(record) }}>删除</a>
          );
        }
        if (!isCurrent) {
          //非本人创建，才可以复制
          buttons.push(
            <Divider key='21' type="vertical" />,
            <a key='3' onClick={() => { toCopy(record) }}>复制到我的课程</a>
          );
        }
        return buttons;
      }
    }
  ];
  //复制习题
  const toCopy = (record: API.SceneListRecord) => {
    handleCopyModalVisible(true);
    setStepFormValues(record)
  }

  // 删除场景弹窗
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
  // 删除场景
  const delScene = async (sceneId?: number) => {
    try {
      const result = await removeScene(sceneId);
      if (result.message) {
        message.warn(result.message);
        return;
      }
      message.success('删除成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } catch (error) {
      message.error('删除失败，请重试');
      console.log('error ', error)
    }
  };

  /**
   * 保存
   * @param {*} values 
   */
  const updateScene = async (values: API.SceneListRecord) => {
    const sceneDetailList: API.SceneListRecord[] = [];
    const result = await saveScene({ ...values, courseId: courseId, sceneDetailList: sceneDetailList })
    if (result.success) {
      message.success('保存成功');
      handleCreateModalVisible(false)
      handleUpdateModalVisible(false);
      setStepFormValues(undefined);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(result.message);
    }
  };

  const options = {
    density: false,//密度
    fullScreen: false,//最大化
    reload: true, //刷新
    setting: true //设置
  };

  return (
    <>
      <ProTable
        actionRef={actionRef}
        headerTitle="场景列表"
        rowKey="sceneId"
        request={(params, sorter, filter) => queryScene({ ...params, courseId: courseId, sorter, filter })}
        columns={columns}
        search={false}
        toolBarRender={() => [
          type > 0 ?
            <Button type="primary" onClick={() => { handleCreateModalVisible(true); }}>
              <PlusOutlined /> 新建
            </Button> : null
        ]}
        options={options}
      />

      <CreateForm
        onSubmit={async (values: API.SceneListRecord) => {
          await updateScene(values);
        }}
        onCancel={() => {
          handleCreateModalVisible(false);
        }}
        createModalVisible={createModalVisible}
      />

      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (values: API.SceneListRecord) => {
            await updateScene(values);
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues(undefined);
          }}
          updateModalVisible={updateModalVisible}
          scene={stepFormValues}
        />
      ) : null}

      {stepFormValues && viewModalVisible && Object.keys(stepFormValues).length ? (
        <ViewModal
          onCancel={() => {
            setViewModalVisible(false);
          }}
          viewModalVisible={viewModalVisible}
          scene={stepFormValues}
        />
      ) : null}

      {copyModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
        <CopyForm
          onSubmit={async (value: { sceneId: number, courseId: number }) => {
            console.log('onFinish value:', value);
            const result = await copySceneToMyCourse(value)
            if (result.success) {
              message.success('保存成功');
            } else {
              message.error(result.message);
              return;
            }
            handleCopyModalVisible(false);
          }}
          onCancel={() => {
            handleCopyModalVisible(false);
          }}
          copyModalVisible={copyModalVisible}
          courseList={courseList}
          values={stepFormValues}
        />
      ) : null}
    </>
  );
};

export default SceneList;