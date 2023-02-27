import React, { useState } from 'react';
import { Form, Select, Modal, Switch, Input } from 'antd';
import moment from 'moment';
// import "flatpickr/dist/themes/material_green.css";
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import { Mandarin } from "flatpickr/dist/l10n/zh.js"
import { API } from '@/common/entity/typings';

/**
 * Flatpickr https://flatpickr.js.org/themes/
 */

type IProps = {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: API.ExamClassListRecord) => void;
  classModalVisible?: boolean;
  examList: API.ExamListRecord[];
  classList: API.SclassListRecord[];
  courseId: number;
}

const CreateClassModal: React.FC<IProps> = (props) => {
  const [form] = Form.useForm();
  const {
    onSubmit: handleCreate,
    onCancel: handleCreateModalVisible,
    classModalVisible,
    examList,
    classList,
    courseId
  } = props;

  const handleNext = async () => {
    const values = await form.validateFields();
    if (typeof (values.testStart) !== 'string')
      values.testStart = moment(values.testStart[0]).format('YYYY-MM-DD HH:mm:ss');
    if (typeof (values.testEnd) !== 'string')
      values.testEnd = moment(values.testEnd[0]).format('YYYY-MM-DD HH:mm:ss');

    handleCreate(values);
  };

  return (
    <Modal
      closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
      destroyOnClose
      title="发放作业到班级"
      open={classModalVisible}
      okText="保存"
      onCancel={() => { form.resetFields(); handleCreateModalVisible(false) }}
      onOk={() => handleNext()}
      bodyStyle={{ padding: 12 }}
    >
      <Form
        name="create-exam-class"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ id: -1, courseId: Number(courseId), }}
        form={form}
      >
        <Form.Item name="id" hidden={true}><Input /></Form.Item>
        <Form.Item name="courseId" hidden={true}><Input /></Form.Item>

        <Form.Item label="作业名称" name="examId" rules={[{ required: true, message: '请选择一个作业！' }]}>
          <Select placeholder="请选择一个作业">
            {
              examList.map((item, index) => {
                return <Select.Option key={item.id} value={item.id}>{item.testName}</Select.Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="班级名称">
          <Form.Item name="classId" noStyle rules={[{ required: true, message: '请选择一个班级！' }]}>
            <Select
              // style={{ width: '150px', marginRight: 14 }}
              placeholder="请选择一个班级"
              // onSelect={(value: number) => props.setKnowledgeId(value)}
              // value={props.knowledgeId}
              allowClear
            // onClear={() => { props.setKnowledgeId(undefined) }}
            >
              {
                classList.map((item, index) => {
                  return <Select.Option key={item.id} value={item.id}>{item.className}</Select.Option>
                })
              }
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item label="开始时间" name="testStart" rules={[{ required: true }]}>
          <Flatpickr data-enable-time data-time_24hr options={{ locale: Mandarin }} />
        </Form.Item>
        <Form.Item label="截止时间" name="testEnd" rules={[{ required: true }]}>
          <Flatpickr data-enable-time data-time_24hr options={{ locale: Mandarin }} />
        </Form.Item>
        <Form.Item label="可见状态">
          <Form.Item name="testIsOpen" valuePropName="checked">
            <Switch checkedChildren="可见" unCheckedChildren="隐藏" />
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateClassModal;
