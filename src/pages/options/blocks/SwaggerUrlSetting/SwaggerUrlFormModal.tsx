import { antdModalV5, useModal } from "@ebay/nice-modal-react";
import { SwaggerUrlItem } from "@src/storage/types";
import { Form, Input, Modal } from "antd";
import createModal from "../../hoc/createModal";
import axios, { AxiosResponse } from "axios";
import { OpenAPIV3 } from "openapi-types";

const SwaggerUrlFormModal = createModal<{ id: string }, SwaggerUrlItem>(
  (props) => {
    const { id } = props || {};
    const [form] = Form.useForm();
    const modal = useModal();
    const { getItem, addAsync, updateAsync } = useArrayStorageMutation(
      storage.swaggerUrlList
    );
    const [isLoading, setLoading] = React.useState(false);

    return (
      <Modal
        {...antdModalV5(modal)}
        maskClosable={false}
        title={`${id ? "编辑" : "添加"}Swagger地址配置`}
        onOk={() => {
          form.submit();
        }}
        confirmLoading={isLoading}
      >
        <Form<SwaggerUrlItem>
          className="pt-16px"
          form={form}
          initialValues={getItem(id)}
          onFinish={async (vals) => {
            setLoading(true);
            const { label, url } = vals || {};
            try {
              const reponse = await axios<
                null,
                AxiosResponse<OpenAPIV3.Document>
              >(url, {
                timeout: 10000,
              });
              if (id) {
                await updateAsync({
                  label,
                  url,
                  apiDocument: reponse.data,
                  id,
                });
              } else {
                await addAsync({
                  label,
                  url,
                  apiDocument: reponse.data,
                });
              }
              modal.resolve();
              modal.hide();
            } catch (error) {
              if (error?.name === "AxiosError") {
                form.setFields([
                  {
                    name: "url",
                    errors: ["无效地址，请检查后重试"],
                  },
                ]);
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          <Form.Item
            label="标签"
            name="label"
            rules={[
              {
                required: true,
                message: "名称必填",
              },
            ]}
          >
            <Input placeholder="示例：web-wallet、dev-admin"></Input>
          </Form.Item>
          <Form.Item
            label="地址"
            name="url"
            rules={[
              {
                required: true,
                message: "地址必填",
              },
            ]}
          >
            <Input placeholder="需要返回json文件，示例：https://xxx/v1/wallet/v3/api-docs"></Input>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default SwaggerUrlFormModal;
