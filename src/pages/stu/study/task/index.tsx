import React, { useState, useEffect } from 'react'
import { Radio, Tooltip, Button } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { getHomeWrokByStudent } from '@/services/student/task/task';
import { TASK } from '@/common/entity/task';
import SuperIcon from "@/pages/components/icons";
import { useModel } from 'umi';
import './index.less'
type IProp = {
    courseId: number;
    clazzId: number;
};
const taskStuIndex = (props: IProp) => {
    const courseId = props.courseId // 课程id
    const clazzId = props.clazzId   // 班级id
    const [status, setStatus] = useState<number>(0);//单选框-作业筛选
    const [taskList, setTaskList] = useState<TASK.TaskDataByStu[]>([]);    // 作业列表数据
    const { initialState } = useModel('@@initialState');
    const { currentUser } = initialState || {}; // 获取登录用户信息

    useEffect(() => {
        // 关闭新开页面后刷新列表数据
        window.onstorage = function (e) {
            localStorage.removeItem("refresh-task")
            setStatus(0)
            currentUser && fetchData()
        };
    }, [])
    // 状态改变，刷新数据
    useEffect(() => {
        currentUser && fetchData()
    }, [status]);
    // 列表查询
    const fetchData = () => {
        let param: TASK.TaskListParamByStu = {
            classId: clazzId,
            courseId: courseId,
            studentId: currentUser ? currentUser.userId : ''
        }
        if (status != 0) param.homeworkStatus = status
        getHomeWrokByStudent(param).then((res) => {
            if (res.success) {
                setTaskList(res.obj)
            } else {
                console.log('失败')
            }
        })
    }
    /**
 * 单选框切换
 * @param e 
 */
    const onChange = (e: RadioChangeEvent) => {
        setStatus(e.target.value);
    };
    /**
     * 进行作答,页面跳转
     */
    const clickAnswser = (item: TASK.TaskDataByStu, type: number) => {
        let homeworkId = item.homeworkId
        // 达到剩余时间
        if (item.intervalTime == '0小时') {
            window.open(`/task-stu/detail/studentId/homeworkId/${currentUser?.userId}/${homeworkId}`)
        } else if (item.viewTime == 2 && item.homeworkStatus != 2) {  // 已提交且为提交后查看答案
            window.open(`/task-stu/detail/studentId/homeworkId/${currentUser?.userId}/${homeworkId}`)
        } else if (item.checkStatus == 1) {    // 已批阅
            window.open(`/task-stu/detail/studentId/homeworkId/${currentUser?.userId}/${homeworkId}`)
        } else if (item.allowAfter == 2) {
            window.open(`/task-stu/detail/studentId/homeworkId/${currentUser?.userId}/${homeworkId}`)
        } else {
            window.open(`/task-stu/answser/studentId/homeworkId/${currentUser?.userId}/${homeworkId}`)
        }

    }
    return (
        <>
            <div className='task-stu-title'>作业</div>
            <div>
                <span>筛选：</span>
                <Radio.Group onChange={onChange} value={status}>
                    <Radio value={0}>全部</Radio>
                    <Radio value={1}>已提交</Radio>
                    <Radio value={2}>未提交</Radio>
                    <Radio value={3}>已打回</Radio>
                </Radio.Group>
            </div>
            <div className="task-list">
                {
                    taskList && taskList.map((item, index) => {
                        return (
                            <div className='task-card' key={"task-" + index}>
                                <div className='task-content'>
                                    <div className="title-3">
                                        {
                                            item.homeworkName.length >= 20
                                                ? <Tooltip title={item.homeworkName}>{item.homeworkName.substring(0, 19)}...</Tooltip>
                                                : item.homeworkName
                                        }
                                    </div>
                                    {
                                        item.homeworkStatus == 1 ? <Button type="primary" className="button" onClick={() => clickAnswser(item, 1)}>已提交</Button> :
                                            (item.homeworkStatus == 2 ? <Button onClick={() => clickAnswser(item, 2)} className="button" style={{ color: '#000', background: '#FDDF66' }}>未提交</Button> :
                                                <Button type="primary" danger className="button" onClick={() => clickAnswser(item, 2)}>打回</Button>)
                                    }
                                    <div className='content-flex'>
                                        <div className='content-left'>
                                            {
                                                item.homeworkStatus == 1 ?
                                                    ''
                                                    :
                                                    <>
                                                        <span>剩余：{item.intervalTime}</span>
                                                    </>
                                            }
                                        </div>
                                        <div className='content-right' style={{ color: item.homeworkStatus == 1 ? '#00CE9B' : '' }}>
                                            {
                                                item.homeworkStatus == 1 ? <SuperIcon type="icon-icon-duihao31" className='super-icon-font' /> :
                                                    (item.homeworkStatus == 2 ? <SuperIcon type="icon-weiwancheng" className='super-icon-font' /> :
                                                        <SuperIcon type="icon-icon-cuowu21" className='super-icon-font' />)
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </>
    )
}

export default taskStuIndex