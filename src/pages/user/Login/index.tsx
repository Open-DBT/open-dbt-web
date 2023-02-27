
import { Form, message, Input, Button, Checkbox, Alert } from 'antd';
import React, { useState, useEffect } from 'react';
import { history, useModel } from 'umi';
import { login } from '@/services/system/api';
import './index.css'
import { API } from '@/common/entity/typings';
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      margin: 0,
      textAlign: 'left'
    }}
    message={content}
    type="error"
    showIcon
  />
);

/** 此方法会跳转到 redirect 参数所在的位置 */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    //重新登录去首页
    history.push('/home');
  }, 10);

};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({
    success: true, message: ''
  });
  const { initialState, setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();

  useEffect(() => {
    const code = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    if (code && password) {
      const content = { code: code, password: password };
      console.log('session ', content)
      form.setFieldsValue(content);
    }
  }, []);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      /**
       * 登录
       * currentAuthority: "guest",status: "error",type: "account"
       */
      const msg = await login({ ...values });
      if (msg.success) {
        message.success("登录成功！");
        if (values.remember) {
          //添加缓存
          localStorage.setItem('username', values.code)
          localStorage.setItem('password', values.password)
        } else {
          //清空缓存
          localStorage.setItem('username', '')
          localStorage.setItem('password', '')
        }
        await fetchUserInfo();
        goto();
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultloginFailureMessage = '登录失败，请重试！';

      message.error(defaultloginFailureMessage);
    }
  };
  const { success, message: errorMsg } = userLoginState;

  return (
    <div className="login-bg">
      <div>
        <img src={require('@/img/logo-itol.png')} style={{ height: 56, marginLeft: 70 }}></img>
      </div>
      <div className="login-card">
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={async (values) => {
            handleSubmit(values as API.LoginParams);
          }}
        >
          <div style={{ color: '#40210F', fontSize: 32, marginBottom: 20, fontWeight: 900 }}>Welcome</div>
          <div style={{ marginBottom: 10 }}>
            <Form.Item
              name="code"
              rules={[{ required: true, message: '请输入学号' }]}
            >
              <Input
                placeholder="学号"
                prefix={<img src={require('@/img/icon-user.svg')} style={{ marginRight: 10 }}></img>}
              />
            </Form.Item>
          </div>
          <div style={{ marginBottom: 15 }}>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                placeholder="密码"
                prefix={<img src={require('@/img/icon-password.svg')} style={{ marginRight: 10 }}></img>}
              />
            </Form.Item>
            {success === false && (
              <LoginMessage
                content={errorMsg as string}
              />
            )}
          </div>
          <div style={{ marginBottom: 24, textAlign: 'left', color: '#999999' }}>
            <Form.Item
              name="remember"
              valuePropName="checked"
            >
              <Checkbox>记住登录状态</Checkbox>
            </Form.Item>
          </div>
          <div>
            <Form.Item>
              <Button type="primary" htmlType="submit" shape="round" block
                style={{ border: 0, borderRadius: 6, height: 36 }}>
                登录
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="login-footer">
        <div style={{ color: '#666666', fontSize: 14 }}>本平台由瀚高数据库提供支持</div>
        <div style={{ color: '#999999', fontSize: 12 }}>
          鲁公网安备 37010102001126号
          &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
          鲁ICP备09010331号-3</div>
      </div>
    </div>
  );
};

export default Login;
