import { useEffect, useState } from 'react';
import { saveCourseStorage } from '@/pages/common-course/utils'
import { updateCourse, getCourseCoverImageList, removeCourse, updateIsOpen } 
from '@/services/teacher/course/course';
import { getTeachers } from '@/services/system/user';
import { Form, Input, Button, message, Modal, Switch, Select } from 'antd';
const { TextArea } = Input;
import * as APP from '@/app';
import BraftEditor from '@/pages/editor/braft';
import ImgModal from './ImgModal';
import { history, Prompt, useModel } from 'umi';
import DelModal from '@/pages/components/delModal'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { API } from '@/common/entity/typings';

/**
 * 课程首页
 * @param props 
 * @returns 
 */
const CourseInfo = (props: any) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  // const [course, setCourse] = useState<API.CourseListItem>();
  const [form] = Form.useForm();
  const [isImgModalVisible, setIsImgModalVisible] = useState(false);
  const [imgList, setImgList] = useState<string[]>([]);
  const [defaultCover, setDefaultCover] = useState<string>();

  const [delModalVisible, setDelModalVisible] = useState(false);
  const [courseName, setCourseName] = useState<string | undefined>('');
  const [promptState, setPromptState] = useState<boolean>(false);//跳转是否弹窗
  const courseId = props.courseId;

  const [teachers, setTeachers] = useState<API.UserListItem[]>([]);
  const [courseTeachers, setCourseTeachers] = useState<number[]>([]);

  const [isTeacher, setIsTeacher] = useState<boolean>(false);//是否是教师
  const [isAssistant, setIsAssistant] = useState<boolean>(false);//是否是助教

  useEffect(() => {
    //全部封面
    getCourseCoverImageList().then((result) => {
      setImgList(result.obj)
    })
    //全部老师
    getTeachers().then((result) => {
      if (result.success) {
        setTeachers(result.obj);
      }
    })
  }, []);

  useEffect(() => {
    fetch();

    if (currentUser) {
      if (currentUser.roleList) {
        if (currentUser.roleList[0].roleId == 3) {
          setIsTeacher(true);
        }
      }
    };
  }, [props.course]);

  /**
   * 请求数据
   */
  const fetch = () => {
    if (props.course) {
      setCourseTeachers(props.course.teachers);
      setIsAssistant(props.course.creator != currentUser?.userId ? true : false);
      setDefaultCover(APP.request.prefix + props.course.coverImage)
      form.setFieldsValue(props.course)
      //是否发布
      form.setFieldsValue({ public: props.course.isOpen === 0 ? false : true })

      // getCourseDetail(courseId).then((result) => {
      //   setCourse(result.obj);
      //   setCourseTeachers(result.obj.teachers);
      //   setIsAssistant(result.obj.creator != currentUser?.userId ? true : false);
      //   setDefaultCover(APP.request.prefix + result.obj.coverImage)
      //   form.setFieldsValue(result.obj)
      //   //是否发布
      //   form.setFieldsValue({ public: result.obj.isOpen === 0 ? false : true })
      // })
      // getCourseCoverImageList().then((result) => {
      //   setImgList(result.obj)
      // })
      // getTeachers().then((result) => {
      //   if (result.success) {
      //     setTeachers(result.obj);
      //   }
      // })
    }
  }

  /**
   * 点击保存
   * @param values 
   */
  const onFinish = async (values: any) => {
    values.courseOutline = values.courseOutline.toHTML();
    const result = await updateCourse({ ...values, teachers: courseTeachers })
    if (result.success) {
      message.info('保存成功！')
      setPromptState(false)//改变状态设置为已保存
      //缓存当前保存页为成功
      saveCourseStorage(courseId, 1);
      //每个页面独立，应该不需要缓存了，应该在切换前做保存
      // localStorage.setItem('course-step1', JSON.stringify(result.obj))
      // fetch();
      props.reload();//刷新课程info
    } else {
      message.error(result.message)
    }
  }

  /**
   * 验证名称、简介、描述被更改过，否则跳转会弹窗
   */
  const validateModify = () => {
    const obj = form.getFieldsValue();

    let temp_desc = '<p></p>'
    if (props.course?.courseOutline != null) {
      temp_desc = props.course?.courseOutline;
    }

    if (props.course?.courseName === obj.courseName
      && props.course?.courseDesc === obj.courseDesc
      && temp_desc === obj.courseOutline.toHTML()
      && props.course?.coverImage === obj.coverImage) {
      setPromptState(false);
      return;
    }
    setPromptState(true);
  }

  //发布/取消发布课程
  const switchOnClick = (checked: boolean, event: Event) => {
    Modal.success({
      content: (<p>本课程<span style={{ color: 'red' }}>{checked ? '发布' : '取消发布'}</span>成功</p>),
    });
    updateIsOpen({ courseId: courseId, isOpen: checked ? 1 : 0 });
  }

  const children = [];
  if (teachers) {
    for (let i = 0; i < teachers.length; i++) {
      children.push({
        label: `${teachers[i].userName} (${teachers[i].code})`,
        value: teachers[i].userId,
      });
      // children.push(<Select.Option key={teachers[i].userId} value={teachers[i].userId}>{teachers[i].userName} ({teachers[i].code})</Select.Option>);
    }
  }

  const handleChange = (value: any) => {
    setCourseTeachers(value);
  }

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <div className="title-4">课程介绍 <Button type="primary" htmlType="submit" style={{ marginLeft: 50 }}>保存设置</Button></div>
        <div className="course-info">
          <div className="flex">
            <div style={{ width: '70%', marginRight: 50 }}>
              <Form.Item name="courseId" hidden={true}><Input /></Form.Item>
              <Form.Item name="isOpen" hidden={true}><Input /></Form.Item>
              <Form.Item name="coverImage" hidden={true}><Input /></Form.Item>

              <Form.Item
                label="课程名称"
                name="courseName"
                rules={[
                  {
                    required: true,
                    message: '请输入课程名称',
                  },
                ]}
              >
                <Input placeholder="请输入课程名称" onChange={() => validateModify()} />
              </Form.Item>
              <Form.Item label="课程简介"
                name="courseDesc"
                className="title-2"
              >
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入课程简介"
                  rows={3}
                  // cols={50}
                  onChange={() => validateModify()}
                />
              </Form.Item>
            </div>
            <div>
              <div style={{ marginTop: 10 }} className="title-2">课程封面</div>
              <img src={defaultCover} width="270px"></img>
              <div style={{ textAlign: 'center', marginTop: 15 }}><Button type="primary" onClick={() => setIsImgModalVisible(true)}>选择封面</Button></div>
            </div>
          </div>
          <Form.Item label="课程大纲" name="courseOutline">
            <BraftEditor className="border" placeholder="请输入正文内容" onChange={() => validateModify()} />
          </Form.Item>
          {
            isTeacher && !isAssistant ?
              <Form.Item label="教师团队" name="teachers">
                <Select
                  allowClear
                  mode="multiple"
                  style={{ width: '500px' }}
                  placeholder="请选择教师团队"
                  onChange={handleChange}
                  virtual={false}
                  listHeight={190}
                  optionFilterProp="label"
                  options={children}
                />
              </Form.Item> : null
          }
          {
            isAssistant || isTeacher ?
              null : <Form.Item label="发布课程模板" name="public" valuePropName="checked">
                <Switch checkedChildren="已发布" unCheckedChildren="未发布" onClick={(checked: boolean, event: any) => switchOnClick(checked, event)} />
              </Form.Item>
          }
          {
            isAssistant ?
              null : <Form.Item label="删除课程" name="del">
                <Button type="primary" danger onClick={() => { setDelModalVisible(true); setCourseName(props.course?.courseName) }}>删除课程</Button>
              </Form.Item>
          }
        </div>

        {/* <div style={{ textAlign: 'center' }}>
            <Form.Item><Button type="primary" htmlType="submit">保存设置</Button></Form.Item>
          </div> */}
      </Form>


      <ImgModal imgList={imgList}
        modalVisible={isImgModalVisible}
        onCancel={() => { setIsImgModalVisible(false) }}
        onSubmit={(values) => {
          console.log('values', values)
          setDefaultCover(APP.request.prefix + values)
          form.setFieldsValue({ coverImage: values });
          setIsImgModalVisible(false)
          validateModify();//验证课程内容是否有变化
        }}
      />

      <DelModal
        modalVisible={delModalVisible}
        onCancel={() => setDelModalVisible(false)}
        onSubmit={async () => {
          try {
            const result = await removeCourse(courseId);
            setDelModalVisible(false)
            if (result.success) {
              message.success('课程删除成功', 8);
              history.push({ pathname: '/home', query: { type: "1" } })
            } else {
              message.error(result.message, 8);
            }
          } catch (error) {
            message.error('删除失败，请重试');
            console.log('error ', error, 8)
          }
        }}
        name={courseName}
        module="课程"
      />
      <Prompt
        when={promptState}
        // message={(location) => {
        //   return window.confirm(`confirm to leave to ${location.pathname}?`);
        // }}
        message={(location) => {
          if (!promptState) {
            return true;
          }
          console.log('message', location)
          Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '暂未保存您所做的更改，是否保存？',
            okText: '保存',
            cancelText: '不保存',
            onOk() {
              form.submit()
            },
            onCancel() {
              setPromptState(false)
              setTimeout(() => {
                history.push(location.pathname);
              });
            }
          });
          return false
        }}
      />
    </>
  );
};
export default CourseInfo