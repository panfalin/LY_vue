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
        <el-button   type="primary"
                     plain
                     icon="el-icon-plus"
                     size="mini" @click="handleAdd">新增</el-button>

      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        v-loading="loading"
        :data="templateList"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        border
        fit
        :header-cell-style="{background:'#F5F7FA'}"
    >
      <el-table-column type="selection" width="55" align="center" fixed/>
      <el-table-column label="商品sku" align="center" prop="sku" min-width="120" show-overflow-tooltip/>
      <el-table-column label="售前问题" align="center" prop="preQuestions" min-width="200">
        <template #default="{ row }">
          <div class="rich-text-content" v-if="row.preQuestions" v-html="row.preQuestions" @click.stop="handleImageClick"></div>
        </template>
      </el-table-column>
      <el-table-column label="售前回复" align="center" prop="preResponse" min-width="200">
        <template #default="{ row }">
          <div class="rich-text-content" v-if="row.preResponse" v-html="row.preResponse" @click.stop="handleImageClick"></div>
        </template>
      </el-table-column>
      <el-table-column label="售前询问时间" align="center" prop="preAskTime" min-width="120" show-overflow-tooltip/>
      <el-table-column label="售后产品问题" align="center" prop="afterQuestions" min-width="200">
        <template #default="{ row }">
          <div class="rich-text-content" v-if="row.afterQuestions" v-html="row.afterQuestions" @click.stop="handleImageClick"></div>
        </template>
      </el-table-column>
      <el-table-column label="售后回复" align="center" prop="afterResponse" min-width="200">
        <template #default="{ row }">
          <div class="rich-text-content" v-if="row.afterResponse" v-html="row.afterResponse" @click.stop="handleImageClick"></div>
        </template>
      </el-table-column>
      <el-table-column label="售后询问时间" align="center" prop="afterAskTime" min-width="120" show-overflow-tooltip/>
      <el-table-column label="备注" align="center" prop="supplierResponse" min-width="200">
        <template #default="{ row }">
          <div class="rich-text-content" v-if="row.supplierResponse" v-html="row.supplierResponse" @click.stop="handleImageClick"></div>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center" prop="orderNo" min-width="120" show-overflow-tooltip/>
      <el-table-column label="刊登ID" align="center" prop="listingId" min-width="120" show-overflow-tooltip/>
      <el-table-column label="店铺" align="center" prop="storeId" min-width="120" show-overflow-tooltip/>
      <el-table-column label="问题类型" align="center" prop="typeQuestion" min-width="120" show-overflow-tooltip/>
      <el-table-column label="记录人" align="center" prop="recorders" min-width="120" show-overflow-tooltip/>
      <el-table-column label="期望处理结果" align="center" prop="expectResults" min-width="200">
        <template #default="{ row }">
          <div class="rich-text-content" v-if="row.expectResults" v-html="row.expectResults" @click.stop="handleImageClick"></div>
        </template>
      </el-table-column>
      <el-table-column label="期望处理时" align="center" prop="expectTime" min-width="120" show-overflow-tooltip/>
      <el-table-column label="case处理人" align="center" prop="processors" min-width="120" show-overflow-tooltip/>
      <el-table-column label="处理状态" align="center" prop="proceStatus" min-width="120" show-overflow-tooltip/>
      <el-table-column label="最终处理方案" align="center" prop="finalTreatment" min-width="200">
        <template #default="{ row }">
          <div class="rich-text-content" v-if="row.finalTreatment" v-html="row.finalTreatment" @click.stop="handleImageClick"></div>
        </template>
      </el-table-column>
      <el-table-column label="备注1" align="center" prop="remark1" min-width="200">
        <template #default="{ row }">
          <div class="rich-text-content" v-if="row.remark1" v-html="row.remark1" @click.stop="handleImageClick"></div>
        </template>
      </el-table-column>
      <el-table-column label="备注2" align="center" prop="remark2" min-width="200">
        <template #default="{ row }">
          <div class="rich-text-content" v-if="row.remark2" v-html="row.remark2" @click.stop="handleImageClick"></div>
        </template>
      </el-table-column>
      <el-table-column label="标准回复" align="center" prop="standardResponses" min-width="200">
        <template #default="{ row }">
          <div class="rich-text-content" v-if="row.standardResponses" v-html="row.standardResponses" @click.stop="handleImageClick"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click.stop="handleUpdate(scope.row)"
              v-hasPermi="['template:template:edit']"
          >修改</el-button>
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
    <el-popover
        ref="popover"
        trigger="manual"
        :visible.sync="visible"
        width="1200px"
        placement="right"
        style="z-index: 2012;"
        v-clickoutside="handleClose"
    >
      <div class="popover-content" v-click-outside="closePopover">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="商品sku" prop="sku">
                <el-input v-model="form.sku" placeholder="请输入商品sku" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单号" prop="orderNo">
                <el-input v-model="form.orderNo" placeholder="请输入订单号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="刊登ID" prop="listingId">
                <el-input v-model="form.listingId" placeholder="请输入刊登ID" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="店铺" prop="storeId">
                <el-input v-model="form.storeId" placeholder="请输入店铺" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="售前问题" prop="preQuestions">
            <editor v-model="form.preQuestions" :min-height="100" :key="`preQuestions-${editorKey}`" />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="问题类型" prop="typeQuestion">
                <el-input v-model="form.typeQuestion" placeholder="请输入问题类型" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="记录人" prop="recorders">
                <el-input v-model="form.recorders" placeholder="请输入记录人" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="售前回复" prop="preResponse">
            <editor v-model="form.preResponse" :min-height="100" :key="`preResponse-${editorKey}`" />
          </el-form-item>
          <el-form-item label="售前询问时间" prop="preAskTime">
            <el-date-picker
                v-model="form.preAskTime"
                type="date"
                placeholder="请选择售前询问时间"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="售后产品问题" prop="afterQuestions">
            <editor v-model="form.afterQuestions" :min-height="100" :key="`afterQuestions-${editorKey}`" />
          </el-form-item>
          <el-form-item label="售后回复" prop="afterResponse">
            <editor v-model="form.afterResponse" :min-height="100" :key="`afterResponse-${editorKey}`" />
          </el-form-item>
          <el-form-item label="售后询问时间" prop="afterAskTime">
            <el-date-picker
                v-model="form.afterAskTime"
                type="date"
                placeholder="请选择售后询问时间"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="备注" prop="supplierResponse">
            <editor v-model="form.supplierResponse" :min-height="100" />
          </el-form-item>
          <el-form-item label="期望处理结果" prop="expectResults">
            <editor v-model="form.expectResults" :min-height="100" />
          </el-form-item>
          <el-form-item label="期望处理时间" prop="expectTime">
            <el-date-picker
                v-model="form.expectTime"
                type="date"
                placeholder="请选择期望处理时间"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="case处理人" prop="processors">
            <el-input v-model="form.processors" placeholder="请输入case处理人" />
          </el-form-item>
          <el-form-item label="最终处理方案" prop="finalTreatment">
            <editor v-model="form.finalTreatment" :min-height="100" />
          </el-form-item>
          <el-form-item label="备注1" prop="remark1">
            <editor v-model="form.remark1" :min-height="100" />
          </el-form-item>
          <el-form-item label="备注2" prop="remark2">
            <editor v-model="form.remark2" :min-height="100" />
          </el-form-item>
          <el-form-item label="标准回复" prop="standardResponses">
            <editor v-model="form.standardResponses" :min-height="100" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-popover>

    <!-- 图片预览组件 -->
    <div v-if="showPreview" class="image-preview-container" @click="closePreview">
      <img :src="previewUrl" class="preview-image" @click.stop />
    </div>

    <!-- 修改预览面板的头部 -->
    <div class="preview-panel" v-show="previewVisible">
      <el-card class="preview-card" shadow="always">
        <template #header>
          <div class="preview-header">
            <span class="preview-title">数据预览</span>
            <span class="close-icon" @click="previewVisible = false">×</span>
          </div>
        </template>
        <div class="preview-content">
          <div class="preview-item" v-for="(value, key) in previewItems" :key="key">
            <div class="preview-label">{{ value.label }}：</div>
            <div
                :class="['preview-value', {'rich-text-content': value.isRichText}]"
                v-html="previewData[key]"
                v-if="previewData[key]"
                @click="value.isRichText && handleImageClick"
            ></div>
          </div>
        </div>
      </el-card>
    </div>
  </div>


