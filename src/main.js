import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';

//导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

// 设置请求拦截器
axios.interceptors.request.use(config => {
  console.log(config);
  // 在最后必须return config
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

// 按需导入element-ui中的组件
import { Button } from 'element-ui'
import { Form,FormItem } from 'element-ui'
import { Input } from 'element-ui'
import { Message } from 'element-ui'
import { Container, Header, Aside, Main } from 'element-ui'
import { Menu, Submenu, MenuItemGroup, MenuItem} from 'element-ui'
import { Breadcrumb,BreadcrumbItem } from 'element-ui'
import { Card } from 'element-ui'
import { Row,Col} from 'element-ui'
import { Table, TableColumn} from 'element-ui'
import { Switch } from 'element-ui'
import { Tooltip } from 'element-ui'
import { Pagination } from 'element-ui'
import { Dialog } from 'element-ui'
import { MessageBox } from 'element-ui';
import { Tag } from 'element-ui';
import { Tree } from 'element-ui';
import { Select, Option } from 'element-ui';

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
