<h1>Swagger Mock Generator</h1>

> 此项目基于[chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite.git)搭建

## 目录

- [目录](#目录)
- [简介 ](#简介-)
- [特性 ](#特性-)
- [安装 ](#安装-)
  - [Chrome ](#chrome-)
  - [Edge ](#edge-)
  - [本地离线包 ](#本地离线包-)
- [使用 ](#使用-)
  - [基本使用](#基本使用)
  - [转化规则的使用](#转化规则的使用)
    - [正则表达式](#正则表达式)
    - [Swagger 数据类型](#swagger-数据类型)
  - [数据类型配置](#数据类型配置)
- [相关文档 ](#相关文档-)

## 简介 <a name="简介"></a>

Swagger Mock Generator 是一个 Chrome 浏览器扩展,它可以读取 Swagger 接口文档,根据接口的参数定义自动生成 Mock 数据。通过使用这个扩展,您只需要提供一个标准的 Swagger 接口文档,就可以一键生成丰富的 Mock 数据来支持开发、测试及演示。

## 特性 <a name="特性"></a>

- 解析 Swagger JSON 或 YAML 格式的接口文档
- 根据接口参数类型(字符串、数值、布尔、对象、数组等)生成随机 Mock 数据
- 支持 Swagger 基本类型(string、number、boolean 等)及复杂类型(object、array)
- 生成的 Mock 数据可以写入到接口响应体、响应头或请求参数中
- 支持全局及个性化的 Mock 配置,包括支持自定义正则表达式等
- 简单易用,无需编写任何代码即可生成 Mock 数据

## 安装 <a name="安装"></a>

### Chrome <a name="chrome"></a>

[Chrome 扩展商店地址，审核中...]()

### Edge <a name="edge"></a>

[Edge 扩展商店地址，审核中...]()

### 本地离线包 <a name="本地离线包"></a>

1. 克隆此项目到本地
2. `npm i pnpm -g`
3. `pnpm i`
4. `pnpm run build` or `npm run build`
5. 打开浏览器扩展，开启*开发人员模式*，加载扩展，选择`dist`目录

## 使用 <a name="使用"></a>

### 基本使用

1. 打开设置页面，点击菜单「swagger 文档」，添加 swagger 文档地址
2. 点击菜单「Mock 接口」，在接口列表底部的搜索框内输入关键词搜索对应的接口，点击「添加」
3. 回到页面，重新请求接口，即可看到接口返回的 Mock 数据

### 转化规则的使用

根据你填写的条件对于一些特殊字段的数据做特殊转化，目前支持的条件有：

#### 正则表达式

通过返回的字段是否符合正则表达式，比如我希望带有 url 结尾的字段全都返回图片数据：

正则表达式：`/^.+url$/`

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "name": "张三",
    "age": 18,
    "iconUrl": "random_string",
    "avatarUrl": "random_string"
  }
}

         ↓

{
"code": 200,
  "message": "success",
  "data": {
    "name": "张三",
    "age": 18,
    "iconUrl": "https://loremflickr.com/640/480?lock=1234",
    "avatarUrl": "https://loremflickr.com/640/480?lock=1234"
  }
}
```

#### Swagger 数据类型

根据返回的数据类型是否符合条件，比如有些接口的网关会把所有的 number 类型都转化成 string 类型（为了防止数字丢精度），但 swagger 返回的类型还是 number，这时候就可以通过这个规则来转化。

### 数据类型配置

数据类型转化的默认配置，比如字符串的默认长度就是 5\~20，这时候所以生成的字符串长度就是在这个范围里面，如果你把配置改成 1\~100，对应的接口需要点击重新生成数据

## 相关文档 <a name="文档"></a>

- [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite.git)
- [@faker-js/faker](https://fakerjs.dev/guide/usage.html)
- [webextension-polyfill](https://github.com/mozilla/webextension-polyfill)
- [ajax-hook](https://github.com/wendux/ajax-hook)
- [vite](https://vitejs.dev/)
- [unocss](https://github.com/unocss/unocss)
- [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)
