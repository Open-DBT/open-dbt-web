import React, { useState, useEffect } from 'react'
import './common.less';
import './multiple.less';
import { forwardRef, useImperativeHandle } from 'react'
import { Button, Divider } from 'antd';
import { history, useParams } from 'umi';
import { QUESTION_BANK } from '@/common/entity/questionbank'
interface IProps {
    onInit: QUESTION_BANK.QuestionExercise;
    compType?: string;
}
const SingleChoice = forwardRef((props: IProps, ref) => {
    const { onInit, compType } = props;
    // 将父组件的方法暴露出来
    useImperativeHandle(ref, () => ({
        clickSave: clickEdit,
    }))
    const params: QUESTION_BANK.IParams = useParams();    // 获取路由参数
    const [initialValues, setInitialValues] = useState<QUESTION_BANK.QuestionExercise>(onInit)   // 初始化数据
    const courseId = Number(params.courseId);
    const exerciseId = Number(params.exerciseId);
    const parentId = Number(initialValues?.parentId);
    const [prefixList, setPrefixList] = useState<string[]>([])
    useEffect(() => {
        // 初始化表单
        if (initialValues && initialValues.standardAnswser) {
            //这里有段string[]转number的语法，有点坑
            const Str = initialValues.standardAnswser.split(',');
            // const Num = Str.map((element) => parseInt(element));
            setPrefixList(Str)
        }
    }, [])
    const clickEdit = () => {
        history.push(`/question-bank/edit/courseId/exerciseId/parentId/${courseId}/${exerciseId}/${parentId}`);
    }
    return (
        <>
            <div className='question-content-card'>
                <div className='title' style={{display: 'flex'}}>
                    <div className='title-type'>
                        {
                             compType != 'task-edit' && '（多选题）'
                        }
                    </div>
                    <div className='title-name'>
                        {initialValues?.exerciseName}
                        {
                                compType == 'task-edit' && <span>（多选题，{onInit?.exerciseScore}分）</span>
                        }
                    </div>
                    
                </div>

                <div className='card-content'>
                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: initialValues?.stem }}></div>
                    <div className='card-select'>
                    {
                                initialValues && initialValues.exerciseInfos.map((item: QUESTION_BANK.QuestionExerciseOption, index: number) => {
                                    return <div key={'multiple'+index} style={{display: 'flex'}}>
                                                 <Button className={prefixList.includes(item.prefix) ? 'answserClass' : ''}>
                                                    {item.prefix}
                                                </Button>
                                                <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
                                            </div>
                                })
                    }
                    </div>
                    <div className='card-answser'>
                        <span>答案：</span><span>{prefixList.length!=0?prefixList.join(','):''}</span>
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

export default SingleChoice