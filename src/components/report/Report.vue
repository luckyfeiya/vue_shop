<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
// 导入echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
    name:'Report',
    data(){
        return{
            options:{
                title:{
                    text:'用户来源'
                },
                tooltip:{
                    trigger:'axis',
                    axisPointer:{
                        type:'cross',
                        label:{
                            backgroundColor:'#e9eef3'
                        }
                    }
                },
                grid:{
                    left:'3%',
                    right:'4%',
                    bottom:'3%',
                    containLabel:true
                },
                xAxis:[
                    {
                        boundaryGap: false
                    }
                ],
                yAxis:[
                    {
                        type:'value'
                    }
                ]

            }
        }
    },
    created(){

    },
    async mounted(){
        // 只有执行到mounted这个函数，此时才能表明页面上的元素被渲染完毕了
        var myChart = echarts.init(document.getElementById('main'));

        // 发起网络请求，获取数据
        const {data:res} = await this.$http.get('reports/type/1');
        if(res.meta.status !== 200){
            return this.$message.error(res.meta.msg);
        }else{
            // 展示数据
            const result = _.merge(res.data,this.options);
            myChart.setOption(result);
        }
    },
    methods:{

    }
}
</script>

<style lang="less" scoped>
    
</style>