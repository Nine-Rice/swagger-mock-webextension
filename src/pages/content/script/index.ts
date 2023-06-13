const moduleMap = {
  fakerJs: browser.runtime.getURL("lib/faker@8.0.2.js"),
  injectJs: browser.runtime.getURL("assets/js/inject.js"),
  windowJs: browser.runtime.getURL("window.js"),
};

const CONTENT_SCRIPT_ID = "swaggerMockContent";

// window对象挂载自定义属性
const windowMounted = () => {
  const script = document.createElement("script");
  script.setAttribute("src", moduleMap.windowJs);
  script.onload = async function () {
    const mockList = await storage.mockList.get();
    window.postMessage({
      source: CONTENT_SCRIPT_ID,
      moduleMap,
      mockList,
    });
    // 注入监听接口的脚本
    const script = document.createElement("script");
    script.setAttribute("src", moduleMap.injectJs);
    document.head.appendChild(script);
    const currentScript = this as HTMLScriptElement;
    currentScript.parentNode.removeChild(currentScript);
  };
  document.head.appendChild(script);
};

windowMounted();

browser.runtime.onMessage.addListener((req) => {
  if (req?.source === "swagger-mock-list") {
    window.postMessage({
      source: CONTENT_SCRIPT_ID,
      action: "updateMockList",
      mockList: req?.data,
    });
  }
});

export {};
