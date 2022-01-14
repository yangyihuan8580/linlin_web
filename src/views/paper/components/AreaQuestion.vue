<template>
    <div class="areaQuestion">
        <div>
            <el-input
                type="textarea"
                show-word-limit
                :autosize="{ minRows: 4, maxRows: 4 }"
                disabled>
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
        }
    },
    data() {
        return {
            type: "areaQuestion",
            areaQuestion: this.initChoice,
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