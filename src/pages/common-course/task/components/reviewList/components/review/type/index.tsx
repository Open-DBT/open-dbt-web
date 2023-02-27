import React, { useState, useEffect } from 'react'
import { Divider, message } from 'antd';
import { TASK } from '@/common/entity/task';
import BraftEditor from '@/pages/stu/study/task/component/braft/braft';
import SingleChoice from '../../questionType/singleChoice';
import Judge from '../../questionType/judge';
import Multiple from '../../questionType/multiple';
import Short from '../../questionType/shortAnswser';
import SpaceQeustion from '../../questionType/space';
import SqlQuestion from '../../questionType/sql';
import '../index.less'
const AnswserByType = (props: any) => {
  const { changeAllScore } = props
  const [taskList, setTaskList] = useState<any>(props.taskList); //点击更多存储当前行数据
  const [examList, setExamList] = useState<TASK.TaskTeacherSumbitExerciseParam[]>(props.subExamList);  // 作业的习题参数列表
  const [examLength, setExamLength] = useState<number[]>([])
  const commit = props.reviewCommit;  // 作业评语
  const unSelectedGiven = props.unSelectedGiven

  const editSumbit = async (item: any) => {
    item.isCorrect = 1
    item.exerciseScore = item.exerciseActualScore
    let objArr = taskList
    await setTaskList([...objArr])
    let arr:any = []
    taskList.map((item: any, index: number) => {
      arr = arr.concat(item.collect)
    })
    changeAllScore(arr)
  }
  const editReset = async (item: any) => {
    item.isCorrect = 2
    item.exerciseScore = 0
    let objArr = taskList
    await setTaskList([...objArr])
    let arr:any = []
    taskList.map((item: any, index: number) => {
      arr = arr.concat(item.collect)
    })
    changeAllScore(arr)
  }
  useEffect(() => {
    let arr: number[] = []
    taskList.map((item: any, index: number) => {
      if (index != 0) {
        arr[index] = arr[index - 1] + item.exerciseCount
      } else {
        arr[index] = item.exerciseCount
      }

    })
    setExamLength(arr)
  }, [])
  const computedIndex = (currentIndex: number, index: number): number => {
    if (index - 1 < 0) {
      return Number(currentIndex)
    } else {
      return Number(currentIndex + examLength[index - 1])
    }

  }
  const editHalf = async (item: any) => {
    console.log('33333333333333', item)
    item.isCorrect = 3
    item.exerciseScore = item.exerciseActualScore / 2
    let objArr = taskList
    await setTaskList([...objArr])
    let arr:any = []
    taskList.map((item: any, index: number) => {
      arr = arr.concat(item.collect)
    })
    changeAllScore(arr)
    
}
  const onChangeScore = (e: any, currentIndex: number, index: number) => {
  
    // let arr = examList;
    let arr: any = []
    taskList.map((item: any, index: number) => {
      arr = arr.concat(item.collect)
    })
    if (index == 0) {
      if(e.target.value > arr[currentIndex].exerciseActualScore) {
        message.error('输入值超出题目分数!')
        e.preventDefault();
    }else {
        arr[currentIndex].exerciseScore = e.target.value
    }
      // arr[currentIndex].exerciseScore = e.target.value
      setExamList([...arr])
      changeAllScore(arr)
    }
    else {
      arr[currentIndex + examLength[index - 1]].exerciseScore = e.target.value
      setExamList([...arr])
      changeAllScore(arr)
    }
  }
  const onChangeComment = (val: any) => {
    let obj = commit
    obj.comment = val
  }
  return (
    <div>
      {
        examLength.length != 0 && taskList.length != 0 && taskList.map((item: any, index: number) => {
          return (
            <div key={"list-type" + index}>
              <div>
                <span className='card-list-title task-title'>
                  {item.typeName}
                </span>
                <span className='card-list-desc desc'>（共{item.exerciseCount}题，{item.score}分）</span>
              </div>
              {
                item.collect && item.collect.map((cItem: any, cIndex: number) => {
                  return <div key={"list-sort" + cIndex} id={"id-type" + index + '-' + cIndex}>
                    <div>
                      <span className='card-list-title task-title'>
                        {cIndex + 1}. {cItem.exercise.exerciseName}
                      </span>
                    </div>
                    <div className='card-label'>
                      <div className='html-width-class' dangerouslySetInnerHTML={{ __html: cItem.exercise.stem }}></div>
                    </div>
              
                    {/* 单选题 */}
                    {
                            cItem.exerciseType == 1 && <SingleChoice data={cItem} current={examList[computedIndex(cIndex, index)]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} ></SingleChoice>
                    }
                    {/* 多选题 */}
                    {
                            cItem.exerciseType == 2 && <Multiple editHalf={editHalf} data={cItem} unselectedGiven={unSelectedGiven} current={examList[computedIndex(cIndex, index)]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} ></Multiple>
                    }
                    {/* 判断题 */}
                    {
                            cItem.exerciseType == 3 && <Judge data={cItem} current={examList[computedIndex(cIndex, index)]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} ></Judge>
                    }
                 
                    {/* 填空题 */}
                    {
                            cItem.exerciseType == 4 && <SpaceQeustion editHalf={editHalf} data={cItem} current={examList[computedIndex(cIndex, index)]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} onChangeScore={(val: any) => onChangeScore(val, cIndex, index)}></SpaceQeustion>
                    }
                    {/* 简答题和sql编程题 */}
                    {
                            cItem.exerciseType == 5 && <Short data={cItem} editHalf={editHalf} current={examList[computedIndex(cIndex, index)]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} onChangeScore={(val: any) => onChangeScore(val, cIndex, index)}></Short>
                    }
                    {
                            cItem.exerciseType == 6 && <SqlQuestion data={cItem} editHalf={editHalf} current={examList[computedIndex(cIndex, index)]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} onChangeScore={(val: any) => onChangeScore(val, cIndex, index)}></SqlQuestion>
                    }
      
                  </div>
                })
              }
            </div>
          )
        })
      }
      <Divider></Divider>
      <div className='header'>
        <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>作业评语：</span>
      </div>
      <BraftEditor className="border" placeholder="请输入正文内容" value={commit.comment} onChange={(val) => { onChangeComment(val) }} />
    </div>
  )
}

export default AnswserByType