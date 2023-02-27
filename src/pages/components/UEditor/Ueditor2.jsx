import React, { useEffect, useState } from 'react'
import { ueditorConfig } from './ueditorConfig';
import { Upload } from 'antd';
// import { uploadImage } from '@/services/upload/upload';

/**富文本编辑器组件 */
const UEditor = (props, ref) => {
    const { config, initData, setContent } = props
    const [ueditor, setUeditor] = useState(null)
    let instances = {};
    useEffect(() => {
        initUeditor();
    }, [])

    /**初始化编辑器 */
    const initUeditor = () => {
        try {
            window.UE.delEditor("ueditor_id");
            let editor = window.UE.getEditor("ueditor_id", { 
              //focus时自动清空初始化时的内容    
            autoClearinitialContent:true,    
            //关闭字数统计    
            wordCount:false,    
            //关闭elementPath    
            elementPathEnabled:false,
            // 编辑器不自动被内容撑高
            autoHeightEnabled: false,
            // 初始容器高度
            initialFrameHeight: '100vh',
            // 初始容器宽度
            initialFrameWidth: '100%',
                ...ueditorConfig,
                ...config
            })
            /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */
            window.UE.registerUI('simpleupload', function (editor1, uiName) {
                console.log(editor1, uiName);
                // 创建一个 button
                var btn = new window.UE.ui.Button({
                    // 按钮的名字
                    name: uiName,
                    // 提示
                    title: '插入图片',
                    // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
                    cssRules: '',
                    // 点击时执行的命令
                    onclick: () => {
                        // 打开文件选择器
                        document.getElementById("ueditor_btn_file").click();
                    }
                })
                // 因为你是添加 button，所以需要返回这个 button
                return btn
            },
                undefined, /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */
                "ueditor_id"
            );
            editor.ready(() => {
                if (initData) {
                    editor.setContent(initData)  //设置默认值/表单回显
                }
            })
            editor.addListener("contentChange", function () {
                setContent(editor.getContent())
            });
            setUeditor(editor)
        } catch (error) {
        }
    }
    
    /**选择图片文件时触发 */
    const fileOnChange = (e) => {
        const file = new FormData();
        file.append('imgFile', e.target.files[0]);
        let imgWidth = e.target.files[0]
    }

    return (
        <>
            <script id="ueditor_id" type="text/plain"></script>
            <input type={"file"} id={"ueditor_btn_file"} accept={"image/*"} onChange={(e) => fileOnChange(e)} style={{ display: 'none' }}></input>
        </>
    )
}

export default UEditor
