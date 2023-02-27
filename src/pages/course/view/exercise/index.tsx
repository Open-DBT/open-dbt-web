import { useEffect, useState } from 'react';
import '@/pages/common-course/course-common.less';
import '@/pages/home.less';
import '@/pages/common-course/exercise/index.less';
import { getKnowledgeNotTree } from '@/services/teacher/course/course';
import { getShareScene } from '@/services/teacher/course/scene';
import { getExerciseList, getExerciseById, exportExerciseList }
  from '@/services/teacher/course/exercise';
import Content from '@/pages/common-course/exercise/content';
import ViewModal from '@/pages/common-course/exercise/components/ViewModal';
import * as APP from '@/app';
import { message } from 'antd';
import { API } from '@/common/entity/typings';


const CourseViewExercise = (props: { courseId: number }) => {
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
    <div className="course-content">
      <Content
        type={0}
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
        deleteExerciseModal={(record: API.ExerciseRecord) => console.log()}
        exportExercise={() => exportExercise()}
      />
      {
        viewModalVisible && stepFormValues && Object.keys(stepFormValues).length && (
          <ViewModal
            onCancel={() => {
              handleViewModalVisible(false);
              setStepFormValues(undefined);
            }}
            viewModalVisible={viewModalVisible}
            values={stepFormValues}
          />
        )
      }
    </div>
  );
};
export default CourseViewExercise;
