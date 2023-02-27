import React, { useState } from 'react';
import '../index.less';
import { Col, Row, message, Modal, Button, Checkbox, Radio } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import type { RadioChangeEvent } from 'antd';
const CheckboxGroup = Checkbox.Group;
import { CHAPTER } from '@/common/entity/chapter'
import { API } from '@/common/entity/typings';

type IProps = {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: CHAPTER.CourseCatalog) => void;
  visible: boolean;
  chapterClazz: CHAPTER.CourseCatalog;
  clazzInfo: API.SclassListRecord;//班级对象
}

const ChapterClazzModal: React.FC<IProps> = (props) => {
  const {
    onSubmit: handleSubmit,
    onCancel: handCancel,
    visible,
    chapterClazz,
    clazzInfo
  } = props;

  // console.log('chapterClazz', chapterClazz, chapterClazz.classes)
  // const clazzLen = chapterClazz.classes.length;
  //默认选中班级
  // const defSelOption: number[] = [];
  // const options = chapterClazz.classes.map((_item) => {
  //   if (_item.flag == 1) defSelOption.push(_item.class_id)
  //   return { label: _item.class_name, value: _item.class_id }
  // })
  const [value, setValue] = useState(chapterClazz.publishStatus);//单选框选中
  // const [checkedList, setCheckedList] = useState<any[]>(defSelOption);//多选框选中
  // const [indeterminate, setIndeterminate] = useState(false);//checkbox UI必有事件
  // const [checkAll, setCheckAll] = useState(defSelOption.length == options.length);//是否选中"全部班级"

  // console.log('options ', options)
  // console.log('defSelOption ', defSelOption)
  /**
   * 单选框点击事件
   * @param e 
   */
  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  /**
   * 多选框点击事件
   * @param list 
   */
  // const onCheckChange = (list: any[]) => {
  //   setCheckedList(list);
  //   setIndeterminate(!!list.length && list.length < clazzLen);
  //   setCheckAll(list.length === clazzLen);
  // };
  /**
   * 多选框，全选事件
   * @param e 
   */
  // const onCheckAllChange = (e: CheckboxChangeEvent) => {
  //   setCheckedList(e.target.checked ? options.map((item) => {
  //     return item.value
  //   }) : []);
  //   setIndeterminate(false);
  //   setCheckAll(e.target.checked);
  // };
  /**
   * 保存提交
   */
  const submit = () => {
    // if (checkedList.length == 0) {
    //   message.warning('请选择发布班级！');
    //   return;
    // }
    // chapterClazz.model = value;
    // chapterClazz.classes.forEach((item) => {
    //   item.flag = 0;
    //   checkedList.forEach((clazz) => {
    //     if (clazz == item.class_id) item.flag = 1;
    //   })
    // })
    chapterClazz.publishStatus = value;
    handleSubmit(chapterClazz);
  }
  return (
    <Modal
      closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
      destroyOnClose
      title="章节设置"
      width="650px"
      open={visible}
      okText="确定"
      onCancel={() => { handCancel() }}
      footer={[
        <Button key="back" onClick={() => { handCancel() }}>
          取消
        </Button>,
        <Button key="sumbit" type="primary" onClick={() => submit()}>
          确定
        </Button>
      ]}
      wrapClassName="modal-custom"
    >
      <div>
        <p><b>发布设置</b></p>
        <Radio.Group style={{ width: '100%' }} value={value} onChange={onChange}>
          <Row>
            <Col span={12}>
              <Radio value={1}><span style={{ fontWeight: "bold" }}>发布</span></Radio>
              <div className='setting-remark'>该章节目录对学生可见，可学习。</div>
            </Col>
            <Col span={12}>
              <Radio value={0}><span style={{ fontWeight: "bold" }}>隐藏</span></Radio>
              <div className='setting-remark'>该章节目录对学生不可见。</div>
            </Col>
          </Row>
        </Radio.Group>
      </div>

      <div style={{ marginTop: 16 }}>
        <p><b>生效班级：{clazzInfo.className}</b></p>
        {/* <p><Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>全部班级</Checkbox></p>
        <CheckboxGroup options={options} value={checkedList} onChange={onCheckChange} /> */}
      </div>
    </Modal >
  );
};

export default ChapterClazzModal;
