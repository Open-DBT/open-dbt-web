import { useState } from 'react';
import '@/pages/common-course/course-common.less';
import { Tooltip, Button, Tag, Select, Input, Space } from 'antd';
import { getKnowledgeColor } from '@/utils/utils';
import { history } from 'umi';
import ImportExerciseModal from './components/ImportExerciseModal'
import { Table, Checkbox, message } from 'antd';
import './content.less'
import { batchRemoveExercise, batchBuildScene } from '@/services/teacher/course/exercise';
import BuildScene from './components/BuildScene'
import { API } from '@/common/entity/typings';

type IProp = {
  type: number;//0查看权限，1编辑权限
  exerciseList: API.ExerciseRecord[];
  courseId: number;

  //按钮组
  toView: (value: number) => void;
  deleteExerciseModal: (record: API.ExerciseRecord) => void;

  //模糊查询
  sceneId: number | undefined;
  knowledgeId: number | undefined;
  exerciseDesc: string;
  allKnowledge: API.KnowledgeListRecord[];
  allScene: API.SceneListRecord[];
  setSceneId: (value: number | undefined) => void;
  setKnowledgeId: (value: number | undefined) => void;
  setExerciseDesc: (value: string) => void;
  fetchExerciseList: () => void;
  resetFetchExerciseList: () => void;
  exportExercise: () => void;
};

