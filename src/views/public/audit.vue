<template>
    <div class="audit">
            <el-row>
                <el-col :span="8" >
                    参考答案: {{ answerDetail.correct == 'null' ? "无": answerDetail.correct }}
                </el-col>
                <el-col :span="8">
                    个人答案: {{ answerDetail.answer }}
                </el-col>
                <el-col :span="8">
                    得分：{{ answerDetail.score }}
                </el-col>
            </el-row>
        
        <div >
            <el-input-number v-if="!disable" v-model="answerDetail.score" :min="0" :max="answerDetail.correctScore" @change="handleChange" />
            <el-image
                v-if="getImageSrc() != null"
                class="answer-image"
                style="width: 25px; height: 25px"
                :src="getImageSrc()"
                fit="fill">
            </el-image>

        </div>
    </div>
</template>


<script>


import {
        Check,
    } from '@element-plus/icons-vue'

    import error from '../../img/error.png'
    import right from '../../img/right.png'

export default {
    name : "audit",
    components:{
        Check
    },
    props: {
        answerDetail: {
            type: Object,
            default: {}
        },
        disable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            errorImg: error,
            rightImg: right,
            src: undefined
        }
    },
    activated() {
      
    },
    mounted() {
    },
    methods: {
        handleChange() {
            if (this.answerDetail.score === this.answerDetail.correctScore) {
                this.answerDetail.proper = 1
            } else {
                this.answerDetail.proper = 2
            }
            this.getImageSrc()
            this.$emit('handlerChange')
        },
        getImageSrc() {
            if (this.answerDetail.proper != null) {
                if (this.answerDetail.proper === 1) {
                    return this.rightImg
                } else if (this.answerDetail.proper === 2){
                    return this.errorImg
                }
            }
            return null
        }
    }
}
</script>


<style lang="scss" scoped>
    .audit {
        width: 100%;
        background: #F2F6FC;
        padding-left: 10px;
        padding-bottom: 5px;
        padding-right: 10px;
    }

    .answer-image {
        float: right;
    }   

</style>