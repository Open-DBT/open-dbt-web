import { useEffect, useState } from 'react';
import '@/pages/common-course/course-common.less';
import '@/pages/home.less';
import '@/pages/common-course/knowledge/index.less';
import MindCanvas from '@/pages/knowledgeTree/Graph/MindMap'
import { getCourseDetail } from '@/services/teacher/course/course';
import { getKnowExerciseCountByCourseId } from '@/services/student/progress';
import { API } from '@/common/entity/typings';

const CourseViewKnow = (props: { courseId: number }) => {
  const [graphData, setGraphData] = useState<any>();//图形数据
  const [knowExerciseList, setKnowExerciseList] = useState<API.KnowledgeItemExerciseCount[]>([]);

  useEffect(() => {
    fetch(props.courseId);
  }, []);

  /**
   * 请求数据
   */
  const fetch = (courseId: number) => {
    //查询课程
    getCourseDetail(courseId).then((result) => {
      const defaultRoot = {
        id: -1,
        text: result.obj.courseName,
        keyword: '',
        children: []
      }
      setGraphData(result.obj.knowledgeTree ? JSON.parse(result.obj.knowledgeTree) : defaultRoot)
    })
    //查询每个知识点习题总数
    getKnowExerciseCountByCourseId(courseId).then(k => {
      if (k.obj) setKnowExerciseList(k.obj)
    })
  }

  return (
    <div className="course-content">
      <div className="title-4">知识体系</div>
      <div className="mind-canvas-div">
        <MindCanvas
          graphData={graphData}
          knowExercise={knowExerciseList}
        />
      </div>
    </div>
  );
};
export default CourseViewKnow;
