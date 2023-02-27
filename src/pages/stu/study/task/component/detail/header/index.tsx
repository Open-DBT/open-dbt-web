import logo from '@/img/logo-itol.png'
import './index.less'

const CreateHeader = () => {
  return (
    <div className='custom-single'>
      <div className='custom-header-row'>
        <div className='header-left'>
          <div className='header-logo'>
            <img src={logo} alt="" />
          </div>
        </div>
        <div className='header-title'>
          作业详情
        </div>
        <div className='header-right'></div>
      </div>
    </div>
  )
}

export default CreateHeader