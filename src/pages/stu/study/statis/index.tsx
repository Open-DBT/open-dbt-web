import './index.less';
import { Space, Tabs } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getStudentCorrect, getStudentCoverage } from '@/services/student/progress'
import { useModel } from 'umi';
import { API } from '@/common/entity/typings';
type IProp = {
  courseId: number;
  clazzId: number;
};

/**
 * 课程-统计
 * @param props 
 * @returns 
 */
const statis = (props: IProp) => {
  const courseId = props.courseId;
  const clazzId = props.clazzId;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const columnsTab1: ProColumns<API.SclassCorrect>[] = [
    {
      title: '题目',
      dataIndex: 'exerciseName',
      render: (dom, record, index, action) => {
        let className = 'exercise-id';
        if (record.correctCount === 0) className += ' zero-background-color'
        return <Space size="middle">
          <div className={className}>#{record.id}</div>
          {/* http://localhost:8000/stu/sclass/24/course/44/know/392/exercise/413 */}
          <a href={`/stu/course/exercise/${courseId}/${clazzId}/0/${record.id}`} target="_blank">{record.exerciseName}</a>
        </Space>;
      },
    },
    {
      title: '已答对',
      dataIndex: 'correctCount',
      align: 'center',
      width: '100px',
      sorter: (a, b) => {
        return a.correctCount - b.correctCount
      },
      render: (dom, record, index, action) => {
        return <span className={record.correctCount === 0 ? 'zero-font-color' : ''}>{record.correctCount}</span>;
      },
    },
    {
      title: '我的提交次数',
      dataIndex: 'answerCount',
      align: 'center',
      width: '120px',
      sorter: (a, b) => {
        return a.answerCount - b.answerCount
      },
    },
    {
      title: '答对人数',
      dataIndex: 'allCorrectCount',
      align: 'center',
      width: '100px',
      sorter: (a, b) => {
        return a.allCorrectCount - b.allCorrectCount
      },
    },
    {
      title: '答题人数',
      dataIndex: 'allAnswerCount',
      align: 'center',
      width: '100px',
      sorter: (a, b) => {
        return a.allAnswerCount - b.allAnswerCount
      },
    },
    {
      title: '全班人数',
      dataIndex: 'stuCount',
      align: 'center',
      width: '100px',
    }
  ];
  const columnsTab2: ProColumns<API.StudentCoverage>[] = [
    {
      title: '学生姓名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '答对题数量',
      dataIndex: 'correctCount',
      align: 'center',
      width: '100px',
    },
    {
      title: '答题总数',
      dataIndex: 'answerCount',
      align: 'center',
      width: '100px',
    },
    {
      title: '总题目数',
      dataIndex: 'exerciseCount',
      align: 'center',
      width: '100px',
    },
    {
      title: () => {
        return <span>所有学生答对题目平均值<p className="stu-coverage-table-head-p">(答对题目数量/全班人数)</p></span>
      },
      dataIndex: 'avgCorrectCount',
      align: 'center',
      width: '180px',
      render: (dom, record, index, action) => {
        return <div className="student-coverage-div">
          {record.avgCorrectCount}&nbsp;&nbsp;
          {record.correctCount >= record.avgCorrectCount ?
            <img src={require('@/img/student/icon-higher.svg')} className="student-coverage-arrows"></img>
            :
            <img src={require('@/img/student/icon-low.svg')} className="student-coverage-arrows"></img>
          }
        </div>;
      },
    },
    {
      title: () => {
        return <span>所有学生答过题目平均值<p className="stu-coverage-table-head-p">(答过题目数量/全班人数)</p></span>
      },
      dataIndex: 'avgAnswerCount',
      align: 'center',
      width: '180px',
      render: (dom, record, index, action) => {
        return <div className="student-coverage-div">
          {record.avgAnswerCount}&nbsp;&nbsp;
          {record.answerCount >= record.avgAnswerCount ?
            <img src={require('@/img/student/icon-higher.svg')} className="student-coverage-arrows"></img>
            :
            <img src={require('@/img/student/icon-low.svg')} className="student-coverage-arrows"></img>
          }
        </div>;
      },
    }
  ];

  return (
    <div className="statis-info">
      <Tabs defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: '正确率',
            children:
              <ProTable
                rowKey="id"
                pagination={false}
                rowClassName={record => {
                  if (record.correctCount == 0) {
                    return 'table-row-color-zero';
                  }
                }}
                request={(params, sorter, filter) => {
                  return getStudentCorrect(clazzId, currentUser!.userId);
                }}
                columns={columnsTab1}
                search={false}
                toolBarRender={false}
              />
          }, {
            key: "2",
            label: '覆盖率',
            children:
              <ProTable
                rowKey="id"
                pagination={false}
                request={(params, sorter, filter) => {
                  return getStudentCoverage(clazzId, currentUser!.userId)
                }}
                columns={columnsTab2}
                search={false}
                toolBarRender={false}
              />
          }
        ]}
      />
    </div>
  );

};
export default statis;
