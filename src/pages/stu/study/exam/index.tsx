import { useEffect, useState } from 'react';
import { getExamListBySclass } from '@/services/student/student';
import { Col, Row, Button } from 'antd';
import './index.less';
import { history } from 'umi';
import { API } from '@/common/entity/typings';
type IProp = {
  courseId: number;
  clazzId: number;
};
/**
 * 课程-作业首页
 * @param props 
 * @returns 
 */
const ExamList = (props: IProp) => {
  const courseId = props.courseId;
  const clazzId = props.clazzId;
  const [examList, setExamList] = useState<API.ExamListRecord[]>([]);

  useEffect(() => {
    getExamListBySclass(clazzId, courseId).then((res) => {
      if (res.success && res.obj) setExamList(res.obj);
    });
  }, []);

  /**
   * 点击进入作业明细
   * @param examId 
   */
  const enterExamDetails = (examId: number, examClassId: number) => {
    history.push(`/stu/course/exam/examClass/detail/${courseId}/${clazzId}/${examId}/${examClassId}`);
  }

  return (
    <>
      <div className="title-4" style={{ marginBottom: '.75rem', marginTop: '.75rem' }}>作业</div>
      <p>请在规定时间内完成作业，逾期将无法进行答题</p>
      <div>
        <Row gutter={24}>
          {examList.map((item, index) => {
            return (
              <Col span={8} key={index}>
                <div className={`exam-card ${item.isEnd === 1 ? 'is-close' : ''}`} onClick={() => enterExamDetails(item.id, item.examClassId)}>
                  <h3 className="title-3">作业#{item.examClassId}：{item.testName}</h3>
                  <p>开始时间：{item.testStart}</p>
                  <p>结束时间：{item.testEnd}</p>
                  <p>作业：{item.exerciseCount}道题目</p>
                  <div style={{ marginTop: '1.2rem' }}>
                    {item.isEnd === 1 ?
                      <Button type="primary" size="small" style={{ borderRadius: 6 }} danger>已关闭</Button> :
                      <Button size="small" style={{ borderRadius: 6 }}>&nbsp;开始答题&nbsp;</Button>
                    }
                  </div>
                </div>
              </Col>
            );
          })
          }
        </Row>
      </div>
    </>
  );
};

export default ExamList;
