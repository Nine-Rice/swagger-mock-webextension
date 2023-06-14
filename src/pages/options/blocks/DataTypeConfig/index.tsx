import { Tabs } from "antd";
import useDataTypeList from "../../hooks/useDataTypeList";
import MockDataForm from "../../components/MockDataForm";
import OptionsLayout from "../../layout";
import Container from "../../layout/Container";

const DataTypeConfig = () => {
  const { options } = useDataTypeList();
  const { data, setAsync } = useStorageMutation(storage.dataTypeValue);

  return (
    <OptionsLayout title="数据类型配置">
      <Container title="数据默认值">
        <Tabs
          defaultActiveKey="string"
          css={css`
            .ant-tabs-nav {
              &:before {
                display: none;
              }
            }
          `}
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
      </Container>
    </OptionsLayout>
  );
};

export default DataTypeConfig;
