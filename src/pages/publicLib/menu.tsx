import { Affix } from 'antd';
import { history } from 'umi';

type IProp = {
  active: string;
};
const StudentMenu = (props: IProp) => {
  return (
    <Affix offsetTop={56}>
      <div className="course-menu">
        <div className={`course-menu-item ${props.active === 'scene' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/expert/public_library/scene`);
          }}
        >
          {props.active === 'scene' ? (
            <img src={require('@/img/teacher/icon-scene-active.svg')}></img>
          ) : (
            <img src={require('@/img/teacher/icon-scene.svg')}></img>
          )}
          <div>场景</div>
        </div>
        <div className={`course-menu-item ${props.active === 'exercise' ? 'item-active' : ''}`}
          onClick={() => {
            history.push(`/expert/public_library/exercise`);
          }}
        >
          {props.active === 'exercise' ? (
            <img src={require('@/img/student/icon-exercise-active.svg')}></img>
          ) : (
            <img src={require('@/img/student/icon-exercise.svg')}></img>
          )}
          <div>习题</div>
        </div>
      </div>
    </Affix>
  );
};
export default StudentMenu;
