import { MockTreeItem } from "@src/pages/options/utils";
import { Col, Row, Space, Tag, Tree } from "antd";
import MockDataForm from "../../components/MockDataForm";
import { DataStruct } from "../../hooks/useDataTypeList";

const MockTree: React.FC<{
  dataSource: MockTreeItem[];
  onSubmit?: (props: { mockTreeItemId: string } & DataStruct) => void;
}> = (props) => {
  const { dataSource, onSubmit } = props || {};
  const [mockTreeItem, setMockTreeItem] = React.useState<MockTreeItem>();

  return (
    <Row>
      <Col>
        <Tree
          className="bg-#fafafa"
          showLine
          onSelect={(keys, info) => {
            const node = info?.node;
            const disabled =
              node.dataType === "object" ||
              (node.dataType === "array" && node.children?.length);
            if (!disabled) {
              setMockTreeItem(node);
            }
          }}
          onExpand={(_, { expanded }) => {
            if (!expanded) {
              setMockTreeItem(undefined);
            }
          }}
          selectedKeys={[mockTreeItem?.id]}
          fieldNames={{
            title: "key",
            key: "id",
          }}
          treeData={dataSource}
          titleRender={(node) => (
            <Space>
              <span>{node.key}</span>
              <Tag>{node.showDataType || node.dataType}</Tag>
            </Space>
          )}
          defaultExpandAll
        ></Tree>
      </Col>
      <Col offset={1}>
        {mockTreeItem && (
          <MockDataForm
            initialValues={
              {
                dataType: mockTreeItem.dataType,
                dataValue: mockTreeItem.dataValue,
              } as DataStruct
            }
            key={mockTreeItem.id}
            onSubmit={async (vals) => {
              await onSubmit?.({
                ...vals,
                mockTreeItemId: mockTreeItem.id,
              });
            }}
          ></MockDataForm>
        )}
      </Col>
    </Row>
  );
};

export default MockTree;
