import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';
import { getAllSclassByStuIdExpectCourse, getAllSclassProgressByStuId } from  '@/services/teacher/clazz/sclass';
import { useModel } from 'umi';
import { getlearnTimeYYMMDD, learnTimeMonth, learnTimeDay } from './utils/utils';
import { API } from '@/common/entity/typings';
import MyCourse from '@/pages/components/course-list/StudentCourse';
import '@/pages/home.less';
import './less/student.less';

/**
 * 学生登录首页
 * @returns 
 */
const StudentHome: React.FC<{}> = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [sclassList, setSclassList] = useState<API.SclassRecord[]>([]); //新建
  const [sclassProcList, setSclassProcList] = useState<API.SclassRecord[]>([]); //新建

  useEffect(() => {
    getAllSclassByStuIdExpectCourse().then((res) => {
      if (res.success && res.obj) setSclassList(res.obj);
    });
    getAllSclassProgressByStuId().then((res) => {
      if (res.success && res.obj) setSclassProcList(res.obj);
    });
  }, []);


  let time_temp = '';
  return (
    <div className="home">
      <div className="student-home-hello title-7">Hello {currentUser?.userName}</div>
      <div className="student-home-desc">今天又是元气满满的一天，快来给自己的进度条加点颜色吧~</div>
      {sclassProcList.map((item, index) => {
        const isHidden = getlearnTimeYYMMDD(item.stuNewLearnTime) === time_temp;
        const content = (
          <div className="process" key={index}>
            {isHidden ? (
              <div className="time off" />
            ) : (
              <div className="time">
                <div className="process-day">{learnTimeDay(item.stuNewLearnTime)}</div>
                <div className="process-month">{learnTimeMonth(item.stuNewLearnTime)}</div>
              </div>
            )}

            <div className="process-list">
              <div className="title-2">
                课程：{item.course?.courseName}
                {/* <img
                  src={require('@/img/student/icon-teacher.svg')}
                  style={{ margin: '0px 8px 5px 20px' }}
                /> */}
                <span style={{ fontWeight: 'normal',marginLeft:20 }}>老师：{item.course?.creatorName}    </span>
              </div>
              <div className="desc">
                <span>学习进度：</span>
                <Progress
                  percent={item.progress}
                  size="small"
                  style={{ width: '50%', marginLeft: 14 }}
                />
                {
                  item.overPercentage > 10 ? <span style={{ marginLeft: 28 }}>超过了{item.overPercentage}%的学生</span> : null
                }
                {
                  item.overPercentage > 50 ? <img src={require('@/img/student/icon-zan.svg')}></img> : null
                }
              </div>
            </div>
          </div>
        );
        if (!isHidden) time_temp = getlearnTimeYYMMDD(item.stuNewLearnTime);
        return content;
      })}
      <MyCourse sclassList={sclassList} />
    </div>
  );
};

export default StudentHome;
