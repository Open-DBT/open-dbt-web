import React, { useRef, useState, useEffect } from 'react';
import StudentMenu from './menu';
import './forwordPage.less'
import { getSclassInfoById } from '@/services/teacher/clazz/sclass'
import { getCourseDetail } from '@/services/teacher/course/course'
import ContentHeader from './ContentHeader';
import ExamList from './exam'
import TaskList from './task'
import ExamDetails from './exam/detail';
import KnowledgeList from './knowledge';
import ExerciseList from './exercise';
import StatisList from './statis';
import Chapter from './chapter'
import Process from './chapter/process'
import { API } from '@/common/entity/typings';
type IProps = {
  location: any;
  match: any;
  sclass: API.SclassListRecord;
}
class ForwordPage extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      course: undefined,  //课程信息
      sclass: undefined,  //班级信息
      isTeacher: false //是否是老师,用于菜单栏显示测试菜单
    };
  }


  componentDidMount() {
    getSclassInfoById(this.props.match.params.clazzId).then((result) => this.setState({ sclass: result.obj }));
    getCourseDetail(this.props.match.params.courseId).then((result) => this.setState({ course: result.obj }));
  }

  UNSAFE_componentWillUpdate(nextProps: any, nextState: any) {
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
  }

  /**
   * 清除异步操作
   */
  UNSAFE_componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    }
  }
  
  render() {
    const pathname: string = this.props.location.pathname;
    let menuProps = { active: 'home', courseId: -1, clazzId: -1 };
    let children;
    const courseId = this.props.match.params.courseId;
    const clazzId = this.props.match.params.clazzId;

    if (pathname.indexOf('/stu/course/chapter/list') > -1) {
      //课程-章节-列表 
      menuProps = {
        active: 'chapter', courseId: courseId, clazzId: clazzId
      };
      children = <Chapter courseId={courseId} clazzId={clazzId} />
    } else if (pathname.indexOf('/stu/course/chapter/process') > -1) {
      //课程-章节-列表-学习进度
      menuProps = {
        active: 'chapter', courseId: courseId, clazzId: clazzId
      };
      children = <Process courseId={courseId} clazzId={clazzId}/>
    } else if (pathname.indexOf('/stu/course/knowledge/list') > -1) {
      //知识点列表 /stu/course/knowledge/list/:courseId/:clazzId
      menuProps = {
        active: 'exercise', courseId: courseId, clazzId: clazzId
      };
      children = <KnowledgeList courseId={courseId} clazzId={clazzId} />
    } else if (pathname.indexOf('/stu/course/knowledge/exercise') > -1) {
      //知识点列表-习题列表 /stu/course/knowledge/exercise/:courseId/:clazzId/:knowId
      menuProps = {
        active: 'exercise', courseId: courseId, clazzId: clazzId
      };
      const knowId = this.props.match.params.knowId;
      children = <ExerciseList courseId={courseId} clazzId={clazzId} knowId={knowId} />
    } else if (pathname.indexOf('/stu/course/statis') > -1) {
      menuProps = {
        active: 'statis', courseId: courseId, clazzId: clazzId
      };
      children = <StatisList courseId={courseId} clazzId={clazzId} />
    } else if (pathname.indexOf('/stu/course/exam/examClass/detail') > -1) {
      //作业明细
      menuProps = {
        active: 'exam', courseId: courseId, clazzId: clazzId
      };
      const examId = this.props.match.params.examId;
      const examClassId = this.props.match.params.examClassId;
      children = <ExamDetails courseId={courseId} sclassId={clazzId} examId={examId} examClassId={examClassId} />
    } else if (pathname.indexOf('/stu/course/task') > -1) {
      //作业列表
      menuProps = {
        active: 'exam', courseId: courseId, clazzId: clazzId
      };
      children = <TaskList courseId={courseId} clazzId={clazzId} />
    }

    return (
      <div className="flex stu-course">
        <StudentMenu {...menuProps} />
        <div style={{ flex: '1' }}>
          <ContentHeader course={this.state.course} />
          <div className="course-content">
            {children}
          </div>
        </div>
      </div >
    );
  }
}

export default ForwordPage;
