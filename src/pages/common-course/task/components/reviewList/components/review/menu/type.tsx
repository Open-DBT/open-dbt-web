import React, { useState } from 'react'
import { Button, Avatar } from 'antd';
import * as APP from '@/app';
import { scrollToAnchor } from '@/utils/utils'
const MenuByType = (props: any) => {
  const taskList = props.taskList
  const currentStu = props.currentStu
  const [taskOrder, setTaskOrder] = useState<number>(-1);
  const [typeSortOrder, setTypeSortOrder] = useState<number>(-1);

  return (
    <>
      <div className='question-create-card' style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="large" src={`${APP.request.prefix}${currentStu!.avatar}`} />
          <div style={{ marginLeft: '20px' }}>
            <div style={{ fontWeight: 'bold' }}>
              {currentStu!.userName}
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
      <div className='question-create-card card-h-menu'>

        {
          taskList && taskList.map((item: any, index: number) => {
            return (
              <div key={"menu-type-list" + index}>
                <div>
                  <span className='card-list-title menu-title'>
                    {item.typeName}
                  </span>
                  <span className='card-list-desc menu-desc'>（{item.score}分）</span>
                </div>
                {
                  item.collect && item.collect.map((cItem: any, cIndex: number) => {
                    return (
                      <Button style={{ marginRight: '20px', marginBottom: '20px' }} key={'button-sort' + cIndex} onClick={() => { setTaskOrder(index); setTypeSortOrder(cIndex); scrollToAnchor("id-type" + index + '-' + cIndex) }} className={taskOrder == index && typeSortOrder == cIndex ? 'clcikAnswserClass menu-button' : 'menu-button'}>
                        {cIndex + 1}
                      </Button>
                    )
                  })
                }
              </div>
            )
          })
        }

      </div>
    </>
  )
}

export default MenuByType