import { ContentUtils } from 'braft-utils'
import { useState, useEffect } from 'react';
import SuperIcon from "@/pages/components/icons";
import { getCatalogueResourcesId } from '@/services/resources/upload';
import './index.less'
// import { Document, Page, pdfjs } from "react-pdf";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import { CHAPTER } from '@/common/entity/chapter'
import * as APP from '@/app';
const FileModel = (props: any) => {
  // 获取传递过来的数据
  const blockData = props.block.getData()
  const dataID = blockData.get('dataID')   // 资源id
  const dataURL = blockData.get('dataURL') // 资源url
  const dataName = blockData.get('dataName') // 资源名称
  const { textContent, chapterId, courseId } = props.blockProps
  const [fileVisible, setFileVisible] = useState<boolean>(false); //视频弹框判断
  // // react-pdf插件分页变量
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);
  // 要新增的资源对象，如果新增的话，将对象插入查询到的数组对象的资源数组中
  const resourcesData: CHAPTER.EditorResource = {
    id: -1, // 唯一id
    courseId: courseId,  // 课程id
    catalogueId: chapterId,  // 目录id
    resourcesId: dataID, // 资源id
    downloadAuth: 0, // 暂时没用
    isSpeed: 0,  // 倍速 0:是 1:否 默认是
    isTask: 0,   // 任务点 0: 否 1：是 默认是
    pageNum: 0,  // ppt分页，暂时不用
    fastForward: 0,  // 快进 0:是 1：否 默认是
    deleteFlag: 0,   // 是否删除 0: 否 1：是 默认不删除
    url: dataURL      // url地址
  }
  useEffect(() => {
    // 保存必须要有attachments属性
    if (!textContent.attachments) {
      textContent.attachments = []
    }
    const item = textContent.attachments.filter((res: any) => res.resourcesId == dataID)
    // 如果查不到，新增一条资源对象数据到资源数组,如果不是新增，不需要插入
    if (item.length == 0) {
      textContent.attachments.push(resourcesData)
    }
    /**
     * @function 获得资源对应的id
    */
    getCatalogueResourcesId().then((res) => {
      if (res.success) {
        resourcesData.id = res.obj
      }
    })
    // 避免不正常删除无法清除资源数据对象
    return ()=>{
      textContent.attachments.map((item: any) => {
        if (item.resourcesId == dataID) {
          item.deleteFlag = 1
        }
      })
    }

  }, [])
  // 注意：通过blockRendererFn定义的block，无法在编辑器中直接删除，需要在组件中增加删除按钮
  const removeBarBlock = () => {
    textContent.attachments.map((item: any) => {
      if (item.resourcesId == dataID) {
        item.deleteFlag = 1
      }
    })
    props.blockProps.editor.setValue(
      ContentUtils.removeBlock(props.blockProps.editorState, props.block)
    )
  }
  // const onDocumentLoadSuccess = ({ numPages }: any) => {
  //   setNumPages(numPages);
  // };
  // 隐藏区域
  const toggleMain = () => {
    if (!fileVisible) {
      setFileVisible(true)
    } else {
      setFileVisible(false)
    }
  }

  return (
    <>
    <div className="video-card">
        <div className='card-title'>
          <div>
            <SuperIcon type="icon-wendang" style={{fontSize: '1.5rem'}}/>
            <span style={{marginLeft: '10px'}}>文档</span>
          </div>
          <div>
            <span style={{fontWeight: 'bold'}}>{dataName}</span>
          </div>
          <div>
          {/* <button className='button-change' style={{marginRight: '20px'}}>替换</button> */}
            <SuperIcon type="icon-icon-delete-2" style={{fill: '#fff', fontSize: '1.5rem'}} onClick={removeBarBlock}/>
          </div>
        </div>
        <div className='card-content'>
          <div className='content-header'>
            <div onClick={toggleMain} style={{cursor: 'pointer'}}>
            {
              fileVisible ?  <SuperIcon type="icon-shouqi" style={{fontSize: '1.5rem'}}/> :  <SuperIcon type="icon-zhankai" style={{fontSize: '1.5rem'}}/>
            }
            {
              fileVisible ?  <span style={{marginLeft: '10px'}}>收起</span> :  <span style={{marginLeft: '10px'}}>展开</span>
            }
            </div>
          <div className='operate'></div>
          </div>
          {
            fileVisible && <div style={{width: '100%',height: '1px', background: '#DCDCDC'}}></div>
          }
          <div className="content-main" style={{width: '90%', margin: 'auto'}}>
              {/* 自定义 */}
              <div style={{ display: fileVisible ? 'block' : 'none', height: '400px', margin: '20px auto' }}>

                {/* <Document
                  file={dataURL}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={pageNumber} />
                </Document> */}
                <embed id="pdf-play-model" width="100%" height="100%" style={{ marginBottom: '40px', margin:'0px'}} src={APP.request.prefix+dataURL} type="application/pdf" />
                </div>
          </div>
        </div>
      </div>
    </>

  )
}
export default FileModel;