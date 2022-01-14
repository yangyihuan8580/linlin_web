<template>
    <div class="paper-header">   
        <div class="paper-header-right">
            <el-popconfirm 
                title="返回将丢失当前操作内容，确定要返回吗？"
                @confirm="back()"
            >
                <template #reference>
                    <el-button>返回</el-button>
                </template>
            </el-popconfirm>
            <el-button type="primary" @click="savePaper()">提交</el-button>
        </div>
    </div>
    <div class="paper-info">
        <div class="paper-left">
            <div class="component">
                <div class="component-title">
                    基础元素
                </div>
                <draggable :list="elementComponents" 
                        :group="leftElementDraggableConfig.group"  
                        animation="300" 
                        :sort="leftElementDraggableConfig.sort" 
                        :move="onMove"
                        item-key="id"
                        @end="onEnd"
                        :forceFallback="true"
                        :clone="cloneElement">
                    <template #item="{ element }">
                        <div class="component-item">{{element.name}}</div>
                    </template>
                </draggable>
            </div>
            <div class="component">
                <div class="component-title">
                    组件
                </div>
                <draggable :list="areaComponents" 
                        :group="leftAreaDraggableConfig.group"  
                        animation="300" 
                        :sort="leftAreaDraggableConfig.sort" 
                        :move="onMove"
                        item-key="id"
                        :forceFallback="true"
                        @end="onEnd"
                        :clone="cloneArea"
                        dragClass="dragClass"  
                        ghostClass="ghostClass" 
                        chosenClass="chosenClass">
                    <template #item="{ element }">
                        <div class="component-item">{{ element.title }}</div>
                    </template>
                </draggable>
            </div>
        </div>
        <div class="paper-center">
             <el-scrollbar>
                <div class="paper-title">{{ paper.info.title }}</div>
                <div class="paper-area paper-summary"  v-show="titleChoice" @click="handlerSummaryChoice()">
                    <div class="topic-content"  >
                        <div class="area-header">
                            <div class="area-header-center" >
                                摘要区
                            </div>
                            <div class="area-header-right" @click="handlerDeleteElement(element)">
                                <el-icon size="13px"><delete /></el-icon>                                 
                            </div>
                        </div>
                        <title-area :content="paper.titleArea.content"/>
                    </div> 
                </div>
                <div class="paper-component">
                    <draggable :list="paper.topicAreas" 
                            group="group"
                            animation="300"
                            item-key="id"
                            :forceFallback="true" 
                            :empty-insert-threshold="160"
                            :sort="rightAreaDraggableConfig.sort">
                        <template #item="{ element, index }">
                            <div class="paper-area" >
                                <div class="area-header" @click="handlerAreaChoice(element)">
                                    <div class="area-header-center">
                                        {{ element.title }}
                                    </div>
                                    <div class="area-header-right" @click="handlerDeleteArea(element, index)">
                                        <el-icon  size="15px"><delete /></el-icon>                                        
                                    </div>
                                </div>
                                <div class="topicArea-container" >
                                    <draggable
                                            :list="element.topics" 
                                            group="element"
                                            animation="300" 
                                            item-key="id"
                                            :forceFallback="true"
                                            :sort="rightElementDraggableConfig.sort" 
                                            :empty-insert-threshold="160">
                                        <template #item="{ element, index }">
                                            <div class="topic-content"  >
                                                <div class="element-header">
                                                    <div class="element-header-center" @click="handlerTopicChoice(element, index)">
                                                        {{ index + 1 }}.{{ element.title }}
                                                    </div>
                                                    <div class="element-header-right" @click="handlerDeleteElement(element)">
                                                        <el-icon size="13px"><delete /></el-icon>                                 
                                                    </div>
                                                </div>
                                                <component :is="element.type" :initChoice="element" @click="handlerTopicChoice(element, index)"></component>
                                            </div> 
                                        </template>
                                    </draggable>
                                </div>
                            </div>
                        </template>
                    </draggable>          
                </div>

            </el-scrollbar>

        </div>
        <div class="paper-right">
            <el-scrollbar>
                <div style="text-align:center">操作区</div>
                <div class="right-content">
                    <el-tabs v-model="rightTab" @tab-click="handleTabClick" stretch>
                        <el-tab-pane label="摘要区" name="summaryConfig">
                            <el-descriptions class="margin-top" title="摘要区" :column="1" direction="vertical">
                                <el-descriptions-item label="内容">
                                    <el-input type="textarea" placeholder="请输入内容" v-model="paper.titleArea.content" 
                                            show-word-limit
                                            :autosize="{ minRows: 5, maxRows: 10 }"
                                            @input="changeSummaryTitle">
                                    </el-input>
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-tab-pane>
                        <el-tab-pane label="区域配置" name="areaConfig">
                            <el-descriptions v-show="currentAreaId != ''" class="margin-top" :title="areaConfig.titleNumber" :column="1" direction="vertical">
                                <el-descriptions-item label="标题">
                                    <el-input size="small" placeholder="请输入内容" v-model="areaConfig.title" @input="changeAreaTitle">
                                    </el-input>
                                </el-descriptions-item>
                            </el-descriptions>
                            
                        </el-tab-pane>
                        <el-tab-pane label="元素配置" name="elementConfig">
                            <div v-show="currentTopicId === '0'" >
                                请选择元素
                            </div>
                            <div v-show="currentTopicId != '0'">
                                <el-descriptions class="margin-top" :title="elementConfig.titleNumber" :column="1" direction="vertical">
                                    <el-descriptions-item label="标题">
                                        <el-input size="small" placeholder="请输入内容" v-model="elementConfig.title" @input="changeTitle">
                                        </el-input>
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="!elementConfig.onlyTitle" label="展示label">
                                        <el-switch v-model="elementConfig.labelHidden"  @change="changeLabelHidden"> </el-switch>
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="!elementConfig.onlyTitle" label="排列方式">
                                        <el-radio-group v-model="elementConfig.column" @change="changeColumn">
                                            <el-radio :label="24" >一行</el-radio>
                                            <el-radio :label="12" >两行</el-radio>
                                            <el-radio :label="6" >四行</el-radio>
                                        </el-radio-group>
                                    </el-descriptions-item>
                                    <el-descriptions-item v-if="!elementConfig.onlyTitle" label="选项设置">
                                        <div class="right-config-answer" v-for="(answer, index) in elementConfig.answers" :key="answer.label" >
                                            <el-input class="input-label" size="small"  v-model="answer.label"></el-input>
                                            <el-input class="input-content" size="small" v-model="answer.content"></el-input>
                                            <el-icon @click="removeChoice(index)"><circle-close /></el-icon>
                                        </div>
                                        <el-icon @click="addChoice()"><circle-plus /></el-icon>
                                    </el-descriptions-item>
                                </el-descriptions>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>



