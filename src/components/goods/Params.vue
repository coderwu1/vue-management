<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning" :closable="false" show-icon>
        </el-alert>
        <el-row class="cat_opt">
          <el-col>
            <span>选择商品分类:</span>
            <el-cascader
              v-model="selectedCateKey"
              :options="catList"
              :props="{ expandTrigger: 'hover',value,label}"
              @change="handleChange"></el-cascader>
          </el-col>
        </el-row>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isok" @click="dialogVisible=true">添加参数</el-button>
            <el-table :data="manyTabeDate" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">{{item}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作" >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isok" @click="dialogVisible=true">添加属性</el-button>
            <el-table :data="onlyTabeDate" border stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">{{item}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作" >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDialogClosed"
        >
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
      </el-dialog>

      <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 添加参数的对话框 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Params",
      data() {
          return {
            catList:[],
            value: 'cat_id',
            label: 'cat_name',
            children: 'children',
            selectedCateKey:[],
            activeName:'many',
            manyTabeDate:[],
            onlyTabeDate:[],
            dialogVisible:false,
            // 添加参数的表单数据对象
            addForm: {
              attr_name: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
              attr_name: [
                { required: true, message: '请输入参数名称', trigger: 'blur' }
              ]
            },
            // 控制修改对话框的显示与隐藏
            editDialogVisible: false,
            // 修改的表单数据对象
            editForm: {},
            // 修改表单的验证规则对象
            editFormRules: {
              attr_name: [
                { required: true, message: '请输入参数名称', trigger: 'blur' }
              ]
            },


          }

      },
      created() {
          this.getCateList()
      },
      methods:{
          async getCateList() {
            const {data:res} =await this.$http('categories')
            if(res.meta.status !== 200) {return this.$message.error("获取商品列表失败")}
            this.catList=res.data
            console.log(this.catList)
          },
        async handleChange() {
            this.getParams()
        },
        handleClick() {
            this.getParams()
        },
        async getParams() {
          if(this.selectedCateKey.length !==3){
            this.manyTabeDate=[]
            this.onlyTabeDate=[]
            this.selectedCateKey=[]
            return
          }
          const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
            params:{sel:this.activeName}
          })
          if(res.meta.status !==200){
            return this.$message.error('获取参数列表失败！')
          }
          res.data.forEach(item => {
            item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
            item.inputVisible=false
            item.inputValue=''
          })
          console.log(res.data)
          if(this.activeName === 'many'){
            this.manyTabeDate=res.data
          }else {
            this.onlyTabeDate=res.data
          }
        },
        addDialogClosed() {
          this.$refs.addFormRef.resetFields()
        },
        addParams() {
          this.$refs.addFormRef.validate(async valid => {
            if (!valid) return
            const { data: res } = await this.$http.post(
              `categories/${this.cateId}/attributes`,
              {
                attr_name: this.addForm.attr_name,
                attr_sel: this.activeName
              }
            )

            if (res.meta.status !== 201) {
              return this.$message.error('添加参数失败！')
            }

            this.$message.success('添加参数成功！')
            this.dialogVisible = false
            this.getParams()
          })
        },
        async showEditDialog(attrId) {
          // 查询当前参数的信息
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes/${attrId}`,
            {
              params: { attr_sel: this.activeName }
            }
          )

          if (res.meta.status !== 200) {
            return this.$message.error('获取参数信息失败！')
          }

          this.editForm = res.data
          this.editDialogVisible = true
        },
        // 重置修改的表单
        editDialogClosed() {
          this.$refs.editFormRef.resetFields()
        },
        // 点击按钮，修改参数信息
        editParams() {
          this.$refs.editFormRef.validate(async valid => {
            if (!valid) return
            const { data: res } = await this.$http.put(
              `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
              { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
            )

            if (res.meta.status !== 200) {
              return this.$message.error('修改参数失败！')
            }

            this.$message.success('修改参数成功！')
            this.getParams()
            this.editDialogVisible = false
          })
        },
        async removeParams(attrId) {
          const confirmResult = await this.$confirm(
            '此操作将永久删除该参数, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).catch(err => err)

          // 用户取消了删除的操作
          if (confirmResult !== 'confirm') {
            return this.$message.info('已取消删除！')
          }

          // 删除的业务逻辑
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${attrId}`
          )

          if (res.meta.status !== 200) {
            return this.$message.error('删除参数失败！')
          }

          this.$message.success('删除参数成功！')
          this.getParams()
        },
        async handleInputConfirm(row) {
          if (row.inputValue.trim().length === 0) {
            row.inputValue = ''
            row.inputVisible = false
            return
          }
          // 如果没有return，则证明输入的内容，需要做后续处理
          row.attr_vals.push(row.inputValue.trim())
          row.inputValue = ''
          row.inputVisible = false
          // 需要发起请求，保存这次操作
          this.saveAttrVals(row)
        },
        // 将对 attr_vals 的操作，保存到数据库
        async saveAttrVals(row) {
          // 需要发起请求，保存这次操作
          const { data: res } = await this.$http.put(
            `categories/${this.cateId}/attributes/${row.attr_id}`,
            {
              attr_name: row.attr_name,
              attr_sel: row.attr_sel,
              attr_vals: row.attr_vals.join(' ')
            }
          )

          if (res.meta.status !== 200) {
            return this.$message.error('修改参数项失败！')
          }

          this.$message.success('修改参数项成功！')
        },
        // 删除对应的参数可选项
        handleClose(i, row) {
          row.attr_vals.splice(i, 1)
          this.saveAttrVals(row)
        },
        showInput(row) {
          row.inputVisible=true
          // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        }
      },
      computed:{
          isok() {
            if(this.selectedCateKey.length !== 3){
              return true
            }
              return false
          },
        cateId() {
          if(this.selectedCateKey.length === 3){
            return this.selectedCateKey[2]
          }
          return null
        },
        titleText() {
            if(this.activeName === 'many'){
              return "动态属性"
            }else {
              return "静态参数"
            }
        }
      }
    }
</script>

<style lang="less" scoped>
.cat_opt{
  margin: 15px 0;
}
  .el-tag{
    margin: 10px;
  }
  .input-new-tag{
    width: 120px;
  }
</style>
