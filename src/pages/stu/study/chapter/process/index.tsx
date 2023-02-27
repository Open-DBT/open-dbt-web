import { useEffect, useState, useRef } from 'react';
import { useModel } from 'umi';
import { api_getStudentInfo } from '@/services/teacher/course/chapter';
import './index.less';
import { sortList } from '../utils/utils'
import ProTable from '@ant-design/pro-table';
import { Pie } from '@ant-design/plots';
import type { ProColumns } from '@ant-design/pro-table';
import { Progress } from 'antd';
import { CHAPTER } from '@/common/entity/chapter'

type IProp = {
  courseId: number;
  clazzId: number;
};

/**
 * 课程-章节-章节进度
 * @param props 
 * @returns 
 */
const ProgressIndex = (props: IProp) => {
  const { initialState } = useModel('@@initialState');
  const courseId = props.courseId;
  const clazzId = props.clazzId;

  const { currentUser } = initialState || {};
  const userId = currentUser?.userId;
  const [data, setData] = useState<CHAPTER.CourseChapterStatStudentProcess>();
  const [pieData, setPieData] = useState<{ type: string, value: number }[]>([]);
  const [chapterList, setChapterList] = useState<CHAPTER.CourseChapterStat[]>([]);
  const [completeNum, setCompleteNum] = useState<number>(0);
  const [countNum, setCountNum] = useState<number>(0);
  const config = {
    angleField: 'value',//对应data中的value字段
    colorField: 'type',//对应data中的type字段
    autoFit: false,//是否自适应
    width: 80,
    height: 80,
    appendPadding: 0,
    radius: 1,
    innerRadius: 0.7,//饼图的内半径，原点为画布中心，值越靠近1，内径越细
    color: ['#00CE9B ', '#E5E5E5'],
    label: false,//关闭数值提示   --存在语法兼容错误提示
    tooltip: false,//关闭悬浮提示   --存在语法兼容错误提示
    legend: false,//关闭图例        --存在语法兼容错误提示
    statistic: {
      title: false,//--存在语法兼容错误提示
      content: {//--存在语法兼容错误提示
        style: {
          fontSize: 20,
        },
        content: completeNum + '/' + countNum,
      },
    },
  }

  useEffect(() => {
    getStudentInfo()
  }, [])

  /**
* 获取统计数据
* @returns 
*/
  const getStudentInfo = () => {
    setChapterList([])
    userId && api_getStudentInfo(courseId, -1, clazzId, userId, '1').then((res) => {
      console.log('api_getStudentInfo res', res)
      if (res.success) {
        setData(res.obj)
        setPieData([{ type: '已完成进度', value: res.obj.completeNum }, { type: '未完成进度', value: res.obj.countNum - res.obj.completeNum }])
        setCompleteNum(res.obj.completeNum)//完成数字
        setCountNum(res.obj.countNum)//总数
        const treeList = res.obj.courseCatalogueTree;
        if (treeList && treeList.length > 0) {
          setChapterList(sortList(treeList) as any[])
        }
      }
    })
  }

  const chapterColumns: ProColumns<CHAPTER.CourseChapterStatStudentProcessResource>[] = [
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
    },
    {
      title: '类型',
      dataIndex: 'resourcesType',
      align: 'center',
      width: '12%',
    },
    {
      title: '观看进度',
      dataIndex: 'proportion',
      align: 'center',
      width: '14%',
      render: (dom, record, index, action) => {
        return <Progress percent={record.proportion} />
      },
    },
    {
      title: '观看时长',
      dataIndex: 'duration',
      align: 'center',
      width: '12%',
      render: (dom, record, index, action) => {
        return (record.duration / 60).toFixed(1) + '分钟';
      },
    },
    {
      title: '完成状态',
      dataIndex: 'studyStatus',
      align: 'center',
      width: '12%',
      render: (dom, record, index, action) => {
        return record.studyStatus == 1 ? '未学完' : '已学完';
      },
    },
    {
      title: '完成时间',
      dataIndex: 'completeTime',
      align: 'center',
      width: '15%',
    }
  ];
  return (
    <>
      <div className='chapter-progress' style={{ backgroundColor: '#FFFFFF', display: 'flex', padding: '20px 40px' }}>
        <div style={{ marginRight: 20 }}>
          <Pie data={pieData} {...config} />
        </div>
        {
          //为了不显示undefined
          data && <div style={{ marginTop: 16 }}>
            <p style={{ margin: 0 }}><b>{data?.userName}</b></p>
            <span>{`${data?.userName}   | ${data?.className}`}  </span>
          </div>
        }
      </div>
      {
        chapterList.length > 0 && chapterList.map((element, index) => {
          return <div style={{ marginTop: 16 }} key={index}>
            {
              element.childrens != null && element.childrens.length > 0 &&
              element.childrens.map((item, i) => {
                if (item.studentCatalogueStatistics.length == 0) {
                  return;
                }
                if (item.studentCatalogueStatistics.length != 0) {
                  return <div className='table-simple-div' style={{ marginBottom: 10 }} key={i}>
                    <p><b>{item.serialNum} {item.catalogueName} </b></p>
                    <ProTable
                      rowKey="resourcesId"
                      pagination={false}
                      dataSource={item.studentCatalogueStatistics}
                      columns={chapterColumns}
                      search={false}
                      toolBarRender={false}
                    />
                  </div>
                }
                return;
              })
            }
          </div>
        })
      }
    </>
  )
}
export default ProgressIndex