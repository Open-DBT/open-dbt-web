import CourseNav from '@/pages/common-course/ContentHeader/nav';
import { API } from '@/common/entity/typings';

type IProp = {
  course: API.CourseListItem | undefined;
  courseId: string;
  navProps: any;
};
/**
 * 课程-右边内容的头部
 * @param props 
 * @returns 
 */
const Index = (props: IProp) => {
  return (
    <>
      {
        localStorage.getItem("course-new:" + props.courseId) ? <CourseNav  {...props.navProps} />
          :
          <div className="card-header-title">
            <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-lesson-name.svg')} />
            {props.course?.courseName}
          </div>
      }
    </>
  );
};
export default Index;
