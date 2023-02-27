import { useState } from 'react'
import Menu from './menu';
import Content from './content';
import Header from './header'
import '../index.less';

/**
 * 章节预览首页
 * @param props 
 * @returns 
 */
const ChapterPreviewIndex = (props: any) => {
  const courseId = props.match.params.courseId;
  const chapterId = props.match.params.chapterId;
  const clazzId = props.match.params.clazzId;
  const [isLevelFirst, setIsLevelFirst] = useState<boolean>(false);//是否是一级菜单
  //这里需要做个判断，如果参数有问题，做一个跳转
  return (
    <div style={{ backgroundColor: '#F1F3F6', height: '100vh' }}>
      <Header courseId={courseId} clazzId={clazzId} chapterId={chapterId} />
      <Menu
        courseId={courseId}
        chapterId={chapterId}
        clazzId={clazzId}
        setIsLevelFirst={(flag: boolean) => setIsLevelFirst(flag)}
      />
      {
        isLevelFirst ?
          // <div className='menu-content' style={{ display: 'flex', fontSize: '2rem', fontWeight: 'bold', alignItems: 'center', justifyContent: 'center', flex: '1', borderRadius: '10px', margin: '10px', background: '#fff' }}>
          //   一级目录不允许编辑内容
          // </div>
          <div/>
          : <Content courseId={courseId} chapterId={chapterId} />
      }
    </div>

  )
}

export default ChapterPreviewIndex