import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import NumberRangeField, {
  NumberRangeValueType,
} from "../components/NumberRangeField";

export const DATA_TYPE_LIST = {
  string: {
    label: "字符串",
    formItemRender: (
      <Form.Item name="string">
        <NumberRangeField
          label={{
            min: "最小长度",
            max: "最大长度",
          }}
          hidePrecision
          hideStringMode
          hideRetainZero
        ></NumberRangeField>
      </Form.Item>
    ),
    defaultValue: {
      min: 5,
      max: 20,
    },
  },
  number: {
    label: "数字",
    formItemRender: (
      <Form.Item name="number">
        <NumberRangeField
          label={{
            min: "最小数值",
            max: "最大数值",
          }}
        ></NumberRangeField>
      </Form.Item>
    ),
    defaultValue: {
      min: 0,
      max: 10000000,
      precision: 2,
      isRetainZero: false,
      stringMode: false,
    } as NumberRangeValueType,
  },
  boolean: {
    label: "布尔值",
    formItemRender: (
      <Form.Item
        name={["boolean", "value"]}
        label="true的概率"
        tooltip="false的概率=100-true的概率"
      >
        <InputNumber<number>
          max={100}
          min={0}
          formatter={(value) => `${value}%`}
          parser={(value) => Number(value.replace("%", ""))}
        ></InputNumber>
      </Form.Item>
    ),
    defaultValue: {
      value: 50,
    },
  },
  enum: {
    label: "枚举",
    formItemRender: (
      <Form.Item label="枚举值" name={["enum", "value"]} className="w-300px">
        <Select
          mode="tags"
          open={false}
          placeholder="输入内容然后按回车键"
        ></Select>
      </Form.Item>
    ),
    defaultValue: {
      value: [] as string[],
    },
  },
  dateTime: {
    label: "日期",
    formItemRender: (
      <Form.Item label="日期范围" name={["dateTime", "value"]}>
        <DatePicker.RangePicker allowClear={false}></DatePicker.RangePicker>
      </Form.Item>
    ),
    defaultValue: {
      value: [dayjs().add(-10, "y").valueOf(), dayjs().valueOf()],
    },
  },
  image: {
    label: "图片",
    formItemRender: (
      <>
        <Form.Item label="宽" name={["image", "width"]}>
          <InputNumber min={0}></InputNumber>
        </Form.Item>
        <Form.Item label="高" name={["image", "height"]}>
          <InputNumber min={0}></InputNumber>
        </Form.Item>
      </>
    ),
    defaultValue: {
      width: 200,
      height: 200,
    },
  },
  constant: {
    label: "常量",
    formItemRender: (
      <Form.Item label="常量" name={["constant", "value"]}>
        <Input></Input>
      </Form.Item>
    ),
    defaultValue: {
      value: "",
    },
  },
  array: {
    label: "数组",
    formItemRender: (
      <Form.Item name="array">
        <NumberRangeField
          label={{
            min: "最小长度",
            max: "最大长度",
          }}
          hidePrecision
          hideStringMode
          hideRetainZero
        ></NumberRangeField>
      </Form.Item>
    ),
    defaultValue: {
      min: 10,
      max: 10,
    } as ArrayDataValue,
  },
  object: {
    label: "对象",
    formItemRender: null,
    defaultValue: {},
  },
};

export type DataType = keyof typeof DATA_TYPE_LIST;

export type DataTypeValue = {
  [key in DataType]: (typeof DATA_TYPE_LIST)[key]["defaultValue"];
};

export type DataStruct = {
  [key in DataType]: {
    dataType: key;
    dataValue: DataTypeValue[key];
  };
}[DataType];

type ArrayDataValue = {
  min: number;
  max: number;
  item?: DataStruct;
};

const useDataTypeList = () => {
  const options = Object.keys(DATA_TYPE_LIST).map((key: DataType) => {
    const data = DATA_TYPE_LIST[key];
    return {
      label: data.label,
      value: key,
      formItemRender: data.formItemRender,
    };
  });

  return {
    options: options.filter((op) => op.value !== "object"),
    dataTypeList: DATA_TYPE_LIST,
  };
};

export default useDataTypeList;
