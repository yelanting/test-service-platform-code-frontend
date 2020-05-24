<template>
    <div class="page-container">
        <!--工具栏-->
        <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
            <el-form :inline="true" :model="filters" :size="size">
                <el-form-item>
                    <el-input v-model="filters.cname" placeholder="策略名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-search" :label="$t('action.search')" perms="timerTask:timerTaskPolicy:view" type="primary" @click="findPage(null)" />
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-refresh" label="刷新" perms="timerTask:timerTaskPolicy:view" type="primary" @click="refresh" />
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="timerTask:timerTaskPolicy:add" type="primary" @click="handleAdd" />
                </el-form-item>
            </el-form>
        </div>
        <!--表格内容栏-->
        <kt-table permsEdit="timerTask:timerTaskPolicy:edit" permsDelete="timerTask:timerTaskPolicy:delete" :data="pageResult" :columns="columns" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete"></kt-table>
        <!--新增编辑界面-->
        <el-dialog :title="operation ? '新增' : '编辑'" :width="dialogSize" :visible.sync="editDialogVisible" :close-on-click-modal="false" :destroy-on-close="true">
            <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
                <el-form-item label="ID" prop="id" v-if="false">
                    <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="中文名" prop="cname">
                    <el-input v-model="dataForm.cname" auto-complete="off" placeholder="请输入策略中文名"></el-input>
                </el-form-item>
                <el-form-item label="英文名" prop="ename">
                    <el-input v-model="dataForm.ename" auto-complete="off" placeholder="请输入策略英文名"></el-input>
                </el-form-item>
                <el-form-item label="代码" prop="code">
                    <el-input v-model="dataForm.code" auto-complete="off" placeholder="请输入策略执行代码(一般为service.method方式)">
                    </el-input>
                </el-form-item>
                <el-form-item label="描述 " prop="description">
                    <el-input v-model="dataForm.description" auto-complete="off" type="textarea" placeholder="请输入描述">
                    </el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea" placeholder="请输入备注">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="editDialogVisible = false">{{
          $t("action.cancel")
        }}</el-button>
                <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">
                    {{ $t("action.submit") }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import { format } from "@/utils/datetime";
import * as defaultSettings from "../../configs/settings";
export default {
    components: {
        KtTable,
        KtButton
    },
    data () {
        return {
            size: "small",
            filters: {
                label: ""
            },
            columns: [
                { prop: "id", label: "ID", minWidth: 50 },
                { prop: "cname", label: "中文名", minWidth: 100 },
                { prop: "ename", label: "英文名", minWidth: 100 },
                { prop: "code", label: "执行代码", minWidth: 100 },
                { prop: "description", label: "描述", minWidth: 120 },
                { prop: "remarks", label: "备注", minWidth: 120 },
                { prop: "createBy", label: "创建人", minWidth: 100 },
                { prop: "lastUpdateBy", label: "修改人", minWidth: 100 },
                {
                    prop: "createTime",
                    label: "创建时间",
                    minWidth: 120,
                    formatter: this.dateFormat
                },
                {
                    prop: "lastUpdateTime",
                    label: "更新时间",
                    minWidth: 120,
                    formatter: this.dateFormat
                }
            ],
            pageRequest: { pageNum: 1, pageSize: 10 },
            pageResult: {},

            operation: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            dataFormRules: {
                cname: [{ required: true, message: "请输入中文名称", trigger: "blur" }],
                ename: [{ required: true, message: "请输入英文名", trigger: "blur" }],
                code: [{ required: true, message: "请输入待执行代码", trigger: "blur" }]
            },
            // 新增编辑界面数据
            dataForm: {
                id: 0,
                cname: "",
                ename: "",
                code: "",
                description: "",
                remarks: ""
            },
            dialogSize: defaultSettings.defaultDialogWidth,
        };
    },
    methods: {
        // 获取分页数据
        findPage: function (data) {
            if (data !== null) {
                this.pageRequest = data.pageRequest;
            }
            this.pageRequest.params = [
                { name: "cname", value: this.filters.cname }
            ];
            this.$api.timerTaskPolicy
                .findPage(this.pageRequest)
                .then(res => {
                    this.pageResult = res.data;
                })
                .then(data != null ? data.callback : "");
        },
        // 批量删除
        handleDelete: function (data) {
            this.$api.timerTaskPolicy
                .batchDelete(data.params)
                .then(data != null ? data.callback : "");
        },
        // 显示新增界面
        handleAdd: function () {
            this.editDialogVisible = true;
            this.operation = true;
            this.dataForm = {
                id: 0,
                cname: "",
                ename: "",
                code: "",
                description: "",
                remarks: ""
            };
        },
        // 显示编辑界面
        handleEdit: function (params) {
            this.editDialogVisible = true;
            this.operation = false;
            this.dataForm = Object.assign({}, params.row);
        },
        // 编辑
        submitForm: function () {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    this.$confirm("确认提交吗？", "提示", {}).then(() => {
                        this.editLoading = true;
                        let params = Object.assign({}, this.dataForm);
                        this.$api.timerTaskPolicy.save(params).then(res => {
                            if (res.code == 200 || res.code == 0) {
                                this.$message({ message: "操作成功", type: "success" });
                            } else {
                                this.$message({
                                    message: "操作失败, " + res.msg,
                                    type: "error"
                                });
                            }
                            this.editLoading = false;
                            this.$refs["dataForm"].resetFields();
                            this.editDialogVisible = false;
                            this.findPage(null);
                        });
                    });
                }
            });
        },
        // 时间格式化
        dateFormat: function (row, column, cellValue, index) {
            return format(row[column.property]);
        },
        /**刷新 */
        refresh: function () {
            this.filters.cname = null;
            this.findPage(null);
        },
    },
    mounted () { }
};
</script>

<style scoped></style>
