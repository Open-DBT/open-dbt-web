import { useRef, useState, useEffect } from 'react';
import '@/pages/common-course/course-common.less';
import '@/pages/home.less';
import './index.less';
import { deleteSclassStu, queryClassStuNotPage, batchDelSclassStu } from '@/services/teacher/clazz/sclass'
import { updateCenter } from '@/services/system/user'
import { Input, Button, message, Modal, Divider } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import * as APP from '@/app';
import AddStuForm from './components/AddStuForm';
import UpdateForm from './components/UpdateForm';
import { API } from '@/common/entity/typings';
/**
 * 学生端首页
 * @param props 
 * @returns 
 */
const StudentIndex = (props: any) => {

  const sclassId = props.sclassId;

  const [studentList, setStudentList] = useState<API.UserListItem[]>([]);
  const [name, setName] = useState<string>('');

  const actionRef = useRef<ActionType>();
  const [tabPage, setTabPage] = useState<string>('1');//显示当前tab
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);//新建
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);//修改
  const [stepFormValues, setStepFormValues] = useState<Partial<API.UserListItem>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  useEffect(() => {
    reload();
  }, []);

  const getQueryClassStuNotPage = () => {
    queryClassStuNotPage({ sclassId: sclassId, keyWord: name }).then((result) => {
      if (result.success) setStudentList(result.obj);
      else message.error(result.message);
    });
  }

  const reload = () => {
    getQueryClassStuNotPage();
  }

  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      align: 'center',
      render: (dom, record, index, action) => {
        return index + 1;
      },
    },
    {
      title: 'userId',
      dataIndex: 'userId',
      search: false,
      hideInTable: true,//是否隐藏
      hideInForm: true//表格新建是否显示此列
    },
    {
      title: '工号/学号',
      dataIndex: 'code',
      align: 'center',
      sorter: (a, b) => a.code - b.code,
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      search: false,
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      search: false,
      render: (_, record) => {
        let buttons = [];
        buttons.push(
          <a key='5' onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record) }}>修改</a>,
          <Divider key='42' type="vertical" />,
          <a key='1' onClick={() => { delSclassStu(record, sclassId) }}>删除</a>,
        )
        return buttons;
      }
    }
  ]
  
  /**
   * 单个删除
   * @param record 
   * @param sclassId 
   */
  const delSclassStu = async (record: API.UserListParams, sclassId: string) => {
    Modal.confirm({
      title: `删除`,
      content: <div>
        <p>学号：{record.code}</p>
        <p>姓名：{record.userName}</p>
        <p>确认要删除本学生？</p>
      </div>,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await deleteSclassStu({ userId: record.userId!, sclassId: sclassId });
          if (!result.success) {
            message.error(result.message);
            return;
          }
          message.success('删除成功');
          if (actionRef.current) {
            reload();
          }
        } catch (error) {
          message.error('删除失败，请重试');
          console.log('error ', error)
        }
      },
    });
  };

  /**
   * 批量删除
   * @returns 
   */
  const batchDel = () => {
    if (selectedRowKeys.length === 0) {
      message.info('请选择要删除的学生');
      return;
    }
    batchDelSclassStu({ userId: selectedRowKeys, sclassId: sclassId },).then((result) => {
      if (result.success) {
        message.success('批量删除成功');
        actionRef.current!.clearSelected!();
        reload();
      } else {
        message.error(result.message);
      }
    })
  }

  /**
   * 下载导入xls模板
   */
  const downloadTemplate = async () => {
    const link = document.createElement('a');
    const evt = document.createEvent('MouseEvents');
    link.style.display = 'none';
    link.href = `${APP.request.prefix}/files/importStudentTemplate.xls`;
    link.download = "importStudentTemplate.xls";
    document.body.appendChild(link); // 此写法兼容可火狐浏览器
    evt.initEvent('click', false, false);
    link.dispatchEvent(evt);
    document.body.removeChild(link);// 下载完成移除元素
    window.URL.revokeObjectURL(link.href); // 释放掉blob对象
  };

  /**
   * Table选中事件
   */
  const rowSelection: any = {
    onChange: (selectedRowKeys: number[], selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys)
    },
  };

  return (
    <>
      <div className="title-4">学生</div>
      <div className="flex class-tool" style={{ marginBottom: 20 }}>
        <div>
          <Button type="primary" onClick={() => { handleCreateModalVisible(true); setTabPage('1') }}>
            <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-add-2.svg')} />
            添加学生
          </Button>
          <Button type="primary" style={{ color: '#333333', background: '#FDDF66', borderColor: '#FDDF66' }}
            onClick={() => { handleCreateModalVisible(true); setTabPage('2') }}
          >
            <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-import.svg')} />
            一键导入
          </Button>
          <Button type="primary" style={{ color: '#333333', background: '#FFFFFF', borderColor: '#DCDCDC' }} onClick={downloadTemplate}>
            <img style={{ margin: '-3px 10px 0px 0px' }} src={require('@/img/teacher/icon-download.svg')} />
            下载xls模板
          </Button>
          <Button type="primary" danger onClick={() => { batchDel() }}>
            批量删除
          </Button>
          <p style={{ marginTop: 10 }}>共&nbsp;{studentList?.length}&nbsp;名学生</p>
        </div>
        <div>
          <Input
            style={{ width: '230px', marginRight: 14 }}
            placeholder="搜索学生姓名或学号"
            onChange={(v: any) => setName(v.target.value)}
            allowClear
          />
          <Button type="primary" onClick={() => getQueryClassStuNotPage()}>查询</Button>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: 20 }}>
        <ProTable
          actionRef={actionRef}
          rowKey="userId"
          dataSource={studentList}
          columns={columns}
          search={false}
          toolBarRender={false}
          rowSelection={{
            ...rowSelection,
          }}
          pagination={false}
        />
      </div>

      <AddStuForm
        onCancel={() => {
          handleCreateModalVisible(false);
          if (actionRef.current) {
            reload();
          }
        }}
        createModalVisible={createModalVisible}
        sclassId={sclassId}
        tabPage={tabPage}
      />

      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value: API.UserListParams) => {
            console.log('value', value);
            const result = await updateCenter(value);
            if (result && result.success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              message.success("修改成功");
              if (actionRef.current) {
                reload()
              }
            } else {
              message.error(result.message);
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </>
  );
};

export default StudentIndex;
