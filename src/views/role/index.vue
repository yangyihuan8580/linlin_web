<template>
    <div class="app-container">
        <div class="filter-container">
            <el-space wrap size="small">
                <el-input v-model="listQuery.roleName" placeholder="角色名称" style="width: 200px;" class="filter-item" />
                <el-button class="filter-item" type="primary" @click="handleFilter">
                    <el-icon style="vertical-align: middle;">
                        <search />
                    </el-icon>
                    <span style="vertical-align: middle;"> 搜索 </span>
                </el-button>
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
                    <el-icon style="vertical-align: middle;">
                        <edit />
                    </el-icon>
                    <span style="vertical-align: middle;"> 添加 </span>
                </el-button>
            </el-space>
        </div>
        <div class="data-container">
            <el-table
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                >
                <el-table-column label="角色id" prop="id" align="center"  ></el-table-column>
                <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="handleUpdate(scope.row.id)">
                            编辑
                        </el-button>
                        <el-button type="danger"  size="small" @click="handleDelete(scope.row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :title="title" v-model="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
                <el-form-item label="角色名称：" prop="roleName">
                    <el-input v-model="temp.roleName" :disabled="dialogStatus === 'create' ? false : true" />
                </el-form-item>
                <el-form-item label="关联菜单：">
                    <el-tree
                        :data="tree.menuList"
                        ref="tree"
                        show-checkbox
                        default-expand-all	
                        node-key="id"
                        :default-checked-keys="tree.checkedMenuIdList"
                        :props="defaultProps">
                    </el-tree>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>


<script>
import { addRole, queryList, updateRole, queryOne, deleteRole } from '@/api/role'
import { menu } from '@/api/user'
import { Edit,Search  } from '@element-plus/icons-vue' 

export default {
    components:{ Edit,Search },
    data() {
        return {
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 15,
                roleName: ''
            },
            title: '',
            tree: {
                menuList: [],
                checkedMenuIdList: []
            },
            temp: {
                id: undefined,
                roleName: '',
                menuIds: ''
            },
            defaultProps: {
                children: 'subMenu',
                label: 'name'
            },
            dialogFormVisible: false,
            dialogStatus: '',
            dialogPvVisible: false,
            pvData: [],
            rules: {
                type: [{ required: true, message: 'type is required', trigger: 'change' }],
                timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
                title: [{ required: true, message: 'title is required', trigger: 'blur' }]
            },
            downloadLoading: false
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            queryList(this.listQuery).then(response => {
                if (response.code == 0) {
                    const { content, total } = response
                    this.list = content
                }
            })
        },
        handleFilter() {
            this.getList()
        },
        queryMenu() {
            menu({token : ''}).then(response => {
                if (response.code == 0) {
                    const { content } = response
                    this.tree.menuList = content
                }
            })
        },
        handleCreate() {
            this.tree.checkedMenuIdList = []
            this.temp.id = undefined
            this.temp.roleName = ''
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
            this.title = '创建角色'
            this.queryMenu()
        },
        handleUpdate(id) {
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            this.title = '编辑角色'
            queryOne({id : id}).then(response => {
                if (response.code == 0) {
                    const { content } = response
                    this.temp.id = id
                    this.temp.roleName = content.roleName
                    this.tree.checkedMenuIdList = content.menuIdList
                    this.queryMenu()

                }
            })
        },
        handleDelete(id) {
            this.$confirm('确认要删除数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteRole({id : id}).then(response => {
                    if (response.code == 0) {
                        this.getList();
                    }
                })
            })
        },
        setMenuIds() {
            const checkedNodes = this.$refs.tree.getCheckedNodes()
            let menuIdList = checkedNodes.map(item => {
                return item.id;
            })
            this.temp.menuIds = menuIdList.toString()
        },
        createData() {
            this.setMenuIds()
            addRole(this.temp).then(response => {
                if (response.code == 0) {
                    this.dialogFormVisible = false
                    this.$notify({
                        title: 'Success',
                        message: '添加成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.resetTemp()
                    this.getList()
                }
            })
        },
        updateData() {
            this.setMenuIds()
            updateRole(this.temp).then(response => {
                if (response.code == 0) {
                    this.dialogFormVisible = false
                    this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList();
                }
            })
        },
        resetTemp() {
            this.temp = {
                id: undefined,
                roleName: '',
                menuIdList: []
            }
        },
        
    }
}

</script>