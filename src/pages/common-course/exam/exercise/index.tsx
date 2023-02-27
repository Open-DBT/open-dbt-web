import React, { useRef, useState, useEffect } from 'react';
import TabMenu from '../tabMenu';
import { Input, Button, message, Modal, Space } from 'antd';
import { getExamExerciseByExamId, saveExamExercise, batchDelExamExercise, sortExercise, 
  saveExamExerciseScore } from '@/services/teacher/course/exam';
import { getKnowledgeNotTree } from '@/services/teacher/course/course';
import { getShareScene } from '@/services/teacher/course/scene';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import AddModal from './add'
import { MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import './index.less'
import { EditableProTable } from '@ant-design/pro-table';
import { API } from '@/common/entity/typings';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const ExamExercise = (props: any) => {
  const examId = props.examId;
  const courseId = props.courseId;

  // const [exam, setExam] = useState<API.ExamListRecord>();
  // const [exerciseList, setExerciseList] = useState<API.ExerciseRecord[]>([]);
  const [addModalVisible, handleAddModalVisible] = useState<boolean>(false);//添加习题
  const [dataSource, setDataSource] = useState<API.ExamExerciseListRecord[]>([]);

  const [sceneNameEnum, setSceneNameEnum] = useState({});
  const [knowledgeNameEnum, setKnowledgeNameEnum] = useState({});
  const [selectExerciseId, setSelectExerciseId] = useState<number[]>([]);

  useEffect(() => {
    fetchTable();

    //查询场景列表,下拉使用
    getShareScene(courseId).then((result) => {
      const valueEnum = {};
      result.obj.map((item: API.SceneListRecord) => {
        const text = item.sceneName;
        valueEnum[item.sceneId!] = { text };
      });
      setSceneNameEnum(valueEnum);
    });

    //查询当前课程所有知识点,下拉列表使用
    getKnowledgeNotTree(courseId).then((result) => {
      const valueEnum = {};
      result.obj.map((item: API.KnowledgeListRecord) => {
        const text = item.name;
        valueEnum[item.knowledgeId] = { text };
      });
      setKnowledgeNameEnum(valueEnum);
    });

  }, []);

  const fetchTable = () => {
    getExamExerciseByExamId(examId).then((result) => {
      setDataSource(result.obj);
      //给可编辑protable赋值
      setEditableRowKeys(result.obj.map((item) => item.id))

      let exerciseIdArray: number[] = [];
      result.obj.map((item: API.ExamExerciseListRecord) => {
        exerciseIdArray.push(item.exerciseId);
      });
      setSelectExerciseId(exerciseIdArray);
    });
  }

  /**
   * table拖动事件
   */
  const SortableItem = SortableElement((props: any) => <tr {...props} />);
  const SortContainer = SortableContainer((props: any) => <tbody {...props} />);
  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    if (oldIndex !== newIndex) {
      // const newData = arrayMoveImmutable([...dataSource], oldIndex, newIndex).filter((el) => !!el);
      // setDataSource([...newData]);
      // console.log('onSortEnd ',dataSource[oldIndex],newIndex)
      sortExercise(dataSource[oldIndex].id, dataSource[newIndex].ordinal).then((result) => fetchTable());
    }
  };
  const DraggableContainer = (props: any) => (
    <SortContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );
  const DraggableBodyRow = (props: any) => {
    const { className, style, ...restProps } = props;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  /**
   * table编辑框事件
   */
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    dataSource.map((item) => item.id),
  );

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.ExamExerciseListRecord>[] = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      className: 'drag-visible',
      align: 'center',
      editable: false,
      render: () => <DragHandle />,
    },
    {
      title: '序号',
      dataIndex: 'ordinal',
      align: 'center',
      width: 80,
      editable: false,
      render: (dom, record, index, action) => {
        return index + 1;
      },
    },
    {
      title: '习题ID',
      dataIndex: 'exerciseId',
      align: 'center',
      width: 100,
      editable: false,
    },
    {
      title: '分值',
      dataIndex: 'score',
      align: 'center',
      width: 100,
      valueType: 'digit',
      // formItemProps: {
      //   rules: [
      //     {
      //       required: true,
      //       min: 0,
      //       message: '此项为必填项',
      //     },
      //   ],
      // },   
    },
    {
      title: '习题类型',
      dataIndex: 'a',
      align: 'center',
      width: 150,
      editable: false,
      render: (dom, record, index, action) => {
        return '课程习题';
      }
    },
    {
      title: '习题名称',
      dataIndex: 'testEnd',
      align: 'left',
      editable: false,
      render: (dom, record, index, action) => {
        return record.exercise.exerciseName;
      }
    },
  ]
  /**
   * table选择框事件
   */
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const rowSelection = {
    onChange: (selectedRowKeys: number[], selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys)
    },
  };
  /**
   * 批量移除习题
   */
  const batchDel = () => {
    if (selectedRowKeys.length === 0) {
      message.warn('请选择移除习题');
      return;
    }
    Modal.confirm({
      title: '移除习题',
      content: `确定移除所选习题吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        batchDelExamExercise(examId, selectedRowKeys).then((result) => {
          if (result && result.success) {
            message.success('移除习题成功')
            //清空选择
            setSelectedRowKeys([])
            actionRef.current!.clearSelected!();
            //刷新表格
            fetchTable();
          } else {
            message.error(result.message);
          }
        })
      },
    });
  }

  /**
   * 批量保存得分
   */
  const saveScore = () => {
    console.log('dataSource', dataSource)
    let exerciseIds: number[] = [];
    let values: number[] = [];

    dataSource.map((item, index) => {
      exerciseIds.push(item.exerciseId)
      values.push(item.score)
    })
    saveExamExerciseScore(examId, exerciseIds, values).then((result) => {
      if (result && result.success) {
        message.success('保存得分成功')
        //刷新表格
        fetchTable();
      } else {
        message.error(result.message);
      }
    })
  }

  return (
    <div className="exam-exercise">
      <TabMenu {...props} />

      <Space style={{ marginTop: '10px' }} size="small">
        <Button type="primary" onClick={() => handleAddModalVisible(true)}>添加习题</Button>
        <Button type="primary" onClick={() => batchDel()} danger>移除习题</Button>
        <Button onClick={() => saveScore()}>保存分值</Button>
        <div style={{ width: '240px', height: '35px', marginTop: '0px', background: '#FDDF66', borderRadius: '5px', color: '#333333', padding: '8px' }}>
          <img style={{ margin: '-5px 8px 0px 8px' }} src={require('@/img/student/icon-warn.svg')} />
          拖动习题前，请先保存分值！
        </div>
      </Space>

      <div className="course-info">
        <EditableProTable
          actionRef={actionRef}
          rowKey="id"
          value={dataSource}
          //react-sortable-hoc暂不支持request
          // request={(params, sorter, filter) => getExamExerciseByExamId(examId, { ...params, sorter, filter })}
          columns={columns}
          search={false}
          toolBarRender={false}
          pagination={false}
          rowSelection={{
            ...rowSelection
          }}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
          recordCreatorProps={false}
          editable={{
            type: 'multiple',
            editableKeys,
            actionRender: (row, config, defaultDoms) => {
              return [defaultDoms.delete];
            },
            onValuesChange: (record, recordList) => {
              // setDataSource(recordList);
              console.log('record', record)
              console.log('recordList', recordList)
              let row1 = dataSource.find((item) => item.id === record.id);
              if(row1)row1.score = record.score;              
            },
            onChange: setEditableRowKeys,
          }}
        />
      </div>

      {addModalVisible ? (
        <AddModal
          onSubmit={async (ids: number[]) => {
            console.log('onFinish value:', ids);
            const result = await saveExamExercise(examId, ids)
            if (result.success) {
              message.success('保存成功');
              //刷新页面和表格
              handleAddModalVisible(false);
              fetchTable();
            } else {
              message.error(result.message);
              return;
            }
          }}
          onCancel={() => {
            handleAddModalVisible(false);
          }}
          addModalVisible={addModalVisible}
          courseId={courseId}
          //模糊查询常量
          sceneNameEnum={sceneNameEnum}
          knowledgeNameEnum={knowledgeNameEnum}
          selectExerciseId={selectExerciseId}
        />
      ) : null}
    </div >
  );
};
export default ExamExercise;
