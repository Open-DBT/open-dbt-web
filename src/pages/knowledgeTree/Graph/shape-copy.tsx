import ReactDom from 'react-dom'
import { Menu, Dropdown } from 'antd'
import { Graph, ToolsView, EdgeView, Dom } from '@antv/x6'

Graph.registerNode(
  'mind-map-rect',
  {
    inherit: 'rect',
    width: 130,
    height: 36,
    attrs: {
      body: {
        rx: 10, // 圆角矩形
        ry: 10,
        strokeWidth: 1, //边框宽度
        // stroke: '#5755a1',//边框颜色
        fill: 'white',//背景紫色
        // refWidth: '100%',
        // refHeight: '100%',        
      },
      text: {
        fontSize: 14,
        textAnchor: 'left', // 左对齐
        refX: 10, // x 轴偏移量        
        textWrap: {
          id: 0,
          text: '',
          keyword: ''
        },
      },
      'edit-text': {
        contenteditable: 'false',
        class: 'x6-edit-text',
        style: {
          width: '100%',
          textAlign: 'center',
          fontSize: 12,
          color: 'rgba(0,0,0,0.85)',
        },
      },
      fo: {
        refWidth: '100%',
        refHeight: '100%',
      },
      foBody: {
        xmlns: Dom.ns.xhtml,
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
    markup: [//markup 指定了渲染节点生成的html代码
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'foreignObject',
        selector: 'fo',
        children: [
          {
            ns: Dom.ns.xhtml,
            tagName: 'body',
            selector: 'foBody',
            children: [
              {
                tagName: 'div',
                selector: 'edit-text',
              },
            ],
          },
        ],
      },
      {
        tagName: 'text',
        selector: 'text',
      }
    ],
  },
  true,
)


Graph.registerEdge(
  'org-edge',
  {
    zIndex: -1,
    attrs: {
      line: {
        fill: 'none',
        strokeLinejoin: 'round',
        strokeWidth: '2',
        stroke: '#4b4a67',
        sourceMarker: null,
        targetMarker: null,
      },
    },
  },
  true,
)
class ContextMenuTool extends ToolsView.ToolItem<
  EdgeView,
  ContextMenuToolOptions
> {
  private knob: HTMLDivElement

  render() {
    super.render()
    this.knob = ToolsView.createElement('div', false) as HTMLDivElement
    this.knob.style.position = 'absolute'
    this.container.appendChild(this.knob)
    this.updatePosition(this.options)
    setTimeout(() => {
      this.toggleTooltip(true)
    })
    return this
  }

  private toggleTooltip(visible: boolean) {
    ReactDom.unmountComponentAtNode(this.knob)
    document.removeEventListener('mousedown', this.onMouseDown)

    if (visible) {
      ReactDom.render(
        <Dropdown
          open={true}
          trigger={['contextMenu']}
          overlay={this.options.menu}
        >
          <a />
        </Dropdown>,
        this.knob,
      )
      document.addEventListener('mousedown', this.onMouseDown)
    }
  }

  private updatePosition(pos?: { x: number; y: number }) {
    const style = this.knob.style
    if (pos) {
      style.left = `${pos.x}px`
      style.top = `${pos.y}px`
    } else {
      style.left = '-1000px'
      style.top = '-1000px'
    }
  }

  private onMouseDown = (e: MouseEvent) => {
    setTimeout(() => {
      this.updatePosition()
      this.toggleTooltip(false)
      if (this.options.onHide) {
        this.options.onHide.call(this)
      }
    }, 200)
  }
}

ContextMenuTool.config({
  tagName: 'div',
  isSVGElement: false,
})

export interface ContextMenuToolOptions extends ToolsView.ToolItem.Options {
  x: number
  y: number
  menu?: Menu | (() => Menu)
  onHide?: (this: ContextMenuTool) => void
}

Graph.registerEdgeTool('contextmenu', ContextMenuTool, true)
Graph.registerNodeTool('contextmenu', ContextMenuTool, true)



