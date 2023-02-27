import React, { useState, useEffect } from 'react'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-min-noconflict/ext-language_tools";
import { QUESTION_BANK } from '@/common/entity/questionbank'
import {  Button, Form,  Input, message, Modal, Space } from 'antd';
import { TASK } from '@/common/entity/task';
import BraftEditor from '../../braft/braft';
import { API } from '@/common/entity/typings';
import ViewModal from '@/pages/common-course/scene/components/ViewModal';
import { stuTestRunAnswer } from '@/services/teacher/course/score';
import ResultSetModal from '@/pages/course/exercise/components/ResultSetModal';
import { LoadingOutlined } from '@ant-design/icons';
interface IProps {
  taskList: TASK.ReviewClassifyExercises[];
  subExamList: TASK.TaskSumbitExerciseParam[];  
}
const AnswserByType = (props: IProps) => {
  const taskList = props.taskList
  const [examList, setExamList] = useState<TASK.TaskSumbitExerciseParam[]>(props.subExamList);  // 作业的习题参数列表
  const [examLength, setExamLength] = useState<number[]>([])
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<API.SceneListRecord>();
  const [columnList, setColumnList] = useState([]);
  const [datatype, setDatatype] = useState([]);
  const [resultSet, setResultSet] = useState([]);
  const [isWaitModalVisible, setIsWaitModalVisible] = useState<boolean>(false);
  const [resultSetModalVisible, setResultSetModalVisible] = useState<boolean>(false);
  useEffect(() => {
    let arr: number[] = []
    taskList.map((item: any, index: number) => {
      if (index != 0) {
        arr[index] = arr[index - 1] + item.exerciseCount
      } else {
        arr[index] = item.exerciseCount
      }

    })
    arr.unshift(0)
    setExamLength(arr)
  }, [])
  // 单选题内容修改
  const onChangeSingle = (val: any, index: number) => {
    let arr = examList;
    arr[index].exerciseResult = val
    setExamList([...arr])
  }
  // 多选题内容修改
  const onChangeMultiple = (val: any, index: number) => {
    let arr = examList;
    console.log("arr[index].exerciseResult:", arr[index].exerciseResult)
    let arrStr = arr[index].exerciseResult
    let multArr = arrStr != '' ? arrStr.split(',') : []
    if (multArr.includes(val)) {
      multArr = multArr.filter(item => item != val)
    }
    else {
      multArr.push(val);
    }
    arr[index].exerciseResult = multArr != null ? multArr.join(',') : ''
    console.log(arr[index].exerciseResult)
    setExamList([...arr])
  }
  // 判断题内容修改
  const onChangeJudge = (val: any, index: number) => {
    let arr = examList;
    arr[index].exerciseResult = val
    setExamList([...arr])
  }
  // 编辑器内容修改
  const onChangeBraft = (val: any, index: number) => {
    let valueStr = val.toHTML()
    let arr = examList;
    arr[index].exerciseResult = valueStr
    setExamList([...arr])
  }
  // sql内容修改
  const onChangeSql = (value: any, index: number) => {
    let valueStr = value
    let arr = examList;
    arr[index].exerciseResult = valueStr
    setExamList([...arr])
  }
  // 空格内容修改
  const onChangeSpace = (e: any, index: number, currentIndex: number, allIndex: number) => {
    console.log(e.target.value, index, currentIndex, allIndex, examList)
    let arr = examList;
    let arrStr = arr[allIndex].exerciseResult
    let multArr: any = []
    if (arrStr != '') {
      multArr = arrStr.split('@_@')
      multArr[currentIndex] = e.target.value
    } else {
      arrStr = '@_@'
      multArr = arrStr.split('@_@')
      multArr[currentIndex] = e.target.value
    }
    arr[allIndex].exerciseResult = multArr != null ? multArr.join('@_@') : ''
    setExamList([...arr])
  }
  const computedIndex = (currentIndex: number, index: number): number => {
    return Number(currentIndex + examLength[index])
  }
  /**
* 测试运行
* @returns 
*/
  const testRun = (answer: any, item: any) => {
    if (answer.length == 0) {
      message.info('请输入答案')
      return;
    }
    testRunAnswer({ answer: answer, usageTime: 0 }, item)
  }
  // 测试运行
  const testRunAnswer = async (value: { answer: string; usageTime: number }, item: any) => {
    setIsWaitModalVisible(true);
    //测试提交答案
    stuTestRunAnswer({ ...value, exerciseId: item.exercise_id }).then((result: any) => {
      setIsWaitModalVisible(false);
      if (result.success) {
        if (result.obj) {
          if (!result.obj.executeRs) {
            message.error(result.obj.log);
            return
          }
          if (result.obj.executeRs && Object.keys(result.obj.studentResultMap).length == 3) {
            setColumnList(result.obj.studentResultMap.column);
            setDatatype(result.obj.studentResultMap.datatype);
            setResultSet(result.obj.studentResultMap.result);
            setResultSetModalVisible(true);
          }
        }
      } else {
        message.error(result.message);
      }
    });
  };

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
                          <Button shape="circle" className={examList[computedIndex(cIndex, index)].exerciseResult == '1' ? 'clcikAnswserClass' : ''} onClick={() => { onChangeJudge('1', computedIndex(cIndex, index)) }}>
                            A
                          </Button>
                          <span style={{ marginLeft: '20px' }}>正确</span>
                        </div>
                        <div className='card-select'>
                          <Button shape="circle" className={examList[computedIndex(cIndex, index)].exerciseResult == '2' ? 'clcikAnswserClass' : ''} onClick={() => { onChangeJudge('2', computedIndex(cIndex, index)) }}>
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
                          <Button shape="circle" className={eItem.prefix == examList[computedIndex(cIndex, index)].exerciseResult ? 'clcikAnswserClass' : ''} onClick={() => { onChangeSingle(eItem.prefix, computedIndex(cIndex, index)) }}>
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
                          <Button onClick={() => { onChangeMultiple(sItem.prefix, computedIndex(cIndex, index)) }} className={examList[computedIndex(cIndex, index)].exerciseResult?.split(',').includes(sItem.prefix) ? 'clcikAnswserClass' : ''}>
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
                        cItem.exercise.exerciseInfos.map((tItem: any, tIndex: number) => {
                          return <div style={{ display: 'flex' }} key={'field' + tIndex}>
                            <Form.Item label={`空格 ${tIndex + 1}`} style={{ width: '100%' }}>
                              <Input style={{ width: '100%' }} value={examList[computedIndex(cIndex, index)].exerciseResult.split('@_@')[tIndex]} onChange={(e) => onChangeSpace(e, index, tIndex, computedIndex(cIndex, index))} />
                            </Form.Item>
                          </div>
                        })
                        }
                      </>
                    }
                    {/* 简答题或者sql编程题 */}
                    {
                      cItem.exerciseType == 5 && <BraftEditor className="border" placeholder="请输入正文内容" value={examList[computedIndex(cIndex, index)].exerciseResult} onChange={(val) => onChangeBraft(val, computedIndex(cIndex, index))} />
                    }
                    {
                      cItem.exerciseType == 6 && <>
                        <Button style={{ marginRight: 8, marginBottom: 10 }} className="gray-button button-radius continue-button" onClick={() => { setViewModalVisible(true); setStepFormValues(cItem.exercise.scene) }}>场景查看</Button>
                        <Button style={{ marginRight: 8 }} type="primary" className="gray-button button-radius" onClick={() => { testRun(examList[computedIndex(cIndex, index)].exerciseResult, cItem) }}>测试运行</Button>
                        <AceEditor
                                    value={examList[computedIndex(cIndex, index)].exerciseResult}
                                    style={{ width: '100%', height: '100px', fontSize: '1rem' }}
                                    mode="mysql"
                                    theme="github"
                                    name="stu-answer"
                                    onChange={(val) => onChangeSql(val, computedIndex(cIndex, index))}
                                    fontSize={18}
                                    showPrintMargin={true} //打印边距
                                    showGutter={true}//行号
                                    highlightActiveLine={true}//突出显示活动线
                                    editorProps={{ $blockScrolling: true }} //自动补全
                                    setOptions={{
                                        enableBasicAutocompletion: true,//自动补全
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        showLineNumbers: true,
                                        tabSize: 2,
                                        useWorker: false //自动补全
                                    }} />
                      </>
                    }
                  </div>
                })
              }
            </div>
          )
        })
      }
      {viewModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
        <ViewModal
          onCancel={() => {
            setViewModalVisible(false);
          }}
          viewModalVisible={viewModalVisible}
          scene={stepFormValues}
        />
      ) : null}
      {/* 结果集 */}
      <ResultSetModal
        onCancel={() => {
          setResultSetModalVisible(false);
        }}
        resultSetModalVisible={resultSetModalVisible}
        columnList={columnList}
        datatype={datatype}
        resultSet={resultSet}
      />
      <Modal
        width={250}
        bodyStyle={{ top: 24, right: 0 }}
        closable={false}
        open={isWaitModalVisible}
        maskClosable={false}
        footer={null}
      >
        <Space>
          <LoadingOutlined />
          验证答案中，请稍后......
        </Space>
      </Modal>
    </div>
  )
}

export default AnswserByType