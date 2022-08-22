说明：
当前值针对ios的app做了开发，安卓未做适配
ios app本地运行需要安装xcode软件

目录nm_fix为当前部分依赖包文件报错的本地修复包；
执行npm install 后，需要单独替换。

安装原生相关组件后，需要执行 cd ios && pod install 命令安装原生依赖
然后返回cd .. 返回上级目录

清理react native 编译缓存
 yarn start --reset-cache
 然后删除node_modules, 重新npm i ，在yarn ios