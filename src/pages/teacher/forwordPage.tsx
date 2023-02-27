import React from 'react';
import TeacherMenu from './menu';
import ContentHeader from './ContentHeader';
import '@/pages/common-course/course-common.less';
import '@/pages/home.less';
import { querySclass } from '@/services/teacher/clazz/sclass';
import ClassInfo from './class';
import ExamList from './exam';
import ExamClassReport from './exam/report';
import ExamAnswer from './exam/report/answerView';
import StudentList from './student';
import StatisList from './statis';

class ForwordPage extends React.Component<any> {

  constructor(props: any) {
    super(props);
    this.state = {
      sclass: {},  //班级信息
    };
  }


  componentDidMount() {
    querySclass(this.props.match.params.sclassId).then((result) => this.setState({ sclass: result.obj }));
  }

  componentWillUUNSAFE_componentWillUpdatepdate(nextProps: any, nextState: any) {
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
  }


  render() {
    //pathname='/teacher/class/23/exam'
    const pathname: string = this.props.location.pathname;
    let menuProps = { active: '', sclassId: '' };
    let navProps = { active: 1, sclassId: '' };
    let children;
    const sclassId = this.props.match.params.sclassId;

    if (pathname.indexOf('stuExamAnswerView') > -1 ) {
      //课程作业题目答案查看
      menuProps = { active: 'exam', sclassId: sclassId };
      navProps = { active: 4, sclassId: sclassId };
      const scoreId = this.props.match.params.scoreId;
      children = <ExamAnswer scoreId={scoreId}/>
    } else if (pathname.indexOf('exam') > -1 && pathname.indexOf('report') > -1) {
      //课程作业-成绩单
      menuProps = { active: 'exam', sclassId: sclassId };
      navProps = { active: 4, sclassId: sclassId };
      const examClassId = this.props.match.params.examClassId;
      children = <ExamClassReport sclassId={sclassId} examClassId={examClassId} />
    } else if (pathname.indexOf('info') > -1) {
      //班级-info
      menuProps = { active: 'info', sclassId: sclassId };
      navProps = { active: 1, sclassId: sclassId };
      children = <ClassInfo sclassId={sclassId} />
    } else if (pathname.indexOf('exam') > -1) {
      //班级-作业
      menuProps = { active: 'exam', sclassId: sclassId };
      navProps = { active: 4, sclassId: sclassId };
      children = <ExamList sclassId={sclassId} />
    } else if (pathname.indexOf('student') > -1) {
      //班级-学生
      menuProps = { active: 'student', sclassId: sclassId };
      navProps = { active: 2, sclassId: sclassId };
      children = <StudentList sclassId={sclassId} />
    } else if (pathname.indexOf('statis') > -1) {
      //班级-统计
      menuProps = { active: 'statis', sclassId: sclassId };
      navProps = { active: 3, sclassId: sclassId };
      children = <StatisList sclassId={sclassId} />
    }

    return (
      <div className="flex course">
        <TeacherMenu {...menuProps} />
        <div style={{ width: '97%' }}>
          <ContentHeader sclass={this.state.sclass} sclassId={this.props.match.params.sclassId} navProps={navProps} />
          <div className="course-content">
            {children}
          </div>
        </div>

      </div >
    );
  }
}

export default ForwordPage;
