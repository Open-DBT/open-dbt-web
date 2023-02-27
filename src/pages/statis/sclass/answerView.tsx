import { useState, useEffect } from 'react';
import { message } from 'antd';
import './less/style.less'
import { getStuScoreById } from '@/services/teacher/clazz/sclass';
import Highlight from 'react-highlight';
import 'highlight.js/styles/magula.css'
import { API } from '@/common/entity/typings';
const answerView = (props: any) => {

  const [dataSource, setDataSource] = useState<API.Score>();

  if (!props.match.params.scoreId) {
    return;
  }
  const scoreId = props.match.params.scoreId

  useEffect(() => {
    getStuScoreById(scoreId).then((result) => {
      if (result.success) {
        setDataSource(result.obj);
      } else {
        message.error(result.message);
      }
    });
  }, []);

  return (
    <div className="answer-view-div">
      <div className="title-4 answer-view-div-title">查看代码</div>
      <div className="answer-view-div-content">
        <div className="answer-situation-div">
          <div className="exercise-info">
            #{dataSource?.exerciseId}&nbsp;&nbsp;{dataSource?.exerciseName}
          </div>
          <div className="situation-info">
            运行ID : {dataSource?.scoreId}&nbsp;&nbsp;/&nbsp;&nbsp;
            答题结果 : {dataSource?.score == 100 ? <span style={{ color: '#00ce9b' }}>正确</span> : <span style={{ color: '#FF6B6B' }}>错误</span>}&nbsp;&nbsp;/&nbsp;&nbsp;
            执行时间 : {dataSource?.answerExecuteTime}ms&nbsp;&nbsp;/&nbsp;&nbsp;
            代码长度 : {dataSource?.answerLength}&nbsp;&nbsp;/&nbsp;&nbsp;
            提交时间 : {dataSource?.createTime}
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
    </div>
  );
};

export default answerView;
