import React from 'react'
import Header from './header'
import './index.less';
import { useEffect, useState } from 'react';
import { Divider, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useParams } from 'umi';
import { TASK } from '@/common/entity/task';
import { getExercisesByModelId } from '@/services/teacher/task/task';
import { QUESTION_BANK } from '@/common/entity/questionbank'
import CODE_CONSTANT from '@/common/code'
import SelectContent from './selectContent'
const addTask = () => {
  const params: any = useParams();  // 获取地址栏参数
  const taskId = params.taskId; // 作业id
  const [classify, setClassify] = useState<number>();
  const [modelName, setModelName] = useState<string>('');
  const [viewAnswser, setViewAnswser] = useState<boolean>(true);

  const [exercises, setExercises] = useState<QUESTION_BANK.QuestionExercise[]>([]); // 不按题型分类
  const [classifyExercises, setClassifyExercises] = useState<TASK.TaskClassifyParam []>([]) // 按题型分类
  useEffect(() => {
    // 如果有任务点，查询左侧作业的题目目录
    if (taskId) {
      fetchFinishData()
    }
  }, [])
  // 点击显示答案选项
  const onChangeAnswser = (e: CheckboxChangeEvent) => {
    setViewAnswser(e.target.checked)
  };
  // 模板习题左侧列表显示接口
  const fetchFinishData = () => {
    getExercisesByModelId(taskId, 1).then((res) => {
      if (res.success) {
        setClassify(res.obj.classify)
        setModelName(res.obj.modelName)
        if (res.obj.classify == 1) {
          setClassifyExercises(res.obj.classifyExercises)
        } else {
          setExercises(res.obj.exercises)
        }

      }
    })
  }
  return (
    <>
      <Header />
      <div className='library-bank main-container'>
        <div className='content'>
          <div className="library-tool">
            <div className='library-flex'>
              <div>
                {modelName}
              </div>
              <Checkbox onChange={onChangeAnswser} checked={viewAnswser}>显示答案</Checkbox>
            </div>
            <Divider />
            {/* 按题型 */}
            {
              classify == 1 && 
              <div>
                {
                  classifyExercises && classifyExercises.map((item: TASK.TaskClassifyParam, index: number) => {
                    return <div key={"list-type" + index}>
                      <div>
                        <span className='card-list-title'>
                          {item.typeName}
                        </span>
                        <span className='card-list-desc'>（共{item.exerciseCount}题，{item.score}分）</span>
                      </div>
                      {
                        item.collect && item.collect.map((cItem: QUESTION_BANK.QuestionExercise, cIndex: number) => {
                          return <div key={"list-sort" + cIndex}>
                            <div>
                              <span className='card-list-title'>
                                {cIndex + 1}. {cItem.exerciseName}
                              </span>
                            </div>
                            <div className='card-label'>
                              <div className='html-width-class' dangerouslySetInnerHTML={{ __html: cItem.stem }}></div>
                            </div>
                            {
                              (cItem.exerciseType == 1 || cItem.exerciseType == 2 || cItem.exerciseType == 3) &&
                              <div className='card-label'>
                                <SelectContent type={cItem.exerciseType} content={cItem.exerciseInfos} answser={cItem.standardAnswser}></SelectContent>
                              </div>
                            }
                            {
                              viewAnswser && <>
                                <div className='card-label' style={{ fontWeight: 'bold', display: 'flex' }}>
                                  <span style={{ whiteSpace: 'nowrap' }}>正确答案：</span>
                                  {
                                    cItem.exerciseType != 1 && cItem.exerciseType != 2 && cItem.exerciseType != 3 && cItem.exerciseType != 4 ?
                                      <div className='html-width-class' dangerouslySetInnerHTML={{ __html: cItem.standardAnswser }}></div>
                                      : (cItem.exerciseType != 4 ? <span>{cItem.exerciseType == 3 ? (cItem.standardAnswser == '1' ? 'A' : 'B') : cItem.standardAnswser}</span> :
                                        <div>
                                          {
                                            cItem.exerciseInfos && cItem.exerciseInfos.map((sItem: QUESTION_BANK.QuestionExerciseOption, sIndex: number) => {
                                              return <div className='space-answser-line' key={'space-answser' + sIndex}>
                                                <span>空格{sIndex + 1}：</span>
                                                <div className='html-width-class' dangerouslySetInnerHTML={{ __html: sItem?.content }} style={{ fontWeight: 'normal' }}></div>
                                              </div>
                                            })
                                          }
                                        </div>
                                      )
                                  }
                                </div>
                                <div className='card-label' style={{ display: 'flex' }}>
                                  <span style={{ whiteSpace: 'nowrap' }}>答案解析：</span>
                                  {
                                    cItem.exerciseAnalysis ? <div className='html-width-class' dangerouslySetInnerHTML={{ __html: cItem.exerciseAnalysis }}></div> : '无'
                                  }
                                </div>
                                <div className='card-label'>
                                  <span>难易程度：</span><span>{cItem.exerciseLevel == 1 ? '简单' : (cItem.exerciseLevel == 2 ? '一般' : '困难')}</span>
                                </div>
                              </>
                            }

                          </div>
                        })
                      }
                      <Divider />
                    </div>
                  })
                }
              </div>
            }
            {/* 按顺序 */}
            {
              classify == 2 &&
              <div>
                {
                  exercises && exercises.map((item: QUESTION_BANK.QuestionExercise, index: number) => {
                    return <div key={"list-sort" + index}>
                      <div>
                        <span className='card-list-title'>
                          {index + 1}. {item.exerciseName}
                        </span>
                        <span className='card-list-desc'>（{CODE_CONSTANT.questionType[item.exerciseType - 1]}，{item.exerciseScore}分）</span>
                      </div>
                      <div className='card-label'>
                        <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item.stem }}></div>
                      </div>
                      {
                        (item.exerciseType == 1 || item.exerciseType == 2 || item.exerciseType == 3) &&
                        <div className='card-label'>
                          <SelectContent type={item.exerciseType} content={item.exerciseInfos} answser={item.standardAnswser}></SelectContent>
                        </div>
                      }
                      {
                        viewAnswser && <>
                          <div className='card-label' style={{ fontWeight: 'bold', display: 'flex' }}>
                            <span style={{ whiteSpace: 'nowrap' }}>正确答案：</span>
                            {
                              item.exerciseType != 1 && item.exerciseType != 2 && item.exerciseType != 3 && item.exerciseType != 4 ?
                                <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item.standardAnswser }}></div>
                                : (item.exerciseType != 4 ? <span>{item.standardAnswser}</span> :
                                  <div>
                                    {
                                      item.exerciseInfos && item.exerciseInfos.map((item: QUESTION_BANK.QuestionExerciseOption, index: number) => {
                                        return <div className='space-answser-line' key={'space-answser' + index}>
                                          <span>空格{index + 1}：</span>
                                          <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item?.content }} style={{ fontWeight: 'normal' }}></div>
                                        </div>
                                      })
                                    }
                                  </div>
                                )
                            }
                          </div>
                          <div className='card-label' style={{ display: 'flex' }}>
                            <span style={{ whiteSpace: 'nowrap' }}>答案解析：</span>
                            {
                              item.exerciseAnalysis ? <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item.exerciseAnalysis }}></div> : '无'
                            }
                          </div>
                          <div className='card-label'>
                            <span>难易程度：</span><span>{item.exerciseLevel == 1 ? '简单' : (item.exerciseLevel == 2 ? '一般' : '困难')}</span>
                          </div>
                        </>
                      }

                      <Divider />
                    </div>
                  })
                }
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default addTask