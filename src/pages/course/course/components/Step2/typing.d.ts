export namespace Knowledge {
  /**
   * 知识点右侧属性页，目前只修改key和text
   */
  export type NodeAttrs = {
    keyword: string;//关键字
    text: string;//知识点
  }

  /**
   * 节点属性页更新事件
   */
  export type EventChange<T, K, U> = (
    e: T,
    attrType: K,
    attrKey: keyof U,
  ) => void;
}