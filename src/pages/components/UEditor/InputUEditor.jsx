import React, { Component, useState } from 'react';
import UEditor from '@/pages/components/UEditor/Ueditor2'
/**富文本输入框组件*/
const InputUEditor = (props) =>{
    const { value, onChange, configOption} = props;
    // const ueInputRef = useRef(null);
    const [config, setConfig] = useState(configOption);
    const [initData, setInitData] = useState(value || '');
    const setContent = (e) => {
        // onChange(e)
    }
    return(
        <UEditor config={config} initData={initData} setContent={(e) => setContent(e)} />
    )
}

export default InputUEditor