</template>

<script>
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate } from "@/api/template/template.js";
import clickOutside from 'v-click-outside';
import Editor from "@/components/Editor"; // 引入富文本编辑器组件


export default {
  name: "Template",
  directives: {
    clickOutside
  },
  components: {
    Editor
  },
  data() {
    return {
      showFormContainer: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      visible: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客问答SKU收集模板表格数据
      templateList: [],
      // 弹出层标题
      title: "",

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
      rules: {},
      editorKey: 0, // 添加一个用于刷新编辑器的 key
      showPreview: false,
      previewUrl: '',
      previewVisible: false,
      previewTitle: '数据预览',
      previewData: {},
      previewItems: {
        sku: { label: '商品sku' },
        orderNo: { label: '订单号' },
        listingId: { label: '刊登ID' },
        storeId: { label: '店铺' },
        preQuestions: { label: '售前问题', isRichText: true },
        preResponse: { label: '售前回复', isRichText: true },
        preAskTime: { label: '售前询问时间' },
        afterQuestions: { label: '售后产品问题', isRichText: true },
        afterResponse: { label: '售后回复', isRichText: true },
        afterAskTime: { label: '售后询问时间' },
        supplierResponse: { label: '备注', isRichText: true },
        expectResults: { label: '期望处理结果', isRichText: true },
        finalTreatment: { label: '最终处理方案', isRichText: true },
        remark1: { label: '备注1', isRichText: true },
        remark2: { label: '备注2', isRichText: true },
        standardResponses: { label: '标准回复', isRichText: true }
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
      this.visible = false;
      this.reset();
      // 手动清空所有富文本编辑器的内容
      this.clearEditors();
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.visible = true;
      this.title = "添加客服问答SKU收集模板";
      this.editorKey += 1; // 更新 key 值，强制重新渲染编辑器

      // 重置表单数据
      this.form = {
        sku: '',
        preQuestions: '',
        preResponse: '',
        afterQuestions: '',
        afterResponse: '',
        supplierResponse: '',
        expectResults: '',
        finalTreatment: '',
        remark1: '',
        remark2: '',
        standardResponses: '',
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // 先清空表单
      this.reset();
      // 清空富文本编辑器内容
      this.clearEditors();
      // 更新编辑器key，强制重新渲染
      this.editorKey += 1;

      // 延迟一下再获取数据，确保编辑器已经重置
      setTimeout(() => {
        const sId = row.sId;
        getTemplate(sId).then(response => {
          // 显示弹窗
          this.visible = true;
          this.title = "修改客服问答SKU收集模板";

          // 使用 nextTick 确保 DOM 更新后再设置数据
          this.$nextTick(() => {
            this.form = response.data;
          });
        });
      }, 100);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title.includes('修改')) {
            // 修改操作
            updateTemplate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.visible = false;
              this.getList();
            });
          } else {
            // 新增操作
            addTemplate(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.visible = false;
              this.getList();
            });
          }
        }
      });
    },
    closePopover() {
      // console("123===>")
      this.visible = false;
    },
    handleClose() {
      this.visible = false;
    },
    // 新增方法：清空所有富文本编辑器内容
    clearEditors() {
      // 更新编辑器 key
      this.editorKey += 1;

      // 清空所有富文本字段
      const richTextFields = [
        'preQuestions',
        'preResponse',
        'afterQuestions',
        'afterResponse',
        'supplierResponse',
        'expectResults',
        'finalTreatment',
        'remark1',
        'remark2',
        'standardResponses'
      ];

      // 创建新的空表单对象
      const emptyForm = {
        sku: '',
        orderNo: '',
        listingId: '',
        storeId: '',
        typeQuestion: '',
        recorders: '',
        processors: '',
        proceStatus: '',
        preAskTime: null,
        afterAskTime: null,
        expectTime: null
      };

      // 添加空的富文本字段
      richTextFields.forEach(field => {
        emptyForm[field] = '';
      });

      // 更新表单数据
      this.form = emptyForm;

      // 重置表单验证
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetFields();
        }
      });
    },
    // 添加图片预览相关方法
    handleImageClick(e) {
      const target = e.target;
      if (target.tagName.toLowerCase() === 'img') {
        this.previewUrl = target.src;
        this.showPreview = true;
      }
    },

    closePreview() {
      this.showPreview = false;
      this.previewUrl = '';
    },
    /** 处理表格行点击 */
    handleRowClick(row, column, event) {
      // 如果点击的是操作列或者富文本内容中的图片，则不触发预览
      if (column.label === '操作' || event.target.tagName.toLowerCase() === 'img') {
        return;
      }
      this.previewData = JSON.parse(JSON.stringify(row)); // 深拷贝数据
      this.previewVisible = true;
    },
  },
  mounted() {
    // 为所有文本内容添加点击事件监听
    this.$nextTick(() => {
      const richTextContents = document.querySelectorAll('.rich-text-content');
      richTextContents.forEach(content => {
        content.addEventListener('click', this.handleImageClick);
      });
    });
  },
  beforeDestroy() {
    // 移除事件监听
    const richTextContents = document.querySelectorAll('.rich-text-content');
    richTextContents.forEach(content => {
      content.removeEventListener('click', this.handleImageClick);
    });
  }
};
</script>
<style scoped>
.app-container {
  position: relative; /* 确保父元素的定位为相对定位 */
}

