# vite-plugin-rm-console

<p align="center">
  <a href="./README_CN.md">中文</a> | <a style="color: #ccc;" href="./README.md">English</a>
</p>

## What's the use of it?

In the development environment, identify the current git user and remove the console.log of other users.

## How to use?

vite-plugin-rm-console export a function removeConsolePlugin. You can configure the following attributes:

- include:

  Folders included.

  Default: [ /src/ ]

- fileRegex:

  Files that need to be processed.

   Default: /\.(?:[tj]sx?|vue)$/


## Example

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
