<template>
<div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
        <el-form :inline="true" :model="filters" :size="size">
            <!-- <el-form-item>
                    <el-input v-model="filters.paramComment" placeholder="参数描述"></el-input>
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-search" :label="$t('action.search')" perms="function:zenTaoTestCase:view"
                        type="primary" @click="findPage(null)" />
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-refresh" label="刷新" perms="function:zenTaoTestCase:view" type="primary"
                        @click="refresh" />
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="function:zenTaoTestCase:add" type="primary"
                        @click="handleAdd" />
                </el-form-item> -->

            <el-form-item>
                <el-select v-model="currentFilterTestTaskId" placeholder="根据测试单过滤测试用例" @change="filterTestCasesByTestTask" filterable remote :remote-method="getTestTaskList">
                    <el-option v-for="item in testTaskList" :key="item.id" :label="item.zenTaoTestTask.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table permsEdit="function:zenTaoTestCase:edit" permsDelete="function:zenTaoTestCase:delete" :data="pageResult" :columns="columns" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" :showOperation="showOperation">
    </kt-table>
    <!--新增编辑界面-->
    <!-- <el-dialog :title="operation ? '新增' : '编辑'" :width="dialogSize" :visible.sync="editDialogVisible"
            :close-on-click-modal="false" :destroy-on-close="true">
            <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
                <el-form-item label="ID" prop="id" v-if="false">
                    <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="参数key" prop="paramKey">
                    <el-input v-model="dataForm.paramKey" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="参数值" prop="paramValue">
                    <el-input v-model="dataForm.paramValue" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="参数注释" prop="paramComment">
                    <el-input v-model="dataForm.paramComment" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述 " prop="description">
                    <el-input v-model="dataForm.description" auto-complete="off" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="editDialogVisible = false">{{
          $t("action.cancel")
        }}</el-button>
                <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">
                    {{ $t("action.submit") }}</el-button>
            </div>
        </el-dialog> -->
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
                    label: "序号",
                    minWidth: 50
                },
                {
                    prop: "case",
                    label: "用例ID",
                    minWidth: 50
                },
                {
                    prop: "title",
                    label: "用例标题",
                    minWidth: 100
                },
                {
                    prop: "precondition",
                    label: "前置步骤",
                    minWidth: 100
                },
                {
                    prop: "pri",
                    label: "优先级",
                    minWidth: 80
                },
            ],
            pageRequest: {
                pageNum: 1,
                pageSize: 10
            },
            pageResult: {},

            operation: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            // dataFormRules: {
            //     paramKey: [{ required: true, message: "请输入参数key", trigger: "blur" }],
            //     paramValue: [{ required: true, message: "请输入参数值", trigger: "blur" }]
            // },
            // 新增编辑界面数据
            // dataForm: {
            //     id: 0,
            //     paramKey: "",
            //     paramValue: "",
            //     paramComment: "",
            //     description: "",
            //     remarks: ""
            // },
            dialogSize: defaultSettings.defaultDialogWidth,
            noDataInfo: defaultSettings.defaultNoDataMessage,
            testTaskList: [],
            currentFilterTestTaskId: '',
            showOperation: false
        };
    },
    methods: {
        // 获取分页数据
        findPage: function (data) {
            if (data !== null) {
                this.pageRequest = data.pageRequest;
            }
            this.pageRequest.params = [];
            this.$api.zenTaoTestCase
                .findPage(this.pageRequest)
                .then(res => {
                    this.pageResult = res.data;
                })
                .then(data != null ? data.callback : "");
        },
        //批量删除
        handleDelete: function (data) {
            this.$api.zenTaoTestCase
                .batchDelete(data.params)
                .then(data != null ? data.callback : "");
        },
        //显示新增界面
        handleAdd: function () {
            this.editDialogVisible = true;
            this.operation = true;
            this.dataForm = {
                id: 0,
                paramKey: "",
                paramValue: "",
                paramComment: "",
                description: "desc",
                remarks: "remark"
            };
        },
        // 显示编辑界面
        handleEdit: function (params) {
            this.editDialogVisible = true;
            this.operation = false;
            this.dataForm = Object.assign({}, params.row);
        },
        // 编辑
        // submitForm: function () {
        //     this.$refs.dataForm.validate(valid => {
        //         if (valid) {
        //             this.$confirm("确认提交吗？", "提示", {}).then(() => {
        //                 this.editLoading = true;
        //                 let params = Object.assign({}, this.dataForm);
        //                 this.$api.zenTaoTestCase.save(params).then(res => {
        //                     if (res.code == 200 || res.code == 0) {
        //                         this.$message({ message: "操作成功", type: "success" });
        //                     } else {
        //                         this.$message({
        //                             message: "操作失败, " + res.msg,
        //                             type: "error"
        //                         });
        //                     }
        //                     this.editLoading = false;
        //                     this.$refs["dataForm"].resetFields();
        //                     this.editDialogVisible = false;
        //                     this.findPage(null);
        //                 });
        //             });
        //         }
        //     });
        // },
        // refresh: function () {
        //     this.filters.paramComment = "";
        //     this.findPage(null);
        // },
        // 时间格式化
        dateFormat: function (row, column, cellValue, index) {
            return format(row[column.property]);
        },
        async getTestTaskList() {
            let testTaskListDataResponse = await this.$api.zenTaoTestTask.findAll().then();
            
            let success = this.$util.responseUtil.parseErrorCode(testTaskListDataResponse);
            if (success) {
                this.pageResult = testTaskListDataResponse.data;
                this.testTaskList = testTaskListDataResponse.data;
            } else {
                this.$message({
                    message: this.$util.responseUtil.getErrorMsg(testTaskListDataResponse),
                    type: "error"
                });
            }
            
        },
        filterTestCasesByTestTask: function (val) {
            let selected = {};
            selected = this.testTaskList.find((item) => {
                console.log(item);
                return item.id === val;
            })
            console.log(selected);

            this.filters.label = "";
            this.currentFilterTestTaskId = val;

            console.log(selected.zenTaoTestTaskId);
            let params = {
                testTaskId: selected.zenTaoTestTaskId
            };

            this.pageRequest.params = [{
                name: "testTaskId",
                value: selected.zenTaoTestTaskId
            }];
            this.$api.zenTaoTestCase.findPageByTestTaskId(this.pageRequest).then((res) => {
                if (res.success && (res.code == 200 || res.code == 0)) {
                    this.$message({
                        message: "查询成功",
                        type: "success"
                    });
                    this.pageResult = res.data
                } else {
                    this.$message({
                        message: "查询失败, " + (null == res.msg) ? "后台接口获取失败" : res.msg,
                        type: "error"
                    });
                }
                this.editLoading = false;
                this.editDialogVisible = false;
            });
        },
    },
    mounted() {
        this.getTestTaskList();
    }
};
</script>

<style scoped></style>
