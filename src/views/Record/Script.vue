<template>
    <div class="page-container">
        <!--工具栏-->
        <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
            <el-form :inline="true" :model="filters" :size="size">
                <el-form-item>
                    <el-input v-model="filters.label" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-search" :label="$t('action.search')" perms="record:script:view"
                        type="primary" @click="findPage(null)" />
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-refresh" label="刷新" perms="record:script:view" type="primary"
                        @click="refresh" />
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="record:script:add" type="primary"
                        @click="handleAdd" />
                </el-form-item>

                <el-form-item>
                    <el-select v-model="currentFilterAppId" placeholder="根据应用过滤脚本" @change="filterScriptsByApp">
                        <el-option v-for="item in appList" :key="item.id" :label="item.appName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <!--表格内容栏-->
        <kt-table permsEdit="record:script:edit" permsDelete="record:script:delete" :data="pageResult"
            :columns="columns" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
        </kt-table>
        <!--新增编辑界面-->
        <el-dialog :title="operation?'新增':'编辑'" :width="dialogSize" :visible.sync="editDialogVisible"
            :close-on-click-modal="false" :destroy-on-close="true">
            <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
                <el-form-item label="ID" prop="id" v-if="false">
                    <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="脚本名称" prop="scriptName">
                    <el-input v-model="dataForm.scriptName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属应用" prop="appId">
                    <el-select v-model="dataForm.appId" placeholder="选择应用" style="display: block;">
                        <el-option v-for="item in appList" :key="item.id" :label="item.appName" :value="item.id">
                        </el-option>
                    </el-select>
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
    </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
import * as defaultSettings from "../../configs/settings";
export default {
    components: {
        KtTable,
        KtButton
    },
    data () {
        return {
            size: 'small',
            filters: {
                label: ''
            },
            columns: [
                { prop: "id", label: "ID", minWidth: 50 },
                { prop: "scriptName", label: "脚本名称", minWidth: 100 },
                { prop: "apk.appName", label: "应用名称", minWidth: 100 },
                { prop: "description", label: "描述", minWidth: 120 },
                { prop: "remarks", label: "备注", minWidth: 120 },
                { prop: "createBy", label: "创建人", minWidth: 100 },
                { prop: "createTime", label: "创建时间", minWidth: 120, formatter: this.dateFormat },
                { prop: "lastUpdateBy", label: "更新人", minWidth: 100 },
                { prop: "lastUpdateTime", label: "更新时间", minWidth: 120, formatter: this.dateFormat }
            ],
            pageRequest: { pageNum: 1, pageSize: 10 },
            pageResult: {},

            operation: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            dataFormRules: {
                scriptName: [
                    { required: true, message: '请输入脚本名称', trigger: 'blur' }
                ]
            },
            // 新增编辑界面数据
            dataForm: {
                id: 0,
                scriptName: '',
                appId: '',
                description: '',
                remarks: ''
            },
            /**应用列表 */
            appList: [],
            currentFilterAppId: '',
            dialogSize: defaultSettings.defaultDialogWidth,
        }
    },
    methods: {
        // 获取分页数据
        findPage: function (data) {
            if (data !== null) {
                this.pageRequest = data.pageRequest
            }
            this.pageRequest.params = [{ name: 'label', value: this.filters.label }];

            //清空app
            this.currentFilterAppId = "";

            this.$api.script.findPage(this.pageRequest).then((res) => {
                this.pageResult = res.data
            }).then(data != null ? data.callback : '')
        },
        // 批量删除
        handleDelete: function (data) {
            this.$api.script.batchDelete(data.params).then(data != null ? data.callback : '')
        },
        // 显示新增界面
        handleAdd: function () {
            this.editDialogVisible = true;
            this.operation = true;
            this.getAppList();
            this.dataForm = {
                id: 0,
                appId: '',
                scriptName: '',
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
                        this.$api.script.save(params).then((res) => {
                            if (res.code == 200 || res.code == 0) {
                                this.$message({ message: '操作成功', type: 'success' })
                            } else {
                                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
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
        // 时间格式化
        dateFormat: function (row, column, cellValue, index) {
            return format(row[column.property])
        },
        async getAppList () {
            let appListData = await this.$api.apk.findAll();
            this.appList = appListData.data;
        },
        filterScriptsByApp: function (val) {
            let selected = {};
            selected = this.appList.find((item) => {
                return item.id === val;
            })
            console.log(selected);

            this.filters.label = "";
            this.currentFilterAppId = val;
            let params = { name: "appId", value: this.currentFilterAppId };
            this.pageRequest.params = [params];
            this.$api.script.findPageByAppId(this.pageRequest).then((res) => {
                this.pageResult = res.data
            });
        },
        /**刷新 */
        refresh: function () {
            this.filters.label = "";
            this.findPage(null);
        },
    },
    mounted () {
        this.getAppList();
    }
}
</script>

<style scoped>
</style>
