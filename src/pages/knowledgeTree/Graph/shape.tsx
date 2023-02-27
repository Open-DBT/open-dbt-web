import ReactDom from 'react-dom'
import { Menu, Dropdown } from 'antd'
import { Graph, ToolsView, EdgeView, Node, Point } from '@antv/x6'

// 定义节点
export default class TreeNode extends Node {
  private collapsed: boolean = false
  protected postprocess() {
    this.toggleCollapse(false)
  }
  isCollapsed() {
    return this.collapsed
  }
  toggleButtonVisibility(visible: boolean) {
    this.attr('buttonGroup', {
      display: visible ? 'block' : 'none',
    })
  }
  toggleCollapse(collapsed?: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (!target) {
      this.attr('buttonSign', {
        d: 'M 2 5 8 5',
        strokeWidth: 1.8,
      })
    } else {
      this.attr('buttonSign', {
        d: 'M 1 5 9 5 M 5 1 5 9',
        strokeWidth: 1.6,
      })
    }
    this.collapsed = target
  }
}

TreeNode.config({
  inherit: 'rect',
  width: 100,
  height: 34,
  attrs: {
    body: {
      refWidth: "100%",
      refHeight: "100%",
      strokeWidth: 1,
      fill: "#ffffff",
      stroke: "#a0a0a0"
    },
    single: {
      textWrap: {
        ellipsis: true,
        width: -10
      },
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      refX: "50%",
      refY: "50%",
      fontSize: 12
    },
    name: {
      textWrap: {
        ellipsis: true,
        width: -10
      },
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      refX: "50%",
      refY: 0.3,
      fontSize: 12
    },
    stat: {
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      refX: "50%",
      refY: 0.7,
      fontSize: 12
    },
    buttonGroup: {
      refX: "100%",
      refY: "50%"
    },
    button: {//#00CE9B
      fill: "#00CE9B",
      stroke: "none",
      x: -10,
      y: -10,
      height: 20,
      width: 30,
      rx: 10,
      ry: 10,
      cursor: "pointer",
      event: "node:collapse"
    },
    buttonSign: {
      refX: 5,
      refY: -5,
      stroke: "#FFFFFF",
      strokeWidth: 1.6
    }
  },
  markup: [
    {
      tagName: "g",
      selector: "buttonGroup",
      children: [
        {
          tagName: "rect",
          selector: "button",
          attrs: {
            "pointer-events": "visiblePainted"
          }
        },
        {
          tagName: "path",
          selector: "buttonSign",
          attrs: {
            fill: "none",
            "pointer-events": "none"
          }
        }
      ]
    },
    {
      tagName: "rect",
      selector: "body"
    },
    {
      tagName: "text",
      selector: "single"
    },
    {
      tagName: "text",
      selector: "name"
    },
    {
      tagName: "text",
      selector: "stat"
    }
  ],
})
Node.registry.register('mind-map-rect', TreeNode, true)

//节点连线
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



/**
 * 双击重命名class
 */
class EditableCellTool extends ToolsView.ToolItem<
  EdgeView,
  EditableCellToolOptions
> {
  private editorContent: HTMLDivElement

  render() {
    super.render()
    const cell = this.cell
    let x = 0
    let y = 0
    let width = 0
    let height = 0

    if (cell.isNode()) {
      const position = cell.position()
      const size = cell.size()
      const pos = this.graph.localToGraph(position)
      const zoom = this.graph.zoom()
      x = pos.x
      y = pos.y
      width = size.width * zoom
      height = size.height * zoom
    } else {
      x = this.options.x - 40
      y = this.options.y - 20
      width = 80
      height = 40
    }

    //编辑器外层div
    const editorParent = ToolsView.createElement('div', false) as HTMLDivElement
    editorParent.style.position = 'absolute'
    editorParent.style.left = `${x}px`
    editorParent.style.top = `${y}px`
    editorParent.style.width = `${width}px`
    editorParent.style.height = `${height}px`
    editorParent.style.display = 'flex'
    editorParent.style.alignItems = 'center'
    editorParent.style.textAlign = 'center'
    //编辑器里层
    this.editorContent = ToolsView.createElement('div', false) as HTMLDivElement
    this.editorContent.contentEditable = 'true'
    this.editorContent.style.width = '100%'
    this.editorContent.style.outline = 'none'
    this.editorContent.style.backgroundColor = cell.isEdge() ? '#fff' : ''
    this.editorContent.style.border = cell.isEdge() ? '1px solid #ccc' : 'none'
    editorParent.appendChild(this.editorContent)
    this.container.appendChild(editorParent)
    this.init()
    return this
  }

  init = () => {
    const cell = this.cell
    if (cell.isNode()) {
      const value = cell.attr('name/textWrap/text') as string
      console.log('init value ', value)
      this.editorContent.innerText = value
      cell.attr('name/style/display', 'none')
      cell.attr('stat/style/display', 'none')
    }
    setTimeout(() => {
      this.editorContent.focus()
    })
    document.addEventListener('mousedown', this.onMouseDown)
  }

  onMouseDown = (e: MouseEvent) => {
    if (e.target !== this.editorContent) {
      const cell = this.cell
      const value = this.editorContent.innerText
      cell.removeTools()
      if (cell.isNode()) {
        cell.attr('name/textWrap/text', value)
        cell.attr('name/style/display', '')
        cell.attr('stat/style/display', '')
      }
      document.removeEventListener('mousedown', this.onMouseDown)
      console.log('end.....')
      setTimeout(() => {
        if (this.options.onHide) {
          this.options.onHide.call(this)
        }
      }, 200)
    }
  }
}

EditableCellTool.config({
  tagName: 'div',
  isSVGElement: false,
})
export interface EditableCellToolOptions extends ToolsView.ToolItem.Options {
  x: number
  y: number
  onHide?: (this: ContextMenuTool) => void

}
Graph.registerNodeTool('editableCell', EditableCellTool, true)


