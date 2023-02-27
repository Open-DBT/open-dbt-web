import React from 'react'
import Header from './header'
import './index.less';
import { useState, useRef } from 'react';
import Judge from '../type/judge';
import ShortAnswer from '../type/shortAnswer';
import Space from '../type/space';
import Sql from '../type/sql';
import SingleChoice from '../type/singleChoice';
import MultipleChoice from '../type/multiple';
import { Button } from 'antd';
import { QUESTION_BANK } from '@/common/entity/questionbank'
import CODE_CONSTANT from '@/common/code'
interface IRef extends React.RefObject<HTMLDivElement> {
  clickSave: () => void;
  continueAnswer: () => void;
}
const CreateQuestion = (props: any) => {
  const [showIndex, setShowIndex] = useState<number>(1); // 显示的组件的排列顺序对应变量
  const cRef = useRef<IRef>(null);
  const [initData, setInitData] = useState<QUESTION_BANK.QuestionExercise | null>(null)
  /**
   * @description 选择按钮回调, 进行相应组件显示
   * @param number 进行判断的类型值
  */
  const selectBUttonStatus = (num: number) => {
    setShowIndex(num)
  }
  /**
   * 点击保存按钮
   */
  const clickSave = () => {
    // 调用ref组件内部方法
    cRef.current && cRef.current.clickSave()
  };
  /**
   * 点击继续答题，刷新题目出题页面
   */
  const continueAnswer = () => {
    // 调用ref组件内部方法
    cRef.current && cRef.current.continueAnswer()
  }
  return (
    <>
      <Header clickSave={() => clickSave()} continueAnswer={() => continueAnswer()} />
      <div className='question-create-div'>
        <div className='content'>
          <div className='question-create-card'>
            <span className='mb-right-20'>题型</span>
            {
              CODE_CONSTANT.questionType.length != 0 && CODE_CONSTANT.questionType.map((item, index) => {
                return <Button key={index + 'Bt'} className={showIndex == index + 1 ? 'answserClass mb-right-10' : 'mb-right-10'} onClick={() => { selectBUttonStatus(index + 1) }}>{item}</Button>
              })
            }
          </div>
          {showIndex == 1 && <SingleChoice ref={cRef} onInit={initData} />}
          {showIndex == 2 && <MultipleChoice ref={cRef} onInit={initData} />}
          {showIndex == 3 && <Judge ref={cRef} onInit={initData} />}
          {showIndex == 4 && <Space ref={cRef} onInit={initData} />}
          {showIndex == 5 && <ShortAnswer ref={cRef} onInit={initData} />}
          {showIndex == 6 && <Sql ref={cRef} onInit={initData} />}
        </div>
      </div>
    </>

  )
}

export default CreateQuestion