import { useModel } from 'umi';
import CourseExpertHome from './expert'
import StudentHome from './student'
import TeacherHome from './teacher'
import Other from './other'

const HomeIndex = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  console.log('currentUser ', currentUser)

  let children = <Other />
  /**
   * 系统角色
   * 1 => 管理员
   * 2 => 课程专家
   * 3 => 教师
   * 4 => 学生
   */
  if (currentUser!.roleList!.length > 0 && currentUser!.roleType != -1) {
    if (currentUser!.roleType === 2) {
      children = <CourseExpertHome />
    } else if (currentUser!.roleType === 3) {
      children = <TeacherHome />
    } else if (currentUser!.roleType === 4) {
      children = <StudentHome />
    }
  }

  return (
    <>
      {children}
    </>
  );
};

export default HomeIndex;
