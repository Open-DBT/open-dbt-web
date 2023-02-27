import React from 'react'
import Header from './header'
import './index.less';
import { useEffect, useState, useRef } from 'react';
import Judge from './type/judge';
import ShortAnswer from './type/shortAnswer';
import Space from './type/space';
import Sql from './type/sql';
import { useParams } from 'umi'
import SingleChoice from './type/singleChoice';
import MultipleChoice from './type/multiple';
import { getExerciseInfo } from '@/services/teacher/course/question-create';
import { QUESTION_BANK } from '@/common/entity/questionbank'
interface IRef extends React.RefObject<HTMLDivElement> {
  clickSave: () => void;
}
const PreviewQuestion = (props: any) => {
  const [showIndex, setShowIndex] = useState<number>(4); // 显示的组件的排列顺序对应变量
  const [initData, setInitData] = useState<QUESTION_BANK.QuestionExercise>()
  const cRef = useRef<IRef>(null); // 设置ref
  const params: QUESTION_BANK.IParams = useParams();    // 获取路由参数
  const exerciseId = Number(params.exerciseId) // 题目id
  // 点击保存
  const clickSave = () => {
    cRef.current && cRef.current.clickSave()
  };
  useEffect(() => {
    if (exerciseId) {
      // 调用保存题库接口
      getExerciseInfo(exerciseId).then((res) => {
        if (res.success) {
          setInitData(res.obj)
          setShowIndex(res.obj.exerciseType)
        }
      })
    }
  }, [])
  return (
    <>
      <Header clickSave={() => { clickSave() }} />
      <div className='question-create-div'>
        <div className='content'>
          {showIndex == 1 && initData && <SingleChoice ref={cRef} onInit={initData} />}
          {showIndex == 2 && initData && <MultipleChoice ref={cRef} onInit={initData} />}
          {showIndex == 4 && initData && <Space ref={cRef} onInit={initData} />}
          {showIndex == 3 && initData && <Judge ref={cRef} onInit={initData} />}
          {showIndex == 5 && initData && <ShortAnswer ref={cRef} onInit={initData} />}
          {showIndex == 6 && initData && <Sql ref={cRef} onInit={initData} />}
        </div>
      </div>
    </>

  )
}

export default PreviewQuestion