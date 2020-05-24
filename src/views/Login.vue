<template>
<div class="page-container">
    <el-form :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <span class="tool-bar">
            <!-- 主题切换 -->
            <theme-picker style="float:right;" class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
        </span>
        <h2 class="title" style="padding-left:22px;">系统登录</h2>
        <el-form-item prop="account">
            <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="帐号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-col :span="12">
                <el-form-item prop="captcha">
                    <el-input type="test" v-model="loginForm.captcha" auto-complete="off" placeholder="验证码, 单击图片刷新" style="width: 100%;">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col class="line" :span="1">&nbsp;</el-col>
            <el-col :span="11">
                <el-form-item>
                    <img style="width: 100%;" class="pointer" :src="loginForm.src" @click="refreshCaptcha" />
                </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:48%;" @click.native.prevent="reset">重 置</el-button>
            <el-button type="primary" style="width:48%;" @click.native.prevent="login" :loading="loading">登 录
            </el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click="handleRegister">我要注册</el-button>
        </el-form-item>
    </el-form>

    <el-dialog title="新用户注册" :width="dialogSize" :visible.sync="registerPage" :destroy-on-close="destroyOnClose">
        <el-form :model="registerForm" label-width="80px" :rules="registerFormRules" ref="registerForm">
            <el-form-item label="名称" prop="name">
                <el-input v-model="registerForm.name" auto-complete="off" placeholder="请输入帐号(用于登录)" maxlength="25" minlength="1" show-word-limit tabindex="1"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
                <el-input v-model="registerForm.nickName" auto-complete="off" placeholder="请输入昵称(用于展示)" tabindex="2"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="请输入密码" show-password tabindex="3"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="registerForm.confirmPassword" auto-complete="off" placeholder="请输入确认密码" tabindex="4" show-password></el-input>
            </el-form-item>
            <el-form-item label="邮箱 " prop="email">
                <el-input v-model="registerForm.email" auto-complete="off" placeholder="请输入邮箱" tabindex="5">
                </el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="registerForm.mobile" auto-complete="off" placeholder="请输入手机" tabindex="6">
                </el-input>
            </el-form-item>
            <el-form-item label="选择角色">
                <el-select v-model="roleIds" placeholder="请选择角色" @change="chooseRoles" multiple>
                    <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="registerPage = false">{{
          $t("action.cancel")
        }}</el-button>
            <el-button type="primary" @click.native="register" :loading="registerLoading" @click="register" tabindex="7">{{ $t("action.submit") }}</el-button>
        </div>
    </el-dialog>

    <div class="footer">
        <el-footer>&copy;测试服务技术有限公司 2020版权所有</el-footer>
    </div>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import Cookies from "js-cookie";
import ThemePicker from "@/components/ThemePicker";
import * as defaultSettings from "../configs/settings";

export default {
    name: "Login",
    components: {
        ThemePicker
    },
    data() {
        return {
            loading: false,
            loginForm: {
                account: "admin",
                password: "admin",
                captcha: "",
                src: ""
            },
            registerForm: {
                name: "",
                nickName: "",
                password: "",
                confirmPassword: "",
                email: "",
                mobile: "",
                roleIds: this.roleIds
            },
            fieldRules: {
                account: [{
                    required: true,
                    message: "请输入帐号",
                    trigger: "blur"
                }],
                password: [{
                    required: true,
                    message: "请输入密码",
                    trigger: "blur"
                }],
                captcha: [{
                    required: true,
                    message: "请输入验证码",
                    trigger: "blur"
                }]
            },
            registerFormRules: {
                name: [{
                    required: true,
                    message: "请输入帐号",
                    trigger: "blur"
                }],
                nickName: [{
                    required: true,
                    message: "请输入昵称",
                    trigger: "blur"
                }],
                password: [{
                    required: true,
                    message: "请输入密码",
                    trigger: "blur"
                }],
                confirmPassword: [{
                    required: true,
                    message: "请输入确认密码",
                    trigger: "blur"
                }],
                email: [{
                    required: true,
                    message: "请输入邮箱",
                    trigger: "blur"
                }],
                mobile: [{
                    required: true,
                    message: "请输入手机",
                    trigger: "blur"
                }],
                roleIds: [{
                    required: true,
                    message: "请至少选择一个角色",
                    trigger: "change"
                }]
            },
            checked: true,
            //是否注册页面
            registerLoading: false,
            registerPage: false,
            dialogSize: defaultSettings.defaultDialogWidth,
            destroyOnClose: true,
            closeOnClickModal: true,
            //角色列表
            roleList: [],
            roleIds: []
        };
    },
    methods: {
        login() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    let userInfo = {
                        account: this.loginForm.account,
                        password: this.loginForm.password,
                        captcha: this.loginForm.captcha
                    };
                    this.$api.login
                        .login(userInfo)
                        .then(res => {
                            if (res.msg || !res.success) {
                                this.$message({
                                    message: res.msg,
                                    type: "error"
                                });
                            } else {
                                Cookies.set("token", res.data.token); // 放置token到Cookie
                                sessionStorage.setItem("user", userInfo.account); // 保存用户到本地会话
                                this.$store.commit("menuRouteLoaded", false); // 要求重新加载导航菜单
                                this.$router.push("/"); // 登录成功，跳转到主页
                            }
                            this.loading = false;
                        })
                        .catch(res => {
                            this.loading = false;
                            this.$message({
                                message: res.message,
                                type: "error"
                            });
                        });
                }
            });

        },
        refreshCaptcha: function () {
            this.loginForm.src =
                this.global.baseUrl + "/captcha.jpg?t=" + new Date().getTime();
        },
        reset() {
            this.$refs.loginForm.resetFields();
        },
        // 切换主题
        onThemeChange: function (themeColor) {
            this.$store.commit("setThemeColor", themeColor);
        },
        handleRegister: function () {
            this.registerPage = true;
            this.getRoleList();
        },
        register: function () {
            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    this.$confirm("确认提交吗？", "提示", {}).then(() => {
                        this.registerLoading = true;
                        let params = Object.assign({}, this.registerForm);
                        console.log(params);

                        this.$api.register.register(params).then(res => {
                            this.registerLoading = false;
                            if ((res.code == 200 || res.code == 0) && res.success) {
                                this.$message({
                                    message: "操作成功",
                                    type: "success"
                                });
                                this.$refs["registerForm"].resetFields();
                                this.registerPage = false;
                            } else {
                                this.$message({
                                    message: "操作失败, " + res.msg,
                                    type: "error"
                                });
                            }
                        });
                    });
                }
            });
        },
        async getRoleList() {
            let roleListData = await this.$api.role.findAll();
            this.roleList = roleListData.data;
            console.log(this.roleList);
        },
        chooseRoles: function (val) {
            let selected = {};
            // selected = this.roleList.find((item) =>{
            //   return item.id === val;
            // })

            console.log(val);
            this.roleIds = val;
            console.log(this.roleIds);
            this.registerForm.roleIds = this.roleIds;
            console.log(this.registerForm);
        }
    },
    mounted() {
        this.refreshCaptcha();
    },
    computed: {
        ...mapState({
            themeColor: state => state.app.themeColor
        })
    }
};
</script>

<style lang="scss" scoped>
.login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    .title {
        margin: 0px auto 30px auto;
        text-align: center;
        color: #505458;
    }

    .remember {
        margin: 0px 0px 35px 0px;
    }
}

.footer .el-footer {
    position: absolute;
    bottom: 0px;
    text-align: center;
    line-height: 60px;
    justify-content: center;
    // background-color: #eeeeee;
    width: 100%;
}
</style>
