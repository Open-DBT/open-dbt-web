import { useEffect, useState, useRef } from 'react';
import { Button, Input, Progress } from 'antd';
import { api_getCatalogueInfo, api_getCatalogueInfoTitle }
  from '@/services/teacher/course/chapter';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
const { Search } = Input;
import './index.less';
import { CHAPTER } from '@/common/entity/chapter'
import { API } from '@/common/entity/typings';

/**
 * 章节统计功能--章节统计详情
 * @param props 
 * @returns 
 */
const ChapterDetailIndex = (props: any) => {
  const courseId = props.courseId;
  const clazzId = props.clazzId;
  const chapterId = props.chapterId;
  const serialNum = props.serialNum;
  const resourcesId = props.resourcesId;
  const [node, setNode] = useState<CHAPTER.ChapterTaskDetailTitle>();
  const [userName, setUserName] = useState<string>('');
  const actionRef = useRef<API.ActionType>();

  useEffect(() => {
    //查询标题
    api_getCatalogueInfoTitle(courseId, chapterId, clazzId, resourcesId).then((res) => {
      if (res.success) setNode(res.obj)
    })

  }, []);

  const stuColumns: ProColumns<CHAPTER.ChapterTaskDetail>[] = [
    {
      title: '学号/工号',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '观看进度',
      dataIndex: 'proportion',
      align: 'center',
      render: (dom, record, index, action) => {
        return <Progress percent={record.proportion} />
      },
    },
    {
      title: '观看时长',
      dataIndex: 'duration',
      align: 'center',
      // sorter: true,
      sorter: (a, b) => a.duration - b.duration,
      render: (dom, record, index, action) => {
        return (record.duration / 60).toFixed(1) + '分钟'
      },
    },
    {
      title: '完成状态',
      dataIndex: 'studyStatus',
      align: 'center',
      sorter: (a, b) => a.studyStatus - b.studyStatus,
      render: (dom, record, index, action) => {
        return record.studyStatus == 1 ? '未完成' : '已完成';
      },
    },
    {
      title: '完成时间',
      dataIndex: 'completeTime',
      align: 'center',
    },
  ];
  /**
   * 刷新表格
   * @param value 
   */
  const onSearch = (value: string) => {
    actionRef.current?.reload();
  };
  const params = { courseId: courseId, catalogueId: chapterId, classId: clazzId, resourcesId: resourcesId, userName: userName };
  const $title = <div>
    <b>{serialNum} {node?.catalogueName}</b>
    <Button type="primary" style={{ marginLeft: 50 }} size="small"
      // onClick={() => history.push(`/teacher/course/chapter/statis/list/${courseId}/${chapterId}/${clazzId}/${serialNum}`)}
      onClick={() => window.history.go(-1)}
    >返回</Button>
  </div>
  return (
    <div className="chapter-statis-detail">
      {
        //如果没有时长，在时长位置显示章节名称
        node && node.resourcesTime > 0 ? $title : null
      }
      <div className='between'>
        <div>
          {
            node && node.resourcesTime > 0 ? `时长：${(node.resourcesTime / 60).toFixed(1)}分钟 ` : $title
          }
        </div>
        <Search placeholder="姓名/学号" onSearch={onSearch} style={{ width: 200 }} onChange={(e) => setUserName(e.target.value)} />
      </div>
      <div className='table-simple-div' style={{ marginBottom: 10 }}>
        <ProTable
          actionRef={actionRef}
          rowKey="userId"
          pagination={false}
          // params 是需要自带的参数
          params={params}
          request={async (
            // 第一个参数 params 查询表单和 params 参数的结合
            // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
            params,
            sort,
            filter,
          ) => {
            // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
            // 如果需要转化参数可以在这里进行修改            
            const msg = await api_getCatalogueInfo({ ...params, sort, filter });
            return {
              data: msg.obj,
              // success 请返回 true，不然 table 会停止解析数据，即使有数据
              success: msg.success,
              // 不传会使用 data 的长度，如果是分页一定要传
              // total: 1,
            };
          }}
          columns={stuColumns}
          search={false}
          toolBarRender={false}
        />
      </div>
    </div>
  )
};
export default ChapterDetailIndex;



