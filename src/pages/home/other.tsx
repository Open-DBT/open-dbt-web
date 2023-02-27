import { Avatar, Card, Col, Row } from 'antd';
import React from 'react';
import styles from './style.less';
import { useModel } from 'umi';
import * as APP from '@/app';

const Other: React.FC<{}> = () => {

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return (
    <>
      <Row gutter={24}>
        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
          <Card
            style={{ marginBottom: 24 }}
            bordered={false}
            bodyStyle={{ padding: '35px 20px 35px 20px' }}
          >
            <div className={styles.pageHeaderContent}>
              <div className={styles.avatar}>
                <Avatar size="large" src={`${APP.request.prefix}${currentUser!.avatar}`} />
              </div>
              <div className={styles.content}>
                <div className={styles.contentTitle}>
                  您好，{currentUser!.userName}，祝您开心每一天！
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Other;
