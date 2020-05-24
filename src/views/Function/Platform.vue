<template>
    <div class="page-container">
        <!--工具栏-->
        <div class="toolbar" style="position:absolute;float:left;padding-top:10px;padding-left:15px;">
            <el-form :inline="true" :model="filters" :size="size">
                <el-form-item>
                    <el-input v-model="filters.platformName" placeholder="平台名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-search" :label="$t('action.search')" perms="function:platform:view"
                        type="primary" @click="findPage(null)" />
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="function:platform:add" type="primary"
                        @click="handleAdd" />
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-refresh" label="刷新" perms="function:platform:view" type="primary"
                        @click="refresh" />
                </el-form-item>
                <!-- <el-form-item>
          <kt-button
            :label="$t('action.batchDelete')"
            :perms="permsDelete"
            :size="size"
            type="danger"
            @click="handleBatchDelete()"
            :disabled="this.selections.length === 0"
            style="float:left;"
            v-if="showBatchDelete & showOperation"
          />
        </el-form-item> -->
            </el-form>
        </div>
        <!--表格内容栏-->
        <!-- <kt-table
      permsEdit="function:platform:edit"
      permsDelete="function:platform:delete"
      :data="pageResult"
      :columns="columns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      :style="{ display: ifDisplay ? 'block' : 'none' }"
    >
    </kt-table> -->
        <div
            style="position:absolute;top:60px;left:20px;padding-top:20px;margin-bottom:50px;padding-bottom:50px;width:100%">
            <el-row align="middle" v-for="(item, index) in rowCounts" :key="index"
                style="margin-top:10x;margin-bottom:20px;width:100%;height:380px">
                <el-col :span="4" v-for="eachPlatform in getCurrentRow(index)" :key="eachPlatform.id" :offset="1"
                    style="margin:0px 30px 0px 0px;height:100%;width:20%">
                    <el-card :body-style="{ padding: '0px' }" shadow="always" class="box-card"
                        style="width:100%;margin:0;">
                        <div slot="header" class="clearfix">
                            <span class="title"
                                :title="eachPlatform.platformName"><strong>{{ eachPlatform.platformName | ellipsis}}</strong></span>
                            <el-button type="text" class="button el-icon-edit-outline"
                                style="float: right; padding: 1px 1px" title="编辑" @click="edit(eachPlatform)">
                            </el-button>
                            <el-button type="text" class="butto el-icon-view" style="float: right; padding: 1px 1px"
                                title="查看" @click="view(eachPlatform)"></el-button>
                            <el-button type="text" class="button el-icon-delete" style="float: right; padding: 1px 1px"
                                title="删除" @click="deleteIt(eachPlatform)"></el-button>
                            <el-button type="text" class="button el-icon-folder" style="float: right; padding: 1px  1px"
                                title="打开" @click="openThisPlatform(eachPlatform)"></el-button>
                        </div>
                        <img :src="eachPlatform.imageUrl" class="image" v-if="eachPlatform.imageUrl" />
                        <img src="../../assets/img/defaultPlatformImage.png" class="image" v-else-if="true" />
                        <!-- <img src="../../assets/img/defaultPlatformImage.png" class="image" v-else-if="true" /> -->
                        <!-- <img src="https://csdnimg.cn/public/favicon.ico" class="image" v-else /> -->
                        <div style="padding: 0px;height: 200px;" align="left">
                            <div>
                                <span class="title">名称:</span>
                                <span class="line-limit-length"
                                    :title="eachPlatform.platformName">{{ eachPlatform.platformName | ellipsis}}</span>
                            </div>
                            <div>
                                <span class="title ">地址:</span>
                                <span :title="eachPlatform.accessUrl"
                                    class="line-limit-length">{{ eachPlatform.accessUrl  | ellipsis(20)  | formatNoData  }}</span>
                            </div>
                            <div>
                                <span class="title">描述:</span>
                                <span class="title"
                                    :title="eachPlatform.description">{{eachPlatform.description | ellipsis | formatNoData }}</span>
                            </div>
                            <div>
                                <span class="title">备注:</span>
                                <span>{{eachPlatform.remarks | ellipsis | formatNoData}}</span>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <!-- <div class="toolbar" style="padding:10px;">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        @current-change="refreshPageRequest"
        :current-page="pageRequest.pageNum"
        :page-size="pageRequest.pageSize"
        :total="pageResult.totalSize"
        style="float:right;"
      ></el-pagination>
    </div> -->

        <!-- <el-card
      class="box-card"
      v-for="eachPlatform in platformList"
      :key="eachPlatform.id"
      :body-style="{ padding: '60px' }"
    >
      <div slot="header" class="clearfix">
        <span>{{ eachPlatform.platformName }}</span>
      </div>
      <div>
        <p>{{ eachPlatform.accessUrl }}</p>
        <p>{{ eachPlatform.description }}</p>
        <p>{{ eachPlatform.remarks }}</p>
        <el-button style="float: right; padding: 3px 0" type="text"
          >打开</el-button
        >
      </div>
    </el-card> -->
        <!--新增编辑界面-->
        <el-dialog :title="operation ? '新增' : '编辑'" :width="dialogSize" :visible.sync="editDialogVisible"
            :close-on-click-modal="true" :destroy-on-close="true">
            <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
                <el-form-item label="ID" prop="id" v-if="false">
                    <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="platformName">
                    <el-input v-model="dataForm.platformName" auto-complete="off"
                        :placeholder="ifViewOperation?noDataInfo:'请输入平台名称'" maxlength="50" :disabled="ifViewOperation"
                        show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="访问地址" prop="accessUrl">
                    <el-input v-model="dataForm.accessUrl" auto-complete="off"
                        :placeholder="ifViewOperation?noDataInfo:'请输入访问地址'" maxlength="500" :disabled="ifViewOperation"
                        show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="描述 " prop="description">
                    <el-input v-model="dataForm.description" auto-complete="off" type="textarea"
                        :placeholder="ifViewOperation?noDataInfo:'请输入平台描述'" :disabled="ifViewOperation">
                    </el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea"
                        :placeholder="ifViewOperation?'noDataInfo':'请输入平台备注'" :disabled="ifViewOperation">
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

        <el-dialog title="查看详情" :width="dialogSize" :visible.sync="ifViewOperation" :close-on-click-modal="false"
            :destroy-on-close="true">
            <el-form :model="dataForm" label-width="80px" ref="dataForm" :size="size">
                <el-form-item label="ID" prop="id">
                    <el-input v-model="dataForm.id" :disabled="ifViewOperation"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="platformName">
                    <el-input v-model="dataForm.platformName" auto-complete="off" :placeholder="noDataInfo"
                        :disabled="ifViewOperation"></el-input>
                </el-form-item>
                <el-form-item label="访问地址" prop="accessUrl">
                    <el-input v-model="dataForm.accessUrl" auto-complete="off" :placeholder="noDataInfo"
                        :disabled="ifViewOperation"></el-input>
                </el-form-item>

                <el-form-item label="描述 " prop="description">
                    <el-input v-model="dataForm.description" auto-complete="off" type="textarea"
                        :placeholder="noDataInfo" :disabled="ifViewOperation">
                    </el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="dataForm.remarks" auto-complete="off" type="textarea" :placeholder="noDataInfo"
                        :disabled="ifViewOperation">
                    </el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime">
                    <el-input v-model="dataForm.createTime" auto-complete="off" type="textarea"
                        :placeholder="noDataInfo" :disabled="ifViewOperation">
                    </el-input>
                </el-form-item>
                <el-form-item label="修改时间" prop="lastUpdateTime">
                    <el-input v-model="dataForm.lastUpdateTime" auto-complete="off" type="textarea"
                        :placeholder="noDataInfo" :disabled="ifViewOperation">
                    </el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import { format } from "@/utils/datetime";
