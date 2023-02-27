import { history } from 'umi';
import '@/pages/home.less';
import '@/pages/home/less/expert.less'
import { Tooltip } from "antd";
import * as APP from '@/app';
import { API } from '@/common/entity/typings';

/**
 * 课程专家，课程列表
 */
export default (props: {
  courseList: API.CourseListItem[],
  showCreator: boolean,
  isEdit: boolean,//true查看权限，false编辑权限
  // handleDel?: (values: API.CourseListItem) => void,
  // handIsOpen?: (values: API.CourseListItem, status: number) => void,
}) => {
  /**
   * 跳转方向
   * @param showCreator 查看使用open打开新页面，编辑权限本页面跳转
   * @param courseId 
   */
  const switchClick = (isEdit: boolean, courseId: number) => {
    if (isEdit) {
      history.push(`/expert/course/info/${courseId}`)
    } else {
      window.open(`/student/course/info/${courseId}`)
    }
  }
  return (
    <div className="flex wrap course-list">
      {props.courseList.map((course, index) => {
        return (
          // <Tooltip
          //   placement="top"
          //   title={hoverContent(course)}
          //   trigger="click"
          //   key={index}
          //   overlayClassName="course-card-buttons"
          //   align={{
          //     offset: [0, 130],//x,y
          //   }}
          // >
          <Tooltip
            title="点击进入课程"
            key={index}
          >
            <div className="tea-course-card" style={{ marginRight: index >= 2 && index % 3 === 2 ? '0px' : '20px' }}
              onClick={() => switchClick(props.isEdit, course.courseId)} key={index}
            >
              {course.isOpen === 0 ? <div className="course-state">未发布</div> : null}
              <div className="course-photo">
                <img src={APP.request.prefix + course.coverImage}></img>
              </div>
              <div className="desc">
                <p className="course-name">{course.courseName}</p>
                {
                  props.showCreator ? <p className="course-time">
                    <img
                      src={require('@/img/student/icon-teacher.svg')}
                      style={{ margin: '-3px 10px 0px 0px' }}
                    />
                    创建人 : {course?.creatorName}
                  </p> : null
                }
              </div>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

