import { Layout, Typography } from "antd";
import { PropsWithChildren } from "react";

const { Content } = Layout;
const { Title } = Typography;

type OptionsLayoutProps = {
  title?: React.ReactNode;
};

const OptionsLayout: React.FC<PropsWithChildren<OptionsLayoutProps>> = (
  props
) => {
  const { children, title } = props || {};
  return (
    <Layout className="bg-white">
      <header>
        <Title level={2} className="b-b-1px b-b-solid b-b-#eeeeee my-0 py-20px">
          {title}
        </Title>
      </header>
      <Content>{children}</Content>
    </Layout>
  );
};

export default OptionsLayout;
