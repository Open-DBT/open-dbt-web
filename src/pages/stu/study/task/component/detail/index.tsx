import React, { useState, useEffect } from 'react'
import Header from './header'
import './index.less'
import { Affix, Divider } from 'antd';
import { review } from '@/services/student/task/task';
import { TASK } from '@/common/entity/task';
import SortMenu from './menu/sort'
import TypeMenu from './menu/type'
import SortContnet from './sort/index'
import TypeContnet from './type/index'
const DetailByStu = (props: any) => {
  if (!props.match!.params.homeworkId) {
    return;
  }
  const studentId = props.match!.params.studentId
  const homeworkId = props.match!.params.homeworkId
  const [subExamList, setSubExamList] = useState<TASK.TaskSumbitExerciseParam[]>([]);  // 作业的习题参数列表
  const [taskData, setTaskData] = useState<TASK.ReviewData>();
  const [taskList, setTaskList] = useState<TASK.ReviewSortExercises[]>([]);    // 不按题型作业列表数据
  const [taskTypeList, setTaskTypeList] = useState<TASK.ReviewClassifyExercises[]>([]);    // 按题型作业类型列表数据
  const [bolClassify, setBolClassify] = useState<boolean>(false);
  const [reviewCommit, setReviewCommit] = useState<any>({ comment: '' });  // 批阅详情
  const [whetherAnswer, setWhetherAnswer] = useState<number>(-1);  // 是否允许查看答案
  let arr: TASK.TaskSumbitExerciseParam[] = []
  useEffect(() => {
    fetchData()
  }, []);
  // 查询作业内容详情
  const fetchData = () => {
    let param = {
      homeworkId: homeworkId,
      studentId: studentId,
      flag: 1
    }
    review(param).then((res) => {
      if (res.success) {
        setWhetherAnswer(res.obj.whetherAnswer)
        if (res.obj.classifyExercises.length != 0) {
          setBolClassify(true)
          res.obj.classifyExercises.map((item: TASK.ReviewClassifyExercises, index: number) => {
            item.collect.map((cItem: TASK.ReviewCollectData, cIndex: number) => getDetailValue(cItem))
          })
          setSubExamList(arr)
          setTaskData(res.obj)
          setReviewCommit({ comment: res.obj.comments })
          setTaskTypeList(res.obj.classifyExercises)
        } else {
          setBolClassify(false)
          res.obj.exercises.map((item: TASK.ReviewSortExercises, index: number) => getDetailValue(item))
          setSubExamList(arr)
          setTaskData(res.obj)
          setReviewCommit({ comment: res.obj.comments })
          setTaskList(res.obj.exercises)
        }
      } else {
        console.log('失败')
      }
    })
  }
    /**
   * 作业的习题参数列表赋值
   */
    const getDetailValue = (item: TASK.ReviewCollectData) => {
      let param = {
        exerciseId: item.exerciseId,
        exerciseResult: item.exerciseResult != null ? item.exerciseResult : '',
      }
      if (!param.exerciseResult && item.exercise.exerciseInfos && item.exercise.exerciseInfos.length != 0 && item.exerciseType == 4) {
        // 根据空格个数来添加间隔符
        item.exercise.exerciseInfos.map(() => {
          param.exerciseResult += '@_@'
        })
      }
      arr.push(param)
    }
  return (
    <>
    {/* 头部区域 */}
      <Header />
      <div className='question-create-div'>
        <div className='content'>
          {/* 左侧内容区域 */}
          <div className='question-create-card content-left'>
            <div className='title'>
              {taskData?.homeworkName}
              <span className='grade-font'>{taskData?.mark}分</span>
            </div>
            <div className='desc'>
              <span>题量：{taskData?.exerciseCount}</span>
              <span>满分：{taskData?.score}</span>
              <span>作答时间：{taskData?.startTime} 至 {taskData?.endTime}</span>
            </div>
            <Divider></Divider>
            {
              bolClassify == false && taskList.length != 0 && whetherAnswer != -1 &&
              <SortContnet taskList={taskList} subExamList={subExamList} reviewCommit={reviewCommit} whetherAnswer={whetherAnswer}></SortContnet>
            }
            {
              bolClassify == true && taskTypeList.length != 0 && whetherAnswer != -1 &&
              <TypeContnet taskList={taskTypeList} subExamList={subExamList} reviewCommit={reviewCommit} whetherAnswer={whetherAnswer}></TypeContnet>
            }
          </div>
          {/* 题目导航目录 */}
          {
            taskList.length != 0 && 
            <Affix offsetTop={90} className="content-right">
            {
              !bolClassify &&
              <SortMenu taskList={taskList}></SortMenu>
            }
            {
              bolClassify &&
              <TypeMenu taskList={taskTypeList}></TypeMenu>
            }
            </Affix>
          }
      
        </div>
      </div>
    </>
  )
}

export default DetailByStu