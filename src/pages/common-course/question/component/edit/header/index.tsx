
import logo from '@/img/logo-itol.png'
import './index.less'
import { Button, Menu, Modal } from 'antd';
// import { history } from 'umi';
import SuperIcon from "@/pages/components/icons";

interface IProps {
  clickSave: () => void;
}

/**
 * 章节编辑的header
 * @param props 
 * @returns 
 */
const EditorHeader = (props: IProps) => {
  const {
    clickSave: clickSave,
  } = props;

  /**
   * 退出关闭
   */
  const handleExit = async () => {
    Modal.confirm({
      title: '退出页面',
      content: '是否要保存内容？',
      okText: '保存',
      cancelText: '取消',
      onOk: () => {
        clickSave()
        window.close()
      },
      onCancel() {},
    });
  }
  return (
    <div className='custom-single'>
      <div className='custom-header-row'>
        <div className='header-left'>
          <div className='header-logo'>
            <img src={logo} alt="" />
          </div>
          {/* <div className='header-menu'>
            <Button style={{ marginLeft: '14px', border: '0px'}} onClick={() => { handleExit() }}>
              <SuperIcon type="icon-chehui" style={{ color: '#00CE9B', marginRight: '5px' }}/>返回
            </Button>
          </div> */}
        </div>
        <div className='header-title'>
            编辑题目
        </div>
        <div className='header-right'>
          <Button type="primary" style={{ borderRadius: '5px',marginRight: '40px' }} onClick={() => { clickSave() }}>
            <SuperIcon type="icon-baocun" />保存
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditorHeader