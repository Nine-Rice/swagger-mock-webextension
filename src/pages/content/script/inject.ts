import { proxy } from "ajax-hook";
import { MockTreeItem } from "@src/pages/options/utils";

// 从lodash/escapeRegExp中拷贝的方法
function escapeRegExp(string) {
  const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  const reHasRegExpChar = RegExp(reRegExpChar.source);
  return string && reHasRegExpChar.test(string)
    ? string.replace(reRegExpChar, "\\$&")
    : string;
}

const generateResponseData = (mock: MockTreeItem) => {
  const faker = window._swaggerMock.faker;
  const { dataType, dataValue, children } = mock || {};
  let result;
  switch (dataType) {
    // 字符串
    case "string": {
      const { max, min } = dataValue;
      result = faker.string.alpha({ length: { max, min } });
      break;
    }
    // 数字
    case "number": {
      const { stringMode, max, min, precision = 0, isRetainZero } = dataValue;
      if (stringMode || isRetainZero) {
        const prefixIntStr = faker.number.int({
          max: max === min ? max : max - 1,
          min,
        });
        // isRetainZero - 是否保留尾数0
        const mantissa = faker.string
          .numeric(precision)
          .replace(isRetainZero ? "" : /0+?$/, "");
        result = `${prefixIntStr}${precision === 0 ? "" : "." + mantissa}`;
      } else {
        result = faker.number.float({
          max,
          min,
          precision: 1 / Math.pow(10, precision),
        });
      }
      break;
    }
    // 日期
    case "dateTime": {
      const { value } = dataValue;
      result = faker.date
        .between({ from: value[0].valueOf(), to: value[1].valueOf() })
        .valueOf();
      break;
    }
    // 布尔值，value是true的概率，默认为50
    case "boolean": {
      const { value } = dataValue;
      result = faker.datatype.boolean(value / 100);
      break;
    }
    // 常量
    case "constant": {
      const { value } = dataValue;
      result = value;
      break;
    }
    // 枚举
    case "enum": {
      const { value } = dataValue;
      result = faker.helpers.arrayElement(value);
      break;
    }
    // 图片
    case "image": {
      const { width, height } = dataValue;
      result = faker.image.url({ width, height });
      break;
    }
    // 对象
    case "object": {
      result = {};
      if (children) {
        result = children.reduce((pre, item) => {
          pre[item.key] = generateResponseData(item);
          return pre;
        }, {} as Record<string, any>);
      }
      break;
    }
    // 数组
    case "array": {
      const { max, min, item } = dataValue;
      result = [];
      if (item?.dataType === "enum") {
        result = faker.helpers.arrayElements(item.dataValue.value);
      } else {
        result = new Array(faker.number.int({ max, min }))
          .fill(null)
          .map(() => {
            if (item?.dataType) {
              return generateResponseData(item as MockTreeItem);
            } else if (children?.length) {
              return children.reduce((pre, item) => {
                pre[item.key] = generateResponseData(item);
                return pre;
              }, {} as Record<string, any>);
            }
          });
      }
      break;
    }
  }
  return result;
};

proxy({
  //请求发起前进入
  onRequest: (config, handler) => {
    handler.next(config);
  },
  //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
  onError: (err, handler) => {
    handler.next(err);
  },
  //请求成功后进入
  onResponse: (response, handler) => {
    const { url, method } = response?.config || {};
    try {
      const mockList = window._swaggerMock?.mockList;
      const mockItem = mockList?.find(
        (item) =>
          new RegExp(
            escapeRegExp(item.hostMatching).replace(/\\\*/g, ".*")
          ).test(url) &&
          url.includes(item.url) &&
          item.method.toUpperCase() === method.toUpperCase() &&
          !item.isDisabled
      );
      if (mockItem) {
        response.status = 200;
        const mock = mockItem.mockTree.find((item) => item.key === "response");
        response.response = generateResponseData(mock);
        console.log("swaggerMock数据：", response.response);
      }
    } finally {
      handler.next(response);
    }
  },
});
