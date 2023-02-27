
import { findRichTXT } from '@/services/resources/upload';
import { useState, useEffect } from 'react'

interface IProps {
  courseId: number;
  chapterId: number;
}

/**
 * 章节预览，content
 * @param props 
 * @returns 
 */
const PreviewContent = (props: IProps) => {
  const { courseId, chapterId } = props;
  const [visible, setVisible] = useState<boolean>(false); //编辑框组件刷新判断
  const [content, setContent] = useState<string>(''); //显示内容
  useEffect(() => {
    // 初始化弹框变量,当接口返回后重新刷新组件
    setVisible(false)
    // 滚动条滑动到顶部
    window.scrollTo(0, 0)
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
        } else {
          setContent(res.obj.contents)
        }
        // initialData变量接收返回的对象进行传输和存储
        setVisible(true)
      }
    })
  }, [chapterId])
  return (
    <>
      {visible && (
        <div className='chapter-content-right'>
          <div className='menu-content view-content' >
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          </div>
        </div>
      )}
    </>
  )
}

export default PreviewContent