import * as defaultSettings from "../../configs/settings";
import * as validate from "../../utils/validate";

export default {
    components: {
        KtTable,
        KtButton
    },
    props: {
        showBatchDelete: {
            // 是否显示操作组件
            type: Boolean,
            default: true
        },
        showOperation: {
            // 是否显示操作组件
            type: Boolean,
            default: true
        },
        data: Object,
        permsEdit: String, // 编辑权限标识
        permsDelete: String // 删除权限标识
    },
    data () {
        return {
            size: "small",
            filters: {
                platformName: ""
            },
            columns: [
                { prop: "id", label: "ID", minWidth: 50 },
                { prop: "platformName", label: "名称", minWidth: 100 },
                { prop: "accessUrl", label: "访问地址", minWidth: 100 },
                { prop: "description", label: "描述", minWidth: 120 },
                { prop: "remarks", label: "备注", minWidth: 120 },
                { prop: "createBy", label: "创建人", minWidth: 100 },
                {
                    prop: "createTime",
                    label: "创建时间",
                    minWidth: 120,
                    formatter: this.dateFormat
                },
                { prop: "lastUpdateBy", label: "更新人", minWidth: 100 },
                {
                    prop: "lastUpdateTime",
                    label: "更新时间",
                    minWidth: 120,
                    formatter: this.dateFormat
                }
            ],
            pageRequest: { pageNum: 1, pageSize: 10 },
            loading: false, // 加载标识

            selections: [], // 列表选中列,
            pageResult: {
                data: { totalSize: 0 }
            },
            operation: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            dataFormRules: {
                platformName: [
                    { required: true, message: "请输入名称", trigger: "blur" }
                ],
                accessUrl: [
                    { required: true, message: "请输入访问地址", trigger: "blur" },
                    { type: "url", message: "请输入合法的url地址", trigger: "blur" },

                ]
            },
            // 新增编辑界面数据
            dataForm: {
                id: 0,
                platformName: "",
                accessUrl: "",
                description: "",
                remarks: ""
            },

            currentDate: new Date(),
            platformList: [],
            platformCounts: 0,
            rowCounts: 0,
            ifDisplay: false,
            ifViewOperation: false,
            dialogSize: defaultSettings.defaultDialogWidth,
            noDataInfo: defaultSettings.defaultNoDataMessage,
        };
    },
    methods: {
        // 获取分页数据
        findPage: function (data) {
            if (data !== undefined && data !== null) {
                this.pageRequest = data.pageRequest;
            }
            this.pageRequest.params = [
                { name: "platformName", value: this.filters.platformName }
            ];
            this.$api.platform
                .findPage(this.pageRequest)
                .then(res => {
                    this.pageResult = res.data;
                    this.platformList = this.pageResult.content;
                    this.platformCounts = this.platformList.length;
                    this.rowCounts = Math.ceil(this.platformCounts / 4);
                    // console.log("rowCounts:" + this.rowCounts);
                })
                .then(data != null ? data.callback : "");
        },
        // 批量删除
        handleDelete: function (data) {
            this.$api.platform
                .batchDelete(data.params)
                .then(data != null ? data.callback : "");
        },
        // 显示新增界面
        handleAdd: function () {
            this.editDialogVisible = true;
            this.operation = true;
            this.ifViewOperation = false;
            this.dataForm = {
                id: 0,
                platformName: "",
                accessUrl: "",
                description: "",
                remarks: ""
            };
        },
        // 显示编辑界面
        handleEdit: function (params) {
            this.editDialogVisible = true;
            this.operation = false;
            this.ifViewOperation = false;
            this.dataForm = Object.assign({}, params.row);
        },
        edit: function (item) {
            this.editDialogVisible = true;
            this.operation = false;
            this.ifViewOperation = false;
            this.dataForm = Object.assign({}, item);
        },
        deleteIt: function (item) {
            this.$confirm("确认删除吗？", "提示", {}).then(() => {
                let params = [];
                params.push({ id: item.id });
                this.editLoading = true;
                this.$api.platform
                    .batchDelete(params)
                    .then(res => {
                        if (res.code == 200 || res.code == 0) {
                            this.$message({ message: "删除成功", type: "success" });
                        } else {
                            this.$message({
                                message: "删除失败, " + res.msg,
                                type: "error"
                            });
                        }
                        this.editLoading = false;
                        this.filters.platformName = "";
                        this.findPage(null);                    });
            });

        },
        view: function (item) {
            this.ifViewOperation = true;
            this.editDialogVisible = false;
            this.operation = false;
            this.dataForm = Object.assign({}, item);
        },
        // 编辑
        submitForm: function () {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    this.$confirm("确认提交吗？", "提示", {}).then(() => {
                        this.editLoading = true;
                        let params = Object.assign({}, this.dataForm);
                        this.$api.platform.save(params).then(res => {
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
                            this.filters.platformName = "";
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
        async refreshPageRequest (pageNum) {
            this.pageRequest.pageNum = pageNum;
            await this.findPage(null);
        },
        /**刷新 */
        refresh: function () {
            this.filters.platformName = "";
            this.findPage(null);
        },
        findAll: function () {
            this.$api.platform
                .findAll()
                .then(res => {
                    this.pageResult = res.data;
                    this.platformList = this.pageResult.content;
                    this.platformCounts = this.platformList.length;
                    this.rowCounts = this.platformCounts / 4 + 1;
                })
                .then(data != null ? data.callback : "");
        },
        /** */
        openThisPlatform: function (eachPlatform) {
            // console.log(eachPlatform);
            if (!eachPlatform.accessUrl) {
                this.$message({ message: "该平台没有网址，请确认！", type: "error" });
                return false;
            }

            if (!validate.isURL(eachPlatform.accessUrl)) {
                this.$message({ message: "该平台的网址是非法的url地址，请修改后打开", type: "error" });
                return false;
            }

            window.open(eachPlatform.accessUrl);
        }
    },
    mounted () {
        this.refreshPageRequest(1);
    },
    computed: {
        getCurrentRow () {
            return function (thisRow) {
                let eachRowData = this.platformList.slice(
                    thisRow * 4,
                    (thisRow + 1) * 4
                );
                // console.log(eachRowData);
                return eachRowData;
            };
        }
    },
    filters: {
        ellipsis (value, length = 10) {
            if (!value) {
                return "";
            };

            if (value.length > length) {
                return value.slice(0, length) + "...";
            }

            return value;
        },
        formatNoData (value) {
            // console.log(value);
            if (!value) {
                return defaultSettings.defaultNoDataMessage;
            }
            return value;
        },
        formatDate (value) {
            return this.dateFormat(value);
        }
    }
};
</script>

<style scoped>
.title {
    font-size: 16px;
    color: #000000;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: 100%;
    height: 220px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}
.box-card {
    width: 20%;
    height: 100%;
}
.line-limit-length {
    overflow: visible;
    text-overflow: inherit;
    white-space: nowrap;
}
</style>

<style>
.modal-open {
    overflow-y: scroll;
}

.container {
    padding-right: 15px !important;
}
</style>
