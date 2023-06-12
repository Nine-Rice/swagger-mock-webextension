import { Checkbox, Form, InputNumber, InputNumberProps, Space } from "antd";
import LiteTooltip from "../LiteTooltip";

export type NumberRangeValueType = {
  max: number;
  min: number;
  precision?: number;
  stringMode?: boolean;
  isRetainZero?: boolean;
};

type NumberRangeFieldProps = {
  value?: NumberRangeValueType;
  onChange?: (value: NumberRangeValueType) => void;
  hidePrecision?: boolean;
  hideStringMode?: boolean;
  hideRetainZero?: boolean;
  label: {
    max: React.ReactNode;
    min: React.ReactNode;
  };
};

const COMMON_PROPS: InputNumberProps = {
  min: 0,
  precision: 0,
};

const NumberRangeField: React.FC<NumberRangeFieldProps> = (props) => {
  const {
    value,
    onChange,
    hidePrecision,
    hideStringMode,
    hideRetainZero,
    label,
  } = props || {};
  const {
    max = 0,
    min = 0,
    precision = 0,
    stringMode = false,
    isRetainZero = false,
  } = value || {};

  const handleChange = React.useCallback(
    (newValue: Partial<NumberRangeValueType> = {}) => {
      onChange?.({
        max,
        min,
        precision,
        stringMode,
        isRetainZero,
        ...newValue,
      });
    },
    [isRetainZero, max, min, onChange, precision, stringMode]
  );

  return (
    <div>
      <Form.Item label={label?.min}>
        <InputNumber
          {...COMMON_PROPS}
          value={min}
          max={max}
          onChange={(min) => {
            handleChange({
              min: Number(min) || 0,
            });
          }}
          className="w-200px"
        ></InputNumber>
      </Form.Item>
      <Form.Item label={label?.max}>
        <InputNumber
          {...COMMON_PROPS}
          min={min}
          value={max}
          onChange={(max) => {
            handleChange({
              max: Number(max) || 0,
            });
          }}
          className="w-200px"
        ></InputNumber>
      </Form.Item>
      {!hidePrecision && (
        <Form.Item label="精确度">
          <InputNumber
            {...COMMON_PROPS}
            value={precision}
            onChange={(precision) => {
              handleChange({
                precision: Number(precision) || 0,
              });
            }}
          ></InputNumber>
        </Form.Item>
      )}
      {!hideStringMode && (
        <div className="pb-24px">
          <Space>
            <Space size={4}>
              <span>字符串模式</span>
              <LiteTooltip>
                <div>
                  <span>以下情况建议开启：</span>
                  <div>1、精度非常高（避免精度丢失）</div>
                  <div>2、数值非常大（避免转成科学计数法）</div>
                  <div>3、保留无效零</div>
                </div>
              </LiteTooltip>
            </Space>
            <Checkbox
              checked={stringMode}
              onChange={(e) => {
                const stringMode = e.target.checked;
                handleChange({
                  stringMode,
                  isRetainZero: false,
                });
              }}
            ></Checkbox>
          </Space>
        </div>
      )}
      {!hideRetainZero && (
        <Space>
          <Space size={4}>
            <span>保留无效零</span>
            <LiteTooltip>
              <div>
                <span>示例：</span>
                <div>1.23 → 1.230 // 精确度为3</div>
                <div>1.23 → 1.2300000000 // 精确度为10</div>
              </div>
            </LiteTooltip>
          </Space>
          <Checkbox
            checked={isRetainZero}
            onChange={(e) => {
              const isRetainZero = e.target.checked;
              handleChange({
                stringMode: true,
                isRetainZero,
              });
            }}
          ></Checkbox>
        </Space>
      )}
    </div>
  );
};

export default NumberRangeField;
