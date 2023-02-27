import { Button } from 'antd';
import { API } from '@/common/entity/typings';

type IProps = {
  course: API.CourseDetailRecord
}

const Step5 = (props: IProps) => {

  return (
    <div>
      <Button type="primary"
        onClick={() => window.open('/course/view/' + props.course.courseId)}>预览课程</Button>
    </div>
  );
};
export default Step5
