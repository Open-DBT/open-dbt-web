import React, { useEffect, useState } from 'react';
import { message, Modal, Button, Form, Divider, DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import { overTime } from '@/services/teacher/task/task';
import moment from 'moment';
import { API } from '@/common/entity/typings';
import { TASK } from '@/common/entity/task';
type IProps = {
    onCancel: () => void;
    onSubmit: () => void;
    visible: boolean;
    checkRow: TASK.TaskReviewListData;
}
type IAddTimeParam = {
    endTime: unknown;
}
const AddTimeModal = (props: IProps) => {
    const {
        onSubmit: handleSubmit,
        onCancel: handCancel,
        visible,
        checkRow
    } = props;
    const format = (m: any) => moment(m).format('YYYY-MM-DD HH:mm:ss');
    const [ initData ] = useState();
 
    // 转换时间由字符串到Moment对象
    useEffect(() => {
        checkRow.homeworkEndTime = moment(checkRow.homeworkEndTime);
        if(checkRow.endTime != null) 
        checkRow.homeworkEndTime =  moment(checkRow.endTime)
        
    }, [])
    // 表单提交
    const onFinish = (values: IAddTimeParam) => {
        let endTime = values.endTime ? format(values.endTime) : null;
        let param = {
            endTime: endTime,
            homeworkId: checkRow.homeworkId,
            studentId: checkRow.studentId
        }
        overTime(param).then((res: API.Result<boolean>) => {
            if (res.success) {
                message.success(res.message)
                handleSubmit()
            } else {
                message.error(res.message)
            }
        })

    }
    // 失败
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    // 点击取消
    const onReset = () => {
        handCancel()
    };
    // 禁止点击所处时间事件
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
            return current && current < checkRow.homeworkEndTime
    };
    return (
        <Modal
            closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
            destroyOnClose
            title="加时"
            width="500px"
            open={visible}
            okText="确定"
            onCancel={() => { handCancel() }}
            footer=''
        >
            <Form
                name="basic"
                labelCol={{ span: 6, }}
                wrapperCol={{ span: 18 }}
                initialValues={initData}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="开始时间"
                >
                    {checkRow.homeworkStartTime}
                </Form.Item>
                <Form.Item
                    label="结束时间"
                >
                    {checkRow.endTime?checkRow.endTime:checkRow.homeworkEndTime}
                </Form.Item>
                <Form.Item
                    label="加时时间"
                    name="endTime"
                >
                    <DatePicker showTime showNow={false} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate} />
                </Form.Item>
                <Divider></Divider>
                <Form.Item>
                    <div style={{ textAlign: 'right' }}>
                        <Button htmlType="button" onClick={onReset} style={{ marginRight: '20px' }}>
                            取消
                        </Button>
                        <Button type="primary" htmlType="submit">
                            确认
                        </Button>
                    </div>
                </Form.Item>

            </Form>
        </Modal>
    )
}
export default AddTimeModal;