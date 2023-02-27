import { useState, useEffect } from 'react';
import { getExamList, deleteExam, updateExam, saveExamClass, getExamClassListByCourseId, 
  deleteExamClassById } from '@/services/teacher/course/exam'
import { getSclassByCourseId } from '@/services/teacher/clazz/sclass'
import { Divider, Button, message, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { history } from 'umi';
import './index.less';
import CreateExamModal from '@/pages/common-course/exam/components/CreateExamModal';
import CreateClassForm from '@/pages/common-course/exam/components/CreateExamClassForm';
import UpdateClassForm from '@/pages/common-course/exam/components/UpdateExamClassForm';
import { API } from '@/common/entity/typings';

const CourseExam = (props: any) => {
  const courseId = props.courseId;

  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);//新建作业
  const [createClassModalVisible, handCreateClassModalVisible] = useState<boolean>(false);//新建发放
  const [updateClassModalVisible, handleUpdateClassModalVisible] = useState<boolean>(false);//修改发放

  const [examList, setExamList] = useState<API.ExamListRecord[]>([]);//作业列表
  const [examClassList, setExamClassList] = useState<API.ExamClassListRecord[]>([]);//课程发放的作业班级
  const [classList, setClassList] = useState<API.SclassListRecord[]>([]);//根据课程，查询全部班级
  const [stepFormValues, setStepFormValues] = useState<Partial<API.ExamClassListRecord>>({});//修改作业对象

  useEffect(() => {
    fetchExam();
    fetchExamClass();
    getSclassByCourseId(courseId).then((result) => {
      if (result.success) setClassList(result.obj);
    })
  }, []);

  const fetchExam = () => {
    getExamList(courseId).then((result) => {
      if (result.success) setExamList(result.obj);
      else message.error("查询失败，" + result.message);
    })
  }
  const fetchExamClass = () => {
    getExamClassListByCourseId(courseId).then((result) => {
      if (result.success) setExamClassList(result.obj);
      else message.error("查询失败，" + result.message);
    })
  }
  /**
   * 删除作业
   * @param values 
   */
  const handDeleteExam = (values: API.ExamListRecord) => {
    Modal.confirm({
      title: '删除作业',
      content: `确定删除【${values.testName}】作业吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteExam(values.id).then((result) => {
          if (result.success) {
            message.success("删除成功");
            fetchExam();
          } else {
            message.error("删除失败，" + result.message);
          }
        })
      },
    });
  };
  /**
   * 删除发放的班级
   * @param exmaClassId 
   */
  const handDeleteExamClass = (values: API.ExamClassListRecord) => {
    Modal.confirm({
      title: '删除作业',
      content: `确定删除【${values.sclass?.className}】班的【${values.exam?.testName}】作业吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteExamClassById(values.id).then((result) => {
          if (result.success) {
            message.success("删除成功");
            fetchExamClass();
          } else {
            message.error("删除失败，" + result.message);
          }
        })
      },
    });
  };

  // const planClass = (record: API.ExamListRecord) => {
  //   getExamClassByExamId(record.id).then((result) => {
  //     //赋值给exam传入modal，用于回传examId
  //     setExam(result.obj);
  //     handleClassModalVisible(true)
  //   })
  // }
  const columns: ProColumns<API.ExamListRecord>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      align: 'center',
      width: '100px',
      render: (dom, record, index, action) => {
        return index + 1;
      },
    },
    {
      title: '作业名称',
      dataIndex: 'testName',
      align: 'center',
    },
    {
      title: '作业描述',
      dataIndex: 'testDesc',
      align: 'center',
    },
    {
      title: '题目总数',
      dataIndex: 'exerciseCount',
      align: 'center',
      width: '120px',
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      search: false,
      width: '250px',
      render: (_, record) => {
        let buttons = [];
        buttons.push(
          <a key='1' style={{ marginLeft: '15px' }} onClick={() => history.push(`/teacher/course/${courseId}/exam/${record.id}/info`)}>编辑</a>,
          <a key='2' style={{ marginLeft: '15px' }} onClick={() => handDeleteExam(record)}>删除</a>
        )
        return buttons;
      }
    }
  ];

  const class_columns: ProColumns<API.ExamClassListRecord>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      align: 'center',
      width: '100px',
      render: (dom, record, index, action) => {
        return index + 1;
      },
    },
    {
      title: '作业名称',
      dataIndex: 'testName',
      align: 'center',
      render: (dom, record, index, action) => {
        return record.exam?.testName;
      },
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      align: 'center',
      width: '120px',
      render: (dom, record, index, action) => {
        return record.sclass?.className;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'testStart',
      align: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'testEnd',
      align: 'center',
    },
    {
      title: '是否可见',
      dataIndex: 'testIsOpen',
      align: 'center',
      render: (dom, record, index, action) => {
        return record.testIsOpen ? '可见' : '不可见';
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      search: false,
      width: '250px',
      render: (_, record) => {
        let buttons = [];
        buttons.push(
          <a key='1' style={{ marginLeft: '15px' }} onClick={() => { handleUpdateClassModalVisible(true); setStepFormValues(record) }}>编辑</a>,
          <a key='2' style={{ marginLeft: '15px' }} onClick={() => handDeleteExamClass(record)}>删除</a>
        )
        return buttons;
      }
    },
    {
      title: '成绩单',
      dataIndex: 'option1',
      align: 'center',
      search: false,
      render: (_, record) => {
        let buttons = [];
        buttons.push(
          <a key='2' style={{ marginLeft: '15px' }} onClick={() => history.push(`/teacher/course/${courseId}/exam/report/${record.id}`)}>查看成绩单</a>
        )
        return buttons;
      }
    }
  ];

  return (
    <>
      <div className="title-4">作业列表</div>
      <div className="exam-tool">
        <Button type="primary" onClick={() => handleCreateModalVisible(true)}>添加作业</Button>
      </div>
      <div style={{ backgroundColor: '#ffffff', padding: 20, marginTop: '20px', borderRadius: '7px' }}>
        <ProTable
          rowKey="id"
          dataSource={examList}
          columns={columns}
          search={false}
          toolBarRender={false}
          pagination={false}
        />
      </div>

      <Divider />

      <div className="title-4">发放列表</div>
      <div className="exam-tool">
        <Button type="primary" onClick={() => handCreateClassModalVisible(true)}>发放作业到班级</Button>
      </div>
      <div style={{ backgroundColor: '#ffffff', padding: 20, marginTop: '20px', borderRadius: '7px' }}>
        <ProTable
          rowKey="id"
          dataSource={examClassList}
          columns={class_columns}
          search={false}
          toolBarRender={false}
          pagination={false}
        />
      </div>

      {/* 添加作业 */}
      <CreateExamModal
        onSubmit={async (value: API.ExamListRecord) => {
          const result = await updateExam({ ...value, courseId: courseId });
          if (result) {
            handleCreateModalVisible(false);
            history.push(`/teacher/course/${courseId}/exam/${result.obj}/info`);
          }
        }}
        onCancel={() => {
          handleCreateModalVisible(false);
        }}
        createModalVisible={createModalVisible}
      />

      {/* 添加班级作业 */}
      {createClassModalVisible ? (
        <CreateClassForm
          onSubmit={async (values: API.ExamClassListRecord) => {
            console.log('values', values)
            const result = await saveExamClass(values);
            if (result && result.success) {
              handCreateClassModalVisible(false);
              message.success('保存成功！');
              fetchExamClass();
            } else message.error(result.message);

          }}
          onCancel={() => {
            handCreateClassModalVisible(false);
          }}
          classModalVisible={createClassModalVisible}
          examList={examList}
          classList={classList}
          courseId={courseId}
        />
      ) : null
      }

      {/* 修改发放作业 */}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateClassForm
          onSubmit={async (values: API.ExamClassListRecord) => {
            console.log('values', values)
            const result = await saveExamClass(values);
            if (result && result.success) {
              handleUpdateClassModalVisible(false);
              message.success('保存成功！');
              setStepFormValues({});
              fetchExamClass();
            } else message.error(result.message);
          }}
          onCancel={() => {
            handleUpdateClassModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateClassModalVisible}
          values={stepFormValues}
          classList={classList}
          examList={examList}
        />
      ) : null}
    </>
  );
};
export default CourseExam;
