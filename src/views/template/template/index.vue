<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品sku" prop="sku">
        <el-input
          v-model="queryParams.sku"
          placeholder="请输入商品sku"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="刊登ID" prop="listingId">
        <el-input
          v-model="queryParams.listingId"
          placeholder="请输入刊登ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="问题类型" prop="typeQuestion">
        <el-input
          v-model="queryParams.typeQuestion"
          placeholder="请输入问题类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="处理人" prop="processors">
        <el-input
          v-model="queryParams.processors"
          placeholder="请输入处理人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['template:template:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['template:template:edit']"
        >修改</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="templateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品sku" align="center" prop="sku" />
      <el-table-column label="售前问题" align="center" prop="preQuestions" />
      <el-table-column label="售前回复" align="center" prop="preResponse" />
      <el-table-column label="售前询问时间" align="center" prop="preAskTime" />
      <el-table-column label="售后产品问题/纠纷/差评/侵权问题" align="center" prop="afterQuestions" />
      <el-table-column label="售后回复" align="center" prop="afterResponse" />
      <el-table-column label="售后询问时间" align="center" prop="afterAskTime" />
      <el-table-column label="备注" align="center" prop="supplierResponse" />
      <el-table-column label="订单号" align="center" prop="orderNo" />
      <el-table-column label="刊登ID" align="center" prop="listingId" />
      <el-table-column label="店铺" align="center" prop="storeId" />
      <el-table-column label="问题类型" align="center" prop="typeQuestion" />
      <el-table-column label="记录人" align="center" prop="recorders" />
      <el-table-column label="期望处理结果" align="center" prop="expectResults" />
      <el-table-column label="期望处理时间" align="center" prop="expectTime" />
      <el-table-column label="case处理人" align="center" prop="processors" />
      <el-table-column label="处理状态" align="center" prop="proceStatus" />
      <el-table-column label="最终处理方案" align="center" prop="finalTreatment" />
      <el-table-column label="备注1" align="center" prop="remark1" />
      <el-table-column label="备注2" align="center" prop="remark2" />
      <el-table-column label="标准回复" align="center" prop="standardResponses" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['template:template:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['template:template:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改客服问答SKU收集模板对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品sku" prop="sku">
          <el-input v-model="form.sku" placeholder="请输入商品sku" />
        </el-form-item>
        <el-form-item label="售前问题" prop="preQuestions">
          <el-input v-model="form.preQuestions" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="售前回复" prop="preResponse">
          <el-input v-model="form.preResponse" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="售前询问时间" prop="preAskTime">
          <el-input v-model="form.preAskTime" placeholder="请输入售前询问时间" />
        </el-form-item>
        <el-form-item label="售后产品问题/纠纷/差评/侵权问题" prop="afterQuestions">
          <el-input v-model="form.afterQuestions" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="售后回复" prop="afterResponse">
          <el-input v-model="form.afterResponse" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="售后询问时间" prop="afterAskTime">
          <el-input v-model="form.afterAskTime" placeholder="请输入售后询问时间" />
        </el-form-item>
        <el-form-item label="备注" prop="supplierResponse">
          <el-input v-model="form.supplierResponse" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="刊登ID" prop="listingId">
          <el-input v-model="form.listingId" placeholder="请输入刊登ID" />
        </el-form-item>
        <el-form-item label="店铺" prop="storeId">
          <el-input v-model="form.storeId" placeholder="请输入店铺" />
        </el-form-item>
        <el-form-item label="问题类型" prop="typeQuestion">
          <el-input v-model="form.typeQuestion" placeholder="请输入问题类型" />
        </el-form-item>
        <el-form-item label="记录人" prop="recorders">
          <el-input v-model="form.recorders" placeholder="请输入记录人" />
        </el-form-item>
        <el-form-item label="期望处理结果" prop="expectResults">
          <el-input v-model="form.expectResults" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="期望处理时间" prop="expectTime">
          <el-input v-model="form.expectTime" placeholder="请输入期望处理时间" />
        </el-form-item>
        <el-form-item label="case处理人" prop="processors">
          <el-input v-model="form.processors" placeholder="请输入case处理人" />
        </el-form-item>
        <el-form-item label="最终处理方案" prop="finalTreatment">
          <el-input v-model="form.finalTreatment" placeholder="请输入最终处理方案" />
        </el-form-item>
        <el-form-item label="备注1" prop="remark1">
          <el-input v-model="form.remark1" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注2" prop="remark2">
          <el-input v-model="form.remark2" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="标准回复" prop="standardResponses">
          <el-input v-model="form.standardResponses" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate } from "@/api/template/template.js";

export default {
  name: "Template",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客服问答SKU收集模板表格数据
      templateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sku: null,
        preQuestions: null,
        preResponse: null,
        preAskTime: null,
        afterQuestions: null,
        afterResponse: null,
        afterAskTime: null,
        supplierResponse: null,
        orderNo: null,
        listingId: null,
        storeId: null,
        typeQuestion: null,
        recorders: null,
        expectResults: null,
        expectTime: null,
        processors: null,
        proceStatus: null,
        finalTreatment: null,
        remark1: null,
        remark2: null,
        standardResponses: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询客服问答SKU收集模板列表 */
    getList() {
      this.loading = true;
      listTemplate(this.queryParams).then(response => {
        this.templateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        sku: null,
        preQuestions: null,
        preResponse: null,
        preAskTime: null,
        afterQuestions: null,
        afterResponse: null,
        afterAskTime: null,
        supplierResponse: null,
        orderNo: null,
        listingId: null,
        storeId: null,
        typeQuestion: null,
        recorders: null,
        expectResults: null,
        expectTime: null,
        processors: null,
        proceStatus: null,
        finalTreatment: null,
        remark1: null,
        remark2: null,
        standardResponses: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.sku)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加客服问答SKU收集模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const sku = row.sku || this.ids
      getTemplate(sku).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客服问答SKU收集模板";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.sku != null) {
            updateTemplate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTemplate(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

  }
};
</script>
