<template>
    <div class="page-container">
        <!--工具栏-->
        <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
            <el-form :inline="true" :model="filters" :size="size">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <kt-button icon="fa fa-search" :label="$t('action.search')" type="primary" perms="sys:actautor:view"
                        @click="filterActutators" />
                </el-form-item>
            </el-form>
        </div>
        <!--表格内容栏-->
        <el-table :data="actuatorList" :highlight-current-row="true" v-loading="loading"
            :element-loading-text="$t('action.loading')" :border="true" :stripe="true" :show-overflow-tooltip="true"
            :max-height="600" size="small" align="left" style="width:100%;" :style="{ 'display': 'block'}">
            <el-table-column type="selection" width="40" v-if="false"></el-table-column>
            <el-table-column v-for="column in columns" header-align="center" align="center" :prop="column.prop"
                :label="column.label" :width="column.width" :min-width="column.minWidth" :fixed="column.fixed"
                :key="column.prop" :type="column.type" :formatter="column.formatter"
                :sortable="column.sortable == null ? true : column.sortable"></el-table-column>
            <el-table-column label="操作" width="185" fixed="right" v-if="showOperation" header-align="center"
                align="center">
                <template slot-scope="scope">
                    <el-button icon="fa fa-eye" label="查看" perms="sys:actautor:view" :size="size"
                        @click.native="handleViewActuator(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
import * as validate from "@/utils/validate";

export default {
    components: {
        KtTable,
        KtButton
    },
    data () {
        return {
            size: 'small',
            filters: {
                name: ''
            },
            showOperation: true,
            ifDisplay: true,
            loading: false, // 加载标识
            actuatorList: [],
            columns: [
                { prop: "actuatorName", label: "监控名称", minWidth: 50 },
                { prop: "detail.href", label: "链接地址", minWidth: 100 },
                // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
            ],

        }
    },
    methods: {
        // 获取分页数据
        findAll: function (data) {
            this.$api.actuator.getActuatorList().then((res) => {
                let _links = res._links;
                for (let eachItem in _links) {
                    let actuatorObject = {};
                    actuatorObject['actuatorName'] = eachItem;
                    actuatorObject['detail'] = _links[eachItem];
                    this.actuatorList.push(actuatorObject);
                }
            }).then(data != null ? data.callback : '')
        },
        // 时间格式化
        dateFormat: function (row, column, cellValue, index) {
            return format(row[column.property])
        },
        //查看监控信息
        handleViewActuator: function (row) {

            console.log(JSON.stringify(row));

            let href = row.detail.href;
            if (!href || !validate.isURL(href)) {
                this.$message({ message: "该监控中的连接地址是非法url或者是空链接，无法打开，请核对！", type: "error" });
            } else {
                if ((href.indexOf("{") != -1 && href.indexOf("}") != -1)) {
                    this.$message({ message: "该监控中的链接地址包含参数,无法直接打开，如有需要，请手动复制并替换参数", type: "error" });
                    return false;
                } else {
                    this.$message({ message: "打开成功，请在新页面查看", type: "success" });
                    window.open(href);
                }
            }
        },
        //过滤
        filterActutators: function () {
            if (!this.filters.name) {
                return this.findAll(null);
            }

            this.actuatorList = this.actuatorList.filter(each => each.actuatorName.indexOf(this.filters.name) != -1);
        }
    },
    mounted () {
        this.findAll(null);
    }
}
</script>

<style scoped>
</style>
