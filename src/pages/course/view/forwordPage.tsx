import React from 'react';
import Menu from './menu';
import ContentHeader from './ContentHeader';
import '@/pages/common-course/course-common.less';
import '@/pages/home.less';
import { getCourseDetail } from '@/services/teacher/course/course';
import CourseInfo from './info'
import SceneInfo from './scene'
import ExerciseInfo from './exercise'
import KnowledgeInfo from './knowledge'
import ChapterInfo from './chapter'

class ForwordPage extends React.Component<any> {

  constructor(props: any) {
    super(props);
    this.state = {
      course: undefined,  //课程信息
    };
  }

  componentDidMount() {
    getCourseDetail(this.props.match.params.courseId).then((result) => this.setState({ course: result.obj }));
  }

  UNSAFE_componentWillUpdate(nextProps: any, nextState: any) {
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
  }

  reload = () => {
    getCourseDetail(this.props.match.params.courseId).then((result) => this.setState({ course: result.obj }));
  }

  render() {
    const pathname: string = this.props.location.pathname;
    let menuProps = { active: 'home', courseId: '-1' };//active在menu的选中样式
    let children;
    const courseId = this.props.match.params.courseId;//课程id

    if (pathname.indexOf('/student/course/info') > -1) {
      menuProps = { active: 'home', courseId: courseId };
      children = <CourseInfo courseId={courseId}/>
    } else if (pathname.indexOf('/student/course/knowledge') > -1) {
      menuProps = { active: 'knowledge', courseId: courseId };
      children = <KnowledgeInfo courseId={courseId}/>
    } else if (pathname.indexOf('/student/course/chapter') > -1) {
      menuProps = { active: 'chapter', courseId: courseId };
      children = <ChapterInfo courseId={courseId}/>
    } else if (pathname.indexOf('/student/course/scene') > -1) {
      menuProps = { active: 'scene', courseId: courseId };
      children = <SceneInfo courseId={courseId}/>
    } else if (pathname.indexOf('/student/course/exercise') > -1) {
      menuProps = { active: 'exercise', courseId: courseId };
      children = <ExerciseInfo courseId={courseId}/>
    } 

    return (
      <div className="flex course">
        <Menu {...menuProps} />
        <div style={{ width: '97%' }}>
          <ContentHeader course={this.state.course}/>
          <div className="course-content">
            {children}
          </div>
        </div>

      </div >
    );
  }
}

export default ForwordPage;
