
import MindMap from '@/pages/knowledgeTree/Graph/MindMap'
import { getZoom } from '@/utils/utils';

export default class CanvasContent extends MindMap {

  componentDidMount() {
    super.componentDidMount();
    this.graph.zoom(getZoom(this.graph.getNodes()));
    this.graph.centerContent()
  }
}
