import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import './index.less'

interface IProps {
  onSubmit: () => void;
  onCancel: () => void;
  modalVisible: boolean;
  module: string;
  name: string | undefined;
}

const DelModal: React.FC<IProps> = (props) => {
  const {
    onSubmit: onSubmit,
    onCancel: onCancel,
    modalVisible,
    module,
    name,
  } = props;

  const [value, setValue] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);//默认不可用

  //文本框输入事件
  const onChange = (e: any) => {
    setValue(e.target.value);
    if (e.target.value === name) setDisabled(false)
    else setDisabled(true)
  }
  //重置弹窗
  const revert = () => {
    setValue('');
    setDisabled(true)
  }
  return (
    <Modal
      className="delete-modal-course"
      destroyOnClose
      title="风险提示"
      open={modalVisible}
      footer={<Button type="primary" danger disabled={disabled} onClick={() => onSubmit()}>删除{module}</Button>}
      width={700}
      onCancel={() => { revert(); onCancel() }}
    >
      <p>是否确认<span style={{ color: 'red' }}>删除{module}</span>&nbsp;&nbsp;[{name}]&nbsp;&nbsp;，该操作不可恢复，请谨慎操作！</p>
      <p>请在下面输入框中输入{module}名称</p>
      <Input placeholder="" value={value} onChange={(e: any) => onChange(e)} />
    </Modal>
  )
}

export default DelModal;
