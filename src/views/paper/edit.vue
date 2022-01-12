<template>
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
                        <div class="component-item">{{element.name}}</div>
                    </template>
                </draggable>
            </div>
        </div>
        <div class="paper-center">
             <el-scrollbar>
                <div class="paper-title">调查问卷标题</div>
                <div class="paper-area paper-summary"  v-show="titleChoice">
                    <title-area :titleArea="paper.titleArea"/>
                </div>
                <div class="paper-component">
                    <draggable :list="areas" 
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
                                        {{ element.name }}
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
                                            <div class="topic-content"  @click="handlerTopicChoice(element, index)">
                                                <div class="element-header">
                                                    <div class="element-header-center">
                                                        {{ index + 1 }}.{{ element.title.titleContent }}
                                                    </div>
                                                    <div class="element-header-right" @click="handlerDeleteElement(element, index)">
                                                        <el-icon size="13px"><delete /></el-icon>                                 
                                                    </div>
                                                </div>
                                                <component :is="element.type" :initChoice="element"></component>
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
                        <el-tab-pane label="摘要区" name="summary">用户管理
                            {{ areas }}
                        </el-tab-pane>
                        <el-tab-pane label="区域配置" name="areaConfig">
                            <el-descriptions v-show="currentAreaId != ''" class="margin-top" :title="areaConfig.titleNumber" :column="1" direction="vertical">
                                <el-descriptions-item label="标题">
                                    <el-input size="small" placeholder="请输入内容" v-model="areaConfig.title" @input="changeAreaTitle">
                                    </el-input>
                                </el-descriptions-item>
                                <el-descriptions-item label="展示label">
                                    <el-switch v-model="areaConfig.labelHidden"  @change="changeLabelHidden"> </el-switch>
                                </el-descriptions-item>
                            </el-descriptions>
                            
                        </el-tab-pane>
                        <el-tab-pane label="元素配置" name="elementConfig">
                            <el-descriptions v-show="currentTopicId != ''" class="margin-top" :title="elementConfig.titleNumber" :column="1" direction="vertical">
                                <el-descriptions-item label="标题">
                                    <el-input size="small" placeholder="请输入内容" v-model="elementConfig.title" @input="changeTitle">
                                    </el-input>
                                </el-descriptions-item>
                                <el-descriptions-item label="展示label">
                                    <el-switch v-model="elementConfig.labelHidden"  @change="changeLabelHidden"> </el-switch>
                                </el-descriptions-item>
                                <el-descriptions-item label="排列方式">
                                    <el-radio-group v-model="elementConfig.column" @change="changeColumn">
                                        <el-radio :label="24" >一行</el-radio>
                                        <el-radio :label="12" >两行</el-radio>
                                        <el-radio :label="6" >四行</el-radio>
                                    </el-radio-group>
                                </el-descriptions-item>
                                <el-descriptions-item label="选项设置">
                                    <div class="right-config-answer" v-for="(answer, index) in elementConfig.answers" :key="answer.label" >
                                        <el-input class="input-label" size="small"  v-model="answer.label"></el-input>
                                        <el-input class="input-content" size="small" v-model="answer.content"></el-input>
                                        <el-icon @click="removeChoice(index)"><circle-close /></el-icon>
                                    </div>
                                    <el-icon @click="addChoice()"><circle-plus /></el-icon>
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>



