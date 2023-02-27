import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Tooltip } from 'antd';
// import type { ProColumns } from '@ant-design/pro-table';
import * as APP from '@/app';

const areEqual = (prevProps, nextProps) => {
  //return false 刷新页面
  // console.log( prevProps, nextProps)
  if (prevProps.resultSetModalVisible === nextProps.resultSetModalVisible
  ) {
    return true
  } else {
    return false
  }
}

interface TableColumns {
  title: React.ReactNode | string;
  dataIndex: number;
  key: number;
  align: string;
  width?: number;
};

interface UserFormProps {
  onCancel: (flag?: boolean, formVals?: any) => void;
  resultSetModalVisible: boolean;
  columnList: string[];
  datatype: any;
  resultSet: any;
};

const ResultSetModal: React.FC<UserFormProps> = (props) => {
  const {
    onCancel: setResultSetModalVisible,
    resultSetModalVisible,
    columnList,
    datatype,
    resultSet,
  } = props;

  const [columns, setColumns] = useState<TableColumns[]>([]);//table columns
  const [dataSource, setDataSource] = useState([]);//table dataSource

  useEffect(() => {
    setTableContent();
  }, [props]);

  const setTableContent = () => {
    if (columnList.length > 0) {
      console.log('setTableContent columnList = ', columnList);
      console.log('setTableContent datatype = ', datatype);

      let tableColumns: TableColumns[] = [];
      columnList.map((item: string, index: number) => {
        const title = (
          <Tooltip title={datatype[index].dataType}>
            {
              datatype[index].imgUrl ? <span><img src={`${APP.request.prefix}${datatype[index].imgUrl}`} />&nbsp;</span> : null
            }
            {item}
          </Tooltip>
        );
        
        tableColumns.push({
          title: title,
          dataIndex: index,
          key: index,
          align: 'center',
          width: 100
        });
      });
      setColumns(tableColumns);
      setDataSource(resultSet);
    }

  };

  return (
    <Modal
      className="exercise-result"
      width={1000}
      title="结果集"
      open={resultSetModalVisible}
      onCancel={() => { setResultSetModalVisible(false) }}
      footer={[<Button key='closeButton' onClick={() => { setResultSetModalVisible(false) }}>关闭</Button>]}
    >
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey={(record: any) => record[0]}
        scroll={{ x: 850, y: 350 }}
      />
    </Modal>
  );
}

// export default ResultSetModal;
export default React.memo(ResultSetModal, areEqual)
