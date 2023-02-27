import React, { useEffect, useState } from 'react';
import styles from './BaseStyle.less';
import { useModel } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, Form, message } from 'antd';
import { updateCenter } from '@/services/system/user';
import * as APP from '@/app';
import { API } from '@/common/entity/typings';

const Base: React.FC<{}> = () => {

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [userAvatarUrl, setUserAvatarUrl] = useState<string>(`${APP.request.prefix}/avatar/default.png`);

  useEffect(() => {
    getAvatarURL();
  }, []);

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        console.log("currentUser.avatar = ", currentUser.avatar);
        setUserAvatarUrl(`${APP.request.prefix}${currentUser.avatar}`);
        return;
      }
    }
    return setUserAvatarUrl(`${APP.request.prefix}/avatar/default.png`);
  };

  const handleFinish = async (values: API.UserListParams) => {
    try {
      const result = await updateCenter(values);
      if (!result.success) {
        message.warn(result.message);
        return;
      }
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败，请重试');
      console.log('error ', error)
    }
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
          window.location.reload();
        } else {
          message.error(`头像更换失败：${info.file.response.message}`);
        }
      }
    },
    showUploadList: false
  };

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={currentUser}
          hideRequiredMark
        >
          <Form.Item name="userId" label="用户id" hidden={true}>
            <Input disabled={true} style={{ cursor: 'default' }} />
          </Form.Item>
          <Form.Item name="userName" label="姓名">
            <Input disabled={true} style={{ cursor: 'default' }} />
          </Form.Item>
          <Form.Item name="code" label="学号/工号">
            <Input disabled={true} style={{ cursor: 'default' }} />
          </Form.Item>
          <Form.Item name="sex" label="性别" hidden={true}>
            <Input disabled={true} style={{ cursor: 'default' }} />
          </Form.Item>
          <Form.Item name="nickName" label="昵称">
            <Input />
          </Form.Item>
          <Form.Item name="englishName" label="英文名">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">保存</Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <div className={styles.avatar_title}>
          头像
        </div>
        <div className={styles.avatar}>
          <img src={userAvatarUrl} alt="avatar" />
        </div>
        <Upload {...UploadProps}>
          <div className={styles.button_view}>
            <Button><UploadOutlined />更换头像</Button>
          </div>
        </Upload>
      </div>
    </div>
  );
}

export default Base
