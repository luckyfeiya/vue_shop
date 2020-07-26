<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog()">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table 
            class="treeTable"
            :data="catelist" 
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            show-index
            index-text="#"
            border
            >
            <!-- 是否有效插槽 -->
            <template v-slot:isok="scope">
               <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
               <i class="el-icon-error" v-else style="color:red"></i>
            </template>
            <!-- 排序插槽 -->
            <template v-slot:order="scope">
               <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
               <el-tag type="success" size="mini" v-else-if="scope.row.cat_level == 1">二级</el-tag>
               <el-tag type="warning" size="mini" v-else>三级</el-tag>
            </template>
            <!-- 操作插槽 -->
            <template v-slot:opt>
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
            </tree-table>
            <!-- 分页区域 -->
             <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @closed="addCateDialogClosed()"
        >
            <!-- 添加分类的标签 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                    v-model="selectedKeys"
                    :options="parentCateList"
                    :props="cascaderProps"
                    @change="parentCateChanged()"
                    clearable
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取消</el-button>
                <el-button @click="addCate()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'Cate',
    data(){
        return{
            // 查询参数
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            catelist:[],
            // 总数据条数
            total:0,
            columns:[
                {
                label:'分类名称',
                prop: 'cat_name'
            },
            {
                label:'是否有效',
                type:'template',
                template:'isok'
            },
            {
                label:'排序',
                type:'template',
                template:'order'
            },
            {
                label:'操作',
                type:'template',
                template:'opt'
            }
            ],
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible: false,
            // 添加数据表单的的数据对象
            addCateForm:{
                cat_name:'',
                cat_id:0,
                cat_level:0
            },
            // 添加校验表单的验证规则
            addCateFormRules:{
                cat_name:[
                    {required: true, message:'请输入分类名称',trigger:'blur'}
                ]
            },
            parentCateList:[],
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:'hover',
                checkStrictly:'true'
            },
            // 选中的父级分类ID数组
            selectedKeys:[]
        }
    },
    created(){
        this.getCateList();
    },
    methods:{
        async getCateList(){
            const { data:res } = await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status !== 200){
                return this.$message.error(res.meta.msg);
            }else{
                console.log(res.data);
                this.catelist = res.data.result;
                this.total = res.data.total;
            }
        },
        // 监听pagesize的改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },
        // 监听pagenum的改变
        handleCurrentChange(newPagenum){
            this.queryInfo.pagenum = newPagenum;
            this.getCateList();
        },
        showAddCateDialog(){
            this.getParentCateList();
            this.addCateDialogVisible = true;
        },
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{
                params:{type:2}
            })

            if(res.meta.status !== 200){
                return this.$message.error(res.meta.msg);
            }else{
                // 获取数据成功
                this.parentCateList = res.data;
                console.log(this.parentCateList);
            }
        },
        // 选择项发生变化触发的这个函数
        parentCateChanged(){
           console.log(this.selectedKeys)
           if(this.selectedKeys.length >0){
            // 说明选中了分类
            this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1];
            this.addCateForm.cat_level = this.selectedKeys.length;
           }else{
               this.addCateForm.cat_pid = 0;
               this.addCateForm.cat_level = 0;
           }
        },
        // 点击按钮添加新的分类
        addCate() {
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid){
                    // 说明为空
                    return this.$message.error('输入的分类名称不能为空');
                }else{
                    const { data:res } = await this.$http.post('categories',this.addCateForm);
                    if(res.meta.status !== 201){
                        return this.$message.error(res.meta.msg);
                    }else{
                        // 添加成功
                        console.log(res);
                        this.$message.success(res.meta.msg);
                        this.getCateList();
                    }
                }
            })
            this.addCateDialogVisible = false;
        },
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys = [];
            this.addCateForm.cat_level = 0;
            this.addCateForm.cat_pid = 0;
        }
    }
}
</script>

<style lang="less" scoped>
   .treeTable{
       margin-top: 15px;
   } 
</style>