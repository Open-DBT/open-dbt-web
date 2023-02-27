import React from 'react';
import { Modal } from 'antd';
import * as APP from '@/app';

interface IProps {
  onSubmit: (values: string) => void;
  onCancel: () => void;
  imgList: string[];
  modalVisible: boolean;
}

const SelectImage: React.FC<IProps> = (props) => {
  const {
    onSubmit: onSubmit,
    onCancel: onCancel,
    modalVisible,
    imgList
  } = props;

  return (
    <Modal
      className="imglist"
      maskClosable={false}
      destroyOnClose
      title="选择课程封面"
      open={modalVisible}
      footer={null}
      width={940}
      onCancel={() => { onCancel() }}
    >
      <div className="flex wrap">
        {
          imgList.map((item, index) => {
            return <div key={index} className="hoverable" style={{ margin: '0 13px 16px 13px' }} onClick={() => { onSubmit(item) }}>
              <img src={`${APP.request.prefix}` + item} width="270px"  ></img>
            </div>
          })
        }
      </div>
    </Modal>
  )
}

export default SelectImage;
