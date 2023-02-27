import React, { useState } from 'react'
import { Button, Avatar } from 'antd';
import * as APP from '@/app';
import { scrollToAnchor } from '@/utils/utils'
const MenuBySort = (props: any) => {
    const taskList = props.taskList
    const currentStu = props.currentStu
    const [taskOrder, setTaskOrder] = useState<number>(-1);

    return (
        <>
            <div className='question-create-card' style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar size="large" src={`${APP.request.prefix}${currentStu!.avatar}`} />
                    <div style={{ marginLeft: '20px' }}>
                        <div style={{ fontWeight: 'bold' }}>
                            {currentStu!.studentName}
                        </div>
                        <div>
                            {currentStu!.code}
                        </div>
                        <div>
                            {currentStu!.className}
                        </div>
                    </div>

                </div>
            </div>
            <div className='question-create-card  card-h-menu'>
                <div className='menu-title'>
                    题目
                </div>
                {
                    taskList && taskList.map((item: any, index: number) => {
                        return (
                            <Button style={{ marginRight: '20px', marginBottom: '20px' }} key={'button-sort' + index} onClick={() => { setTaskOrder(index); scrollToAnchor("id-sort" + index) }} className={taskOrder == index ? 'clcikAnswserClass menu-button' : 'menu-button'}>
                                {index + 1}
                            </Button>
                        )
                    })
                }

            </div>
        </>
    )
}

export default MenuBySort