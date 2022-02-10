<template>
    <div class="app-container">
        <div class="filter-container">
            <el-space wrap size="small">
                <el-input v-model="listQuery.userName" placeholder="用户名称" style="width: 200px;" class="filter-item" />
                <el-select v-model="listQuery.identity" placeholder="类型" clearable style="width: 90px" class="filter-item">
                    <el-option v-for="item in identityOptions" :key="item.key" :label="item.label" :value="item.key" />
                </el-select>
                <el-select v-model="listQuery.sex" placeholder="性别" clearable class="filter-item" style="width: 130px">
                    <el-option v-for="item in sexOptions" :key="item.label" :label="item.label" :value="item.key" />
                </el-select>
                <el-select v-model="listQuery.tagIds" class="filter-item" placeholder="请选择用户身份" multiple >
                        <el-option v-for="item in tagList" :key="item.id" :label="item.tagName" :value="item.id" />
                    </el-select>
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
                ref="singleTableRef"
                style="width: 100%;"
                >
                <el-table-column label="用户id" prop="id" align="center"></el-table-column>
                <el-table-column label="名称" prop="userName" align="center"></el-table-column>
                <el-table-column label="性别" prop="sex" align="center"></el-table-column>
                <el-table-column label="用户类型" prop="identity" align="center"></el-table-column>
                <el-table-column label="用户身份" prop="tagNames" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="300">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="handleUpdate(scope.row.id)">
                            编辑
                        </el-button>
                        <el-button type="danger"  size="small" @click="handleDelete(scope.row.id)">
                            删除
                        </el-button>
                        <el-button type="primary" size="small" @click="handleRole(scope.row.id)">
                            设置角色
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="设置角色" v-model="dialogRoleVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
                <el-form-item label="关联角色：">
                    <el-tree
                        :data="tree.roles"
                        ref="tree"
                        show-checkbox
                        default-expand-all	
                        node-key="id"
                        :default-checked-keys="tree.checkedRoleIds"
                        :props="defaultProps">
                    </el-tree>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                     <el-button @click="dialogRoleVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="insertUserRole()">
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog :title="title" v-model="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
                <el-form-item label="用户名称：" prop="userName">
                    <el-input v-model="temp.userName" :disabled="dialogStatus === 'create' ? false : true" />
                </el-form-item>
                <el-form-item v-if="dialogStatus === 'create'" label="用户密码：" prop="password">
                    <el-input v-model="temp.password" />
                </el-form-item>
                <el-form-item label="用户性别：">
                    <el-select v-model="temp.sex" class="filter-item" placeholder="请选择">
                        <el-option v-for="item in sexOptions" :key="item.key" :label="item.label" :value="item.key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="用户类型：">
                    <el-select v-model="temp.identity" class="filter-item" placeholder="请选择">
                        <el-option v-for="item in identityOptions" :key="item.label" :label="item.label" :value="item.label" />
                    </el-select>
                </el-form-item>
                <el-form-item label="用户标签：">
                    <el-select v-model="temp.tagIds" class="filter-item" placeholder="请选择" multiple >
                        <el-option v-for="item in tagList" :key="item.id" :label="item.tagName" :value="item.id" />
                    </el-select>
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
import { addUser, queryList, updateUser, queryOne, deleteUser, insertUserRole, queryUserRole, queryTagList } from '@/api/user'
import { Edit,Search  } from '@element-plus/icons-vue' 


export default {
    components:{
        Edit,Search
    },
    data() {
        return {
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 15,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: undefined,
                tagIds: []
            },
            title: '',
            singleTableRef:{},
            importanceOptions: [1, 2, 3],
            calendarTypeOptions: [1, 2, 3],
            sexOptions: [{ label: '男', key: 1 }, { label: '女', key: 0 }],
            identityOptions: [{ label: '教师', key: '教师' }, { label: '学生', key: '学生' }],
            temp: {
                id: undefined,
                userName: '',
                sex: '',
                identity: '',
                password: '',
                tagIds: []
            },
            userRole: {
                userId: undefined,
                roleIdList: []
            },
            tree: {
                roles: [],
                checkedRoleIds: []
            },
            defaultProps: {
                children: 'subMenu',
                label: 'roleName'
            },
            tagList: [],
            dialogFormVisible: false,
            dialogStatus: '',
            dialogPvVisible: false,
            dialogRoleVisible: false,
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
        this.queryTagList()
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
        queryTagList() {
            queryTagList(this.listQuery).then(response => {
                if (response.code == 0) {
                    const { content, total } = response
                    this.tagList = content
                }
            })
        },
        handleFilter() {
            this.getList()
        },
        handleCreate() {
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
            this.title = '创建用户'
        },
        handleUpdate(id) {
            console.log(id)
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            this.title = '编辑用户'
            queryOne({id : id}).then(response => {
                if (response.code == 0) {
                    const { content } = response
                    this.temp = content
                }
            })
        },
        handleDelete(id) {
            this.$confirm('确认要删除数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteUser({id : id}).then(response => {
                    if (response.code == 0) {
                        this.getList();
                    }
                })
            })
        },
        handleRole(id) {
            this.dialogRoleVisible = true
            queryUserRole({userId : id}).then(response => {
                if (response.code == 0) {
                    const { content } = response
                    this.tree.roles = content.roles
                    this.tree.checkedRoleIds = content.roleIds
                    console.log(this.tree.checkedRoleIds)
                    this.userRole.userId = id
                }
            })
        },
        insertUserRole() {
            const checkedNodes = this.$refs.tree.getCheckedNodes()
            console.log(checkedNodes)
            let roleIdList = checkedNodes.map(item => {
                return item.id;
            })
            this.userRole.roleIdList = roleIdList
            insertUserRole(this.userRole).then(response => {
                if (response.code == 0) {
                    this.dialogRoleVisible = false
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
        createData() {
            addUser(this.temp).then(response => {
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
            if (this.temp.sex === '男') {
                this.temp.sex = 1
            }
            if (this.temp.sex === '女') {
                this.temp.sex = 0
            }
            updateUser(this.temp).then(response => {
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
                userName: '',
                sex: '',
                identity: '',
                password: '',
                tagIds: []
            }
        },
        
    }
}

</script>