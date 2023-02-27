import React, { useState, useEffect } from 'react';
import { getLastCourseList, updateCourse, removeCourse, updateIsOpen } from '@/services/teacher/course/course';
import { Space, Tabs, message, Modal } from 'antd';
import Course from '@/pages/components/course-list/ExpertCourse';
import CreateForm from '../course/course/components/CourseForm';
import { history } from 'umi';
import { API } from '@/common/entity/typings';
import '@/pages/home.less';
import '@/pages/home/less/expert.less';

/**
 * 课程专家首页
 * @returns 
 */
const ExpertHome: React.FC<{}> = () => {
  const [courseList, setCourseList] = useState<API.CourseListItem[]>([]); //新建
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);//新建
  useEffect(() => {
    getLastCourse();
  }, []);

  //最近课程
  const getLastCourse = () => {
    getLastCourseList().then((res) => {
      if (res.success && res.obj) setCourseList(res.obj);
    });
  }

  return (
    <div className="home">
      <div className="title-4 home-title">快捷导航</div>
      <div className="flex nav-buttons">
        <div onClick={() => history.push({ pathname: '/expert/list', query: { type: "1" } })}>
          <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-lesson-my.svg')} />
          我创建的课程
        </div>
        <div onClick={() => history.push({ pathname: '/expert/list', query: { type: "2" } })}>
          <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-lesson-template.svg')} />
          其他课程模板
        </div>
        <div onClick={() => handleCreateModalVisible(true)}>
          <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-template-add.svg')} />
          创建课程模板
        </div>
      </div>
      <Tabs defaultActiveKey="1" style={{ zIndex: 9 }}
        items={[
          {
            key: "1",
            label: '课程模板',
            children:
              <Course
                courseList={courseList}
                showCreator={false}
                isEdit={true}
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
    </div >
  );
};

export default ExpertHome;
