import React, { useState } from 'react'
import CODE_CONSTANT from '@/common/code'
import { QUESTION_BANK } from '@/common/entity/questionbank'
import { Button, Divider } from 'antd';
import { TASK } from '@/common/entity/task';
import SuperIcon from "@/pages/components/icons";
const AnswserBySort = (props: any) => {
    const taskList = props.taskList
    const whetherAnswer = props.whetherAnswer
    const [examList, setExamList] = useState<TASK.TaskSumbitExerciseParam[]>(props.subExamList);  // 作业的习题参数列表
    return (
        <div>
            {
                taskList && taskList.map((item: any, index: number) => {
                    return <div key={"list-sort" + index} id={"id-sort" + index}>
                        <div>
                            <span className='card-list-title task-title'>
                                {index + 1}. {item.exercise.exerciseName}
                            </span>
                            <span className='card-list-desc desc'>（{CODE_CONSTANT.questionType[item.exerciseType - 1]}，{item.exerciseActualScore}分）</span>
                        </div>
                        <div className='card-label'>
                            <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item.exercise.stem }}></div>
                        </div>
                        {/* 判断题 */}
                        {
                            item.exerciseType == 3 &&
                            <>
                                <div className='card-select'>
                                    <Button shape="circle" className={examList[index].exerciseResult == '1' ? 'clcikAnswserClass' : ''}>
                                        A
                                    </Button>
                                    <span style={{ marginLeft: '20px' }}>正确</span>
                                </div>
                                <div className='card-select'>
                                    <Button shape="circle" className={examList[index].exerciseResult == '2' ? 'clcikAnswserClass' : ''}>
                                        B
                                    </Button>
                                    <span style={{ marginLeft: '20px' }}>错误</span>
                                </div>
                            </>
                        }
                        {/* 单选题 */}
                        {
                            item.exerciseType == 1 && item.exercise.exerciseInfos.map((eItem: QUESTION_BANK.QuestionExerciseOption, eIndex: number) => {
                                return <div key={'single' + eIndex} style={{ display: 'flex' }}>
                                    <Button shape="circle" className={eItem.prefix == examList[index].exerciseResult ? 'clcikAnswserClass' : ''}>
                                        {eItem.prefix}
                                    </Button>
                                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: eItem?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
                                </div>
                            })
                        }
                        {/* 多选题 */}
                        {
                            item.exerciseType == 2 &&
                            item.exercise && item.exercise.exerciseInfos.map((sItem: QUESTION_BANK.QuestionExerciseOption, sIndex: number) => {
                                return <div key={'multiple' + sIndex} style={{ display: 'flex' }}>
                                    <Button className={examList[index].exerciseResult?.split(',').includes(sItem.prefix) ? 'clcikAnswserClass' : ''}>
                                        {sItem.prefix}
                                    </Button>
                                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: sItem?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
                                </div>
                            })
                        }
                        {/* 单选和多选正确答案 */}
                        {

                            (item.exerciseType == 1 || item.exerciseType == 2 || item.exerciseType == 3) &&  whetherAnswer == 1 &&
                            <div className={item.isCorrect == 1 ? 'answser-submit answser-submit-line' : 'answser-submit answser-cuowu-line'}>
                                <div>
                                    <SuperIcon type={item.isCorrect == 1 ? 'icon-icon-duihao31' : 'icon-icon-cuowu21'} className={item.isCorrect == 1 ? 'answser-submit-button' : 'answser-cuowu-button'} style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px' }} />
                                    <span style={{ fontWeight: 'bold' }}>
                                        正确答案: {item.exerciseType == 3 ? (item.exercise.standardAnswser == 1 ? 'A' : 'B') : item.exercise.standardAnswser}
                                    </span>

                                </div>
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>{item.exerciseScore} </span>
                                    <span>分</span>
                                </div>
                            </div>
                        }
                        {
                            item.exerciseType == 4 &&
                            <div className='answser-own-braft'>
                                <div className='header'>
                                    <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>我的答案：</span>
                                    <span>{item.exerciseScore} 分</span>
                                </div>
                                <div className='answser-content'>
                                    {
                                        item.exercise.exerciseInfos.map((tItem: QUESTION_BANK.QuestionExerciseOption, tIndex: number) => {
                                            return <div className='space-answser-line'>
                                                <span>空格{tIndex + 1}：</span>
                                                <div className='html-width-class' dangerouslySetInnerHTML={{ __html: examList[index].exerciseResult.split('@_@')[tIndex] }} style={{ fontWeight: 'normal' }}></div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        }
                        {
                            item.exerciseType == 4 &&  whetherAnswer == 1 &&
                            <div className='answser-normal-braft'>
                                <div className='header'>
                                    <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>正确答案：</span>
                                </div>
                                <div className='answser-content'>
                                    {
                                        item.exercise.exerciseInfos.map((tItem: QUESTION_BANK.QuestionExerciseOption, tIndex: number) => {
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
                                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item.exercise.exerciseAnalysis != null ? item.exercise.exerciseAnalysis : '无' }}></div>
                                </div>
                            </div>
                        }

                        {/* 简答题或者sql编程题 */}
                        {/* 我的答案 */}
                        {
                            (item.exerciseType == 5 || item.exerciseType == 6) &&
                            <div className='answser-own-braft'>
                                <div className='header'>
                                    <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>我的答案：</span>
                                    <span>{item.exerciseScore} 分</span>
                                </div>
                                <div className='answser-content'>
                                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: examList[index].exerciseResult }}></div>
                                </div>

                            </div>
                        }
                        {
                            (item.exerciseType == 5 || item.exerciseType == 6) && whetherAnswer == 1 &&
                            <div className='answser-normal-braft'>
                                <div className='header'>
                                    <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>正确答案：</span>
                                </div>
                                <div className='answser-content'>
                                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item.exercise.standardAnswser }}></div>
                                </div>
                                <Divider></Divider>
                                <div className='header'>
                                    <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>答案解析：</span>
                                </div>
                                <div className='answser-content'>
                                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item.exercise.exerciseAnalysis }}></div>
                                </div>
                            </div>
                        }
                        <Divider />
                    </div>
                })
            }
        </div>
    )
}

export default AnswserBySort