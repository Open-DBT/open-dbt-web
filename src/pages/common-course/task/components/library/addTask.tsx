import React from 'react'
import Header from './component/header'
import './addTask.less';
import { useEffect, useState } from 'react';
import { Button, Input, Radio, Tooltip } from 'antd';
import { history, useParams, useLocation } from 'umi';
import { message } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { TASK } from '@/common/entity/task';
import { getExercisesByModelId, completedSelectedExercises } from '@/services/teacher/task/task';
import Collect from './component/collect'
import { QUESTION_BANK } from '@/common/entity/questionbank'
interface IProps {
  courseId: number;
}
// 获取当前时间-YYYYMMddHHmmss
const getCurrentTime = () => {
  let obj = new Date()
  var str = "" + obj.getFullYear();
  var mm = obj.getMonth() + 1
  if (obj.getMonth() > 9) {
    str += mm;
  }
  else {
    str += "0" + mm;
  }
  if (obj.getDate() > 9) {
    str += obj.getDate();
  }
  else {
    str += "0" + obj.getDate();
  }
  if (obj.getHours() > 9) {
    str += obj.getHours();
  }
  else {
    str += "0" + obj.getHours();
  }
  if (obj.getMinutes() > 9) {
    str += obj.getMinutes();
  }
  else {
    str += "0" + obj.getMinutes();
  }
  if (obj.getSeconds() > 9) {
    str += obj.getSeconds();
  }
  else {
    str += "0" + obj.getSeconds();
  }
  return str;
}
const addTask = (props: IProps) => {
  const params: any = useParams();
  const location: any = useLocation();
  const courseId = params.courseId; // 课程id
  const parentId = params.parentId; // 父级id
  const modelId = location.state?.modelId // 模板id
  const publish = location.state?.publish // 是否发布
  const [taskName, setTaskName] = useState<string>('新建作业' + (getCurrentTime()));  // 新建作业默认名称
  const [questionType, setQuestionType] = useState<number>(1);  // 题型设置变量
  const [checkId, setCheckId] = useState<number>(-1); // 显示的组件的排列顺序对应的习题id
  const [exercises, setExercises] = useState<TASK.TaskClassifyParam[] | QUESTION_BANK.QuestionExercise[]>([]);
  const [allStore, setAllStore] = useState<string>(); // 总分
  const [allNum, setAllNum] = useState<number>(); // 题目总量
  const [questionIndex, setQuestionIndex] = useState<string>('00'); // 进行题目位置定位
  useEffect(() => {
    if (modelId) {
      // 查询数据
      fetchFinishData()
      // 默认选中第一个
      clickLine(0, 0)
    }
  }, [])
  // 查询作业详情
  const fetchFinishData = () => {
    getExercisesByModelId(modelId, 0).then((res) => {
      if (res.success) {
        setTaskName(res.obj.modelName)
        setQuestionType(res.obj.classify)
        setAllStore(res.obj.tgp)
        setAllNum(res.obj.totalExercise)
        if (res.obj.classifyExercises && res.obj.classifyExercises.length != 0) {
          setQuestionType(res.obj.classify)
          setExercises(res.obj.classifyExercises)
          // 有分类且为第一个题目
          if (res.obj.classifyExercises[0].collect[0] && questionIndex == '00') {
            setCheckId(res.obj.classifyExercises[0].collect[0].id)
          }
        } else {
          setQuestionType(res.obj.classify)
          setExercises(res.obj.exercises)
          if (res.obj.exercises && questionIndex == '00')
            setCheckId(res.obj.exercises[0].id)
        }
      }
    })
  }
  const onChangeTypeSet = (e: RadioChangeEvent) => {
    if (modelId) {
      // 有模板id，查询
      saveExerciseInfo(e.target.value)
    } else {
      // 没有，只改变radio值
      setQuestionType(e.target.value);
    }

  };
  // 点击完成按钮
  const clickSave = () => {
    let param = {
      authType: 2,
      modelName: taskName,
      classify: questionType,
      courseId: courseId,
      modelId: modelId ? modelId : '',
      parentId: parentId
    }
    completedSelectedExercises(param).then((res) => {
      if (res.success) {
        message.success(res.message)
        history.push(`/task-bank/list/${courseId}`)
      } else {
        message.error(res.message)
      }
    })
  };
  /**
   * 从题库中选择题目
   */
  const selectQuestion = () => {
    if (taskName == '') {
      message.warning('请填写作业名称');
    } else
      history.push({ pathname: `/task-bank/addQuestion/courseId/parentId/${courseId}/${parentId}`, state: { modelId: modelId, taskName: taskName, questionType: questionType } })
  }
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTaskName(e.target.value.trim())

  };
  /**
   * 点击行，赋予判断值
   * @param tIndex 类型排序 
   * @param qIndex 类型所在题目排序 
   */
  const clickLine = (tIndex: number, qIndex: number) => {
    let str = tIndex.toString() + qIndex.toString()
    console.log("clickLinestr:", str, 'questionIndex:', questionIndex, 'checkId', checkId)
    if (str != questionIndex) {
      // setCheckId(-1)
      if (exercises && questionType == 1)
        setCheckId(exercises[0].collect[0].id)
      else setCheckId(exercises[0].id)
      console.log('-1-1')
      setQuestionIndex(str)
    } else {
      setQuestionIndex(str)
    }
  }
  // 点击获取当前checkId
  const clickTaskQuestion = async () => {
    let currentId = checkId
    await fetchFinishData()
    setCheckId(-1)
    if (exercises && questionType == 1)
      setCheckId(exercises[questionIndex.charAt(0)].collect[questionIndex.charAt(1)].id)
    else if (exercises && questionType == 2) setCheckId(currentId)
  }
  // 查询左侧目录及数据
  const saveExerciseInfo = (val: number) => {
    let param = {
      authType: 2,
      modelName: taskName,
      classify: val,
      courseId: courseId,
      modelId: modelId ? modelId : '',
      parentId: parentId
    }
    completedSelectedExercises(param).then((res) => {
      if (res.success) {
        fetchFinishData()
        clickLine(0, 0)
      }
    })
  }
  // 删除习题后查询列表数据
  const clickDel = () => {
    fetchFinishData();
    clickLine(0, 0)
  }
  return (
    <>
      {
        (publish == 0 || publish == 1) ? <Header clickSave={() => { clickSave() }} type='edit' /> :
          <Header clickSave={() => { clickSave() }} />
      }

      <div className='question-create-div'>
        <div className='content'>
          <div className='question-create-card'>
            {
              publish == 1 ?
                <div>{taskName}</div> :
                <>
                  <Input placeholder="请输入作业名称" style={{ width: '40%' }} value={taskName} onChange={onChangeName} />
                  <div style={{ marginTop: '20px' }}>
                    <span>题型设置： </span>
                    <Radio.Group onChange={onChangeTypeSet} value={questionType}>
                      <Radio value={1}>按题型归类</Radio>
                      <Radio value={2}>不按题型归类</Radio>
                    </Radio.Group>
                  </div>
                </>
            }

          </div>
          <div className='card-add-task-container'>
            <div className='question-create-card left-menu'>
              <div>
                <div className='left-div-allNum'><span>题量{allNum}，总分{allStore}</span></div>
                {
                  exercises?.map((item: any, index: number) => {
                    return item.collect ? <div key={index} className="collect-list-div">
                      <span className='left-div-title'>{item.typeName}</span><span>（共{item.exerciseCount}题，{item.score}分）</span>
                      {
                        item.collect.map((cItem: any, cIndex: number) => {
                          return <div key={cIndex} className={questionIndex == index.toString() + cIndex.toString() ? 'collect-div click-line left-div-text' : 'collect-div left-div-text'} onClick={() => { clickLine(index, cIndex); setCheckId(cItem.id) }}>
                            <span className='collect-div-span'>{cIndex + 1}. </span><Tooltip title={cItem.exerciseName}><span>{cItem.exerciseName}</span></Tooltip>
                          </div>

                        })
                      }
                    </div> :
                      <div className="collect-list-div">
                        <div key={'sort' + index} className={questionIndex == index.toString() + index.toString() ? 'collect-div click-line' : 'collect-div'} onClick={() => { clickLine(index, index); setCheckId(item.id) }}>
                          <span className='collect-div-span'>{index + 1}. </span><Tooltip title={item.exerciseName}><span>{item.exerciseName}</span></Tooltip>
                        </div>
                      </div>
                  })
                }
              </div>
            </div>
            <div className='right-context'>
              <div className='question-create-card select-button-right'>
                {
                  publish != 1 && <Button className='selected-question-button' onClick={selectQuestion}>从题库中选题</Button>
                }
              </div>
              <div className='question-task-card'>
                {/* 判断有无习题 */}
                {
                  checkId != -1? <Collect publish={publish} exerciseId={checkId} modelId={modelId} clickTaskQuestion={() => { clickTaskQuestion() }} clickDel={() => clickDel()}></Collect>:
                  <div className='question-create-card selected-question-text'>
                    请从题库中选择题目
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default addTask