import { useCallback } from 'react';
import BraftEditor, { BraftEditorProps, ControlType } from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import './index.css'

const options = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  columnResizable: true, // 是否允许拖动调整列宽，默认false
  exportAttrString: 'border="1" style="border-collapse: collapse"', // 指定输出HTML时附加到table标签上的属性字符串
};

export default function Braft(props: BraftEditorProps) {
  const { readOnly, value, controls, onChange, ...restProps } = props;
  const onEditorChange = useCallback((e) => {
    return onChange && onChange(e);
  }, [onChange]);

  BraftEditor.use(Table(options));

  //'font-family',  , 'table'
  const controlsData: ControlType[] = ['undo', 'redo', 'separator', 'font-size', 'line-height', 'letter-spacing', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator', 'superscript', 'subscript', 'remove-styles',
    'emoji', 'separator', 'text-indent', 'text-align', 'separator', 'headings', 'list-ul', 'list-ol', 'blockquote', 'code',
    'separator', 'media', 'link', 'hr', 'separator', 'clear', 'separator', 'fullscreen'
    ,'table'
  ];

  return (
    <BraftEditor
      {...restProps}
      controls={readOnly ? [] : (controls?controls:controlsData)}
      value={BraftEditor.createEditorState(value)}
      onChange={onEditorChange}
      className="test1"
      readOnly={readOnly}
      style={{ width: '95%' }}
    />
  );
}
