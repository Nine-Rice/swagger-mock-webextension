import { Button, Select, SelectProps } from "antd";
import { generateMockTree, transformSchemaRef } from "@src/pages/options/utils";
import { MockItem } from "@src/storage/types";
import ApiPaper, { MethodType } from "@src/pages/options/components/ApiPaper";
import { OpenAPIV3 } from "openapi-types";
let delay = null;

type OptionItem = {
  operationObject: OpenAPIV3.OperationObject;
} & Omit<MockItem, "schema" | "mockTree">;

const ApiSelector = () => {
  const { data } = useArrayStorageMutation(storage.swaggerUrlList);
  const { addAsync } = useArrayStorageMutation(storage.mockList);
  const [searchWord, setSeachWord] = React.useState<string>("");

  const dataSource = React.useMemo(() => {
    const result: OptionItem[] = [];
    data?.forEach((item) => {
      const { id, label, apiDocument } = item || {};
      const paths = apiDocument?.paths;
      for (const key in paths) {
        for (const method in paths[key]) {
          const apiItem = paths[key][method] as OpenAPIV3.OperationObject;
          const data: OptionItem = {
            swaggerUrlId: id,
            swaggerUrlLabel: label,
            id: `${id}-${Date.now().valueOf()}-${method}:${key}`,
            method: method as MethodType,
            url: key,
            isDisabled: false,
            hostMatching: "*",
            desc: apiItem.summary,
            operationObject: apiItem,
          };
          result.push(data);
        }
      }
    });
    return result;
  }, [data]);

  const handleSearch: SelectProps["onSearch"] = (value) => {
    // 防抖
    delay && clearTimeout(delay);
    delay = setTimeout(() => {
      setSeachWord(value);
    }, 200);
  };

  return (
    <Select
      size="large"
      mode="multiple"
      className="w-600px"
      value={[]}
      filterOption={false}
      showSearch
      onDropdownVisibleChange={(open) => {
        if (!open) {
          setSeachWord("");
        }
      }}
      options={data?.map((item) => {
        const { id, label } = item || {};
        const childOptions = dataSource
          .filter((op) => op.swaggerUrlId === id && op.url.includes(searchWord))
          .map((op) => ({
            label: (
              <ApiPaper
                title={op.url}
                method={op.method}
                searchWords={[searchWord]}
                desc={op.desc}
                actions={[
                  <Button
                    type="primary"
                    key="add"
                    onClick={async () => {
                      const ref =
                        _.get(
                          op.operationObject,
                          "responses.200.content.*/*.schema.$ref"
                        ) || "";
                      const schema = transformSchemaRef(item.apiDocument, ref);
                      addAsync(
                        _.omit(
                          {
                            ...op,
                            schema,
                            mockTree: await generateMockTree(schema),
                          },
                          ["operationObject"]
                        )
                      );
                    }}
                  >
                    添加
                  </Button>,
                ]}
              ></ApiPaper>
            ),
            id: op.id,
          }));
        return {
          label,
          options: childOptions,
        };
      })}
      onSearch={handleSearch}
    ></Select>
  );
};

export default ApiSelector;
