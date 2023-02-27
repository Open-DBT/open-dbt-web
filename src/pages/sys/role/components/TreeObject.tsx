import { Tree, Modal } from 'antd';
import React from 'react';
import { getResourceTree } from '@/services/system/role';

interface isState {
  resourceTree: any;
};

class TreeObject extends React.Component<any, isState> {
  constructor(props: any) {
    super(props);
    this.state = {
      resourceTree: []
    }
  };

  async componentDidMount() {
    const resourceTree = await getResourceTree();
    this.setState({ resourceTree: resourceTree })
  };

  onSelect = (selectedKeys: any, info: any) => {
    this.props.setTreeValues({ ...this.props.values, resourceIds: selectedKeys })
  };

  onCheck = (checkedKeys: any, info: any) => {
    this.props.setTreeValues({ ...this.props.values, resourceIds: checkedKeys })
  };

  render() {
    const {
      onOk: onOk,
      onCancel: handleTreeModalVisible,
      treeModalVisible,
      values
    } = this.props;

    return (
      <Modal
        width={640}
        maskClosable={false}
        destroyOnClose
        title="角色权限设置"
        open={treeModalVisible}
        onCancel={() => handleTreeModalVisible(false)}
        okText="确定"
        onOk={onOk}
      >
        <Tree
          checkable
          checkedKeys={values.resourceIds}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          treeData={this.state.resourceTree}
        />
      </Modal>
    );
  }
}

export default TreeObject;