<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告区域 -->
             <el-alert
                title="注意：只允许为三级分类设置动态参数!"
                type="warning"
                show-icon
                :closable="false"
                >
            </el-alert>

            <!-- 选择区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类:</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader
                    v-model="selectedCateKeys"
                    :options="catelist"
                    :props="cateProps"
                    @change="handleChange()"
                    clearable
                    ></el-cascader>
                </el-col>
            </el-row>

            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled"
                    @click="addDialogVisible = true"
                    >添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClosed(index,scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                @click="showEditDialog(scope.row.attr_id)"
                                >编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled"
                    @click="addDialogVisible = true"
                    >添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClosed(index,scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                 @click="showEditDialog(scope.row.attr_id)"
                                >编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数/属性对话框 -->
        <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @closed="addDialogClosed()"
        >
            <!-- 添加参数的对话框 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addParams()">确定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数/属性对话框 -->
        <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        >
            <!-- 修改参数的对话框 -->
            <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span class="dialog-footer" slot="footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editParams()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'Params',
    data(){
        return{
            catelist:[],
            // 级联选择框的配置属性
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:'hover',
            },
            // 级联选择框双向绑定到的数组
            selectedCateKeys:[],
            activeName:'many',
            cateid:0,
            manyTableData:[],
            onlyTableData:[],
            // 控制添加对话框的显示与隐藏
            addDialogVisible: false,
            addForm:{},
            // 添加表单的验证规则
            addFormRules:{
                attr_name:[
                    {required: true, message:'请输入参数名称', trigger:'blur'}
                ]
            },
            editDialogVisible: false,
            editForm:{},
            editFormRules:{
                attr_name:[
                    {required: true, message:'请输入参数名称', trigger:'blur'}
                ]
            },
        }
    },
    created(){
        this.getCatelList();
    },
    methods:{
        async getCatelList(){
            const { data:res } = await this.$http.get('categories');
            if(res.meta.status !== 200){
                return this.$message.error(res.meta.msg);
            }else{
                // 获取成功
                this.catelist = res.data;
            }
            console.log(this.catelist);
        },
        // 级联选择框选中变化,会触发这个函数
        handleChange(){
            this.getParamsData();   
        },
        // 获取参数的列表数据
        async getParamsData(){
            if(this.selectedCateKeys.length !== 3){
                this.selectedCateKeys =[];
                this.manyTableData = [];
                this.onlyTableData = [];
                return
            }else{
                // 证明是三级分类
                console.log(this.selectedCateKeys);
                this.cateId();
                const { data:res } = await this.$http.get(`categories/${this.cateid}/attributes`,{
                    params:{
                        sel:this.activeName
                    }
                });
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg);
                }else{
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals == '' ? [] : item.attr_vals.split(' ');
                        item.inputVisible = false;
                        item.inputValue ='';
                    });
                    console.log(res.data);
                    if(this.activeName === 'many'){
                        // 说明获取的是动态数据
                        this.manyTableData = res.data;
                        console.log(this.manyTableData);
                    }else{
                        this.onlyTableData = res.data;
                        console.log(this.onlyTableData);
                    }
                }
            }
        },
        // tab页签点击事件的处理
        handleTabsClick(){
            console.log(this.activeName);
            this.getParamsData();
        },
        // 当前选中的三级商品Id
        cateId(){
            if(this.selectedCateKeys.length === 3){
                // 说明它选中了三级分类
                this.cateid = this.selectedCateKeys[this.selectedCateKeys.length - 1];
            }
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        addParams(){
            this.$refs.addFormRef.validate( async valid =>{
                if(!valid){
                    return this.$message.error('输入的名称不合法！')
                }else{
                    const {data:res} = await this.$http.post(`categories/${this.cateid}/attributes`,{
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })

                    if(res.meta.status !== 201){
                        return this.$message.error(res.meta.msg);
                    }else{
                        this.$message.success(res.meta.msg);
                        this.getParamsData();
                    }
                }
            })
            this.addDialogVisible = false;
        },
        async showEditDialog(id){
            const { data:res } = await this.$http.get(`categories/${this.cateid}/attributes/${id}`,{
                params:{
                    attr_sel:this.activeName
                }
            })
            if(res.meta.status !== 200){
                return this.message.error(res.meta.msg)
            }else{
                this.editForm = res.data;
                console.log(this.editForm);
            }
            this.editDialogVisible = true;
        },
        editParams(){
            this.$refs.editFormRef.validate( async valid =>{
                if(!valid){
                    return this.$message.error('输入的名称不合法！')
                }else{
                    const {data:res} = await this.$http.put(`categories/${this.cateid}/attributes/${this.editForm.attr_id}`,{
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName
                    })

                    if(res.meta.status !== 200){
                        return this.$message.error(res.meta.msg);
                    }else{
                        this.$message.success(res.meta.msg);
                        this.getParamsData();
                    }
                }
            })
            this.editDialogVisible = false;
        },
        async deleteParams(id){
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)

            if(confirmResult !== 'confirm'){
                // 说明用户取消了删除
                return this.$message.info('已取消了删除');
            }else{
                console.log('确认要删除');
                // 发起删除请求
                const { data:res }  = await this.$http.delete(`categories/${this.cateid}/attributes/${id}`);
                if(res.meta.status !== 200){
                    this.$message.error(res.meta.msg);
                }else{
                    this.$message.success(res.meta.msg);
                    // 刷新列表
                    this.getParamsData();
                }
            }
        },
        // 文本框失去焦点或者按下了Enter都会触发
        handleInputConfirm(row){
            row.inputVisible = false;
            if(row.inputValue.trim().length === 0){
                row.inputValue = '';
                return;
            }else{
                row.attr_vals.push(row.inputValue.trim());
                row.inputValue = '';
                row.inputVisible = false;

                this.saveAttrVals(row);
            }
        },
        // 点击按钮展示文本框
        showInput(row){
            row.inputVisible = true;
            // $nextTick 方法作用，就是当页面上的元素被重新渲染之后，才会指定回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 删除展开行的标签功能
        handleClosed(index,row){
            row.attr_vals.splice(index,1);
            this.saveAttrVals(row);
        },
        // 抽离修改标签的请求函数
        async saveAttrVals(row){
            const {data:res } = await this.$http.put(`categories/${this.cateid}/attributes/${row.attr_id}`,{
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(' ')
                })

                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg)
                }else{
                    this.$message.success(res.meta.msg);
                    // this.getParamsData();
                }
        }
    },
    computed:{
        // 如果按钮需要被禁用，则返回true 否则返回false
        isBtnDisabled(){
            if(this.selectedCateKeys.length === 3){
                return false
            }else{
                return true
            }
        },
        // 动态计算标题
        titleText(){
            if(this.activeName === 'many'){
                return '动态参数'
            }else{
                return '静态属性'
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .cat_opt{
        margin: 15px 0;
    }
    .el-tag{
        margin: 10px;
    }
    .input-new-tag{
        width: 150px;
    }
</style>