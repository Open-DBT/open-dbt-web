import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { API } from '@/common/entity/typings';
import { useParams } from 'umi'
import './index.less'
import { QUESTION_BANK } from '@/common/entity/questionbank'
import { getCourseDetail } from '@/services/teacher/course/course';
import { getKnowExerciseCountByCourseId } from '@/services/student/progress';
import MindCanvas from '@/pages/common-course/exercise/Graph/canvas-content'
interface AlterPwdModalProps {
  onCancel: () => void;
  onSubmit: (value: KnowledgeData [], valueId: number []) => void;
  selectIds: number[];
  moveModelVisible: boolean;
};
interface KnowledgeData {
  knowledgeId: number;
  progress: number;
}
const KnowledgeModal = (props: AlterPwdModalProps) => {
  const [loading, setLoading] = useState(false);
  const params: QUESTION_BANK.IParams = useParams();    // 获取路由参数
  const courseId = Number(params.courseId)
  const [knowledgeIds, setKnowledgeIds] = useState<number[]>([]);//选中知识点
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeData[]>([]);//选择知识点列表
  const [graphData, setGraphData] = useState<any>();//知识树列表
  const [knowExercise, setKnowExercise] = useState<API.KnowledgeItemExerciseCount[]>([]);//知识树习题数量
  const {
    onCancel: onCancel,
    onSubmit: onSubmit,
    moveModelVisible
  } = props;
  useEffect(() => {
    if (moveModelVisible) {
      getTreeData()
    }
  }, [moveModelVisible])
  /**
   * 获取组织树
   */
  const getTreeData = () => {
    getCourseDetail(courseId).then((result) => {
      setGraphData(JSON.parse(result.obj.knowledgeTree))
    })
    getKnowExerciseCountByCourseId(courseId).then(k => {
      if (k.obj) setKnowExercise(k.obj)
    })
    setKnowledgeIds(props.selectIds)
  }

  // 确定
  const handleOk = () => {
    onSubmit(knowledgeList, knowledgeIds)
  };
  // 取消
  const handleCancel = () => {
    onCancel()
  };
  // 设置知识点对象数组
  const setPathObj = (arr: string []) => {
    let list: QUESTION_BANK.Knowledge[] = []
    arr.map((item, index) => {
      list.push({
            knowledgeId: knowledgeIds[index],
            progress: index,
            name: item
        })
    })
    setKnowledgeList(list)
  }
  return (
    <>
      <Modal
        key="modle-100"
        className='move-modal-class'
        open={moveModelVisible}
        title='选择知识点'
        width="800px"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <div className='move-modal-footer' key="footer-one">
            <div>
              <Button key="back" onClick={handleCancel}>
                取消
              </Button>
              <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                确定
              </Button>
            </div>

          </div>
        ]}

      >
        <div style={{ width: '100%' }}>
          {graphData && <MindCanvas
            graphData={graphData}
            knowExercise={knowExercise}
            setIds={(v: number[]) => setKnowledgeIds(v)}
            setList={(v: string []) => setPathObj(v)}
            ids={knowledgeIds}
          />
}
        </div>
      </Modal>
    </>
  )
}

export default KnowledgeModal