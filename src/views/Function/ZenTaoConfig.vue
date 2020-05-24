<template>
<div class="page-container">
    <h1>专属于当前用户的禅道配置</h1>
    <h4 align="left">区别于全局参数中的配置，如果专属配置没有填写，则一切默认使用全局配置中的数据</h4>
    <el-form :model="dataForm" label-width="120px" :rules="dataFormRules" ref="dataForm" :size="size" label-position="left">
        <el-row>
            <el-col :span="22">
                <el-form-item label="专属禅道url" prop="zenTaoUrl">
                    <el-input v-model="dataForm.zenTaoUrl" auto-complete="off" placeholder="请输入禅道地址" maxlength="100" show-word-limit>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="2">
                <el-button :size="size" @click.native="submitZenTaoUrl">保存</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="22">
                <el-form-item label="专属禅道帐号" prop="zenTaoLoginUsername">
                    <el-input v-model="dataForm.zenTaoLoginUsername" auto-complete="off" type="text" placeholder="请输入禅道登录帐号" maxlength="100" show-word-limit />
                </el-form-item>
            </el-col>
            <el-col :span="2">
                <el-button :size="size" @click.native="submitZenTaoLoginUsername">保存</el-button>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="22">
                <el-form-item label="专属禅道密码" prop="zenTaoLoginPassword">
                    <el-input v-model="dataForm.zenTaoLoginPassword" auto-complete="off" type="password" placeholder="请输入禅道登录密码" maxlength="100" show-word-limit>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="2">
                <el-button :size="size" @click.native="submitZenTaoLoginPassword">保存</el-button>
            </el-col>
        </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button :size="size" type="danger" icon="fa fa-trash" @click.native="resetConfig">全部清除</el-button>
        <el-button :size="size" type="primary" @click.native="submitAllForm" :loading="editLoading">全部保存</el-button>
        <el-button :size="size" type="primary" @click.native="refresh" icon="fa fa-refresh" :loading="editLoading">刷新一下</el-button>
    </div>
</div>
</template>

<script>
import {
    format
} from "@/utils/datetime";
import * as defaultSettings from "../../configs/settings";
export default {
    components: {},
    data() {
        return {
            size: "small",
            filters: {
                label: ""
            },
            pageRequest: {
                pageNum: 1,
                pageSize: 10
            },
            pageResult: {},

            operation: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            dataFormRules: {},
            // 新增编辑界面数据
            dataForm: {
                zenTaoUrl: "",
                zenTaoLoginUsername: "",
                zenTaoLoginPassword: "",
            },
            dialogSize: defaultSettings.defaultDialogWidth,
            noDataInfo: defaultSettings.defaultNoDataMessage,
            zenTaoConfigKeys: {
                zenTaoUrlKey: "zen_tao_url",
                zenTaoLoginUsernameKey: "zen_tao_login_username",
                zenTaoLoginPasswordKey: "zen_tao_login_password"
            }
        };
    },
    methods: {
        // 显示编辑界面
        handleEdit: function (params) {
            this.editDialogVisible = true;
            this.operation = false;
            this.dataForm = Object.assign({}, params.row);
        },
        // 编辑
        submitAllForm: function () {
            this.$confirm("确认提交吗，个性化配置将会覆盖全局默认配置？", "提示", {}).then(() => {
                this.editLoading = true;
                this.submitZenTaoUrl();
                this.submitZenTaoLoginUsername();
                this.submitZenTaoLoginPassword();
                this.editLoading = false;
            });
        },
        /**
         * 提交url
         */
        submitZenTaoUrl: function () {
            this.postOneField(this.zenTaoConfigKeys.zenTaoUrlKey, this.dataForm.zenTaoUrl);
        },
        /**
         * 提交用户名
         */
        submitZenTaoLoginUsername: function () {
            this.postOneField(this.zenTaoConfigKeys.zenTaoLoginUsernameKey, this.dataForm.zenTaoLoginUsername);
        },

        /**
         * 提交密码
         */
        submitZenTaoLoginPassword: function () {
            this.postOneField(this.zenTaoConfigKeys.zenTaoLoginPasswordKey, this.dataForm.zenTaoLoginPassword);
        },
        refresh: function () {
            this.getCurrentZenTaoData();
        },
        // 时间格式化
        dateFormat: function (row, column, cellValue, index) {
            return format(row[column.property]);
        },
        /**提交其中一个属性 */
        postOneField: function (postKey, postValue) {
            this.editLoading = true;
            let postData = {
                "paramKey": postKey,
                "paramValue": postValue
            };

            this.$api.globalParam.save(postData).then(res => {
                if ((res.code == 200 || res.code == 0) && res.success) {
                    this.$message({
                        message: "操作成功",
                        type: "success"
                    });
                } else {
                    if (res.msg) {
                        this.$message({
                            message: "操作失败, " + res.msg,
                            type: "error"
                        });
                    } else {
                        this.$message({
                            message: "操作失败",
                            type: "error"
                        });
                    }
                }
                this.editLoading = false;
                this.getCurrentZenTaoData();
            });
        },
        getCurrentZenTaoData: function () {
            let data = [];
            this.$api.zenTaoConfig.getCurrentZenTaoData().then(res => {
                console.log(res);
                data = res.data;
                console.log(data);

                for (let index in data) {
                    let eachConfig = data[index];
                    console.log(eachConfig);

                    if (eachConfig.paramKey === this.zenTaoConfigKeys.zenTaoUrlKey) {
                        this.dataForm.zenTaoUrl = eachConfig.paramValue;
                    } else if (eachConfig.paramKey === this.zenTaoConfigKeys.zenTaoLoginUsernameKey) {
                        this.dataForm.zenTaoLoginUsername = eachConfig.paramValue;
                    } else if (eachConfig.paramKey === this.zenTaoConfigKeys.zenTaoLoginPasswordKey) {
                        this.dataForm.zenTaoLoginPassword = eachConfig.paramValue;
                    }
                }
            })
        },
        resetConfig: function () {
            this.dataForm = {};
            this.$message({
                message: "清除成功，但是需要全部保存一下才会生效!!!",
                type: "warning"
            })
        }
    },
    mounted() {
        this.getCurrentZenTaoData();
    }
}
</script>

<style scoped></style>
