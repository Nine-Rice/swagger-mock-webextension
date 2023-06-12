import { Button, Form, Select, Space, message } from "antd";
import useDataTypeList, {
  DataStruct,
  DataType,
  DataTypeValue,
} from "../../hooks/useDataTypeList";
import {
  transformDataTypeValue,
  transformDateTimeValue,
} from "@src/pages/options/utils";

export type MockDataBaseFormProps = {
  value?: DataStruct;
  initialValues?: Partial<DataStruct> & Pick<DataStruct, "dataType">;
  // 隐藏数据类型字段
  hideDataTypeField?: boolean;
  // 数组元素类型特殊处理
  isArrayItem?: boolean;
  onSubmit?: (vals: DataStruct) => void | Promise<void>;
  onChange?: (vals: DataStruct) => void;
  onReset?: () => void;
};

const MockDataBaseForm: React.FC<MockDataBaseFormProps> = (props) => {
  const {
    initialValues,
    onSubmit,
    onChange,
    onReset,
    hideDataTypeField,
    isArrayItem,
    value,
  } = props || {};
  const initDone = React.useRef(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [form] = Form.useForm();
  const { options, dataTypeList } = useDataTypeList();
  const { data: dataTypeValue, isLoading } = useStorageMutation(
    storage.dataTypeValue
  );
  const dataType = Form.useWatch("dataType", form);

  // 赋值
  const setValues = React.useCallback(
    (
      vals: {
        dataType: DataType;
      } = {
        dataType,
      }
    ) => {
      const { dataType: curDataType } = vals || {};
      let dataValue;
      if (value?.dataType === curDataType) {
        dataValue = _.cloneDeep(value?.dataValue);
      } else if (
        initialValues?.dataType === curDataType &&
        initialValues?.dataValue
      ) {
        dataValue = _.cloneDeep(initialValues?.dataValue);
      } else {
        dataValue = _.cloneDeep(dataTypeValue[curDataType]);
      }
      if (dataValue && curDataType === "dateTime") {
        dataValue.value = transformDateTimeValue(dataValue.value, "dayJs");
      }
      form.setFieldsValue({
        dataType: curDataType,
        [curDataType]: dataValue,
      });
      onChange?.({
        dataType: curDataType,
        dataValue:
          curDataType === "dateTime"
            ? {
                value: transformDateTimeValue(dataValue.value, "number"),
              }
            : dataValue,
      });
    },
    [
      dataType,
      dataTypeValue,
      form,
      initialValues?.dataType,
      initialValues?.dataValue,
      onChange,
      value?.dataType,
      value?.dataValue,
    ]
  );

  React.useEffect(() => {
    if (value?.dataType) {
      setValues({ dataType: value.dataType });
    }
  }, [setValues, value?.dataType]);

  // 重置
  const handleReset = React.useCallback(() => {
    if (initialValues?.dataType) {
      const defaultDataType = initialValues.dataType;
      setValues({ dataType: defaultDataType });
    } else {
      form.resetFields();
    }
  }, [form, initialValues?.dataType, setValues]);

  // 默认值初始化赋值
  React.useEffect(() => {
    if (!isLoading && !initDone.current) {
      handleReset();
      initDone.current = true;
    }
  }, [handleReset, initialValues?.dataType, isLoading]);

  return !isLoading ? (
    <Form<DataTypeValue & { dataType?: DataType }>
      form={form}
      onValuesChange={(_, vals) => {
        onChange?.({
          dataType,
          dataValue: transformDataTypeValue(vals, "number")[dataType],
        });
      }}
      onFinish={async (vals) => {
        setSubmitLoading(true);
        try {
          await onSubmit?.({
            dataType,
            dataValue: transformDataTypeValue(vals, "number")[dataType],
          });
          message.success("保存成功");
        } finally {
          setSubmitLoading(false);
        }
      }}
    >
      {
        <Form.Item
          name="dataType"
          label={isArrayItem ? "数组元素类型" : "数据类型"}
          className={`w-300px`}
          hidden={hideDataTypeField}
        >
          <Select<DataType>
            options={options.filter((op) => {
              // 数组元素不支持对象和数组类型
              if (isArrayItem) {
                return !(["array", "object"] as DataType[]).includes(op.value);
              }
              return true;
            })}
            onChange={(curDataType) => {
              setValues({
                dataType: curDataType,
              });
            }}
          ></Select>
        </Form.Item>
      }
      {dataType ? dataTypeList[dataType]?.formItemRender : null}
      {isArrayItem ? null : (
        <Space>
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            保存
          </Button>
          <Button
            onClick={() => {
              handleReset();
              onReset?.();
            }}
          >
            重置
          </Button>
        </Space>
      )}
    </Form>
  ) : null;
};

export default MockDataBaseForm;
