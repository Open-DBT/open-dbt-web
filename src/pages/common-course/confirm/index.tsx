import { useEffect, useState } from 'react';
import StudentMenu from '@/pages/common-course/menu';
import ContentHeader from '@/pages/common-course/ContentHeader';
import { saveCourseStorage } from '@/pages/common-course/utils'

import '@/pages/common-course/course-common.less';
import '@/pages/home.less';
import { getCourseDetail } from '@/services/teacher/course/course';
import { Button, message } from 'antd';
import { API } from '@/common/entity/typings';


const Confirm = (props: any) => {
  console.log('props,', props.match.params.courseId);
  const [course, setCourse] = useState<API.CourseListItem>();

  useEffect(() => {
    fetch();
  }, []);

  /**
   * 请求数据
   */
  const fetch = () => {
    getCourseDetail(props.match.params.courseId).then((result) => setCourse(result.obj))
  }

  const onFinish = () => {
    saveCourseStorage(props.match.params.courseId, 5);
  }
  const menuProps = { active: 'confirm', courseId: props.match.params.courseId };
  const navProps = { active: 5, courseId: props.match.params.courseId };
  return (
    <div className="flex course">
      <StudentMenu {...menuProps} />
      <div style={{ width: '97%' }}>
        <ContentHeader course={course} courseId={props.match.params.courseId} navProps={navProps} />

        <div className="course-content">
          <div className="course-info">
            您已完成课程创建基本步骤<br></br>
            <Button type="primary" onClick={() => onFinish()}>查看课程</Button>
          </div>
        </div>
      </div>

    </div>
  );
};
export default Confirm;
