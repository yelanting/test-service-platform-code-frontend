<template>
    <div>
        <!--表格栏-->
        <el-table :data="data.content" :highlight-current-row="highlightCurrentRow" @selection-change="selectionChange" @current-change="handleCurrentChange" v-loading="loading" :element-loading-text="$t('action.loading')" :border="border" :stripe="stripe" :show-overflow-tooltip="showOverflowTooltip" :max-height="maxHeight" :size="size" :align="align" style="width:100%;" :style="{ display: ifDisplay ? 'block' : 'none' }">
            <el-table-column type="selection" width="40" v-if="showBatchDelete & showOperation"></el-table-column>
            <el-table-column v-for="column in columns" header-align="center" align="center" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter" :sortable="column.sortable == null ? true : column.sortable"></el-table-column>
            <el-table-column :label="$t('action.operation')" width="185" fixed="right" v-if="showOperation" header-align="center" align="center">
                <template slot-scope="scope">
                    <kt-button icon="fa fa-edit" :label="$t('action.edit')" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
                    <kt-button icon="fa fa-trash" :label="$t('action.delete')" :perms="permsDelete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" />
                    <kt-button v-for="(op,index) in extendsOps" :label="op.label" :key="index" :perms="op.perms" :size="size" v-on:op.handleEvent="op.handleEvent" @click="handleSelfDefined(op.handleEvent,scope.$index,scope.row)" :type="op.type" :icon="op.icon" />
                </template>
            </el-table-column>

        </el-table>
        <!--分页栏-->
        <div class="toolbar" style="padding:10px;">
            <kt-button :label="$t('action.batchDelete')" :perms="permsDelete" :size="size" type="danger" @click="handleBatchDelete()" :disabled="this.selections.length === 0" style="float:left;" v-if="showBatchDelete & showOperation" />
            <el-pagination background layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="data.totalSize" style="float:right;" :hide-on-single-page="true" prev-text="上一页" next-text="下一页">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
export default {
    name: "KtTable",
    components: {
        KtButton
    },
    props: {
        columns: Array, // 表格列配置
        data: Object, // 表格分页数据
        permsEdit: String, // 编辑权限标识
        permsDelete: String, // 删除权限标识
        extendsOps: Array,
        size: {
            // 尺寸样式
            type: String,
            default: "small"
        },
        align: {
            // 文本对齐方式
            type: String,
            default: "left"
        },
        maxHeight: {
            // 表格最大高度
            type: Number,
            default: 600
        },
        showOperation: {
            // 是否显示操作组件
            type: Boolean,
            default: true
        },
        border: {
            // 是否显示边框
            type: Boolean,
            default: true
        },
        stripe: {
            // 是否显示斑马线
            type: Boolean,
            default: true
        },
        highlightCurrentRow: {
            // // 是否高亮当前行
            type: Boolean,
            default: true
        },
        showOverflowTooltip: {
            // 是否单行显示
            type: Boolean,
            default: true
        },
        showBatchDelete: {
            // 是否显示操作组件
            type: Boolean,
            default: true
        },
    },
    data () {
        return {
            // 分页信息
            pageRequest: {
                pageNum: 1,
                pageSize: 9
            },
            ifDisplay: true,
            loading: false, // 加载标识
            selections: [],// 列表选中列
            ops: []
        };
    },
    methods: {
        // 分页查询
        findPage: function () {
            this.loading = true;
            let callback = res => {
                this.loading = false;
            };
            this.$emit("findPage", {
                pageRequest: this.pageRequest,
                callback: callback
            });
        },
        // 选择切换
        selectionChange: function (selections) {
            this.selections = selections;
            this.$emit("selectionChange", { selections: selections });
        },
        // 选择切换
        handleCurrentChange: function (val) {
            this.$emit("handleCurrentChange", { val: val });
        },
        // 换页刷新
        refreshPageRequest: function (pageNum) {
            this.pageRequest.pageNum = pageNum;
            this.findPage();
        },
        // 编辑
        handleEdit: function (index, row) {
            this.$emit("handleEdit", { index: index, row: row });
        },
        // 发射自定义
        handleSelfDefined: function (event, index, row) {
            console.log("发射自定义事件:" + event);
            this.$emit(event, { index: index, row: row });
        },
        // 删除
        handleDelete: function (index, row) {
            this.delete(row.id);
        },
        // 批量删除
        handleBatchDelete: function () {
            let ids = this.selections.map(item => item.id).toString();
            this.delete(ids);
        },
        // 删除操作
        delete: function (ids) {
            this.$confirm("确认删除选中记录吗？", "提示", {
                type: "warning"
            })
                .then(() => {
                    let params = [];
                    let idArray = (ids + "").split(",");
                    for (var i = 0; i < idArray.length; i++) {
                        params.push({ id: idArray[i] });
                    }
                    this.loading = true;
                    let callback = res => {
                        if (res.code == 200 || res.code == 0) {
                            this.$message({ message: "删除成功", type: "success" });
                            this.findPage();
                        } else {
                            this.$message({ message: "操作失败, " + res.msg, type: "error" });
                        }
                        this.loading = false;
                    };
                    this.$emit("handleDelete", { params: params, callback: callback });
                })
                .catch(() => { });
        }
    },
    mounted () {
        this.refreshPageRequest(1);
    }
};
</script>

<style scoped></style>
