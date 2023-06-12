import { Tag } from "antd";
import { OpenAPIV3 } from "openapi-types";
import Highlighter from "react-highlight-words";

export type MethodType = `${OpenAPIV3.HttpMethods}`;

interface ApiPaperProps {
  title: string;
  method: MethodType;
  searchWords?: string[];
  actions?: React.ReactNode[];
  desc?: string;
}

const ApiPaper: React.FC<ApiPaperProps> = (props) => {
  const { title, method, actions, searchWords = [], desc } = props || {};

  const config: Record<MethodType, { color: string }> = {
    get: {
      color: "#74adf8",
    },
    post: {
      color: "#70c995",
    },
    put: {
      color: "#efa54a",
    },
    delete: {
      color: "#e64f47",
    },
    options: {
      color: "",
    },
    head: {
      color: "",
    },
    patch: {
      color: "",
    },
    trace: {
      color: "",
    },
  };

  return (
    <div className="flex items-center">
      <div className="whitespace-pre-wrap break-all">
        <div className="flex items-center gap-8px">
          <span className="font-600 text-16px">
            <Highlighter
              textToHighlight={title}
              searchWords={searchWords}
              autoEscape
            ></Highlighter>
          </span>
          <Tag color={config[method as MethodType]?.color}>
            {method.toUpperCase()}
          </Tag>
        </div>
        <div>{desc}</div>
      </div>
      <div className="ml-auto">{actions}</div>
    </div>
  );
};

export default ApiPaper;
