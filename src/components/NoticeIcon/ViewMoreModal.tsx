import { Modal, Tabs, List, Avatar } from 'antd';
import moment from 'moment';
import ProCard from '@ant-design/pro-card';
import { NotificationTwoTone, AndroidOutlined } from '@ant-design/icons';
import { API } from '@/common/entity/typings';



interface ViewMoreModalProps {
  onCancel: (flag?: boolean, formVals?: API.CurrentUser) => void;
  viewMoreModalVisible: boolean;
  noticesListTO: API.NoticesListTO;
};

const ViewMoreModal: React.FC<ViewMoreModalProps> = (props) => {

  const {
    onCancel: handleViewMoreModalVisible,
    viewMoreModalVisible,
    noticesListTO
  } = props;

  /**
     * 绘制list的item
     * @param {*} item
     */
  const listRenderItem = (item: API.NotificationItem) => {
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.avatar} />}
          title={
            <span>
              {item.userName}{item.noticeContent}
            </span>
          }
          description={
            <span title={item.createTime}>
              {moment(item.createTime).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  return (
    <Modal
      width={700}
      maskClosable={false}
      destroyOnClose
      title="消息中心"
      footer={null}
      open={viewMoreModalVisible}
      onCancel={() => { handleViewMoreModalVisible(false) }}
    >
      <Tabs defaultActiveKey="1" tabPosition="left"
        items={[
          {
            key: "1",
            label: '通知',
            children:
              <ProCard
                style={{ height: 400, overflow: "auto" }}
                type="inner"
                size="small"
                bordered
              >
                <List
                  renderItem={(item) => listRenderItem(item)}
                  dataSource={noticesListTO.noticeList}
                />
              </ProCard>
          }, {
            key: "2",
            label: '待办',
            children:
              <ProCard
                style={{ height: 400, overflow: "auto" }}
                type="inner"
                size="small"
                bordered
              >
                <List
                  // renderItem={(item) => listRenderItem(item)}
                  dataSource={noticesListTO.upcomList}
                />
              </ProCard>
          }
        ]}
      />
    </Modal>
  );
}

export default ViewMoreModal;