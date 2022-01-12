<template>
    <div class="mutipleChoice">
        <div class="answer">
            <el-row>
                <!-- <el-checkbox-group :min="1" :max="2"> -->
                    <el-col v-for="item in mutipleChoice.answer" :key="item.label" :span="mutipleChoice.config.column">
                        <el-checkbox :label="item.label" disabled>
                            <span v-show="mutipleChoice.config.labelHidden">{{item.label}} . </span>
                                {{ item.content }}
                        </el-checkbox>
                    </el-col>
                <!-- </el-checkbox-group> -->
            </el-row>
        </div>
    </div>
</template>



<script>
export default {
    name : "mutipleChoice",
    props: {
        initChoice: {
            type: Object,
        }
    },
    data() {
        return {
            type: "mutipleChoice",
            mutipleChoice: this.initChoice,
        }
    },
    computed() {

    },
    mounted() {
        
    },
    methods: {
        
    }

}
</script>



<style lang="scss">

    .mutipleChoice {
        padding: 5px 5px 5px 5px ;
    
    
        .answer {
            margin-top: 5px;
            padding-left: 15px;
        }

    }


    

    

</style>