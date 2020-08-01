<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList()">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage()">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template v-slot="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template v-slot="scope">
                        <!-- 编辑按钮 -->
                        <el-button size="mini" type="primary" icon="el-icon-edit" ></el-button>
                        <!-- 删除按钮 -->
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                        @click="removeById(scope.row.goods_id)"
                        ></el-button>
                    </template>
                </el-table-column>
                <!-- 分页功能 -->
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template> 

<script>
export default {
    name:'List',
    data(){
        return{
            // 查询参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            goodsList:[]
        }
    },
    created(){
        this.getGoodsList();
    },
    methods:{
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{
                params:this.queryInfo
            });
            if(res.meta.status !== 200){
                return this.$http.message.error(res.meta.msg);
            }else{
                this.total = res.data.total;
                this.goodsList = res.data.goods;
            }
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getGoodsList();
        },
        handleCurrentChange(newPagenum){
            this.queryInfo.pagenum = newPagenum;
            this.getGoodsList();
        },
        async removeById(id){
            // 弹框询问用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)
            if(confirmResult !== 'confirm'){
                // 说明用户取消了删除
                return this.$message.info('已取消了删除');
            }else{
                // 发起删除请求
                const { data:res }  = await this.$http.delete('goods/' + id);
                if(res.meta.status !== 200){
                    this.$message.error(res.meta.msg);
                }else{
                    this.$message.success(res.meta.msg);
                    // 刷新列表
                    this.getGoodsList();
                }
            }
        },
        goAddpage(){
            this.$router.push('/goods/add');
        }
    }
}
</script>

<style lang="less" scoped>

</style>