/* 修改浮框样式 */
.el-popper.is-light.el-popover {

  right: 0 !important; /* 固定在右侧 */
  top: 0 !important; /* 从顶部开始 */
  height: 100vh; /* 设置高度为视口高度 */
  width: 1200px; /* 设置浮框宽度 */
  z-index: 2012; /* 确保浮框在其他元素之上 */
  margin: 0 !important; /* 清除默认外边距 */
  border-radius: 0; /* 移除圆角 */
  overflow-y: auto; /* 添加垂直滚动条 */
}

.popover-content {
  padding: 20px;
  background-color: #fff;
  height: 100%;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 20px 0;
  border-top: 1px solid #eee;
}

.el-button {
  margin-left: 10px;
}

/* 添加滚动条样式 */
.el-popper.is-light.el-popover::-webkit-scrollbar {
  width: 6px;
}

.el-popper.is-light.el-popover::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.el-popper.is-light.el-popover::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* 富文本编辑器样式调整 */
:deep(.editor-container) {
  margin-bottom: 10px;
}

:deep(.w-e-text-container) {
  min-height: 100px !important;
  max-height: 150px !important;
  overflow-y: auto;
}

/* 直接控制编辑器内容区域的所图片 */
:deep(.w-e-text) img,
:deep(.w-e-text-container) img,
:deep(.w-e-panel-container) img,
:deep(.editor-container) img {
  max-width: 70px !important;
  max-height: 70px !important;
  width: auto !important;
  height: auto !important;
}

