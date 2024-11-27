<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="发送方ID" prop="senderId">
        <el-input
          v-model="queryParams.senderId"
          placeholder="请输入发送方ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接收方ID" prop="receiverId">
        <el-input
          v-model="queryParams.receiverId"
          placeholder="请输入接收方ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联店铺 ID" prop="shopId">
        <el-input
          v-model="queryParams.shopId"
          placeholder="请输入关联店铺 ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消息发送时间" prop="sendTime">
        <el-date-picker clearable
          v-model="queryParams.sendTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择消息发送时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="消息是否已读" prop="isRead">
        <el-input
          v-model="queryParams.isRead"
          placeholder="请输入消息是否已读"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdTime">
        <el-date-picker clearable
          v-model="queryParams.createdTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="自定义字段1" prop="customFieldOne">
        <el-input
          v-model="queryParams.customFieldOne"
          placeholder="请输入自定义字段1"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="自定义字段2" prop="customFieldTwo">
        <el-input
          v-model="queryParams.customFieldTwo"
          placeholder="请输入自定义字段2"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="自定义字段3" prop="customFieldThree">
        <el-input
          v-model="queryParams.customFieldThree"
          placeholder="请输入自定义字段3"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['aliexpress:message:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aliexpress:message:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aliexpress:message:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aliexpress:message:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="messageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="消息ID" align="center" prop="messageId" />
      <el-table-column label="发送方ID" align="center" prop="senderId" />
      <el-table-column label="接收方ID" align="center" prop="receiverId" />
      <el-table-column label="关联店铺 ID" align="center" prop="shopId" />
      <el-table-column label="聊天消息内容" align="center" prop="messageContent" />
      <el-table-column label="消息发送时间" align="center" prop="sendTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.sendTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息是否已读" align="center" prop="isRead" />
      <el-table-column label="创建时间" align="center" prop="createdTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自定义字段1" align="center" prop="customFieldOne" />
      <el-table-column label="自定义字段2" align="center" prop="customFieldTwo" />
      <el-table-column label="自定义字段3" align="center" prop="customFieldThree" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['aliexpress:message:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['aliexpress:message:remove']">删除</el-button>
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

    <!-- 添加或修改消息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="messageRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发送方ID" prop="senderId">
          <el-input v-model="form.senderId" placeholder="请输入发送方ID" />
        </el-form-item>
        <el-form-item label="接收方ID" prop="receiverId">
          <el-input v-model="form.receiverId" placeholder="请输入接收方ID" />
        </el-form-item>
        <el-form-item label="关联店铺 ID" prop="shopId">
          <el-input v-model="form.shopId" placeholder="请输入关联店铺 ID" />
        </el-form-item>
        <el-form-item label="聊天消息内容">
          <editor v-model="form.messageContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="消息发送时间" prop="sendTime">
          <el-date-picker clearable
            v-model="form.sendTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择消息发送时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="消息是否已读" prop="isRead">
          <el-input v-model="form.isRead" placeholder="请输入消息是否已读" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdTime">
          <el-date-picker clearable
            v-model="form.createdTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="自定义字段1" prop="customFieldOne">
          <el-input v-model="form.customFieldOne" placeholder="请输入自定义字段1" />
        </el-form-item>
        <el-form-item label="自定义字段2" prop="customFieldTwo">
          <el-input v-model="form.customFieldTwo" placeholder="请输入自定义字段2" />
        </el-form-item>
        <el-form-item label="自定义字段3" prop="customFieldThree">
          <el-input v-model="form.customFieldThree" placeholder="请输入自定义字段3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Message">
import { listMessage, getMessage, delMessage, addMessage, updateMessage } from "@/api/aliexpress/message";

const { proxy } = getCurrentInstance();

const messageList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    senderId: null,
    receiverId: null,
    shopId: null,
    messageContent: null,
    sendTime: null,
    isRead: null,
    createdTime: null,
    customFieldOne: null,
    customFieldTwo: null,
    customFieldThree: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询消息列表 */
function getList() {
  loading.value = true;
  listMessage(queryParams.value).then(response => {
    messageList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    messageId: null,
    senderId: null,
    receiverId: null,
    shopId: null,
    messageContent: null,
    sendTime: null,
    isRead: null,
    createdTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    customFieldOne: null,
    customFieldTwo: null,
    customFieldThree: null
  };
  proxy.resetForm("messageRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.messageId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加消息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _messageId = row.messageId || ids.value
  getMessage(_messageId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改消息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["messageRef"].validate(valid => {
    if (valid) {
      if (form.value.messageId != null) {
        updateMessage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMessage(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _messageIds = row.messageId || ids.value;
  proxy.$modal.confirm('是否确认删除消息编号为"' + _messageIds + '"的数据项？').then(function() {
    return delMessage(_messageIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aliexpress/message/export', {
    ...queryParams.value
  }, `message_${new Date().getTime()}.xlsx`)
}

getList();
</script>
