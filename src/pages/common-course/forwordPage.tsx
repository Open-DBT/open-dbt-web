import React from 'react';
import Menu from './menu';
import ContentHeader from './ContentHeader';
import '@/pages/common-course/course-common.less';
import '@/pages/home.less';
import { getCourseDetail } from '@/services/teacher/course/course';
import CourseInfo from './course'
import KnowledgeIndex from './knowledge'
import ExerciseIndex from './exercise'
import ExerciseCreate from './exercise/create'
import ExerciseUpdate from './exercise/update'
// import CourseExam from './exam'
import CourseTask from './task';//作业
import ExamInfo from './exam/info'
import ExamExercise from './exam/exercise'
import ExamClassReport from './exam/report'
import ExamAnswer from './exam/report/answerView'
import SceneIndex from './scene'
import SceneCreate from './scene/create'
import SceneUpdate from './scene/update'
import Chapter from './chapter'
import ChapterStatisList from './chapter/statis'
import ChapterStatisDetail from './chapter/statis/chapter-detail'
import ChapterStatisStuProcess from './chapter/statis/student-detail'
import TaskReview from './task/components/reviewList'
import QuestionList from './question'
class ForwordPage extends React.Component<any> {

  constructor(props: any) {
    super(props);
    this.state = {
      course: undefined,  //课程信息
      isTeacher: false //是否是老师,用于菜单栏显示测试菜单
    };
    // console.log('ForwordPage constructor')
  }

  componentDidMount() {
    // console.log('ForwordPage componentDidMount...', this.props)
    getCourseDetail(this.props.match.params.courseId).then((result) => this.setState({ course: result.obj }));

    // const { currentUser } = initialState || {};
    // if (currentUser && currentUser.roleList && currentUser.roleList[0].roleId == 3) {
    //   this.setState({ isTeacher: true })
    // };
  }

  UNSAFE_componentWillUpdate(nextProps: any, nextState: any) {
    // console.log('ForwordPage UNSAFE_componentWillUpdate...', nextProps)
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    // console.log('ForwordPage componentWillReceiveProps...', nextProps)
  }

  reload = () => {
    getCourseDetail(this.props.match.params.courseId).then((result) => this.setState({ course: result.obj }));
  }

