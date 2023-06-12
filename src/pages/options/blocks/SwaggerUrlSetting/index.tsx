import { SwaggerUrlItem } from "@src/storage/types";
import { Button, Table } from "antd";
import SwaggerUrlFormModal from "./SwaggerUrlFormModal";

const SwaggerUrlSetting = () => {
  const { data, isLoading, deleteAsync } = useArrayStorageMutation(
    storage.swaggerUrlList
  );

  return (
    <div>
      <Button
        onClick={() => {
          SwaggerUrlFormModal.show();
        }}
        loading={isLoading}
      >
        添加
      </Button>
      <Table<SwaggerUrlItem>
        dataSource={data}
        loading={isLoading}
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
            render(_, { id }) {
              return [
                <Button
                  type="link"
                  key="edit"
                  onClick={() => {
                    SwaggerUrlFormModal.show({
                      id,
                    });
                  }}
                >
                  编辑
                </Button>,
                <Button
                  type="link"
                  key="delete"
                  danger
                  onClick={() => {
                    deleteAsync(id);
                  }}
                >
                  删除
                </Button>,
              ];
            },
          },
        ]}
        bordered
      ></Table>
    </div>
  );
};

export default SwaggerUrlSetting;
