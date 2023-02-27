import React, { useState } from 'react'
import { Button, Dropdown, Space, Menu } from 'antd';
import SuperIcon from "@/pages/components/icons";
import { QUESTION_BANK } from '@/common/entity/questionbank'

interface IProps {
  editSumbit: (value: any) => void;
  editReset: (value: any) => void;
  editHalf: (value: any) => void;
  current: any;
  data: any;
  taskList: any;
  changeAllScore: any;
  unselectedGiven: any;
};
const Multiple = (props: IProps) => {
  const {
    data,
    current,
    unselectedGiven,
    editSumbit: editSumbit,
    editReset: editReset,
    editHalf: editHalf
} = props;
  const [clickMore, setClickMore] = useState<any>(); //点击更多存储当前行数据
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a onClick={() => { editSumbit(clickMore) }}>
              <SuperIcon type={'icon-icon-duihao31'} className='answser-submit-button' style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px', color: '#23dba7' }} />
              正确
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a onClick={() => { editReset(clickMore) }}>
              <SuperIcon type={'icon-icon-cuowu21'} className='answser-cuowu-button' style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px', color: 'red' }} />
              错误
            </a>
          ),
        },
      ]}
    />
  );
  const menuTwo = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a onClick={() => { editSumbit(clickMore) }}>
              <SuperIcon type={'icon-icon-duihao31'} className='answser-submit-button' style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px', color: '#23dba7' }} />
              正确
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a onClick={() => { editReset(clickMore) }}>
              <SuperIcon type={'icon-icon-cuowu21'} className='answser-cuowu-button' style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px', color: 'red' }} />
              错误
            </a>
          ),
        },
        {
          key: '3',
          label: (
              <a onClick={() => { editHalf(clickMore) }}>
                  <SuperIcon type={'icon-half-correct'} className='answser-cuowu-button' style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px', color: 'red' }} />
                  半对
              </a>
          ),
      },
      ]}
    />
  );
  return (
    <div>
      {/* 题干 */}
      {
        data.exercise && data.exercise.exerciseInfos.map((sItem: QUESTION_BANK.QuestionExerciseOption, sIndex: number) => {
          return <div key={'multiple' + sIndex} style={{ display: 'flex' }}>
            <Button className={current.exerciseResult?.split(',').includes(sItem.prefix) ? 'clcikAnswserClass' : ''}>
              {sItem.prefix}
            </Button>
            <div className='html-width-class' dangerouslySetInnerHTML={{ __html: sItem?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
          </div>
        })
      }
      {/* 正确答案 */}
      <div className={data.isCorrect == 1 ? 'answser-submit answser-submit-line' : 'answser-submit answser-cuowu-line'}>
        <div>
          <Dropdown overlay={unselectedGiven==1?menuTwo:menu} trigger={['click']}>
            <a onClick={e => { e.preventDefault(); setClickMore(data) }}>
              <Space>
              <SuperIcon type={data.isCorrect == 1 ? 'icon-icon-duihao31' :(data.isCorrect == 2 ?'icon-icon-cuowu21':'icon-half-correct') } className={data.isCorrect == 1 ? 'answser-submit-button' : 'answser-cuowu-button'} style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px' }} />
              </Space>
            </a>
          </Dropdown>

          <span style={{ fontWeight: 'bold' }}>
            正确答案: {data.exerciseType == 3 ? (data.exercise.standardAnswser == 1 ? 'A' : 'B') : data.exercise.standardAnswser}
          </span>

        </div>
        <div>
          <span style={{ fontWeight: 'bold' }}>{data.exerciseScore} </span>
          <span>分</span>
        </div>
      </div>
      {/* 答案解析 */}
      <div className='header'>
        <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>答案解析：</span>
      </div>
      <div className='answser-content'>
        <div className='html-width-class' dangerouslySetInnerHTML={{ __html: data.exercise.exerciseAnalysis != null ? data.exercise.exerciseAnalysis : '无' }}></div>
      </div>
    </div>
  )
}

export default Multiple