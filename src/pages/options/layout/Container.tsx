import { Space, Typography } from "antd";
import { PropsWithChildren } from "react";

const { Title, Text } = Typography;

type ContainerProps = {
  title?: React.ReactNode;
  descList?: React.ReactNode[];
};

const Container: React.FC<PropsWithChildren<ContainerProps>> = (props) => {
  const { children, title, descList } = props || {};
  return (
    <div>
      <div>
        <Title level={3}>{title}</Title>
        <Space direction="vertical">
          {descList?.map((desc, index) => (
            <Text type="secondary" key={index}>
              {desc}
            </Text>
          ))}
        </Space>
      </div>
      {children}
    </div>
  );
};

export default Container;
