# vite-plugin-rm-console

<p align="center">
  <a style="color: #ccc;" href="./README_CN.md">中文</a> | <a href="./README.md">English</a>
</p>

## 用途

在开发环境中，识别当前 git 用户，移除其他用户的 console.log。

## 如何使用

vite-plugin-rm-console 导出 removeConsolePlugin 函数。你可以配置以下属性：

- include:

  包含的文件夹。

  默认: [ /src/ ]

- fileRegex:

  需要处理的文件。

  默认: /\.(?:[tj]sx?|vue)$/


## 示例

```ts
import removeConsolePlugin from 'vite-plugin-rm-console';

plugins: [
  ......
  removeConsolePlugin({
    include: [ /src/ ],
    fileRegex: /\.(?:[tj]sx?|vue)$/,
  });
]
```
