import { useEffect, useState } from 'react';
import MindCanvas from './Graph/canvas-content'
import { getCourseDetail } from '@/services/teacher/course/course'
import { getKnowExerciseCountByCourseId } from '@/services/student/progress';
import Scene from '@/pages/course/scene'
import Exercise from '@/pages/course/exercise'
import { Card, Tabs } from 'antd';
import CourseView from '@/pages/components/CourseInfo';
import { API } from '@/common/entity/typings';

const defaultState = {
  courseId: -1,
  courseName: '',
  courseDesc: '',
  courseOutline: '',
  isOpen: 0
}

const Step4 = (props: any) => {
  const [course, setCourse] = useState<API.CourseDetailRecord>(defaultState);
  const [graphData, setGraphData] = useState();
  const [knowExercise, setKnowExercise] = useState<API.KnowledgeItemExerciseCount[]>();//知识树习题数量

  if (!props.match!.params.courseId) {
    return;
  }
  const courseId = props.match!.params.courseId

  useEffect(() => {
    getCourseDetail(courseId).then(data => {
      if (data.obj) {
        setCourse(data.obj)
        if (data.obj.knowledgeTree && data.obj.knowledgeTree.length > 0) {
          setGraphData(JSON.parse(data.obj.knowledgeTree))
          //查询知识点习题总数
          getKnowExerciseCountByCourseId(courseId).then(k => {
            if (k.obj) setKnowExercise(k.obj)
          })
        }
      }
    })
  }, []);

  return (
    <>
      <Card bordered={false}>
        <Tabs defaultActiveKey="1" type="card"
          items={[
            {
              key: "1",
              label: '课程信息',
              children:
                <CourseView course={course} />
            }, {
              key: "2",
              label: '课程知识树',
              children:
                <MindCanvas graphData={graphData!} knowExercise={knowExercise} />
            }, {
              key: "3",
              label: '课程场景',
              children:
                <Scene course={course} type={-1} />
            }, {
              key: "4",
              label: '课程习题',
              children:
                <Exercise course={course} type={-1} />
            }
          ]}
        />
      </Card>
    </>
  );
};

export default Step4
