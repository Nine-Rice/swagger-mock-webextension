import { Space, Switch, Table, Typography } from "antd";
import { MockItem } from "@src/storage/types";
import ApiPaper from "@src/pages/options/components/ApiPaper";
import ApiSelector from "./ApiSelector";
import { generateMockTree } from "@src/pages/options/utils";
import { ReloadOutlined } from "@ant-design/icons";
import MockTree from "./MockTree";
import DeleteAction from "../../components/TableActions/Delete";
import mockTreeMap from "../../utils/mockTreeMap";

const MockTable: React.FC<{
  scene?: "popup";
}> = (props) => {
  const initDone = React.useRef(false);
  const { scene } = props || {};
  const isPopup = scene === "popup";
  const { data, deleteAsync, isLoading, updateAsync } = useArrayStorageMutation(
    storage.mockList
  );

  const asyncMockList = React.useCallback(async () => {
    const tabs = await browser.tabs.query({
      status: "complete",
    });
    tabs.forEach((tab) => {
      browser.tabs.sendMessage(tab.id, {
        source: "swagger-mock-list",
        data,
      });
    });
  }, [data]);

  React.useEffect(() => {
    if (!isLoading) {
      if (!initDone.current) {
        initDone.current = true;
      } else {
        asyncMockList();
      }
    }
  }, [asyncMockList, data, isLoading]);

  return (
    <Table<MockItem>
      bordered
      size={isPopup ? "small" : "middle"}
      loading={isLoading}
      expandable={
        isPopup
          ? undefined
          : {
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
            }
      }
      rowKey="id"
      columns={[
        ...(isPopup
          ? []
          : [
              {
                title: "网址通配符",
                dataIndex: "hostMatching",
                render(hostMatching, record) {
                  const { id } = record || {};
                  return (
                    <Typography.Paragraph
                      editable={{
                        onChange: async (str) => {
                          await updateAsync({
                            id,
                            hostMatching: str,
                          });
                        },
                      }}
                    >
                      {hostMatching}
                    </Typography.Paragraph>
                  );
                },
              },
            ]),
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
            const { id, schema } = record || {};
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
                <DeleteAction onConfirm={() => deleteAsync(id)}></DeleteAction>
              </Space>
            );
          },
        },
      ]}
      dataSource={data}
      pagination={false}
      footer={() => <ApiSelector scene={scene}></ApiSelector>}
    ></Table>
  );
};

export default MockTable;
