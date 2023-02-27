import React, { useEffect, useState } from 'react'
// import { ueditorConfig } from './ueditorConfig';
// import { ueditorConfig } from './ueditor.config'
import { Upload } from 'antd';
// import { uploadImage } from '@/services/upload/upload';

/**富文本编辑器组件 */
const UEditor = (props, ref) => {
    const { id, config, initData, setContent } = props
    const [ueditor, setUeditor] = useState(null)
    let instances = {};
    useEffect(() => {
        initUeditor();
    }, [])

    /**初始化编辑器 */
    const initUeditor = () => {
        try {
            window.UE.delEditor(id);
            let editor = window.UE.getEditor(id, {
                // ...ueditorConfig,
                ...config
            })
            editor.addListener("contentChange", function (e) {
                // setContent(editor.getContent())
                console.log('e ', editor.getContent())
            });
            editor.ready(() => {
                if (initData) {
                    editor.setContent(initData)  //设置默认值/表单回显
                }
            })
        } catch (error) {
            console.log('error', error)
          
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
            <script id={id} type="text/plain"></script>
        </>
    )
}

export default UEditor