<script>
    import TitleArea from './components/TitleArea'
    import draggable from 'vuedraggable'
    import SingleChoice from './components/SingleChoice.vue'
    import MultipleChoice from './components/MultipleChoice.vue'
    import FillBlank from './components/FillBlank.vue'
    import AreaQuestion from './components/AreaQuestion'
    import { Delete, CirclePlus, CircleClose  } from '@element-plus/icons-vue' 
    import { updateLayout,queryPaperAndAnswer } from '@/api/paper'
    import { ElMessage } from 'element-plus'

    

    export default {
        name: 'paper-info',
        components: {
            TitleArea,draggable,SingleChoice,Delete,MultipleChoice,CirclePlus, CircleClose,FillBlank,AreaQuestion
        },
        data() {
            return {
                areaComponents: [
                    {
                        id: "1",
                        type: "area",
                        type: 'topic',
                        title: '区域',
                        topics: []
                    },
                    {
                        id: "2",
                        type: "area",
                        type: 'topic',
                        title: '区域1',
                        topics: []
                                         
                    },
                ],
                elementComponents: [
                    {
                        id: "1",
                        type: "singleChoice",
                        name:'单选题',
                        title: '请输入标题',
                        index: '1',
                        config: {
                            column: 24,
                            labelHidden: true
                        },
                        answer:[{
                                label: 'A',
                                content: '18'
                            },
                            {
                                label: 'B',
                                content: '19'
                            },
                            {
                                label: 'C',
                                content: '20'
                            },
                            {
                                label: 'D',
                                content: '21'
                            }
                        ]
                    },
                    {
                        id: "2",
                        type: "multipleChoice",
                        name: '多选题',
                        config: {
                            column: 24,
                            labelHidden: true
                        },
                        index: '1',
                        title: '请输入标题',
                        answer:[{
                                label: 'A',
                                content: '18'
                            },
                            {
                                label: 'B',
                                content: '19'
                            },
                            {
                                label: 'C',
                                content: '20'
                            },
                            {
                                label: 'D',
                                content: '21'
                            }
                        ]                
                    },
                    {
                        id: "3",
                        type: "fillBlank",
                        name: '填空题',
                        config: {
                            labelHidden: true
                        },
                        index: '1',
                        title: '请输入标题'             
                    },
                    {
                        id: "4",
                        type: "areaQuestion",
                        name: '问答题',
                        index: '1',
                        title: '请输入标题',
                        config: {
                            labelHidden: true
                        }          
                    }
                ],
                leftAreaDraggableConfig: {
                    sort: false,
                    group: {
                        name: 'group',
                        pull: 'clone',
                        put: false,
                    },
                },
                leftElementDraggableConfig: {
                    sort: false,
                    group: {
                        name:'element',
                        pull: 'clone',//是否允许拖入当前组
                        put: false,//是否允许拖出当前组
                    },
                },
                rightAreaDraggableConfig: {
                    sort: true,
                    group: {
                        name:'group',
                        pull: false,
                        put: true,
                    },
                },
                rightElementDraggableConfig: {
                    sort: true,
                    group: {
                        name:'element',
                        pull: false,//是否允许拖入当前组
                        put: true,//是否允许拖出当前组
                    },
                },
                elementConfig: {
                    labelHidden: true,
                    title: '',
                    column: 24,
                    answers: [],
                    titleNumber: '',
                    type: '',
                    onlyTitle: false
                },
                areaConfig: {
                    titleNumber: '',
                    title: ''
                },
                titleConfig: {
                    content: ''
                },
                currentTopicId: '0',
                currentAreaId: '',
                titleChoice: true,
                rightTab: '',
                paperId: '',
                paper: {
                    info: {
                        title: '',
                        id: undefined
                    },
                    titleArea: {
                        content: '',
                        type: 'title'
                    },
                    topicAreas: [

                    ]
                }
            }
        },
        mounted() {
            
        },
        activated() {
            this.paperId = this.$route.query.id
            this.clearPaper()
            this.queryPaperAndAnswerInfo()
        },
        created() {
            
        },
        methods: {
            cloneElement(e) {
                const data = JSON.parse(JSON.stringify(e))
                data.id = new Date().getTime() + "";
                return data;
            },
            cloneArea(e) {
                const data = JSON.parse(JSON.stringify(e))
                data.id = new Date().getTime() + "";
                return data;
            },
            onMove(e,originalEvent){ 
                //console.log(e)
                return true;
            },  
            onStart() {

            },
            onEnd() {

            },
            handlerTopicChoice(topic, index) {
                this.rightTab = 'elementConfig'
                this.currentTopicId = topic.id
                this.elementConfig.title = topic.title
                this.elementConfig.type = topic.type
                if (topic.type === 'singleChoice' || topic.type === 'multipleChoice') {
                    this.elementConfig.labelHidden = topic.config.labelHidden
                    this.elementConfig.answers = topic.answer
                    this.elementConfig.column = topic.config.column
                    this.elementConfig.onlyTitle = false
                } else {
                    this.elementConfig.onlyTitle = true
                }
                this.paper.topicAreas.forEach(area => {
                    const temp = area.topics.find(t => t.id === this.currentTopicId)
                    if (temp != null) {
                        if (topic.type === 'singleChoice') {
                            this.elementConfig.titleNumber = '单选题：  ' + area.title + '-' + (index + 1)
                        } else if (topic.type === 'multipleChoice'){
                            this.elementConfig.titleNumber = '多选题：  ' + area.title + '-' + (index + 1)
                        } else if (topic.type === 'fillBlank') {
                            this.elementConfig.titleNumber = '填空题：  ' + area.title + '-' + (index + 1)
                        }
                    }
                })
            },
            handlerAreaChoice(area) {
                this.rightTab = 'areaConfig'
                this.currentAreaId = area.id
                this.areaConfig.titleNumber = '区域：  ' + area.title 
                this.areaConfig.title = area.title 
            },
            handlerSummaryChoice() {
                this.rightTab = 'summaryConfig'
                this.titleConfig.content = this.paper.titleArea.content
            },
            getSelectedArea() {
                return this.paper.topicAreas.find(area => area.id == this.currentAreaId)
            },
            getSelectedTopic() {
                let result;
                this.paper.topicAreas.forEach(area => {
                    const topic = area.topics.find(t => t.id == this.currentTopicId)
                    if (topic != null) {
                        result = topic
                    }
                })
                return result
            },
            changeAreaTitle(value) {
                const area = this.getSelectedArea()
                area.title = value
            },
            changeLabelHidden(value) {
                const topic = this.getSelectedTopic()
                topic.config.labelHidden = value
            },
            changeTitle(value) {
                const topic = this.getSelectedTopic()
                topic.title = value   
            },
            addChoice() {
                this.elementConfig.answers.push({'label': '', 'content': ''})
            },
            removeChoice(index) {
                this.elementConfig.answers.splice(index, 1)
            },
            changeColumn(value) {
                const topic = this.getSelectedTopic()
                topic.config.column = value
            },
            changeSummaryTitle(value) {
                this.paper.titleArea.content = value
            },
            
            handleTabClick(value) {

            },
            handlerDeleteArea(area, index) {
                this.paper.topicAreas.splice(index, 1)
            },
            handlerDeleteElement(topic) {
                if (this.currentTopicId === topic.id) {
                    this.currentTopicId = '0'
                }
                this.paper.topicAreas.forEach(area => {
                    const index = area.topics.findIndex(t => t.id == topic.id)
                    area.topics.splice(index, 1)
                })
                
            },
            back() {
                this.$router.push({
                    path: "index"
                })
            },
            savePaper() {
                updateLayout(this.paper).then(response => {
                    if (response.code == 0) {
                        ElMessage({
                            message: '修改布局成功',
                            type: 'success',
                        })
                        this.$router.push({
                            path: "index"
                        })
                    }
                })

            },
            queryPaperAndAnswerInfo() {
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
                        this.clearConfig()
                    }
                })
            },
            clearConfig() {
                this.areaConfig = {}
                this.elementConfig = {}
                this.titleConfig = {}
            },
            clearPaper() {
                this.paper.titleArea.content = ''
                this.paper.topicAreas = []
            }
        }
    }
