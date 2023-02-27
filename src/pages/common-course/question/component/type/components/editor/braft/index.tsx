import React, { useState, useEffect } from 'react'
import BraftEditor from './edit';
import { FormInstance } from 'antd';
import { BraftEditorProps, EditorState } from 'braft-editor';
import { QUESTION_BANK } from '@/common/entity/questionbank'
import './index.less';
interface IProps {
  flag: boolean;
  formName: string;
  form: FormInstance<any>;
  setCurrent: Function;
  optionNumber?: number;
}

export default function BraftComponent(props: IProps) {
  const { flag, optionNumber, form, formName } = props;
  const [clickInputBol, setClickInputBol] = useState<boolean>(flag)

  useEffect(() => {
    setClickInputBol(flag)
  }, [flag])

  const getContent = () => {
    if (formName == 'options') {
      const options = form.getFieldValue(formName) as Array<unknown>;
      if (options.length > 0) {
        const option = options[optionNumber!];
        if (option == undefined) {
          return '';
        } else if ((option as QUESTION_BANK.QuestionExerciseOption).content) {
          return (option as QUESTION_BANK.QuestionExerciseOption).content;
        } else {
          return (option as EditorState).toHTML();
        }
      }
      return ''
    } else return form.getFieldValue(formName)
  }

  const switchTo = () => {
    setClickInputBol(true)
    props.setCurrent(clickInputBol);
  }
  return (
    <>
      {
        clickInputBol ?
          <BraftEditor className="border" placeholder="请输入正文内容" {...props} /> :
          // <div onClick={() => setClickInputBol(true)} dangerouslySetInnerHTML={{ __html: contentTransfer('stem', -1) }} className="html-div" />
          <div onClick={() => switchTo()} dangerouslySetInnerHTML={{ __html: getContent() }} className="html-div" />

      }
    </>
  );
}
