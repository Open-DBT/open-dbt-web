import React from 'react'
import { Modal, Button, Tooltip, message } from 'antd';
import SuperIcon from "@/pages/components/icons";
import '@/pages/common-course/question/component/preview/index.less';
import { useEffect, useState, useRef } from 'react';
import SingleChoice from '@/pages/common-course/question/component/preview/type/singleChoice';
import MultipleChoice from '@/pages/common-course/question/component/preview/type/multiple';
import Judge from '@/pages/common-course/question/component/preview/type/judge';
import ShortAnswer from '@/pages/common-course/question/component/preview/type/shortAnswer';
import Space from '@/pages/common-course/question/component/preview/type/space';
import Sql from '@/pages/common-course/question/component/preview/type/sql';
import { useParams } from 'umi'
import SingleChoiceEdit from '@/pages/common-course/question/component/type/singleChoice';
import MultipleChoiceEdit from '@/pages/common-course/question/component/type/multiple';
import JudgeEdit from '@/pages/common-course/question/component/type/judge';
import ShortAnswerEdit from '@/pages/common-course/question/component/type/shortAnswer';
import SpaceEdit from '@/pages/common-course/question/component/type/space';
import SqlEdit from '@/pages/common-course/question/component/type/sql';
import { QUESTION_BANK } from '@/common/entity/questionbank'
import { delSelectedExercises, getExerciseInfoByModel } from '@/services/teacher/task/task';
import './collect.less'
interface IRef extends React.RefObject<HTMLDivElement> {
  clickSave: () => void;
  clickFinishFlash: () => void;
  clickDel: () => void;
}
const Collect = (props: any) => {
  const [showIndex, setShowIndex] = useState<number>(-1); // 显示的组件的排列顺序对应变量
  const [initData, setInitData] = useState<QUESTION_BANK.QuestionExercise>()
  const [editBol, setEditBol] = useState<boolean>(false); // 判断是否点击编辑
  const cRef = useRef<IRef>(null); // 设置ref
  const params: QUESTION_BANK.IParams = useParams();    // 获取路由参数
  const exerciseId = Number(props.exerciseId) // 题目id
  const modelId = Number(props.modelId) // 题目id
  const publish = props.publish
  const { clickTaskQuestion } = props;
  const {
    clickDel: clickDel
  } = props;
  // 点击保存
  const clickSave = async () => {
    cRef.current?.clickSave()
    console.log('111')
  };
  // 点击取消
  const resetClick = () => {
    setEditBol(false)
  }
  /**
* 删除习题方法
* @param id 习题id
*/
  const deleteLineData = (modelId: number, exerciseId: number) => {
    Modal.confirm({
      title: '删除确认框',
      content: '确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 调用删除接口
        delSelectedExercises(modelId, exerciseId).then((res: any) => {
          if (res.success) {
            message.success('删除成功');
            clickDel()
          } else message.error(res.message);
        })
      },
    });
  }
  useEffect(() => {
    setEditBol(false)
    if (props.exerciseId) {
      // 调用保存题库接口
      setShowIndex(-1)
      getExerciseInfoByModel(exerciseId, modelId).then((res) => {
        if (res.success) {
          res.obj.modelId = modelId
          setInitData(res.obj)
          setShowIndex(res.obj.exerciseType)
        }
      })
    }
  }, [exerciseId])
  return (
    <>
      <div className='question-create-div question-selected-div'>
        <div className='collect-button'>
          {
            !editBol &&
            <Tooltip title="编辑">
              <Button type="primary" style={{ borderRadius: '5px', marginRight: '10px' }} onClick={() => setEditBol(true)}>
                <SuperIcon type="icon-bianji1" />
              </Button>
            </Tooltip>
          }
          {
            publish != 1 && 
            <Tooltip title="删除">
            <Button style={{ borderRadius: '5px', marginRight: '10px' }} onClick={() => deleteLineData(modelId, exerciseId)}>
              <SuperIcon type="icon-icon-delete" />
            </Button>
          </Tooltip>
          }
        
        </div>
        {/* 预览 */}
        {
          !editBol &&
          <div>
            {showIndex == 1 && initData && <SingleChoice ref={cRef} onInit={initData} compType="task-edit" />}
            {showIndex == 2 && initData && <MultipleChoice ref={cRef} onInit={initData} compType="task-edit" />}
            {showIndex == 3 && initData && <Judge ref={cRef} onInit={initData} compType="task-edit" />}
            {showIndex == 4 && initData && <Space ref={cRef} onInit={initData} compType="task-edit" />}
            {showIndex == 5 && initData && <ShortAnswer ref={cRef} onInit={initData} compType="task-edit" />}
            {showIndex == 6 && initData && <Sql ref={cRef} onInit={initData} compType="task-edit" />}
          </div>
        }

        {/* 编辑 */}
        {
          editBol &&
          <div>
            {showIndex == 1 && initData && <SingleChoiceEdit ref={cRef} onInit={initData} compType="task-edit" clickTaskQuestion={() => { clickTaskQuestion() }} resetClick={()=>resetClick()}/>}
            {showIndex == 2 && initData && <MultipleChoiceEdit ref={cRef} onInit={initData} compType="task-edit" clickTaskQuestion={() => { clickTaskQuestion() }} resetClick={()=>resetClick()}/>}
            {showIndex == 3 && initData && <JudgeEdit ref={cRef} onInit={initData} compType="task-edit" clickTaskQuestion={() => { clickTaskQuestion() }}  resetClick={()=>resetClick()}/>}
            {showIndex == 4 && initData && <SpaceEdit ref={cRef} onInit={initData} compType="task-edit" clickTaskQuestion={() => { clickTaskQuestion() }} resetClick={()=>resetClick()}/>}
            {showIndex == 5 && initData && <ShortAnswerEdit ref={cRef} onInit={initData} compType="task-edit" clickTaskQuestion={() => { clickTaskQuestion() }} resetClick={()=>resetClick()}/>}
            {showIndex == 6 && initData && <SqlEdit ref={cRef} onInit={initData} compType="task-edit" clickTaskQuestion={() => { clickTaskQuestion() }} resetClick={()=>resetClick()}/>}
          </div>
        }
        <div className='collect-button-bottom'>
          {/* <span>重置 </span> */}
          {/* <SuperIcon type="icon-icon-edit-3"/> */}
          {/* <SuperIcon type="icon-icon-delete-2"/> */}

        </div>
      </div>
    </>

  )
}

export default Collect