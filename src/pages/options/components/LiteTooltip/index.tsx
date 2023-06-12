import QuestionCircleOutlined from "@ant-design/icons/lib/icons/QuestionCircleOutlined";
import { Tooltip } from "antd";
import { PropsWithChildren } from "react";

const LiteTooltip: React.FC<PropsWithChildren> = (props) => {
  const { children } = props || {};

  return (
    <Tooltip title={children}>
      <QuestionCircleOutlined className="c-#8c8c8c cursor-help" />
    </Tooltip>
  );
};
export default LiteTooltip;
