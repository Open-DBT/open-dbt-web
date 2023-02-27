import React from 'react';
import { useEffect, useState } from 'react';
import * as APP from '@/app';
import axios from 'axios';
import { Button, message, Modal, Upload, Tabs, Tree, Skeleton } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { listResourcesTree } from '@/services/resources/upload';
import type { UploadProps } from 'antd';
import './index.less'

interface IProps {
  onSubmit: (values: string) => void;
  onCancel: () => void;
  modalVisible: boolean;
}
interface DataNode {
  id: string;
  key: string;
  parentId: string;
  resourcesName: string;
  resourcesRename: string;
  resourcesTypeName: string;
  resourcesUrl: string;
  isleaf?: boolean;
  childrens?: DataNode[];
}

const SelectImage: React.FC<IProps> = (props) => {
  const [path, setPath] = useState('');     // 通用数据
  const [localPath, setLocalPath] = useState(''); // 本地
  const [servicePath, setServicePath] = useState(''); // 服务器
  const [url, setUrl] = useState('');
  const [imgList, setImgList] = useState<DataNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [sumbitDisabled, setSumbitDisabled] = useState<boolean>(true);  // 确认按钮禁用判断
  const {
    onSubmit: onSubmit,
    onCancel: onCancel,
    modalVisible,
  } = props;
  const uploadProps: UploadProps = {
    name: 'file',
    action: `${APP.request.prefix}/resources/uploadResources`,
    headers: {
      "authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
    maxCount: 1,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log('onChange', info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success('上传成功');
        setSumbitDisabled(false)
      } else if (info.file.status === 'error') {
        message.success('上传失败');
        setSumbitDisabled(true)
      }
    },
    beforeUpload(file: any) {
      if (file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/jpg') {
        message.error('仅支持上传jpg/jpeg/png格式的图片')
        return Upload.LIST_IGNORE;
      }
      return file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'
    },
    customRequest(data: any) {
      const formData = new FormData();
      formData.append(data.filename, data.file);

      formData.append('resourcesType', data.file.type)
      formData.append('resourcesName', data.file.name)
      formData.append('resourcesSize', data.file.size)
      formData.append('lastModifiedDate', data.file.lastModifiedDate)
      const headers = data.headers;
      axios.post(data.action, formData, { headers })
        .then((resp: any) => {
          let url = `${APP.request.prefix}/readResourse/`
          if (resp.data.obj.resourcesTypeName == '图片') {
            url += `image/${resp.data.obj.resourcesRename}`
          }
          setUrl(url)
          setLocalPath(url)
          setPath(url)
          data.onSuccess(resp, data.file);
        }).catch(data.onError);
    }
  };
  const { DirectoryTree } = Tree;
  const onChangeTab = (key: string) => {
    if (key == '2') {
      if (servicePath != '') {
        setPath(servicePath)
      }
      setSumbitDisabled(true)
      setLoading(true);
      getImgListData()
    } else if (key == '1') {
      if (localPath != '') {
        setPath(localPath)
      }
    }

  };
  /**
   * @function 请求图库列表
   * @param keys 
   * @param info 
   */
  const getImgListData = () => {
    const data = {
      resourcesRetype: 11
    }
    listResourcesTree(data).then((res) => {
      if (res.success) {
        setImgList(res.obj)
        setLoading(false);
      } else {
        setLoading(false);
      }
    })
  };
  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info: any) => {
    setSumbitDisabled(false)
    let url = `${APP.request.prefix}/readResourse/`
    if (info.node.resourcesTypeName == '图片') {
      url += `image/${info.node.resourcesRename}`
    }
    setServicePath(url)
    setPath(url)
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };
  return (
    <Modal
      className="editui-dialog-div"
      maskClosable={false}
      destroyOnClose
      title="插入图片"
      open={modalVisible}
      width={600}
      bodyStyle={{ minHeight: 240 }}
      onCancel={() => { onCancel() }}
      footer={[
        <Button key="back" onClick={() => { onCancel() }}>
          取消
        </Button>,
        <Button key="submit" type="primary" style={{ marginLeft: 20 }} disabled={sumbitDisabled} onClick={() => { onSubmit(path) }}>
          确认
        </Button>,
        ,
      ]}
    >
      <Tabs onChange={onChangeTab} type="card"
        items={[
          {
            key: "1",
            label: '本地上传',
            children:
              <>
                <div >
                  <Upload
                    {...uploadProps}
                    className="upload-list-inline"
                    accept='.bmp,.gif,.png,.jpeg,.jpg'
                    maxCount={1}
                  >
                    <Button type="primary" >上传图片</Button>
                  </Upload>
                </div>
                {
                  url != '' && (
                    <div>
                      <img src={url} style={{ marginBottom: 4 }} width={'100%'}></img>
                    </div>
                  )
                }
              </>
          }, {
            key: "2",
            label: '文件库选择',
            children:
              <Skeleton loading={loading}>
                <DirectoryTree
                  style={{ height: '200px', overflow: 'auto' }}
                  multiple
                  defaultExpandAll
                  onSelect={onSelect}
                  onExpand={onExpand}
                  treeData={imgList}
                  fieldNames={{ title: 'resourcesName', children: 'childrens' }}
                />
              </Skeleton>
          }
        ]}
      />

    </Modal>
  )
}

export default SelectImage;
