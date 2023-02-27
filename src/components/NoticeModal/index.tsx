import { useEffect, useState } from 'react';
import { message, Badge, Modal, Tabs, List, Avatar } from 'antd';
import { useModel } from 'umi';
import { getNoticesNotRead, changeRead, getNotices } from '@/services/system/api';
import styles from './index.less';
import classNames from 'classnames';
import moment from 'moment';
import * as APP from '@/app';
import { API } from '@/common/entity/typings';

export type IProps = {
  timer?: any;
};

const NoticeIconView: React.FC<IProps> = (props) => {
  const { initialState } = useModel('@@initialState');

  // const [noticesListTO, setNoticesListTO] = useState<API.NoticesListTO>();//所有消息
  const [noticesNotReadCount, setNoticesNotReadCount] = useState<number>(0);//未读的所有消息总数

  const [noticeAllList, setNoticeAllList] = useState<API.NotificationItem[]>([]);//所有通知list
  const [noticeList, setNoticeList] = useState<API.NotificationItem[]>([]);//通知list
  const [noticeNotReadCount, setNoticeNotReadCount] = useState<number>(0);//未读通知个数

  // const [eventList, setEventList] = useState<API.EventItem[]>([]);//待办list
  // const [evenNotReadCount, setEvenNotReadCount] = useState<number>(0);//未读待办个数

  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const { currentUser } = initialState || {};
    if (currentUser) {
      console.log("currentUser.roleType = ", currentUser.roleType);
      getNoticesNotReadList();
      if (currentUser.roleType != 4) {
        props.timer.current = setInterval(() => {
          console.log("notice timer token=", localStorage.getItem("access_token"));
          if (!localStorage.getItem("access_token")) {
            clearInterval(props.timer.current);
          } else {
            getNoticesNotReadList();
          }
        }, 3600000);
      }
    }
  }, []);

  const getNoticesNotReadList = () => {
    getNoticesNotRead().then((result) => {
      if (result.success) {
        console.log("new token = ", result.token);
        if (result.token && result.token.trim().length > 0) {
          localStorage.setItem("access_token", result.token)
        }

        // setNoticesListTO(result.obj);
        setNoticesNotReadCount(result.obj.count);

        setNoticeList(result.obj.noticeList);
        setNoticeNotReadCount(result.obj.noticeList.length);

        // setEventList(result.obj.upcomList);
        // setEvenNotReadCount(result.obj.upcomList.length);
      } else {
        message.error(result.message);
      }
    });
  }

  // const clearReadState = (title: string, tabKey: string) => {
  //   if (tabKey === 'event') {
  //     setEventList([]);
  //     setNoticesNotReadCount(noticesNotReadCount - evenNotReadCount);
  //     setEvenNotReadCount(0);
  //   } else if (tabKey === 'message') {

  //   } else {
  //     setNoticeList([]);
  //     setNoticesNotReadCount(noticesNotReadCount - noticeNotReadCount);
  //     setNoticeNotReadCount(0);

  //     clearNotRead(1).then((result) => {
  //       if (!result.success) {
  //         message.error(result.message);
  //       }
  //     });
  //   }
  // };

  // 绘制noticeList的item
  const noticeListRenderItem = (item: API.NotificationItem) => {
    return (
      <List.Item
        className={classNames(styles.item, { [styles.read]: item.read })}
        key={item.id}
        onClick={() => {
          if (!item.read) {
            setNoticeList(noticeList.map((noticeItem) => {
              const notice = { ...noticeItem };
              if (notice.id === item.id) {
                notice.read = true;
                setNoticesNotReadCount(noticesNotReadCount - 1);
                setNoticeNotReadCount(noticeNotReadCount - 1);
              }
              return notice;
            }));

            setNoticeAllList(noticeAllList.map((noticeItem) => {
              const notice = { ...noticeItem };
              if (notice.id === item.id) {
                notice.read = true;
                setNoticesNotReadCount(noticesNotReadCount - 1);
                setNoticeNotReadCount(noticeNotReadCount - 1);
              }
              return notice;
            }));

            changeRead(1, item.id).then((result) => {
              if (!result.success) {
                message.error(result.message);
              }
            });
          }
        }}
      >
        <List.Item.Meta
          className={styles.meta}
          avatar={<Avatar className={styles.avatar} src={item.avatar ? `${APP.request.prefix}${item.avatar}` : `${APP.request.prefix}/avatar/default.png`} />}
          title={
            <div className={styles.title}>
              {item.userName}{item.noticeContent}
            </div>
          }
          description={
            <div>
              <div className={styles.datetime}>{moment(item.createTime).fromNow()}</div>
            </div>
          }
        />
      </List.Item>
    );
  };

  const tabsOnChange = (activeKey: string) => {
    console.log("activeKey", activeKey);
    if (activeKey === "12") {
      getNotices().then((result) => {
        if (result.success) {
          setNoticeAllList(result.obj.noticeList);
        } else {
          message.error(result.message);
        }
      });
    }
  }

  return (
    <>
      <span className={styles.action} onClick={() => { setViewModalVisible(true) }}>
        <Badge count={noticesNotReadCount} style={{ boxShadow: 'none' }} className={styles.badge}>
          {/* <BellOutlined className={styles.icon} /> */}
          <img src={require('@/img/icon-notice.svg')} width="20px" height="20px"></img>
        </Badge>
      </span>

      <Modal
        bodyStyle={{ padding: "0px 0px 24px 0px" }}
        width={800}
        maskClosable={false}
        destroyOnClose
        title="消息中心"
        footer={null}
        open={viewModalVisible}
        onCancel={() => { setViewModalVisible(false) }}
      >
        <Tabs defaultActiveKey="1" tabPosition="left" tabBarExtraContent={{ left: <div style={{ height: "50px" }} /> }}
          items={[
            {
              key: "1",
              label: '通知',
              children:
                <Tabs defaultActiveKey="11" tabPosition="top" onChange={(activeKey) => tabsOnChange(activeKey)}>
                  {/* <TabPane tab={noticeNotReadCount > 0 ? `未读 (${noticeNotReadCount})` : "未读"} key="11">
                    <List
                      className={styles.list}
                      dataSource={noticeList}
                      renderItem={(item) => noticeListRenderItem(item)}
                    />
                  </TabPane>
                  <TabPane tab="全部" key="12">
                    <List
                      className={styles.list}
                      dataSource={noticeAllList}
                      renderItem={(item) => noticeListRenderItem(item)}
                    />
                  </TabPane> */}
                </Tabs>
            }
          ]}
        />
      </Modal>
    </>
  );
};

export default NoticeIconView;
