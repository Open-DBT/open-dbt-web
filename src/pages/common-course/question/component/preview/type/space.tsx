import React, { useState, useEffect } from 'react'
import './common.less';
import './space.less';
import { forwardRef, useImperativeHandle } from 'react'
import { Divider } from 'antd';
import { history, useParams } from 'umi';
import { QUESTION_BANK } from '@/common/entity/questionbank'
interface IProps {
    onInit: QUESTION_BANK.QuestionExercise;
    compType?: string;
}
const Space = forwardRef((props: IProps, ref) => {
    const { onInit, compType } = props;
    // 将父组件的方法暴露出来
    useImperativeHandle(ref, () => ({
        clickSave: clickEdit,
    }))
    const [initialValues, setInitialValues] = useState<QUESTION_BANK.QuestionExercise>(onInit)   // 初始化数据
    const params: QUESTION_BANK.IParams = useParams();    // 获取路由参数
    const courseId = Number(params.courseId);
    const exerciseId = Number(params.exerciseId);
    const parentId = Number(initialValues?.parentId);
    const clickEdit = () => {
        history.push(`/question-bank/edit/courseId/exerciseId/parentId/${courseId}/${exerciseId}/${parentId}`);
    }
    return (
        <>
            <div className='question-content-card'>
                <div className='title'>
                    <div className='title-type'>
                        {
                             compType != 'task-edit' && ' （填空题）'
                        }
                    </div>
                    <div className='title-name'>
                        {initialValues?.exerciseName}
                        {
                             compType == 'task-edit' && <span>（填空题，{onInit?.exerciseScore}分）</span>
                        }
                    </div>
                </div>

                <div className='card-content'>
                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: initialValues?.stem }}></div>
                    <div className='card-answser'>
                        <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>答案：</div>
                        <div>
                            {
                                initialValues && initialValues.exerciseInfos.map((item:  QUESTION_BANK.QuestionExerciseOption, index: number) => {
                                    return <div className='space-answser-line'>
                                        <span>空格{index + 1}：</span>
                                        <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item?.content }} style={{ fontWeight: 'normal' }}></div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <div className='answser-analys'>
                            <div className='analys-label' style={{ whiteSpace: 'nowrap' }}>
                                答案解析：
                            </div>
                            <div className='html-width-class' dangerouslySetInnerHTML={{ __html: initialValues?.exerciseAnalysis }}></div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', marginRight: '20px' }}>
                        <span style={{ fontWeight: 'bold' }}>难易程度：</span><span>{initialValues?.exerciseLevel == 1 ? '简单' : (initialValues?.exerciseLevel == 2 ? '一般' : '困难')}</span>
                    </div>
                </div>
            </div>
        </>
    )
})

export default Space