import React, { useState } from 'react';
import { message, Modal, Button, Input } from 'antd';

type IProps = {
  onCancel: () => void;
  onSubmit: (values: string) => void;
  visible: boolean;
  name: string;
  checkName: string;
}

const AddFileModal: React.FC<IProps> = (props) => {
  const {
    onSubmit: handleSubmit,
    onCancel: handCancel,
    visible,
    name,
    checkName
  } = props;
  const [fileName, setFileName] = useState<string>(checkName);

  /**
   * 输入框写入事件
   * @param e 
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  /**
   * 保存提交
   * @returns 
   */
  const handleNext = async () => {
    if (fileName.length == 0) {
      message.warning('请输入文件夹名称');
      return;
    }
    handleSubmit(fileName);
  };

  return (
    <Modal
      closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
      destroyOnClose
      title={name}
      width="500px"
      open={visible}
      okText="确定"
      onCancel={() => { handCancel() }}
      footer={[
        <Button key="back" onClick={() => handCancel()}>
          取消
        </Button>,
        <Button key="sumbit" type="primary" onClick={() => handleNext()}>
          确定
        </Button>
      ]}
    >
      <Input placeholder="请输入文件夹名称" value={fileName} onChange={handleChange} />
    </Modal>
  );
};

export default AddFileModal;
