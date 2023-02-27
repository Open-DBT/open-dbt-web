import React, { useState } from 'react'
import { Button } from 'antd';
import { TASK } from '@/common/entity/task';
import { scrollToAnchor } from '@/utils/utils'
interface IProps {
    taskList: TASK.ReviewClassifyExercises[]; 
}
const MenuByType = (props: IProps) => {
  const taskList = props.taskList
  const [taskOrder, setTaskOrder] = useState<number>(-1);
  const [typeSortOrder, setTypeSortOrder] = useState<number>(-1);
  
  return (
    <div className='question-create-card card-h-menu'>

      {
        taskList && taskList.map((item: TASK.ReviewClassifyExercises, index: number) => {
          return (
            <div key={"menu-type-list" + index}>
              <div>
                <span className='card-list-title menu-title'>
                  {item.typeName}
                </span>
                <span className='card-list-desc menu-desc'>（{item.score}分）</span>
              </div>
              {
                item.collect && item.collect.map((cItem: TASK.ReviewCollectData, cIndex: number) => {
                  return (
                      <Button key={'button-sort' + cIndex} onClick={() => { setTaskOrder(index); setTypeSortOrder(cIndex); scrollToAnchor("id-type" + index + '-' + cIndex) }} className={taskOrder == index && typeSortOrder == cIndex ? 'clcikAnswserClass menu-button' : 'menu-button'}>
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
  )
}

export default MenuByType