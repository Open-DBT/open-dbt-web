
import { findRichTXT } from '@/services/resources/upload';
import { useState, useEffect } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import BraftEditor from '@/pages/components/Editor'
import { useRef } from 'react'
import { CHAPTER } from '@/common/entity/chapter'

interface IProps {
  courseId: number;
  chapterId: number;
  clazzId: number;
}
/**
 * 章节编辑，右侧富文本编辑器
 */
const editContent = forwardRef((props: IProps, ref) => {
  const { courseId, clazzId, chapterId } = props;
  const [initialData, setInitialData] = useState<CHAPTER.ChapterEditorContext>()  // 根据查询接收的用于编辑的编辑器数据
  const [visible, setVisible] = useState<boolean>(false); //富文本编辑器是否显示，一级目录时不显示富文本编辑器
  const editRef = useRef<any>();

  // 将父组件的方法暴露出来
  useImperativeHandle(ref, () => ({
    clickSave: clickSave,
    clickPreview: clickPreview
  }))
  /**
   * 保存
   * 调用BraftEditor内部的保存方法
  */
  const clickSave = () => {
    editRef.current && editRef.current.sumbitUpload()
  }
  /**
   * 预览
   * 调用BraftEditor内部的预览方法
   */
  const clickPreview = () => {
    editRef.current && editRef.current.preview()
  }
  useEffect(() => {
    // 关闭浏览器前提示
    window.onbeforeunload = (e) => {
      e = e || window.event;
      if (e) {
        e.returnValue = '关闭提示';
      }
      clickSave()
      // toCloseFun()//调用自己的方法

      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return '关闭提示';
    };
    // 初始化弹框变量,当接口返回后重新刷新组件
    setVisible(false)
    /**
     * @function 查询课程目录的编辑器数据信息。返回的对象可以作为编辑对象进行编辑和保存
     * @params courseId 课程id
     * @params chapterId 目录id
    */
    findRichTXT(courseId, chapterId).then((res) => {
      if (res.success) {
        // 因为对象结构修改了，防止旧数据报错。修正需要重命名目录，并重新进入。
        if (res.obj == null) {
          res.obj = {
            contents: '', // 编辑器内容
            attachments: [] // 资源数组
          }
        }
        // initialData变量接收返回的对象进行传输和存储
        setInitialData(res.obj)
        setVisible(true)
      }
    })
    //销毁调用
    return () => {
      clickSave()
    }
  }, [chapterId])

  return (
    <>
      {visible && (
        <div className='menu-content' style={{ flex: '1', borderRadius: '10px', margin: '20px', background: '#fff' }}>
          <BraftEditor ref={editRef} courseId={courseId} chapterId={chapterId} clazzId={clazzId} textContent={initialData}></BraftEditor>
        </div>
      )}
    </>
  )
})

export default editContent