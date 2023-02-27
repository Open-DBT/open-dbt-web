import React, { useEffect, useState } from 'react';
import { message, Modal, Button, Checkbox, Form, Divider, Select, DatePicker, Switch } from 'antd';
import { getHomeWorkSet, saveHomeWorkSet } from '@/services/teacher/task/task';
import './index.less'
import moment from 'moment';
import { TASK } from '@/common/entity/task';
const { Option } = Select;
type IProps = {
    onCancel: () => void;
    onSubmit: () => void;
    visible: boolean;
    checkId: number;
}

const EditPublishModal = (props: IProps) => {
    const {
        onSubmit: handleSubmit,
        onCancel: handCancel,
        visible,
        checkId
    } = props;
    const [taskName, setTaskName] = useState<string>('');   // 作业名称
    const [form] = Form.useForm();  // 表单对象
    const [initData, setInitData] = useState<TASK.TaskList>();    // 
    const [bolAllow, setBolAllow] = useState<boolean>(false);   // 是否允许补交
    const [selectSet, setSelectSet] = useState<string>(''); // 防作弊设置
    const [bolView, setBolView] = useState<boolean>(false); // 显示表单模块
    const format = (m: any) => moment(m).format('YYYY-MM-DD HH:mm:ss');

    useEffect(() => {
        setBolView(false)
        if (checkId && visible) {
            getTaskData()
        }
    }, [visible])
    /**
     * 获取当前作业数据进行回显
     */
    const getTaskData = () => {
        getHomeWorkSet(checkId).then((res) => {
            if (!res.success) {
                message.error(res.message)
                return;
            } else {
                res.obj.startTime = moment(res.obj.startTime);
                res.obj.endTime = moment(res.obj.endTime);
                setSelectSet(String(res.obj.viewTime))
                res.obj.ignoreCase = res.obj.ignoreCase == 1 ? true : false;
                res.obj.unselectedGiven = res.obj.unselectedGiven == 1 ? true : false;
                res.obj.allowAfter = res.obj.allowAfter == 1 ? setBolAllow(true) : setBolAllow(false);
                res.obj.viewTime = String(res.obj.viewTime);
                setInitData(res.obj)
                setTaskName(res.obj.homeworkName)
                setBolView(true)
            }
        })
    }
    // 修改防止作弊内容
    const ChangePrevCheating = (value: string) => {
        setSelectSet(value)
    };
    // 修改是否允许补交内容
    const handleChangeSwitch = (value: boolean) => {
        console.log(value)
        setBolAllow(value)
    };
    // 提交
    const onFinish = (values: TASK.TaskList) => {
        let param = {
            id: initData?.id,
            startTime: values.startTime ? format(values.startTime) : null,
            endTime: values.endTime ? format(values.endTime) : null,
            ignoreCase: values.ignoreCase == true ? 1 : 2,
            unselectedGiven: values.unselectedGiven == true ? 1 : 2,
            allowAfter: bolAllow == false ? 2 : 1,
            viewTime: Number(selectSet)
        }
        saveHomeWorkSet(param).then((res) => {
            if (!res.success) {
                message.error(res.message)
                return;
            } else {
                message.success(res.message)
                handleSubmit()
            }
        })
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    // 取消
    const onReset = () => {
        form.resetFields();
        handCancel()
    };
    return (
        <Modal
            closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
            destroyOnClose
            title="修改发布设置"
            width="800px"
            open={visible}
            okText="确定"
            onCancel={() => { handCancel() }}
            footer=''
        >
            <div className='publish-bank-modal'>
                <div className='content'>
                    <div>
                        <div className="publish-tool">
                            <div className='title'>
                                {taskName}
                            </div>
                            {
                                bolView &&
                                <Form
                                    name="basic"
                                    labelCol={{ span: 4, }}
                                    wrapperCol={{ span: 20 }}
                                    initialValues={initData}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="有效时段"
                                    >
                                        <Form.Item name="startTime" className="form-date"><DatePicker showTime format="YYYY-MM-DD HH:mm:ss" /></Form.Item>
                                        <div className='date-span'></div>
                                        <Form.Item name="endTime" className="form-date"><DatePicker showTime format="YYYY-MM-DD HH:mm:ss" /></Form.Item>

                                    </Form.Item>
                                    <div className='text-desc' style={{ marginLeft: '50px', marginTop: '-10px' }}>
                                        提示：（有效时段修改后学生加时将失效）
                                    </div>
                                    <Form.Item
                                        label="是否允许补交(可重复提交状态，需要教师批阅)"
                                        labelCol={{ span: 11 }}
                                    >
                                        {bolAllow}
                                        <Switch checkedChildren="允许" unCheckedChildren="不允许" checked={bolAllow} onChange={handleChangeSwitch} />
                                    </Form.Item>
                                    <div>
                                        <Form.Item
                                            label="防作弊设置"
                                        >
                                            <Select placeholder="请选择" style={{ width: 120 }} onChange={ChangePrevCheating} value={selectSet}>
                                                <Option value="1">老师批阅后</Option>
                                                <Option value="2">学生提交后</Option>
                                                <Option value="3">作业结束后</Option>
                                                <Option value="4">不允许</Option>
                                            </Select>
                                            <span style={{ marginLeft: '20px' }}>允许查看答案</span>
                                        </Form.Item>

                                    </div>
                                    <Form.Item label="评分设置">
                                        <div>
                                            <Form.Item name="ignoreCase" className="form-checkbox" valuePropName="checked">
                                                <Checkbox>填空题答案不区分大小写</Checkbox>
                                            </Form.Item>
                                            <span className='text-desc'>（勾选后，英文大写和小写都可以得分）</span>
                                        </div>
                                        <div>

                                            <Form.Item name="unselectedGiven" className="form-checkbox" valuePropName="checked">
                                                <Checkbox>多选题未全选给一半分</Checkbox>
                                            </Form.Item>
                                            <span className="text-desc">（不勾选时全对才给分）</span>
                                        </div>
                                    </Form.Item>
                                    <Divider></Divider>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button htmlType="button" onClick={onReset} style={{ marginRight: '20px' }}>
                                            取消
                                        </Button>
                                        <Button type="primary" htmlType="submit">
                                            确认
                                        </Button>
                                    </div>
                                </Form>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditPublishModal;
