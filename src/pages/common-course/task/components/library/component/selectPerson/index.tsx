import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { publishList } from '@/services/teacher/task/task';
import { useParams } from 'umi'
type IProps = {
  onCancel: () => void;
  onSubmit: (values: any) => void;
  visible: boolean;
}
const SelectPerson: React.FC<IProps> = (props) => {
  const {
    onSubmit: handleSubmit,
    onCancel: handCancel,
    visible
  } = props;
  const params: any = useParams();    // 获取路由参数
  const courseId = Number(params.courseId) // 题目id
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [checkData, setCheckData] = useState<any []>([]);
  useEffect(() => {
    publishList(courseId).then((res) => {
        if (res.success) {
          if(res.obj.length!=0) {
            res.obj.map((item:any, index:number)=>{
              item.classId = item.key
              item.className = item.title
              item.targetType = 1
              if(item.children!=null && item.children.length!=0) {
                item.children.map((cItem:any, cIndex:number)=>{
                  cItem.studentId = cItem.key
                  cItem.studentName = cItem.title
                  cItem.parentId = item.key
                  cItem.parentName = item.title
                  cItem.parentType = 2
                })
              }
            })
          }
          console.log(res.obj)
          setTreeData(res.obj)
        }
      })
  }, [])
  /**
   * 保存提交
   * @returns 
   */
  const handleNext = async () => {
    console.log("checkData:", checkData)
    handleSubmit(checkData)
  };
  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: React.Key[], e:{checkedNodes:any}) => {
    console.log('onCheck', checkedKeysValue,'e:', e.checkedNodes);
    if(e.checkedNodes.length && e.checkedNodes.length!=0) {
      console.log('1')
      let arr:any = []
      e.checkedNodes.map((item:any, index:number)=>{
        if(item.parentId) {
          let selectData = arr.filter((fItem:any)=>fItem.classId == item.parentId)
          if(selectData.length!=0) {
            let obj = {
              studentId: item.key,
              studentName: item.title
            }
            arr.map((aItem:any, aIndex:number)=>{
              if(aItem.classId == item.parentId)
              aItem.distributionStydents && aItem.distributionStydents.push(
                obj
              )
            })
           
          }else {
            let obj = {
              studentId: item.key,
              studentName: item.title
            }
            let classObj = {
              classId: item.parentId,
              className: item.parentName,
              targetType: 2,
              distributionStydents: []
            }
            classObj.distributionStydents && classObj.distributionStydents.push(obj)
            arr.push(classObj)
          }
        }else {
          let selectData = arr.filter((fItem:any)=>fItem.classId == item.classId)
          console.log("selectData:", selectData)
          if(selectData.length!=0) {
           
            arr.map((aItem:any, aIndex:number)=>{
              console.log("aItem:", aItem, item.classId)
              if(aItem.classId == item.classId) {
                console.log('333')
                aItem.targetType = 1
              }
              
            })
          }else {
            let classObj = {
              classId: item.classId,
              className: item.className,
              targetType: 1
            }
            arr.push(classObj)
            
          }
       
        }
      })
      console.log('arr12121:', arr)
      setCheckData(arr)
    }
    setCheckedKeys(checkedKeysValue);
  };

  return (
    <Modal
      closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
      destroyOnClose
      title="发布对象"
      width="500px"
      open={visible}
      okText="确定"
      onCancel={() => { handCancel() }}
      footer={[
        <Button key="back" onClick={() => handCancel()}>
          取消
        </Button>,
        <Button key="sumbit" type="primary" onClick={() => handleNext()}>
          确定
        </Button>
      ]}
    >
      <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      treeData={treeData}
    />
    </Modal>
  );
};

export default SelectPerson;
