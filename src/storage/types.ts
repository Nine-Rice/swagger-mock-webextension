import { MethodType } from "@src/pages/options/components/ApiPaper";
import { DataStruct } from "@src/pages/options/hooks/useDataTypeList";
import { MockTreeItem } from "@src/pages/options/utils";
import { OpenAPIV3 } from "openapi-types";

// swagger地址数据
export interface SwaggerUrlItem {
  id: string;
  label: string;
  url: string;
  apiDocument: OpenAPIV3.Document;
}

// 选中的接口mock列表
export interface MockItem {
  swaggerUrlId: string;
  swaggerUrlLabel: string;
  id: string;
  url: string;
  method: MethodType;
  isDisabled: boolean;
  schema: OpenAPIV3.SchemaObject;
  hostMatching: string;
  desc: string;
  mockTree: MockTreeItem[];
}

type ConversionRuleBase = {
  id: string;
} & DataStruct;

// 正则表达式
type RegularRule = {
  type: "regular";
  condition: string;
} & ConversionRuleBase;

// swagger基础数据类型
export type SwaggerDataType =
  | "string"
  | "constant"
  | "date-time"
  | "enum"
  | "number"
  | "boolean"
  | "integer";

type SwaggerDataTypeRule = {
  type: "swaggerDataType";
  condition: SwaggerDataType;
} & ConversionRuleBase;

export type ConversionRuleItem = RegularRule | SwaggerDataTypeRule;
