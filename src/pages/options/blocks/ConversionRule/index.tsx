import { ConversionRuleItem } from "@src/storage/types";
import { Button, Space, Table } from "antd";
import { EditFilled } from "@ant-design/icons";
import ConversionRuleFormModal from "./RuleFormModal";
import MockDataForm from "../../components/MockDataForm";
import DeleteAction from "../../components/TableActions/Delete";
import { DataStruct } from "../../hooks/useDataTypeList";

const ConversionRule = () => {
  const { data, deleteAsync, updateAsync } = useArrayStorageMutation(
    storage.conversionRule
  );

  return (
    <div>
      <Button
        onClick={() => {
          ConversionRuleFormModal.show();
        }}
      >
        添加
      </Button>
      <Table<ConversionRuleItem>
        bordered
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => {
            const { id, dataType, dataValue } = record || {};
            return (
              <MockDataForm
                initialValues={
                  {
                    dataType,
                    dataValue,
                  } as DataStruct
                }
                onSubmit={async (vals) => {
                  await updateAsync({
                    id,
                    dataType: vals.dataType,
                    dataValue: vals.dataValue,
                  } as ConversionRuleItem);
                }}
              ></MockDataForm>
            );
          },
        }}
        columns={[
          {
            title: "规则类型",
            dataIndex: "type",
            render(type) {
              return type === "regular" ? "正则表达式" : "Swagger数据类型";
            },
          },
          {
            title: "条件",
            dataIndex: "condition",
            render(condition) {
              return <span>{condition}</span>;
            },
          },
          {
            title: "操作",
            key: "action",
            render(_, record) {
              const { id } = record || {};
              return (
                <Space>
                  <EditFilled
                    className="cursor-pointer c-blue"
                    onClick={async () => {
                      ConversionRuleFormModal.show({
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
        dataSource={data}
      ></Table>
    </div>
  );
};

export default ConversionRule;
