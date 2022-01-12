<template>
  <div class="header">

      <el-dropdown class="setting">
        <el-icon  size="20px"><setting /></el-icon>
        <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handlerUpdate" >修改密码</el-dropdown-item>
              <el-dropdown-item @click="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>   
      </el-dropdown>
      <span class="userName" >{{ name }}</span>
      
  </div>


  <el-dialog title="修改密码" v-model="dialogFormVisible" >
      <el-form :model="updatePassword" label-position="left" label-width="90px" style="width: 300px; margin-left:50px;">
        <el-form-item label="原密码：" prop="oldPassword">
            <el-input v-model="updatePassword.oldPassword"/>
        </el-form-item>
        <el-form-item label="新密码：" prop="password">
            <el-input v-model="updatePassword.password" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer" style="text-align:center">
          <el-button @click="dialogFormVisible = false">
              取消
          </el-button>
          <el-button type="primary" @click="updatePass()">
              提交
          </el-button>
      </div>
    </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { updatePassword } from '@/api/user'
  import { Setting  } from '@element-plus/icons-vue' 



    export default {
        name: 'layout-header',
        components: {
          Setting 
        },
        data() {
          return {
            dialogFormVisible: false,
            updatePassword: {
              token: '', //const token = this.$store.getters.token;
              oldPassword: '',
              password: ''
            }
          }
        },
        computed: {
          ...mapGetters([
            'name','token'
          ])
        },
        created() {
          
        },
        methods: {
          logout() {
            this.$store.dispatch('user/logout').then(() => {
              location.reload()
            })
          },
          handlerUpdate() {
            this.dialogFormVisible = true
          },
          updatePass() {
            this.updatePassword.token = this.$store.getters.token
            updatePassword(this.updatePassword).then(reponse => {
              if (reponse.code === 0) {
                this.$notify({
                        title: 'Success',
                        message: '密码修改成功',
                        type: 'success',
                        duration: 2000
                    })
                this.dialogFormVisible = false
              }
            })
          }
        }
    }
</script>

<style lang="scss">


  .header {
    float:right;
    line-height: 60px;
    margin-right: 20px;

    // .setting {
    //   padding: 20px 0px;
    // }

    .userName {
      margin-left: 15px;
      font-size: 20px;
    }
  }



</style>