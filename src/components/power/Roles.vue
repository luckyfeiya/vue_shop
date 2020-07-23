<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addUser">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row :class="['bdbottom',i1===0 ? 'bdtop' : '','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环 嵌套渲染二级权限 -->
                                <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>

                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserInfo(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色对话框 -->
        <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
        >
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUserConfirm">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 编辑角色对话框 -->
        <el-dialog
        title="编辑角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
        >
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserConfirm">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 分配权限对话框 -->
        <el-dialog
        title="分配权限对话框"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed()"
        >
        <el-tree show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defKeys" :data="rightList" ref="treeRef" :props="treeProps"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights()">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'Roles',
    data(){
        return{
            roleList:[],
            // 控制添加角色的显示与隐藏
            addDialogVisible: false,
            addForm:{
                roleName:'',
                roleDesc:''
            },
            // 控制编辑角色对话框的显示与隐藏
            editDialogVisible: false,
            editForm:{},
            addFormRules:{
                roleName:[
                    { required: true, message:'请输入角色名称',trigger:'blur' },
                    { min:3,max:10,message:'用户名的长度在3~10个字符之间',trigger:'blur'}
                ],
                roleDesc:[
                    { required: true, message:'请输入角色描述',trigger:'blur' },
                    { min:2,max:10,message:'用户名的长度在2~10个字符之间',trigger:'blur'}
                ]
            },
            editFormRules:{
                roleName:[
                    { required: true, message:'请输入角色名称',trigger:'blur' },
                    { min:3,max:10,message:'用户名的长度在3~10个字符之间',trigger:'blur'}
                ],
                roleDesc:[
                    { required: true, message:'请输入角色描述',trigger:'blur' },
                    { min:2,max:10,message:'用户名的长度在2~10个字符之间',trigger:'blur'}
                ]
            },
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible:false,
            // 权限数组
            rightList:[],
            // 树形控件的绑定对象
            treeProps:{
                label:'authName',
                children:'children'
            },
            // 默认要勾选的三级id
            defKeys:[],
            // 保存当点击分配权限按钮时获得的角色id
            roleId:''
        }
    },
    created(){
        this.getRoleList();
    },
    methods:{
        async getRoleList(){
            const { data: res } = await this.$http.get('roles');
            if(res.meta.status !== 200){
                return this.$message.error(res.meta.msg)
            }else{
                // 获取列表成功
                this.roleList = res.data;
            }
            console.log(res.data);
        },
        // 添加角色功能
        addUser(){
            this.addDialogVisible = true;
        },
        // 关闭添加角色对话框
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        // 确定添加角色按钮
        addUserConfirm(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid){
                    return
                }else{
                    // 预校验通过,可以发起网络请求
                    const {data: res} = await this.$http.post('roles',this.addForm);
                    console.log(res);
                    if(res.meta.status !== 201){
                        // 说明创建失败了
                        return this.$message.error(res.meta.msg);
                    }else{
                        // 创建角色成功
                        // 关闭对话框
                        this.addDialogVisible = false;
                        // 刷新列表
                        this.getRoleList();
                    }
                }
            })
        },
        // 编辑角色
        async editUserInfo(id){
            const {data: res} = await this.$http.get('roles/'+ id);
            if(res.meta.status !== 200){
                return this.$message.error(res.meta.msg);
            }else{
                // 获取成功
                this.editForm = res.data;
            }
            this.editDialogVisible = true;
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        editUserConfirm(){
            this.$refs.editFormRef.validate( async valid => {
                if(!valid){
                    return
                }else{
                    // 预校验通过,可以发起网络请求
                    const {data: res} = await this.$http.put('roles/' + this.editForm.roleId,{
                        roleName:this.editForm.roleName,
                        roleDesc:this.editForm.roleDesc
                    });
                    if(res.meta.status !== 200){
                        this.$message.error(res.meta.msg);
                    }else{
                        this.editDialogVisible = false;
                        this.getRoleList();
                    }
                }
            });
        },
        // 根据id删除的功能
        async removeRoleById(id){
            // 弹框询问用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)
            if(confirmResult !== 'confirm'){
                // 说明用户取消了删除
                return this.$message.info('已取消了删除');
            }else{
                // 发起删除请求
                const { data:res }  = await this.$http.delete('roles/' + id);
                if(res.meta.status !== 200){
                    this.$message.error(res.meta.msg);
                }else{
                    this.$message.success(res.meta.msg);
                    // 刷新列表
                    this.getRoleList();
                }
            }
        },
        // 根据权限Id是否要删除权限
        async removeRightById(role,rightId) {
            // 弹框提示是否要删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)

            if(confirmResult !== 'confirm'){
                return this.$message.info('取消了删除');
            }else{
                const { data:res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                if(res.meta.status !== 200){
                    // 说明删除失败了
                    this.$message.error(res.meta.msg);
                }else{
                    // 说明删除成功了
                    // 刷新一下列表
                    role.children = res.data;
                }
            }
        },
        // 分配权限对话框
        async showSetRightDialog(role){
            const {data:res} = await this.$http.get('rights/tree');
            if(res.meta.status !== 200){
                // 获取权限数据失败
                return this.$message.error(res.meta.msg);
            }else{
                // 获取权限数据成功
                // 把获取到的权限数据保存到data数据中去
                this.rightList = res.data;
            }
            this.roleId = role.id;
            this.getLeafKeys(role,this.defKeys);
            this.setRightDialogVisible = true;
        },
        // 通过递归的方式来获取三级权限
        getLeafKeys(node,arr){
            if(!node.children){
                // 说明这是三级权限
                return arr.push(node.id);
            }else{
                // 说明这不是三级权限，需要继续进行递归操作
                node.children.forEach(item => {
                    this.getLeafKeys(item,arr);
                })
            }
        },
        // 关闭分配权限对话框,让defKeys数组重置
        setRightDialogClosed(){
            this.defKeys = [];
        },
        // 点击为角色分配权限
        async allotRights() {
            const keys =[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr = keys.join(',');
            // console.log(idStr);
            // console.log(this.roleId);
            // 发起网络请求
            const { data:res } = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});

            if(res.meta.status !== 200){
                // 说明更新失败
                return this.$message.error(res.meta.msg);
            }else{
                // 更新成功
                this.$message.success(res.meta.msg);
                this.getRoleList();
            }

            this.setRightDialogVisible = false;
        }
    }
}
</script>

<style lang="less" scoped>
   .el-tag{
       margin: 7px ;
   } 
   .bdtop{
       border-top: 1px solid #eee;
   }
   .bdbottom{
       border-bottom: 1px solid #eee;
   }
   .vcenter{
       display: flex;
       align-items: center;
   }
</style>