import React, { useState, useEffect } from 'react'
import './common.less';
import './judge.less';
import { forwardRef, useImperativeHandle } from 'react'
import { Button, Divider } from 'antd';
import { history, useParams } from 'umi';
import { QUESTION_BANK } from '@/common/entity/questionbank'
interface IProps {
    onInit: QUESTION_BANK.QuestionExercise;
    compType?: string;
}
const Judge = forwardRef((props: IProps, ref) => {
    const { onInit, compType } = props;
    // 将父组件的方法暴露出来
    useImperativeHandle(ref, () => ({
        clickSave: clickEdit,
    }))
    const [bolAnswser, setBolAnswser] = useState<number>(0) // 判断题正确答案变量: 1：正确 2：错误
    const [initialValues, setInitialValues] = useState<QUESTION_BANK.QuestionExercise>(onInit)   // 初始化数据
    const params: QUESTION_BANK.IParams = useParams();    // 获取路由参数
    const courseId = Number(params.courseId);
    const exerciseId = Number(params.exerciseId);
    const parentId = Number(initialValues?.parentId);
    useEffect(() => {
        // 初始化表单
        setBolAnswser(() => onInit?.standardAnswser ? Number(onInit?.standardAnswser) : 0)
    }, [])

    const clickEdit = () => {
        history.push(`/question-bank/edit/courseId/exerciseId/parentId/${courseId}/${exerciseId}/${parentId}`);
    }
    return (
        <>
            <div className='question-content-card'>
                <div className='title'>
                    <div className='title-type'>
                        {
                             compType != 'task-edit' && ' （判断题）'
                        }
                    </div>
                    <div className='title-name'>
                        {initialValues?.exerciseName}
                        {
                             compType == 'task-edit' && <span>（判断题，{onInit?.exerciseScore}分）</span>
                        }
                    </div>
                </div>

                <div className='card-content'>
                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: initialValues?.stem }}></div>
                    <div className='card-select'>
                        <Button shape="circle" className={bolAnswser == 1 ? 'answserClass' : ''}>
                            A
                        </Button>
                        <span style={{ marginLeft: '20px' }}>正确</span>
                    </div>
                    <div className='card-select'>
                        <Button shape="circle" className={bolAnswser == 2 ? 'answserClass' : ''}>
                            B
                        </Button>
                        <span style={{ marginLeft: '20px' }}>错误</span>
                    </div>
                    <div className='card-answser'>
                        <span>答案：</span><span>{initialValues?.standardAnswser == '1' ? 'A' : 'B'}</span>
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

export default Judge