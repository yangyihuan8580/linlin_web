<template>
    <div class="app-container">
        <div class="filter-container">
            <el-space wrap size="small">
                <el-input v-model="listQuery.userName" placeholder="用户名称" style="width: 200px;" class="filter-item" />
                <el-button class="filter-item" type="primary" @click="handleFilter">
                    <el-icon style="vertical-align: middle;">
                        <search />
                    </el-icon>
                    <span style="vertical-align: middle;"> 搜索 </span>
                </el-button>
            </el-space>
            <el-descriptions
                class="margin-top"
                :column="2"
                label="large"
                border
            >
                <el-descriptions-item label="试卷名称">{{ publishPaper.paperName }}</el-descriptions-item>
                <el-descriptions-item label="总分数">{{ publishPaper.score }}</el-descriptions-item>
                <el-descriptions-item label="总人数">{{ publishPaper.count }}</el-descriptions-item>
                <el-descriptions-item label=""></el-descriptions-item>
                <el-descriptions-item label="提交人数">{{ publishPaper.commitCount }}</el-descriptions-item>
                <el-descriptions-item label="未提交人数">{{ publishPaper.count - publishPaper.commitCount }}</el-descriptions-item>
                <el-descriptions-item label="完成审卷人数">{{ publishPaper.auditedCount }}</el-descriptions-item>
                <el-descriptions-item label="未完成审卷人数">{{ publishPaper.count - publishPaper.auditedCount }}</el-descriptions-item>
            </el-descriptions>
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
                <el-table-column label="用户id" prop="id" align="center" width="80px"></el-table-column>
                <el-table-column label="学生名称" prop="userName" align="center"></el-table-column>
                <el-table-column label="总题目数" prop="topicCount" align="center"></el-table-column>
                <el-table-column label="已审题目数" prop="auditedCount" align="center"></el-table-column>
                <el-table-column label="最终得分" prop="score" align="center"></el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template #default="scope">
                         <el-button type="primary"  size="small" @click="handlerExam(scope.row)">
                            审卷
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>



<script>
    import { Edit,Search  } from '@element-plus/icons-vue' 
    import { queryPublishPaper } from '@/api/publishPaper'
    import { queryExamByPublishPaperId } from '@/api/exam'





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
                    userName: ''
                },
                title: '',
                publishPaper: {
                    id: undefined,
                    paperId: undefined,
                    paperName: '',
                    commitCount: '',
                    score: 100
                },
                list: [],
                dialogFormVisible: false,
                dialogStatus: '',
                publishPaperId: undefined
            }
        },
        created() {
            this.publishPaperId = this.$route.query.id
            this.queryExamByPublishPaperId(this.publishPaperId, null)
            this.queryPublishPaper(this.publishPaperId)
        },
        methods: {
            queryPublishPaper(id) {
                queryPublishPaper({id: id}).then(response => {
                    if (response.code == 0) {
                        const { content, total } = response
                        this.publishPaper = content[0]
                    }
                })
            },
            
            handleFilter() {
                this.queryExamByPublishPaperId(this.publishPaperId, this.listQuery.userName)
            },
            handlerExam(row) {
                this.$router.push({path: '/examInfo',//rooter配置的name值
                    query:{
                        paperId: row.paperId,
                        examId: row.id,
                        userId: row.userId
                    }
                });
            },
            queryExamByPublishPaperId(id, userName) {
                queryExamByPublishPaperId({publishPaperId : id, userName: userName}).then(response => {
                    if (response.code == 0) {
                        const { content, total } = response
                        this.list = content
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
