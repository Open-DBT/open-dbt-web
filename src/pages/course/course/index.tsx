import { useRef, useState } from 'react';
import { Button, Divider, message, Modal } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { PlusOutlined } from '@ant-design/icons';
import { queryOwnCourse, queryCoursePublish, removeCourse, updateIsOpen, copyCourse, updateCourse }
  from '@/services/teacher/course/course';
import { history } from 'umi';
import CreateForm from './components/CourseForm';
import { API } from '@/common/entity/typings';

const CourseIndex = () => {

  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);//新建
  const actionRef = useRef<ActionType>();
  const columnCommon: ProColumns<API.CourseListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      align: 'center',
      width: '80px',
      render: (dom, record, index, action) => {
        return index + 1;
      },
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      align: 'center',
    },
    {
      title: '课程描述',
      dataIndex: 'courseDesc',
      align: 'center',
      ellipsis: true,
      width: '20%'
    },
    {
      title: '是否发布',
      dataIndex: 'isOpen',
      align: 'center',
      render: (_, record) => {
        return record.isOpen == 0 ? <span style={{ color: '#4B7902' }}>未发布</span> : <span style={{ color: 'red' }}>已发布</span>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
    },
  ];

  const columns_own: ProColumns<API.CourseListItem>[] = Object.assign([], columnCommon);
  const columns_publish: ProColumns<API.CourseListItem>[] = Object.assign([], columnCommon);

  columns_own.push(
    {
      title: '操作',
      dataIndex: 'option',
      hideInForm: true,
      align: 'center',
      width: '300px',
      render: (_, record) => {
        let buttons = [
          <a key='2' onClick={() => { history.push('/course/course/edit/' + record.courseId) }}>修改</a>,
          <Divider key='21' type="vertical" />,
          <a key='3' onClick={() => { handleDel(record) }}>删除</a>,
          <Divider key='61' type="vertical" />,
          <a key='6' target="_blank" type="link" href={'/course/view/' + record.courseId}>查看</a>,
        ]
        if (record.isOpen === 0) {
          buttons.push(
            <Divider key='41' type="vertical" />,
            <a key='4' style={{ color: 'red' }} onClick={() => { handIsOpen(record, 1) }}>发布</a>,
          )
        } else {
          buttons.push(
            <Divider key='41' type="vertical" />,
            <a key='4' onClick={() => { handCopyCourse(record) }}>复制</a>,
            <Divider key='42' type="vertical" />,
            <a key='5' style={{ color: '#4B7902' }} onClick={() => { handIsOpen(record, 0) }}>取消发布</a>
          )
        }
        return buttons;
      }
    }
  );

  columns_publish.push(
    {
      title: '创建人',
      dataIndex: 'creatorName',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      hideInForm: true,
      align: 'center',
      width: '150px',
      render: (_, record) => {
        let buttons = [
          <a key='6' target="_blank" type="link" href={'/course/view/' + record.courseId}>查看</a>,
          <Divider key='61' type="vertical" />,
          <a key='4' onClick={() => { handCopyCourse(record) }}>复制</a>
        ]
        return buttons;
      }
    }
  );

  // 删除课程弹窗
  const handleDel = (record: API.CourseDetailRecord) => {
    Modal.confirm({
      title: '删除课程',
      content: `确定删除【"${record.courseName}"】课程吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => delCourse(record.courseId),
    });
  };
  // 删除课程
  const delCourse = async (courseId: number) => {
    const hide = message.loading('正在删除');
    try {
      const result = await removeCourse(courseId);
      if (result.message) {
        message.warn(result.message);
        return;
      }
      hide();
      message.success('删除成功，即将刷新');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      console.log('error ', error)
    }
  };

  // 设置课程 公开/私有
  const handIsOpen = (record: API.CourseDetailRecord, status: number) => {
    let text: string;
    if (status === 0) {
      text = '取消发布'
    } else {
      text = '发布'
    }
    Modal.confirm({
      title: `课程${text}`,
      content: `确定${text}【${record.courseName}】课程吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('处理中...');
        try {
          const result = await updateIsOpen({ courseId: record.courseId, isOpen: status });
          hide();
          if (result.message) {
            message.warn(result.message);
            return;
          }
          message.success(`${text}成功`);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } catch (error) {
          hide();
          message.error('执行失败，请重试');
          console.log('error ', error)
        }
      },
    });
  };

  // 复制课程
  const handCopyCourse = (record: API.CourseDetailRecord) => {
    Modal.confirm({
      title: `课程复制`,
      content: `确定复制【${record.courseName}】课程吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('复制中...');
        try {
          const result = await copyCourse(record.courseId);
          if (result.message) {
            message.warn(result.message);
            return;
          }
          hide();
          message.success('复制成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } catch (error) {
          hide();
          message.error('复制失败，请重试');
          console.log('error ', error)
        }
      },
    });
  };

  const options = {
    density: false,//密度
    fullScreen: false,//最大化
    reload: true, //刷新
    setting: true //设置
  };

  return (
    <>
      <ProCard tabs={{ type: 'line' }}>
        <ProCard.TabPane key="tab1" tab="创建的课程">
          <ProTable
            actionRef={actionRef}
            rowKey="courseId"
            request={(params, sorter, filter) => queryOwnCourse({ ...params, sorter, filter })}
            columns={columns_own}
            search={false}
            options={options}
            toolBarRender={() => [
              <Button type="primary" onClick={() => handleCreateModalVisible(true)}>
                <PlusOutlined /> 新建
              </Button>,
            ]}
          />
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="课程模板">
          <ProTable
            rowKey="courseId"
            request={(params, sorter, filter) => queryCoursePublish({ ...params, sorter, filter })}
            columns={columns_publish}
            search={false}
            options={options}
          />
        </ProCard.TabPane>
      </ProCard>

      <CreateForm
        onSubmit={async (value: API.CourseDetailRecord) => {
          const success = await updateCourse(value);
          if (success.success) {
            handleCreateModalVisible(false);
            history.push('/course/course/edit/' + success.obj.courseId)
          } else {
            message.error(success.message);
          }
        }}
        onCancel={() => {
          handleCreateModalVisible(false);
        }}
        createModalVisible={createModalVisible}
      />
    </>
  );
};

export default CourseIndex;