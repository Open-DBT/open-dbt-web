import React, { useState } from 'react';
import { message, Modal, Button, Input } from 'antd';

type IProps = {
  onCancel: () => void;
  onSubmit: (values: string) => void;
  visible: boolean;
  name: string;
}

const CreateChapterModal: React.FC<IProps> = (props) => {
  const {
    onSubmit: handleSubmit,
    onCancel: handCancel,
    visible,
    name
  } = props;
  const [chapterName, setChapterName] = useState<string>(name);

  /**
   * 输入框写入事件
   * @param e 
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChapterName(e.target.value);
  };

  /**
   * 保存提交
   * @returns 
   */
  const handleNext = async () => {
    if (chapterName.length == 0) {
      message.warning('请输入目录名称');
      return;
    }
    handleSubmit(chapterName);
  };

  return (
    <Modal
      closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
      destroyOnClose
      title="编辑目录名称"
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
      <Input placeholder="请输入备课目录标题" value={chapterName} onChange={handleChange} />
    </Modal>
  );
};

export default CreateChapterModal;
