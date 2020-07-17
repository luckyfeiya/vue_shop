<template>
    <div class="login_container">
        <div class="login_box">
            <!-- Logo区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- Form表单区域 -->
            <el-form ref="loginFormRef" class="formItem" :model="loginForm" :rules="loginFormRules">
                <el-form-item lable-width="0" prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
                </el-form-item>
                <el-form-item lable-width="0" prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-s-cooperation"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button> 
                    <el-button type="info" @click="resetLoginForm">重置</el-button> 
                </el-form-item>
            </el-form>
        </div>  
    </div>
</template>

<script>
export default {
    name:'Login',
    data() {
        return{
            loginForm : {
                username:'',
                password:''
            },
            loginFormRules:{
                // 验证用户名
                username:[
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码
                password:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            this.$refs.loginFormRef.validate( async valid => {
                if(!valid) return;
                const {data: res} = await this.$http.post('login',this.loginForm);
                console.log(res);
                if(res.meta.status !== 200){
                    return this.$message({
                        message:'登录失败!',
                        type: 'error'
                    })
                }else{
                    this.$message({
                        message: '登录成功!',
                        type: 'success'
                    })
                }
                window.sessionStorage.setItem('token',res.data.token);
                this.$router.push('/home');
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .login_container{
        background-color:#2b4b6b;
        height:100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        .avatar_box{
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            img{
                height: 100%;
                width: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
        .btns{
            display: flex;
            justify-content: flex-end;
        }
        .formItem{
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
        }
    }
</style>