import { ContentUtils } from 'braft-utils';
import { Card, Switch   } from 'antd';
import { uploadResourceSelect } from '@/services/resources/upload';
import { useState, useEffect } from 'react';
import React from 'react';
import "video-react/dist/video-react.css"; // import css

// import RectVideo from '@/pages/components/Video'
// Create styles
// 自定义组件，可加入自定义功能
const ImgModel = (props: any) => {
  const data = {
    id: "",
    courseId: props.blockProps.courseId,
    catalogueId: props.blockProps.chapterId,
    resourcesId: 1,
    pageNum: "",
    downloadAuth: "",
    processSet: "",
    isSpeed: "",
    isTask: "1",
    fastForward: ""
  }
  // const blockData = props.block.getData()
  // const text = blockData.get('text') // 获得捕获的插入文本
  // 注意：通过blockRendererFn定义的block，无法在编辑器中直接删除，需要在组件中增加删除按钮
  const blockData = props.block.getData()
  const dataID = blockData.get('dataID')
  const [dataURL, setDataURL ] = useState<string>(blockData.get('dataURL'))
  const removeBarBlock = () => {
    props.blockProps.editor.setValue(
      ContentUtils.removeBlock(props.blockProps.editorState, props.block)
    )
  }
  const onChange = (checked: boolean) => {
  };
  useEffect(() => {
    uploadResourceSelect(dataID).then((res: any) => {
      setDataURL(URL.createObjectURL(res))
    })
  }, []);
  return (
    <>
      <Card title="图片模块" extra={
      <button className='button-remove' onClick={removeBarBlock}>
        <i className='bfi-bin'></i>
      </button>} style={{ width: 600 }
    }>
     开启任务点：<Switch defaultChecked onChange={onChange} />
      <div className='block-color'>
      <i className='height_light_lineIcon'></i><br/>
      {/* 自定义 */}
      {/* <img src="ceshi.png" alt="" width={'100%'} height={'300px'}/> */}
     <img src={dataURL} style={{ marginBottom: 4}} width={'100%'}></img>
    </div>
    </Card>
    </>
    
  )
}
export default ImgModel;