/* 控制图片上传面板中的预览图片 */
:deep(.w-e-panel-container) .w-e-panel-tab-content img {
  max-width: 70px !important;
  max-height: 70px !important;
  width: auto !important;
  height: auto !important;
}

/* 控制编辑器工具栏中的图片 */
:deep(.w-e-toolbar) .w-e-menu img {
  max-width: 70px !important;
  max-height: 70px !important;
  width: auto !important;
  height: auto !important;
}

/* 确保所有图片都受到控制 */
:deep([contenteditable="true"]) img {
  max-width: 70px !important;
  max-height: 70px !important;
  width: auto !important;
  height: auto !important;
}

/* 富文本内容在表格中的样式 */
:deep(.rich-text-content) {
  text-align: left;
  line-height: 1.5;
  overflow: visible; /* 移除滚动条 */
  height: auto; /* 自适应高度 */
}

/* 移除富文本中除了图片和文字以外的样式 */
:deep(.rich-text-content *) {
  margin: 0;
  padding: 0;
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  font-family: inherit !important;
}

/* 只保留图片样式 */
:deep(.rich-text-content img) {
  max-width: 70px !important;
  max-height: 70px !important;
  width: auto !important;
  height: auto !important;
  vertical-align: middle;
  display: inline-block;
  margin: 2px;
  cursor: pointer; /* 添加鼠标手型 */
  transition: transform 0.2s; /* 添加过渡效果 */
}

