import { useEffect, useState } from 'react';
import { api_getStudentInfo } from '@/services/teacher/course/chapter';
import { Pie } from '@ant-design/plots';
import { sortList } from '../utils/utils'
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Progress } from 'antd';
import './index.less';
import { CHAPTER } from '@/common/entity/chapter'

interface IProps {
  courseId: number;
  chapterId: number;
  clazzId: number;
  userId: number;
  serialNum: string;
}
/**
 * 章节统计-学生详情
 * @param props 
 * @returns 
 */
const ChapterStudentDetailIndex = (props: IProps) => {
  const courseId = props.courseId;
  const clazzId = props.clazzId;
  const serialNum = props.serialNum;
  const userId = props.userId;
  const chapterId = props.chapterId;
  const [data, setData] = useState<CHAPTER.CourseChapterStatStudentProcess>();
  const [pieData, setPieData] = useState<{ type: string, value: number }[]>([]);
  const [chapterList, setChapterList] = useState<CHAPTER.CourseChapterStat[]>([]);
  const [completeNum, setCompleteNum] = useState<number>(0);
  const [countNum, setCountNum] = useState<number>(0);

  //demo案例见详情---https://charts.ant.design/zh/examples/pie/donut#basic
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
    //true=1级菜单，false=非1级菜单
    const isFirstChapter = serialNum && serialNum.indexOf('\.') == -1;

    api_getStudentInfo(courseId, chapterId, clazzId, userId, serialNum).then((res) => {
      console.log('api_getStudentInfo res', res)
      if (res.success) {
        setData(res.obj)
        setPieData([{ type: '已完成进度', value: res.obj.completeNum }, { type: '未完成进度', value: res.obj.countNum - res.obj.completeNum }])
        setCompleteNum(res.obj.completeNum)//完成数字
        setCountNum(res.obj.countNum)//总数
        const treeList = res.obj.courseCatalogueTree;
        console.log('res.obj.courseCatalogueTree', treeList)
        if (treeList && treeList.length > 0) {
          const _0 = treeList[0] as CHAPTER.CourseChapterStat;//第一条数据
          console.log('_0', _0)
          if (isFirstChapter) {
            const afterSortList = sortList(treeList) as CHAPTER.CourseChapterStat[];
            setChapterList(afterSortList[0].childrens)
          } else setChapterList(treeList) //非一级菜单
        }
      }
    })
  }, []);

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

  console.log('chapterList', chapterList)
  return (
    <div className="chapter-statis-stu">
      <div style={{ backgroundColor: '#FFFFFF', display: 'flex', padding: '20px 40px' }}>
        <div style={{ marginRight: 20 }}>
          <Pie data={pieData} {...config} />
        </div>
        {
          data &&
          <div style={{ marginTop: 16 }}>
            <p style={{ margin: 0 }}><b>{data?.userName}</b></p>
            <span>{`${data?.userName}   | ${data?.className}`}  </span>
          </div>
        }
      </div>
      <div style={{ marginTop: 16 }}>
        {
          chapterList.length > 0 &&
          chapterList.map((element, index) => {
            if (element.studentCatalogueStatistics.length == 0) {
              return;
            }
            return <div className='table-simple-div' style={{ marginBottom: 10 }} key={index}>
              <p><b>{element.serialNum} {element.catalogueName}</b></p>
              <ProTable
                rowKey="resourcesId"
                pagination={false}
                dataSource={element.studentCatalogueStatistics}
                columns={chapterColumns}
                search={false}
                toolBarRender={false}
              />
            </div>
          })
        }
      </div>

    </div>
  )
};
export default ChapterStudentDetailIndex;



