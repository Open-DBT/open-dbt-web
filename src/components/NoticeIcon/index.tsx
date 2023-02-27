import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useModel } from 'umi';
import { getNoticesNotRead, changeRead, clearNotRead } from '@/services/system/api';
import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import ViewMoreModal from './ViewMoreModal';

// export type IProps = {
//   timer?: any;
// };

const NoticeIconView: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [noticesListTO, setNoticesListTO] = useState<API.NoticesListTO>();//所有消息
  const [noticesNotReadCount, setNoticesNotReadCount] = useState<number>(0);//未读的所有消息总数
  const [noticeList, setNoticeList] = useState<API.NotificationItem[]>([]);//通知list
  const [noticeNotReadCount, setNoticeNotReadCount] = useState<number>(0);//未读通知个数
  const [eventList, setEventList] = useState<API.EventItem[]>([]);//待办list
  const [evenNotReadCount, setEvenNotReadCount] = useState<number>(0);//未读待办个数
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [viewMoreModalVisible, setViewMoreModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const { currentUser } = initialState || {};
    if (currentUser) {

      getNoticesNotReadList();

      // props.timer.current = setInterval(() => {
      //   console.log("notice timer token=", localStorage.getItem("access_token"));
      //   if (!localStorage.getItem("access_token")) {
      //     clearInterval(props.timer.current);
      //   } else {
      //     getNoticesNotReadList();
      //   }
      // }, 3600000);
    }
  }, []);

  const getNoticesNotReadList = () => {
    getNoticesNotRead().then((result) => {
      if (result.success) {
        console.log("new token = ", result.token);
        if (result.token && result.token.trim().length > 0) {
          localStorage.setItem("access_token", result.token)
        }

        setNoticesListTO(result.obj);
        setNoticesNotReadCount(result.obj.count);
        setNoticeList(result.obj.noticeList);
        setNoticeNotReadCount(result.obj.noticeList.length);
        setEventList(result.obj.upcomList);
        setEvenNotReadCount(result.obj.upcomList.length);
      } else {
        message.error(result.message);
      }
    });
  }

  const changeReadState = (id: number, tabKey: string) => {
    if (tabKey === 'event') {
      setEventList(eventList.map((item) => {
        const notice = { ...item };
        if (notice.id === id) {
          notice.read = true;
          setNoticesNotReadCount(noticesNotReadCount - 1);
          setEvenNotReadCount(evenNotReadCount - 1);
        }
        return notice;
      }));
    } else if (tabKey === 'message') {

    } else {
      setNoticeList(noticeList.map((item) => {
        const notice = { ...item };
        if (notice.id === id) {
          notice.read = true;
          setNoticesNotReadCount(noticesNotReadCount - 1);
          setNoticeNotReadCount(noticeNotReadCount - 1);
        }
        return notice;
      }));

      changeRead(1, id).then((result) => {
        if (!result.success) {
          message.error(result.message);
        }
      });
    }
  };

  const clearReadState = (title: string, tabKey: string) => {
    if (tabKey === 'event') {
      setEventList([]);
      setNoticesNotReadCount(noticesNotReadCount - evenNotReadCount);
      setEvenNotReadCount(0);
    } else if (tabKey === 'message') {

    } else {
      setNoticeList([]);
      setNoticesNotReadCount(noticesNotReadCount - noticeNotReadCount);
      setNoticeNotReadCount(0);

      clearNotRead(1).then((result) => {
        if (!result.success) {
          message.error(result.message);
        }
      });
    }
  };

  const onPopupVisibleChange = (visible: boolean) => {
    setPopupVisible(visible);
  }

  return (
    <>
      <NoticeIcon
        className={styles.action}
        count={noticesNotReadCount}
        onItemClick={(item, tabProps) => {
          changeReadState(item.id, tabProps.tabKey);
        }}
        onClear={(title: string, tabKey: string) => clearReadState(title, tabKey)}
        loading={false}
        clearText="清空未读"
        viewMoreText="查看更多"
        onViewMore={() => { setViewMoreModalVisible(true); setPopupVisible(false); }}
        clearClose
        popupVisible={popupVisible}
        onPopupVisibleChange={onPopupVisibleChange}
      >
        <NoticeIcon.Tab
          tabKey="notification"
          count={noticeNotReadCount}
          list={noticeList}
          title="通知"
          emptyText="你已查看所有通知"
          showViewMore
        />
        {/* <NoticeIcon.Tab
        tabKey="message"
        count={notices.length}
        list={notices}
        title="消息"
        emptyText="您已读完所有消息"
        showViewMore
      /> */}
        <NoticeIcon.Tab
          tabKey="event"
          title="待办"
          emptyText="你已完成所有待办"
          count={evenNotReadCount}
          list={eventList}
          showViewMore
        />
      </NoticeIcon>

      {noticesListTO ? (
        <ViewMoreModal
          onCancel={() => {
            setViewMoreModalVisible(false);
          }}
          viewMoreModalVisible={viewMoreModalVisible}
          noticesListTO={noticesListTO!}
        />
      ) : null}

    </>
  );
};

export default NoticeIconView;
