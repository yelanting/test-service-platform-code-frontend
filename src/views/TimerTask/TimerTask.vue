<template>
<div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
        <el-form :inline="true" :model="filters" :size="size">
            <el-form-item>
                <el-input v-model="filters.label" placeholder="请输入任务名称查询"></el-input>
            </el-form-item>
            <el-form-item>
                <kt-button icon="fa fa-search" :label="$t('action.search')" perms="timerTask:timerTask:view" type="primary" @click="findPage(null)" />
            </el-form-item>
            <el-form-item>
                <kt-button icon="fa fa-refresh" label="刷新" perms="timerTask:timerTask:view" type="primary" @click="refresh" />
            </el-form-item>
            <el-form-item>
                <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="timerTask:timerTask:add" type="primary" @click="handleAdd" />
            </el-form-item>
        </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table permsEdit="timerTask:timerTask:edit" permsDelete="timerTask:timerTask:delete" :data="pageResult" :columns="columns" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" :extendsOps="extendsOps" @handleView="handleView" @handleConfig="handleConfig">
    </kt-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" :width="dialogSize" :visible.sync="editDialogVisible" :close-on-click-modal="false" :destroy-on-close="true">
        <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
            <el-form-item label="ID" prop="id" v-if="false">
                <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="任务名" prop="taskName">
                <el-input v-model="dataForm.taskName" placeholder="请输入定时任务名称" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="任务组" prop="taskGroup">
                <el-input v-model="dataForm.taskGroup" placeholder="请输入任务组名称" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="使用策略" prop="policyId">
                <el-select v-model="dataForm.policyId" placeholder="选择策略" style="display: block;">
                    <el-option v-for="item in timerTaskPolicyList" :key="item.id" :label="item.cname" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item border label="任务状态" prop="closed">
                <el-radio-group v-model="dataForm.closed" size="medium">
                    <el-radio border label="false">开启
                    </el-radio>
                    <el-radio borrder label="true">关闭
                    </el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="定时配置" prop="config" title="Cron表达式类型的定时配置">
                <el-input v-model="dataForm.config" auto-complete="off" type="text"></el-input>
            </el-form-item>
            <el-form-item label="描述 " prop="description">
                <el-input v-model="dataForm.description" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
                <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
            <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">
                {{$t('action.submit')}}</el-button>
        </div>
    </el-dialog>

    <!--/*定时任务配置 */-->
    <el-dialog title="定时任务配置" :width="dialogSize" :visible.sync="configDialogVisible" :close-on-click-modal="false" :destroy-on-close="true">
        <el-form :model="configForm" label-width="80px" :rules="configFormRules" ref="configForm" :size="size" border>
            <el-form-item label="是否开启:">
                <el-switch v-model="configForm.enableTask" active-text="启用" inactive-text="停用">
                </el-switch>
            </el-form-item>
            <el-form-item label="定时配置:">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="秒级配置" prop="second">
                            <el-input v-model="configForm.second" placeholder="请输入秒配置" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="分级配置" prop="minute">
                            <el-input v-model="configForm.minute" placeholder="请输入分配置" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="时级配置" prop="hour">
                            <el-input v-model="configForm.hour" placeholder="请输入时配置" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="日/月" prop="dayOfMonth">
                            <el-input v-model="configForm.dayOfMonth" placeholder="请输入日(日/月)配置" auto-complete="off" title="日或者某个月的哪些天"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">

                        <el-form-item label="月级配置" prop="month">
                            <el-input v-model="configForm.month" placeholder="请输入月配置" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">

                        <el-form-item label="天/星期" prop="dayOfWeek">
                            <el-input v-model="configForm.dayOfWeek" placeholder="请输入周配置" auto-complete="off" title="每周的哪些天"></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="年级配置" prop="year">
                            <el-input v-model="configForm.year" placeholder="请输入年配置" auto-complete="off"></el-input>
                        </el-form-item>

                    </el-col>
                </el-row>
            </el-form-item>

            <el-form-item label="最终配置">
                <el-input v-model="thusTotalConfig" auto-complete="off" disabled>{{thusTotalConfig}}</el-input>
            </el-form-item>
        </el-form>
        <div class="tips">
            <div align="left">
                <p>配置参考:&nbsp;&nbsp;<a href="http://cron.qqe2.com/" target="blank">去参考表达式配置</a></p>
            </div>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button :size="size" @click.native="configDialogVisible = false">{{$t('action.cancel')}}</el-button>
            <el-button :size="size" type="primary" @click.native="configSubmitForm" :loading="editLoading">
                {{$t('action.submit')}}</el-button>
        </div>

    </el-dialog>
