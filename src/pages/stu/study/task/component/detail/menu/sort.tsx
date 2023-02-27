import React, { useState } from 'react'
import { Button } from 'antd';
import { TASK } from '@/common/entity/task';
import { scrollToAnchor } from '@/utils/utils'
interface IProps {
    taskList: TASK.ReviewSortExercises[];  // 保存
}
const MenuBySort = (props: IProps) => {
    const taskList = props.taskList
    const [taskOrder, setTaskOrder] = useState<number>(-1);
    return (
        <div className='question-create-card'>
            <div className='menu-title'>
                题目
            </div>
            {
                taskList && taskList.map((item: TASK.ReviewSortExercises, index: number) => {
                    return (
                        <Button key={'button-sort' + index} onClick={() => { setTaskOrder(index); scrollToAnchor("id-sort" + index) }} className={taskOrder == index ? 'clcikAnswserClass menu-button menu-margin' : 'menu-button menu-margin'}>
                            {index + 1}
                        </Button>
                    )
                })
            }

        </div>
    )
}

export default MenuBySort