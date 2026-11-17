# 开发者工具

```
# 安装依赖
pnpm install

# 开发调试
pnpm run dev

# 编译核心文件
pnpm run build

## 打包适配发布平台
// 所有平台 (Web & 浏览器插件)
pnpm run release
// chrome
pnpm --filter ctool-adapter-chrome run platform-release
// edge
pnpm --filter ctool-adapter-edge run platform-release
// firefox
pnpm --filter ctool-adapter-firefox run platform-release
// web
pnpm --filter ctool-adapter-web run platform-release
```

> 打包适配平台文件存放位置: /_release
