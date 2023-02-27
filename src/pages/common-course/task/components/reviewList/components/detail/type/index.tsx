import React, { useState, useEffect } from 'react'
import { QUESTION_BANK } from '@/common/entity/questionbank'
import { Button, Divider } from 'antd';
import { TASK } from '@/common/entity/task';
import SuperIcon from "@/pages/components/icons";
import '../index.less'
const AnswserByType = (props: any) => {
  const taskList = props.taskList
  const [examList, setExamList] = useState<TASK.TaskSumbitExerciseParam[]>(props.subExamList);  // 作业的习题参数列表
  const [examLength, setExamLength] = useState<number[]>([])
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
    console.log("examLength:", examLength)
    console.log("examList:", examList)
  }, [])
  const computedIndex = (currentIndex: number, index: number): number => {
    // return Number(currentIndex + examLength[index] - 1)
    if(index-1 < 0) {
      return  Number(currentIndex)
    }else {
      return  Number(currentIndex + examLength[index-1])
    }
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
                    {/* 判断题 */}
                    {
                      cItem.exerciseType == 3 &&
                      <>
                        <div className='card-select'>
                          <Button shape="circle" className={examList[computedIndex(cIndex, index)].exerciseResult == '1' ? 'clcikAnswserClass' : ''}>
                            A
                          </Button>
                          <span style={{ marginLeft: '20px' }}>正确</span>
                        </div>
                        <div className='card-select'>
                          <Button shape="circle" className={examList[computedIndex(cIndex, index)].exerciseResult == '2' ? 'clcikAnswserClass' : ''}>
                            B
                          </Button>
                          <span style={{ marginLeft: '20px' }}>错误</span>
                        </div>
                      </>
                    }
                    {/* 单选题 */}
                    {
                      cItem.exerciseType == 1 && cItem.exercise.exerciseInfos.map((eItem: QUESTION_BANK.QuestionExerciseOption, eIndex: number) => {
                        return <div key={'single' + eIndex} style={{ display: 'flex' }}>
                          <Button shape="circle" className={eItem.prefix == examList[computedIndex(cIndex, index)].exerciseResult ? 'clcikAnswserClass' : ''}>
                            {eItem.prefix}
                          </Button>
                          <div className='html-width-class' dangerouslySetInnerHTML={{ __html: eItem?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
                        
                        </div>
                      })
                    }
               

                    {/* 多选题 */}
                    {
                      cItem.exerciseType == 2 &&
                      cItem.exercise && cItem.exercise.exerciseInfos.map((sItem: QUESTION_BANK.QuestionExerciseOption, sIndex: number) => {
                        return <div key={'multiple' + sIndex} style={{ display: 'flex' }}>
                          <Button className={examList[computedIndex(cIndex, index)].exerciseResult?.split(',').includes(sItem.prefix) ? 'clcikAnswserClass' : ''}>
                            {sItem.prefix}
                          </Button>
                          <div className='html-width-class' dangerouslySetInnerHTML={{ __html: sItem?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
                        </div>
                      })
                    }
                    {/* 填空题 */}
                    {
                      cItem.exerciseType == 4 &&
                      <>

                        {
                          cItem.exercise.exerciseInfos.map((tItem: QUESTION_BANK.QuestionExerciseOption, tIndex: number) => {
                            return <div className='space-answser-line'>
                              <span>空格{tIndex + 1}：</span>
                              <div className='html-width-class' dangerouslySetInnerHTML={{ __html: examList[computedIndex(cIndex, index)].exerciseResult.split('@_@')[tIndex] }} style={{ fontWeight: 'normal' }}></div>
                            </div>
                          })
                        }
                      </>
                    }
                    {
                            cItem.exerciseType == 4 &&
                            <div className='answser-normal-braft'>
                                <div className='header'>
                                    <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>正确答案：</span>
                                </div>
                                <div className='answser-content'>
                                    {
                                        cItem.exercise.exerciseInfos.map((tItem: QUESTION_BANK.QuestionExerciseOption, tIndex: number) => {
                                            return <div className='space-answser-line'>
                                                <span>空格{tIndex + 1}：</span>
                                                <div className='html-width-class' dangerouslySetInnerHTML={{ __html: tItem.content }} style={{ fontWeight: 'normal' }}></div>
                                            </div>
                                        })
                                    }
                                </div>
                                <Divider></Divider>
                                <div className='header'>
                                    <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>答案解析：</span>
                                </div>
                                <div className='answser-content'>
                                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: cItem.exercise.exerciseAnalysis != null ? cItem.exercise.exerciseAnalysis : '无' }}></div>
                                </div>
                            </div>
                    }
                    {/* 简答题或者sql编程题 */}
                    {/* 我的答案 */}
                    {
                      (cItem.exerciseType == 5 || cItem.exerciseType == 6) &&
                      <div className='answser-own-braft'>
                        <div className='header'>
                          <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>我的答案：</span>
                          <span>{cItem.exerciseScore} 分</span>
                        </div>
                        <div className='answser-content'>
                          <div className='html-width-class' dangerouslySetInnerHTML={{ __html: examList[computedIndex(0, index)].exerciseResult }}></div>
                        </div>

                      </div>
                    }
                      {/* 单选和多选正确答案 */}
                      {
                      (cItem.exerciseType == 1 || cItem.exerciseType == 2 || cItem.exerciseType == 3) &&
                      <div className={cItem.isCorrect == 1 ? 'answser-submit answser-submit-line' : 'answser-submit answser-cuowu-line'}>
                        <div>
                          <SuperIcon type={cItem.isCorrect == 1 ? 'icon-icon-duihao31' : 'icon-icon-cuowu21'} className={cItem.isCorrect == 1 ? 'answser-submit-button' : 'answser-cuowu-button'} style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px' }} />
                          <span style={{ fontWeight: 'bold' }}>
                            正确答案: {cItem.exerciseType == 3 ? (cItem.exercise.standardAnswser == 1 ? 'A' : 'B') : cItem.exercise.standardAnswser}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontWeight: 'bold' }}>{cItem.exerciseScore} </span>
                          <span>分</span>
                        </div>
                      </div>
                    }
                    {
                      (cItem.exerciseType == 5 || cItem.exerciseType == 6) &&
                      <div className='answser-normal-braft'>
                        <div className='header'>
                          <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>正确答案：</span>
                        </div>
                        <div className='answser-content'>
                          <div className='html-width-class' dangerouslySetInnerHTML={{ __html: cItem.exercise.standardAnswser }}></div>
                        </div>
                        <Divider></Divider>
                        <div className='header'>
                          <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>答案解析：</span>
                        </div>
                        <div className='answser-content'>
                          <div className='html-width-class' dangerouslySetInnerHTML={{ __html: cItem.exercise.exerciseAnalysis != null ? cItem.exercise.exerciseAnalysis : '无' }}></div>
                        </div>
                      </div>
                    }
                  </div>
                })
              }
            </div>
          )
        })
      }
    </div>
  )
}

export default AnswserByType