
import logo from '@/img/logo-itol.png'
import './index.less'
import { Button } from 'antd';
import SuperIcon from "@/pages/components/icons";

interface IProps {
  clickSave: () => void;  // 保存
  sumbitAnswer: () => void; // 提交
  homeworkStatus: number; // 作业状态
}

/**
 * 章节编辑的header
 * @param props 
 * @returns 
 */
const CreateHeader = (props: IProps) => {
  const {
    homeworkStatus,
    clickSave: clickSave,
    sumbitAnswer: sumbitAnswer
  } = props;
  return (
    <div className='custom-single'>
      <div className='custom-header-row'>
        <div className='header-left'>
          <div className='header-logo'>
            <img src={logo} alt="" />
          </div>
        </div>
        <div className='header-title'>
          作业答题
        </div>
        <div className='header-right'>
          {
            homeworkStatus !=1 && 
            <Button type="primary" className='button-radius' onClick={()=>clickSave()}>
            <SuperIcon type="icon-baocun" />保存
          </Button>
          }
          <Button type="primary" className='button-radius continue-button' style={{}} onClick={sumbitAnswer}>
            <SuperIcon type="icon-icon-release" />提交
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateHeader