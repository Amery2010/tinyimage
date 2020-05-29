# tinyimage
用于图片压缩

注意：在 Mac 操作系统上可能会遭遇 mozjepg 编译失败或者运行报错的情况，这类问题大概率是由于 Mac 环境里缺失了一些必要 lib 造成的，你可以通过以下命令来安装所有涉及的依赖：

```bash
brew update
brew install automake autoconf libtool dpkg pkgconfig nasm libpng
```