<script>
    import TitleArea from './components/TitleArea'
    import TopicArea from './components/TopicArea'
    import draggable from 'vuedraggable'
    import SingleChoice from './components/SingleChoice.vue'
    import MutipleChoice from './components/MutipleChoice.vue'
    import { Delete, CirclePlus, CircleClose  } from '@element-plus/icons-vue' 
    

    export default {
        name: 'paper-info',
        components: {
            TitleArea,TopicArea,draggable,SingleChoice,Delete,MutipleChoice,CirclePlus, CircleClose
        },
        data() {
            return {
                areaComponents: [
                    {
                        id: "1",
                        type: "area",
                        name: '区域',
                        topics: []
                    },
                    {
                        id: "2",
                        type: "area",
                        name: '区域1',
                        topics: []
                                         
                    },
                ],
                elementComponents: [
                    {
                        id: "1",
                        name: '单选题',
                        type: "singleChoice",
                        config: {
                            column: 24,
                            labelHidden: true
                        },
                        title: {
                            topicIndex: '1',
                            titleContent: '请输入标题'
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
                        type: "mutipleChoice",
                        name: '多选题',
                        config: {
                            column: 24,
                            labelHidden: true
                        },
                        title: {
                            topicIndex: '1',
                            titleContent: '请输入标题'
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
                    titleNumber: ''
                },
                areaConfig: {
                    titleNumber: '',
                    title: ''
                },
                currentTopicId: '',
                currentAreaId: '',
                titleChoice: true,
                rightTab: '',
                areas: [
                    {
                        id: "1",
                        name: '问题区',
                        hidden: false,
                        topics: [
                            {
                                id: "10",
                                name: '单选题',
                                type: 'mutipleChoice',
                                config: {
                                    column: 24,
                                    labelHidden: true
                                },
                                title: {
                                    topicIndex: '1',
                                    titleContent: '请输入标题'
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
                        ]           
                    }
                ],
                topics: [
                    {
                        id: "10",
                        name: '单选题'                        
                    }
                ],
                paper: {
                    titleArea: {
                        id: '',
                        hidden: false,
                        content: ''
                    },
                    topicArea: [
                    {
                        id :"1",
                        name : "aaa"
                    }
                    ]   
                },
                area: {
                    id :"1",
                    name : "aaa"
                }
            }
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
                this.elementConfig.title = topic.title.titleContent
                this.elementConfig.labelHidden = topic.config.labelHidden
                this.elementConfig.answers = topic.answer
                this.elementConfig.column = topic.config.column
                this.areas.forEach(area => {
                    const temp = area.topics.find(t => t.id === this.currentTopicId)
                    if (temp != null) {
                        if (topic.type === 'singleChoice') {
                            this.elementConfig.titleNumber = '单选题：  ' + area.name + '-' + (index + 1)
                        } else if (topic.type === 'mutipleChoice'){
                            this.elementConfig.titleNumber = '多选题：  ' + area.name + '-' + (index + 1)
                        }
                    }
                })
            },
            handlerAreaChoice(area) {
                this.currentAreaId = area.id
                this.rightTab = 'areaConfig'
                this.areaConfig.titleNumber = '区域：  ' + area.name 
                this.areaConfig.title = area.name 
            },
            getSelectedArea() {
                return this.areas.find(area => area.id == this.currentAreaId)
            },
            getSelectedTopic() {
                let result;
                this.areas.forEach(area => {
                    const topic = area.topics.find(t => t.id == this.currentTopicId)
                    if (topic != null) {
                        result = topic
                    }
                })
                return result
            },
            changeAreaTitle(value) {
                const area = this.getSelectedArea()
                area.name = value
            },
            changeLabelHidden(value) {
                const topic = this.getSelectedTopic()
                topic.config.labelHidden = value
            },
            changeTitle(value) {
                const topic = this.getSelectedTopic()
                 console.log(topic)
                topic.title.titleContent = value   
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
            handleTabClick(value) {
                
            },
            handlerDeleteArea(area, index) {
                this.areas.splice(index, 1)
            },
            handlerDeleteElement(element, index) {
                this.areas.forEach(area => {
                    const index = area.topics.findIndex(topic => topic.id == element.id)
                    area.topics.splice(index, 1)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

//  .el-aside {
//     background-color: #d3dce6;
//     color: var(--el-text-color-primary);
//     text-align: center;
//     line-height: 200px;
//   }

    .paper-info {
        display: flex;
        flex-direction: row;
        height: calc(100% - 40px);
        width: calc(100% - 40px);
        position: absolute;

        .paper-left {
            height: 100%;
            width: 20%;
        }

        .paper-center {
            width: 60%;
            height: 100%;
        }

        .paper-right {
            width: 20%;
            height: 100%;
        }

    }


    .paper-info {
        display: flex;
        flex-direction: row;
        height: calc(100% - 40px);
        width: calc(100% - 40px);
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


