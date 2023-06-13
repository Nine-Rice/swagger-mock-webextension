import { DataStruct } from "@src/pages/options/hooks/useDataTypeList";
import { OpenAPIV3 } from "openapi-types";
import { getUniqueId } from ".";

export type MockTreeItem = {
  id: string;
  key: string;
  showDataType?: string;
  children?: MockTreeItem[];
} & DataStruct;

// 根据转化规则生成mock数据
const generateMockDataByRule = async (props: {
  key: string;
  swaggerDataType: ReturnType<typeof judgeSwaggerDataType>;
}) => {
  const { key, swaggerDataType } = props || {};
  let matchingRule;
  const conversionRule = await storage.conversionRule.get();
  for (const rule of conversionRule) {
    const { type, condition, dataType, dataValue } = rule || {};
    switch (type) {
      // 正则表达式
      case "regular":
        if (new RegExp(condition).test(key)) {
          matchingRule = {
            dataType,
            dataValue,
          };
        }
        break;

      // swagger数据类型
      case "swaggerDataType":
        if (swaggerDataType === condition) {
          matchingRule = {
            dataType,
            dataValue,
          };
        }
        break;
    }
    if (matchingRule) {
      break;
    }
  }
  return matchingRule;
};

// 对象类型数据转化
const transformObjectData = async (
  objectProps: OpenAPIV3.NonArraySchemaObject["properties"] = {}
) => {
  return (
    await Promise.all(
      Object.keys(objectProps).map((key) =>
        generateMockTree(objectProps[key] as OpenAPIV3.SchemaObject, key)
      )
    )
  ).flat();
};

// 判断swagger的数据类型
const judgeSwaggerDataType = (schema: OpenAPIV3.SchemaObject) => {
  const { type, example, format, enum: _enum } = schema || {};
  if (type === "string") {
    if (example) {
      return "constant";
    } else if (format === "date-time") {
      return "date-time";
    } else if (_enum) {
      return "enum";
    }
  }
  return type;
};

/**
 * 根据数据类型和转化规则将数据转化为对应的Mock
 * @param content OpenAPIV3.SchemaObject
 * @returns Promise<MockTreeItem[]>
 */
const generateMockTree = async (
  schema: OpenAPIV3.SchemaObject,
  key = "response"
) => {
  const { example, enum: _enum, properties } = schema || {};
  const swaggerDataType = judgeSwaggerDataType(schema);
  const result: MockTreeItem[] = [];
  const commonItem = {
    id: getUniqueId(),
    key,
  };
  const storageDataTypeValue = await storage.dataTypeValue.get();
  // 转化规则
  const matchingRule = await generateMockDataByRule({
    key,
    swaggerDataType,
  });
  if (matchingRule) {
    result.push({
      ...commonItem,
      ...matchingRule,
    });
    return result;
  }

  switch (swaggerDataType) {
    // 常量
    case "constant":
      result.push({
        ...commonItem,
        dataType: "constant",
        dataValue: {
          value: example,
        },
      });
      break;

    // 日期
    case "date-time":
      result.push({
        ...commonItem,
        dataType: "dateTime",
        dataValue: storageDataTypeValue.dateTime,
      });
      break;

    // 枚举
    case "enum":
      result.push({
        ...commonItem,
        dataType: "enum",
        dataValue: {
          value: _enum,
        },
      });
      break;

    // 字符串
    case "string":
      result.push({
        ...commonItem,
        dataType: "string",
        dataValue: storageDataTypeValue.string,
      });
      break;

    // 数字
    case "number":
      result.push({
        ...commonItem,
        dataType: "number",
        dataValue: storageDataTypeValue.number,
      });
      break;

    // 布尔值
    case "boolean":
      result.push({
        ...commonItem,
        dataType: "boolean",
        dataValue: storageDataTypeValue.boolean,
      });
      break;

    // 整数
    case "integer":
      result.push({
        ...commonItem,
        dataType: "number",
        dataValue: {
          ...storageDataTypeValue.number,
          precision: 0,
        },
        showDataType: "integer",
      });
      break;

    // 对象
    case "object":
      result.push({
        ...commonItem,
        dataType: "object",
        dataValue: {},
        children: await transformObjectData(properties),
      });
      break;

    // 数组（TODO：暂不考虑二维甚至是多维数组的情况）
    case "array": {
      const items = (schema as OpenAPIV3.ArraySchemaObject)
        .items as OpenAPIV3.SchemaObject;
      const dataValue = storageDataTypeValue.array;
      const mockItem: MockTreeItem = {
        ...commonItem,
        dataType: "array",
        dataValue,
      };
      if (items.type === "object") {
        mockItem.children = await transformObjectData(items.properties);
        mockItem.showDataType = "Array<object>";
      } else {
        mockItem.dataValue.item = (await generateMockTree(items, key))[0];
        mockItem.showDataType = `Array<${dataValue.item.dataType}>`;
      }
      result.push(mockItem);
      break;
    }
  }
  return result;
};

export default generateMockTree;
