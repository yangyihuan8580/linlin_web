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
                        <el-form-item :label="getTopicLabel(topic, index)" :prop="topic.id">
                           <component 
                                :is="topic.type" 
                                :answer="answer"
                                :initChoice="topic" 
                                :disable="disable">
                            </component>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item>
                    <el-button v-if="!disable" type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="paper-right">
            
        </div>
    </div>
</template>


<script>

    import { queryPaperAndAnswer, saveAnswer, queryAnswer } from '@/api/paper'
    import { queryOne } from '@/api/user'
    import SingleChoice from '../paper/components/SingleChoice.vue'
    import MultipleChoice from '../paper/components/MultipleChoice.vue'
    import FillBlank from '../paper/components/FillBlank.vue'
    import AreaQuestion from '../paper/components/AreaQuestion'
    import Audit from '../public/audit'
    import { ElMessage } from 'element-plus'


    export default {
        name: 'paperInfo',
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
                disable: false,
                onlyShowError: false
            }
        },
        activated() {
            this.paperId = this.$route.query.paperId
            this.userId = this.$route.query.userId
            this.examId = this.$route.query.examId
            let d = this.$route.query.disable
            if (d === 'true') {
                this.disable = true 
            } else {
                this.disable = false 
            }
            this.queryPaper()
            this.queryUser()
        },
        created() {
            this.paperId = this.$route.query.paperId
            this.userId = this.$route.query.userId
            this.examId = this.$route.query.examId
            let d = this.$route.query.disable
            if (d === 'true') {
                this.disable = true 
            } else {
                this.disable = false 
            }
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
            onSubmit() {
                saveAnswer({
                    paperId: this.paperId,
                    userId: this.userId,
                    examId: this.examId,
                    answerMap: this.answer
                }).then(response => {
                    if (response.code == 0) {
                        this.$confirm('确定要提交试卷内容吗，提交后不可更改', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$router.push({path: '/exam/index'})
                        })
                    }
                })
            },
            onCancel() {
                this.$confirm('退出不会保存当前内容，确认要退出吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({path: '/exam/index'})
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
            height: 100%;
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

