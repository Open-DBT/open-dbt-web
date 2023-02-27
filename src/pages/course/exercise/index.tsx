import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Divider, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { queryExerciseList, updateExercise, removeExercise, getExerciseById, copyExerciseToMyCourse } from '@/services/teacher/course/exercise';
import { getKnowledge, getKnowledgeNotTree, getLastCourseList } 
from '@/services/teacher/course/course';
import { getKnowExerciseCountByCourseId } from '@/services/student/progress';
import { getShareScene } from '@/services/teacher/course/scene';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import ViewForm from './components/ViewModal';
import CopyForm from './components/CopyModal';
import { useModel } from 'umi';
import { API } from '@/common/entity/typings';

import './index.less'

type IProps = {
  course: API.CourseDetailRecord
  type: number //权限,-1只有查看权限
};

const ExerciseList: React.FC<IProps> = (props) => {
  console.log('ExerciseList props', props)
  const courseId = props.course.courseId;

  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);//新建
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);//修改
  const [viewModalVisible, handleViewModalVisible] = useState<boolean>(false);//查看
  const [copyModalVisible, handleCopyModalVisible] = useState<boolean>(false);//拷贝
  const [courseList, setCourseList] = useState<API.CourseListItem[]>([]);//课程列表

  const [stepFormValues, setStepFormValues] = useState<API.ExerciseRecord>();
  const [sceneList, setSceneList] = useState<API.SceneListRecord[]>([]);//场景列表
  const [graphData, setGraphData] = useState<any>();//知识树列表
  const [knowExercise, setKnowExercise] = useState<API.KnowledgeItemExerciseCount[]>([]);//知识树习题数量
  const [sceneNameEnum, setSceneNameEnum] = useState({});
  const [knowledgeNameEnum, setKnowledgeNameEnum] = useState({});
  const type = props.type;

  const { initialState } = useModel('@@initialState');
  if (!initialState || !initialState.settings) {
    return null;
  }
  const { currentUser } = initialState || {};
  const isCurrent = currentUser?.userId === props.course.creator;

  useEffect(() => {
    getShareScene(courseId).then((result) => {
      const valueEnum = {};
      result.obj.map((item: API.SceneListRecord) => {
        const text = item.sceneName;
        valueEnum[item.sceneId!] = { text };
      });
      setSceneNameEnum(valueEnum);
      setSceneList(result.obj);
    });

    getKnowledgeNotTree(courseId).then((result) => {
      const valueEnum = {};
      result.obj.map((item: API.KnowledgeListRecord) => {
        const text = item.name;
        valueEnum[item.knowledgeId] = { text };
      });
      setKnowledgeNameEnum(valueEnum);
    })

    getKnowledge(courseId).then(response => {
      console.log('response', response)
      setGraphData(JSON.parse(response.obj))
      //查询知识点习题总数
      commonFun();
    });
    //我的课程列表，用于习题复制
    getLastCourseList().then((resp) => {
      setCourseList(resp.obj)
    })
  }, []);

  const commonFun = () => {
    getKnowExerciseCountByCourseId(courseId).then(k => {
      if (k.obj) setKnowExercise(k.obj)
    })
  }
  const columns: ProColumns<API.ExerciseRecord>[] = [
    {
      title: '习题ID',
      dataIndex: 'exerciseId',
      search: false,
      hideInTable: false,//是否隐藏
      hideInForm: true,//表格新建是否显示此列
      align: 'center',
      width: 120,
    },
    {
      title: 'courseId',
      dataIndex: 'courseId',
      search: false,
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: 'knowledgeIds',
      dataIndex: 'knowledgeIds',
      search: false,
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
      title: '习题描述',
      dataIndex: 'exerciseDesc',
      align: 'left',
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '场景名称',
      dataIndex: 'sceneName',
      align: 'center',
      search: false,
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
      title: '知识点数量',
      dataIndex: 't1',
      align: 'center',
      search: false,
      hideInForm: true,//表格新建是否显示此列
      render: (dom, record, index, action) => {
        if (record.knowledgeIds.length === 0) {
          return '0个'
        } else {
          return record.knowledgeIds.length + '个'
        }
      },
    },
    {
      title: '知识点',
      dataIndex: 'knowledgeId',
      align: 'center',
      onFilter: true,
      valueType: 'select',
      valueEnum: knowledgeNameEnum,
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      search: false,
      render: (_, record) => {
        let buttons = [];
        buttons.push(
          <a key='1' onClick={() => toView(record.exerciseId)}>查看</a>,
        )
        if (type > 0) {
          buttons.push(
            <Divider key='11' type="vertical" />,
            <a key='2' onClick={() => toEdit(record.exerciseId)}>修改</a>,
            <Divider key='21' type="vertical" />,
            <a key='3' onClick={() => { deleteExerciseModal(record as API.ExerciseRecord) }}>删除</a>,
          )
        }
        if (!isCurrent) {
          //非本人创建，才可以复制
          buttons.push(
            <Divider key='41' type="vertical" />,
            <a key='4' onClick={() => toCopy(record)}>复制到我的课程</a>,
          );
        }
        return buttons;
      }
    }
  ];

  //点击修改
  const toEdit = (exerciseId: number) => {
    getExerciseById(exerciseId).then((resp) => {
      handleUpdateModalVisible(true);
      setStepFormValues(resp.obj)
    })
  }
  //点击查看
  const toView = (exerciseId: number) => {
    getExerciseById(exerciseId).then((resp) => {
      handleViewModalVisible(true);
      setStepFormValues(resp.obj)
    })
  }
  //复制习题
  const toCopy = (record: API.ExerciseRecord) => {
    handleCopyModalVisible(true);
    setStepFormValues(record)
  }

  // 删除角色弹窗，之所以方法放到TableList里面，是因为需要调用actionRef
  const deleteExerciseModal = (record: API.ExerciseRecord) => {
    Modal.confirm({
      title: '删除习题',
      content: '确定删除该习题吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteExercise(record.exerciseId),
    });
  };
  // 删除角色
  const deleteExercise = async (exerciseId: number) => {
    const hide = message.loading('正在删除');
    try {
      await removeExercise(exerciseId);
      hide();
      message.success('删除成功，即将刷新');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      console.log('error ', error)
    }
  }

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
        headerTitle="习题列表"
        rowKey="exerciseId"
        request={(params, sorter, filter) => queryExerciseList({ courseId, ...params, sorter, filter })}
        columns={columns}
        toolBarRender={() => [
          type > 0 ?
            <Button type="primary" onClick={() => { handleCreateModalVisible(true) }}>
              <PlusOutlined /> 新建
            </Button> : null
        ]}
        options={options}
      />

      <CreateForm
        onSubmit={async (value: API.ExerciseListParams) => {
          console.log('onFinish value:', value);
          const result = await updateExercise(value)
          if (result.success) {
            message.success('保存成功');
          } else {
            message.error(result.message);
            return;
          }
          //刷新页面
          handleCreateModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
          //刷新习题知识点绑定
          commonFun()
        }}
        onCancel={() => {
          handleCreateModalVisible(false);
        }}
        createModalVisible={createModalVisible}
        courseId={courseId}
        sceneList={sceneList}
        graphData={graphData!}
        knowExercise={knowExercise}
      />

      {updateModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value: API.ExerciseListParams) => {
            console.log('onFinish value:', value);
            const result = await updateExercise(value)
            //提交验证
            if (result.message) {
              message.warn(result.message);
              return;
            }
            //刷新页面
            handleUpdateModalVisible(false);
            setStepFormValues(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
            //刷新习题知识点绑定
            commonFun()
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues(undefined);
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          sceneList={sceneList}
          graphData={graphData!}
          knowExercise={knowExercise}
        />
      ) : null}

      {viewModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
        <ViewForm
          onCancel={() => {
            handleViewModalVisible(false);
            setStepFormValues(undefined);
          }}
          viewModalVisible={viewModalVisible}
          values={stepFormValues}
        />
      ) : null}
      {copyModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
        <CopyForm
          onSubmit={async (value: { exerciseId: number, courseId: number }) => {
            console.log('onFinish value:', value);
            const result = await copyExerciseToMyCourse(value)
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

export default ExerciseList
