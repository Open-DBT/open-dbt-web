import { useState, useEffect } from 'react';
import { message, Space } from 'antd';
import '@/pages/common-course/course-common.less';
import '@/pages/home.less';
import './less/style.less'
import { getStuScoreById } from '@/services/teacher/clazz/sclass';
import Highlight from 'react-highlight';
import 'highlight.js/styles/magula.css'
import TeacherMenu from '../menu';
import ContentHeader from '../ContentHeader';
import { getSclassInfoById } from '@/services/teacher/clazz/sclass';
import { API } from '@/common/entity/typings';
const answerView = (props: any) => {

  const [dataSource, setDataSource] = useState<API.Score>();
  const [sclassInfo, setSclassInfo] = useState<API.SclassRecord>();

  if (!props.match.params.sclassId || !props.match.params.scoreId) {
    return;
  }
  const sclassId = props.match.params.sclassId;
  const scoreId = props.match.params.scoreId;

  useEffect(() => {
    getSclassInfoById(sclassId).then((data) => {
      if (data.obj) setSclassInfo(data.obj)
    });

    getStuScoreById(scoreId).then((result) => {
      if (result.success) {
        setDataSource(result.obj);
      } else {
        message.error(result.message);
      }
    });
  }, []);

  const menuProps = { active: 'statis', sclassId: props.match.params.sclassId };
  const navProps = { active: 3, sclassId: props.match.params.sclassId };

  return (
    <div className="flex course sclass">
      <TeacherMenu {...menuProps} />
      <div style={{ width: '97%' }}>
        <ContentHeader sclass={sclassInfo} sclassId={sclassId} navProps={navProps} />
        <div className="course-content">
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
                    <div className='situation-info-score-div' style={{ backgroundColor: '#00ce9b'  }}>Right</div> 
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
        </div>
      </div>
    </div>
  );
};

export default answerView;
