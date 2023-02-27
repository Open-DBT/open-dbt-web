import React, { useRef } from 'react';
import { Space, Select, message, Button, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown'; // import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { switchRoles } from '@/services/system/user'; // import NoticeIconView from '../NoticeIcon';
import NoticeModal from '../NoticeModal';
export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const { currentUser } = initialState || {};
  const children = [];

  if (currentUser) {
    const roleList = currentUser!.roleList!;

    for (let i = 0; i < roleList!.length; i++) {
      children.push(
        <Select.Option key={roleList[i].roleId!} value={roleList[i].roleId}>
          {roleList[i].roleName}
        </Select.Option>,
      );
    }
  }

  const switchButton = [];

  if (currentUser) {
    const roleList = currentUser!.roleList!;
    const role = roleList.filter((item) => item.roleId != currentUser.roleType)[0];

    if (role) {
      switchButton.push(
        <Button
          key={1}
          type="primary"
          size={'small'}
          style={{
            borderRadius: 4,
            fontSize: 12,
          }}
          onClick={() => onChange(role.roleId)}
        >
          切换到{role.roleName}
        </Button>,
      );
    }
  }

  const onChange = async (key: number) => {
    const result = await switchRoles({
      userId: currentUser!.userId,
      roleType: key,
    });

    if (result.success) {
      // window.location.reload();
      window.location.href = '/home';
    } else {
      message.error(result.message);
    }
  };

  const timer: any = useRef(); //计时器

  return (
    <Space className={className}>
      <Tooltip title="意见反馈">
        <span className={styles.action} onClick={() => window.open(`/feedback`)}>
          <QuestionCircleOutlined />
        </span>
      </Tooltip>
      {/* <HeaderSearch
       className={`${styles.action} ${styles.search}`}
       placeholder="站内搜索"
       defaultValue="umi ui"
       options={[
         { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
         {
           label: <a href="next.ant.design">Ant Design</a>,
           value: 'Ant Design',
         },
         {
           label: <a href="https://protable.ant.design/">Pro Table</a>,
           value: 'Pro Table',
         },
         {
           label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
           value: 'Pro Layout',
         },
       ]}
      // onSearch={value => {
      //   console.log('input', value);
      // }}
      /> */}

      {/* <span
       className={styles.action}
       onClick={() => {
         window.open('https://pro.ant.design/docs/getting-started');
       }}
      >
       <QuestionCircleOutlined />
      </span> */}

      {/* <span className={styles.action}>
       <NoticeIconView timer={timer} />
      </span> */}

      {/* <NoticeModal timer={timer} /> */}

      {currentUser ? (
        currentUser!.roleList!.length > 1 ? (
          <Space>
            {/* <Select
         defaultValue={currentUser ? currentUser.roleType : -1}
         style={{ width: '130px' }}
         size={'small'}
         onChange={onChange}
        >
         {children}
        </Select> */}
            {switchButton}
          </Space>
        ) : null
      ) : null}

      {/* <Space>
       <Select
         defaultValue={currentUser ? currentUser.roleType : -1}
         style={{ width: '130px' }}
         size={'small'}
         onChange={onChange}
       >
         {children}
       </Select>
      </Space> */}

      <Avatar menu timer={timer} />

      {/* <SelectLang className={styles.action} /> */}
      <span className={styles.action} />
    </Space>
  );
};

export default GlobalHeaderRight;
