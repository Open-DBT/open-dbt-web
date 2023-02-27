import { useEffect, useState } from 'react';
import {
  getStuKnowledgeExerciseInfo,
  getCourseProgressByStu,
} from '@/services/student/progress';
import { Progress, Button, Tooltip } from 'antd';
import './index.less';
import { RingProgress } from '@ant-design/charts';
import { history } from 'umi';
import { API } from '@/common/entity/typings';
const hidden_count = 6;

type IProps = {
  courseId: number;
  clazzId: number;

}

/**
 * 课程-习题首页
 * @param props 
 * @returns 
 */
const knowledge = (props: IProps) => {

  const courseId = props.courseId;
  const clazzId = props.clazzId;
  const [sclassInfo, setSclassInfo] = useState<API.SclassRecord>();
  const [exeriseProcList, setExeriseProcList] = useState<API.stuSclassKnowRecord[]>([]);
  const [hiddenMore, setHiddenMore] = useState<boolean>(true);

  useEffect(() => {
    getStuKnowledgeExerciseInfo(clazzId, courseId, 0).then((data) => {
      if (data.obj) setExeriseProcList(data.obj);
    });
    getCourseProgressByStu(clazzId, courseId).then((data) => {
      if (data.obj) setSclassInfo(data.obj);
    });
  }, []);

  const handleMore = (isMore: boolean) => {
    setHiddenMore(isMore)
  }
  const enterExercise = (knowId: number) => {
    history.push(`/stu/course/knowledge/exercise/${courseId}/${clazzId}/${knowId}`);
  }
  var bizConfig = {
    height: 77,
    width: 77,
    autoFit: false,
    statistic: {
      content: {
        formatter: function formatter(_ref) {
          var percent = _ref.percent;
          return (percent * 100).toFixed(0) + '%';
        },
        style: {
          color: '#333333',
          fontSize: 14,
        },
      },
    },
  };
  return (
    <div className="student-know">
      <div className="course-info">
        <div className="student-home-desc">
          学习进度：
          <Progress
            percent={sclassInfo?.progress}
            size="small"
            strokeColor="#00CE9B" //完成颜色
            trailColor="#DCDCDC" //未完成分段颜色
            style={{ width: '50%', marginLeft: 14 }}
          />
        </div>
      </div>
      <div className="know-list">
        {exeriseProcList.map((item, index) => {
          let diff, //进度条颜色
            btnName = '已完成', //按钮文字
            className = 'card'; //卡片样式
          let img = <img src={require('@/img/student/icon-start.svg')} width="11px" height="9px"
            style={{ margin: '0px 0px 2px 0px' }} />;//箭头图标
          if (item.progress === 0) {
            btnName = "开始答题"
            diff = { percent: 0, color: ['#FDDF66', '#E5E5E5'] }; //0 灰色
          } else if (item.progress == 100) {
            className = "card finish";
            img = <img src={require('@/img/student/icon-duihao.svg')} width="11px" height="6px" /> //对号图标
            diff = { percent: 1, color: ['#FDDF66', '#00CE9B'] }; //100 绿色
          } else {
            btnName = "继续答题"
            diff = { percent: item.progress / 100, color: ['#FDDF66', '#FDDF66'] }; //1-99 黄色
          }
          if (hiddenMore && index + 1 > hidden_count) {
            //收起更多习题，只显示部分习题
            return null;
          }
          return (
            <div className={className} key={index}>
              <div className="card-left">
                <div className="title-3">
                  {item.name.length >= 8
                    ? <Tooltip title={item.name}>{item.name.substring(0, 7)}...</Tooltip>
                    : item.name
                  }
                </div>
                <div style={{ margin: '10px 0px 12px 0' }}>共{item.exerciseNumber}道练习题</div>
                <Button type="primary" size="small" className="button" onClick={() => enterExercise(item.knowledgeId)}>
                  {img}
                  &nbsp;&nbsp;{btnName}
                </Button>
              </div>
              <div className="card-right">
                <RingProgress {...bizConfig} {...diff} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center' }}>
        {
          //知识点小于6个不显示 底部按钮
          exeriseProcList.length <= hidden_count ?
            null :
            hiddenMore ?
              <Button type="primary" size="small" className="more-btn title-1"
                icon={<img src={require('@/img/student/icon-more.svg')} width="14px" height="14px"
                  style={{ margin: '0 5px 1px 0px' }}
                />}
                onClick={() => handleMore(false)}
              >
                更多习题</Button>
              :
              <Button type="primary" size="small" className="more-btn title-1"
                icon={<img src={require('@/img/student/icon-less.svg')} width="14px" height="14px"
                  style={{ margin: '0 5px 1px 0px' }}
                />}
                onClick={() => handleMore(true)}>
                收起更多</Button>
        }
      </div>
    </div>
  );
};
export default knowledge;
