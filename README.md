# vite-plugin-rm-console

## What's the use of it?

Identifies the current git user and removes console.log other users.

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
