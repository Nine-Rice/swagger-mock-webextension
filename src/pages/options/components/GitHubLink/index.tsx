import { GithubOutlined } from "@ant-design/icons";
import { Button } from "antd";

const GitHubLink = () => {
  return (
    <Button
      type="link"
      href="https://github.com/RiceNine/swagger-mock-webextension"
      target="_blank"
      className="ml-auto c-black text-20px"
    >
      <GithubOutlined />
    </Button>
  );
};

export default GitHubLink;
