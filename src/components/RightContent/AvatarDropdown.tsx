import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import * as APP from '@/app';
import { switchRoles } from '@/services/system/user';
// import { outLogin } from '@/services/ant-design-pro/api';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  timer?: any;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  // await outLogin();
  const { query = {}, search, pathname } = history.location;
  const { redirect } = query;
  localStorage.setItem("access_token",'')
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, timer }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        if (currentUser!.roleList!.length > 1) {
          const firstRole = currentUser!.roleList![0].roleId;
          const roleType = currentUser?.roleType;
          if (firstRole != roleType) {
            switchRoles({ userId: currentUser!.userId, roleType: firstRole }).then((result: any) => {
              setInitialState({ ...initialState, currentUser: undefined });
              clearInterval(timer.current);
              loginOut();
              return;
            });
          } else {
            setInitialState({ ...initialState, currentUser: undefined });
            clearInterval(timer.current);
            loginOut();
            return;
          }
        } else {
          setInitialState({ ...initialState, currentUser: undefined });
          clearInterval(timer.current);
          loginOut();
          return;
        }
      }
      // history.push(`/account/${key}`);
      history.push(`/${key}`);
    },
    [initialState, setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.userName) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {/* {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )} */}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={`${APP.request.prefix}${currentUser.avatar}`} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.userName}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