  render() {
    const pathname: string = this.props.location.pathname;
    let menuProps = { active: 'home', courseId: '-1' };//active在menu的选中样式
    let navProps = { active: 1, courseId: '' };//active用于<课程专家>创建课程的功能序号，默认0
    let children;
    const courseId = this.props.match.params.courseId;//课程id

    if (pathname.indexOf('stuExamAnswerView') > -1) {
      //课程作业题目答案查看
      menuProps = { active: 'exam', courseId: courseId };
      navProps = { active: 0, courseId: courseId };
      const scoreId = this.props.match.params.scoreId;
      children = <ExamAnswer scoreId={scoreId} />
    } else if (pathname.indexOf('exam') > -1 && pathname.indexOf('info') > -1) {
      //课程作业-info
      const examId = this.props.match.params.examId;
      menuProps = { active: 'exam', courseId: courseId };
      navProps = { active: 0, courseId: courseId };
      children = <ExamInfo courseId={courseId} examId={examId} />
    }
    // else if (pathname.indexOf('exam') > -1 && pathname.indexOf('exercise') > -1) {
    //   //课程作业-习题列表
    //   const examId = this.props.match.params.examId;
    //   menuProps = { active: 'exam', courseId: courseId };
    //   navProps = { active: 0, courseId: courseId };
    //   children = <ExamExercise courseId={courseId} examId={examId} />
    // } else if (pathname.indexOf('exam') > -1 && pathname.indexOf('report') > -1) {
    //   //课程作业-成绩单
    //   menuProps = { active: 'exam', courseId: courseId };
    //   navProps = { active: 0, courseId: courseId };
    //   const examClassId = this.props.match.params.examClassId;
    //   children = <ExamClassReport courseId={courseId} examClassId={examClassId} />
    // } 
    else if (pathname.indexOf('/teacher/course/task') > -1) {
      //作业功能
      menuProps = { active: 'task', courseId: courseId };
      navProps = { active: 0, courseId: courseId };
      if (pathname.indexOf('/teacher/course/task/review') > -1)
        children = <TaskReview />
      else children = <CourseTask courseId={courseId} />
    }
    else if (pathname.indexOf('/expert/course/info') > -1) {
      //课程-介绍 active: 1
      menuProps = { active: 'home', courseId: courseId };
      navProps = { active: 1, courseId: courseId };
      children = <CourseInfo courseId={courseId} course={this.state.course} reload={() => this.reload()} />
    } else if (pathname.indexOf('know') > -1) {
      //课程-知识树 active: 2
      menuProps = { active: 'know', courseId: courseId };
      navProps = { active: 2, courseId: courseId };
      children = <KnowledgeIndex courseId={courseId} />
    }
    // else if (pathname.indexOf('scene') > -1 && pathname.indexOf('update') > -1) {
    //   //课程-场景-修改 active: 3
    //   menuProps = { active: 'scene', courseId: courseId };
    //   navProps = { active: 3, courseId: courseId };
    //   const sceneId = this.props.match.params.sceneId;
    //   children = <SceneUpdate courseId={courseId} sceneId={sceneId} />
    // } else if (pathname.indexOf('scene') > -1 && pathname.indexOf('create') > -1) {
    //   //课程-场景-新增 active: 3
    //   menuProps = { active: 'scene', courseId: courseId };
    //   navProps = { active: 3, courseId: courseId };
    //   children = <SceneCreate courseId={courseId} />
    // } else if (pathname.indexOf('scene') > -1) {
    //   //课程-场景-列表 active: 3
    //   menuProps = { active: 'scene', courseId: courseId };
    //   navProps = { active: 3, courseId: courseId };
    //   children = <SceneIndex courseId={courseId} />
    // } else if (pathname.indexOf('exercise') > -1 && pathname.indexOf('create') > -1) {
    //   //课程-习题-create  active: 4
    //   menuProps = { active: 'exercise', courseId: courseId };
    //   navProps = { active: 4, courseId: courseId };
    //   children = <ExerciseCreate courseId={courseId} />
    // } else if (pathname.indexOf('exercise') > -1 && pathname.indexOf('update') > -1) {
    //   //课程-习题-update  active: 4
    //   menuProps = { active: 'exercise', courseId: courseId };
    //   navProps = { active: 4, courseId: courseId };
    //   const exerciseId = this.props.match.params.exerciseId;
    //   children = <ExerciseUpdate courseId={courseId} exerciseId={exerciseId} />
    // } else if (pathname.indexOf('exercise') > -1) {
    //   //课程-习题-列表  active: 4
    //   menuProps = { active: 'exercise', courseId: courseId };
    //   navProps = { active: 4, courseId: courseId };
    //   children = <ExerciseIndex courseId={courseId} />
    // } 
    else if (pathname.indexOf('/expert/course/chapter') > -1) {
      //课程-章节-列表 
      menuProps = { active: 'chapter', courseId: courseId };
      navProps = { active: 5, courseId: courseId };
      children = <Chapter courseId={courseId} />
    } else if (pathname.indexOf('/teacher/course/question') > -1) {
      //课程-题库-列表 
      menuProps = { active: 'question', courseId: courseId };
      navProps = { active: 5, courseId: courseId };
      children = <QuestionList courseId={courseId} />
    } else if (pathname.indexOf('/teacher/course/chapter/statis') > -1) {
      //课程-章节-章节-统计    
      let clazzId = this.props.match.params.clazzId;//班级id
      let chapterId = this.props.match.params.chapterId;//章节id
      let serialNum = this.props.match.params.serialNum;//章节序号
      let resourcesId = this.props.match.params.resourcesId;//资源id   
      let userId = this.props.match.params.userId;//学生id   

      menuProps = { active: 'chapter', courseId: courseId };
      navProps = { active: 5, courseId: courseId };
      if (pathname.indexOf('/teacher/course/chapter/statis/list') > -1)
        children = <ChapterStatisList courseId={courseId} clazzId={clazzId} chapterId={chapterId} serialNum={serialNum} />
      else if (pathname.indexOf('/teacher/course/chapter/statis/student/process') > -1)
        children = <ChapterStatisStuProcess courseId={courseId} clazzId={clazzId} chapterId={chapterId} serialNum={serialNum} userId={userId} />
      else if (pathname.indexOf('/teacher/course/chapter/statis/detail') > -1)
        children = <ChapterStatisDetail courseId={courseId} clazzId={clazzId} chapterId={chapterId} serialNum={serialNum} resourcesId={resourcesId} />
    }

    return (
      <div className="flex course">
        <Menu {...menuProps} />
        <div style={{ width: '97%' }}>
          <ContentHeader course={this.state.course} courseId={courseId} navProps={navProps} />
          <div className="course-content">
            {children}
          </div>
        </div>

      </div >
    );
  }
}

export default ForwordPage;
