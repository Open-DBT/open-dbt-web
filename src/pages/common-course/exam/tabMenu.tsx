import React, { useEffect } from 'react';
import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined } from '@ant-design/icons';
import { history } from 'umi';

const TabMenu = (props: any) => {
  const courseId = props.courseId;
  const examId = props.examId;
  useEffect(() => {
  }, []);

  const onMenuClick = (e: any) => {
    if (e.key === 'setting') {
      history.push(`/teacher/course/${courseId}/exam/${examId}/info`);
    } else if (e.key === 'exercise') {
      history.push(`/teacher/course/${courseId}/exam/${examId}/exercise`);
    }
  }

  return (
    <>
      <Menu mode="horizontal" onClick={onMenuClick} style={{ borderRadius: '7px' }}>
        <Menu.Item key="setting" icon={<MailOutlined />}>
          作业设置
        </Menu.Item>
        <Menu.Item key="exercise" icon={<AppstoreOutlined />}>
          习题列表
        </Menu.Item>
      </Menu>
    </>
  );
};
export default TabMenu;
