import './index.less'
import { API } from '@/common/entity/typings';
type IProp = {
  course: API.CourseListItem | undefined;
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
        <div className="card-header-title">
          <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-lesson-name.svg')} />
          {props.course?.courseName}
        </div>
      }
    </>
  );
};
export default Index;
