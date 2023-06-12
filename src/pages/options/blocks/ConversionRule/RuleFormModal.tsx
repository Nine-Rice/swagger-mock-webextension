import { Form, Input, Modal, Select } from "antd";
import createModal from "../../hoc/createModal";
import { antdModalV5, useModal } from "@ebay/nice-modal-react";
import { ConversionRuleItem, SwaggerDataType } from "@src/storage/types";

type RuleDataStruct = Pick<ConversionRuleItem, "type" | "condition">;

const ConversionRuleFormModal = createModal<{ id: string }, RuleDataStruct>(
  (props) => {
    const { id } = props || {};
    const modal = useModal();
    const [form] = Form.useForm();
    const { getItem, addAsync, updateAsync } = useArrayStorageMutation(
      storage.conversionRule
    );
    const { data } = useStorageMutation(storage.dataTypeValue);
    const type = Form.useWatch("type", form);
    const config = [
      {
        value: "regular",
        label: "正则表达式",
        formItemRender: <Input prefix="/" suffix="/"></Input>,
      },
      {
        value: "swaggerDataType",
        label: "swagger数据类型",
        formItemRender: (
          <Select<
            SwaggerDataType,
            {
              value: SwaggerDataType;
              label: SwaggerDataType;
            }
          >
            options={[
              {
                value: "string",
                label: "string",
              },
              {
                value: "number",
                label: "number",
              },
              {
                value: "boolean",
                label: "boolean",
              },
              {
                value: "integer",
                label: "integer",
              },
              {
                value: "constant",
                label: "constant",
              },
              {
                value: "date-time",
                label: "date-time",
              },
              {
                value: "enum",
                label: "enum",
              },
            ]}
          ></Select>
        ),
      },
    ];

    return (
      <Modal
        {...antdModalV5(modal)}
        title={`${id ? "编辑" : "添加"}转化规则`}
        onOk={() => form.submit()}
      >
        <Form<RuleDataStruct>
          initialValues={{
            type: "regular",
            ...getItem(id),
          }}
          form={form}
          onFinish={async (vals) => {
            if (id) {
              await updateAsync({
                id,
                ...vals,
              } as ConversionRuleItem);
            } else {
              await addAsync({
                ...vals,
                dataType: "string",
                dataValue: data.string,
              });
            }
            modal.resolve(vals);
            modal.hide();
          }}
        >
          <Form.Item label="规则类型" name="type">
            <Select options={config}></Select>
          </Form.Item>
          <Form.Item
            label={config.find((item) => item.value === type)?.label}
            name="condition"
            rules={[
              {
                required: true,
                message: "请输入正则表达式",
              },
            ]}
          >
            {config.find((item) => item.value === type)?.formItemRender}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default ConversionRuleFormModal;
