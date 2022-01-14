<template>
    <div class="area">
        <div class="area-container">
            <el-input
                type="textarea"
                show-word-limit
                placeholder="请输入内容"
                :autosize="{ minRows: 3, maxRows: 5}"
                disabled
                v-model="content">
            </el-input>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'title-area',
        data() {
            return {
               
            };
        },
        props: {
            content: {
                type: String,
                default: ''
            }
        },
        mounted () { 
            
        },
        created() {
        },
        methods: {
            
        }
    }
</script>



<style lang="scss">

    .area {
        width: 100%;
        border: 1px #D3D3D3 solid;
        border-radius: 5px;
    }

    .area-header {
        width: 100%;
        height: 35px;
        padding: 8px 5px 5px 15px;
    }

    .area-container {
        width: 100%;
        
    }

    .area-header-right {
        font-size: 20px;
        float: right;
        padding-right: 8px;
    }


</style>