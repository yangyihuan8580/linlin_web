<template>
    <div class="areaQuestion">
        <div>
            <el-input
                type="textarea"
                v-model="inputValue"
                @input="changeInput"
                width="100%"
                show-word-limit
                :autosize="{ minRows: 4, maxRows: 4 }"
                :disabled="disable">
            </el-input>
        </div>
    </div>
</template>



<script>
export default {
    name : "areaQuestion",
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
            type: "areaQuestion",
            areaQuestion: this.initChoice,
            inputValue: ''
        }
    },
    created() {
        this.inputValue = this.answer[this.areaQuestion.id]
    },
    
    methods: {
        changeInput() {
            this.answer[this.areaQuestion.id] = this.inputValue
        }
    }

}
</script>



<style lang="scss">

    .singleChoice {
        width: 100%;
        padding: 5px 5px 5px 5px ;
    
    
        .answer {
            margin-top: 5px;
            padding-left: 15px;
        }

    }


    

    

</style>