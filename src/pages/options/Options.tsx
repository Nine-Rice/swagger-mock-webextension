import React from "react";
import NiceModal from "@ebay/nice-modal-react";
import { Menu, Tabs } from "antd";
import usePageMap, { PageEnum } from "./hooks/usePageMap";

const Options: React.FC = () => {
  const [activeKey, setActiveKey] = React.useState<PageEnum>(PageEnum.MockList);
  const { menuMap, tabMap } = usePageMap();

  return (
    <NiceModal.Provider>
      <div className="flex">
        <div>
          <h1 className="pl-16px">Swagger Mock</h1>
          <Menu
            items={[
              {
                label: "mock",
                type: "group",
                children: [menuMap.MOCK_LIST],
              },
              {
                label: "配置",
                type: "group",
                children: [
                  menuMap.SWAGGER_URL,
                  menuMap.CONVERSION_RULE,
                  menuMap.DATA_TYPE_CONFIG,
                ],
              },
            ]}
            className="w-240px h-100vh"
            selectedKeys={[activeKey]}
            onSelect={(item) => {
              setActiveKey(item.key as PageEnum);
            }}
          ></Menu>
        </div>
        <Tabs
          items={Object.values(tabMap)}
          activeKey={activeKey}
          renderTabBar={() => null}
          className="flex-1 px-20px"
        ></Tabs>
      </div>
    </NiceModal.Provider>
  );
};

export default Options;
