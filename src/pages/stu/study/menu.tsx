import { Affix } from 'antd';
import { history } from 'umi';

type IProp = {
  active: string;
  clazzId: number;
  courseId: number;
};
const StudentMenu = (props: IProp) => {
  return (
    <Affix offsetTop={56}>
      <div className="course-menu">
        <div
          className={`course-menu-item ${props.active === 'home' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/stu/course/info/${props.courseId}/${props.clazzId}`);
          }}
        >
          {props.active === 'home' ? (
            <img src={require('@/img/student/icon-home-active.svg')}></img>
          ) : (
            <img src={require('@/img/student/icon-home.svg')}></img>
          )}
          <div>首页</div>
        </div>
        {/* 课程章节功能 */}
        <div
          className={`course-menu-item ${props.active === 'chapter' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/stu/course/chapter/list/${props.courseId}/${props.clazzId}`);
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
          className={`course-menu-item ${props.active === 'exercise' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/stu/course/knowledge/list/${props.courseId}/${props.clazzId}`);
          }}
        >
          {props.active === 'exercise' ? (
            <img src={require('@/img/student/icon-exercise-active.svg')}></img>
          ) : (
            <img src={require('@/img/student/icon-exercise.svg')}></img>
          )}
          <div>习题</div>
        </div>
        <div className={`course-menu-item ${props.active === 'statis' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/stu/course/statis/${props.courseId}/${props.clazzId}`);
          }}
        >
          {props.active === 'statis' ? (
            <img src={require('@/img/student/icon-data-active.svg')}></img>
          ) : (
            <img src={require('@/img/student/icon-data.svg')}></img>
          )}
          <div>统计</div>
        </div>
        <div className={`course-menu-item ${props.active === 'exam' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/stu/course/task/${props.courseId}/${props.clazzId}`);
          }}
        >
          {props.active === 'exam' ? (
            <img src={require('@/img/student/icon-homework-active.svg')}></img>
          ) : (
            <img src={require('@/img/student/icon-homework.svg')}></img>
          )}
          <div>作业</div>
        </div>
      </div>
    </Affix>
  );
};
export default StudentMenu;
