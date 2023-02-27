import { useEffect, useState } from 'react';
import moment from 'moment'
import './index.less';
import { querySclass, updateClass, deleteSclassById, updateSclassIsOpen } from '@/services/teacher/clazz/sclass'
import { Form, Input, Button, message, DatePicker, Space, Modal, Switch } from 'antd';
const { TextArea } = Input;
import DelModal from '@/pages/components/delModal'
import { history } from 'umi';
import { API } from '@/common/entity/typings';
/**
 * 班级编辑
 * @param props 
 * @returns 
 */
const ClassIndex = (props: { sclassId: number }) => {
  const [sclass, setSclass] = useState<API.SclassRecord>();
  const [form] = Form.useForm();

  const [delModalVisible, setDelModalVisible] = useState(false);
  const [name, setName] = useState<string | undefined>('');
  const sclassId = props.sclassId;

  useEffect(() => {
    fetch();
  }, []);

  const fetch = () => {
    querySclass(sclassId).then((result) => {
      if (!result.success) return;
      setSclass(result.obj)
      if (result.obj.classStart) {
        result.obj.startMoment = moment(result.obj.classStart, 'YYYY-MM-DD')
      }
      if (result.obj.classEnd) {
        result.obj.endMoment = moment(result.obj.classEnd, 'YYYY-MM-DD')
      }
      form.setFieldsValue(result.obj);
      //是否开放给学生
      form.setFieldsValue({ public: result.obj.classIsOpen === 0 ? false : true })
    })

  }
  /**
   * 点击保存
   * @param values 
   */
  const onFinish = async (values: any) => {
    values.classStart = moment(values.startMoment).format('YYYY-MM-DD')
    values.classEnd = moment(values.endMoment).format('YYYY-MM-DD')
    const result = await updateClass(values)
    if (result.success) {
      message.info('保存成功！')
      fetch();
    } else {
      message.error(result.message)
    }
  }

  //开放/取消开放班级
  const switchOnClick = (checked: boolean, event: Event) => {
    updateSclassIsOpen({ sclassId: sclassId, classIsOpen: checked ? 1 : 0 }).then((result) => {
      if (result.success) {
        Modal.success({
          title: (checked ?
            <p>班级<span style={{ color: 'red' }}>开放</span>成功</p>
            :
            <p>班级<span style={{ color: 'red' }}>关闭</span>成功</p>
          ),
          content: (checked ?
            <p>到开课时间后学生会看到本班级课程</p>
            :
            <p>学生将无法看到本班级课程</p>
          ),
        });
      } else {
        message.error(result.message);
      }
    })
  }

  return (
    <>
      <div className="sclass">
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <div className="title-4">班级介绍</div>
          <div className="course-info">

            <div className="flex">
              <div style={{ width: '70%', marginRight: 50 }}>
                <Form.Item name="id" hidden={true}><Input /></Form.Item>
                <Form.Item name="isOpen" hidden={true}><Input /></Form.Item>
                <Form.Item name="coverImage" hidden={true}><Input /></Form.Item>
                <Space size="large">
                  <Form.Item
                    label="班级名称"
                    name="className"
                    rules={[
                      {
                        required: true,
                        message: '请输入班级名称',
                      },
                    ]}
                  ><Input placeholder="请输入班级名称" maxLength={20} style={{ width: '300px' }}
                    disabled={sclass?.isEnd === 1 ? true : false} />
                  </Form.Item>
                </Space>
                <Form.Item label="开班课程" name="courseId">
                  <span>{sclass?.course?.courseName}</span>
                </Form.Item>
                <Space size="middle">
                  <Form.Item label="开课日期" name="startMoment"
                    rules={[
                      {
                        required: true,
                      },
                    ]}>

                    <DatePicker format="YYYY-MM-DD" disabled={sclass?.isEnd === 1 ? true : false} />
                  </Form.Item>
                  <div></div>
                  <Form.Item label="结课日期" name="endMoment"
                    rules={[
                      {
                        required: true,
                      },
                    ]}>
                    <DatePicker format="YYYY-MM-DD" disabled={sclass?.isEnd === 1 ? true : false} />
                  </Form.Item>
                </Space>
                <Form.Item label="班级简介" name="classDesc">
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="请输入班级简介"
                    rows={3}
                    disabled={sclass?.isEnd === 1 ? true : false}
                  />
                </Form.Item>
                <Form.Item label="开放/关闭" name="public" valuePropName="checked">
                  <Switch checkedChildren="已开放" unCheckedChildren="已关闭" onClick={(checked: boolean, event: Event) => switchOnClick(checked, event)} />
                </Form.Item>
                <Form.Item label="删除班级" name="del">
                  <Button type="primary" danger disabled={sclass?.isEnd === 1 ? true : false}
                    onClick={() => { setDelModalVisible(true); setName(sclass?.className) }}
                  >删除班级</Button>
                </Form.Item>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Form.Item><Button type="primary" htmlType="submit" disabled={sclass?.isEnd === 1 ? true : false}>保存设置</Button></Form.Item>
          </div>
        </Form>
      </div>

      <DelModal
        modalVisible={delModalVisible}
        onCancel={() => setDelModalVisible(false)}
        onSubmit={async () => {
          try {
            const result = await deleteSclassById(sclassId);
            setDelModalVisible(false)
            if (result.success) {
              message.success('班级删除成功', 8);
              history.push({ pathname: '/home', query: { type: "1" } })
            } else {
              message.error(result.message, 8);
            }
          } catch (error) {
            message.error('删除失败，请重试');
            console.log('error ', error, 8)
          }
        }}
        name={name}
        module="班级"
      />
    </>
  );
};
export default ClassIndex;