:deep(.rich-text-content img:hover) {
  transform: scale(1.05); /* 鼠标悬停时略微放大 */
}

/* 移除表格中多余的样式 */
:deep(.el-table .cell) {
  padding: 8px;
}

/* 移除悬停效果 */
:deep(.el-table--enable-row-hover .el-table__body tr:hover .rich-text-content) {
  background: none;
}

/* 图片预览弹窗样式 */
:deep(.preview-dialog) {
  background: transparent;
  box-shadow: none;
}

:deep(.preview-dialog .el-dialog__header) {
  padding: 0;
}

:deep(.preview-dialog .el-dialog__body) {
  padding: 0;
  text-align: center;
}

:deep(.preview-dialog .el-dialog__headerbtn) {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2014;
}

:deep(.preview-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
  font-size: 24px;
}

.preview-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}

/* 修改遮罩层样式 */
:deep(.preview-dialog + .v-modal) {
  background-color: rgba(0, 0, 0, 0.8);
}

/* 图片预览容器样式 */
.image-preview-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2999;
  cursor: pointer;
}

.preview-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  cursor: default;
}

/* 富文本内容中的图片样式 */
:deep(.rich-text-content img) {
  max-width: 70px !important;
  max-height: 70px !important;
  width: auto !important;
  height: auto !important;
  vertical-align: middle;
  display: inline-block;
  margin: 2px;
  cursor: pointer;
  transition: transform 0.2s;
}

:deep(.rich-text-content img:hover) {
  transform: scale(1.05);
}

/* 预览弹窗样式 */
:deep(.preview-dialog) {
  margin-top: 15vh;
}

