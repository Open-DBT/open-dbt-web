import { useCallback, useEffect, useRef, useState } from 'react';
import BraftEditor, { BraftEditorProps, ControlType, EditorState, ExtendControlType } from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import './braft.css'
import { FormInstance } from 'antd';
import { QUESTION_BANK } from '@/common/entity/questionbank'
import { ContentUtils } from 'braft-utils'
import SuperIcon from "@/pages/components/icons";
import ImgModal from '@/pages/components/Editor/components/Modal/imageModal';
const options = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  columnResizable: true, // 是否允许拖动调整列宽，默认false
  exportAttrString: 'border="1" style="border-collapse: collapse"', // 指定输出HTML时附加到table标签上的属性字符串
  // includeEditors: ['id-1'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // excludeEditors: ['id-2']  // 指定该模块对哪些BraftEditor无效
};
BraftEditor.use(Table(options));

interface A extends BraftEditorProps {
  form: FormInstance<any>;
  formName: string;
  optionNumber?: number | undefined;
}
export default function Braft(props: A) {
  // export default function Braft(props: any) {
  const { onChange, form, formName, optionNumber, ...restProps } = props;
  const ref = useRef(null)
  const value = getValue(formName);
  const [imgVisible, setImgVisible] = useState<boolean>(false); //图片弹框判断
  const [editorState, setEditorState] = useState<EditorState>(
    BraftEditor.createEditorState(value)
  );
  useEffect(() => {
    const obj = ref.current! as BraftEditor;
    // const value = props.form.getFieldValue(props.formName)
    obj.onChange(BraftEditor.createEditorState(value ?? null))
  }, [])

  const handleChange = async (val: any) => {
    await setEditorState(val)
    val && setValue(formName, val)
  };

  /**
   * 根据表单name获取值，options代表选项
   * @param formName 
   * @returns 
   */
  function getValue(formName: string) {
    if (optionNumber != undefined && formName == 'options') {
      const option = form.getFieldValue(formName)[optionNumber];
      if (option == undefined) {
        return '';
      } else if ((option as QUESTION_BANK.QuestionExerciseOption).content) {
        return (option as QUESTION_BANK.QuestionExerciseOption).content;
      } else {
        return (option as EditorState).toHTML();
      }
    }
    return form.getFieldValue(formName);
  }
  function setValue(formName: string, obj: BraftEditor) {
    if (optionNumber != undefined && formName == 'options') {
      const options = form.getFieldValue("options");
      options[optionNumber] = obj;
      form.setFieldValue(formName, options)
    }
    else form.setFieldValue(formName, obj)

  }

  //'font-family',  , 'table'
  const controlsData: ControlType[] = ['undo', 'redo', 'separator', 'font-size', 'line-height', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through',
    'separator', 'text-align', 'separator',
    'separator', 'link', 'separator', 'clear'
  ];
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
  ]
  return (
    <>
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
              )
              setImgVisible(false)
            }}
          />
        )}
      <BraftEditor
        {...restProps}
        ref={ref}
        controls={controlsData}
        extendControls={extendControls}
        value={editorState}
        // onChange={onEditorChange}
        onChange={handleChange}
        className="test1"
        // readOnly={readOnly}
        style={{ width: '100%' }}
      />
    </>
  );
}
