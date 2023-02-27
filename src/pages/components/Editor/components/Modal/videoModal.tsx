import React from 'react';
import { useEffect, useState } from 'react';
import * as APP from '@/app';
import axios from 'axios';
import { Button, message, Modal, Upload, Tabs, Tree, Skeleton } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { listResourcesTree } from '@/services/resources/upload';
import type { UploadProps } from 'antd';
import './index.less'
import { CHAPTER } from '@/common/entity/chapter';
import { API } from '@/common/entity/typings';

interface IProps {
  onSubmit: (values: CHAPTER.HistoryResource) => void;
  onCancel: () => void;
  modalVisible: boolean;
}

const SelectImage: React.FC<IProps> = (props) => {
  const [path, setPath] = useState<CHAPTER.HistoryResource>();     // 通用数据
  // const [localPath, setLocalPath] = useState(''); // 本地
  // const [servicePath, setServicePath] = useState(''); // 服务器
  const [url, setUrl] = useState('');
  const [videoList, setVideoList] = useState<CHAPTER.HistoryResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [sumbitDisabled, setSumbitDisabled] = useState<boolean>(true);  // 确认按钮禁用判断
  const { DirectoryTree } = Tree;
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
      } else if (info.file.status === 'removed') {
        // 当删除文件时，去掉视频显示和按钮确认操作
        setUrl('')
        setSumbitDisabled(true)
      }
    },
    beforeUpload(file: any) {
      console.log(file.type)
      if (!file.type.includes('video')) {
        message.error('仅支持上传视频')
        return Upload.LIST_IGNORE;
      }
      return file.type.includes('video')
    },

    customRequest(data: any) {
      // 初始化按钮和回显页面
      setUrl('')
      setSumbitDisabled(true)

      const formData = new FormData();
      formData.append(data.filename, data.file);
      formData.append('resourcesType', data.file.type)
      formData.append('resourcesName', data.file.name)
      formData.append('resourcesSize', data.file.size)
      formData.append('lastModifiedDate', data.file.lastModifiedDate)
      const headers = data.headers;
      axios.post(data.action, formData, { headers })
        .then((resp: API.Result<CHAPTER.HistoryResource[]>) => {
          debugger
          let url = `${APP.request.prefix}/readResourse/`
          if (resp.data.obj.resourcesTypeName == '视频') {
            url += `video/${resp.data.obj.resourcesRename}`
          }
          resp.data.obj.url = url
          setUrl(url)
          // setLocalPath(JSON.stringify(resp.data.obj))
          // setPath(JSON.stringify(resp.data.obj))
          setPath(resp.data.obj)
          data.onSuccess(resp, data.file);
        }).catch(data.onError);
    }
  };
  const onChangeTab = (key: string) => {
    if (key == '2') {
      setLoading(true);
      setSumbitDisabled(true)
      getImgListData()
    }
  };
  /**
 * @function 请求图库列表
 * @param keys 
 * @param info 
 */
  const getImgListData = () => {
    const data = {
      resourcesRetype: 9
    }
    listResourcesTree(data).then((res) => {
      if (res.success) {
        setVideoList(res.obj)
        setLoading(false);
      } else {
        setLoading(false);
      }
    })
  };
  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info: any) => {
    setSumbitDisabled(false)
    setPath(info.node)
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };
  return (
    <Modal
      className="editui-dialog-div"
      maskClosable={false}
      destroyOnClose
      title="插入视频"
      open={modalVisible}
      width={600}
      bodyStyle={{ minHeight: 240 }}
      onCancel={() => { onCancel() }}
      footer={[
        <Button key="back" onClick={() => { onCancel() }}>
          取消
        </Button>,
        <Button key="submit" type="primary" disabled={sumbitDisabled} style={{ marginLeft: 20 }}
          onClick={() => {
            path && onSubmit(path)
          }}>
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
                    accept='video/*'
                    maxCount={1}
                  >
                    <Button type="primary" >上传视频</Button>
                  </Upload>
                </div>
                {
                  url != '' && (
                    <div>
                      <video id="video-view" src={url} controls width="100%" height="100%" muted></video>
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
                  treeData={videoList}
                  fieldNames={{ title: 'resourcesName', key: 'id', children: 'childrens' }}
                />
              </Skeleton>
          }
        ]}
      />
    </Modal >
  )
}

export default SelectImage;
