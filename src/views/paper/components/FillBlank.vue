<template>
    <div class="fillBlank">
        <div class="answer">
            <el-row>
                
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
        }
    },
    data() {
        return {
            type: "fillBlank",
            fillBlank: this.initChoice,
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