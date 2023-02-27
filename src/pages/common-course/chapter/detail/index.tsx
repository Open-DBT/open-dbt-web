import Menu from './menu';
import Content from './content'
import Header from './header'
import { useRef, useState } from 'react'
import './index.less';

interface IProps {
  match: any;
}
/**
 * 章节编辑首页
 * @param props 
 * @returns 
 */
const ChapterEditlIndex = (props: IProps) => {
  const courseId = props.match.params.courseId;
  const chapterId = props.match.params.chapterId;
  const clazzId = props.match.params.clazzId;
  const [isLevelFirst, setIsLevelFirst] = useState<boolean>(true);//是否是一级菜单
  const cRef = useRef<any>(null);
  /**
   * @function 保存
   * @description 父组件把方法抛到头部中，由头部子组件点击保存方法，调用编辑器的保存功能
  */
  const clickSave = () => {
    cRef.current && cRef.current.clickSave()
  };
  /**
   * @function 预览
   * @description 父组件把方法抛到头部中，由头部子组件点击预览方法，调用编辑器的预览功能
  */
  const clickPreview = () => {
    cRef.current && cRef.current.clickPreview()
  }
  return (
    <>
      <Header clickSave={() => { clickSave() }} clickPreview={() => { clickPreview() }} />
      <div className="detail-menu menu-container" style={{ display: 'flex', background: '#F1F3F6' }}>
        <Menu
          courseId={courseId}
          chapterId={chapterId}
          clazzId={clazzId}
          setIsLevelFirst={(flag: boolean) => setIsLevelFirst(flag)}
        />
        {
          isLevelFirst ?
            <div className='menu-content' style={{ display: 'flex', fontSize: '2rem', fontWeight: 'bold', alignItems: 'center', justifyContent: 'center', flex: '1', borderRadius: '10px', margin: '10px', background: '#fff' }}>
              一级目录不允许编辑内容
            </div>
            : <Content ref={cRef} courseId={courseId} chapterId={chapterId} clazzId={clazzId} />
        }
      </div>
    </>

  )
}

export default ChapterEditlIndex