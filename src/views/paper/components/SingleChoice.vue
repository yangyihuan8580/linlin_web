<template>
    <div class="singleChoice">
        <div class="answer">
            <el-row style="width: 100%">
                <el-col v-for="item in singleChoice.answer" :key="item.label" :span="singleChoice.config.column">
                    <el-radio 
                        :label="item.label" 
                        :disabled="disable"       
                        v-model="selectedChoice"  @change="changeRadio()"         
                    >
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
        },
        disable: {
            type: Boolean,
            default: true
        },
        answer: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            type: "singleChoice",
            singleChoice: this.initChoice,
            selectedChoice: '',
        }
    },
    activated() {
      
    },
    mounted() {
        this.selectedChoice = this.answer[this.singleChoice.id]
    },
    methods: {
        changeRadio() {
            this.answer[this.singleChoice.id] = this.selectedChoice
        }
    }
}
</script>



<style lang="scss">

    .singleChoice {
        padding: 5px 5px 5px 5px ;
        width: 100%;
    
    
        .answer {
            width: 100%;
            margin-top: 5px;
            padding-left: 15px;
        }

    }


    

    

</style>