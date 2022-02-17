<template>
    <div class="app-container">
        <div class="filter-container">
            <el-space wrap size="small">
                <el-input v-model="listQuery.name" placeholder="试卷名称" style="width: 200px;" class="filter-item" />
                <el-input v-model="listQuery.title" placeholder="试卷标题" style="width: 200px;" class="filter-item" />
                <el-select v-model="listQuery.type" placeholder="请选择" clearable>
                        <el-option label="调查问卷" value="1" > </el-option>
                        <el-option label="考试问卷" value="2" > </el-option>
                    </el-select>
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
                style="width: 100%;"
                >
                <el-table-column label="试卷id" prop="id" align="center"></el-table-column>
                <el-table-column label="试卷名称" prop="name" align="center"></el-table-column>
                <el-table-column label="试卷标题" prop="title" align="center"></el-table-column>
                <el-table-column label="试卷分数" prop="score" align="center"></el-table-column>
                <el-table-column label="试卷类型" prop="typeName" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="handleUpdate(scope.row.id)">
                            编辑
                        </el-button>
                        <el-button type="primary" size="small" @click="handlePaperLayout(scope.row.id)">
                            编辑布局
                        </el-button>
                        <el-button type="danger"  size="small" @click="handleDelete(scope.row.id)">
                            删除
                        </el-button>
                        <el-button type="primary"  size="small" @click="handleExport(scope.row.id)">
                            打印
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :title="title" v-model="dialogFormVisible">
            <el-form ref="dataForm" :model="paper" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
                <el-form-item label="试卷名称：" prop="name">
                    <el-input v-model="paper.name" :disabled="dialogStatus === 'create' ? false : true" />
                </el-form-item>
                <el-form-item label="试卷标题：" prop="title">
                    <el-input v-model="paper.title" />
                </el-form-item>
                <el-form-item label="试卷分数：" prop="score">
                    <el-input v-model="paper.score" />
                </el-form-item>
                <el-form-item label="试卷类型：" prop="type">
                    <el-select v-model="paper.type" placeholder="请选择">
                        <el-option label="调查问卷" value="1" > </el-option>
                        <el-option label="考试问卷" value="2" > </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
             <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>


<script>
import { addPaper, queryList, updatePaper, queryOne, deletePaper, exportPaper } from '@/api/paper'
import { Edit,Search  } from '@element-plus/icons-vue' 

export default {
    components:{
        Edit,Search
    },
    data() {
        return {
            tableKey: 0,
            list: [],
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 15,
                name: ''
            },
            title: '',
            paper: {
                id: undefined,
                name: '',
                title: '',
                score: 100,
                type: undefined
            },
            dialogFormVisible: false,
            dialogStatus: ''
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            queryList(this.listQuery).then(response => {
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
            this.paper.id = undefined
            this.paper.name = ''
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
            this.title = '创建试卷'
            this.resetPaper()
        },
        handleUpdate(id) {
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            this.title = '编辑试卷'
            queryOne({id : id}).then(response => {
                if (response.code == 0) {
                    this.paper = response.content
                }
            })
        },
        handleDelete(id) {
            this.$confirm('确认要删除数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deletePaper({id : id}).then(response => {
                    if (response.code == 0) {
                        this.getList();
                    }
                })
            })
        },
        handleExport(id) {
            window.open("http://localhost:8080/api/paper/export?examId="+ id) 
            // exportPaper({examId : id}).then(response => {
                
            // })
        },
        handlePaperLayout(id) {
            this.$router.push({path: '/paper/edit',//rooter配置的name值
                query:{
                    'id': id
                }
            });
        },
        createData() {
            addPaper(this.paper).then(response => {
                if (response.code == 0) {
                    this.dialogFormVisible = false
                    this.$notify({
                        title: 'Success',
                        message: '添加成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.resetPaper()
                    this.getList()
                }
            })
        },
        updateData() {
            updatePaper(this.paper).then(response => {
                if (response.code == 0) {
                    this.dialogFormVisible = false
                    this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList();
                }
            })
        },
        resetPaper() {
            this.paper = {
                id: undefined,
                name: '',
                title: ''
            }
        },
        
    }
}

</script>