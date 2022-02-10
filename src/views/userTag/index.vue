<template>
    <div class="app-container">
        <div class="filter-container">
            <el-space wrap size="small">
                <el-input v-model="listQuery.tagName" placeholder="身份名称" style="width: 200px;" class="filter-item" />
                <el-button class="filter-item" type="primary" @click="handleFilter">
                   <el-icon style="vertical-align: middle;">
                        <search />
                    </el-icon>
                    <span style="vertical-align: middle;"> 搜索 </span>
                </el-button>
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
                    <el-icon style="vertical-align: middle;">
                        <edit />
                    </el-icon>
                    <span style="vertical-align: middle;"> 添加 </span>
                </el-button>
            </el-space>
        </div>
        <div class="data-container">
            <el-table
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                ref="singleTableRef"
                style="width: 100%;"
                >
                <el-table-column label="身份id" prop="id" align="center"></el-table-column>
                <el-table-column label="身份名称" prop="tagName" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="300">
                    <template #default="scope">
                        <el-button type="danger"  size="small" @click="handleDelete(scope.row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :title="title" v-model="dialogFormVisible">
            <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
                <el-form-item label="tag名称：" prop="tagName">
                    <el-input v-model="temp.tagName" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="createData()">
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>


<script>
import { insertTag, queryTagList, deleteTag } from '@/api/user'
import { Edit,Search  } from '@element-plus/icons-vue' 


export default {
    components:{
        Edit,Search
    },
    data() {
        return {
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 15,
                importance: undefined,
                tagName: undefined,
            },
            temp: {
                id: undefined,
                userName: '',
                sex: '',
                identity: '',
                password: ''
            },
            title:'',
            dialogFormVisible: false,
            dialogStatus: '',
            dialogPvVisible: false,
            dialogRoleVisible: false,
            downloadLoading: false
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            queryTagList(this.listQuery).then(response => {
                if (response.code == 0) {
                    const { content, total } = response
                    this.list = content
                }
            })
        },
        handleFilter() {
            this.getList()
        },
        handleCreate() {
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
            this.title = '创建身份'
        },
        handleDelete(id) {
            this.$confirm('确认要删除数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteTag({id : id}).then(response => {
                    if (response.code == 0) {
                        this.getList();
                    }
                })
            })
        },
        createData() {
            insertTag(this.temp).then(response => {
                if (response.code == 0) {
                    this.dialogFormVisible = false
                    this.$notify({
                        title: 'Success',
                        message: '添加成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.resetTemp()
                    this.getList()
                }
            })
        },
        resetTemp() {
            this.temp = {
                id: undefined,
                userName: '',
                sex: '',
                identity: '',
                password: ''
            }
        },
        
    }
}

</script>