import { Space, Switch, Table } from "antd";
import { MockItem } from "@src/storage/types";
import ApiPaper from "@src/pages/options/components/ApiPaper";
import ApiSelector from "./ApiSelector";
import { MockTreeItem, generateMockTree } from "@src/pages/options/utils";
import { EditFilled, ReloadOutlined } from "@ant-design/icons";
import MockTree from "./MockTree";
import DeleteAction from "../../components/TableActions/Delete";
import mockTreeMap from "../../utils/mockTreeMap";

const MockTable: React.FC<{
  onEdit?: (mockTree: MockTreeItem[]) => void;
}> = (props) => {
  const { onEdit } = props || {};
  const { data, deleteAsync, isLoading, updateAsync } = useArrayStorageMutation(
    storage.mockList
  );

  return (
    <Table<MockItem>
      bordered
      loading={isLoading}
      expandable={{
        expandedRowRender: (record) => {
          const { id, mockTree } = record || {};
          return (
            <MockTree
              dataSource={record.mockTree}
              onSubmit={async (vals) => {
                await updateAsync({
                  id,
                  mockTree: mockTreeMap(mockTree, (item) => {
                    if (vals.mockTreeItemId === item.id) {
                      return {
                        ...item,
                        ...vals,
                      };
                    }
                    return item;
                  }),
                });
              }}
            ></MockTree>
          );
        },
      }}
      rowKey="id"
      columns={[
        {
          title: "网址通配符",
          dataIndex: "hostMatching",
        },
        {
          title: "接口",
          dataIndex: "url",
          render(url, record) {
            const { method, desc } = record || {};
            return (
              <ApiPaper title={url} method={method} desc={desc}></ApiPaper>
            );
          },
        },
        {
          title: "状态",
          dataIndex: "isDisabled",
          render(isDisabled, record) {
            return (
              <Switch
                checked={!isDisabled}
                loading={isLoading}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={() => {
                  updateAsync({
                    id: record.id,
                    isDisabled: !isDisabled,
                  });
                }}
              ></Switch>
            );
          },
        },
        {
          title: "swagger",
          dataIndex: "swaggerUrlLabel",
        },
        {
          title: "操作",
          dataIndex: "action",
          render(_, record) {
            const { id, mockTree, schema } = record || {};
            return (
              <Space>
                <ReloadOutlined
                  className="cursor-pointer c-grey"
                  onClick={async () => {
                    updateAsync({
                      id,
                      mockTree: await generateMockTree(schema),
                    });
                  }}
                />
                <EditFilled
                  className="cursor-pointer c-blue"
                  onClick={async () => {
                    onEdit?.(mockTree);
                  }}
                />
                <DeleteAction onConfirm={() => deleteAsync(id)}></DeleteAction>
              </Space>
            );
          },
        },
      ]}
      dataSource={data}
      pagination={false}
      footer={() => <ApiSelector></ApiSelector>}
    ></Table>
  );
};

export default MockTable;
