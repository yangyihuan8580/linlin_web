<template>
    <div class="app-container">
        <div class="filter-container">
            <el-space wrap size="large">
                <el-select v-model="paper" placeholder="选择试卷" @change="changePaper">
                    <el-option
                    v-for="item in paperList"
                    :key="item.paperId"
                    :label="item.paperName"
                    :value="item.paperId"
                    >
                    </el-option>
                </el-select>
                <el-select v-model="area" placeholder="选择区域" clearable  @change="changeArea" @clear="changAreaClear">
                    <el-option
                    v-for="item in areaList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="topic" placeholder="选择题目" clearable  @change="changeTopic"  @clear="changTopicClear">
                    <el-option
                    v-for="item in topicList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                    >
                    </el-option>
                </el-select>

                <el-button class="filter-item" type="primary" @click="handleFilter1">
                    <el-icon style="vertical-align: middle;">
                        <search />
                    </el-icon>
                    <span style="vertical-align: middle;"> 搜索 </span>
                </el-button>
            </el-space>
        </div>
        <div class="data-container">
            <chart v-if="showPaper"
                :id="charts.id" 
                height="100%" 
                width="100%" 
                ref="refreshData"
                :type="charts.line"
                :xAxis="charts.xAxis"
                :yAxis="charts.yAxis"
                :data="charts.data"
                :title="charts.title"
            ></chart>
            <el-table
                :data="scoreDetaiList"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                >
                <el-table-column label="学生id" prop="userId" align="center"></el-table-column>
                <el-table-column label="学生姓名" prop="userName" align="center"></el-table-column>
                <el-table-column label="分数" prop="score" align="center"></el-table-column>
            </el-table>

        </div>
    </div>
</template>



<script>
    import { Edit,Search  } from '@element-plus/icons-vue' 
    import Chart from '../echart/echarts'
    import { queryPublishPaper } from '@/api/publishPaper'
    import { queryPaper,statisticByPaperId, statisticByTopicId,statisticByAreaId } from '@/api/paper'
    import { ref } from 'vue'




    export default {
        components:{
            Edit,Search,Chart
        },
        data() {
            return {
                paperList: [],
                areaList: [],
                topicList: [],
                paper: undefined,
                area: undefined,
                topic: undefined,
                scoreDetaiList: [],
                refreshData: undefined,
                showPaper: true,
                xAxis: ['a','b','c','d'],
                data: [1, 2, 3, 4],
                listQuery: {
                    paperName: ''
                },
                charts: {
                    id: 'test',
                    title: '',
                    type: 'bar',
                    xAxis: [],
                    yAxis: {},
                    data: []
                }
            }
        },
        created() {
            this.queryPaperList()
        },
        methods: {
            handleFilter1() {
                this.handleFilter()
                this.handleFilter()
            },
           handleFilter() {
                if (this.topic != null) {
                    statisticByTopicId({paperId: this.paper, areaId: this.area, topicId: this.topic}).then(response => {
                        if (response.code == 0) {
                            this.scoreDetaiList = response.content.detail
                            this.showPaper = true
                            let paperCharts = {
                                id : 'paper',
                                title: '题目分数区间统计',
                                type: 'bar',
                                yAxis: {},
                                xAxis: response.content.xAxis,
                                data: response.content.statistic
                            }
                            this.charts = paperCharts
                            this.$refs.refreshData.drawLine()
                        }
                    })
                } else if (this.area != null) {
                    statisticByAreaId({paperId: this.paper, areaId: this.area}).then(response => {
                        if (response.code == 0) {
                            this.scoreDetaiList = response.content.detail
                            this.showPaper = true
                            let paperCharts = {
                                id : 'paper',
                                title: '区域分数区间统计',
                                type: 'bar',
                                yAxis: {},
                                xAxis: response.content.xAxis,
                                data: response.content.statistic
                            }
                            this.charts = paperCharts
                            this.$refs.refreshData.drawLine()
                        }
                    })
                } else if (this.paper != null)  {
                    statisticByPaperId({paperId: this.paper}).then(response => {
                        if (response.code == 0) {
                            this.scoreDetaiList = response.content.detail
                            this.showPaper = true
                            let paperCharts = {
                                id : 'paper',
                                title: '试卷分数区间统计',
                                type: 'bar',
                                yAxis: {},
                                xAxis: response.content.xAxis,
                                data: response.content.statistic
                            }
                            this.charts = paperCharts
                            this.$refs.refreshData.drawLine()
                        }
                    })
                } else {

                }
           },
           handleClick() {

           },
           changAreaClear() {
               this.area = null
           },
           changTopicClear() {
                this.topic = null
           },
           queryPaperList() {
                queryPublishPaper(this.listQuery).then(response => {
                    if (response.code == 0) {
                        const { content, total } = response 
                        this.paperList = content
                    }
                })
           },
           queryPaper() {
               this.areaList = []
                queryPaper({id : this.paper}).then(response => {
                    if (response.code == 0) {
                        if (response.content.topicAreas != null) {
                            this.areaList = response.content.topicAreas
                        }
                    }
                })
           },
           changePaper() {
               this.queryPaper()
               this.area = undefined
               this.topic = undefined
           },
           changeArea() {
               let temp =  this.areaList.find(t => t.id === this.area)
               if (temp != null) {
                    this.topicList = temp.topics
               } else {
                   this.topicList = []
               }
               this.topic = undefined
           },
           changeTopic() {
               
           }
        }
    }
</script>
