import { ContentUtils } from 'braft-utils'
import { Card, Checkbox  } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import "video-react/dist/video-react.css"; // import css
import { useEffect, useState } from 'react';
import SuperIcon from "@/pages/components/icons";
import "./index.less"
import { CHAPTER } from '@/common/entity/chapter'
import { getCatalogueResourcesId } from '@/services/resources/upload';
declare const window: Window & { mesFromIframe: any };  // 生命window下previewWindow属性

// 自定义组件，可加入自定义功能
const VideoModel = (props: any) => {
  const blockData = props.block.getData()
  const dataID = blockData.get('dataID')   // 资源id
  const dataURL = blockData.get('dataURL')  // 资源url
  const dataName = blockData.get('dataName')  // 资源名称
  const { textContent, chapterId, courseId } = props.blockProps
  // 要新增的资源对象，如果新增的话，将对象插入查询到的数组对象的资源数组中
  const resourcesData: CHAPTER.EditorResource = {
    id: -1, // 唯一id
    courseId: courseId,  // 课程id
    catalogueId: chapterId,  // 目录id
    resourcesId: dataID, // 资源id
    downloadAuth: 0, // 暂时没用
    isSpeed: 0,  // 倍速 0:是 1:否 默认是
    isTask: 1,   // 任务点 0: 否 1：是 默认是
    pageNum: 0,  // ppt分页，暂时不用
    fastForward: 0,  // 快进 0:是 1：否 默认是
    deleteFlag: 0,   // 是否删除 0: 否 1：是 默认不删除
    url: dataURL      // url地址
  }
  const [visible, setVisible] = useState<boolean>(false); //图片弹框判断
  const [speedVisible, setSpeedVisible] = useState<boolean>(resourcesData.isSpeed==0?true:false); //速度弹框判断
  const [itemVisible, setItemVisible] = useState<boolean>(resourcesData.isTask==1?true:false); //任务点弹框判断
  const [farwordVisible, setFarwordVisible] = useState<boolean>(resourcesData.fastForward==0?true:false); //快进弹框判断
  useEffect(() => {
    // 保存必须要有attachments属性
    if(!textContent.attachments) {
      textContent.attachments = []
    }
    const item = textContent.attachments.filter((res:any)=>res.resourcesId == dataID)
    // 如果查不到，新增一条资源对象数据到资源数组中,查到了改变按钮显示状态
    if(item.length == 0) {
      textContent.attachments.push(resourcesData)
    }else {
      if(item[0].isSpeed == 1) {
        setSpeedVisible(false)
      }else {
        setSpeedVisible(true)
      }
      if(item[0].isTask == 0) {
        setItemVisible(false)
      }else {
        setItemVisible(true)
      }
      if(item[0].fastForward == 1) {
        setFarwordVisible(false)
      }else {
        setFarwordVisible(true)
      }
    }
    
    /**
     * @function 获得资源对应的id
    */
    getCatalogueResourcesId().then((res) => {
      if(res.success) {
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
  },[])
  // 任务点选择函数
  const onChangeCheckboxItem = (e: CheckboxChangeEvent) => {
    setItemVisible(e.target.checked)
    if(e.target.checked) {
      onChangeTask(1);
    }else {
      onChangeTask(0);
    }
  };
  // 速度选择函数
  const onChangeCheckboxSpeed = (e: CheckboxChangeEvent) => {
    setSpeedVisible(e.target.checked)
    if(e.target.checked) {
      onChangeSpeed(0);
    }else {
      onChangeSpeed(1);
    }
  };
  // 快进选择函数
  const onChangeCheckboxFarword = (e: CheckboxChangeEvent) => {
    setFarwordVisible(e.target.checked)
    if(e.target.checked) {
      onChangeFarword(0);
    }else {
      onChangeFarword(1);
    }
  };
  // 点击删除
  // 注意：通过blockRendererFn定义的block，无法在编辑器中直接删除，需要在组件中增加删除按钮
  const removeBarBlock = () => {
    textContent.attachments.map( (item:any) =>{
      item.deleteFlag = 1
      if(item.resourcesId == dataID) {
        item.deleteFlag = 1
      }
     })
    props.blockProps.editor.setValue(
      ContentUtils.removeBlock(props.blockProps.editorState, props.block)
    )
  }
  // 任务判断
  const onChangeTask = (val: number) => {
    console.log('onChangeTask:', val)
    textContent.attachments.map( (item: CHAPTER.EditorResource) =>{
    if(item.resourcesId == dataID) {
      item.isTask = val
    }
   })
   console.log('textContent.attachments:', textContent.attachments)
  };
    // 快进判断
  const onChangeFarword = (val: number) => {
    textContent.attachments.map( (item: CHAPTER.EditorResource) =>{
     if(item.resourcesId == dataID) {
       item.fastForward = val
     }
    })
   };
     // 速度判断
   const onChangeSpeed = (val: number) => {
    textContent.attachments.map( (item: CHAPTER.EditorResource) =>{
     if(item.resourcesId == dataID) {
       item.isSpeed = val
     }
    })
   };
  //  对视频iframe进行数据传输
   const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
    input !== null && input.tagName === 'IFRAME';
   const onLoad = () => {
    let frame = document.getElementById(`my-iframe-${dataID}`);
    if (isIFrame(frame) && frame.contentWindow) {
      frame.contentWindow.postMessage({dataURL: dataURL,dataID: dataID},'*');
    }
   }
  // 隐藏区域
  const toggleMain = () => {
    if (!visible) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }
  return (
    <>
      <div className="video-card">
        <div className='card-title'>
          <div>
            <SuperIcon type="icon-shipin" style={{fontSize: '1.5rem'}}/>
            <span style={{marginLeft: '10px'}}>视频</span>
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
              visible ?  <SuperIcon type="icon-shouqi" style={{fontSize: '1.5rem'}}/> :  <SuperIcon type="icon-zhankai" style={{fontSize: '1.5rem'}}/>
            }
            {
              visible ?  <span style={{marginLeft: '10px'}}>收起</span> :  <span style={{marginLeft: '10px'}}>展开</span>
            }
            </div>
          <div className='operate'>
            <Checkbox onChange={onChangeCheckboxItem} checked={itemVisible}>任务点</Checkbox>
            {/* <Checkbox onChange={onChangeCheckboxFarword} checked={farwordVisible}>快进</Checkbox> */}
            {/* <Checkbox onChange={onChangeCheckboxSpeed} checked={speedVisible}>倍速</Checkbox> */}
          </div>
          </div>
          {
            visible && <div style={{width: '100%',height: '1px', background: '#DCDCDC'}}></div>
          }
          <div className="content-main" style={{width: '90%', margin: 'auto'}}>
              {/* 自定义 */}
              <iframe id={`my-iframe-${dataID}`} onLoad={onLoad} src={`/iframe/video.html?id=${dataID}&url=${dataURL}`} style={{ width: "100%", height: "450px", border: "none", display: visible?'block':'none',marginBottom: '20px'}}></iframe>
          </div>
        </div>
      </div>
    </>

  )
}
export default VideoModel;