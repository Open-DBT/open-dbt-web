import React, { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { List, message } from 'antd';
import { stringify } from 'querystring';
import AlterPwdModal from './AlterPwdModal';
import { resetPwd } from '@/services/system/user';
import { API } from '@/common/entity/typings';

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

const strength = {
  strong: (<span className="strong">强</span>),
  medium: (<span className="medium">中</span>),
  weak: (<span className="weak">弱</span>),
};

const Security: React.FC<{}> = () => {

  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [passwordStrength, setPasswordStrength] = useState<any>(strength.weak);
  const [alterPwdModalVisible, setAlterPwdModalVisible] = useState<boolean>(false);

  useEffect(() => {
    passwordRegex(currentUser!.password!);
  }, []);

  const passwordRegex = (password: string) => {
    if (strongRegex.test(password)) {
      setPasswordStrength(strength.strong);
    } else if (mediumRegex.test(password)) {
      setPasswordStrength(strength.medium);
    } else {
      setPasswordStrength(strength.weak);
    }
  };

  const handleAlterPwd = async (values: API.CurrentUser) => {
    try {
      const result = await resetPwd({ userId: currentUser?.userId!, password: values.password });
      if (!result.status) {
        message.error(result.message);
        return false;
      }
      message.success('修改成功,请重新登录!');
      return true;
    } catch (error) {
      message.error('修改失败请重试！');
      return false;
    }
  };

  const relogin = async () => {
    const { query = {}, pathname } = history.location;
    const { redirect } = query;
    localStorage.setItem("access_token",'')
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname,
        }),
      });
    }
  };

  const getData = () => [
    {
      title: '账户密码',
      description: (
        <> 密码强度 ：{passwordStrength} </>
      ),
      actions: [
        <a key="Modify" onClick={() => { setAlterPwdModalVisible(true) }}>修改</a>,
      ],
    },
  ];

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={getData()}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
      <AlterPwdModal
        onSubmit={async (values) => {
          const success = await handleAlterPwd(values);
          if (success) {
            setAlterPwdModalVisible(false);
            setInitialState({ ...initialState, currentUser: undefined });
            relogin();
            return;
          }
        }}
        onCancel={() => {
          setAlterPwdModalVisible(false);
        }}
        alterPwdModalVisible={alterPwdModalVisible}
      />
    </>
  );
}

export default Security;
