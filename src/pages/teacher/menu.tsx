import { Affix } from 'antd';
import { history } from 'umi';

type IProp = {
  active: string;
  sclassId: string;
};
/**
 * 教师端-课程菜单
 * @param props
 * @returns 
 */
const TeacherMenu = (props: IProp) => {
  return (
    <Affix offsetTop={56}>
      <div className="course-menu">
        <div
          className={`course-menu-item ${props.active === 'info' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/teacher/class/${props.sclassId}/info`);
          }}
        >
          {props.active === 'info' ? (
            <img src={require('@/img/teacher/icon-class-active.svg')}></img>
          ) : (
            <img src={require('@/img/teacher/icon-class.svg')}></img>
          )}
          <div>班级</div>
        </div>
        <div
          className={`course-menu-item ${props.active === 'student' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/teacher/class/${props.sclassId}/student`);
          }}
        >
          {props.active === 'student' ? (
            <img src={require('@/img/teacher/icon-student-active.svg')}></img>
          ) : (
            <img src={require('@/img/teacher/icon-student.svg')}></img>
          )}
          <div>学生</div>
        </div>
        <div className={`course-menu-item ${props.active === 'statis' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/teacher/class/${props.sclassId}/statis`);
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
            history.push(`/teacher/class/${props.sclassId}/exam`);
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
export default TeacherMenu;
