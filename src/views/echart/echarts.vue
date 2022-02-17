<template>
    <div :id="id" :style="{width: '100%', height: '300px'}"></div>
</template>


<script>

import echarts from 'echarts'

export default {
  name: 'hello',
  data () {
    return {
        
    }
  },
  props: {
    id: {
        type: String,
    },
    title: {
        type: String
    },
    xAxis: {
        type: Array
    },
    yAxis: {
        type: Object,
        default: {}
    },
    type: {
        type: String,
        default: 'bar'
    },
    data: {
        type: Array
    }
  },
  components: {
      echarts
  },
  mounted(){
    this.drawLine();
  },
  methods: {
    drawLine(){
        console.log('va', this.data)

        let myChart = echarts.init(document.getElementById(this.id))
        // 绘制图表
        myChart.setOption({
            title: { text: this.title },
            tooltip: {},
            xAxis: {
                data: this.xAxis
            },
            yAxis: this.yAxis,
            series: [{
                name: '总数',
                type: this.type,
                data: this.data
            }]
        });
    }
  }
}


</script>
