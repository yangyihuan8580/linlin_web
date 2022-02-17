<template>
    <div class="fillBlank">
        <div class="answer">
            <el-row>
                  <el-input 
                        
                        class="inputClass"
                        v-for="index in fillBlank.partCount"
                        :key = "index"
                        v-model="inputValue[index - 1]" 
                        @input="changeInput"
                        width="50px"
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
            inputValue: []
        }
    },
    computed() {
        
    },
    mounted() {
        if (this.answer[this.fillBlank.id] != undefined) {
            this.inputValue = this.answer[this.fillBlank.id]
        }
    },
    methods: {
        changeInput() {
            this.answer[this.fillBlank.id] = this.inputValue
        }
    }

}
</script>



<style lang="scss" scoped>

    .fillBlank {
        padding: 5px 5px 5px 5px ;
    
        .inputClass {
            width: 200px;
            margin-right: 8px;
        }

        .answer {
            margin-top: 5px;
            padding-left: 15px;
        }


    }


    

    

</style>