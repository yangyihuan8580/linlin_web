<template>
    <div class="fillBlank">
        <div class="answer">
            <el-row>
                  <el-input 
                        v-model="inputValue" 
                        @input="changeInput"
                        :disabled="disable"/>
            </el-row>
        </div>
    </div>
</template>



<script>
export default {
    name : "fillBlank",
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
            type: "fillBlank",
            fillBlank: this.initChoice,
            inputValue: ''
        }
    },
    computed() {
        
    },
    mounted() {
        this.inputValue = this.answer[this.fillBlank.id]
    },
    methods: {
        changeInput() {
            this.answer[this.fillBlank.id] = this.inputValue
        }
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