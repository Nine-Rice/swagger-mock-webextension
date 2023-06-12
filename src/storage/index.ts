import {
  DATA_TYPE_LIST,
  DataTypeValue,
} from "@src/pages/options/hooks/useDataTypeList";
import createStorageLocal from "./helper";
import { MockItem, ConversionRuleItem, SwaggerUrlItem } from "./types";

export const storageDataMap: {
  swaggerUrlList: SwaggerUrlItem[];
  mockList: MockItem[];
  dataTypeValue: DataTypeValue;
  conversionRule: ConversionRuleItem[];
} = {
  // swagger文档地址列表
  swaggerUrlList: [],
  // 选中的接口mock列表
  mockList: [],
  // 数据类型配置默认值
  dataTypeValue: _.mapValues(
    DATA_TYPE_LIST,
    (o) => o.defaultValue
  ) as DataTypeValue,
  // 转化规则
  conversionRule: [],
};

export default createStorageLocal(storageDataMap);
