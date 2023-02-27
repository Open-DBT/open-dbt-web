
import logo from '@/img/logo-itol.png'
import './header.less'
import { Button, Modal } from 'antd';
import SuperIcon from "@/pages/components/icons";

interface IProps {
  clickSave: () => void;
  type?: string;
}

/**
 * 章节编辑的header
 * @param props 
 * @returns 
 */
const EditorHeader = (props: IProps) => {
  const {
    clickSave: clickSave,
    type
  } = props;

  /**
   * 完成退出
   */
  const handleExit = async () => {
    Modal.confirm({
      title: '退出页面',
      content: '是否要保存内容？',
      okText: '保存',
      cancelText: '取消',
      onOk: async () => {
        clickSave()
      },
      onCancel() { },
    });
  }
  /**
   * 返回上一页面
   */
  const handleCancel = () => {
    Modal.confirm({
      title: '返回上一个页面',
      content: '是否要保存内容？',
      okText: '保存',
      cancelText: '取消',
      onOk: async () => {
        clickSave()
      },
      onCancel() {
        history.go(-1)
      },
    });

  }
  return (
    <div className='custom-single'>
      <div className='custom-header-row'>
        <div className='header-left'>
          <div className='header-logo'>
            <img src={logo} alt="" />
          </div>
        </div>
        <div className='header-title'>
          {
            type == 'edit' ? '编辑作业' : '新建作业'
          }
        </div>
        <div className='header-right'>
          <Button style={{ borderRadius: '5px', marginRight: '20px' }} onClick={() => { handleCancel() }}>
            <SuperIcon type="icon-chehui" />返回
          </Button>
          <Button type="primary" style={{ borderRadius: '5px' }} onClick={() => { handleExit() }}>
            <SuperIcon type="icon-baocun" />完成
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditorHeader