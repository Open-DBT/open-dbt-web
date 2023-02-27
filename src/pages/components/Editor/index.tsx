import React, { useState, useEffect } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import BraftEditor from 'braft-editor'
import type { ControlType, EditorState, ExtendControlType } from 'braft-editor';
import { ContentUtils } from 'braft-utils'
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/table.css'
import { message } from 'antd';
// 引入编辑器自定义按钮弹框
import VideoModal from './components/Modal/videoModal';
import ImgModal from './components/Modal/imageModal';
import FileModal from './components/Modal/fileModal';
// 引入编辑器自定义渲染模块组件
import ImgModel from './components/Model/ImgModel'
import FileModel from './components/Model/FileModel'
import VideoModel from './components/Model/VideoModel'
import SuperIcon from "@/pages/components/icons";
// 编辑器样式
import './index.less'
import { api_saveRichTXT } from '@/services/resources/upload';
import { CHAPTER } from '@/common/entity/chapter';
import * as APP from '@/app';

// 在ts下需要声明window下previewWindow属性,用于预览功能
declare const window: Window & { previewWindow: any };  // 生命window下previewWindow属性

// 指定编辑器特有的编辑器控件，在编辑器中显示
const controls: ControlType[] = [
  'undo', 'redo', 'separator',
  'font-size', 'line-height', 'letter-spacing', 'separator',
  'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
  'superscript', 'subscript', 'remove-styles', 'separator', 'text-indent', 'text-align', 'separator',
  'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
  'link', 'separator', 'hr', 'separator',
  'separator',
  'clear'
];

/**
 * @function 编辑器组件函数
 * @param props 由父类继承过来的变量
*/
const ContentEditor = forwardRef((props: any, ref) => {
  const [imgVisible, setImgVisible] = useState<boolean>(false); //图片弹框判断
  const [videoVisible, setVideoVisible] = useState<boolean>(false); //视频弹框判断
  const [fileVisible, setFileVisible] = useState<boolean>(false); //视频弹框判断
  // 初始化参数
  const { courseId, clazzId, chapterId, textContent } = props
  // 获取初始化编辑器内容，进行初始化
  const [initialContent, setInitialContent] = useState<string>(textContent.contents)
  // 暴露父组件的方法引用，指向该页面的内部方式
  useImperativeHandle(ref, () => {
    return {
      sumbitUpload: sumbitUpload,
      preview: preview,
    };
  });
  /**
   *  @function 自定义html转raw函数
   *  @description 用于将输入的html其中指定名称的class的div转化成编辑器自定义渲染组件需要的类型,并跳转到render函数进行渲染
   *  自定义block输入转换器，用于将符合规则的html内容转换成相应的block，通常与blockExportFn中定义的输出转换规则相对应
  */
  const blockImportFn = (nodeName: any, node: any) => {
    // 图片输入转成组件形式
    // 现在图片用的框架本身的转图片方式，没用自定义图片渲染组件
    if (nodeName == 'div' && node.classList.contains("block-img")) {
      const dataID = node.dataset.id
      const dataURL = node.dataset.url
      return {
        type: 'block-img',
        data: { dataURL, dataID }
      }
    }
    // 视频输入转成组件形式
    if (nodeName == 'div' && node.classList.contains("block-video")) {
      const dataID = node.dataset.id  //视频ID
      const dataURL = node.dataset.url  // 视频地址
      const dataName = node.dataset.name // 视频名称
      return {
        type: 'block-video',
        data: { dataURL, dataID, dataName }
      }
    }
    // 文件输入转成组件形式
    if (nodeName == 'div' && node.classList.contains("block-file")) {
      const dataID = node.dataset.id  //文件ID
      const dataURL = node.dataset.url  // 文件地址
      const dataName = node.dataset.name // 文件名称
      return {
        type: 'block-file',
        data: { dataURL, dataID, dataName }
      }
    }
  }
  /**
* @function 导出html函数 
* @description
* 通过type辨别，具体需要展示什么内容，根据type将渲染组件转成相应的html内容，便于预览和保存后初始化使用
* 自定义block输出转换器，用于将不同的block转换成不同的html内容，通常与blockImportFn中定义的输入转换规则相对应
*/
  const blockExportFn = (contentState: any, block: any) => {
    const { dataURL, dataID, dataName } = block.data
    // 图片组件输出html形式,暂时不用
    if (block.type === 'block-img') {
      return {
        start: `<div class='block-img' data-id="${dataID}" data-url="${dataURL}">`,
        end: '</div>'
      }
    }
    // 视频组件输出html形式
    if (block.type === 'block-video') {
      // 获取当前id的视频资源的数据，传输到iframe视频页面中去，便于预览使用。
      const item = textContent.attachments.filter((res: any) => res.resourcesId == dataID)
      let isSpeed = ''     // 速度
      let isTask = ''      // 任务点
      let fastForward = '' // 快进
      let resourceId = ''   // 资源id
      let courseId = ''   // 课程id
      let catalogueId = ''   // 目录id
      let id = ''           // 资源唯一id
      let url = ''          // 资源访问地址
      if (item.length != 0) {
        isSpeed = item[0].isSpeed
        isTask = item[0].isTask
        fastForward = item[0].fastForward
        resourceId = item[0].resourcesId
        courseId = item[0].courseId
        catalogueId = item[0].catalogueId
        id = item[0].id
        url = item[0].url
      }
      return {
        // 外部div传参用于blockImportFn输入调用时需要的数据内容，用于初始化编辑器后映射为对应组件。
        // 内部iframe传参用于内部页面直接获取数据并调用，进行展示。
        start: `
      <div class='block-video' data-id="${dataID}" data-url="${dataURL}" data-name="${dataName}">
        <iframe id="html-iframe-${id}" onload="onLoadDataVideo('html-iframe-${id}')"  data-id="${id}" style="border-width: 0;border: 0; width: 80%;margin: auto;display: flex;height: 500px;"
        src= "/iframe/videoPlay.html?isSpeed=${isSpeed}&fastForward=${fastForward}&isTask=${isTask}&id=${id}&resourceId=${resourceId}&courseId=${courseId}&catalogueId=${catalogueId}&url=${dataURL}"></iframe>`,
        end: '</div>'
      }
    }
    // 文件组件输出html形式
    if (block.type === 'block-file') {
      // 获取当前id的文件资源的数据，传输到iframe视频页面中去，便于预览使用。
      const item = textContent.attachments.filter((res: any) => res.resourcesId == dataID)
      let resourceId = '' // 资源id
      let id = ''         // 资源唯一id
      let url = ''        // 资源地址
      if (item.length != 0) {
        resourceId = item[0].resourcesId
        id = item[0].id
        url = item[0].url
      }
      return {
        start: `<div class='block-file' data-id="${dataID}" data-url="${dataURL}" data-name="${dataName}"><iframe id="pdf-iframe-${id}" onload="onLoadDataPdf('pdf-iframe-${id}')" data-id="${id}"
      style="border-width: 0;border: 0; width: 80%;margin: auto;display: flex;height: 500px;"src= "/iframe/pdfView.html?id=${id}&resourceId=${resourceId}&url=${dataURL}"></iframe>`,
        end: '</div>'
      }
    }
  }
  // 声明blockRendererFn
  interface RendererFnProps {
    editor: any;
    editorState: any;
  }
  /**
   * @function 编辑器渲染函数
   * @description 用于根据blockImportFn的返回值进行渲染指定的自定义组件
   * @param block 获取的dom
   * @param props 编辑器数据对象
  */
  const blockRendererFn = (block: any, props: RendererFnProps) => {
    const { editor, editorState } = props
    // 对指定类型的捕获
    // 将输入的渲染成组件

    // 图片渲染，暂时不用
    if (block.getType() === 'block-img') {
      return {
        component: ImgModel, // 自定义图片组件
        editable: false, // 此处的editable并不代表组件内容实际可编辑，强烈建议设置为false
        props: { editor, editorState } // 传入自定义组件BlockColorComponent的数据，通过props.blockProps获取到
      }
    }
    // 视频渲染
    if (block.getType() === 'block-video') {
      const { dataName } = block.data
      return {
        component: VideoModel, // 自定义视频组件
        editable: false, // 此处的editable并不代表组件内容实际可编辑，强烈建议设置为false
        props: { editor, editorState, textContent, courseId, chapterId, dataName } // 传入自定义组件的数据，通过props.blockProps获取到
      }
    }
    // 文件渲染
    if (block.getType() === 'block-file') {
      return {
        component: FileModel, // 自定义文件组件
        editable: false, // 此处的editable并不代表组件内容实际可编辑，强烈建议设置为false
        props: { editor, editorState, textContent, courseId, chapterId } // 传入自定义组件的数据，通过props.blockProps获取到
      }
    }
  }
  // 初始化编辑器内容
  const [editorState, setEditorState] = useState<EditorState>(
    BraftEditor.createEditorState(initialContent, { blockImportFn, blockExportFn }),
  );
  /**
   * @function 预览
   * @description 打开新窗口进行编辑器内容输出HTML形式的预览
  */
  const preview = async () => {
    await sumbitUpload()
    window.open(`/edit/preview/${courseId}/${clazzId}/${chapterId}`);
    // if (window.previewWindow) {
    //   window.previewWindow.close()
    // }
    // window.previewWindow = window.open()
    // window.previewWindow.document.write(buildPreviewHtml())
    // window.previewWindow.document.close()
  }
  /**
   * @function 预览输出模板
   * @description 因为是新打开窗口，所以要在该页面上添加父页面传递参数到对应的iframe页面
   *              其中 onLoadDataVideo函数是视频传输，onLoadDataPdf是pdf传输
  */
  const buildPreviewHtml = () => {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
          <script>
          function onLoadDataVideo(val) {
            let frame = document.getElementById(val)
            frame.contentWindow.postMessage({dataID: val},'*');
          }
          function onLoadDataPdf(val) {
            let frame = document.getElementById(val)
            frame.contentWindow.postMessage({dataID: val},'*');
          }
          </script>
        </head>
        <body>
          <div class="container">${editorState.toHTML()}</div>
        </body>
      </html>
    `
  }
  /**
   * @function 修改编辑器的内容
   * @param editorState 编辑器数据对象，内置内容数据，用于编辑内容
  */
  const handleChange = (editorState: EditorState) => {
    setEditorState(editorState)
  }

  /**
   * @function 保存
   * @description 进行编辑器的html的保存
  */
  const sumbitUpload = () => {
    console.log('11111')
    const newVal = editorState.toHTML();
    console.log(newVal != '<p></p>')
    if (newVal && newVal != '<p></p>') {
      textContent.contents = newVal
      api_saveRichTXT(textContent).then((res) => {
        if (res.success) {
          message.success('保存成功');
        } else {
          message.error('保存失败');
        }
      })
    }
  }
  /**
   * @function 自定义扩展组件
  */
  const extendControls: ExtendControlType[] = [
    // 插入图片
    {
      key: 'insert-img',
      type: 'button',
      title: '插入图片',
      text: (<SuperIcon type="icon-tupian" />),
      onClick: () => setImgVisible(true),
    },
    // 插入视频
    {
      key: 'insert-video',
      type: 'button',
      title: '插入视频',
      text: (<SuperIcon type="icon-shipin" />),
      onClick: () => setVideoVisible(true),
    },
    // 插入文件
    {
      key: 'insert-file',
      type: 'button',
      title: '插入文件',
      text: (<SuperIcon type="icon-wendang" />),
      onClick: () => setFileVisible(true),
    },
    // {
    //   key: 'custom-button',
    //   type: 'button',
    //   title: '预览',
    //   text: (<SuperIcon type="icon-yulan" />),
    //   onClick: preview
    // },
    // {
    //   key: 'upload-comp',
    //   type: 'button',
    //   title: '保存',
    //   className: 'upload-button',
    //   html: null,
    //   text: (<SuperIcon type="icon-baocun" />),
    //   onClick: sumbitUpload,
    // },
  ];
  return (
    <div className='editor-container'>
      <div className="editor-wrapper">
        <BraftEditor
          id='chapter-editor'
          value={editorState}
          onChange={handleChange}
          placeholder={'请输入内容'}
          blockRendererFn={blockRendererFn}
          converts={{ blockImportFn, blockExportFn }}
          controls={controls}
          extendControls={extendControls}
        />
      </div>
      {/* 插入图片自定义弹框 */}
      {
        imgVisible && (
          <ImgModal
            modalVisible={imgVisible}
            onCancel={() => { setImgVisible(false) }}
            onSubmit={(value: string) => {
              // 没有值，关闭弹框，避免报错
              if (value == '') {
                setImgVisible(false)
                return
              }
              let url = value
              // 使用编辑器自带的media功能来显示图片
              setEditorState(
                ContentUtils.insertMedias(editorState, [{
                  type: 'IMAGE',
                  url: url
                }])
                // //自定义显示，暂时不用
                // ContentUtils.insertHTML(editorState, `<p><div class='block-img' data-id="${data.id}" data-url="${url}">自定义高亮内容</div></p>`, {
                //   blockImportFn,
                //   blockExportFn
                // })
              )
              setImgVisible(false)
            }}
          />
        )}
      {/* 插入视频自定义弹框 */}
      {
        videoVisible && (
          <VideoModal
            modalVisible={videoVisible}
            onCancel={() => { setVideoVisible(false) }}
            onSubmit={(value: CHAPTER.HistoryResource) => {
              // 没有值，关闭弹框，避免报错
              if (!value) {
                setVideoVisible(false)
                return
              }
               value.url = `/readResourse/video/${value.resourcesRename}`
              let url = `${APP.request.prefix}/readResourse/`
              if (value.resourcesTypeName == '视频') {
                url += `video/${value.resourcesRename}`
              }
             
              const newVal = editorState.toHTML();
              if (newVal && newVal != '<p></p>') {
                //验证视频是否存在
                const index = newVal.indexOf(`data-id="${value.id}"`);
                if (index > -1) {
                  message.info('当前视频已经插入到本章节');
                  return;
                }
              }
              // 使用自定义的视频渲染组件，用'block-video'和对应参数的div对应相应的视频组件
              setEditorState(
                ContentUtils.insertHTML(editorState, `<p><div class='block-video' data-id="${value.id}" data-url="${value.url}" data-name="${value.resourcesName}"></div></p>`, {
                  blockImportFn,
                  blockExportFn
                })
              )
              setVideoVisible(false)
            }}
          />
        )}
      {/* 插入文件自定义弹框 */}
      {
        fileVisible && (
          <FileModal
            modalVisible={fileVisible}
            onCancel={() => { setFileVisible(false) }}
            onSubmit={(value: string) => {
              if (value == '') {
                setFileVisible(false)
                return
              }
              let data = JSON.parse(value)
              // 使用自定义的文件渲染组件，用'block-video'和对应参数的div对应相应的文件组件
              setEditorState(
                ContentUtils.insertHTML(editorState, `<p><div class='block-file' data-id="${data.id}"  data-url="${data.url}" data-name="${data.resourcesName}"></div></p>`, {
                  blockImportFn,
                  blockExportFn
                })
              )
              setFileVisible(false)
            }}
          />
        )}
    </div>
  )
})
export default ContentEditor;