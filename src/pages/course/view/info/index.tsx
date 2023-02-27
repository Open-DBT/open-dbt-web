import { useEffect, useState } from 'react';
import '@/pages/common-course/course-common.less';
import '@/pages/home.less';
import '@/pages/common-course/course/index.less';
import { getCourseDetail, copyCourse } from '@/services/teacher/course/course';
import { isNotEmptyBraft } from '@/utils/utils';
import * as APP from '@/app';
import { Button, Divider, Modal, message } from 'antd';

/**
 * 课程预览
 * @param props 
 * @returns 
 */
const CourseViewInfo = (props: { courseId: number }) => {
  const [course, setCourse] = useState<API.CourseListItem>();

  useEffect(() => {
    getCourseDetail(props.courseId).then((result) => setCourse(result.obj))
  }, []);

  // 复制课程
  const handCopyCourse = (record: API.CourseListItem | undefined) => {
    if (record)
      Modal.confirm({
        width: 600,
        title: `课程复制`,
        content: (<p>复制后课程名称为 <span style={{ color: 'red' }}>{record.courseName} + 月日时分秒</span><br />
          复制后请尽快修改课程名称！<br />
          确定复制 <span style={{ color: 'red' }}>{record.courseName}</span> 课程吗？</p>),
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          const hide = message.loading('复制中...');
          try {
            const result = await copyCourse(record.courseId);
            if (result.message) {
              message.warn(result.message);
               return;
            }
            hide();
            message.success('复制成功！请前往课程查看。');
          } catch (error) {
            hide();
            message.error(`复制失败，请重试 ${error}`);
            console.log('error ', error)
          }
        },
      });
  };
  return (
    <div className="course-content detail">
      <div className="title-5">课程介绍</div>
      <div className="row" >
        <div className="left">
          <p className="title-4">{course && course.courseName}</p>
          <p>{course && course.courseDesc}</p>
          {course && <img src={APP.request.prefix! + course?.coverImage} width="270px"></img>}
          <Divider />
          <Button type="primary" danger onClick={() => handCopyCourse(course)}>复制课程</Button>
        </div>
        <div className="right">
          {/* <Divider /> */}
          {isNotEmptyBraft(course && course.courseOutline) ?
            <div dangerouslySetInnerHTML={{ __html: course?.courseOutline! }} />
            : '无'}
        </div>
      </div>
    </div>
  );
};
export default CourseViewInfo;
