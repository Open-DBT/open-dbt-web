import React, { useState, useEffect } from 'react'
import { Button } from 'antd';
import { QUESTION_BANK } from '@/common/entity/questionbank'
import './selectContent.less';
type IProps = {
    type: number;     
    content: QUESTION_BANK.QuestionExerciseOption [];  
    answser: string;  
}
const selectContent = (props: IProps) => {
    const type = props.type // 题型
    const content = props.content   // 选项
    const bolAnswser = props.answser    // 答案
    const [prefixList, setPrefixList] = useState<string[]>([])
    useEffect(() => {
        // 初始化表单
        if (type == 2 && bolAnswser) {
            //这里有段string[]转number的语法，有点坑
            const _str = bolAnswser.split(',');
            // const _num = _str.map((element) => parseInt(element));
            setPrefixList(_str)
        }
    }, [])
    return (
        <div>
            {/* 单选 */}
            {
                type == 1 && <>
                    <div className='card-select'>
                        {
                            content && content.map((item: QUESTION_BANK.QuestionExerciseOption, index: number) => {
                                return <div key={'multiple' + index} style={{ display: 'flex' }}>
                                    <Button shape="circle" className={bolAnswser == item.prefix ? 'answserClass' : ''}>
                                        {item.prefix}
                                    </Button>
                                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
                                </div>
                            })
                        }
                    </div>
                </>
            }
            {/* 多选 */}
            {
                type == 2 && <>
                    <div className='card-select'>
                        {
                            content && content.map((item: QUESTION_BANK.QuestionExerciseOption, index: number) => {
                                return <div key={'multiple' + index} style={{ display: 'flex' }}>
                                    <Button className={prefixList.includes(item.prefix) ? 'answserClass' : ''}>
                                        {item.prefix}
                                    </Button>
                                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
                                </div>
                            })
                        }
                    </div>
                </>
            }
            {/* 判断 */}
            {
                type == 3 && <>
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
                </>
            }
        </div>
    )
}
export default selectContent