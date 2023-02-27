import React, { useState, useEffect } from 'react';
import BraftEditor from '@/pages/editor/braft';
import { Form, Input, Button, Space, message, Select, Modal } from 'antd';
import { add } from '@/services/system/feedback';

import '@/pages/common-course/course-common.less';
import '@/pages/home.less';
const FormItem = Form.Item;

const feedback: React.FC<{}> = () => {
  const [form] = Form.useForm();
  const submit = async () => {
    const content = form.getFieldValue('content');

    if (content === '' || content.toHTML() === '<p></p>') {
      message.warning('请输入反馈内容');
      return
    }
    const params = { content: content.toHTML() };
    add(params).then((result) => {
      if (result.obj) message.success('感谢您的意见反馈，我们会尽快处理！', 10);
    });
  }
  return (
    <div className="flex course">
      <div style={{ width: '97%' }}>
        <div className="course-content">
          <div className="title-5">意见反馈</div>
          {/* <p>如果您对我们的会议有任何的问题或建议，欢迎您向我们反馈：</p>    */}
          <div className="course-info">
            <Form
              preserve={false}
              form={form}
              initialValues={{
                content: ''
              }}
            >
              <FormItem name="content" label="反馈描述" rules={[{ required: true, message: '在此输入' }]}>
                <BraftEditor placeholder="在此输入" readOnly={false} />
              </FormItem>

              <Button type="primary" onClick={() => submit()}>提交</Button>

            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default feedback;
