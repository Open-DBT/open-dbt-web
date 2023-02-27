import { Avatar, List } from 'antd';
import moment from 'moment';
import React from 'react';
import classNames from 'classnames';
import styles from './NoticeList.less';
import { API } from '@/common/entity/typings';

export type NoticeIconTabProps = {
  count?: number;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  title: string;
  tabKey: API.NoticeIconItemType;
  onClick?: (item: API.NoticeIconItem) => void;
  onClear?: () => void;
  emptyText?: string;
  clearText?: string;
  viewMoreText?: string;
  list: API.NotificationItem[] | API.EventItem[];
  onViewMore?: (e: any) => void;
};
const NoticeList: React.FC<NoticeIconTabProps> = ({
  list = [],
  onClick,
  onClear,
  title,
  tabKey,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
}) => {
  if (!list || list.length === 0) {
    return (
      <div className={styles.notFound}>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    );
  }

  return (
    <div>
      <List<any>
        className={styles.list}
        dataSource={list}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });

          const leftIcon = item.avatar ? (
            typeof item.avatar === 'string' ? (
              <Avatar className={styles.avatar} src={item.avatar} />
            ) : (
              <span className={styles.iconElement}>{item.avatar}</span>
            )
          ) : null;

          return (
            <List.Item
              className={itemCls}
              key={item.id || i}
              onClick={() => {
                onClick?.(item);
              }}
            >
              {
                tabKey === 'notification' ? (
                  <List.Item.Meta
                    className={styles.meta}
                    avatar={leftIcon}
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
                ) : null
              }

              {
                tabKey === 'message' ? (
                  <List.Item.Meta
                    className={styles.meta}
                    avatar={leftIcon}
                    title={
                      <div className={styles.title}>
                        {item.taskName}
                      </div>
                    }
                    description={
                      <div>
                        <div className={styles.description}>描述</div>
                        <div className={styles.datetime}>{moment(item.createTime).fromNow()}</div>
                      </div>
                    }
                  />
                ) : null
              }

              {
                tabKey === 'event' ? (
                  <List.Item.Meta
                    className={styles.meta}
                    title={
                      <div className={styles.title}>
                        {item.taskName}
                      </div>
                    }
                    description={
                      <div>
                        <div className={styles.description}>{item.taskDesc}</div>
                      </div>
                    }
                  />
                ) : null
              }
            </List.Item>
          );
        }}
      />

      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText}{title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NoticeList;