</div>
</template>

<script>
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import {
    format
} from "@/utils/datetime";
import * as defaultSettings from "../../configs/settings";

export default {
    components: {
        KtTable,
        KtButton
    },
    data() {
        return {
            size: 'small',
            filters: {
                label: ''
            },
            extendsOps: [{
                    label: "查看",
                    perms: "timerTask:timerTask:view",
                    handleEvent: "handleView",
                    type: "normal",
                    icon: "fa fa-eye"
                },
                {
                    label: "配置",
                    perms: "timerTask:timerTask:view",
                    handleEvent: "handleConfig",
                    type: "normal",
                    icon: "fa fa-cog"
                }
            ],
            columns: [{
                    prop: "id",
                    label: "ID",
                    minWidth: 50
                },
                {
                    prop: "taskName",
                    label: "定时任务名称",
                    minWidth: 100
                },
                {
                    prop: "taskGroup",
                    label: "任务组",
                    minWidth: 100
                },
                {
                    prop: "policyId",
                    label: "策略Id",
                    minWidth: 100
                },
                {
                    prop: "config",
                    label: "定时配置",
                    minWidth: 100
                },
                {
                    prop: "closed",
                    label: "当前状态",
                    minWidth: 100,
                    formatter: this.closedStatusFormat
                },
                {
                    prop: "otherParams",
                    label: "其他参数",
                    minWidth: 100
                },
                {
                    prop: "description",
                    label: "描述",
                    minWidth: 120
                },
                {
                    prop: "remarks",
                    label: "备注",
                    minWidth: 120
                },
                {
                    prop: "createBy",
                    label: "创建人",
                    minWidth: 100
                },
                {
                    prop: "createTime",
                    label: "创建时间",
                    minWidth: 120,
                    formatter: this.dateFormat
                },
                {
                    prop: "lastUpdateBy",
                    label: "更新人",
                    minWidth: 100
                },
                {
                    prop: "lastUpdateTime",
                    label: "更新时间",
                    minWidth: 120,
                    formatter: this.dateFormat
                }
            ],
            pageRequest: {
                pageNum: 1,
                pageSize: 10
            },
            pageResult: {},
            operation: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            configDialogVisible: false,
            editLoading: false,
            dataFormRules: {
                taskName: [{
                    required: true,
                    message: '请输入定时任务名称',
                    trigger: 'blur'
                }]
            },
            configFormRules: {

            },
            // 新增编辑界面数据
            dataForm: {
                id: 0,
                taskName: '',
                taskGroup: "",
                closed: false,
                config: "",
                policyId: '',
                description: '',
                remarks: ''
            },
            configForm: {
                enableTask: true,
                second: 0,
                minute: "*",
                hour: "4",
                dayOfMonth: "*",
                month: "*",
                dayOfWeek: "?",
                year: "*",
                config: ""
            },
            /**应用列表 */
            timerTaskPolicyList: [],
            currentFilterpolicyId: '',
            dialogSize: defaultSettings.defaultDialogWidth
        }
    },
    methods: {
        // 获取分页数据
        findPage: function (data) {
            if (data !== null) {
                this.pageRequest = data.pageRequest
            }
            this.pageRequest.params = [{
                name: 'label',
                value: this.filters.label
            }];

            //清空timerTaskPolicy
            this.currentFilterpolicyId = "";

            this.$api.timerTask.findPage(this.pageRequest).then((res) => {
                this.pageResult = res.data
            }).then(data != null ? data.callback : '')
        },
        // 批量删除
        handleDelete: function (data) {
            this.$api.timerTask.batchDelete(data.params).then(data != null ? data.callback : '')
        },
        // 显示新增界面
        handleAdd: function () {
            this.editDialogVisible = true;
            this.operation = true;
            this.getTimerTaskPolicyList();
            this.dataForm = {
                id: 0,
                policyId: '',
                taskName: '',
                description: '',
                remarks: ''
            }
        },
        // 显示编辑界面
        handleEdit: function (params) {
            this.editDialogVisible = true
            this.operation = false;
            this.dataForm = Object.assign({}, params.row)
        },
        // 编辑
        submitForm: function () {
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        let params = Object.assign({}, this.dataForm)
                        this.$api.timerTask.save(params).then((res) => {
                            if (res.code == 200 || res.code == 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                })
                            } else {
                                this.$message({
                                    message: '操作失败, ' + res.msg,
                                    type: 'error'
                                })
                            }
                            this.editLoading = false
                            this.$refs['dataForm'].resetFields()
                            this.editDialogVisible = false
                            this.findPage(null)
                        })
                    })
                }
            })
        },
        configSubmitForm: function () {

            console.log(this.configForm);

            this.$refs.configForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        let params = Object.assign({}, this.configForm)
                        this.$api.timerTask.save(params).then((res) => {
                            if (res.code == 200 || res.code == 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                })
                            } else {
                                this.$message({
                                    message: '操作失败, ' + res.msg,
                                    type: 'error'
                                })
                            }
                            this.editLoading = false
                            this.$refs['configForm'].resetFields()
                            this.editDialogVisible = false
                            this.findPage(null)
                        })
                    })
                }
            })
        },
        // 时间格式化
        dateFormat: function (row, column, cellValue, index) {
            return format(row[column.property])
        },
        //状态格式化
        closedStatusFormat: function (row, column, cellValue, index) {
            if (row.closed) {
                return "关闭";
            } else {
                return "开启";
            }
        },

        async getTimerTaskPolicyList() {
            let timerTaskPolicyListData = await this.$api.timerTaskPolicy.findAll();
            this.timerTaskPolicyList = timerTaskPolicyListData.data;
        },
        /**刷新 */
        refresh: function () {
            this.filters.label = "";
            this.findPage(null);
        },
        handleView: function (index, row) {
            console.log("进入handleView了");
            console.log(index)
            console.log(row);
            this.$message({
                message: '查看详情',
                type: 'success'
            });
        },
        handleConfig: function (index, row) {
            this.operation = false;
            this.editDialogVisible = false;
            this.configDialogVisible = true;
            this.$message({
                message: '配置定时任务',
                type: 'success'
            });
        },
        seperateConfig: function (configExpress) {
            let configSep = configExpress.split(" ");
            let configSepLength = configSep.length;

            if (configSep.length < 7) {
                for (let i = configSepLength; i < 7; i++) {
                    this.totalConfig += "*";
                    configSep.push("*");
                }
            }
            [this.configForm.second, this.config.minute, this.config.hour, config.dayOfMonth, this.configForm.month, this.configForm.dayOfWeek, this.configForm.year] = configSep;
            // console.log(this.configForm);
        },
    },
    computed: {
        thusTotalConfig: function () {
            console.log(this.configForm);
            let keys = Object.keys(this.configForm);
            let totalConfig = "";
            for (let index in keys) {

                console.log(index, keys[index]);
                if (keys[index] == "enableTask") {
                    continue;
                }

                totalConfig += this.configForm[keys[index]] + " ";
            }
            console.log(totalConfig);

            this.configForm.config = totalConfig.trim();
            return totalConfig.trim();
        }
    }

}
</script>

<style scoped>
</style>
