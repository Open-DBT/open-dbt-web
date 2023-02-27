import React, { useState, useEffect } from 'react'
import Header from './header'
import './index.less'
import { Affix, Button, Divider, Input, message, Modal } from 'antd';
import { review, submitHomeWrok } from '@/services/student/task/task';
import { approval, taskCallBack } from '@/services/teacher/task/task';
import { TASK } from '@/common/entity/task';
import SortMenu from './menu/sort'
import TypeMenu from './menu/type'
import SortContnet from './sort/index'
import TypeContnet from './type/index'
import { API } from '@/common/entity/typings';
type IStuParam = {
  avatar: string;
  studentName: string;
  className:string;
  code: string;
}
type ICommitParam = {
  comment: any; // 编辑器对象或者string字符串
}
const DetailByTeacher = (props: any) => {
  if (!props.match!.params.homeworkId) {
    return;
  }
  const studentId = props.match!.params.studentId
  const homeworkId = props.match!.params.homeworkId
  const [subExamList, setSubExamList] = useState<TASK.TaskTeacherSumbitExerciseParam[]>([]);  // 作业的习题参数列表
  const [scoreList, setScoreList] = useState<TASK.TaskTeacherSumbitExerciseParam[]>();  // 作业的习题参数列表
  const [taskData, setTaskData] = useState<TASK.ReviewData>();
  const [taskList, setTaskList] = useState<TASK.ReviewSortExercises[]>([]);    // 作业列表数据
  const [bolClassify, setBolClassify] = useState<boolean>(false);
  const [taskTypeList, setTaskTypeList] = useState<TASK.ReviewClassifyExercises[]>([]);    // 作业类型列表数据
  const [whetherAnswer, setWhetherAnswer] = useState<number>(-1);  // 是否允许查看答案
  const [allScore, setAllScore] = useState<string>('');  // 总分
  const [reviewCommit, setReviewCommit] = useState<ICommitParam>({ comment: '' });  // 批阅详情
  const [currentStu, setCurrentStu] = useState<IStuParam>();  // 总分
  const [unSelectedGiven, setUnSelectedGiven] = useState<number>(-1);  // 是否有半对
  let arr: TASK.TaskTeacherSumbitExerciseParam[] = []
  useEffect(() => {
    fetchData()
  }, []);
  useEffect(() => {
    if (scoreList) {
      let scoreAdd = 0
      scoreList.map((item, index) => {
        scoreAdd = scoreAdd + Number(item.exerciseScore)
      })
      setAllScore(String(scoreAdd))
    }
  }, [scoreList]);
  // 控制Input数值的输入
  const onNumerInputKeyDown = (event: any) => {
    if (event.key === "e") event.preventDefault();
    if (event.key === "+") event.preventDefault();
    if (event.key === "-") event.preventDefault();
  }
  const changeAllScore = (val: any) => {
    setScoreList(val)
    setTaskList(val)
    let scoreAdd = 0
    val.map((item: any) => {
      scoreAdd = scoreAdd + Number(item.exerciseScore)
    })
    setAllScore(String(scoreAdd))
  }
  const fetchData = () => {
    let param = {
      homeworkId: homeworkId,
      studentId: studentId,
      flag: 2
    }
    review(param).then((res) => {
      if (res.success) {
        setWhetherAnswer(res.obj.whetherAnswer)
        setCurrentStu({
          avatar: res.obj.avatar,
          studentName: res.obj.studentName,
          className: res.obj.className,
          code: res.obj.code
        })
        setReviewCommit({ comment: res.obj.comments })
        if (res.obj.classifyExercises.length != 0) {
          setBolClassify(true)
          res.obj.classifyExercises.map((item: TASK.ReviewClassifyExercises, index: number) => {
            item.collect.map((cItem: TASK.ReviewCollectData, cIndex: number) => {
              let param = {
                exerciseId: cItem.exerciseId,
                exerciseResult: cItem.exerciseResult != null ? cItem.exerciseResult : '',
                exerciseScore: cItem.exerciseScore,
                isCorrect: cItem.isCorrect,
                exerciseActualScore: cItem.exerciseActualScore,
              }
              if (!param.exerciseResult && item.exercise?.exerciseInfos && item.exercise.exerciseInfos.length != 0 && item.exerciseType == 4) {
                item.exercise.exerciseInfos.map((eItem: any, eIndex: number) => {
                  param.exerciseResult += '@_@'
                })
              }
              arr.push(param)
            })
          })
          setSubExamList(arr)
          setScoreList(arr)
          setTaskData(res.obj)
          setUnSelectedGiven(res.obj.unselectedGiven)
          setTaskTypeList(res.obj.classifyExercises)
          setAllScore(res.obj.mark)
          let taskArr: any = []
          res.obj.classifyExercises.map((item: any, index: number) => {
            taskArr = taskArr.concat(item.collect)
          })
          setTaskList(taskArr)
        } else {
          setBolClassify(false)
          res.obj.exercises.map((item: TASK.ReviewSortExercises, index: number) => {
            let param = {
              exerciseId: item.exerciseId,
              exerciseResult: item.exerciseResult != null ? item.exerciseResult : '',
              exerciseScore: item.exerciseScore,
              isCorrect: item.isCorrect,
              exerciseActualScore: item.exerciseActualScore,
            }
            if (!param.exerciseResult && item.exercise?.exerciseInfos && item.exercise.exerciseInfos.length != 0 && item.exerciseType == 4) {
              item.exercise.exerciseInfos.map((eItem: any, eIndex: number) => {
                param.exerciseResult += '@_@'
              })
            }
            arr.push(param)
          })

          setSubExamList(arr)

          setScoreList(arr)
          setTaskData(res.obj)
          setAllScore(res.obj.mark)
          setTaskList(res.obj.exercises)
          setUnSelectedGiven(res.obj.unselectedGiven)
        }
      } else {
        console.log('失败')
      }
    })
  }
  /**
   * 打回重做
   */
  const handleExit = () => {
    Modal.confirm({
      title: '打回',
      content: '确定要打回重做吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        handleCallBack()
      },
      onCancel() { },
    });
  }
  const handleCallBack = () => {
    taskCallBack(homeworkId, studentId).then((res: any) => {
      if (res.success) {
        message.success(res.message)
        localStorage.setItem('refresh-task-review', '1')
        setTimeout(() => window.close(), 1000)

      } else {
        message.error(res.message)
      }
    })
  }
  const inputAllScore = (e: any) => {
    if (e.target.value > Number(taskData?.score)) {
      message.error('输入值超出题目分数!')
      e.preventDefault();
    } else {
      setAllScore(e.target.value)
    }

  }
  /**
   * 点击保存按钮
   */
  const clickSave = () => {
    // 调用ref组件内部方法
    let param = {
      comments: reviewCommit.comment ? (typeof (reviewCommit.comment) != 'string' ? reviewCommit.comment.toHTML() : reviewCommit.comment) : '',
      stuHomeworkInfos: taskList,
      homeworkId: homeworkId,
      studentId: studentId,
      stuScore: allScore
    }
    if (allScore == '') {
      message.error('请输入总分数!')
      return
    }
    approval(param).then((res: API.Result<boolean>) => {
      if (res.success) {
        message.success('提交成功')
        localStorage.setItem('refresh-task', '1')
        setTimeout(() => window.close(), 1000)
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
    <div className='custom-single '>
      <Header clickSave={() => clickSave()} continueAnswer={() => continueAnswer()} />

      <div className='question-create-div'>
        <div className='content'>
          <div className='question-create-card content-left'>
            <div className='title'>
              {taskData?.homeworkName}
            </div>
            <div className='desc'>
              <span>题量：{taskData?.exerciseCount}</span>
              <span>满分：{taskData?.score}</span>
              <span>作答时间：{taskData?.startTime} 至 {taskData?.endTime}</span>
            </div>
            <Divider></Divider>
            {
              bolClassify == false && taskList.length != 0 && whetherAnswer != -1 &&
              <SortContnet unSelectedGiven={unSelectedGiven} taskList={taskList} subExamList={subExamList} whetherAnswer={whetherAnswer} reviewCommit={reviewCommit} changeAllScore={(val: any) => { changeAllScore(val) }}></SortContnet>
            }
            {
              bolClassify == true && taskTypeList.length != 0 && whetherAnswer != -1 &&
              <TypeContnet unSelectedGiven={unSelectedGiven} taskList={taskTypeList} subExamList={subExamList} whetherAnswer={whetherAnswer} reviewCommit={reviewCommit} changeAllScore={(val: any) => { changeAllScore(val) }}></TypeContnet>
            }
          </div>
          <Affix offsetTop={90} className="content-right">
            {
              bolClassify == false && taskList.length != 0 &&
              <SortMenu taskList={taskList} currentStu={currentStu}></SortMenu>
            }
            {
              bolClassify == true && taskTypeList.length != 0 &&
              <TypeMenu taskList={taskTypeList} currentStu={currentStu}></TypeMenu>
            }
          </Affix>
        </div>
      </div>
      <div className='custom-header-row' style={{ position: 'fixed', bottom: 0 }}>
        <div className='custom-header-row flex-header-row' style={{ position: 'fixed', bottom: 0 }}>
          <div className='header-left-bottom'>
            <span className='question-num'>总分：<Input type='number' onKeyPress={(e) => onNumerInputKeyDown(e)} min={0} max={taskData?.score} value={allScore} onChange={(e) => inputAllScore(e)} style={{ display: 'inline-block', width: '100px', color: 'red' }}></Input> 分</span>
            <span className='type-desc' style={{ marginLeft: '20px' }}>
              客观题得分：{taskData?.objectiveScore}分
            </span>
          </div>
          <div className='header-right'>
            <Button style={{ borderRadius: '5px', marginRight: '20px', background: '#FDDF66', }} onClick={() => { handleExit() }}>
              打回重做
            </Button>
            <Button type="primary" style={{ borderRadius: '5px' }} onClick={() => { clickSave() }}>
              提交
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailByTeacher