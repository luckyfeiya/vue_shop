<template> 
    <el-container class="home-container">
        <!-- 头部部分 -->
        <el-header>
            <div>
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="collapse ? '64px' : '200px' ">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                    :default-active="activePath"
                    class="el-menu-vertical-demo"
                    :unique-opened="true"
                    :collapse="collapse"
                    :collapse-transition="false"
                    router
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409eff">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                        <!-- 图标 -->
                        <i :class=iconItem[item.id]></i>
                        <!-- 文本 -->
                        <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item @click='saveNavState("/" + subItem.path)' :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
                            <!-- 二级菜单的模板区域 -->
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧主体区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name:'Home',
    data(){
        return{
            menulist:[],
            iconItem:{
                '125' : 'el-icon-user-solid',
                '103' : 'el-icon-s-promotion',
                '101' : 'el-icon-goods',
                '102' : 'el-icon-s-order',
                '145' : 'el-icon-s-data'
            },
            collapse:false,
            activePath:''
        }
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$message({
                message:'退出成功！',
                type:'success'
            })
            this.$router.push('/login');
        },
        async getMenuList(){
            const { data : res } = await this.$http.get('menus');
            if(res.meta.status !== 200){
                return this.$message.error( res.meta.msg)
            }else{
                this.menulist = res.data;
                console.log(this.menulist);
                console.log(this.iconItem);
                return this.$message.success(res.meta.msg);
            }
        },
        // 点击左侧菜单按钮，切换菜单的折叠与展开
        toggleCollapse(){
            this.collapse = !this.collapse;
        },
        saveNavState(activePath){
            console.log(activePath);
            window.sessionStorage.setItem('path',activePath);
            this.activePath = activePath;
        }
    },
    created(){
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('path');
    }
}
</script>

<style lang="less" scoped>
    .home-container{
        height: 100%;
    }
    .el-header{
        background-color: #373D41;
        display: flex;
        justify-content: space-between;
        padding-left: 15px;
        align-items: center;
        color: #fff;
        font-size: 20px;
    }
    .el-aside{
        background-color: #333744;
        .el-menu{
            border-right: none;
        }
        .toggle-button{
            background-color: #4a5064;
            text-align: center;
            font-size: 10px;
            line-height: 24px;
            color: #fff;
            letter-spacing: 0.2em;
            cursor: pointer;
        }
    }
    .el-main{
        background-color: #eaedf1;
    }
</style>