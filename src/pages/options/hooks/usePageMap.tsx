import {
  ApiOutlined,
  LinkOutlined,
  RetweetOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import MockList from "../blocks/MockList";
import ConversionRule from "../blocks/ConversionRule";
import DataTypeConfig from "../blocks/DataTypeConfig";
import { MenuProps, TabsProps } from "antd";
import SwaggerUrlSetting from "../blocks/SwaggerUrlSetting";

export enum PageEnum {
  MockList = "MOCK_LIST",
  SwaggerUrl = "SWAGGER_URL",
  ConversionRule = "CONVERSION_RULE",
  DataTypeConfig = "DATA_TYPE_CONFIG",
}

const usePageMap = () => {
  const pageList = [
    {
      label: "Mock接口",
      key: PageEnum.MockList,
      icon: <ApiOutlined />,
      children: <MockList></MockList>,
    },
    {
      label: "swagger文档",
      key: PageEnum.SwaggerUrl,
      icon: <LinkOutlined />,
      children: <SwaggerUrlSetting></SwaggerUrlSetting>,
    },
    {
      label: "转化规则",
      key: PageEnum.ConversionRule,
      icon: <RetweetOutlined />,
      children: <ConversionRule></ConversionRule>,
    },
    {
      label: "数据类型配置",
      key: PageEnum.DataTypeConfig,
      icon: <SlidersOutlined />,
      children: <DataTypeConfig></DataTypeConfig>,
    },
  ];
  return pageList.reduce(
    (result, page) => {
      const { icon, children, ...common } = page;
      result.menuMap[page.key] = {
        ...common,
        icon,
      };
      result.tabMap[page.key] = {
        ...common,
        children,
      };
      return result;
    },
    {
      menuMap: {} as Record<PageEnum, MenuProps["items"][number]>,
      tabMap: {} as Record<PageEnum, TabsProps["items"][number]>,
    }
  );
};

export default usePageMap;
