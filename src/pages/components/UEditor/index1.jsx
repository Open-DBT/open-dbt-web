import React from 'react';
const UE = window.UE;

class Ueditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            editor: ''
        };
        this.timer = null;
    }

    componentDidMount() {
        this.initEditor()
    }

    UNSAFE_componentWillUnmount() {
        // 组件卸载后，清除放入库的id
        if (typeof (UE.getEditor(this.props.id)) != 'undefined') {
            UE.getEditor(this.props.id).destroy();
            clearTimeout(this.timer)
        }
    }

    initEditor() {
        /*初始化编辑器*/
        const { id, contentChange } = this.props;
        const ueEditor = UE.getEditor(this.props.id, {
            // 编辑器不自动被内容撑高
            autoHeightEnabled: false,
            // 初始容器高度
            initialFrameHeight: 400,
            // 初始容器宽度
            initialFrameWidth: '100%',
            toolbars: [
                [
                    // "fullscreen",
                    // "source",
                    // "|",
                    "undo",
                    "redo",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "fontborder",
                    "strikethrough",
                    "superscript",
                    "subscript",
                    // "removeformat",
                    // "formatmatch",
                    // "autotypeset",
                    // "blockquote",
                    // "pasteplain",
                    "|",
                    "forecolor",
                    "backcolor",
                    "insertorderedlist",
                    "insertunorderedlist",
                    "selectall",
                    // "cleardoc",
                    "|",
                    "rowspacingtop",
                    "rowspacingbottom",
                    "lineheight",
                    "|",
                    "customstyle",
                    "paragraph",
                    "fontfamily",
                    "fontsize",
                    "|",
                    "directionalityltr",
                    "directionalityrtl",
                    "indent",
                    "|",
                    "justifyleft",
                    "justifycenter",
                    "justifyright",
                    "justifyjustify",
                    "|",
                    "touppercase",
                    "tolowercase",
                    // "|",
                    // "link",
                    // "unlink",
                    // "anchor",
                    // "|",
                    // "imagenone",
                    // "imageleft",
                    // "imageright",
                    // "imagecenter",
                    "|",
                    "simpleupload",
                    // "insertimage",
                    // "emotion",
                    // "scrawl",
                    // "insertvideo",
                    // "music",
                    // "attachment",
                    // "map",
                    // "gmap",
                    // "insertframe",
                    // "insertcode",
                    // "webapp",
                    // "pagebreak",
                    // "template",
                    // "background",
                    "|",
                    "horizontal",
                    "date",
                    "time",
                    "spechars",
                    // "snapscreen",
                    // "wordimage",
                    "|",
                    "inserttable",
                    "deletetable",
                    "insertparagraphbeforetable",
                    "insertrow",
                    "deleterow",
                    "insertcol",
                    "deletecol",
                    "mergecells",
                    "mergeright",
                    "mergedown",
                    "splittocells",
                    "splittorows",
                    "splittocols",
                    // "charts",
                    // "|",
                    // "print",
                    // "preview",
                    // "searchreplace",
                    // "drafts",
                    // "help"
                ]
            ]
        });

        const self = this;
        //图片上传
        ueEditor.commands['uploadimg'] = {
            execCommand: function () {
                self.inputPicFile.click()
            },
            queryCommandState: function () { }
        };

        ueEditor.addListener('contentChange', () => {
            // contentChange()
        });

        //视频上传
        ueEditor.commands['uploadvideo'] = {
            execCommand: function () {
                self.inputVideoFile.click()
                return true;

            },
            queryCommandState: function () { }
        };

        ueEditor.ready((ueditor) => {
            if (!ueditor) {
                UE.delEditor(id);
                self.initEditor();
            }
        });

        let editor = ueEditor;
        this.setState({ editor });
    }
    setVal(con) {
        let { editor } = this.state;
        editor.ready((ueditor) => {
            if (ueditor) {
                con = con.replace(/video-js\" src/gi, "\" _url")
                con = con.replace(/<video/gi, "<img src='/manage/ueditor/themes/default/images/spacer.gif' style='background:url(/manage/ueditor/themes/default/images/videologo.gif) no-repeat center center; border:1px solid gray;'")
                con = con.replace(/<\/video>/gi, "</img>")
                editor.setContent(con);
                clearTimeout(this.timer)
            }
        });
        this.timer = setTimeout(function () {
            editor.setContent(con);
        }, 700)
    }
    getVal() {
        let { editor } = this.state;
        let content = editor.getContent();
        return content;
    }
    onChangeImg() {
        var _this = this;
        var file = this.inputPicFile.files[0]
        if (file) {
            // api.uploadImage(file).then((res) => {
            //     const { data } = res;
            //     let editor = _this.state.editor;
            //     editor.execCommand('inserthtml', `<img src=${data.serverUrl + data.url} />`);
            // })
        }
        this.inputPicFile.value = '';
    }
    onChangeVideo() {
        var _this = this;
        var file = this.inputVideoFile.files[0]
        if (file) {
            // api.uploadFile(file).then((res) => {
            //     const { data } = res;
            //     let editor = _this.state.editor;
            //     editor.execCommand('insertHtml',
            //         `<img _url=${data.serverUrl + data.url} class="edui-upload-video"  width="420" height="280" src="/manage/ueditor/themes/default/images/spacer.gif" style="background:url(/manage/ueditor/themes/default/images/videologo.gif) no-repeat center center; border:1px solid gray;">`);
            // })
        }
        this.inputVideoFile.value = '';
    }
    render() {
        let { content, id } = this.props;
        return (
            <React.Fragment>
                <textarea id={id}
                    defaultValue={content}
                    onChange={this.getVal} />
                <input onChange={() => this.onChangeImg()} type="file" ref={(n) => { this.inputPicFile = n }} style={{ display: 'none' }} />
                <input onChange={() => this.onChangeVideo()} type="file" ref={(n) => { this.inputVideoFile = n }} style={{ display: 'none' }} />
            </React.Fragment>
        )
    }
}
export default Ueditor;

