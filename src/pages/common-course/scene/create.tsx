import './index.less';
import '@/pages/common-course/course-common.less';
import { history } from 'umi';
import { Form, Input, Button, Space, message } from 'antd';
import moment from 'moment';
import BraftEditor from '@/pages/editor/braft';
import { testSceneSQLShell } from '@/services/teacher/course/scene';
import { saveScene } from '@/services/teacher/course/scene';
import { saveCourseStorage } from '@/pages/common-course/utils'
import { API } from '@/common/entity/typings';

const { TextArea } = Input;
const FormItem = Form.Item;

const addIndex = (props: any) => {
  const courseId = props.courseId;

  const [form] = Form.useForm();

  /**
   * 保存
   */
  const onFinish = async (values: API.SceneListRecord) => {
    values.sceneDesc = values.sceneDesc.toHTML();
    const result = await saveScene(values)
    if (result.success) {
      history.push(`/expert/course/${courseId}/scene`);
      //缓存当前保存页为成功
      saveCourseStorage(courseId, 3);
      message.success('保存成功');
    } else {
      message.error(result.message);
    }
  };

  /**
   * 下载脚本
   */
  const downLoadShell = () => {
    const sceneName = form.getFieldValue('sceneName');
    const initShell = form.getFieldValue('initShell');
    console.log('sceneName == ', sceneName, ', initShell == ', initShell);

    if (sceneName.trim().length == 0 || initShell.trim().length == 0) {
      message.error('应用场景名称和初始化的脚本不可为空！');
    } else {
      const blob = new Blob([initShell]);
      const fileName = `${sceneName}_${moment(new Date()).format('YYYYMMDDHHmmss')}.sql`;
      const link = document.createElement('a');
      const evt = document.createEvent('MouseEvents');
      link.style.display = 'none';
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link); // 此写法兼容可火狐浏览器
      evt.initEvent('click', false, false);
      link.dispatchEvent(evt);
      document.body.removeChild(link);// 下载完成移除元素
      window.URL.revokeObjectURL(link.href); // 释放掉blob对象
    }
  };
  /**
   * 测试运行
   * @returns 
   */
  const testShell = async () => {
    const initShell: string = form.getFieldValue('initShell');
    console.log('initShell == ', initShell);
    if (initShell.length === 0) {
      message.warning('请输入脚本内容')
      return;
    }

    const result = await testSceneSQLShell({ initShell: initShell })
    if (result.success) {
      message.success('脚本语法正确');
    } else {
      message.error(result.message);
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      initialValues={{
        courseId: courseId,
        sceneName: '',
        sceneDesc: '',
        initShell: ''
      }}
    >
      <div className="title-4">新建场景</div>
      <div className="course-info">
        <FormItem name="courseId" hidden={true}><Input /></FormItem>
        <FormItem
          name="sceneName"
          label="应用场景名称"
          rules={[{ required: true, message: '请输入应用场景名称' }]}
        >
          <Input placeholder="请输入应用场景名称" style={{ width: '40%' }} />
        </FormItem>
        <FormItem name="sceneDesc" label="应用场景描述" >
          <BraftEditor placeholder="请输入正文内容" />
        </FormItem>
        <div style={{ height: 50, lineHeight: '50px' }}>
          <Space>
            <h3>初始化脚本</h3>
            <Button type="primary" style={{ marginLeft: 20 }} onClick={() => downLoadShell()}>脚本下载</Button>
            <Button type="primary" style={{ marginLeft: 20 }} onClick={() => testShell()}>检查脚本</Button>
          </Space>
        </div>
        <FormItem name="initShell">
          <TextArea
            style={{ minHeight: 100 }}
            placeholder={"请输入脚本"}
            rows={10}
          />
        </FormItem>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Form.Item><Button type="primary" htmlType="submit">保存设置</Button></Form.Item>
      </div>
    </Form>
  )
}

export default addIndex;