import { Tabs } from "antd";
import useDataTypeList from "../../hooks/useDataTypeList";
import MockDataForm from "../../components/MockDataForm";

const DataTypeConfig = () => {
  const { options } = useDataTypeList();
  const { data, setAsync } = useStorageMutation(storage.dataTypeValue);

  return (
    <Tabs
      defaultActiveKey="string"
      items={options.map((op) => ({
        ...op,
        key: op.value,
        children: (
          <MockDataForm
            initialValues={{
              dataType: op.value,
            }}
            hideDataTypeField
            hideArrayItem
            onSubmit={async (vals) => {
              const { dataType, dataValue } = vals || {};
              await setAsync({
                ...data,
                [dataType]: dataValue,
              });
            }}
          ></MockDataForm>
        ),
      }))}
    ></Tabs>
  );
};

export default DataTypeConfig;
