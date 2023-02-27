import { useEffect, useState, useRef } from 'react';
import { Input, Tabs } from 'antd';
import { api_getCatalogueProgress, api_getStudentProgress } from '@/services/teacher/course/chapter';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { history } from 'umi';
import { sortList } from '../utils/utils'
const { Search } = Input;
import './index.less';
import { CHAPTER } from '@/common/entity/chapter'
import { API } from '@/common/entity/typings';

interface IProps {
  courseId: number;
  chapterId: number;
  clazzId: number;
  serialNum: string;
}

/**
 * 章节目录统计首页
 * @param props 
 * @returns 
 */
const ChapterHome = (props: IProps) => {
  const courseId = props.courseId;
  const clazzId = props.clazzId;
  const chapterId = props.chapterId;
  const serialNum = props.serialNum;
  const [listData, setListData] = useState<CHAPTER.CourseChapterStat[]>([]);//选中章节列表后的跳转,后台给的数据肯定是>=1的
  const [parentNode, setParentNode] = useState<CHAPTER.CourseChapterStat>();//选中目录的上层目录，如果点击不是一级目录，上层目录就是自己
  const [userName, setUserName] = useState<string>('');
  const actionRef = useRef<API.ActionType>();
  const isFirstChapter = serialNum && serialNum.indexOf('\.') == -1;    //true=1级菜单，false=非1级菜单

  useEffect(() => {
    //章节统计
    api_getCatalogueProgress(courseId, chapterId, clazzId, serialNum).then((res) => {
      if (res.success) {
        if (res.obj.length > 0) {
          const _0 = res.obj[0] as CHAPTER.CourseChapterStat;//第一条数据
          if (isFirstChapter) {
            //判断是否为一级菜单，如果是一级菜单，要显示出来
            setParentNode(_0);
            const list = sortList(res.obj) as CHAPTER.CourseChapterStat[];
            setListData(list[0].childrens)
          } else setListData(res.obj) //非一级菜单
        }
      }
    })

  }, []);
  //章节的tab
  const chapterColumns: ProColumns<CHAPTER.ChapterTask>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: '12%',
      render: (dom, record, index, action) => {
        return '任务点' + (index + 1);
      },
    },
    {
      title: '任务名',
      dataIndex: 'resourcesName',
      align: 'center',
      // width: '120px',
    },
    {
      title: '类型',
      dataIndex: 'resourcesType',
      align: 'center',
      width: '13%',
    },
    {
      title: '时长',
      dataIndex: 'resourcesTime',
      align: 'center',
      width: '13%',
      render: (dom, record, index, action) => {
        return (record.resourcesTime / 60).toFixed(1) + '分钟';
      },
    },
    {
      title: '学生完成数',
      dataIndex: 'completeNum',
      align: 'center',
      width: '13%',
      render: (dom, record, index, action) => {
        return <span><span style={{ color: '#00CE9B' }}>{record.completeNum}</span>/{record.totalNum}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'stuCount',
      align: 'center',
      width: '15%',
      render: (_, row, index, action) => [
        <a
          key="a"
          onClick={() => {
            const url = `/teacher/course/chapter/statis/detail/${courseId}/${row.chapterId}/${clazzId}/${serialNum}/${row.resourcesId}`;
            history.push(url);
          }}
        >
          查看
        </a>,
      ],
    }
  ];
  //学生的tabs
  const stuColumns: ProColumns<CHAPTER.ChapterStatStudent>[] = [
    {
      title: '姓名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '学号/工号',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '任务点完成数',
      dataIndex: 'countNum',
      align: 'center',
      sorter: (a, b) => a.completeNum - b.completeNum,
      render: (dom, record, index, action) => {
        return <span><span style={{ color: '#00CE9B' }}>{record.completeNum}</span>/{record.countNum}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'stuCount',
      align: 'center',
      width: '120px',
      render: (_, row, index, action) => [
        <a
          key="a"
          onClick={() => {
            const url = `/teacher/course/chapter/statis/student/process/${courseId}/${chapterId}/${clazzId}/${serialNum}/${row.userId}`;
            window.open(url)
          }}
        >
          查看
        </a>,
      ],
    }
  ];

  /**
   * 搜索后刷新表格
   * @param value 
   */
  const onSearch = (value: string) => {
    actionRef.current?.reload();
  };

  //ProTable 固定参数
  const studentParams = { courseId: courseId, catalogueId: chapterId, classId: clazzId, userName: userName, isFirstLevel: isFirstChapter ? 1 : 0 };
  return (
    <div className="chapter-statis">
      <Tabs defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: '章节统计',
            children: <>
              {parentNode && <p><b>{parentNode?.serialNum} {parentNode?.catalogueName}</b></p>}
              {
                listData.length > 0 &&
                listData.map((element, index) => {
                  if (element.catalogueStatistics == null || element.catalogueStatistics.length == 0) {
                    return;
                  }
                  element.catalogueStatistics.forEach(item => item.chapterId = element.id)
                  return <div className='table-simple-div' style={{ marginBottom: 10 }} key={index}>
                    <p><b>{element.serialNum} {element.catalogueName}</b></p>
                    <ProTable
                      rowKey="resourcesId"
                      pagination={false}
                      dataSource={element.catalogueStatistics}
                      columns={chapterColumns}
                      search={false}
                      toolBarRender={false}
                    />
                  </div>
                })
              }
            </>
          }, {
            key: "2",
            label: '学生进度',
            children:
              <>
                <div className='between'>
                  {
                    parentNode ? <p><b>{parentNode?.serialNum} {parentNode?.catalogueName}</b></p>
                      : listData.length > 0 ? <p><b>{listData[0].serialNum} {listData[0].catalogueName}</b></p> : null
                  }
                  <Search placeholder="姓名/学号" onSearch={onSearch} style={{ width: 200 }} onChange={(e) => setUserName(e.target.value)} />
                </div>

                <div className='table-simple-div' style={{ marginBottom: 10 }} >
                  <ProTable
                    actionRef={actionRef}
                    rowKey="userId"
                    pagination={false}
                    // dataSource={sutdentList}
                    // params 是需要自带的参数
                    params={studentParams}
                    request={async (
                      // 第一个参数 params 查询表单和 params 参数的结合
                      // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
                      params,
                      sort,
                      filter,
                    ) => {
                      // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                      // 如果需要转化参数可以在这里进行修改            
                      const msg = await api_getStudentProgress({ ...params, sort, filter });
                      return {
                        data: msg.obj,
                        // success 请返回 true，不然 table 会停止解析数据，即使有数据
                        success: true,
                        // 不传会使用 data 的长度，如果是分页一定要传
                        // total: 1,
                      };
                    }}
                    columns={stuColumns}
                    search={false}
                    toolBarRender={false}
                  // onChange={handleTableChange}
                  />
                </div>
              </>
          }
        ]}
      />
    </div >
  );
};
export default ChapterHome;



