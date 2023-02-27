import React, { useState } from 'react';
import { Modal, Form, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { importExercise } from '@/services/teacher/course/exercise'
const FormItem = Form.Item;
import * as APP from '@/app';
import { API } from '@/common/entity/typings';

interface ImportExerciseModalProps {
  onCancel: (flag?: boolean, formVals?: API.SclassStuParam) => void;
  fetchExerciseList: () => void;
  modalVisible: boolean;
  courseId: number;
};

const ImportExerciseModal: React.FC<ImportExerciseModalProps> = (props) => {

  const {
    onCancel: handleCreateModalVisible,
    fetchExerciseList: fetchExerciseList,
    modalVisible,
    courseId
  } = props;

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [filePathList, setFilePathList] = useState<string[]>([]);

  const onSubmit = async () => {
    if (filePathList.length > 0) {
      const result = await importExercise({ courseId: courseId, filePathList: filePathList });
      if (result.success) {
        message.success("导入成功");
        setFileList([]);
        setFilePathList([]);
        fetchExerciseList();
      } else {
        message.error(result.message);
      }
    } else {
      message.warn('请选择文件!')
    }
  };

  const UploadProps = {
    name: 'file',
    action: `${APP.request.prefix}/course/uploadExerciseListFile`,
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
    <Modal
      closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
      wrapClassName="modal-custom"
      title={'导入习题'}
      width={640}
      destroyOnClose
      open={modalVisible}
      footer={null}
      onCancel={() => { handleCreateModalVisible(false) }}
    >
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
    </Modal>
  );
};

export default ImportExerciseModal;
