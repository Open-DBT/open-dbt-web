import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { getLastCourseList, removeCourse, updateIsOpen, getMyCourseList } from '@/services/teacher/course/course';
import { getStartingSclassByTeacher, updateClass, deleteSclassById } from '@/services/teacher/clazz/sclass'
import { Tabs, message, Modal } from 'antd';
import Course from '@/pages/components/course-list/ExpertCourse';
import Sclass from '@/pages/components/sclass-components/teacherSclass';
import SclassForm from './components/SclassForm'
import { history } from 'umi';
import { API } from '@/common/entity/typings';
import './less/student.less';
import '@/pages/home.less';
import '@/pages/home/less/expert.less';
import '@/pages/home/less/teacher.less';

const TeacherHome: React.FC<{}> = () => {

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const [courseList, setCourseList] = useState<API.CourseListItem[]>([]); //最近课程列表
  const [classModalVisible, handleClassModalVisible] = useState<boolean>(false);//新建
  const [myCourseList, setMyCourseList] = useState<API.CourseListItem[]>([]); //我的课程
  const [myStartingSclassList, setMyStartingSclassList] = useState<API.SclassRecord[]>([]); //我的进行中和未开始的班级

  const [isTeacher, setIsTeacher] = useState<boolean>(false);//是否是教师

  useEffect(() => {
    if (currentUser) {
      if (currentUser.roleList) {
        if (currentUser.roleList[0].roleId == 3) {
          setIsTeacher(true);
          getMyCourse();
          getMyStartingSclass();
        }
      }
    };

    getLastCourse();
  }, []);

  //最近课程
  const getLastCourse = () => {
    getLastCourseList().then((result) => {
      if (result.obj) setCourseList(result.obj);
    });
  }

  // 我的课程
  const getMyCourse = () => {
    getMyCourseList().then((result) => {
      if (result.obj) setMyCourseList(result.obj);
    });
  }

  // 我的进行中和未开始的班级
  const getMyStartingSclass = () => {
    getStartingSclassByTeacher().then((result) => {
      if (result.obj) setMyStartingSclassList(result.obj);
    });
  }

  //删除班级
  const delSclass = async (sclass: API.SclassRecord) => {
    Modal.confirm({
      title: `删除`,
      content: `确定删除班级【${sclass.className}】吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await deleteSclassById(sclass.id);
          if (result.success) {
            message.success('删除成功');
            getMyStartingSclass();
          } else {
            message.error(result.message)
          }
        } catch (error) {
          message.error('删除失败，请重试');
          console.log('error ', error)
        }
      },
    });
  };

  return (
    <div className="home">
      <div className="student-home-hello title-4">{currentUser?.userName}老师，您辛苦了！</div>
      <div className="student-home-desc">您可以从这里快速开始今天的工作。</div>
      <div className="flex nav-buttons">
        <div onClick={() => history.push({ pathname: '/teacher/list', query: { type: "1" } })}>
          <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-lesson-my.svg')} />
          我的课程
        </div>
        <div onClick={() => history.push({ pathname: '/teacher/list', query: { type: "2" } })}>
          <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-lesson-template.svg')} />
          课程模板
        </div>
        {
          isTeacher ?
            <div onClick={() => history.push({ pathname: '/teacher/sclassList' })}>
              <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-class-my.svg')} />
              我的班级
            </div> : null
        }
        {
          isTeacher ?
            <div onClick={() => handleClassModalVisible(true)}>
              <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-class-add.svg')} />
              新开班级
            </div> : null
        }
      </div>

      <Tabs defaultActiveKey="1" style={{ zIndex: 9, marginBottom: 20, width: '852px' }}
        items={[
          {
            key: "1",
            label: '最近课程',
            children: <Course
              courseList={courseList}
              showCreator={true}
              isEdit={true}
            />
          }
        ]}
      />
      {
        isTeacher &&
        <Tabs defaultActiveKey="1" style={{ zIndex: 9, width: '852px' }}
          items={[
            {
              key: "1",
              label: '进行的班级',
              children:
                <Sclass
                  sclassList={myStartingSclassList}
                  handleDelSclass={(value: API.SclassRecord) => {
                    delSclass(value);
                  }}
                />
            }
          ]}
        />
      }

      <SclassForm
        onSubmit={async (value: API.SclassRecord) => {
          const success = await updateClass(value);
          if (success) {
            handleClassModalVisible(false);
            history.push(`/teacher/class/${success.obj.id}/info`)
          }
        }}
        onCancel={() => {
          handleClassModalVisible(false);
        }}
        createModalVisible={classModalVisible}
        course={myCourseList}
      />
    </div>
  );
};

export default TeacherHome;
