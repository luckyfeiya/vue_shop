# vue_shop

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
### 项目优化策略

#### 1.生成打包报告
打包时，为了直观地发现项目中存在的问题，可以在打包时生成报告。生成报告的方式有两种:
    ①.通过命令行参数的形式生成报告
    ```
    // 通过vue-cli的命令项可以生成打包报告
    // --report 选项可以生成 report.html 以帮助分析包内容
    vue-cli-service build --report
    ```
    ②.通过可视化的UI面板直接查看报告
    在可视化的UI面板中，通过控制台和分析面板，可以方便的看到项目中所存在的问题。

#### 2.第三方库启用CDN

#### 3.Element-ui组件按需加载

#### 4.路由懒加载
当打包构建项目时，JavaScript包会变得非常大，影响页面加载。如果我们能把不痛路由对应的组件分隔成不同的代码块，然后当路由被访问的时候才能加载对应组件，这样就更加高效了。

具体需要3步:
①.安装@babel/plugin-syntax-dynamic-import包
②.在babel.config.js配置文件中声明该插件
③.将路由改为按需加载的形式，示例代码如下:
```
cosnt Foo = () => import(/* webpackChunkName:"group-foo" */ '.Foo.vue')
cosnt Bar = () => import(/* webpackChunkName:"group-foo" */ '.Bar.vue')
cosnt Baz = () => import(/* webpackChunkName:"group-boo" */ '.baz.vue')
```
关于路由懒加载的详细文档，可参考如下链接
https://router.vuejs.org/zh/guide/advanced/lazy-loading.html

#### 5.首页内容定制
不同的打包环境下，首页内容可能会有所不同。我们可以通过插件的方式进行定制，插件配置如下:
```
chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
```
在public/index.html首页中，可以根据isProd的值,来决定如何渲染页面结构
```
<!-- 按需渲染页面的标题 -->
<title><%=htmlWebpackPlugin.options.isProd ? '' : 'dev-'%>电商后台管理系统</title>
<!-- 按需加载外部的CDN资源 -->
<% if(htmlWebpackPlugin.options.isProd){ %>
<!--通过externals加载外部CDN资源>
<%} %>
```

#### 6.通过nprogress添加进度条效果
```
NProgress.start();
NProgress.done();
```

#### 7.在build命令期间移除所有的console命令
Installation
```
npm install babel-plugin-transform-remove-console --save-dev
```
```
// 发布环境下所需的插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  // 如果当前是发布环境，那么添加transform-remove-console插件，以实现删除项目中的所有的 console 代码
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布环境下的插件
    ...prodPlugins
  ]
}
```

