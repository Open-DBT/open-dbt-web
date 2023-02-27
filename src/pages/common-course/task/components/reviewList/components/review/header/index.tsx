
import logo from '@/img/logo-itol.png'
import './index.less'

interface IProps {
  clickSave: () => void;  // 保存
  continueAnswer: () => void; // 继续答题
}

/**
 * 章节编辑的header
 * @param props 
 * @returns 
 */
const CreateHeader = (props: IProps) => {
  return (
    <div className='custom-single'>
      <div className='custom-header-row'>
        <div className='header-left'>
          <div className='header-logo'>
            <img src={logo} alt="" />
          </div>
        </div>
        <div className='header-title'>
          作业批阅
        </div>
        <div className='header-right'></div>
      </div>
    </div>
  )
}

export default CreateHeader