<template>
    <div class="app-container">
        <div class="filter-container">
            <el-space wrap size="small">
                <el-input v-model="listQuery.userName" placeholder="试卷名称" style="width: 200px;" class="filter-item" />
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
                <el-table-column label="试卷名称" prop="paperName" align="center"></el-table-column>
                <el-table-column label="总题目数" prop="topicCount" align="center"></el-table-column>
                <el-table-column label="正确题目数" prop="rightAnswerCount" align="center"></el-table-column>
                <el-table-column label="正确分数" align="center">
                    <template #default="scope">
                        <span style="margin-left: 10px">{{ scope.row.rightAnswerScore }}分</span>
                    </template>
                </el-table-column>
                <el-table-column label="错误题目数" prop="errorAnswerCount" align="center"></el-table-column>
                <el-table-column label="错误分数" prop="errorAnswerScore" align="center">
                     <template #default="scope">
                        <span style="margin-left: 10px">{{ scope.row.errorAnswerScore }}分</span>
                    </template>
                </el-table-column>
                <el-table-column label="最终得分" prop="score" align="center">
                    <template #default="scope">
                        <span style="margin-left: 10px">{{ scope.row.score }}分</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template #default="scope">
                         <el-button type="primary"  size="small" @click="handlerExam(scope.row)">
                            查看详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>



<script>
    import { Edit,Search  } from '@element-plus/icons-vue' 
    import { queryExamByUserId } from '@/api/exam'





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
                userId: 13,
                title: '',
                list: [],
                dialogFormVisible: false,
                dialogStatus: '',
                publishPaperId: undefined
            }
        },
        created() {
            this.queryList(this.userId)
        },
        methods: {
            queryList(id) {
                queryExamByUserId({userId: id}).then(response => {
                    if (response.code == 0) {
                        const { content, total } = response
                        this.list = content
                    }
                })
            },
            
            handleFilter() {
                this.queryList(13)
            },
            handlerExam(row) {
                this.$router.push({path: '/examInfo',//rooter配置的name值
                    query:{
                        paperId: row.paperId,
                        examId: row.id,
                        userId: this.userId,
                        disable: true
                    }
                });
            }
        }
    }
</script>
