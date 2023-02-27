import { useEffect, useState } from 'react';
import { getExerciseInfoByStu } from '@/services/teacher/course/score';
import { Button } from 'antd';
import './index.less';
import { API } from '@/common/entity/typings';
type IProp = {
  courseId: number;
  clazzId: number;
  knowId: number;
};
/**
 * 课程-习题-SQL编程题-开始答题
 * @param props 
 * @returns 
 */
const exercise = (props: IProp) => {
  const courseId = props.courseId;
  const clazzId = props.clazzId;
  const knowId = props.knowId;

  const [info, setInfo] = useState<API.stuExerciseInfo>();

  useEffect(() => {
    getExerciseInfoByStu(clazzId, courseId, knowId).then((res) => {
      if (res.success && res.obj) setInfo(res.obj);
    });
  }, []);
  /**
   * 去答题页面
   * @param exerciseId 
   */
  const goAnswer = (exerciseId: number) => {
    window.open(`/stu/course/exercise/${courseId}/${clazzId}/${knowId}/${exerciseId}`)
  }
  const getExerciseCard = (item: API.StuExerciseListRecord) => {
    if (item.score === '100') {
      return <div className="flex exercise-row" key={item.exerciseId}>
        <div className="flex">
          <div className="first success">
            DONE&nbsp;&nbsp;
            <img src={require('@/img/student/icon-duihao.svg')} width="11px" height="6px" style={{ margin: '0px 0px 2px 0px' }} />
          </div>
          <span><b>习题{item.exerciseId}：</b></span>
          <span style={{ fontSize: '.95rem' }}>{item.exerciseName}</span>
        </div>
        <div>
          <span className="answer-time">{item.ct}</span><Button type="primary" onClick={() => goAnswer(item.exerciseId)}>查看回答</Button>
        </div>
      </div>
    } else if (item.score === '-1') {
      return <div className="flex exercise-row" key={item.exerciseId}>
        <div className="flex">
          <div className="first notyet">Not&nbsp;yet</div>
          <span className="title-2">习题{item.exerciseId}：</span>
          <span style={{ fontSize: '.95rem' }}>{item.exerciseName}</span>
        </div>
        <Button type="primary" className="success" onClick={() => goAnswer(item.exerciseId)}>开始答题</Button>
      </div>
    } else {
      return <div className="flex exercise-row" key={item.exerciseId}>
        <div className="flex row-content">
          <div className="first wrong">
            Wrong&nbsp;&nbsp;
            <img src={require('@/img/student/icon-cuowu.svg')} width="11px" height="6px" style={{ margin: '0px 0px 2px 0px' }} />
          </div>
          <span><b>习题{item.exerciseId}：</b></span>
          <span style={{ fontSize: '.95rem' }}>{item.exerciseName}</span>
        </div>
        <div className="row-buttons">
          <span className="answer-time">{item.ct}</span><Button type="primary" onClick={() => goAnswer(item.exerciseId)}>重新答题</Button>
        </div>
      </div>
    }
  }

  return (
    <div className="student-exercise">
      <div className="student-home-desc flex">
        <span>知识点：{info?.knowledge ? info?.knowledge.name : '未分组'} &nbsp;&nbsp;共&nbsp; {info?.exerciseNumber} &nbsp;道练习题</span>
        <span style={{ color: '#00CE9B' }}>
          <img src={require('@/img/student/icon-duihao2.svg')} width="11px" height="11px"
            style={{ margin: '0 4px 0px 0px' }}
          />
          {info?.doneExerciseNumber}&nbsp;/&nbsp;{info?.exerciseNumber}</span>
      </div>
      <div className="exercise-list">
        {
          info?.exerciseList.map((item, index) => {
            return getExerciseCard(item)
          })
        }
      </div>
    </div>
  );

};
export default exercise;
