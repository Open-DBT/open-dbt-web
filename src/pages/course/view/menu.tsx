import { Affix } from 'antd';
import { history } from 'umi';

type IProp = {
  active: string;
  courseId: string;
};
const StudentMenu = (props: IProp) => {
  return (
    <Affix offsetTop={56}>
      <div className="course-menu">
        <div
          className={`course-menu-item ${props.active === 'home' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/student/course/info/${props.courseId}`);
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
            history.push(`/student/course/chapter/${props.courseId}`);
          }}
        >
          {props.active === 'chapter' ? (
            <img src={require('@/img/teacher/icon-lesson-detail-active.svg')}></img>
          ) : (
            <img src={require('@/img/teacher/icon-lesson-detail.svg')}></img>
          )}
          <div>章节</div>
        </div>
        <div
          className={`course-menu-item ${props.active === 'knowledge' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/student/course/knowledge/${props.courseId}`);
          }}
        >
          {props.active === 'knowledge' ? (
            <img src={require('@/img/teacher/icon-knowledge-active.svg')}></img>
          ) : (
            <img src={require('@/img/teacher/icon-knowledge.svg')}></img>
          )}
          <div>知识</div>
        </div>
        <div className={`course-menu-item ${props.active === 'scene' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/student/course/scene/${props.courseId}`);
          }}
        >
          {props.active === 'scene' ? (
            <img src={require('@/img/teacher/icon-scene-active.svg')}></img>
          ) : (
            <img src={require('@/img/teacher/icon-scene.svg')}></img>
          )}
          <div>场景</div>
        </div>
        <div className={`course-menu-item ${props.active === 'exercise' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/student/course/exercise/${props.courseId}`);
          }}
        >
          {props.active === 'exercise' ? (
            <img src={require('@/img/student/icon-exercise-active.svg')}></img>
          ) : (
            <img src={require('@/img/student/icon-exercise.svg')}></img>
          )}
          <div>习题</div>
        </div>
      </div>
    </Affix>
  );
};
export default StudentMenu;
