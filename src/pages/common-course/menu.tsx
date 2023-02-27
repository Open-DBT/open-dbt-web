import { Affix } from 'antd';
import { history, useModel } from 'umi';

type IProp = {
  active: string;
  courseId: string;
};

const CourseMenu = (props: IProp) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  return (
    <Affix offsetTop={56}>
      <div className="course-menu">
        {/* 课程介绍功能 */}
        <div
          className={`course-menu-item ${props.active === 'home' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/expert/course/info/${props.courseId}`);
          }}
        >
          {props.active === 'home' ? (
            <img src={require('@/img/teacher/icon-lesson-detail-active.svg')}></img>
          ) : (
            <img src={require('@/img/teacher/icon-lesson-detail.svg')}></img>
          )}
          <div>介绍</div>
        </div>
        {/* 课程章节功能 */}
        <div
          className={`course-menu-item ${props.active === 'chapter' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/expert/course/chapter/${props.courseId}`);
          }}
        >
          {props.active === 'chapter' ? (
            <img src={require('@/img/teacher/icon-lesson-detail-active.svg')}></img>
          ) : (
            <img src={require('@/img/teacher/icon-lesson-detail.svg')}></img>
          )}
          <div>章节</div>
        </div>
        {/* 知识点图谱功能 */}
        <div
          className={`course-menu-item ${props.active === 'know' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/expert/course/${props.courseId}/knowledge`);
          }}
        >
          {props.active === 'know' ? (
            <img src={require('@/img/teacher/icon-knowledge-active.svg')}></img>
          ) : (
            <img src={require('@/img/teacher/icon-knowledge.svg')}></img>
          )}
          <div>知识</div>
        </div>
        {/* 习题功能 */}
        {/* <div className={`course-menu-item ${props.active === 'exercise' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/expert/course/${props.courseId}/exercise`);
          }}
        >
          {props.active === 'exercise' ? (
            <img src={require('@/img/student/icon-exercise-active.svg')}></img>
          ) : (
            <img src={require('@/img/student/icon-exercise.svg')}></img>
          )}
          <div>习题</div>
        </div> */}
        {/* 题库功能 */}
        <div className={`course-menu-item ${props.active === 'question' ? 'item-active' : ''}`}
          // onClick={() => window.open(`/question-bank/list/${props.courseId}`)}
          onClick={() => {
            history.push(`/teacher/course/question/${props.courseId}`);
          }}
        >
          <img src={require('@/img/student/icon-exercise.svg')}></img>
          <div>题库</div>
        </div>
        {/* 作业功能 */}
        {
          currentUser && currentUser.roleList && currentUser.roleList[0].roleId == 3 &&
          <div className={`course-menu-item ${props.active === 'task' ? 'item-active' : ''}`}
            onClick={() => {
              history.push(`/teacher/course/task/${props.courseId}`);
            }}
          >
            {props.active === 'task' ? (
              <img src={require('@/img/student/icon-homework-active.svg')}></img>
            ) : (
              <img src={require('@/img/student/icon-homework.svg')}></img>
            )}
            <div>作业</div>
          </div>
        }
      </div>
    </Affix>
  );
};
export default CourseMenu;
