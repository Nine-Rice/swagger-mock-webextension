const moduleMap = {
  fakerJs: browser.runtime.getURL("lib/faker@8.0.2.js"),
  injectJs: browser.runtime.getURL("assets/js/inject.js"),
  windowJs: browser.runtime.getURL("window.js"),
};

// window对象挂载自定义属性
const windowMounted = () => {
  const script = document.createElement("script");
  script.setAttribute("id", "swaggerMockWindowJs");
  script.setAttribute("src", moduleMap.windowJs);
  script.onload = async () => {
    const mockList = await storage.mockList.get();
    window.postMessage({
      form: "swaggerMockContent",
      data: {
        module: moduleMap,
        mockList,
      },
    });
  };
  document.head.appendChild(script);
};

windowMounted();

export {};
