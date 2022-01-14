<template>
    <div class="multipleChoice">
        <div class="answer">
            <el-row>
                <!-- <el-checkbox-group :min="1" :max="2"> -->
                    <el-col v-for="item in multipleChoice.answer" :key="item.label" :span="multipleChoice.config.column">
                        <el-checkbox :label="item.label" disabled>
                            <span v-show="multipleChoice.config.labelHidden">{{item.label}} . </span>
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
    name : "multipleChoice",
    props: {
        initChoice: {
            type: Object,
        }
    },
    data() {
        return {
            type: "multipleChoice",
            multipleChoice: this.initChoice,
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

    .multipleChoice {
        padding: 5px 5px 5px 5px ;
    
    
        .answer {
            margin-top: 5px;
            padding-left: 15px;
        }

    }


    

    

</style>