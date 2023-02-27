
import logo from '@/img/logo-itol.png'
import './header.less'
import { Button, Menu, Modal } from 'antd';
import SuperIcon from "@/pages/components/icons";

interface IProps {
  clickSave: () => void;
  clickPreview: () => void;
}

/**
 * 章节编辑的header
 * @param props 
 * @returns 
 */
const EditorHeader = (props: IProps) => {
  const {
    clickSave: clickSave,
    clickPreview: clickPreview,
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
        <div className='header-logo'>
          <img src={logo} alt="" />
        </div>
        <div className='header-menu'>
          <Menu mode="horizontal" defaultSelectedKeys={['detail']}>
            <Menu.Item key="detail">
              课程详情
            </Menu.Item>
            {/* <Menu.Item key="exam"
           onClick={() => {
            history.push(`/expert/course/${courseId}/exercise`);
          }}>
            作业
          </Menu.Item>
          <Menu.Item key="exerise" 
          onClick={() => {
                history.push(`/teacher/course/${courseId}/exam`);
          }}>
            练习
          </Menu.Item> */}
          </Menu>
        </div>
        <div className='header-right'>
          <Button type="primary" style={{ borderRadius: '5px' }} onClick={() => { clickSave() }}>
            <SuperIcon type="icon-baocun" />保存
          </Button>
          <Button onClick={() => { clickPreview() }} type="primary" style={{ borderRadius: '5px', marginLeft: '14px', backgroundColor: "#FDDF66", borderColor: '#FDDF66', color: '#442410', }} >
            <SuperIcon type="icon-yulan" />预览
          </Button>
          <Button style={{ marginLeft: '14px', borderRadius: '5px' }} onClick={() => { handleExit() }}>
            <SuperIcon type="icon-tuichu" />退出
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditorHeader