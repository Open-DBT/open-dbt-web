import Header from './header'
import './index.less';
import { useEffect, useState, useRef } from 'react';
import Judge from '../type/judge';
import ShortAnswer from '../type/shortAnswer';
import Space from '../type/space';
import Sql from '../type/sql';
import SingleChoice from '../type/singleChoice';
import { useParams } from 'umi'
import MultipleChoice from '../type/multiple';
import { getExerciseInfo } from '@/services/teacher/course/question-create';
import { QUESTION_BANK } from '@/common/entity/questionbank'
interface IRef extends React.RefObject<HTMLDivElement> {
  clickSave: () => void;
}
interface IParams {
  courseId: string;
  exerciseId: string;
  parentId: string;
}
const EditQuestion = (props: any) => {
  const [showIndex, setShowIndex] = useState<number>(1); // 显示的组件的排列顺序对应变量
  const [initData, setInitData] = useState<QUESTION_BANK.QuestionExercise>()
  const cRef = useRef<IRef>(null);
  const params: IParams = useParams();    // 获取路由参数
  const exerciseId = params.exerciseId
  useEffect(() => {
    if (params && exerciseId) {
      // 初始化給编辑题目表单赋值
      getExerciseInfo(Number(exerciseId)).then((res) => {
        if (res.success) {
          setInitData(res.obj)
          setShowIndex(res.obj.exerciseType)
        }
      })
    }
  }, [])

  /**
   * 获取习题详情内容
   */
  const clickSave = () => {
    cRef.current && cRef.current.clickSave()
  };
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

export default EditQuestion