</script>

<style lang="scss" scoped>

    .paper-header {
        width: 100%;
        height: 50px;
        background: #EBEEF5;

        .paper-header-right {
            padding-right: 20px;
            float: right;
            line-height: 50px;
        }
    }


    .paper-info {
        padding-top: 15px;
        display: flex;
        flex-direction: row;
        height: calc(100% - 50px);
        width: calc(100% - 20px);
        position: absolute;
        
    }

    .paper-left {
        height: 100%;
        width: 20%;
    }

    .paper-center {
        width: 60%;
        height: 100%;
        

        .paper-title {
            text-align: center;
            margin-bottom: 10px;
            font-size: 20px;
            font-weight: bold;
        }

        .topicArea-container {
            min-height: 150px;   
            height:auto!important;
        }

        .paper-component {
            height: 100%;
        }

        .paper-summary {
            margin-bottom: 8px;
        }


        .clickClass {
            border: 1px #004680 solid;
        }
    }

    .paper-right {
        width: 20%;
        height: 100%;

        .right-content {
            padding-left: 10px;
            margin-top: 20px;
        }

        .right-config-answer{
            margin-bottom: 10px;
        }
    }

    .paper-area {
        //min-height: 150px;
        border: 1px #D3D3D3 solid;
        padding: 5px;

        .area-header {
            text-align: center;

            .area-header-center {
                display:inline-block;
            }

            .area-header-right {
                display:inline-block;
            }
        }     


        .element-header {

            .element-header-center {
                display:inline-block;
            }

            .element-header-right {
                float: right;
                padding-right: 13px;
                display:inline-block;
            }
        }     
    }

    .paper-area+.paper-area {
        margin-top: 8px;
    }

   
    .component {
        min-height: 150px;
        padding-top: 10px;

        .component-title {
            text-align: center;
            padding-bottom: 10px;
        }

        .component-item {
            padding: 6px 12px;
            margin: 0px 5px 0px 5px;
            border:  solid 1px #eee;
            background-color: #f1f1f1;
        }

        .component-item:hover {
            background-color: #fdfdfd;
            cursor: move;
        }

        .component-item+.component-item{
            border-top: none;
            margin-top: 8px;
        }
    }

    .topic-content {
        padding: 10px;
        background-color: #f1f1f1;
        margin-bottom: 10px;
    }


    .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .click-class {
        background: red;
    }

    .input-label {
        width: 50px;
        margin-right: 8px;
    }

    .input-content {
        width: 150px;
        margin-right: 8px;
    }

</style>


