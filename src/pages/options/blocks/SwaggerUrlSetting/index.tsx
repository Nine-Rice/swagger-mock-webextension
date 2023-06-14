import { SwaggerUrlItem } from "@src/storage/types";
import { Button, Space, Table, Tooltip, message } from "antd";
import SwaggerUrlFormModal from "./SwaggerUrlFormModal";
import OptionsLayout from "../../layout";
import Container from "../../layout/Container";
import { EditFilled, ReloadOutlined } from "@ant-design/icons";
import DeleteAction from "../../components/TableActions/Delete";
import axios from "axios";

const SwaggerUrlSetting = () => {
  const { data, isLoading, deleteAsync, updateAsync } = useArrayStorageMutation(
    storage.swaggerUrlList
  );
  const [loading, setLoading] = React.useState(false);

  return (
    <OptionsLayout title="Swagger文档">
      <Container title="Swagger地址">
        <Button
          onClick={() => {
            SwaggerUrlFormModal.show();
          }}
          loading={isLoading}
          type="primary"
          className="mb-16px"
        >
          添加
        </Button>
        <Table<SwaggerUrlItem>
          dataSource={data}
          loading={loading || isLoading}
          columns={[
            {
              title: "标签",
              dataIndex: "label",
            },
            {
              title: "地址",
              dataIndex: "url",
            },
            {
              title: "操作",
              key: "action",
              render(_, record) {
                const { id, url } = record || {};
                return (
                  <Space>
                    <Tooltip title="重新获取swagger文档">
                      <ReloadOutlined
                        className="cursor-pointer"
                        onClick={async () => {
                          setLoading(true);
                          try {
                            const response = await axios.get(url);
                            const apiDocument = response?.data;
                            if (apiDocument) {
                              updateAsync({
                                id,
                                apiDocument,
                              });
                              message.success("更新成功");
                            } else {
                              message.error(`swagger文档为空`);
                            }
                          } catch {
                            message.error("获取swagger失败");
                          } finally {
                            setLoading(false);
                          }
                        }}
                      />
                    </Tooltip>

                    <EditFilled
                      className="cursor-pointer c-blue"
                      onClick={async () => {
                        SwaggerUrlFormModal.show({
                          id,
                        });
                      }}
                    />
                    <DeleteAction
                      onConfirm={() => {
                        deleteAsync(id);
                      }}
                    />
                  </Space>
                );
              },
            },
          ]}
          bordered
        ></Table>
      </Container>
    </OptionsLayout>
  );
};

export default SwaggerUrlSetting;
