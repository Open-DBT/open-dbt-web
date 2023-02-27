import { useState, useCallback } from 'react';
import BraftEditor, { BraftEditorProps, ControlType, EditorState, ExtendControlType } from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import { ContentUtils } from 'braft-utils'
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import './braft.css'
import SuperIcon from "@/pages/components/icons";
import ImgModal from '@/pages/components/Editor/components/Modal/imageModal';
const options = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  columnResizable: true, // 是否允许拖动调整列宽，默认false
  exportAttrString: 'border="1" style="border-collapse: collapse"', // 指定输出HTML时附加到table标签上的属性字符串
};

export default function Braft(props: BraftEditorProps) {
  const { value, readOnly, controls, onChange, ...restProps } = props;
  const [imgVisible, setImgVisible] = useState<boolean>(false); //图片弹框判断
  const [editorState, setEditorState] = useState<EditorState>(
    BraftEditor.createEditorState(value)
  );
  const onEditorChange = useCallback( async(e) => {
    await setEditorState(e)
    return onChange && onChange(e);
  }, [onChange]);

  BraftEditor.use(Table(options));

  //'font-family',  , 'table'
  const controlsData: ControlType[] = ['undo', 'redo', 'separator', 'font-size', 'line-height', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through',
    'separator', 'text-align', 'separator',
    'separator',  'link', 'separator', 'clear'
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
        controls={readOnly ? [] : (controls ? controls : controlsData)}
        extendControls={extendControls}
        value={editorState}
        onChange={onEditorChange}
        className="test1"
        readOnly={readOnly}
        style={{ width: '100%' }}
      />
    </>
  );
}
