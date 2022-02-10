<template>
    <div class="app-container">
        <div class="filter-container">
            <el-space wrap size="small">
                <el-input v-model="listQuery.paperName" placeholder="试卷名称" style="width: 200px;" class="filter-item" />
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
                <el-table-column label="id" prop="id" align="center" width="60px"></el-table-column>
                <el-table-column label="试卷名称" prop="paperName" align="center"></el-table-column>
                <el-table-column label="开始时间" prop="startTime" align="center"></el-table-column>
                <el-table-column label="结束时间" prop="endTime" align="center"></el-table-column>
                <el-table-column label="参考人员标签" prop="tagNames" align="center"></el-table-column>
                <el-table-column label="提交人数" prop="commitCount" align="center"></el-table-column>
                <el-table-column label="状态" prop="statusName" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button v-if="scope.row.status === 0" type="primary" size="small" @click="handleUpdate(scope.row.id)">
                            编辑
                        </el-button>
                        <el-button v-if="scope.row.status === 0" type="primary" size="small" @click="handlerPublish(scope.row.id)">
                            发布
                        </el-button>
                        <el-button v-if="scope.row.status === 1" type="info" size="small" @click="handlerTakeDown(scope.row.id)">
                            下架
                        </el-button>
                        <el-button v-if="scope.row.status === 0 || scope.row.status === 2"  type="danger"  size="small" @click="handleDelete(scope.row.id)">
                            删除
                        </el-button>
                         <el-button v-if="scope.row.status === 1 || scope.row.status === 2" type="primary"  size="small" @click="handleExamination(scope.row.id)">
                            开始审卷
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :title="title" v-model="dialogFormVisible">
            <el-form ref="dataForm" :model="publishPaper" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
                <el-form-item label="考试试卷：" prop="paperId">
                    <el-select v-model="publishPaper.paperId" placeholder="请选择">
                        <el-option  
                            v-for="paper in paperList"
                            :key="paper.id"
                            :label="paper.name" 
                            :value="paper.id" 
                        >   
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考试时间" prop="dataRange">
                    <el-date-picker
                        v-model="publishPaper.dataRange"
                        type="datetimerange"
                        range-separator="To"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="参考人员标签" prop="tagIds">
                    <el-select v-model="publishPaper.tagIds" class="filter-item" placeholder="请选择" multiple >
                        <el-option v-for="item in tagList" :key="item.id" :label="item.tagName" :value="item.id" />
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
    import { Edit,Search  } from '@element-plus/icons-vue' 
    import { queryPublishPaper, queryOne, insert, update, deletePublishPaper, updateStatus } from '@/api/publishPaper'
    import { queryList } from '@/api/paper'
    import { queryTagList } from '@/api/user'


    export default {
        components:{
            Edit,Search
        },
        data() {
            return {
                tableKey: 0,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 15,
                    paperName: ''
                },
                title: '',
                publishPaper: {
                    id: undefined,
                    paperId: undefined,
                    dataRange: [],
                    startTime: undefined,
                    endTime: undefined,
                    tagIds: []
                },
                list: [],
                tagList: [],
                paperList: [],
                dialogFormVisible: false,
                dialogStatus: ''
            }
        },
        created() {
             this.getPaperList()
             this.queryTagList()
             this.getPublishPaperList()
        },
        methods: {
            queryTagList() {
                queryTagList({}).then(response => {
                    if (response.code == 0) {
                        const { content, total } = response
                        this.tagList = content
                    }
                })
            },
            getPaperList() {
                queryList({}).then(response => {
                    if (response.code == 0) {
                        const { content, total } = response 
                        this.paperList = content
                    }
                })
            },
            getPublishPaperList() {
                queryPublishPaper(this.listQuery).then(response => {
                    if (response.code == 0) {
                        const { content, total } = response 
                        this.list = content
                    }
                })
            },
            handleFilter() {
                this.getPublishPaperList()
            },
            handleCreate() {
                this.publishPaper.id = undefined
                this.publishPaper.name = ''
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
                        this.publishPaper = response.content
                        this.publishPaper.dataRange = [new Date(this.publishPaper.startTime), new Date(this.publishPaper.endTime)]
                        
                        console.log(this.publishPaper.dataRange)
                    }
                })
            },
            handleDelete(id) {
                this.$confirm('确认要删除数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePublishPaper({id : id}).then(response => {
                        if (response.code == 0) {
                            this.getPublishPaperList()
                        }
                    })
                })
            },
            handlerPublish(id) {
                this.$confirm('确认要上架试卷吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    updateStatus({id : id, status: 1}).then(response => {
                        if (response.code == 0) {
                            this.getPublishPaperList()
                        }
                    })
                })
                
            },
            handlerTakeDown(id) {
                this.$confirm('确认要下架试卷吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    updateStatus({id : id, status: 2}).then(response => {
                        if (response.code == 0) {
                            this.getPublishPaperList()
                        }
                    })
                })
                
            },
            handleExamination(id) {
                this.$router.push({path: '/publishPaper/examination',
                    query:{
                        'id': id
                    }
                });
            },
            createData() {
                this.publishPaper.startTime = this.publishPaper.dataRange[0]
                this.publishPaper.endTime = this.publishPaper.dataRange[1]
                insert(this.publishPaper).then(response => {
                    if (response.code == 0) {
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: '添加成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.resetPaper()
                        this.getPublishPaperList()
                    }
                })
            },
            updateData() {
                this.publishPaper.startTime = this.publishPaper.dataRange[0]
                this.publishPaper.endTime = this.publishPaper.dataRange[1]
                update(this.publishPaper).then(response => {
                    if (response.code == 0) {
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: '修改成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getPublishPaperList();
                    }
                })
            },
            resetPaper() {
                this.publishPaper = {
                    id: undefined,
                    name: '',
                    title: ''
                }
            },
            
        }
    }
</script>
