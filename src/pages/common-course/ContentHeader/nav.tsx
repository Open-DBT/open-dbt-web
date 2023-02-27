import { history } from 'umi';
import { getCourseStorage } from '@/pages/common-course/utils'

type IProp = {
  active: number;
  courseId: string;
};
const CourseNav = (props: IProp) => {
  //解析是否需要导航栏
  // localStorage.setItem("course-new:" + success.obj.courseId, 'H00000');
  const step = getCourseStorage(props.courseId);
  const t_1 = step?.substr(1, 1);
  const t_2 = step?.substr(2, 1);
  const t_3 = step?.substr(3, 1);
  const t_4 = step?.substr(4, 1);
  const t_5 = step?.substr(5, 1);
  console.log('CourseNav step,active', step, props.active)

  return (
    <>
      <div className="card-header-nav">
        <div className="course-content" style={{ marginTop: 0, paddingTop: 22 }}>
          <div>
            <img src={require('@/img/teacher/icon-guide.svg')} style={{ marginRight: 8 }}></img>
            开课向导
          </div>
          <div className="flex" style={{ marginTop: 16, paddingBottom: 18 }}>
            {/* 
                props.active 判断是否选中，有选中的边框变色，完成时选中边框和未完成时选中边框不同
                t_1==='1'  判断是否完成，有完成的颜色和边框
            */}
            <div className={`flex nav-item ${t_1 === '1' ?
              // 完成下，判断是否选中
              props.active === 1 ?/**选中+完成 */ 'selected-finish isFinish' :/**未选中+完成 */'isFinish'
              //未完成下，判断是否选中
              : props.active === 1 ?/**选中+未完成 */ 'selected' :/**未选中+未完成 */'no-isFinish'
              }`}
              onClick={() => {
                history.push(`/expert/course/info/${props.courseId}`);
              }}
            >
              <div className="index">
                1
              </div>
              <div>
                <label className="title-3">设置课程信息</label>
                <p>设置课程简介和大纲，点击&nbsp;[保存设置]&nbsp;继续下一步</p>
              </div>
            </div>
            <div className={`flex nav-item ${t_2 === '1' ?
              // 完成下，判断是否选中
              props.active === 2 ?/**选中+完成 */ 'selected-finish isFinish' :/**未选中+完成 */'isFinish'
              //未完成下，判断是否选中
              : props.active === 2 ?/**选中+未完成 */ 'selected' :/**未选中+未完成 */'no-isFinish'
              }`}
              onClick={() => {
                history.push(`/expert/course/${props.courseId}/knowledge`);
              }}
            >
              <div className="index">
                2
              </div>
              <div>
                <label className="title-3">知识体系</label>
                <p>设置课程的知识体系，点击&nbsp;[保存设置]&nbsp;继续下一步</p>
              </div>
            </div>
            <div className={`flex nav-item ${t_3 === '1' ?
              // 完成下，判断是否选中
              props.active === 3 ?/**选中+完成 */ 'selected-finish isFinish' :/**未选中+完成 */'isFinish'
              //未完成下，判断是否选中
              : props.active === 3 ?/**选中+未完成 */ 'selected' :/**未选中+未完成 */'no-isFinish'
              }`}
              onClick={() => {
                history.push(`/expert/course/${props.courseId}/scene`);
              }}
            >
              <div className="index">
                3
              </div>
              <div>
                <label className="title-3">场景</label>
                <p>设置习题应用的场景，点击&nbsp;[新建场景]&nbsp;创建一个场景</p>
              </div>
            </div>
            <div className={`flex nav-item ${t_4 === '1' ?
              // 完成下，判断是否选中
              props.active === 4 ?/**选中+完成 */ 'selected-finish isFinish' :/**未选中+完成 */'isFinish'
              //未完成下，判断是否选中
              : props.active === 4 ?/**选中+未完成 */ 'selected' :/**未选中+未完成 */'no-isFinish'
              }`}
              onClick={() => {
                history.push(`/expert/course/${props.courseId}/exercise`);
              }}
            >
              <div className="index">
                4
              </div>
              <div>
                <label className="title-3">习题</label>
                <p>设置习题，点击&nbsp;[新建习题]&nbsp;创建一个习题</p>
              </div>
            </div>
            <div className={`flex nav-item ${t_5 === '1' ?
              // 完成下，判断是否选中
              props.active === 5 ?/**选中+完成 */ 'selected-finish isFinish' :/**未选中+完成 */'isFinish'
              //未完成下，判断是否选中
              : props.active === 5 ?/**选中+未完成 */ 'selected' :/**未选中+未完成 */'no-isFinish'
              }`}
              onClick={() => {
                history.push(`/expert/course/${props.courseId}/confirm`);
              }}
            >
              <div className="index">
                5
              </div>
              <div>
                <label className="title-3">确认课程信息</label>
                <p>完成创建操作，切换到查看课程</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CourseNav;
