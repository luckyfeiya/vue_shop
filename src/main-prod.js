import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import 'element-ui/lib/theme-chalk/index.css';
import TreeTable from 'vue-table-with-tree-grid'

//导入全局样式表
import './assets/css/global.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入nprogress包对应的js和样式表
import NProgress from 'nprogress'

import axios from 'axios'
Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

// 设置请求拦截器
axios.interceptors.request.use(config => {
  // 在request拦截器中，展示进度条
  NProgress.start();
  // console.log(config);
  // 在最后必须return config
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
axios.interceptors.response.use(config => {
  // 在response拦截器中，隐藏进度条
  NProgress.done();
  return config;
})

// 按需导入element-ui中的组件
import { Button, TimelineItem } from 'element-ui'
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
import { Cascader } from 'element-ui';
import { Alert } from 'element-ui';
import { Tabs,TabPane } from 'element-ui';
import { Steps, Step } from 'element-ui';
import { CheckboxGroup, Checkbox } from 'element-ui';
import { Upload } from 'element-ui';
import { Timeline} from 'element-ui';
import nProgress from 'nprogress';

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
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)

// 将富文本编辑器注册到全局
Vue.use(VueQuillEditor)
Vue.component('tree-table',TreeTable)
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm

// 自定义一个全局过滤器
Vue.filter('dateFormat',function(oldValue) {
  const dt = new Date(oldValue);

  const yyyy = dt.getFullYear();
  const mm = ((dt.getMonth()+1) + '').padStart(2,'0');
  const dd = (dt.getDate() + '').padStart(2,'0');

  // 时 分 秒
  const h = (dt.getHours() + '').padStart(2,'0');
  const m = (dt.getMinutes() + '').padStart(2,'0');
  const s = (dt.getSeconds() + '').padStart(2,'0');

  return `${yyyy}-${mm}-${dd} ${h}:${m}:${s}`;
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
