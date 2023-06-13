window.addEventListener("message", async (e) => {
  const { source, action, mockList, moduleMap } = e?.data || {};
  if (source === "swaggerMockContent") {
    if (action === "updateMockList") {
      window._swaggerMock.mockList = mockList;
    } else {
      const fakerJs = await import(moduleMap.fakerJs);
      window._swaggerMock = {
        mockList,
        faker: fakerJs.faker,
      };
      console.log("swaggerMock插件挂载完成");
    }
  }
});
