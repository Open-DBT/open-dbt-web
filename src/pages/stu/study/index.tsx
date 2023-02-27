import { useEffect, useState } from 'react';
import MindCanvas from '@/pages/course/course/view/Graph/canvas-content';
import { Divider } from 'antd';
import { getSclassInfoById } from '@/services/teacher/clazz/sclass';
import { getKnowExerciseCountByCourseId } from '@/services/student/progress';
import StudentMenu from './menu';
import { isNotEmptyBraft } from '@/utils/utils';
import './index.less';
import './forwordPage';
import Home from './home';
import { API } from '@/common/entity/typings';

/**
 * 课程首页
 * @param props 
 * @returns 
 */
const study = (props: any) => {
  const [graphData, setGraphData] = useState(); //知识树tree string
  const [knowExercise, setKnowExercise] = useState<API.KnowledgeItemExerciseCount[]>([]); //知识树习题数量
  const [sclassInfo, setSclassInfo] = useState<API.SclassRecord>();
  if (!props.match!.params.courseId) {
    return;
  }
  const courseId = props.match!.params.courseId;
  const clazzId = props.match!.params.clazzId;

  useEffect(() => {
    getSclassInfoById(clazzId).then((res) => {
      if (res.success && res.obj) {
        setSclassInfo(res.obj);
        res.obj.course?.knowledgeTree && setGraphData(JSON.parse(res.obj.course.knowledgeTree));
      }
    });
    //查询知识点习题总数
    getKnowExerciseCountByCourseId(courseId).then(res => {
      if (res.success && res.obj) setKnowExercise(res.obj)
    })
  }, []);
  const menuProps = { active: 'home', clazzId: clazzId, courseId: courseId };
  return (
    <div className="flex stu-course">
      <StudentMenu {...menuProps} />
      <div className="course-content">
        {
          sclassInfo && <Home clazz={sclassInfo} />
        }
        <div className="course-detail">
          <div className="title-4">课程大纲</div>
          <Divider style={{ margin: '12px 0' }} />
          <div style={{ clear: 'both' }} />
          {isNotEmptyBraft(sclassInfo?.course?.courseOutline) ? (
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: sclassInfo?.course?.courseOutline! }}
            />
          ) : (
            '无'
          )}
          <div style={{ clear: 'both' }} />
          <div className="title-4" style={{ marginTop: 30 }}>
            知识体系
          </div>
          <Divider style={{ margin: '12px 0' }} />
          <div>
            {graphData && <MindCanvas graphData={graphData} knowExercise={knowExercise} />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default study;
