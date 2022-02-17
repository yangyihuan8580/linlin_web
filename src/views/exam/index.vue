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
                <el-table-column label="id" prop="id" align="center"></el-table-column>
                <el-table-column label="试卷名称" prop="paperName" align="center"></el-table-column>
                <el-table-column label="开始时间" prop="startTime" align="center"></el-table-column>
                <el-table-column label="结束时间" prop="endTime" align="center"></el-table-column>
                <el-table-column label="状态" prop="statusName" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <!-- v-if="showStartExam(scope.row)"  -->
                        <el-button 
                        
                        type="primary" size="small" @click="handlerExam(scope.row.paperId, scope.row.id, scope.row.publishPaperId)">
                            开始考试
                        </el-button>
                        <el-button v-if="scope.row.statusName === '已提交'" type="primary" size="small" @click="handlerQueryExam(scope.row.paperId, scope.row.id)">
                            查看考卷信息
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>



<script>
    import { Edit,Search  } from '@element-plus/icons-vue' 
    import { queryExamByUserId, encrypt, decrypt } from '@/api/exam'
    import rsa from '@/utils/rsa'


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
                list: [],
                userId: 13
            }
        },
        created() {

             this.queryExamByUserId()
        },
        methods: {
            queryExamByUserId() {
                queryExamByUserId({userId: 13}).then(response => {
                    if (response.code == 0) {
                        const { content, total } = response
                        this.list = content
                    }
                })
            },
            handleFilter() {
                this.queryExamByUserId()
            },
            handlerExam(paperId, examId, publishPaperId) {
                let query = {
                    paperId: paperId,
                    examId: examId,
                    userId: this.userId,
                    publishPaperId: publishPaperId,
                    disable: false
                }
                encrypt(query).then(response => {
                    this.$router.push({path: '/info',//rooter配置的name值
                        query:{
                            t: response.content
                        }
                    });
                })
            },
            handlerQueryExam(paperId, examId) {
                let query = {
                    paperId: paperId,
                    examId: examId,
                    userId: this.userId,
                    disable: true
                }
                encrypt(query).then(response => {
                    this.$router.push({path: '/info',//rooter配置的name值
                        query:{
                            t: response.content
                        }
                    });
                })
            },
            showStartExam(exam) {
                let curDate = new Date()
                if (exam.statusName === '待考试' && curDate >= new Date(exam.startTime) && curDate <= new Date(exam.endTime)) {
                    return true
                }
                return false;
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