:deep(.preview-dialog .el-dialog__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

:deep(.preview-dialog .el-dialog__body) {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.preview-dialog-content {
  .preview-item {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }

  .preview-label {
    font-weight: bold;
    color: #606266;
    margin-bottom: 8px;
  }

  .preview-value {
    color: #333;
    line-height: 1.5;
  }

  .preview-value.rich-text-content {
    padding: 10px;
    background: #f8f8f8;
    border-radius: 4px;
  }

  :deep(.preview-value.rich-text-content img) {
    max-width: 150px !important;
    max-height: 150px !important;
    margin: 5px;
    border-radius: 4px;
    cursor: pointer;
  }
}

/* 修改滚动条样式 */
:deep(.preview-dialog .el-dialog__body::-webkit-scrollbar) {
  width: 6px;
}

:deep(.preview-dialog .el-dialog__body::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(.preview-dialog .el-dialog__body::-webkit-scrollbar-track) {
  background: #f1f1f1;
}

/* 预览浮框样式 */
:deep(.preview-popover) {
  padding: 0;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 100vh;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.preview-popover-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.close-icon {
  font-size: 24px;  /* 调整字体大小 */
  color: #1e3799;   /* 使用深蓝色 */
  cursor: pointer;
  transition: all 0.3s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f0f5ff;  /* 更浅的背景色 */
  border: 1px solid #d6e4ff;  /* 更浅的边框色 */
  font-weight: bold;         /* 加粗 × 符号 */
  line-height: 1;           /* 调整垂直对齐 */
}

.close-icon:hover {
  background-color: #1e3799;  /* 悬停时使用深蓝色背景 */
  color: #ffffff;
  transform: rotate(90deg);
  border-color: #1e3799;
}

.preview-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.preview-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.preview-label {
  font-weight: bold;
  color: #606266;
  margin-bottom: 8px;
}

.preview-value {
  color: #333;
  line-height: 1.5;
}

.preview-value.rich-text-content {
  padding: 10px;
  background: #f8f8f8;
  border-radius: 4px;
}

:deep(.preview-value.rich-text-content img) {
  max-width: 150px !important;
  max-height: 150px !important;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
}

/* 修改滚动条样式 */
.preview-body::-webkit-scrollbar {
  width: 6px;
}

.preview-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.preview-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* 预览面板样式 */
.preview-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  transition: all 0.3s ease-in-out;
}

.preview-card {
  height: 100%;
  border: none;
  border-radius: 0;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-content {
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 0 10px;
}

.preview-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.preview-label {
  font-weight: bold;
  color: #606266;
  margin-bottom: 8px;
}

.preview-value {
  color: #333;
  line-height: 1.5;
}

.preview-value.rich-text-content {
  padding: 10px;
  background: #f8f8f8;
  border-radius: 4px;
}

:deep(.preview-value.rich-text-content img) {
  max-width: 150px !important;
  max-height: 150px !important;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
}

/* 滚动条样式 */
.preview-content::-webkit-scrollbar {
  width: 6px;
}

.preview-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.preview-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* 添加动画效果 */
.preview-panel-enter-active,
.preview-panel-leave-active {
  transition: transform 0.3s ease-in-out;
}

.preview-panel-enter,
.preview-panel-leave-to {
  transform: translateX(100%);
}

/* 修改预览头部和关闭按钮样式 */
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.preview-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.close-icon {
  font-size: 24px;  /* 调整字体大小 */
  color: #1e3799;   /* 使用深蓝色 */
  cursor: pointer;
  transition: all 0.3s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f0f5ff;  /* 更浅的背景色 */
  border: 1px solid #d6e4ff;  /* 更浅的边框色 */
  font-weight: bold;         /* 加粗 × 符号 */
  line-height: 1;           /* 调整垂直对齐 */
}

.close-icon:hover {
  background-color: #1e3799;  /* 悬停时使用深蓝色背景 */
  color: #ffffff;
  transform: rotate(90deg);
  border-color: #1e3799;
}

/* 移除卡片的默认padding */
:deep(.el-card__header) {
  padding: 0;
  border-bottom: 1px solid #eee;
}

/* 添加以下样式 */
:deep(.el-table) {
  width: 100%;
  margin-bottom: 20px;
}

:deep(.el-table__header) {
  font-weight: bold;
}

:deep(.el-table__header-wrapper) {
  background-color: #F5F7FA;
}

:deep(.el-table__body td) {
  padding: 8px 0;
}

:deep(.el-table .cell) {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}

:deep(.rich-text-content) {
  max-height: 150px;
  overflow-y: auto;
  text-align: left;
  padding: 5px;
}

/* 确保表格横向滚动时表头固定 */
:deep(.el-table__body-wrapper) {
  overflow-x: auto !important;
}

:deep(.el-table__fixed-right) {
  height: 100% !important;
  position: absolute;
  top: 0;
  right: 0;
  box-shadow: -3px 0 6px rgba(0, 0, 0, 0.1);
}

/* 优化表格在小屏幕上的显示 */
@media screen and (max-width: 1400px) {
  :deep(.el-table .cell) {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
