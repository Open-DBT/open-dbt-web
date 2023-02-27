import React, { useState } from 'react'
import { Button } from 'antd';
import { scrollToAnchor } from '@/utils/utils'
const MenuBySort = (props: any) => {
    const taskList = props.taskList
    const [taskOrder, setTaskOrder] = useState<number>(-1);
    return (
        <div className='question-create-card  card-h-menu'>
            <div className='menu-title'>
                题目
            </div>
            {
                taskList && taskList.map((item: any, index: number) => {
                    return (
                            <Button style={{marginRight: '20px', marginBottom: '20px'}} key={'button-sort' + index} onClick={() => { setTaskOrder(index); scrollToAnchor("id-sort" + index) }} className={taskOrder == index ? 'clcikAnswserClass menu-button' : 'menu-button'}>
                                {index + 1}
                            </Button>
                    )
                })
            }

        </div>
    )
}

export default MenuBySort