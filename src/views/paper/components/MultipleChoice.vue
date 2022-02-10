<template>
    <div class="multipleChoice">
        <div class="answer">
            <el-checkbox-group 
                    v-model="selectedChoice"
                    @change="changeCheckbox"
                 >
                <el-row>
                    <el-col v-for="item in multipleChoice.answer" :key="item.label" :span="multipleChoice.config.column">
                        <el-checkbox 
                            :label="item.label" 
                            :disabled="disable" >
                            <span v-show="multipleChoice.config.labelHidden">{{item.label}} . </span>
                                {{ item.content }}
                        </el-checkbox>
                    </el-col>
                </el-row>
            </el-checkbox-group>
        </div>
    </div>
</template>



<script>
export default {
    name : "multipleChoice",
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
            default: []
        }
    },
    data() {
        return {
            type: "multipleChoice",
            multipleChoice: this.initChoice,
            selectedChoice: []
        }
    },
    computed() {

    },
    mounted() {
        this.selectedChoice = this.answer[this.multipleChoice.id]
    },
    methods: {
        changeCheckbox() {
            this.answer[this.multipleChoice.id] = this.selectedChoice
        }
    }

}
</script>



<style lang="scss">

    .multipleChoice {
        padding: 5px 5px 5px 5px ;
        width: 100%;
    
    
        .answer {
            margin-top: 5px;
            padding-left: 15px;
        }

    }


    

    

</style>