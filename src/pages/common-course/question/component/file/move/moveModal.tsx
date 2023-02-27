import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import SuperIcon from "@/pages/components/icons";
import {
  DownOutlined,
} from '@ant-design/icons';
import { useParams } from 'umi'
import { Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import './moveModal.less'
import { getExerciseCatalogueTree, saveExerciseCatalogue } from '@/services/teacher/course/question-create';
import HandleFileModal from '../add/index';
import { QUESTION_BANK } from '@/common/entity/questionbank'
interface AlterPwdModalProps {
  onCancel: () => void;
  onSubmit: (oldId: number, newId: number) => void;
  moveModelVisible: boolean;
  checkId: number;
};
/**
 * 移动习题窗口
 * @param props 
 * @returns 
 */
const MoveModal = (props: AlterPwdModalProps) => {
  const params: QUESTION_BANK.IParams = useParams();    // 获取路由参数
  const [editNameModalVisible, handEditNameModalVisible] = useState<boolean>(false);// 修改目录标题，开关弹框
  const [treeList, setTreeList] = useState<DataNode[]>([]);
  const [selectedKeyId, setSelectedKeyId] = useState<number>(-1);
  const {
    onCancel: onCancel,
    onSubmit: onSubmit,
    moveModelVisible,
    checkId
  } = props;
  const courseId = params.courseId
  useEffect(() => {
    if (courseId && moveModelVisible) {
      getTreeData()
    }

  }, [moveModelVisible])

  /**
   * 获取文件夹列表数据(树形)
   */
  const getTreeData = () => {
    // 调用获取文件夹树接口
    getExerciseCatalogueTree({
      courseIdList: [courseId]
    }).then((res: any) => {
      if (res.success) {
        setTreeList(addIcon(res.obj))
      }
    })
  }
  /**
   * 添加文件夹图片到列表中，并进行展示
   * @param arr 
   * @returns 
   */
  const addIcon = (arr: any) => arr.map((item: any, index: number) => ({
    ...item,
    icon: <SuperIcon type="icon-icon-folder" style={{ verticalAlign: 'middle', fontSize: '1.2rem' }} />,
    childrens: item.childrens.length != 0 ? addIcon(item.childrens) : [] // 这里要判断原数据有没有子级如果没有判断会报错
  }))
  /**
   * 判断是否选择父级文件夹，要进行新建文件夹的位置存放
   * @returns 
   */
  const handleAddFile = () => {
    if (selectedKeyId == -1) {
      message.warning('请选择新建的文件夹所在位置')
      return
    }
    handEditNameModalVisible(true)
  }
  // 确定
  const handleOk = () => {
    if (selectedKeyId == -1) {
      message.warning('请选择要移动到的文件夹')
      return
    }
    onSubmit(checkId, selectedKeyId)
  };
  // 取消
  const handleCancel = () => {
    onCancel()
  };
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    setSelectedKeyId(Number(selectedKeys[0]))
  };
  return (
    <>
      <Modal
        key="move-modal-one"
        className='move-modal-class'
        open={moveModelVisible}
        title={'移动到（选择目标目录）'}
        maskClosable={true}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <div className='move-modal-footer' key="footer-one">
            <div>
              <Button key="back" onClick={handleAddFile}>
                新建文件夹
              </Button>
            </div>
            <div>
              <Button key="back" onClick={handleCancel}>
                取消
              </Button>
              <Button key="submit" type="primary" onClick={handleOk}>
                确定
              </Button>
            </div>
          </div>
        ]}
      >
        <Tree
          showIcon
          defaultExpandAll
          switcherIcon={<DownOutlined />}
          onSelect={onSelect}
          treeData={treeList}
          fieldNames={{ title: 'exerciseName', children: 'childrens', key: 'id' }}
        />
      </Modal>
      {
        editNameModalVisible &&
        <HandleFileModal
          onSubmit={(value: string) => {
            let param = {
              courseId: courseId,
              parentId: selectedKeyId,
              elementType: 1,
              exerciseName: value,
              id: ''
            }
            saveExerciseCatalogue(param).then((res) => {
              if (!res.success) {
                message.error(res.message)
                return;
              } else {
                message.success(res.message)
                if (courseId && moveModelVisible) {
                  getTreeData()
                }
              }
              handEditNameModalVisible(false);
            })
          }}
          onCancel={() => handEditNameModalVisible(false)}
          visible={editNameModalVisible}
          name='新建文件夹'
          checkName=''
        />
      }
    </>
  )
}

export default MoveModal