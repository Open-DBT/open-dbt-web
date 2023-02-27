import React from 'react';
import { findRichTXTByStudent, saveProgressByStudent } from '@/services/student/course/chapter'

declare const window: Window & { mesFromIframe: any };  // 生命window下previewWindow属性

class viewContent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      courseId: this.props.courseId,
      chapterId: this.props.chapterId,
      oldChapterId: '',
      content: '',
      visible: false
    };
    console.log('viewContent props', props)
  }
  /**
   * 初始化
   */
  componentDidMount() {
    const that = this;
    this.props.updateStudyState(333)

    // 初始化获取文章内容
    this.getData()
    /**
     * onmessage接收方，对应/public/iframe/videoPlay.html
     * @param e 
     */
    window.onmessage = function (e) {
      saveProgressByStudent(e.data).then((res) => {
        if (res.success) {
          //保存进度成功，验证是否需要更新树形菜单状态
          console.log(123, that.props)
          that.props.updateStudyState(res.obj.catalogueId)
        }
      })
    }

    // 关闭前调用进度保存方法
    window.onunload = async function (e) {
      e.preventDefault();
    }
  }
  /**
   * @function 更新props的生命周期函数
   * @description 如果目录切换了，重新请求文章内容
   * @param nextProps 改变的props
   */
  async UNSAFE_componentWillReceiveProps(nextProps: any) {
    // 点击目录,滚动条回到顶部
    window.scrollTo(0, 0)
    if (this.props.chapterId !== nextProps.chapterId) {
      this.setState({ oldChapterId: this.props.chapterId });
      await this.setState({ chapterId: nextProps.chapterId });
      this.getData()
    }
  }

  /**
   * @function 获取文章内容
  */
  getData() {
    // 重新刷新组件
    this.setState({
      visible: false
    })
    findRichTXTByStudent(this.state.courseId, this.state.chapterId).then((res) => {
      if (res.success) {
        // 因为对象结构修改了，防止旧数据报错。修正需要重命名目录，并重新进入。
        if (res.obj == null) {
          res.obj = {
            contents: '', // 编辑器内容
            attachments: [] // 资源数组
          }
        } else {
          res.obj.attachments && res.obj.attachments.map((item: any, index: any) => {
            // 将duration观看时长插入到iframe字符串中的src所带的参数中，便于iframe使用
            if (res.obj.contents.includes(`&id=${item.id}`))
              res.obj.contents = res.obj.contents.replace(`&id=${item.id}`, `&duration=${item.duration}&id=${item.id}`)
            if (res.obj.contents.includes(`duration=undefined`)) {
              res.obj.contents = res.obj.contents.replace(`duration=undefined`, ``)
            }
          })
          this.setState({
            content: res.obj.contents
          })
        }
        this.setState({
          visible: true
        })
      }
    })
  }
  render() {
    return (
      <React.Fragment>
        {this.state.visible && (
          <div className='chapter-content-right'>
            <div className='view-content'>
              <div dangerouslySetInnerHTML={{ __html: this.state.content }}></div>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }

}
export default viewContent;