#### 8.通过vue.config.js修改webpack的默认配置
   如果程序员有修改webpack默认配置的需求，可以在项目根目录中，按需创建vue.config.js这个配置文件，从而对项目的打包发布过程做自定义的配置。(具体参考配置参考:https://cli.vuejs.org/zh/config/#vue-config-js)
   ```
   // vue.config.js
   // 这个文件中，应该导出一个包含了自定义配置选项的对象
   module.export = {
        // 选项...
   }
   ```

#### 9.为开发模式与发布模式指定不同的打包入口
    默认的情况下,Vue项目的开发模式与发布模式,共用同一个打包的入口文件(即src/main.js)。为了将项目的开发过程与发布过程分离。我们可以为两种模式，各自指定打包的入口文件，即:
    ①开发模式的入口文件为:src/main-dev.js
    ②发布模式的入口文件为:src/main-prod.js

    configureWebpack和chainWebpack
    在vue.config.js导出的配置对象中，新增configureWebpack或chainWebpack节点，来自定义webpack的打包配置。

    在这里,congigureWebpack和chainWebpack的作用相同，唯一的区别就是它们修改webpack配置的方式不同:
    ①chainWebpack通过链式编程的形式,来修改默认的webpack配置
    ②configureWebpack通过操作对象的形式,来修改默认的webpack配置

    两者具体的使用差异，可参考如下网址
    https://cli.vuejs.org/zh/guide/webpack.html#webpack-%E7%9B%B8%E5%85%B3


    通过chainWebpack自定义打包入口
    代码示例如下:
    ```
    module.exports = {
        chainWebpack: config => {
            config.when(process.env.NODE_ENV === 'production',config => {
                config.entry('app').clear().add('./src/main-prod.js')
            })
            config.when(process.env.NODE_ENV === 'development',config => {
                config.entry('app').clear().add('./src/main-dev.js')
            })
        }
    }
    ```

#### 10.通过externals加载外部CDN资源
    默认情况下，通过import语法导入的第三方依赖包，最终会被打包合并到同一个文件中,从而导致打包成功后,文件体积过大的问题。

    为了解决上述问题，可以通过webpack的externals节点，来配置并加载外部的CDN资源。凡是声明在externals中的第三方依赖包，都不会被打包。
    ```
    config.set('externals',{
        vue:'Vue',
        'vue-router':'VueRouter',
        axios:'axios',
        lodash:'_',
        echarts:'echarts',
        nprogress:'NProgress',
        'vue-quill-editor':'VueQuillEditor'
    })
    ```
##### 在index.html文件下导入
    CSS样式表:
    ```
    <!-- nprogress 的样式表文件 -->
    <link rel="stylesheet" href="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.css" />
    <!-- 富文本编辑器 的样式表文件 -->
    <link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.core.min.css" />
    <link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.snow.min.css" />
    <link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.bubble.min.css" />
    ```
    JS文件:
    ```
    <script src="https://cdn.staticfile.org/vue/2.5.22/vue.min.js"></script>
    <script src="https://cdn.staticfile.org/axios/0.18.0/axios.min.js"></script>
    <script src="https://cdn.staticfile.org/lodash.js/4.17.11/lodash.min.js"></script>
    <script src="https://cdn.staticfile.org/echarts/4.1.0/echarts.min.js"></script>
    <script src="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.js"></script>
    <!-- 富文本编辑器的 js 文件 -->
    <script src="https://cdn.staticfile.org/quill/1.3.4/quill.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue-quill-editor@3.0.4/dist/vue-quill-editor.js"></script>
    ```
##### 问题
Vue 打包后报错 Uncaught TypeError: Cannot redefine property: $router
原因：就如报错提示所描述的，不能重新定义$router，说明是重复定了$router。通常是因为在项目中安装了vue-router的依赖并且用Vue.use()使用了vue-router，还在index.html页面引入了vue-router.js文件。

解决方法有两种：
1. 去掉index.html中的vue-router.js文件的引入。如果没有使用externals的话可以直接使用这种方法。
2. 删除vue-router的依赖，包括依赖包和package.json中的vue-router。使用了externals来外部引入vue-router的话则用这种方法。

提示：从vue-router.js文件引入的router对象名为VueRouter，新建router对象是 new VueRouter()。

#### 11.通过CDN优化Element-UI打包
虽然在开发阶段,我们启用lelement-ui组件的按需加载，尽可能的减少了打包的体积，但是那些被按需加载的组件，还是占用了较大的文件体积。此时，我们可以将element-ui中的组件，也通过CDN的形式来加载，这样能够进一步减小打包后的文件体积。

具体操作流程如下:
①.在main-prod.js中,注释掉element-ui按需加载的代码.
②.在index.html的头部区域中,通过CDN加载element-ui的js和css样式.
```
<!-- element-ui 的样式表文件 -->
<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
<!-- element-ui 的 js 文件 -->
<script src="https://cdn.staticfile.org/element-ui/2.8.2/index.js"></script>
```

### 项目上线
#### 1.通过node创建web服务器
创建node项目,并安装express,通过express快速创建服务器,将vue打包生成的dist文件夹,托管为静态资源即可,关键代码如下:
```
const express = require('express')
// 创建web服务器
const app = express()

// 托管为静态资源
app.use(express.static('./dist'))

// 启动web服务器
app.listen(80,() => {
  console.log('web server running at http://127.0.0.1')
})
```

#### 2.开启gzip配置
使用gzip可以减小文件体积,使传输速度更快。
可以通过服务器端使用Express做gzip压缩。其配置如下:
```
// 安装相应包
npm install compression -D

// 导入包
const compression = require('compression');

// 启用中间件,一定要把这行代码写到 静态资源托管之前
app.use(compression());
```

#### 3.配置https服务
为什么要启用https服务?
1. 传统的HTTP协议传输的数据都是明文,不安全
2. 采用HTTPS协议对传输的数据进行了加密处理,可以防止数据被中间人窃取,使用更安全

如何配置HTTPS服务
申请SSL证书(https://freessl.org)
1. 进入https://freessl.cn/官网,输入要申请的域名并选择品牌。
2. 输入自己的邮箱并选择相关选项。
3. 验证DNS(在域名管理后台添加TXT记录)。
4. 验证通过后,下载SSL证书(full_chain.pem公钥;private.key私钥)。

在后台项目中导入证书
```
const https = require('https');
const fs = require('fs');
const options ={
    cert: fs.readFileSync('./full_chain_pem'),
    key:fs.readFileSync('./private.key')
}
https.createServer(options,app).listen(443);
```

#### 4.使用pm2管理应用
1. 在服务器中安装pm2
```
npm intall pm2 -g
```
2. 启动项目
```
pm2 start 脚本 --name 自定义名称
```
3. 查看运行项目
```
pm2 ls
```
4. 重启项目
```
pm2 restart 自定义名称/ID
```
5. 停止项目
```
pm2 stop 自定义名称/ID
```
6. 删除项目
```
pm2 delete 自定义名称/ID
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
