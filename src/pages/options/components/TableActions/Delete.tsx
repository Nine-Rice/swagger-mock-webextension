import { DeleteFilled } from "@ant-design/icons";
import { Popconfirm } from "antd";

const DeleteAction: React.FC<{
  onConfirm: () => void;
}> = (props) => {
  const { onConfirm } = props || {};

  return (
    <Popconfirm
      title="确定要删除吗？"
      onConfirm={onConfirm}
      okText="确定"
      cancelText="取消"
    >
      <DeleteFilled className="c-red" />
    </Popconfirm>
  );
};

export default DeleteAction;
