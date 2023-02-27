import { useEffect, useState } from 'react';
import './index.less';
import { getExerciseList, removeExercise, getExerciseById, exportExerciseList }
  from '@/services/teacher/course/exercise';
import { message, Modal } from 'antd';
import { getKnowledgeNotTree } from '@/services/teacher/course/course';
import { getShareScene } from '@/services/teacher/course/scene';
import ViewModal from './components/ViewModal';
import Content from './content';
import * as APP from '@/app';
import { API } from '@/common/entity/typings';

const ExerciseIndex = (props: any) => {
  const [exerciseList, setExerciseList] = useState<API.ExerciseRecord[]>([]);
  const [viewModalVisible, handleViewModalVisible] = useState<boolean>(false);//查看
  const [stepFormValues, setStepFormValues] = useState<API.ExerciseRecord>();
  //模糊查询
  const [sceneId, setSceneId] = useState<number | undefined>(undefined);//场景id
  const [knowledgeId, setKnowledgeId] = useState<number | undefined>(undefined);//知识点id
  const [exerciseDesc, setExerciseDesc] = useState<string>('');//习题标题或习题描述
  const [allKnowledge, setAllKnowledge] = useState<API.KnowledgeListRecord[]>([]);
  const [allScene, setAllScene] = useState<API.SceneListRecord[]>([]);//场景列表

  const courseId = props.courseId;

  useEffect(() => {
    fetchExerciseList();
    //查询场景列表,下拉使用
    getShareScene(courseId).then((result) => {
      setAllScene(result.obj);
    });
    //查询当前课程未使用的知识树列表,下拉列表使用
    getKnowledgeNotTree(courseId).then((result) => {
      setAllKnowledge(result.obj)
    })
  }, []);
  /**
   * 查询场景列表
   */
  const fetchExerciseList = () => {
    getExerciseList({
      courseId: courseId,
      sceneId: sceneId,
      exerciseDesc: exerciseDesc,
      knowledgeId: knowledgeId
    }).then((result) => {
      setExerciseList(result.obj);
    });

  }
  const resetFetchExerciseList = () => {
    getExerciseList({
      courseId: courseId,
      sceneId: undefined,
      exerciseDesc: '',
      knowledgeId: undefined
    }).then((result) => {
      setExerciseList(result.obj);
    });
  }
  //点击查看
  const toView = (exerciseId: number) => {
    getExerciseById(exerciseId).then((resp) => {
      handleViewModalVisible(true);
      setStepFormValues(resp.obj)
    })
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
    try {
      await removeExercise(exerciseId);
      message.success('删除成功!');
      fetchExerciseList();
    } catch (error) {
      message.error('删除失败，请重试');
      console.log('error ', error)
    }
  }

  // 导出习题
  const exportExercise = async () => {
    exportExerciseList({ courseId: courseId, sceneId: sceneId, exerciseDesc: exerciseDesc, knowledgeId: knowledgeId }).then((result) => {
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
    <>
      <Content
        type={1}
        courseId={courseId}
        exerciseList={exerciseList}
        //模糊查询常量
        allScene={allScene}
        allKnowledge={allKnowledge}
        //模糊查询变量
        sceneId={sceneId}
        knowledgeId={knowledgeId}
        exerciseDesc={exerciseDesc}
        //模糊查询组件事件
        setSceneId={(value: number | undefined) => setSceneId(value)}
        setKnowledgeId={(value: number | undefined) => setKnowledgeId(value)}
        setExerciseDesc={(value: string) => setExerciseDesc(value)}
        fetchExerciseList={() => fetchExerciseList()}
        resetFetchExerciseList={() => resetFetchExerciseList()}
        //按钮组
        toView={(value: number) => toView(value)}
        deleteExerciseModal={(record: API.ExerciseRecord) => deleteExerciseModal(record)}
        exportExercise={() => exportExercise()}
      />

      {viewModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
        <ViewModal
          onCancel={() => {
            handleViewModalVisible(false);
            setStepFormValues(undefined);
          }}
          viewModalVisible={viewModalVisible}
          values={stepFormValues}
        />
      ) : null}
      {/* {copyModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
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
      ) : null} */}
    </>
  );
};
export default ExerciseIndex;
