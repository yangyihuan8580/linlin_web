<template>
    <div class="singleChoice">
        <div class="answer">
            <el-row>
                <el-col v-for="item in singleChoice.answer" :key="item.label" :span="singleChoice.config.column">
                    <el-radio :label="item.label" disabled> 
                        <span v-show="singleChoice.config.labelHidden">{{item.label}} . </span>
                        {{ item.content }}
                    </el-radio>
                </el-col>
            </el-row>
        </div>
    </div>
</template>



<script>
export default {
    name : "singleChoice",
    props: {
        initChoice: {
            type: Object,
        }
    },
    data() {
        return {
            type: "singleChoice",
            singleChoice: this.initChoice,
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

    .singleChoice {
        padding: 5px 5px 5px 5px ;
    
    
        .answer {
            margin-top: 5px;
            padding-left: 15px;
        }

    }


    

    

</style>