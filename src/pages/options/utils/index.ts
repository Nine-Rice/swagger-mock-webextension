import dayjs, { Dayjs } from "dayjs";
import { DataTypeValue } from "../hooks/useDataTypeList";

export { default as transformSchemaRef } from "./transformSchemaRef";
export { default as generateMockTree } from "./generateMockTree";
export type { MockTreeItem } from "./generateMockTree";

type NumberDateType = "number" | "dayJs";

// 生成唯一id
export const getUniqueId = (prefix = "") => {
  return _.uniqueId(
    `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}_`
  );
};

// dayjs和时间戳之间的转化
export const transformDateTimeValue = <T extends NumberDateType>(
  value: Array<number | Dayjs>,
  type: T
) => {
  const result = {
    number: value,
    dayJs: value,
  };
  if (typeof value?.[0] === "number") {
    result.dayJs = value?.map((item) => dayjs(item));
  } else {
    result.number = value?.map((item) => item.valueOf());
  }
  return result[type];
};

// DataValue数据转化
export const transformDataTypeValue = <T extends NumberDateType>(
  dataTypeValue: DataTypeValue,
  type: T
) => {
  // 日期数据处理
  if (dataTypeValue.dateTime) {
    dataTypeValue.dateTime.value = transformDateTimeValue(
      dataTypeValue.dateTime.value,
      type
    ) as any;
  }
  return dataTypeValue;
};
