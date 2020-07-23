<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'Rights',
    data(){
        return{
            rightsList:[]
        }
    },
    created(){
        this.getRightsList();
    },
    methods:{
        async getRightsList(){
            const { data:res } = await this.$http.get('rights/list');
            // console.log(res);
            if(res.meta.status !== 200){
                // 说明请求失败了
                this.$message.error(res.meta.msg);
            }else{
                // 请求成功
                this.rightsList = res.data;
                // this.$message.success(res.meta.msg);

            }
        }
    }
}
</script>

<style lang="less" scoped>
    
</style>