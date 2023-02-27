import { useState, useEffect } from 'react';
import { message, Space } from 'antd';
import './less/style.less'
import Highlight from 'react-highlight';
import 'highlight.js/styles/magula.css'
import TeacherMenu from '@/pages/common-course/menu';
import { getExerciseScoreById } from '@/services/teacher/course/exam';
import { API } from '@/common/entity/typings';

const answerView = (props: any) => {

  const [dataSource, setDataSource] = useState<API.Score>();
  const scoreId = props.scoreId;

  useEffect(() => {
    getExerciseScoreById(scoreId).then((result) => {
      if (result.success) {
        setDataSource(result.obj);
      } else {
        message.error(result.message);
      }
    });
  }, []);

  return (
    <>
      <div className="title-4 answer-view-div-title">查看代码</div>
      <div className="answer-view-div-content">
        <div className="answer-situation-div">
          <div className="exercise-info">
            <Space size="middle">
              <div className={'exercise-id-1'}>#{dataSource?.exerciseId}</div>
              {dataSource?.exerciseName}
            </Space>
          </div>
          <div className="situation-info">
            <Space size={5}>
              运行ID : {dataSource?.scoreId}&nbsp;&nbsp;/&nbsp;&nbsp;
              答题结果 :
              {
                dataSource?.score == 100 ?
                  <div className='situation-info-score-div' style={{ backgroundColor: '#00ce9b' }}>Right</div>
                  :
                  <div className='situation-info-score-div' style={{ backgroundColor: '#FF6B6B' }}>Wrong</div>
              }
              &nbsp;&nbsp;/&nbsp;&nbsp;
              执行时间 : {dataSource?.answerExecuteTime}ms&nbsp;&nbsp;/&nbsp;&nbsp;
              代码长度 : {dataSource?.answerLength}&nbsp;&nbsp;/&nbsp;&nbsp;
              提交时间 : {dataSource?.createTime}
            </Space>
          </div>
        </div>
        <div className="answer-code-div">
          <div className="shell">
            {
              dataSource?.answer === '' ? '无' :
                <Highlight language="sql">
                  {dataSource?.answer}
                </Highlight>
            }
          </div>
        </div>
      </div>
    </>


    // <div className="answer-view-div">
    //   <div className="title-4 answer-view-div-title">查看代码</div>
    //   <div className="answer-view-div-content">
    //     <div className="answer-situation-div">
    //       <div className="exercise-info">
    //         #{dataSource?.exerciseId}&nbsp;&nbsp;{dataSource?.exerciseName}
    //       </div>
    //       <div className="situation-info">
    //         运行ID : {dataSource?.scoreId}&nbsp;&nbsp;/&nbsp;&nbsp;
    //         答题结果 : {dataSource?.score == 100 ? <span style={{ color: '#00ce9b' }}>正确</span> : <span style={{ color: '#FF6B6B' }}>错误</span>}&nbsp;&nbsp;/&nbsp;&nbsp;
    //         执行时间 : {dataSource?.answerExecuteTime}ms&nbsp;&nbsp;/&nbsp;&nbsp;
    //         代码长度 : {dataSource?.answerLength}&nbsp;&nbsp;/&nbsp;&nbsp;
    //         提交时间 : {dataSource?.createTime}
    //       </div>
    //     </div>
    //     <div className="answer-code-div">
    //       <div className="shell">
    //         {
    //           dataSource?.answer === '' ? '无' :
    //             <Highlight language="sql">
    //               {dataSource?.answer}
    //             </Highlight>
    //         }
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default answerView;
