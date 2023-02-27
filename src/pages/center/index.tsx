import React, { useState, useEffect } from 'react';
import { useModel, history } from 'umi';
import { stringify } from 'querystring';
import { Tabs, Form, Input, Button, Divider, Upload, message, Avatar } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './less/style.less'
import { updateAccountInfo, userUpdatePassword } from '@/services/system/user';
import * as APP from '@/app';

const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 8 } };

const regex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

const Center: React.FC<{}> = () => {

  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [userAvatarUrl, setUserAvatarUrl] = useState<string>(`${APP.request.prefix}/avatar/default.png`);
  const [userAvatarName, setUserAvatarName] = useState<string>('');

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  useEffect(() => {
    getAvatarURL();
  }, []);

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        console.log("currentUser.avatar = ", currentUser.avatar);
        setUserAvatarUrl(`${APP.request.prefix}${currentUser.avatar}`);
        setUserAvatarName(currentUser.avatar);
        return;
      }
    }
    setUserAvatarUrl(`${APP.request.prefix}/avatar/default.png`);
    setUserAvatarName("/avatar/default.png");
    return;
  };

  const UploadProps = {
    name: 'file',
    action: `${APP.request.prefix}/sys/uploadAvatar`,
    headers: {
      "authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
    accept: '.jpeg, .jpg, .png',
    onChange(info: any) {
      if (info.file.status === 'done') {
        console.log('info == ', info);
        const newFilePathList = [];
        newFilePathList.push(info.file.response.obj);
        if (info.file.response.success) {
          // message.success("头像更换成功");
          // setInitialState({ ...initialState, currentUser: info.file.response.obj });
          //window.location.reload();
          console.log(info.file.response.obj.avatar);

          setUserAvatarUrl(`${APP.request.prefix}${info.file.response.obj.avatar}`);
          setUserAvatarName(info.file.response.obj.avatar);
        } else {
          message.error(`头像更换失败：${info.file.response.message}`);
        }
      }
    },
    showUploadList: false
  };

  const saveAccountInfo = async () => {
    const fieldsValue = await form1.validateFields();
    const result = await updateAccountInfo({ ...fieldsValue, avatar: userAvatarName });
    if (result.success) {
      window.location.reload();
    } else {
      message.error(`头像更换失败：${result.message}`);
    }
  };

  const updatePwd = async () => {
    const fieldsValue = await form2.validateFields();
    const result = await userUpdatePassword({ ...fieldsValue });
    if (result.success) {
      // message.success('密码修改成功');
      setInitialState({ ...initialState, currentUser: undefined });
      relogin();
    } else {
      message.error(`密码修改失败：${result.message}`);
    }
  };

  const relogin = async () => {
    const { query = {}, pathname } = history.location;
    const { redirect } = query;
    localStorage.setItem("access_token", '')
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname,
        }),
      });
    }
  };

  return (
    <div className="user-center">
      <div className="title-4 user-center-title">个人设置</div>
      <Tabs defaultActiveKey="1"
        items={[
          {
            label: '账号信息',
            key: "1",
            children:
              <div className="account-info">
                <Form
                  {...formLayout}
                  initialValues={currentUser}
                  form={form1}
                >
                  <Form.Item name="userId" label="用户id" hidden={true}>
                    <Input disabled={true} style={{ cursor: 'default' }} />
                  </Form.Item>
                  <Form.Item name="userName" label="姓名">
                    <Input disabled={true} style={{ cursor: 'default', width: '470px' }} />
                  </Form.Item>
                  <Form.Item name="code" label="学号/工号">
                    <Input disabled={true} style={{ cursor: 'default', width: '470px' }} />
                  </Form.Item>
                  <Divider />
                  <Form.Item label="头像">
                    <div className="flex" style={{ width: '470px' }}>
                      <div className="user-avatar">
                        <Avatar size={50} src={userAvatarUrl} alt="avatar" />
                      </div>
                      <div style={{ marginLeft: '20px', width: '400px' }}>
                        <Upload {...UploadProps}>
                          <Button>更改</Button>
                        </Upload>
                        <p className="user-avatar-p">(尺寸建议100x100px; 支持jpg/png/jpeg; 大小不超过5MB)</p>
                      </div>
                    </div>
                  </Form.Item>
                  <Divider />
                  <Form.Item name="school" label="学校">
                    <Input placeholder="所在学校" style={{ width: '470px' }} />
                  </Form.Item>
                  <Form.Item name="major" label="专业">
                    <Input placeholder="所学专业" style={{ width: '470px' }} />
                  </Form.Item>
                  <Form.Item name="mobile" label="手机号">
                    <Input placeholder="请输入手机号" style={{ width: '470px' }} />
                  </Form.Item>
                  <Form.Item name="mail" label="邮箱">
                    <Input placeholder="学请输入邮箱" style={{ width: '470px' }} />
                  </Form.Item>
                  <Divider />
                  <Form.Item label=" " colon={false}>
                    <Button type="primary" onClick={saveAccountInfo}>保存</Button>
                  </Form.Item>
                </Form>
              </div>
          },
          {
            label: '修改密码',
            key: "2",
            children: <div className="account-info">
              <Form
                {...formLayout}
                form={form2}
              >
                <Form.Item
                  name="oldPassword"
                  label="原密码"
                  rules={[{ required: true, message: '请输入原密码！' }]}
                >
                  <Input.Password placeholder="请输入原密码" style={{ width: '470px' }} />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="新密码"
                  validateTrigger={'onBlur'}
                  rules={[
                    { required: true, message: '请设置新密码!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        console.log(value.length);
                        if (value.length >= 6 && regex.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('请按格式输入密码!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="请设置新密码" style={{ width: '470px' }} />
                </Form.Item>

                <Form.Item label=" " colon={false}>
                  <div style={{ paddingLeft: '20px' }}>
                    <div>
                      <span className="infoCircleOutlined-span"><InfoCircleOutlined /> 6位以上密码</span>
                    </div>
                    <div>
                      <span className="infoCircleOutlined-span"><InfoCircleOutlined /> 字母与数字组合</span>
                    </div>
                  </div>
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="确认密码"
                  dependencies={['password']}
                  validateTrigger={'onBlur'}
                  rules={[
                    { required: true, message: '请确认密码!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入密码不一致!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="确认密码" style={{ width: '470px' }} />
                </Form.Item>
                <Divider />
                <Form.Item label=" " colon={false}>
                  <Button type="primary" onClick={updatePwd}>保存</Button>
                </Form.Item>
              </Form>
            </div>
          }
        ]}
      />
    </div >
    // <GridContent>
    //   <div className={styles.main}>
    //     <div className={styles.leftMenu}>
    //       <Menu mode={mode} selectedKeys={[selectKey]} onClick={({ key }) => setSelectKey(key)}>
    //         {getMenu()}
    //       </Menu>
    //     </div>
    //     <div className={styles.right}>
    //       <div className={styles.title}>{getRightTitle()}</div>
    //       {renderChildren()}
    //     </div>
    //   </div>
    // </GridContent>
  );
};

export default Center;
