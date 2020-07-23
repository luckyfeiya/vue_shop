<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
        <el-row :gutter="20">
            <!-- 搜索输入框 -->
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="searchInfo">
                    <el-button slot="append" icon="el-icon-search" @click="searchInfo"></el-button>
                </el-input>
            </el-col>
            <!-- 搜索按钮 -->
            <el-col :span="4">
                <el-button type="primary" @click="addUser">添加用户</el-button>
            </el-col>
        </el-row>

        <!-- 用户列表区域 -->
        <el-table :data="userlist" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态">
                <template v-slot="scope">
                    <!-- {{scope.row}} -->
                    <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template v-slot="scope">
                    <!-- 修改按钮 -->
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                    <!-- 删除按钮 -->
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
                    <!-- 分配角色按钮 -->
                    <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                    <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页功能 -->
         <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
        >
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUserConfirm">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改用户的对话框 -->
        <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
        >
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 分配角色对话框 -->
        <el-dialog
        title="提示"
        :visible.sync="setRoleDiaLogVisible"
        width="50%"
        @closed="setRoleDialogClosed()"
        >
        <p>当前的用户:{{this.userInfo.username}}</p>
        <p>当前的角色:{{this.userInfo.role_name}}</p>
        <!-- 下拉选择菜单 -->
        分配新角色
        <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
            v-for="item in this.roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
            >
            </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRoleDiaLogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'Users',
    data(){
        var checkEmail = (rule, value, cb) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)){
                console.log('输入的邮箱正确');
                return cb()
            }else{
                cb(new Error('请输入合法的邮箱'))
            }
        }
        var checkMobile = (rule, value, cb ) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14(57))[0-9]{8}$/

            if (regMobile.test(value)){
                console.log('输入的手机号正确');
                return cb()
            }else{
                cb(new Error('请输入合法的手机号'))
            } 
        }
        return{
            // 获取用户列表的参数
            queryInfo:{
                query:'',
                // 当前的页数
                pagenum: 1,
                // 当前的页数显示的多少条数据
                pagesize: 2
            },
            userlist:[],
            total: 0,
            // 控制添加用户对话框的显示和隐藏
            addDialogVisible: false,
            // 控制修改用户对话框的显示和隐藏
            editDialogVisible: false,
            editForm:{},
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            selectedRoleId:'',
            // 控制分配角色对话框的显示与隐藏
            setRoleDiaLogVisible: false,
            // 用来存储点击分配角色对话框产生的用户信息
            userInfo: {},
            // 角色存储列表
            roleList:[],
            addFormRules:{
                username:[
                    { required: true, message:'请输入用户名',trigger:'blur' },
                    { min:3,max:10,message:'用户名的长度在3~10个字符之间',trigger:'blur'}
                ],
                password:[
                    { required: true, message:'请输入密码',trigger:'blur' },
                    { min:6,max:15,message:'密码的长度在6~15个字符之间',trigger:'blur'}
                ],
                email:[
                    { required: true, message:'请输入邮箱',trigger:'blur' },
                    { validator: checkEmail, trigger:'blur' }
                ],
                mobile:[
                    { required: true, message:'请输入手机',trigger:'blur' },
                    { validator: checkMobile, trigger:'blur'}
                ],
            },
            editFormRules:{
                 email:[
                    { required: true, message:'请输入邮箱',trigger:'blur' },
                    { validator: checkEmail, trigger:'blur' }
                ],
                mobile:[
                    { required: true, message:'请输入手机',trigger:'blur' },
                    { validator: checkMobile, trigger:'blur'}
                ]
            }
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
        async getUserList(){
            const { data: res} = await this.$http.get('users',{ params: this.queryInfo });
            console.log(res);
            if(res.meta.status !== 200){
                this.$message.error(res.meta.msg);
            }else{
                // this.$message.success(res.meta.msg);
                this.userlist = res.data.users;
                this.total = res.data.total;
            }
        },
        // 监听 pagesize 的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getUserList();
        },
        // 监听 页码值 改变的 事件
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getUserList();
        },
        // 监听 switch 的开关
        async userStateChanged(userInfo){
            // console.log(userInfo);
            const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
            console.log(res);
            if(res.meta.status !== 200){
                userInfo.mg_state = !userInfo.mg_state;
                return this.$message.error(res.meta.msg)
            }else{
                return this.$message.success(res.meta.msg)
            }
        },
        // 搜索功能
        searchInfo(){
            this.getUserList()
        },
        // 添加用户功能
        addUser(){
            this.addDialogVisible = true;
        },
        // 监听添加用户对话框的关闭功能
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        addUserConfirm(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid){
                    return
                }else{
                    // 预校验通过,可以发起网络请求
                    const {data: res} = await this.$http.post('users',this.addForm);
                    console.log(res);
                    if(res.meta.status !== 201){
                        this.$message.error(res.meta.msg);
                    }else{
                        // 提示信息
                        this.$message.success(res.meta.msg);
                        // 关闭对话框
                        this.addDialogVisible = false;
                        // 刷新列表
                        this.getUserList();
                    }
                }
            })
        },
        // 修改信息对话框
        async showEditDialog(id){
            // console.log(id);
            const { data: res} = await this.$http.get('users/' + id);
            if(res.meta.status !== 200){
                this.$message.error(res.meta.msg);
            }else{
                // 请求成功
                this.editForm = res.data;
                console.log(this.editForm);
                this.$message.success(res.meta.msg);
            }
            this.editDialogVisible = true;
        },
        // 监听修改用户的对话框的重置功能
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid => {
                if(!valid){
                    return
                }else{
                    // 预校验通过,可以发起网络请求
                    const {data: res} = await this.$http.put('users/' + this.editForm.id,{
                        email: this.editForm.email,
                        mobile: this.editForm.mobile
                    });
                    if(res.meta.status !== 200){
                        this.$message.error(res.meta.msg);
                    }else{
                        this.$message.success(res.meta.msg);
                        this.editDialogVisible = false;
                        this.getUserList();
                    }
                }
            })
        },
        // 根即Id删除对应的信息
        async removeUserById(id){
            // 弹框询问用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)

            // 如果用户点击确认，返回值为字符串 confirm
            // 如果用户取消了删除，返回值为字符串 cancel
            // console.log(confirmResult);
            if(confirmResult !== 'confirm'){
                // 说明用户取消了删除
                return this.$message.info('已取消了删除');
            }else{
                console.log('确认要删除');
                // 发起删除请求
                const { data:res }  = await this.$http.delete('users/' + id);
                if(res.meta.status !== 200){
                    this.$message.error(res.meta.msg);
                }else{
                    this.$message.success(res.meta.msg);
                    // 刷新列表
                    this.getUserList();
                }
            }
        },
        // 分配角色按钮点击
        async setRole(userInfo){
            this.userInfo = userInfo;
            // 获取角色列表
            const { data:res } = await this.$http.get('roles');
            if(res.meta.status !== 200){
                // 获取失败
                return this.$message.error(res.meta.msg);
            }else{
                // 获取成功
                this.roleList = res.data;
                console.log(this.roleList);
            }
            this.setRoleDiaLogVisible = true;
        },
        // 点击按钮，分配角色
        async saveRoleInfo() {
            if(!this.selectedRoleId){
                return this.$message.error('请选择新的角色!');
            }else{
            const { data : res } = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
            console.log(res);
            if(res.meta.status !== 200){
                return this.$message.error(res.meta.msg);
            }else{
                // 分配角色成功，重新刷新列表
                this.$message.success(res.meta.msg);
                this.getUserList();
            }
            }

            this.setRoleDiaLogVisible = false
        },
        // 监听分配角色对话框的关闭事件
        setRoleDialogClosed(){
            this.selectedRoleId = '';
            this.userInfo = {};
        }
    }
}
</script>

<style lang="less" scoped>
    
</style>