import { useEffect, useState } from 'react';
import { getExerciseReportCard } from '@/services/student/student';
import { Col, Row } from 'antd';
import './index.less';
import { API } from '@/common/entity/typings';
const ExamDetails = (props: any) => {
  const courseId = props.courseId;
  const sclassId = props.sclassId;
  const examId = props.examId;
  const examClassId = props.examClassId;
  const [exerciseList, setExeriseList] = useState<API.StudentExamExercise[]>([]);
  const [examDetail, setExamDetail] = useState<API.StudentReportCard>();
  useEffect(() => {
    getExerciseReportCard(examClassId).then((result) => {
      console.log('getExerciseReportCard result', result);
      if (result.obj) {
        setExamDetail(result.obj);
        if (result.obj.exerciseReportCardList) {
          setExeriseList(result.obj.exerciseReportCardList);
        }
      }
    });
  }, []);

  return (
    <>
      <div className="title-4" style={{ marginBottom: '.75rem', marginTop: '.75rem' }}>
        作业#{examClassId}：{examDetail?.examName}
      </div>
      <div className="examdetail-state">
        <h4>
          <span className="title-2">状态：</span>
          {examDetail?.examStatus === 1 ? (
            <span style={{ color: 'red' }}>作业已截止</span>
          ) : (
            <span style={{ color: '#00ce9b' }}>作业进行中</span>
          )}
        </h4>
        <h4>
          <span className="title-2">作业时间：</span>
          {examDetail?.examStart} &nbsp; - &nbsp;{examDetail?.examEnd}
        </h4>
        <h4>
          <span className="title-2">总题目数：</span>{examDetail?.exerciseCount}
          <span className="title-2" style={{ marginLeft: '20px' }}>已答题目数：</span>{examDetail?.answerExerciseCount}
          <span className="title-2" style={{ marginLeft: '20px' }}>总分值：</span>{examDetail?.exerciseGrossScore}
          <span className="title-2" style={{ marginLeft: '20px' }}>已得分值：</span>{examDetail?.studentGrossScore}
        </h4>
      </div>

      <div className="examdetail-exercise">
        <Row gutter={24}>
          {exerciseList.map((item, index) => {
            return (
              <Col span={24} key={index}>
                <div
                  className={`flex exercise-card ${item.exerciseSituation === 0 ? 'is-danger' : ''} ${item.exerciseSituation === 100 ? 'is-active' : ''}`}
                  onClick={() =>
                    window.open(`/stu/course/exam/exercise/${courseId}/${sclassId}/${examId}/${examClassId}/${item.exerciseId}`)
                  }
                >
                  <div
                    className={`index ${item.exerciseSituation === 0 ? 'is-danger-index' : ''} ${item.exerciseSituation === 100 ? 'is-active-index' : ''}`}
                  >
                    {index + 1}
                  </div>
                  <div className="name">
                    <span style={{ marginRight: 6 }}>#{item.exerciseId}</span>
                    {item.exerciseName}
                  </div>
                  <div className="score">
                    <span style={{ marginRight: 6 }}>分值 : {item.exerciseScore}</span>
                    {item.exerciseSituation === 0 ? (
                      <img src={require('@/img/student/exam-exercise-error.svg')} style={{ marginBottom: 4 }}></img>
                    ) : null}
                    {item.exerciseGoal > 0 ? (
                      <img src={require('@/img/student/exam-exercise-succ.svg')} style={{ marginBottom: 4 }}></img>
                    ) : null}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );
};
export default ExamDetails;
