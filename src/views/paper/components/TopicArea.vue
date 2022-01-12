<template>
    <div class="topicArea">
        <div class="topicArea-header">
            <div class="topicArea-header-center">
                    {{ name }}
            </div>
            <div class="topicArea-header-right" @click="handlerHidden()">
                <svg v-if="!hidden" t="1641197832095" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1671" width="20px" height="20px"><path d="M512 298.666667c-162.133333 0-285.866667 68.266667-375.466667 213.333333 89.6 145.066667 213.333333 213.333333 375.466667 213.333333s285.866667-68.266667 375.466667-213.333333c-89.6-145.066667-213.333333-213.333333-375.466667-213.333333z m0 469.333333c-183.466667 0-328.533333-85.333333-426.666667-256 98.133333-170.666667 243.2-256 426.666667-256s328.533333 85.333333 426.666667 256c-98.133333 170.666667-243.2 256-426.666667 256z m0-170.666667c46.933333 0 85.333333-38.4 85.333333-85.333333s-38.4-85.333333-85.333333-85.333333-85.333333 38.4-85.333333 85.333333 38.4 85.333333 85.333333 85.333333z m0 42.666667c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z" fill="#444444" p-id="1672"></path></svg>
                <svg v-else t="1641199639831" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1815" width="20px" height="20px"><path d="M332.8 729.6l34.133333-34.133333c42.666667 12.8 93.866667 21.333333 145.066667 21.333333 162.133333 0 285.866667-68.266667 375.466667-213.333333-46.933333-72.533333-102.4-128-166.4-162.133334l29.866666-29.866666c72.533333 42.666667 132.266667 106.666667 183.466667 192-98.133333 170.666667-243.2 256-426.666667 256-59.733333 4.266667-119.466667-8.533333-174.933333-29.866667z m-115.2-64c-51.2-38.4-93.866667-93.866667-132.266667-157.866667 98.133333-170.666667 243.2-256 426.666667-256 38.4 0 76.8 4.266667 110.933333 12.8l-34.133333 34.133334c-25.6-4.266667-46.933333-4.266667-76.8-4.266667-162.133333 0-285.866667 68.266667-375.466667 213.333333 34.133333 51.2 72.533333 93.866667 115.2 128l-34.133333 29.866667z m230.4-46.933333l29.866667-29.866667c8.533333 4.266667 21.333333 4.266667 29.866666 4.266667 46.933333 0 85.333333-38.4 85.333334-85.333334 0-12.8 0-21.333333-4.266667-29.866666l29.866667-29.866667c12.8 17.066667 17.066667 38.4 17.066666 64 0 72.533333-55.466667 128-128 128-17.066667-4.266667-38.4-12.8-59.733333-21.333333zM384 499.2c4.266667-68.266667 55.466667-119.466667 123.733333-123.733333 0 4.266667-123.733333 123.733333-123.733333 123.733333zM733.866667 213.333333l29.866666 29.866667-512 512-34.133333-29.866667L733.866667 213.333333z" fill="#444444" p-id="1816"></path></svg>
            </div>
        </div>
        <div class="topicArea-container">
            <draggable v-model="groupComponents" 
                    :group="elementDraggableConfig.group"  
                    animation="300" 
                    :sort="elementDraggableConfig.sort" 
                    :move="onMove"
                    dragClass="dragClass"  
                    ghostClass="ghostClass" 
                    chosenClass="chosenClass" 
                    @start="onStart" @end="onEnd">
                <transition-group>
                    <div class="item" v-for="item in groupComponents" :key="item.id">{{item.name}}</div>
                </transition-group>
            </draggable>

        </div>
    </div>
</template>

<script>

    import draggable from 'vuedraggable'

    export default {
        name: 'topic-area',
        components:{
            draggable
        },
        data() {
            return {
                textarea: '',
                hidden: false,
                input: '',
                inputHidden: true,
                elementDraggableConfig: {
                    sort: true,
                    group: {
                        name:'group',
                        pull: false,
                        put: true,
                    },
                },
            };
        },
        props: {
            id: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            }
        },
        mounted () { 
        },
        created() {

        },
        methods: {
            handlerHidden() {
                this.hidden = !this.hidden;
            }
        }
    }
</script>



<style lang="scss">

    .topicArea {
        width: 100%;
        border: 1px #D3D3D3 solid;
        border-radius: 5px;
    }

    .topicArea-container {
        width: 100%;
        height: 200px;
        
    }

     .topicArea-header {
        width: 100%;
        height: 35px;
        padding: 8px 5px 5px 15px;
        border-bottom: 1px #D3D3D3 solid;
    }

    .topicArea-header-center {
        width:100%; 
        text-align:center;
    }
    
    .topicArea-header-right { 
        margin-top: -22px;
        float: right;
        padding-right: 8px;
    }


</style>