const Content = (props: IProp) => {
  //复制习题
  // const toCopy = (record: API.ExerciseRecord) => {
  //     handleCopyModalVisible(true);
  //     setStepFormValues(record)
  // }

  const [importExerciseModalVisible, setImportExerciseModalVisible] = useState<boolean>(false);
  const [sceneModalVisible, handleSceneModalVisible] = useState<boolean>(false);//绑定场景弹窗

  const hoverContent = (record: API.ExerciseRecord) => {
    return <div className="card-buttons">
      <Button style={{ marginRight: 10 }} className="gray-button" onClick={() => props.toView(record.exerciseId)}>查看</Button>
      <Button type="primary" style={{ marginRight: 10 }} onClick={() => history.push(`/expert/course/${props.courseId}/exercise/${record.exerciseId}/update`)}>编辑</Button>
      <Button className="gray-button" onClick={() => { props.deleteExerciseModal(record) }}>删除</Button>
    </div>
  };

  const recordRow = (record: API.ExerciseRecord, index: Number) => {
    return <Tooltip
      placement="right"
      title={hoverContent(record)}
      trigger="click"
      key={index + ""}
      overlayClassName="exercise-card-buttons"
      align={{
        offset: [-250, 0],//x,y
      }}
    >
      <div key={index + ""} className="flex exercise-card">
        <div className="card-index">
          #{record.exerciseId}
        </div>
        <span className="title-2" style={{ marginRight: 8 }}>{record.exerciseName}</span>
        {record?.knowledgeNames.map((ele: string, index: number) => {
          return <Tag key={index + ""} color={getKnowledgeColor()[index]}>{ele}</Tag>
        })}
      </div>
    </Tooltip>
  }
  const columns = [
    {
      title: 'content',
      dataIndex: 'content',
      render: (text: String, record: API.ExerciseRecord, index: number) => {
        return recordRow(record, index)
      }
    },
  ];
  const [allCheck, setAllCheck] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: number[], selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
      setSelectedRowKeys(selectedRowKeys)
      //校验checkbox状态
      checkBoxStatus(selectedRowKeys.length, props.exerciseList.length)
    }
  };
  /**
   * checkbox全选/取消全选事件
   */
  const onAllCheckChange = () => {
    const selectLength = selectedRowKeys.length;
    const srcLength = props.exerciseList.length;
    setSelectedRowKeys([])

    if (selectLength != srcLength) {
      //没有全选，点击进行全选
      const allCheck: number[] = props.exerciseList.map((item, index) => {
        return item.exerciseId;
      })
      setSelectedRowKeys(allCheck)
      setAllCheck(true)
    } else {
      setAllCheck(false)
    }
  }
  /**
   * 校验checkbox状态
   * @param selectLength 
   * @param srcLength 
   */
  const checkBoxStatus = (selectLength: number, srcLength: number) => {
    console.log('selectLength', selectLength, 'srcLength', srcLength)
    if (selectLength === srcLength) {
      //全选
      setAllCheck(true)
    } else {
      //非全选
      setAllCheck(false)
    }
  }
  /**
   * 批量删除
   */
  const onBatchRemove = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择习题！');
      return;
    }
    batchRemoveExercise(selectedRowKeys).then((result) => {
      if (result && result.success) {
        message.success('批量删除成功');
        props.resetFetchExerciseList();
      }
      else message.error('批量删除失败')
    });
  }
  /**
   * 批量绑定场景,点击弹窗
   */
  const onBatchBuildScene = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择习题！');
      return;
    }
    handleSceneModalVisible(true)
  }
  return (
    <>
      <div className="title-4">习题</div>
      <div className="flex exercise-tool">
        <div className="tools">
          {
            props.type === 0 ? null
              : <Button type="primary" onClick={() => history.push(`/expert/course/${props.courseId}/exercise/create`)}>新建习题</Button>
          }
          <Button type="primary" onClick={() => props.exportExercise()}>一键导出习题</Button>
          {
            props.type === 0 ? null
              : <Button type="primary" onClick={() => setImportExerciseModalVisible(true)}>导入习题</Button>
          }
          <p style={{ margin: '5px 0 0 0' }}>共&nbsp;{props.exerciseList?.length}&nbsp;道习题</p>
        </div>
        <div className="search">
          <Select
            style={{ width: '150px', marginRight: 10 }}
            placeholder="场景"
            onSelect={(val: number) => props.setSceneId(val)}
            value={props.sceneId}
            allowClear
            onClear={() => { props.setSceneId(undefined) }}
          >
            {
              props.allScene.map((item, index) => {
                return <Select.Option key={item.sceneId} value={item.sceneId}>{item.sceneName}</Select.Option>
              })
            }
          </Select>
          <Select
            style={{ width: '150px', marginRight: 10 }}
            placeholder="知识点"
            onSelect={(value: number) => props.setKnowledgeId(value)}
            value={props.knowledgeId}
            allowClear
            onClear={() => { props.setKnowledgeId(undefined) }}
          >
            {
              props.allKnowledge.map((item, index) => {
                return <Select.Option key={item.knowledgeId} value={item.knowledgeId}>{item.name}</Select.Option>
              })
            }
          </Select>
          <Input
            style={{ width: '130px', marginRight: 10 }}
            placeholder="关键字"
            onChange={(e: any) => props.setExerciseDesc(e.target.value)}
            value={props.exerciseDesc}
            allowClear
          />
          <Button type="primary" onClick={() => props.fetchExerciseList()}>查询</Button>
          <Button onClick={() => {
            props.setSceneId(undefined);
            props.setKnowledgeId(undefined);
            props.setExerciseDesc('');
            props.resetFetchExerciseList();
          }}>重置</Button>
        </div>
      </div>

      <div className="flex wrap exercise-list">
        {
          props.type === 0
            ?//查询权限
            props.exerciseList?.map((item, index) => {
              return <Tooltip
                title="点击查看习题详情"
                key={index}
              >
                <div key={index} className="flex exercise-card" onClick={() => props.toView(item.exerciseId)}>
                  <div className="card-index">
                    #{item.exerciseId}
                  </div>
                  <span className="title-2" style={{ marginRight: 8 }}>{item.exerciseName}</span>
                  {item?.knowledgeNames.map((ele: string, index: number) => {
                    return <Tag key={index} color={getKnowledgeColor()[index]}>{ele}</Tag>
                  })}
                </div>
              </Tooltip>
            })
            ://编辑权限
            <div className="exercise-content">
              <Space>
                <Checkbox onClick={() => onAllCheckChange()} style={{ marginLeft: 8 }} checked={allCheck} />
                <Button type="primary" onClick={() => onBatchRemove()} danger size="small">批量删除</Button>
                <Button type="primary" onClick={() => onBatchBuildScene()} size="small">绑定场景</Button>
              </Space>

              <Table
                rowClassName="expert-exercise-list-row"
                style={{ width: '100%' }}
                bordered={false}
                showHeader={false}
                pagination={false}
                rowSelection={{
                  type: 'checkbox',
                  ...rowSelection,
                }}
                rowKey={record => record.exerciseId}
                columns={columns}
                dataSource={props.exerciseList}
              />
            </div>

        }
      </div>

      <ImportExerciseModal
        onCancel={() => {
          setImportExerciseModalVisible(false);
        }}
        fetchExerciseList={() => props.fetchExerciseList()}
        modalVisible={importExerciseModalVisible}
        courseId={props.courseId}
      />
      <BuildScene
        onSubmit={async (value: { sceneId: number }) => {
          console.log('sceneId', value.sceneId)
          const result = await batchBuildScene(value.sceneId, selectedRowKeys);
          if (result && result.success) {
            handleSceneModalVisible(false);
            message.success('场景批量绑定成功！')
          } else {
            message.error(result.message)
          }
        }}
        onCancel={() => {
          handleSceneModalVisible(false);
        }}
        createModalVisible={sceneModalVisible}
        sceneList={props.allScene}
      />
    </>
  );
};
export default Content;

// props.exerciseList?.map((item, index) => {
//   return <Tooltip
//     placement="right"
//     title={hoverContent(item)}
//     trigger="click"
//     key={index}
//     overlayClassName="exercise-card-buttons"
//     align={{
//       offset: [-250, 0],//x,y
//     }}
//   >
//     <div key={index} className="flex exercise-card">
//       <div className="card-index">
//         #{item.exerciseId}
//       </div>
//       <span className="title-2" style={{ marginRight: 8 }}>{item.exerciseName}</span>
//       {item?.knowledgeNames.map((ele: string, index: number) => {
//         return <Tag key={index} color={getKnowledgeColor()[index]}>{ele}</Tag>
//       })}
//     </div>
//   </Tooltip>
// })