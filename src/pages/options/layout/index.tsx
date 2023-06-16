import { Layout } from "antd";
import { PropsWithChildren } from "react";
import GitHubLink from "../components/GitHubLink";

const { Content } = Layout;

type OptionsLayoutProps = {
  title?: React.ReactNode;
};

const OptionsLayout: React.FC<PropsWithChildren<OptionsLayoutProps>> = (
  props
) => {
  const { children, title } = props || {};
  return (
    <Layout className="bg-white">
      <header className="b-b-1px b-b-solid b-b-#eeeeee py-20px flex items-center">
        <span className="text-30px font-600">{title}</span>
        <GitHubLink></GitHubLink>
      </header>
      <Content>{children}</Content>
    </Layout>
  );
};

export default OptionsLayout;
