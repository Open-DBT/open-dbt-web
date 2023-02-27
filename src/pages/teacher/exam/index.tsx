import { useState, useEffect } from 'react';
import { Button, message, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getExamClassListByClassId } from '@/services/teacher/course/exam'
import { querySclass } from '@/services/teacher/clazz/sclass'
import './index.less'
import { getExamList, saveExamClass, deleteExamClassById } from '@/services/teacher/course/exam'
import CreateClassForm from './components/CreateExamClassForm';
import UpdateClassForm from './components/UpdateExamClassForm';
import { history } from 'umi';
import { API } from '@/common/entity/typings';
const TeacherSclass = (props: any) => {

  const classId = props.sclassId;
  const [scalssInfo, setScalssInfo] = useState<API.SclassRecord>();
  const [createClassModalVisible, handCreateClassModalVisible] = useState<boolean>(false);//新建发放
  const [updateClassModalVisible, handleUpdateClassModalVisible] = useState<boolean>(false);//修改发放
  const [examClassList, setExamClassList] = useState<API.ExamClassListRecord[]>([]);//课程发放的作业班级
  const [examList, setExamList] = useState<API.ExamListRecord[]>([]);//作业列表
  const [stepFormValues, setStepFormValues] = useState<Partial<API.ExamClassListRecord>>({});//修改作业对象

  useEffect(() => {
    fetchExamClass();
    fetchExam();
  }, []);

  const fetchExam = () => {
    querySclass(classId).then((result) => {
      if (result.success && result.obj && result.obj.courseId) {
        setScalssInfo(result.obj);
        getExamList(result.obj.courseId).then((result) => {
          if (result.success) setExamList(result.obj);
          else message.error("查询失败，" + result.message);
        })
      }
    });
  }

  const fetchExamClass = () => {
    getExamClassListByClassId(classId).then((result) => {
      if (result.success) setExamClassList(result.obj);
      else message.error("查询失败，" + result.message);
    })
  }

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

  const columns: ProColumns<API.ExamClassListRecord>[] = [
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
          <a key='2' style={{ marginLeft: '15px' }} onClick={() => history.push(`/teacher/sclass/${classId}/course/${scalssInfo?.courseId}/exam/report/${record.id}`)}>查看成绩单</a>
        )
        return buttons;
      }
    }
  ];
  return (
    <>
      <div className="title-4">作业列表</div>
      <div className="exam-tool">
        <Button type="primary" onClick={() => handCreateClassModalVisible(true)}>发放作业到班级</Button>
      </div>
      <div style={{ backgroundColor: '#ffffff', padding: 20, marginTop: '20px', borderRadius: '7px' }}>
        <ProTable
          rowKey="id"
          dataSource={examClassList}
          columns={columns}
          search={false}
          toolBarRender={false}
          pagination={false}
        />
      </div>

      {/* 添加班级作业 */}
      {createClassModalVisible ? (
        <CreateClassForm
          onSubmit={async (values: API.ExamClassListRecord) => {
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
          scalssInfo={scalssInfo!}
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
        />
      ) : null}
    </>
  );
};

export default TeacherSclass;
