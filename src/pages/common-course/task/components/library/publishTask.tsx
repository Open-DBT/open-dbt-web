import React, { useState } from 'react'
import { Button, Checkbox, Form, Divider, Select, DatePicker, message, Switch } from 'antd';
import logo from '@/img/logo-itol.png'
const { Option } = Select;
import './publishTask.less'
import moment from 'moment'
import { publishHomeWork } from '@/services/teacher/task/task';
import { history, useParams, useLocation } from 'umi';
import AddPersonModal from './component/selectPerson/index'
import { TASK } from '@/common/entity/task';
const PublishTask = (props: any) => {
    const params: any = useParams();
    const location: any = useLocation();
    const taskName = location.state?.taskName
    const [form] = Form.useForm();
    const taskId = params.taskId;
    const courseId = params.courseId;
    const [addPersonModalVisible, setAddPersonModalVisible] = useState<boolean>(false);
    const [checkPerson, setCheckPerson] = useState<any []>([]);
    const [selectSet, setSelectSet] = useState<string>('1'); // 防作弊设置
    const format = (m:any) => moment(m).format('YYYY-MM-DD HH:mm:ss');
    

    const onFinish = (values: TASK.PublishDataParam) => {
        values.courseId = courseId
        values.modelId = taskId
        values.startTime = values.startTime?format(values.startTime):null;
        values.endTime = values.endTime?format(values.endTime):null;
        values.ignoreCase = values.ignoreCase==true?1:2
        values.unselectedGiven = values.unselectedGiven==true?1:2
        values.modelName = taskName
        values.homeworkName = taskName
        values.allowAfter = values.allowAfter==false?2:1
        values.viewTime = Number(selectSet)
        values.distributions =  checkPerson
        if(values.distributions.length == 0) {
            message.warning('请选择发布对象')
            return
        }else if(!values.startTime && !values.startTime) {
            message.warning('请选择有效时段')
            return
        }else if(!values.viewTime) {
            message.warning('请选择防作弊设置')
            return
        }
        publishHomeWork(values).then((res) => {
            if (!res.success) {
              message.error(res.message)
              return;
            } else {
              message.success(res.message)
              history.push(`/teacher/course/task/${courseId}`)
            }
          })
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const onReset = () => {
        form.resetFields();
        history.go(-1)
      };
      const handleChange = (value: string) => {
        setSelectSet(value)
      };
    return (
        <div className='custom-single'>
            <div className='custom-header-row' style={{ position: 'fixed', top: 0 }}>
                <div className='custom-header-row' style={{ position: 'fixed', top: 0 }}>
                    <div className='header-logo'>
                        <img src={logo} alt="" />
                    </div>
                    <div className='header-title'>
                        发布作业
                    </div>
                </div>
            </div>
            <div className='publish-bank '>
                <div className='content'>
                    <div>
                        <div className="publish-tool">
                            <div className='title'>
                                {taskName}
                            </div>
                            <Form
                                name="basic"
                                labelCol={{ span: 2, }}
                                wrapperCol={{ span: 22 }}
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="发布对象"
                                    name="username"
                                >
                                    <Button type="primary" ghost onClick={()=>setAddPersonModalVisible(true)}>
                                        发布对象
                                    </Button>
                                </Form.Item>

                                <Form.Item
                                    label="有效时段"
                                >
                                     <Form.Item name="startTime" className="form-date"><DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/></Form.Item>
                                      <div className='date-span'></div> 
                                      <Form.Item name="endTime" className="form-date"><DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/></Form.Item>
                                      
                                </Form.Item>
                                <Form.Item
                                    label="是否允许补交(可重复提交状态，需要教师批阅)"
                                    labelCol={{span: 7}}
                                    name="allowAfter"
                                >
                                    <Switch checkedChildren="允许" unCheckedChildren="不允许" defaultChecked />
                                </Form.Item>

                                <div>
                                <Form.Item
                                    label="防作弊设置"
                                >
                                    <Select placeholder="请选择" style={{ width: 120 }} onChange={handleChange} value={selectSet}>
                                        <Option value="1">老师批阅后</Option>
                                        <Option value="2">学生提交后</Option>
                                        <Option value="3">作业结束后</Option>
                                        <Option value="4">不允许</Option>
                                    </Select>
                                    <span style={{marginLeft: '20px'}}>允许查看答案</span>
                                </Form.Item>
                              
                                </div>
                                <Form.Item label="评分设置">
                                <div>
                                <Form.Item name="ignoreCase" className="form-checkbox"  valuePropName="checked">
                                <Checkbox>填空题答案不区分大小写</Checkbox> 
                                </Form.Item>
                                <span className='text-desc'>（勾选后，英文大写和小写都可以得分）</span>
                                </div>
                                <div>
                                <Form.Item name="unselectedGiven" className="form-checkbox"  valuePropName="checked">
                                    <Checkbox>多选题未全选给一半分</Checkbox> 
                                </Form.Item>
                                <span className="text-desc">（不勾选时全对才给分）</span>
                                </div>
                                </Form.Item>
                                <Divider />
                                <Form.Item style={{textAlign: 'center'}}>
                                <Button htmlType="button" onClick={onReset} style={{marginRight: '20px'}}>
                                取消
                                </Button>
                                    <Button type="primary" htmlType="submit">
                                    发布
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <AddPersonModal
          onSubmit={async (value: any) => {
            setCheckPerson(value)
            setAddPersonModalVisible(false)
          }}
          onCancel={() => setAddPersonModalVisible(false)}
          visible={addPersonModalVisible}
        />
        </div>
    )
}

export default PublishTask