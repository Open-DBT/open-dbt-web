import React, { useState, useEffect } from 'react';
import { getMyCourseList, getCourseTemplate, updateCourse } from '@/services/teacher/course/course';
import { Tabs, message, Button, Modal } from 'antd';
import Course from '@/pages/components/course-list/ExpertCourse';
import CreateForm from '../course/course/components/CourseForm';
import { history } from 'umi';
import { API } from '@/common/entity/typings';
import '@/pages/home.less';
import '@/pages/home/less/expert.less';
import './index.less'

const TeacherHome = (props: any) => {
  const [showPage, setShowPage] = useState<string>("1");
  const [myCourseList, setMyCourseList] = useState<API.CourseListItem[]>([]); //我创建的课程
  const [courseTemplateList, setCourseTemplateList] = useState<API.CourseListItem[]>([]); //课程模板
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);//新建

  useEffect(() => {
    //不同的入口打开此页面，显示不同的tab
    if (props.location.query.type) {
      setShowPage(props.location.query.type)
    };

    getMyCourse();

    getCourseTemplate().then((result) => {
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
    history.push({ pathname: '/expert/list', query: { type: activeKey } })
  }

  return (
    <div className="home">
      <div className="buttons-div">
        <Button type="primary" onClick={() => handleCreateModalVisible(true)}>
          <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-add-1.svg')} />
          创建课程模板
        </Button>
      </div>
      <Tabs activeKey={showPage} style={{ marginTop: -32, width: '852px' }} onChange={tabOnChange}
        items={[
          {
            key: "1",
            label: '我创建的',
            children:
              <Course
                courseList={myCourseList}
                showCreator={false}
                isEdit={true}
              />
          }, {
            key: "2",
            label: '其他课程',
            children:
              <Course
                courseList={courseTemplateList}
                showCreator={true}
                isEdit={false}
              />
          }
        ]}
      />
      <CreateForm
        onSubmit={async (value: API.CourseDetailRecord) => {
          const result = await updateCourse(value);
          if (result && result.success) {
            handleCreateModalVisible(false);
            localStorage.setItem("course-new:" + result.obj.courseId, 'H00000');
            history.push(`/expert/course/info/${result.obj.courseId}`)
          } else {
            message.error('创建课程失败：' + result.message, 8)
          }
        }}
        onCancel={() => {
          handleCreateModalVisible(false);
        }}
        createModalVisible={createModalVisible}
      />
    </div>
  );
};

export default TeacherHome;
