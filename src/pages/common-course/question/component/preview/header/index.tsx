
import logo from '@/img/logo-itol.png'
import './index.less'
import { Button } from 'antd';

interface IProps {
  clickSave: () => void;
}

/**
 * 章节编辑的header
 * @param props 
 * @returns 
 */
const PreviewHeader = (props: IProps) => {
  const {
    clickSave: clickSave,
  } = props;
  /**
   * 跳转到
   */
  return (
    <div className='custom-single'>
      <div className='custom-header-row'>
        <div className='header-left'>
          <div className='header-logo'>
            <img src={logo} alt="" />
          </div>
        </div>
        <div className='header-title'>
            题目预览
        </div>
        <div className='header-right'>
          <Button type="primary" style={{ borderRadius: '5px' }} onClick={() => { clickSave() }}>
            编辑
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PreviewHeader