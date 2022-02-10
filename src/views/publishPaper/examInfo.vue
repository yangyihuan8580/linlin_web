-+
.<template>
    <div class="paper-constainer">
        <div class="paper-left">
                
        </div>
        <div class="paper-center">
            <div class="paper-title">
                {{ paper.info.title }}
            </div>
            <div class="paper-summary">
                {{ paper.titleArea.content }}
            </div>
            <el-form :model="answer" label-position="top" >
                <div v-for="topicArea in paper.topicAreas" :key="topicArea.id">
                    <div class="area-title">
                        {{ topicArea.title }}
                    </div>
                    <div v-for="(topic, index) in topicArea.topics" :key="topic.id">
                        <el-form-item v-if="getOnlyErrorShow(answerDetail[topic.id])" :label="getTopicLabel(topic, index)" :prop="topic.id">
                           <component 
                                :is="topic.type"
                                :answer="answer"
                                :initChoice="topic"
                                :disable="true">
                            </component>

                            <audit :answerDetail="answerDetail[topic.id]" @handlerChange="handlerChange" />
                        </el-form-item>
                    </div>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="paper-right">
            <el-affix :offset="120" >
                <div>
                    <div>
                        <el-button @click="onlyShowError = false">展示所有题目</el-button>
                        <el-button @click="onlyShowError = true">展示未批题目</el-button>
                    </div>
                    <el-descriptions
                        class="margin-top"
                        title="成绩信息"
                        :column="1"
                        size="large"
                    >
                        <el-descriptions-item label="学生姓名：">{{ user.userName }}</el-descriptions-item>
                        <el-descriptions-item label="分数：">{{ examAnswerStatistic.score }}</el-descriptions-item>
                        <el-descriptions-item label="题目数：">{{ examAnswerStatistic.topicCount }}</el-descriptions-item>
                        <el-descriptions-item label="已审核题目数：">{{ examAnswerStatistic.auditedCount }}</el-descriptions-item>
                        <el-descriptions-item label="未审核题目数：">{{ examAnswerStatistic.notReviewCount }}</el-descriptions-item>
                        <el-descriptions-item label="正确题目数：">{{ examAnswerStatistic.rightAnswerCount }}</el-descriptions-item>
                        <el-descriptions-item label="错误题目数：">{{ examAnswerStatistic.errorAnswerCount }}</el-descriptions-item>
                    </el-descriptions>
                </div>
            </el-affix>
        </div>
    </div>
</template>


