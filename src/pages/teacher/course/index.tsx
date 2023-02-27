import { useState, useEffect } from 'react';
import { getMyCourseList, getALLCourseTemplate, removeCourse, updateIsOpen, copyCourse } from '@/services/teacher/course/course';
import { Tabs, message, Modal } from 'antd';
import Course from '@/pages/components/course-list/ExpertCourse';
import { history } from 'umi';
import { API } from '@/common/entity/typings';
import '@/pages/home.less';
import '@/pages/home/less/expert.less';
import './index.less'

const TeacherCourse = (props: any) => {
  const [showPage, setShowPage] = useState<string>("1");
  const [myCourseList, setMyCourseList] = useState<API.CourseListItem[]>([]); //我的课程
  const [courseTemplateList, setCourseTemplateList] = useState<API.CourseListItem[]>([]); //课程模板

  useEffect(() => {
    //不同的入口打开此页面，显示不同的tab
    if (props.location.query.type) {
      setShowPage(props.location.query.type)
    };

    getMyCourse();

    getALLCourseTemplate().then((result) => {
      if (result.obj) setCourseTemplateList(result.obj);
    });
  }, []);

  const getMyCourse = () => {
    getMyCourseList().then((result) => {
      if (result.obj) setMyCourseList(result.obj);
    });
  }

  const tabOnChange = (activeKey: string) => {
    setShowPage(activeKey)
    history.push({ pathname: '/teacher/list', query: { type: activeKey } })
  }
  
  return (
    <div className="home">
      <Tabs activeKey={showPage} style={{ marginTop: 0, width: '852px' }} onChange={tabOnChange}
        items={[
          {
            key: "1",
            label: '我的课程',
            children:
              <Course
                courseList={myCourseList}
                showCreator={true}
                isEdit={true}
              />
          }, {
            key: "2",
            label: '课程模板',
            children:
              <Course
                courseList={courseTemplateList}
                showCreator={true}
                isEdit={false}
              />
          }
        ]}
      />
    </div>
  );
};

export default TeacherCourse;
