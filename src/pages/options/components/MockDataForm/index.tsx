import MockDataBaseForm, { MockDataBaseFormProps } from "./BaseForm";

type MockValue = MockDataBaseFormProps["value"];

type MockDataFormProps = MockDataBaseFormProps & {
  hideArrayItem?: boolean;
};

const MockDataForm: React.FC<MockDataFormProps> = (props) => {
  const { initialValues, onSubmit, hideArrayItem, ...rest } = props || {};
  const [mockValue, setMockValue] = React.useState<MockValue>();
  const [arrayItem, setArrayItem] = React.useState<MockValue>();
  const arrayItemDefaultValue = _.get(initialValues, "dataValue.item");

  return (
    <div className="flex gap-24px">
      <div>
        <MockDataBaseForm
          {...rest}
          initialValues={initialValues}
          onChange={setMockValue}
          onSubmit={(vals) => {
            if (vals.dataType === "array") {
              vals.dataValue.item = arrayItem;
            }
            onSubmit?.(vals);
          }}
          onReset={() => {
            if (mockValue?.dataType === "array") {
              setArrayItem(arrayItemDefaultValue);
            }
          }}
        ></MockDataBaseForm>
      </div>
      {mockValue?.dataType === "array" && !hideArrayItem && (
        <MockDataBaseForm
          initialValues={arrayItemDefaultValue}
          isArrayItem
          onChange={setArrayItem}
          value={arrayItem}
        ></MockDataBaseForm>
      )}
    </div>
  );
};

export default MockDataForm;
