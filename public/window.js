window.addEventListener("message", async (e) => {
  const data = e.data;
  if (data.form === "swaggerMockContent") {
    const module = data?.data?.module;
    const fakerJs = await import(module.fakerJs);
    window._swaggerMock = {
      ...data?.data,
      faker: fakerJs.faker,
    };
    const script = document.createElement("script");
    script.setAttribute("src", module.injectJs);
    document.head.appendChild(script);
    const currentScript = document.getElementById("swaggerMockWindowJs");
    document.head.removeChild(currentScript);
    console.log("swaggerMock插件挂载完成");
  }
});
