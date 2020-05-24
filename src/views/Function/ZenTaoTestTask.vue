<template>
<div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
        <el-form :inline="true" :model="filters" :size="size">
            <el-form-item>
                <el-input v-model="filters.label" placeholder="测试单描述"></el-input>
            </el-form-item>
            <el-form-item>
                <kt-button icon="fa fa-search" :label="$t('action.search')" perms="function:zenTaoTestTask:view" type="primary" @click="findPage(null)" />
            </el-form-item>
            <el-form-item>
                <kt-button icon="fa fa-refresh" label="刷新全部" perms="function:zenTaoTestTask:view" type="primary" @click="refresh" />
            </el-form-item>
            <el-form-item>
                <kt-button icon="fa fa-search" label="查看本人" perms="function:zenTaoTestTask:view" type="primary" @click="filterCurrentUser" title="过滤当前用户创建或更新" />
            </el-form-item>
            <el-form-item>
                <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="function:zenTaoTestTask:add" type="primary" @click="handleAdd" />
            </el-form-item>
        </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table permsEdit="function:zenTaoTestTask:edit" permsDelete="function:zenTaoTestTask:delete" :data="pageResult" :columns="columns" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
    </kt-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation ? '新增' : '编辑'" :width="dialogSize" :visible.sync="editDialogVisible" :close-on-click-modal="false" :destroy-on-close="true">
        <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
            <el-form-item label="ID" prop="id" v-if="false">
                <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="测试单ID" prop="zenTaoTestTaskId">
                <el-input v-model="dataForm.zenTaoTestTaskId" auto-complete="off" placeholder="在禅道中的测试单id">
                </el-input>
            </el-form-item>
            <el-form-item label="描述 " prop="description">
                <el-input v-model="dataForm.description" auto-complete="off" type="textarea" placeholder=该测试单的描述，方便查找></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
                <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea" placeholder="请输入测试单备注">
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
            size: "small",
            filters: {
                label: ""
            },
            columns: [{
                    prop: "id",
                    label: "ID",
                    minWidth: 50
                },
                {
                    prop: "zenTaoTestTaskId",
                    label: "测试单ID",
                    minWidth: 100
                },
                {
                    prop: "zenTaoTestTask.name",
                    label: "测试单名称",
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
            editLoading: false,
            dataFormRules: {
                zenTaoTestTaskId: [{
                    required: true,
                    message: "请输入测试单id",
                    trigger: "blur"
                }],
            },
            // 新增编辑界面数据
            dataForm: {
                id: 0,
                zenTaoTestTaskId: "",
                description: "",
                remarks: ""
            },
            dialogSize: defaultSettings.defaultDialogWidth,
            noDataInfo: defaultSettings.defaultNoDataMessage,
        };
    },
    methods: {
        // 获取分页数据
        findPage: function (data) {
            if (data !== null) {
                this.pageRequest = data.pageRequest;
            }
            this.pageRequest.params = [{
                name: "label",
                value: this.filters.label
            }];
            this.$api.zenTaoTestTask
                .findPage(this.pageRequest)
                .then(res => {
                    this.editLoading = false;
                    let success = this.$util.responseUtil.parseErrorCode(res);
                    if (success) {
                        this.pageResult = res.data;
                    } else {
                        this.$message({
                            message: this.$util.responseUtil.getErrorMsg(res),
                            type: "error"
                        });
                    }
                })
                .then(data != null ? data.callback : "");
        },
        // 批量删除
        handleDelete: function (data) {
            this.$api.zenTaoTestTask
                .batchDelete(data.params)
                .then(data != null ? data.callback : "");
        },
        // 显示新增界面
        handleAdd: function () {
            this.editDialogVisible = true;
            this.operation = true;
            this.dataForm = {
                id: 0,
                zenTaoTestTaskId: "",
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
                        this.$api.zenTaoTestTask.save(params).then(res => {
                            if (res.code == 200 || res.code == 0) {
                                this.$message({
                                    message: "操作成功",
                                    type: "success"
                                });
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
        refresh: function () {
            this.filters.label = "";
            this.findPage(null);
        },
        filterCurrentUser: function () {
            this.filters.label = "";
            this.pageRequest.params = [{
                name: "filterCurrentUser",
                value: "filterCurrentUser"
            }];
            this.$api.zenTaoTestTask
                .findPage(this.pageRequest)
                .then(res => {
                    this.editLoading = false;
                    let success = this.$util.responseUtil.parseErrorCode(res);
                    if (success) {
                        this.pageResult = res.data;
                    } else {
                        this.$message({
                            message: this.$util.responseUtil.getErrorMsg(res),
                            type: "error"
                        });
                    }
                })
        },
        // 时间格式化
        dateFormat: function (row, column, cellValue, index) {
            return format(row[column.property]);
        }
    },
    mounted() {}
};
</script>

<style scoped></style>
