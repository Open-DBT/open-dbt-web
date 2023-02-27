import React, { useState } from 'react';
import { Form, Upload, Button, message } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { importSclassStu } from '@/services/teacher/clazz/sclass';
const FormItem = Form.Item;
import * as APP from '@/app';

interface CreateFormProps {
  sclassId: number;
};

const ImportForm: React.FC<CreateFormProps> = (props) => {

  const [form] = Form.useForm();
  const { sclassId } = props;
  const [fileList, setFileList] = useState<any[]>([]);
  const [filePathList, setFilePathList] = useState<string[]>([]);

  const onSubmit = async () => {
    if (filePathList.length > 0) {
      const result = await importSclassStu({ sclassId: sclassId, filePathList: filePathList });
      if (result.success) {
        message.success("导入成功");
        setFileList([]);
        setFilePathList([]);
      } else {
        message.error(result.message);
      } 
    } else {
      message.warn('请选择文件!')
    }
  };

  const UploadProps = {
    name: 'file',
    action: `${APP.request.prefix}/sclass/uploadSclassStuFile`,
    headers: {
      "authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
    accept: '.xls, .xlsx',
    onChange(info: any) {
      if (info.file.status === 'done') {
        console.log('info == ', info);
        const newFilePathList = [];
        newFilePathList.push(info.file.response.obj);
        setFilePathList(newFilePathList);
      }
    },
    onRemove: (file: any) => {
      setFileList([]);
      setFilePathList([]);
    },
    beforeUpload: (file: any) => {
      const newFileList: any[] = [];
      newFileList.push(file);
      setFileList(newFileList);
    },
    fileList
  };

  return (
    <Form form={form} preserve={false}>
      <FormItem>
        <Upload {...UploadProps}>
          <div>
            <Button><UploadOutlined />选择文件</Button>
          </div>
        </Upload>
      </FormItem>
      <FormItem>
        <Button type="primary" onClick={onSubmit}>导入</Button>
      </FormItem>
    </Form>
  );
};

export default ImportForm;
