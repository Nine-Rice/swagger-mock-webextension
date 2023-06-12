import React from "react";
import "@pages/options/Options.css";
import {
  ApiOutlined,
  LinkOutlined,
  RetweetOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import NiceModal from "@ebay/nice-modal-react";
import { Menu, Tabs } from "antd";
import MockList from "./blocks/MockList";
import Setting from "./blocks/Setting";
import DataTypeConfig from "./blocks/DataTypeConfig";
import ConversionRule from "./blocks/ConversionRule";

enum PageEnum {
  MockList = "接口Mock",
  SwaggerUrl = "Swagger文档",
  DataTypeConfig = "数据类型配置",
  ConversionRule = "转化规则",
}

const Options: React.FC = () => {
  const [activeKey, setActiveKey] = React.useState<string>(PageEnum.MockList);

  return (
    <NiceModal.Provider>
      <div className="flex">
        <Menu
          items={[
            {
              label: "mock",
              type: "group",
              children: [
                {
                  label: "接口Mock",
                  key: PageEnum.MockList,
                  icon: <ApiOutlined />,
                },
              ],
            },
            {
              label: "配置",
              type: "group",
              children: [
                {
                  label: "swagger文档地址",
                  key: PageEnum.SwaggerUrl,
                  icon: <LinkOutlined />,
                },
                {
                  label: "转化规则",
                  key: PageEnum.ConversionRule,
                  icon: <RetweetOutlined />,
                },
                {
                  label: "数据类型配置",
                  key: PageEnum.DataTypeConfig,
                  icon: <SlidersOutlined />,
                },
              ],
            },
          ]}
          className="w-240px h-100vh"
          selectedKeys={[activeKey]}
          onSelect={(item) => {
            setActiveKey(item.key);
          }}
        ></Menu>
        <Tabs
          items={[
            {
              key: PageEnum.MockList,
              label: "接口",
              children: <MockList></MockList>,
            },
            {
              key: PageEnum.SwaggerUrl,
              label: "swaggerUrl",
              children: <Setting></Setting>,
            },
            {
              key: PageEnum.DataTypeConfig,
              label: "数据类型配置",
              children: <DataTypeConfig></DataTypeConfig>,
            },
            {
              key: PageEnum.ConversionRule,
              label: "转化规则",
              children: <ConversionRule></ConversionRule>,
            },
          ]}
          activeKey={activeKey}
          renderTabBar={() => null}
          className="flex-1 pl-20px"
        ></Tabs>
      </div>
    </NiceModal.Provider>
  );
};

export default Options;
