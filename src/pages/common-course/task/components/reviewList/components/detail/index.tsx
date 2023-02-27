import React, { useState, useEffect } from 'react'
import Header from './header'
import './index.less'
import { Affix, Divider, message } from 'antd';
import { review, saveHomeWrok, submitHomeWrok } from '@/services/student/task/task';
import { TASK } from '@/common/entity/task';
import SortMenu from './menu/sort'
import TypeMenu from './menu/type'
import SortContnet from './sort/index'
import TypeContnet from './type/index'
const DetailByTeacher = (props: any) => {
  if (!props.match!.params.homeworkId) {
    return;
  }
  const studentId = props.match!.params.studentId // 学生id
  const homeworkId = props.match!.params.homeworkId // 作业id
  const [subExamList, setSubExamList] = useState<TASK.TaskSumbitExerciseParam[]>([]);  // 作业的习题参数列表
  const [taskData, setTaskData] = useState<TASK.ReviewData>();
  const [taskList, setTaskList] = useState<TASK.ReviewSortExercises[]>([]);    // 作业列表数据
  const [bolClassify, setBolClassify] = useState<boolean>(false);
  const [taskTypeList, setTaskTypeList] = useState<TASK.ReviewClassifyExercises[]>([]);    // 作业类型列表数据
  const [whetherAnswer, setWhetherAnswer] = useState<number>(-1);  // 是否允许查看答案
  let arr: TASK.TaskSumbitExerciseParam[] = []
  useEffect(() => {
    fetchData()
  }, []);
  const fetchData = () => {
    let param = {
      homeworkId: homeworkId,
      studentId: studentId,
      flag: 2
    }
    // 查询作业详情数据
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
          setTaskTypeList(res.obj.classifyExercises)
        } else {
          setBolClassify(false)
          res.obj.exercises.map((item: TASK.ReviewSortExercises, index: number) => getDetailValue(item))
          setSubExamList(arr)
          setTaskData(res.obj)
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
  /**
   * 点击保存按钮
   */
  const clickSave = () => {
    // 调用ref组件内部方法
    let param = {
      homeworkInfos: subExamList,
      homeworkId: homeworkId
    }
    saveHomeWrok(param).then((res) => {
      if (res.success) {
        message.success('保存成功')
      } else {
        message.error(res.message)
      }
    })
  };
  /**
 * 点击继续答题，刷新题目出题页面
 */
  const continueAnswer = () => {
    // 调用ref组件内部方法
    let param = {
      homeworkInfos: subExamList,
      homeworkId: homeworkId
    }
    submitHomeWrok(param).then((res) => {
      if (res.success) {
        message.success(res.message)
        localStorage.setItem('refresh-task', '1')
        setTimeout(() => window.close(), 1000)
      } else {
        message.error(res.message)
      }
    })
  }
  return (
    <>
      <Header clickSave={() => clickSave()} continueAnswer={() => continueAnswer()} />

      <div className='question-create-div'>
        <div className='content'>
          <div className='question-create-card content-left'>
            <div className='title'>
              {taskData?.homeworkName}
              <span style={{ marginLeft: '20px', float: 'right', fontSize: '2rem', color: 'red' }}>{taskData?.mark}分</span>
            </div>
            <div className='desc'>
              <span>题量：{taskData?.exerciseCount}</span>
              <span>满分：{taskData?.score}</span>
              <span>作答时间：{taskData?.startTime} 至 {taskData?.endTime}</span>
            </div>
            <Divider></Divider>
            {
              bolClassify == false && taskList.length != 0 && whetherAnswer!=-1 &&
              <SortContnet taskList={taskList} subExamList={subExamList}  whetherAnswer={whetherAnswer}></SortContnet>
            }
            {
              bolClassify == true && taskTypeList.length != 0 && whetherAnswer!=-1 &&
              <TypeContnet taskList={taskTypeList} subExamList={subExamList}  whetherAnswer={whetherAnswer}></TypeContnet>
            }
          </div>
          <Affix offsetTop={90} className="content-right">
            {
              bolClassify == false && taskList.length != 0 &&
              <SortMenu taskList={taskList}></SortMenu>
            }
            {
              bolClassify == true && taskTypeList.length != 0 &&
              <TypeMenu taskList={taskTypeList}></TypeMenu>
            }
          </Affix>
        </div>
      </div>
    </>
  )
}

export default DetailByTeacher