<script>

    import { queryPaperAndAnswer, saveAnswer, queryAnswer } from '@/api/paper'
    import { queryOne } from '@/api/user'
    import { commitExam } from '@/api/exam'
    import SingleChoice from '../paper/components/SingleChoice.vue'
    import MultipleChoice from '../paper/components/MultipleChoice.vue'
    import FillBlank from '../paper/components/FillBlank.vue'
    import AreaQuestion from '../paper/components/AreaQuestion'
    import Audit from '../public/audit'
    import { ElMessage } from 'element-plus'


    export default {
        name: 'examInfo',
        components: {
            SingleChoice,MultipleChoice,FillBlank,AreaQuestion, Audit
        },
        data() {
            return {
                answer:{
                    
                },
                answerDetail: {

                },
                examAnswerStatistic: {
                    score: 0,
                    topicCount: 0,
                    auditedCount: 0,
                    notReviewCount: 0,
                    rightAnswerCount: 0,
                    errorAnswerCount: 0
                },
                paper: {
                    info: {
                        title: '问卷调查',
                        id: undefined,
                        type: undefined
                    },
                    titleArea: {
                        content: '',
                        type: 'title'
                    },
                    topicAreas: [

                    ],
                    referenceAnswers: {

                    }
                },
                user: {

                },
                paperId: undefined,
                userId: undefined,
                examId: undefined,
                publishPaperId: undefined,
                onlyShowError: false
            }
        },
        activated() {
            this.paperId = this.$route.query.paperId
            this.userId = this.$route.query.userId
            this.examId = this.$route.query.examId
            this.queryPaper()
            this.queryUser()
        },
        created() {
            this.paperId = this.$route.query.paperId
            this.userId = this.$route.query.userId
            this.examId = this.$route.query.examId
            this.queryPaper()
            this.queryUser()
        },
        methods: {
            queryPaper() {
                queryPaperAndAnswer({id : this.paperId}).then(response => {
                    if (response.code == 0) {
                        if (response.content.info != null) {
                            this.paper.info = response.content.info
                        }
                        if (response.content.titleArea != null) {
                            this.paper.titleArea = response.content.titleArea
                        }
                        if (response.content.topicAreas != null) {
                            this.paper.topicAreas = response.content.topicAreas
                        }
                        if (response.content.referenceAnswers != null) {
                            this.paper.referenceAnswers = response.content.referenceAnswers
                        }
                    }
                })
                queryAnswer({paperId : this.paperId, userId: this.userId, examId: this.examId})
                    .then(response => {
                        if (response.code == 0) {
                            this.answer = response.content.answerMap
                            this.answerDetail = response.content.examDetailMap
                            this.publishPaperId = response.content.publishPaperId
                            this.handlerChange()
                        }
                    })
            },
            getTopicLabel(topic, index) {
                if (this.paper.info.type === 2) {
                    return (index + 1) + '.' + topic.title + '   (' + topic.score + '分)'
                } else {
                    return (index + 1) + '.' + topic.title
                }
            },
            queryUser() {
                queryOne({id : this.userId}).then(response => {
                    if (response.code == 0) {
                        const { content } = response
                        this.user = content
                    }
                })
            },
            getOnlyErrorShow(answerDetail) {
                if (this.onlyShowError) {
                    return answerDetail.proper === 0
                } else {
                    return true;
                }
            },
            handlerChange() {
                this.examAnswerStatistic = {
                    score: 0,
                    auditedCount: 0,
                    notReviewCount: 0,
                    rightAnswerCount: 0,
                    errorAnswerCount: 0,
                    topicCount: 0
                }
                for(var topicId in this.answerDetail) {
                    let detail = this.answerDetail[topicId];
                    if (detail.proper != 0) {
                        if (detail.score === detail.correctScore) {
                            this.examAnswerStatistic.rightAnswerCount += 1
                        } else {
                            this.examAnswerStatistic.errorAnswerCount += 1
                        }
                        this.examAnswerStatistic.score += detail.score
                        this.examAnswerStatistic.auditedCount += 1
                    } else {
                        this.examAnswerStatistic.notReviewCount += 1
                    }
                    this.examAnswerStatistic.topicCount += 1
                }
            },
            commitExam() {
                let exam = {
                    examId: this.examId,
                    score: this.examAnswerStatistic.score,
                    topicCount: this.examAnswerStatistic.topicCount,
                    auditedCount: this.examAnswerStatistic.auditedCount,
                    notReviewCount: this.examAnswerStatistic.notReviewCount,
                    rightAnswerCount: this.examAnswerStatistic.rightAnswerCount,
                    errorAnswerCount: this.examAnswerStatistic.errorAnswerCount,
                    examDetailMap: this.answerDetail
                }
                commitExam(exam).then(response => {
                    if (response.code == 0) {
                        ElMessage({
                            message: '提交成功',
                            type: 'success',
                        })
                    }
                })
            },      
            onSubmit() {
                this.commitExam();
            },
            onCancel() {
                this.$confirm('退出不会保存当前内容，确认要退出吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({path: '/publishPaper/examination',
                     query:{
                        id : this.publishPaperId
                    }});
                })   
            }
        }
    }

</script>

<style lang="scss" scoped>

    .paper-constainer {

        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        position: absolute;
        //background: #F2F6FC;


        .paper-left {
            width: 20%;
            background: #F2F6FC;
        }

        .paper-tab {
            width: 100%;
            float:right;
        }
        
        .paper-center {
            width: 50%;
            margin: auto;
            padding-top: 20px;

            .paper-title {
                text-align: center;
                font-size: 21px;
                font-weight: bold;
            }

            .paper-summary {
                padding-top: 20px;
                width: 100%;
                word-break: break-word;
                text-indent:2em;
                padding-bottom: 10px;
            }
            


            .area-title {
                text-align: center;
                font-size: 19px;
                font-weight: bold;
            }
        }


        .paper-right{
            left: right;
            width: 20%;
            padding-top: 20px;

            .paper-affix {
                background: #F2F6FC;
            }
        }
    }

</style>

