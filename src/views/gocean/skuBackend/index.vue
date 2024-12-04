<template>
  <div class="component-manager">
    <el-tabs v-model="activeTab" class="management-tabs" type="border-card" @tab-change="handleTabChange">
      <el-tab-pane label="分类管理" name="category">
        <el-card class="category-section">
          <template #header>
            <div class="card-header">
              <span>分类管理</span>
              <el-button type="primary" @click="openCategoryDialog()">添加分类</el-button>
            </div>
          </template>

          <el-table
            :data="paginatedCategories"
            style="width: 100%"
            height="calc(100vh - 200px)"
            :header-cell-style="{ background: '#f5f7fa' }"
            row-key="category_id"
          >
            <el-table-column
              prop="category_name"
              label="分类名称"
            />
            <el-table-column
              prop="sort"
              label="排序"
              width="100"
            >
              <template #default="{ row, $index }">
                <div class="sort-cell">
                  <el-icon
                    class="drag-handle"
                    @mousedown="handleDragStart($index, row)"
                  >
                    <Rank />
                  </el-icon>
                  <span>{{ row.sort }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="primary" link @click="openCategoryDialog(row)">编辑</el-button>
                <el-button type="danger" link @click="deleteCategory(row.category_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              v-model="categoryPagination.currentPage"
              :page-size="categoryPagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="categories.length"
              @size-change="handleCategorySizeChange"
              @current-change="handleCategoryCurrentChange"
            />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="组件管理" name="component">
        <el-card class="component-section">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <span>组件管理</span>
                <el-select
                  v-model="selectedCategoryId"
                  placeholder="选择分类"
                  clearable
                  style="margin-left: 20px; width: 200px;"
                  @change="handleComponentCategoryChange"
                >
                  <el-option
                    label="全部组件"
                    :value="0"
                  />
                  <el-option
                    v-for="category in sortedCategories"
                    :key="category.category_id"
                    :label="category.category_name"
                    :value="category.category_id"
                  />
                </el-select>

                <el-select
                  v-model="selectedSearchComponent"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="搜索组件名称/编码/SKU"
                  :remote-method="handleSearchComponent"
                  :loading="searchLoading"
                  clearable
                  style="margin-left: 20px; width: 300px;"
                  @change="handleSearchSelect"
                >
                  <el-option
                    v-for="item in searchResults"
                    :key="item.component_id"
                    :label="`${item.component_name} (${item.component_code})`"
                    :value="item.component_id"
                  >
                    <div class="search-option">
                      <div class="option-main">
                        <div class="option-title">
                          <span>{{ item.component_name }}</span>
                          <el-tag size="small" type="info">{{ item.component_code }}</el-tag>
                        </div>
                        <div class="option-sub">
                          <span v-if="item.sku">SKU: {{ item.sku }}</span>
                          <span v-if="item.sku_name">{{ item.sku_name }}</span>
                        </div>
                      </div>
                      <div class="option-category">
                        {{ getCategoryName(item.category_id) }}
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </div>
              <div>
                <el-button
                  type="success"
                  @click="$router.push('/components')"
                >
                  查看组件展示
                </el-button>
                <el-button type="primary" @click="openComponentDialog()">添加组件</el-button>
              </div>
            </div>
          </template>

          <el-table
            ref="componentTableRef"
            :data="paginatedComponents"
            style="width: 100%"
            height="calc(100vh - 200px)"
            :header-cell-style="{ background: '#f5f7fa' }"
            :header-row-style="{ position: 'sticky', top: 0, zIndex: 1 }"
          >
            <el-table-column
              prop="component_name"
              label="组件名称"
              fixed
            />
            <el-table-column
              prop="component_code"
              label="组件编码"
              fixed
            />
            <el-table-column
              prop="bom_number"
              label="BOM单编号"
            />
            <el-table-column
              prop="sku"
              label="商品编码"
            />
            <el-table-column
              prop="sku_name"
              label="商品名称"
            />
            <el-table-column
              prop="cost"
              label="成本"
            />
            <el-table-column
              label="图片"
              align="center"
              width="120"
              fixed
            >
              <template #default="{ row }">
                <el-popover
                  effect="light"
                  trigger="hover"
                  placement="right"
                  width="auto"
                >
                  <template #default>
                    <el-image
                      :src="row.image_url"
                      style="width: 200px;"
                      fit="contain"
                    />
                  </template>
                  <template #reference>
                    <el-image
                      :src="row.image_url"
                      style="width: 50px;"
                      fit="contain"
                    />
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              label="展示图片"
              align="center"
              width="120"
              fixed
            >
              <template #default="{ row }">
                <el-popover
                  effect="light"
                  trigger="hover"
                  placement="right"
                  width="auto"
                >
                  <template #default>
                    <el-image
                      :src="row.show_image_url"
                      style="width: 200px;"
                      fit="contain"
                    />
                  </template>
                  <template #reference>
                    <el-image
                      :src="row.show_image_url"
                      style="width: 50px;"
                      fit="contain"
                    />
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              label="所属分类"
              fixed
            >
              <template #default="{ row }">
                {{ getCategoryName(row.category_id) }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              width="150"
            >
              <template #default="{ row }">
                <el-button type="primary" link @click="openComponentDialog(row)">编辑</el-button>
                <el-button type="danger" link @click="deleteComponent(row.component_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              v-model="componentPagination.currentPage"
              :page-size="componentPagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalFilteredComponents"
              @size-change="handleComponentSizeChange"
              @current-change="handleComponentCurrentChange"
            />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="组件关系管理" name="relation">
        <el-card class="relation-section">
          <template #header>
            <div class="card-header">
              <span>组件关系管理</span>
              <div class="header-right">
                <div class="filter-section">
                  <el-select
                    v-model="relationFilter.categoryId"
                    placeholder="选择分类"
                    clearable
                    style="width: 180px; margin-right: 10px;"
                    @change="handleRelationFilterChange"
                  >
                    <el-option
                      v-for="category in sortedCategories"
                      :key="category.category_id"
                      :label="category.category_name"
                      :value="category.category_id"
                    />
                  </el-select>
                  <el-select
                    v-model="relationFilter.relationType"
                    placeholder="关系类型"
                    clearable
                    style="width: 120px; margin-right: 10px;"
                    @change="handleRelationFilterChange"
                  >
                    <el-option label="包含" value="contain" />
                    <el-option label="依赖" value="depend" />
                    <el-option label="替代" value="alternative" />
                  </el-select>
                  <el-select
                    v-model="selectedSearchComponent"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="搜索组件名称/编码"
                    :remote-method="handleSearchComponent"
                    :loading="searchLoading"
                    clearable
                    style="margin-left: 20px; width: 300px;"
                    @change="handleSearchSelect"
                  >
                    <el-option
                      v-for="item in searchResults"
                      :key="item.component_id"
                      :label="`${item.component_name} (${item.component_code})`"
                      :value="item.component_id"
                    >
                      <div class="search-option">
                        <div class="option-main">
                          <div class="option-title">
                            <span>{{ item.component_name }}</span>
                            <el-tag size="small" type="info">{{ item.component_code }}</el-tag>
                          </div>
                          <div class="option-sub">
                            <span v-if="item.sku">SKU: {{ item.sku }}</span>
                            <span v-if="item.sku_name">{{ item.sku_name }}</span>
                          </div>
                        </div>
                        <div class="option-category">
                          {{ getCategoryName(item.category_id) }}
                        </div>
                      </div>
                    </el-option>
                  </el-select>
                </div>
                <el-cascader
                  v-model="selectedRelationPath"
                  :options="relationTreeOptions"
                  :props="{
                    checkStrictly: true,
                    label: 'label',
                    value: 'value',
                    children: 'children',
                    multiple: true
                  }"
                  placeholder="选择组件查看关系"
                  style="width: 400px; margin-right: 20px;"
                  clearable
                  @change="handleRelationPathChange"
                />
                <el-button
                  type="danger"
                  :disabled="selectedRelations.length === 0"
                  @click="batchDeleteRelations"
                >
                  批量删除
                </el-button>
                <el-button type="primary" @click="openRelationDialog()">添加关系</el-button>
                <el-button
                  type="primary"
                  @click="$router.push('/topology')"
                  style="margin-right: 10px;"
                >
                  查看拓扑图
                </el-button>
              </div>
            </div>
          </template>

          <el-table
            :data="relations"
            style="width: 100%"
            height="calc(100vh - 260px)"
            :header-cell-style="{ background: '#f5f7fa' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="parent_component_name" label="父组件" />
            <el-table-column
              label="父组件图片"
              align="center"
              width="120"
              fixed
            >
              <template #default="{ row }">
                <el-popover
                  effect="light"
                  trigger="hover"
                  placement="right"
                  width="auto"
                >
                  <template #default>
                    <el-image
                      :src="row.parent_image_url"
                      style="width: 200px;"
                      fit="contain"
                    />
                  </template>
                  <template #reference>
                    <el-image
                      :src="row.parent_image_url"
                      style="width: 50px;"
                      fit="contain"
                    />
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              label="子组件图片"
              align="center"
              width="120"
            >
              <template #default="{ row }">
                <el-popover
                  effect="light"
                  trigger="hover"
                  placement="right"
                  width="auto"
                >
                  <template #default>
                    <el-image
                      :src="row.child_image_url"
                      style="width: 200px;"
                      fit="contain"
                    />
                  </template>
                  <template #reference>
                    <el-image
                      :src="row.child_image_url"
                      style="width: 50px;"
                      fit="contain"
                    />
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="child_component_name" label="子组件" />
            <el-table-column prop="relation_type" label="关系类型">
              <template #default="{ row }">
                {{ relationTypeMap[row.relation_type] }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="danger" link @click="deleteRelation(row.parent_component_id, row.child_component_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 添加分页组件 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="relationPagination.currentPage"
              v-model:page-size="relationPagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="relationPagination.total"
              @size-change="handleRelationSizeChange"
              @current-change="handleRelationCurrentChange"
            />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-model="categoryDialog.visible"
      :title="categoryDialog.isEdit ? '编辑分类' : '添加分类'"
    >
      <el-form :model="categoryForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.category_name" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="categoryForm.sort" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitCategory">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
        v-model="componentDialog.visible"
        :title="componentDialog.isEdit ? '编辑组件' : '添加组件'"
        width="60%"
    >
    <el-form
        :model="componentForm"
        :rules="componentRules"
        ref="componentFormRef"
        label-width="100px"
    >
        <el-form-item label="组件名称" prop="component_name">
        <el-input v-model="componentForm.component_name" />
        </el-form-item>
        <el-form-item label="组件编码" prop="component_code">
        <el-input v-model="componentForm.component_code" />
        </el-form-item>
        <el-form-item label="商品编码">
          <el-select
            v-model="selectedSkuCategory"
            placeholder="选择商品类别"
            @change="handleSkuCategoryChange"
            style="width: 200px; margin-right: 10px;"
          >
            <el-option
              v-for="category in skuCategories"
              :key="category.category"
              :label="category.category"
              :value="category.category"
            />
          </el-select>
          <el-select
            v-model="componentForm.sku"
            placeholder="选择商品编码"
            :disabled="!selectedSkuCategory"
            style="width: calc(100% - 320px);"
            @change="handleSkuChange"
          >
            <el-option
              v-for="sku in skuList"
              :key="sku.sku"
              :label="`${sku.sku} - ${sku.sku_name}`"
              :value="sku.sku"
            />
          </el-select>
          <el-button
            type="danger"
            link
            style="margin-left: 10px;"
            @click="clearSkuInfo"
          >
            清除商品信息
          </el-button>
        </el-form-item>
        <el-form-item label="BOM单编号">
          <el-input
            v-model="componentForm.bom_number"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            disabled
          />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input
            v-model="componentForm.sku_name"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            disabled
          />
        </el-form-item>
        <el-form-item label="成本">
          <el-input-number
            v-model="componentForm.cost"
            :precision="2"
            :step="0.01"
            :min="0"
            disabled
          />
        </el-form-item>
        <el-form-item label="所属分类" prop="category_id">
        <el-select v-model="componentForm.category_id">
            <el-option
            v-for="category in sortedCategories"
            :key="category.category_id"
            :label="category.category_name"
            :value="category.category_id"
            />
        </el-select>
        </el-form-item>
        <el-form-item label="图片">
            <div class="images-container">
                <div class="image-upload-container">
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        :auto-upload="false"
                        :show-file-list="false"
                        :on-change="handleImageChange"
                        :on-drop="handleImageDrop"
                        drag
                        accept="image/*"
                    >
                        <template #default>
                            <div class="image-wrapper">
                                <img
                                    v-if="componentForm.image_url"
                                    :src="componentForm.image_url"
                                    class="avatar"
                                />
                                <div v-else class="upload-content">
                                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                    <div class="el-upload__text">
                                        点击或拖拽上传
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-upload>
                    <el-icon
                        v-if="componentForm.image_url"
                        class="remove-icon"
                        @click="removeImage('image_url')"
                    >
                        <Close />
                    </el-icon>
                    <div class="upload-label">图片</div>
                </div>

                <div class="image-upload-container">
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        :auto-upload="false"
                        :show-file-list="false"
                        :on-change="handleShowImageChange"
                        :on-drop="handleShowImageDrop"
                        drag
                        accept="image/*"
                    >
                        <template #default>
                            <div class="image-wrapper">
                                <img
                                    v-if="componentForm.show_image_url"
                                    :src="componentForm.show_image_url"
                                    class="avatar"
                                />
                                <div v-else class="upload-content">
                                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                    <div class="el-upload__text">
                                        点击或拖拽上传
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-upload>
                    <el-icon
                        v-if="componentForm.show_image_url"
                        class="remove-icon"
                        @click="removeImage('show_image_url')"
                    >
                        <Close />
                    </el-icon>
                    <div class="upload-label">展示图片</div>
                </div>
            </div>
        </el-form-item>
        <el-form-item label="父组件关系">
          <div class="relations-list">
            <div class="relations-header">
              <el-select
                v-model="parentCategoryId"
                placeholder="选择父组件分类"
                clearable
                style="width: 180px"
                @change="handleParentCategoryChange"
              >
                <el-option
                  v-for="category in sortedCategories"
                  :key="category.category_id"
                  :label="category.category_name"
                  :value="category.category_id"
                />
              </el-select>
              <el-select
                v-model="newParentComponent"
                placeholder="选择父组件"
                clearable
                style="width: 220px"
                :disabled="!parentCategoryId"
              >
                <el-option
                  v-for="component in filteredParentComponents"
                  :key="component.component_id"
                  :label="`${component.component_name} ${component.component_code}`"
                  :value="component.component_id"
                >
                  <div class="component-option">
                    <div class="component-info">
                      <div class="component-main">
                        <span class="component-name">{{ component.component_name }}</span>
                        <el-tag size="small" type="info">{{ component.component_code }}</el-tag>
                      </div>
                      <div class="component-sub" v-if="component.sku">
                        SKU: {{ component.sku }}
                      </div>
                    </div>
                    <el-popover
                      v-if="component.image_url"
                      effect="light"
                      trigger="hover"
                      placement="right"
                      :width="200"
                    >
                      <template #default>
                        <el-image
                          :src="component.image_url"
                          style="width: 200px; height: 200px;"
                          fit="contain"
                        />
                      </template>
                      <template #reference>
                        <el-image
                          :src="component.image_url"
                          class="component-image"
                          fit="contain"
                        />
                      </template>
                    </el-popover>
                  </div>
                </el-option>
              </el-select>
              <el-select
                v-model="newParentRelationType"
                placeholder="关系类"
                style="width: 120px"
                :disabled="!newParentComponent"
              >
                <el-option label="包含" value="contain" />
                <el-option label="依赖" value="depend" />
                <el-option label="替代" value="alternative" />
              </el-select>
              <el-button
                type="primary"
                :disabled="!newParentComponent || !newParentRelationType"
                @click="addParentRelation"
              >
                添加
              </el-button>
            </div>

            <div class="relations-filter">
              <el-select
                v-model="parentRelationFilter"
                placeholder="按分类筛选"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="category in sortedCategories"
                  :key="category.category_id"
                  :label="category.category_name"
                  :value="category.category_id"
                />
              </el-select>
            </div>

            <el-table
              :data="filteredParentRelations"
              style="width: 100%"
              size="small"
            >
              <el-table-column label="父组件" prop="component_name">
                <template #default="{ row }">
                  <div>
                    <div>{{ row.component_name }}</div>
                    <div style="color: #909399; font-size: 12px;">{{ row.component_code }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="所属分类" width="180">
                <template #default="{ row }">
                  {{ getCategoryName(row.category_id) }}
                </template>
              </el-table-column>
              <el-table-column label="关联类型" width="120">
                <template #default="{ row }">
                  {{ relationTypeMap[row.relation_type] }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="{ $index }">
                  <el-button
                    type="danger"
                    link
                    @click="removeParentRelation($index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>

        <el-form-item label="子组件关系">
          <div class="relations-list">
            <div class="relations-header">
              <el-select
                v-model="childCategoryId"
                placeholder="选择子组件分类"
                clearable
                style="width: 180px"
                @change="handleChildCategoryChange"
              >
                <el-option
                  v-for="category in sortedCategories"
                  :key="category.category_id"
                  :label="category.category_name"
                  :value="category.category_id"
                />
              </el-select>
              <el-select
                v-model="newChildComponent"
                placeholder="选择子组件"
                clearable
                style="width: 220px"
                :disabled="!childCategoryId"
              >
                <el-option
                  v-for="component in filteredChildComponents"
                  :key="component.component_id"
                  :label="`${component.component_name} ${component.component_code}`"
                  :value="component.component_id"
                >
                  <div class="component-option">
                    <div class="component-info">
                      <div class="component-main">
                        <span class="component-name">{{ component.component_name }}</span>
                        <el-tag size="small" type="info">{{ component.component_code }}</el-tag>
                      </div>
                      <div class="component-sub" v-if="component.sku">
                        SKU: {{ component.sku }}
                      </div>
                    </div>
                    <el-popover
                      v-if="component.show_image_url"
                      effect="light"
                      trigger="hover"
                      placement="right"
                      :width="200"
                    >
                      <template #default>
                        <el-image
                          :src="component.show_image_url"
                          style="width: 200px; height: 200px;"
                          fit="contain"
                        />
                      </template>
                      <template #reference>
                        <el-image
                          :src="component.show_image_url"
                          class="component-image"
                          fit="contain"
                        />
                      </template>
                    </el-popover>
                  </div>
                </el-option>
              </el-select>
              <el-select
                v-model="newChildRelationType"
                placeholder="关系类型"
                style="width: 120px"
                :disabled="!newChildComponent"
              >
                <el-option label="包含" value="contain" />
                <el-option label="依赖" value="depend" />
                <el-option label="替代" value="alternative" />
              </el-select>
              <el-button
                type="primary"
                :disabled="!newChildComponent || !newChildRelationType"
                @click="addChildRelation"
              >
                添加
              </el-button>
            </div>

            <div class="relations-filter">
              <el-select
                v-model="childRelationFilter"
                placeholder="按分类筛选"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="category in sortedCategories"
                  :key="category.category_id"
                  :label="category.category_name"
                  :value="category.category_id"
                />
              </el-select>
            </div>

            <el-table
              :data="filteredChildRelations"
              style="width: 100%"
              size="small"
            >
              <el-table-column label="子组件" prop="component_name">
                <template #default="{ row }">
                  <div>
                    <div>{{ row.component_name }}</div>
                    <div style="color: #909399; font-size: 12px;">{{ row.component_code }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="所属分类" width="180">
                <template #default="{ row }">
                  {{ getCategoryName(row.category_id) }}
                </template>
              </el-table-column>
              <el-table-column label="关系类型" width="120">
                <template #default="{ row }">
                  {{ relationTypeMap[row.relation_type] }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="{ $index }">
                  <el-button
                    type="danger"
                    link
                    @click="removeChildRelation($index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
    </el-form>
        <template #footer>
            <el-button @click="componentDialog.visible = false">取消</el-button>
            <el-button type="primary" @click="submitComponent">确定</el-button>
        </template>
    </el-dialog>

    <el-dialog
      v-model="relationDialog.visible"
      :title="'添加关系'"
    >
      <el-form :model="relationForm" label-width="120px">
        <el-form-item label="父组件分类" class="form-item">
          <el-select v-model="parentCategoryId" @change="handleParentCategoryChange">
            <el-option
              v-for="category in sortedCategories"
              :key="category.category_id"
              :label="category.category_name"
              :value="category.category_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="父组件" class="form-item">
          <el-select
            v-model="relationForm.parent_component_ids"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
          >
            <el-option
              v-for="component in filteredParentComponents"
              :key="component.component_id"
              :label="`${component.component_name} ${component.component_code}`"
              :value="component.component_id"
            >
              <div class="component-option">
                <div class="component-info">
                  <div class="component-main">
                    <span class="component-name">{{ component.component_name }}</span>
                    <el-tag size="small" type="info">{{ component.component_code }}</el-tag>
                  </div>
                  <div class="component-sub" v-if="component.sku">
                    SKU: {{ component.sku }}
                  </div>
                </div>
                <el-image
                  v-if="component.image_url"
                  :src="component.image_url"
                  class="component-image"
                  fit="contain"
                />
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子组件分类" class="form-item">
          <el-select v-model="childCategoryId" @change="filterChildComponents">
            <el-option
              v-for="category in sortedCategories"
              :key="category.category_id"
              :label="category.category_name"
              :value="category.category_id"
              :disabled="category.category_id === parentCategoryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="子组件" class="form-item">
          <el-select
            v-model="relationForm.child_component_ids"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
          >
            <el-option
              v-for="component in filteredChildComponents"
              :key="component.component_id"
              :label="`${component.component_name} ${component.component_code}`"
              :value="component.component_id"
            >
              <div class="component-option">
                <div class="component-info">
                  <div class="component-main">
                    <span class="component-name">{{ component.component_name }}</span>
                    <el-tag size="small" type="info">{{ component.component_code }}</el-tag>
                  </div>
                  <div class="component-sub" v-if="component.sku">
                    SKU: {{ component.sku }}
                  </div>
                </div>
                <el-image
                  v-if="component.show_image_url"
                  :src="component.show_image_url"
                  class="component-image"
                  fit="contain"
                />
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关系类型" class="form-item">
          <el-select v-model="relationForm.relation_type">
            <el-option label="包含" value="contain" />
            <el-option label="依赖" value="depend" />
            <el-option label="替代" value="alternative" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="relationDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitRelation">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Rank, UploadFilled, Close } from '@element-plus/icons-vue'
import { componentApi, categoryApi, relationApi, uploadApi } from '@/api/gocean/skuCreate/index'
import axios from 'axios'
import { h } from 'vue'

// 数据列表
const components = ref([])
const categories = ref([])
const relations = ref([])

// ���窗控制
const categoryDialog = ref({
  visible: false,
  isEdit: false
})
const componentDialog = ref({
  visible: false,
  isEdit: false
})
const relationDialog = ref({
  visible: false
})

// 表单数据
const categoryForm = ref({})
const componentForm = ref({
  component_name: '',
  component_code: '',
  category_id: null,
  image_url: '',
  show_image_url: '', // 添加这个字段
  sku: null,
  sku_name: '',
  bom_number: '',
  cost: 0,
  parentRelations: [],
  childRelations: []
})
const relationForm = ref({
  parent_component_id: null,
  child_component_ids: [], // 改为数组以支持多
  relation_type: ''
})

// 分类选择
const parentCategoryId = ref(null)
const childCategoryId = ref(null)

// 过滤后的件列表
const filteredParentComponents = ref([])
const filteredChildComponents = ref([])

// 获表单引
const componentFormRef = ref(null)

// 添加选中关系的数组
const selectedRelations = ref([])

// 添加关系类型映射
const relationTypeMap = {
  'contain': '包含',
  'depend': '依赖',
  'alternative': '替代'
}

// 修改处理图片选择的法
const handleImageChange = async (file) => {
  const isImage = file.raw.type.startsWith('image/')
  const isLt2M = file.raw.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return
  }

  try {
    const formData = new FormData()
    formData.append('image', file.raw)

    const response = await uploadApi.uploadImage(formData)

    // 更新组件表单的图片URL
    componentForm.value.image_url = response.data.imagePath
    ElMessage.success('图片上传成功')
  } catch (error) {
    console.error('上传失败:', error)
    if (error.response && error.response.data.error) {
      ElMessage.error(error.response.data.error)
    } else {
      ElMessage.error('图片上传失败')
    }
  }
}

// 初始化数据
const fetchData = async () => {
  try {
    const [categoriesRes, componentsRes] = await Promise.all([
      categoryApi.list(),
      componentApi.list({
        category: selectedCategoryId.value
      })
    ])

    categories.value = categoriesRes.data
    components.value = componentsRes.data.map(component => ({
      ...component,
      image_url: component.image_url || ''
    }))

    // 更新过滤后���组件列表
    filteredComponents.value = components.value

    // 获取关系数据
    await fetchRelationData()
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

// 过父组件
const filterParentComponents = () => {
  filteredParentComponents.value = components.value.filter(
    component => component.category_id === parentCategoryId.value
  )
  // 清空父组件选择
  relationForm.value.parent_component_ids = []
}

// 过��子组件
const filterChildComponents = () => {
  filteredChildComponents.value = components.value.filter(
    component => component.category_id === childCategoryId.value
  )
  // 清子组件选择
  relationForm.value.child_component_ids = []
}

// 获取分类名称
const getCategoryName = (categoryId) => {
  return categories.value.find(c => c.category_id === categoryId)?.category_name || ''
}

// 打分类弹窗
const openCategoryDialog = (category) => {
  categoryDialog.value.isEdit = !!category
  categoryDialog.value.visible = true
  categoryForm.value = category ? { ...category } : {}
}

// 添加商品相关的响应式数据
const skuCategories = ref([])
const skuList = ref([])
const selectedSkuCategory = ref(null)

// 添加获取商品类别的方法
const fetchSkuCategories = async () => {
  try {
    const response = await axios.get('/api/sku-cost/categories')
    skuCategories.value = response.data
  } catch (error) {
    console.error('获取商品类别失败:', error)
  }
}

// 添加处理商品类别变化的方法
const handleSkuCategoryChange = async (category) => {
  if (!category) {
    skuList.value = []
    componentForm.value.sku = null
    return
  }

  try {
    const response = await axios.get('/api/sku-cost', {
      params: { category }
    })
    skuList.value = response.data
  } catch (error) {
    console.error('获取商品信息失败:', error)
    ElMessage.error('获取商品信息失败')
  }
}
// 添加父子组件关系筛选的响应式数据
const parentRelationFilter = ref(null)
const childRelationFilter = ref(null)

// 修改打开组件弹窗的方法
const openComponentDialog = async (component) => {
  try {
    await fetchSkuCategories()

    componentDialog.value.isEdit = !!component
    componentDialog.value.visible = true

    // 重置筛选器和新增关系的选择
    parentRelationFilter.value = null
    childRelationFilter.value = null
    newParentComponent.value = null
    newParentRelationType.value = null
    newChildComponent.value = null
    newChildRelationType.value = null

    if (component) {
      // 使用传入的组件数据
      componentForm.value = {
        ...component,
        sku: component.sku || null,
        sku_name: component.sku_name || '',
        bom_number: component.bom_number || '',
        cost: component.cost || 0,
        image_url: component.image_url || '',
        parentRelations: [],
        childRelations: [],
        component_id: component.component_id
      }

      // 从现有的关系数据中筛选
      const componentRelations = relations.value.filter(r =>
        r.parent_component_id === component.component_id ||
        r.child_component_id === component.component_id
      )

      // 处理父组件关系（当前组件作为子组件）
      const parentRelations = componentRelations
        .filter(r => r.child_component_id === component.component_id)
        .map(r => {
          const parentComponent = components.value.find(c => c.component_id === r.parent_component_id)
          if (parentComponent) {
            return {
              component_id: parentComponent.component_id,
              component_name: parentComponent.component_name,
              component_code: parentComponent.component_code,
              category_id: parentComponent.category_id,
              relation_type: r.relation_type
            }
          }
          return null
        })
        .filter(Boolean)

      // 处理子组件关系（当前组件作为父组件）
      const childRelations = componentRelations
        .filter(r => r.parent_component_id === component.component_id)
        .map(r => {
          const childComponent = components.value.find(c => c.component_id === r.child_component_id)
          if (childComponent) {
            return {
              component_id: childComponent.component_id,
              component_name: childComponent.component_name,
              component_code: childComponent.component_code,
              category_id: childComponent.category_id,
              relation_type: r.relation_type
            }
          }
          return null
        })
        .filter(Boolean)

      // 设置关系数据
      componentForm.value.parentRelations = parentRelations
      componentForm.value.childRelations = childRelations

      // 如果有父组件关系，设置父组件分类
      if (parentRelations.length > 0) {
        parentCategoryId.value = parentRelations[0].category_id
        await handleParentCategoryChange(parentCategoryId.value)
      }

      // 如果有子组件关系，设置子组件分类
      if (childRelations.length > 0) {
        childCategoryId.value = childRelations[0].category_id
        await handleChildCategoryChange(childCategoryId.value)
      }

      // 如果有商品编码，加载对应的商品类别
      if (component.sku) {
        // 这里可能需要根据实际情况调整
        const skuInfo = skuList.value.find(s => s.sku === component.sku)
        if (skuInfo) {
          selectedSkuCategory.value = skuInfo.category
        }
      }
    } else {
      // 新建组件时的初始化
      componentForm.value = {
        component_name: '',
        component_code: '',
        category_id: selectedCategoryId.value || null,
        image_url: '',
        show_image_url: '', // 添加这个字段
        sku: null,
        sku_name: '',
        bom_number: '',
        cost: 0,
        parentRelations: [],
        childRelations: []
      }
      // 重置分类和过滤数据
      parentCategoryId.value = null
      childCategoryId.value = null
      filteredParentComponents.value = []
      filteredChildComponents.value = []
    }
  } catch (error) {
    console.error('打开组件弹窗失败:', error)
    ElMessage.error('打开编辑窗口失败')
  }
}

// 打关系弹窗
const openRelationDialog = () => {
  relationDialog.value.visible = true
  relationForm.value = {
    parent_component_ids: [],
    child_component_ids: [],
    relation_type: ''
  }
  parentCategoryId.value = null
  childCategoryId.value = null
  filteredParentComponents.value = []
  filteredChildComponents.value = []
}

// 提交分类
const submitCategory = async () => {
  try {
    if (categoryDialog.value.isEdit) {
      await categoryApi.update(categoryForm.value.category_id, categoryForm.value)
    } else {
      await categoryApi.create(categoryForm.value)
    }
    ElMessage.success('操作成功')
    categoryDialog.value.visible = false
    fetchData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 修改提交组件的方法
const submitComponent = async () => {
  if (!componentFormRef.value) return

  try {
    await componentFormRef.value.validate()

    if (!componentForm.value.image_url) {
      componentForm.value.image_url = ''
    }

    let componentId
    if (componentDialog.value.isEdit) {
      componentId = componentForm.value.component_id
      // 删除现有关系
      const existingRelations = relations.value.filter(r =>
        r.parent_component_id === componentId ||
        r.child_component_id === componentId
      )

      if (existingRelations.length > 0) {
        await Promise.all(
          existingRelations.map(relation =>
            relationApi.delete(relation.parent_component_id, relation.child_component_id)
          )
        )
      }

      await componentApi.update(componentId, componentForm.value)
    } else {
      const response = await componentApi.create(componentForm.value)
      componentId = response.data.component_id
    }

    // 创建父组件关系
    if (componentForm.value.parentRelations.length > 0) {
      const parentRelations = componentForm.value.parentRelations.map(parent => ({
        parent_component_id: parent.component_id,
        child_component_id: componentId,
        relation_type: parent.relation_type
      }))
      await relationApi.create({ relations: parentRelations })
    }

    // 创建子组件关系
    if (componentForm.value.childRelations.length > 0) {
      const childRelations = componentForm.value.childRelations.map(child => ({
        parent_component_id: componentId,
        child_component_id: child.component_id,
        relation_type: child.relation_type
      }))
      await relationApi.create({ relations: childRelations })
    }

    ElMessage.success('操作成功')
    componentDialog.value.visible = false

    // 保存当前分页和分类状态
    const currentPage = componentPagination.value.currentPage
    const currentPageSize = componentPagination.value.pageSize
    const currentCategoryId = selectedCategoryId.value

    // 重新获取数据时保持当前分页状态
    try {
      const response = await componentApi.list({
        category: currentCategoryId,
        page: currentPage,
        pageSize: currentPageSize
      })

      components.value = response.data.map(component => ({
        ...component,
        image_url: component.image_url || ''
      }))

      // 更新过滤后的组件列表
      filteredComponents.value = components.value

      // 保持分页状态
      componentPagination.value.currentPage = currentPage
      componentPagination.value.pageSize = currentPageSize
    } catch (error) {
      console.error('获取组件数据失败:', error)
      ElMessage.error('获取组件数据失败')
    }

  } catch (error) {
    console.error('提交组件失败:', error.response?.data || error)
    if (error === false) {
      ElMessage.error('请填写必填项')
    } else if (error.response?.data?.error) {
      ElMessage.error(error.response.data.error)
    } else {
      ElMessage.error('操作失败')
    }
  }
}

// 修改表单验证规则
const componentRules = {
  component_name: [
    { required: true, message: '请输入组件名称', trigger: 'blur' }
  ],
  component_code: [
    { required: true, message: '请输入组件编码', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择所属分类', trigger: 'change' }
  ]
  // 移除了 image_url 的验证规则，使其成为非必填项
}

// 提交关系
const submitRelation = async () => {
  try {
    // 验证必填项
    if (!relationForm.value.relation_type) {
      ElMessage.error('请选择关系类型')
      return
    }
    if (relationForm.value.parent_component_ids.length === 0) {
      ElMessage.error('请择父组件')
      return
    }
    if (relationForm.value.child_component_ids.length === 0) {
      ElMessage.error('选择子件')
      return
    }

    // 构造批量关系数据
    const relations = []
    relationForm.value.parent_component_ids.forEach(parentId => {
      relationForm.value.child_component_ids.forEach(childId => {
        relations.push({
          parent_component_id: parentId,
          child_component_id: childId,
          relation_type: relationForm.value.relation_type
        })
      })
    })

    // 一次性提交所有关系
    await relationApi.create({ relations })

    ElMessage.success('关系添加成功')
    relationDialog.value.visible = false
    fetchData()
  } catch (error) {
    if (error.response && error.response.status === 400) {
      ElMessage.error(error.response.data.error || '添加关系失败')
    } else {
      ElMessage.error('作失败')
    }
  }
}

// 删除分类
const deleteCategory = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？', '提示')
    await categoryApi.delete(id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 修改删除组件的方法
const deleteComponent = async (id) => {
  try {
    // 先查找与该组件相关的所有系
    const relatedRelations = relations.value.filter(r =>
      r.parent_component_id === id || r.child_component_id === id
    ).map(r => ({
      ...r,
      isParent: r.parent_component_id === id,
      relatedComponentName: r.parent_component_id === id ?
        components.value.find(c => c.component_id === r.child_component_id)?.component_name :
        components.value.find(c => c.component_id === r.parent_component_id)?.component_name
    }))

    if (relatedRelations.length > 0) {
      // 如果有关联关系，显示确认对话框
      const confirmResult = await ElMessageBox.confirm(
        h('div', null, [
          h('p', '该组件存在以下关联关系：'),
          h('ul', { style: 'margin: 10px 0; max-height: 200px; overflow-y: auto;' },
            relatedRelations.map(relation =>
              h('li', { style: 'margin: 5px 0;' },
                `${relation.isParent ? '作为父组件关联到' : '作为子组件关联到'} ${relation.relatedComponentName} (${relationTypeMap[relation.relation_type]})`
              )
            )
          ),
          h('p', '是否删除这些系并继续删除组件？')
        ]),
        '确认删除',
        {
          confirmButtonText: '删除系并删除组',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      if (confirmResult === 'confirm') {
        // 删除所有关联系
        await Promise.all(
          relatedRelations.map(relation =>
            relationApi.delete(relation.parent_component_id, relation.child_component_id)
          )
        )
        // 删除组件
        await componentApi.delete(id)
        ElMessage.success('组件及其关联关系已删除')
        await fetchData()
        if (selectedCategoryId.value) {
          handleComponentCategoryChange(selectedCategoryId.value)
        }
      }
    } else {
      // 如果没有关联关系，直接确认删���件
      await ElMessageBox.confirm('确定要删除该组件吗？', '提示')
      await componentApi.delete(id)
      ElMessage.success('删除成功')
      await fetchData()
      if (selectedCategoryId.value) {
        handleComponentCategoryChange(selectedCategoryId.value)
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 修删除关系的方法
const deleteRelation = async (parentId, childId) => {
  try {
    await ElMessageBox.confirm('确定要删除该关系吗？', '提示')
    // 改这里，直传递 parentId 和 childId
    await relationApi.delete(parentId, childId)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      if (error.response) {
        if (error.response.status === 400) {
          ElMessage.error(error.response.data.error || '删除系失败')
        } else if (error.response.status === 404) {
          ElMessage.error('未找到要删除的关系')
        } else {
          ElMessage.error('删除失败')
        }
      } else {
        ElMessage.error('删失败')
      }
    }
  }
}

// 修改处理父组件分类变化的方法
const handleParentCategoryChange = async (categoryId) => {
  if (!categoryId) {
    filteredParentComponents.value = []
    return
  }

  try {
    // 从后端获取该分类下的组件
    const response = await componentApi.list({
      category: categoryId
    })

    // 在前端过滤掉当前组件
    filteredParentComponents.value = response.data
      .filter(component => component.component_id !== componentForm.value.component_id)
      .map(component => ({
        ...component,
        image_url: component.image_url || ''
      }))
  } catch (error) {
    console.error('获取父组件数据失败:', error)
    ElMessage.error('获取父组件数据失败')
    filteredParentComponents.value = []
  }
}

// 修改处理子组件分类变化的方法
const handleChildCategoryChange = async (categoryId) => {
  if (!categoryId) {
    filteredChildComponents.value = []
    return
  }

  try {
    // 从后端获取该分类下的组件
    const response = await componentApi.list({
      category: categoryId
    })

    // 在前端过滤掉当前组件
    filteredChildComponents.value = response.data
      .filter(component => component.component_id !== componentForm.value.component_id)
      .map(component => ({
        ...component,
        image_url: component.image_url || ''
      }))
  } catch (error) {
    console.error('获取子组件数据失败:', error)
    ElMessage.error('获取子组件数据失败')
    filteredChildComponents.value = []
  }
}

// 添加处理选择变化的方
const handleSelectionChange = (selection) => {
  selectedRelations.value = selection
}

// 修改批量删除方法
const batchDeleteRelations = async () => {
  if (selectedRelations.value.length === 0) return

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRelations.value.length} 个关系吗？`,
      '提示'
    )

    // 使用 Promise.all 处理多个删除请求
    await Promise.all(
      selectedRelations.value.map(relation =>
        relationApi.delete(relation.parent_component_id, relation.child_component_id)
      )
    )

    ElMessage.success('批量删除成功')
    selectedRelations.value = []
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 在 script setup 中添加
const selectedCategoryId = ref(null) // 用于存选中的分类ID
const filteredComponents = ref([]) // 用于存过滤后的组件列表

// 添加处理分类变化的方法
const handleComponentCategoryChange = async (categoryId) => {
  selectedCategoryId.value = categoryId
  // 清除搜索选中状态
  searchSelectedComponentId.value = null
  selectedSearchComponent.value = null
  // 重置分页
  componentPagination.value.currentPage = 1

  // 重新获取组件数据
  try {
    const response = await componentApi.list({
      category: categoryId,
      page: componentPagination.value.currentPage,
      pageSize: componentPagination.value.pageSize
    })
    components.value = response.data.map(component => ({
      ...component,
      image_url: component.image_url || ''
    }))

    // 更新过滤后的组件列
    filteredComponents.value = components.value
  } catch (error) {
    console.error('获取组件数据失败:', error)
    ElMessage.error('获取组件数据失败')
  }
}

// 添加分页相关的响应式数据
const categoryPagination = ref({
  currentPage: 1,
  pageSize: 10
})

const componentPagination = ref({
  currentPage: 1,
  pageSize: 10
})

// 修改分页相关的计���属性
const paginatedComponents = computed(() => {
  // 根据当前状态���取要显示的数据
  let filtered = []

  if (searchSelectedComponentId.value) {
    // 搜索选中模式
    filtered = components.value.filter(c => c.component_id === searchSelectedComponentId.value)
  } else if (selectedCategoryId.value) {
    // 分类筛选模式
    filtered = components.value.filter(c => c.category_id === selectedCategoryId.value)
  } else {
    // 显示所有组件
    filtered = components.value
  }

  // 更新 filteredComponents 以便其他地方使用
  filteredComponents.value = filtered

  // 计算分页
  const start = (componentPagination.value.currentPage - 1) * componentPagination.value.pageSize
  const end = start + componentPagination.value.pageSize

  // 确保不会超出数组范围
  return filtered.slice(start, Math.min(end, filtered.length))
})

// 修改总数计算属性
const totalFilteredComponents = computed(() => {
  if (searchSelectedComponentId.value) {
    return components.value.filter(c => c.component_id === searchSelectedComponentId.value).length
  } else if (selectedCategoryId.value) {
    return components.value.filter(c => c.category_id === selectedCategoryId.value).length
  }
  return components.value.length
})

// 修改分页器部分的模板

// 在现有的代码基上添加
const activeTab = ref('category') // 默认显示分类管理标签页


// 添加级联选择器相关的响应式数据
const selectedRelationPath = ref([])

// 修改处理组件关系树的计算属性
const relationTreeOptions = computed(() => {
  // 获取排序值最小的分类
  const minSortCategory = categories.value.reduce((min, cat) =>
    (!min || cat.sort < min.sort) ? cat : min
  , null)

  if (!minSortCategory) return []

  // 获取该分类下的所有组件
  const rootComponents = components.value
    .filter(c => c.category_id === minSortCategory.category_id)
    .map(component => ({
      label: component.component_name,
      value: component.component_id,
      children: []
    }))

  // 递归构建组件树
  const buildComponentTree = (parentNode) => {
    // 获取该组件的所有包含关系的子组件
    const childRelations = relations.value.filter(r =>
      r.parent_component_id === parentNode.value &&
      r.relation_type === 'contain'
    )

    // 按分类组织子组件
    const childrenByCategory = {}
    childRelations.forEach(relation => {
      const childComponent = components.value.find(c =>
        c.component_id === relation.child_component_id
      )
      if (childComponent) {
        const category = categories.value.find(c => c.category_id === childComponent.category_id)
        if (!childrenByCategory[category.category_id]) {
          childrenByCategory[category.category_id] = []
        }
        childrenByCategory[category.category_id].push(childComponent)
      }
    })

    // 将子组件添加到父节点
    Object.entries(childrenByCategory).forEach(([categoryId, categoryComponents]) => {
      categoryComponents.forEach(component => {
        const childNode = {
          label: component.component_name,
          value: component.component_id,
          children: []
        }
        parentNode.children.push(childNode)
        // 递归处理子组件
        buildComponentTree(childNode)
      })
    })
  }

  // 为每个根组件构建子树
  rootComponents.forEach(rootNode => {
    buildComponentTree(rootNode)
  })

  return rootComponents.filter(node => node.children.length > 0)
})

// 添加处理联择变化的方法
const handleRelationPathChange = (value) => {
  if (!value || value.length === 0) {
    // 空选择时重置显示所有关系
    fetchData()
    return
  }

  // 过滤显示选中路径相关的关系
  const selectedPaths = value.flat()
  relations.value = relations.value.filter(relation =>
    selectedPaths.includes(relation.parent_component_id) ||
    selectedPaths.includes(relation.child_component_id)
  )
}

// 添加监听标签页变化
const handleTabChange = async (tab) => {
  if (tab === 'relation') {
    // 切换到关系管理标签页时重新获取数据
    await fetchData()
  }
}

// 添加分类排序的计算属性
const sortedCategories = computed(() => {
  return [...categories.value].sort((a, b) => a.sort - b.sort)
})

// 添加全选相关的响应式数据
const parentAllChecked = ref(false)
const childAllChecked = ref(false)

// 添加父组件全选处理方法
const handleParentCheckAllChange = (val) => {
  if (val) {
    componentForm.value.parentComponents = filteredParentComponents.value.map(c => c.component_id)
  } else {
    componentForm.value.parentComponents = []
  }
}

// 添加子组件全选处理方法
const handleChildCheckAllChange = (val) => {
  if (val) {
    componentForm.value.childComponents = filteredChildComponents.value.map(c => c.component_id)
  } else {
    componentForm.value.childComponents = []
  }
}

// 修改商品编码选择处理方法
const handleSkuChange = (skuCode) => {
  if (skuCode) {
    const selectedSku = skuList.value.find(item => item.sku === skuCode)
    if (selectedSku) {
      componentForm.value.sku = selectedSku.sku
      componentForm.value.sku_name = selectedSku.sku_name
      componentForm.value.bom_number = selectedSku.bom_number
      componentForm.value.cost = selectedSku.cost
    }
  } else {
    clearSkuInfo()
  }
}

// 添加关系筛选的响应式数据
const relationFilter = ref({
  categoryId: null,
  relationType: null,
  keyword: ''
})

// 修改筛选后的关系列表计算属性
const filteredRelations = computed(() => {
  // 使用原始关系数据作为基础
  let result = [...relations.value]

  // 按分类筛选
  if (relationFilter.value.categoryId) {
    result = result.filter(relation => {
      const parentComponent = components.value.find(c => c.component_id === relation.parent_component_id)
      const childComponent = components.value.find(c => c.component_id === relation.child_component_id)
      return parentComponent?.category_id === relationFilter.value.categoryId ||
             childComponent?.category_id === relationFilter.value.categoryId
    })
  }

  // 按关系类型筛选
  if (relationFilter.value.relationType) {
    result = result.filter(relation => relation.relation_type === relationFilter.value.relationType)
  }

  // 按关键字搜索
  if (relationFilter.value.keyword) {
    const keyword = relationFilter.value.keyword.toLowerCase()
    result = result.filter(relation => {
      const parentName = relation.parent_component_name.toLowerCase()
      const childName = relation.child_component_name.toLowerCase()
      return parentName.includes(keyword) || childName.includes(keyword)
    })
  }

  return result
})

// 修改处理筛选变化的方法
const handleRelationFilterChange = () => {
  relationPagination.value.currentPage = 1 // 重置到第一页
  fetchRelationData()
}

// 添加清除商品信息的方法
const clearSkuInfo = () => {
  componentForm.value.sku = null
  componentForm.value.sku_name = ''
  componentForm.value.bom_number = ''
  componentForm.value.cost = 0
}

// 添加搜索相关的响式数据
const searchLoading = ref(false)
const searchResults = ref([])
const selectedSearchComponent = ref(null)

// 添加搜索处理方法
const handleSearchComponent = async (query) => {
  if (query === '') {
    searchResults.value = []
    return
  }

  searchLoading.value = true
  try {
    const searchText = query.toLowerCase()
    const results = components.value.filter(component => {
      return (
        component.component_name.toLowerCase().includes(searchText) ||
        component.component_code.toLowerCase().includes(searchText) ||
        (component.sku && component.sku.toLowerCase().includes(searchText)) ||
        (component.sku_name && component.sku_name.toLowerCase().includes(searchText))
      )
    })

    // 按相关性排序并限制结果数量
    searchResults.value = results
      .sort((a, b) => {
        // 名称完全匹配的优先
        const aNameMatch = a.component_name.toLowerCase() === searchText
        const bNameMatch = b.component_name.toLowerCase() === searchText
        if (aNameMatch && !bNameMatch) return -1
        if (!aNameMatch && bNameMatch) return 1

        // 编码完全匹配的其次
        const aCodeMatch = a.component_code.toLowerCase() === searchText
        const bCodeMatch = b.component_code.toLowerCase() === searchText
        if (aCodeMatch && !bCodeMatch) return -1
        if (!aCodeMatch && bCodeMatch) return 1

        // SKU匹配的再次
        const aSkuMatch = a.sku && a.sku.toLowerCase() === searchText
        const bSkuMatch = b.sku && b.sku.toLowerCase() === searchText
        if (aSkuMatch && !bSkuMatch) return -1
        if (!aSkuMatch && bSkuMatch) return 1

        // 最后按名称排序
        return a.component_name.localeCompare(b.component_name)
      })
      .slice(0, 20)
  } finally {
    searchLoading.value = false
  }
}

// 添加一个响应式变量来存储搜索选中的组件ID
const searchSelectedComponentId = ref(null)


// 添加表格 ref
const componentTableRef = ref(null)

// 修改处理搜索选择的方法
const handleSearchSelect = async (componentId) => {
  if (!componentId) {
    // 清空搜索时，重新获取所有关系
    fetchRelationData()
    return
  }

  try {
    // 获取与该组件相关的所有关系
    const response = await relationApi.list({
      componentId: componentId, // 添加组件ID作为筛选条件
      page: 1,
      pageSize: 1000 // 设置较大的页面大小以获取所有相关关系
    })

    if (response.data && response.data.data) {
      // 更新关系列表，只显示与所选组件相关的关系
      relations.value = response.data.data.filter(relation =>
        relation.parent_component_id === componentId ||
        relation.child_component_id === componentId
      )

      // 更新分页信息
      relationPagination.value = {
        currentPage: 1,
        pageSize: relationPagination.value.pageSize,
        total: relations.value.length
      }
    }

    // 清空搜索框
    selectedSearchComponent.value = null

  } catch (error) {
    console.error('获取组件关系失败:', error)
    ElMessage.error('获取组件关系失败')
  }
}

// 在 setup 中添新的响应式数据
const newParentComponent = ref(null)
const newParentRelationType = ref(null)
const newChildComponent = ref(null)
const newChildRelationType = ref(null)

// 修改添加父组件关系的方法
const addParentRelation = () => {
  if (!newParentComponent.value || !newParentRelationType.value) return

  const exists = componentForm.value.parentRelations.some(
    r => r.component_id === newParentComponent.value.component_id
  )

  if (exists) {
    ElMessage.warning('该父组件关系已存在')
    return
  }

  componentForm.value.parentRelations.push({
    component_id: newParentComponent.value.component_id,
    component_name: newParentComponent.value.component_name,
    component_code: newParentComponent.value.component_code,
    category_id: newParentComponent.value.category_id,
    relation_type: newParentRelationType.value
  })

  newParentComponent.value = null
  newParentRelationType.value = null
}

const removeParentRelation = (index) => {
  componentForm.value.parentRelations.splice(index, 1)
}

const addChildRelation = () => {
  if (!newChildComponent.value || !newChildRelationType.value) return

  const exists = componentForm.value.childRelations.some(
    r => r.component_id === newChildComponent.value.component_id
  )

  if (exists) {
    ElMessage.warning('该子组件关系已存在')
    return
  }

  componentForm.value.childRelations.push({
    component_id: newChildComponent.value.component_id,
    component_name: newChildComponent.value.component_name,
    component_code: newChildComponent.value.component_code,
    category_id: newChildComponent.value.category_id,
    relation_type: newChildRelationType.value
  })

  newChildComponent.value = null
  newChildRelationType.value = null
}

// 添加计算属性来过滤关系列表
const filteredParentRelations = computed(() => {
  if (!componentForm.value?.parentRelations) {
    return []
  }
  let relations = [...componentForm.value.parentRelations]
  if (parentRelationFilter.value) {
    relations = relations.filter(
      relation => relation.category_id === parentRelationFilter.value
    )
  }
  return relations
})

const filteredChildRelations = computed(() => {
  if (!componentForm.value?.childRelations) {
    return []
  }
  let relations = [...componentForm.value.childRelations]
  if (childRelationFilter.value) {
    relations = relations.filter(
      relation => relation.category_id === childRelationFilter.value
    )
  }
  return relations
})

// 添加拖拽相关的变量
const dragState = ref({
  dragging: false,
  dragIndex: -1,
  dragRow: null,
  dropIndex: -1
})

// 处理拖拽开始
const handleDragStart = (index, row) => {
  // 为表格行添加拖拽事件监听
  const tableRows = document.querySelectorAll('.el-table__body-wrapper tr')
  tableRows.forEach((tr, i) => {
    tr.setAttribute('draggable', 'true')
    tr.addEventListener('dragstart', (e) => handleDrag(e, i, row))
    tr.addEventListener('dragover', handleDragOver)
    tr.addEventListener('drop', (e) => handleDrop(e, i))
  })

  // 触发当前行的拖拽
  tableRows[index].dispatchEvent(new MouseEvent('mousedown'))
}

// 处理拖拽过程
const handleDrag = (e, index, row) => {
  dragState.value = {
    dragging: true,
    dragIndex: index,
    dragRow: row,
    dropIndex: -1
  }
  e.target.classList.add('dragging')
}

// 处理拖拽经过
const handleDragOver = (e) => {
  e.preventDefault()
  const tr = e.target.closest('tr')
  if (tr) {
    document.querySelectorAll('.el-table__body-wrapper tr').forEach(row => {
      row.classList.remove('drag-over')
    })
    tr.classList.add('drag-over')
  }
}

// 处理拖拽放置
const handleDrop = async (e, dropIndex) => {
  e.preventDefault()
  if (!dragState.value.dragging) return

  const { dragIndex, dragRow } = dragState.value
  if (dragIndex === dropIndex) return

  try {
    // 获取所有分类的副本
    const allCategories = [...categories.value]

    // 计算实际的索引（考虑分页）
    const actualDragIndex = (categoryPagination.value.currentPage - 1) * categoryPagination.value.pageSize + dragIndex
    const actualDropIndex = (categoryPagination.value.currentPage - 1) * categoryPagination.value.pageSize + dropIndex

    // 从数组中移除被拖动的分类
    allCategories.splice(actualDragIndex, 1)
    // 在新位置插入被拖动的分类
    allCategories.splice(actualDropIndex, 0, dragRow)

    // 更新所有分类的排序值
    const updatedCategories = allCategories.map((category, index) => ({
      ...category,
      sort: index + 1
    }))

    // 批量更新到服务器
    await Promise.all(
      updatedCategories.map(category =>
        categoryApi.update(category.category_id, { sort: category.sort })
      )
    )

    // 更新本地数据
    categories.value = updatedCategories

    ElMessage.success('排序更新成功')
  } catch (error) {
    console.error('更新排序失败:', error)
    ElMessage.error('更新排序失败')
  } finally {
    // 清理拖拽状态和样式
    dragState.value = {
      dragging: false,
      dragIndex: -1,
      dragRow: null,
      dropIndex: -1
    }
    document.querySelectorAll('.el-table__body-wrapper tr').forEach(row => {
      row.classList.remove('dragging', 'drag-over')
    })
  }
}

// 在 script setup 中添加分页相关的计算属性
const paginatedCategories = computed(() => {
  const start = (categoryPagination.value.currentPage - 1) * categoryPagination.value.pageSize
  const end = start + categoryPagination.value.pageSize
  return categories.value.slice(start, end)
})

// 添加分类分页处理方法
const handleCategorySizeChange = (size) => {
  categoryPagination.value.pageSize = size
  categoryPagination.value.currentPage = 1
}

const handleCategoryCurrentChange = (page) => {
  categoryPagination.value.currentPage = page
}

// 添加关系分页的响应式数据
const relationPagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 修改获取关系数据的方法
const fetchRelationData = async () => {
  try {
    const response = await relationApi.list({
      page: relationPagination.value.currentPage,
      pageSize: relationPagination.value.pageSize,
      categoryId: relationFilter.value.categoryId || '',
      relationType: relationFilter.value.relationType || '',
      keyword: relationFilter.value.keyword || ''
    })

    if (!response.data) {
      console.error('返回数据格式错误:', response)
      ElMessage.error('获取关系数据失败：数据格式错误')
      relations.value = []
      relationPagination.value.total = 0
      return
    }

    // 适配新的返回数据格式
    const { data: relationsData, total, page, pageSize } = response.data

    // 修改映射逻辑，添加 image_url
    relations.value = relationsData.map(relation => ({
      ...relation,
      parent_component_name: relation.parent_component_name,
      child_component_name: relation.child_component_name,
      parent_image_url: relation.parent_image_url || '', // 添加父组件图片
      child_image_url: relation.child_image_url || ''    // 添加子组件图片
    }))

    // 更新分页信息
    relationPagination.value = {
      ...relationPagination.value,
      currentPage: page,
      pageSize: pageSize,
      total: total
    }
  } catch (error) {
    console.error('获取关系数据失败:', error)
    ElMessage.error('获取关系数据失败')
    relations.value = []
    relationPagination.value.total = 0
  }
}

// 处理分页大小变化
const handleRelationSizeChange = (size) => {
  relationPagination.value.pageSize = size
  relationPagination.value.currentPage = 1
  fetchRelationData()
}

// 处理页码变化
const handleRelationCurrentChange = (page) => {
  relationPagination.value.currentPage = page
  fetchRelationData()
}

onMounted(() => {
  fetchData()
})

// 添加组件分页处理方法
const handleComponentSizeChange = async (size) => {
  componentPagination.value.pageSize = size
  componentPagination.value.currentPage = 1

  // 如果是在搜索状态，保持搜索结果
  if (searchSelectedComponentId.value) {
    return
  }

  // 如果是在分类筛选状态，重新获取该分类的数据
  if (selectedCategoryId.value) {
    try {
      const response = await componentApi.list({
        category: selectedCategoryId.value,
        page: componentPagination.value.currentPage,
        pageSize: size
      })
      components.value = response.data.map(component => ({
        ...component,
        image_url: component.image_url || ''
      }))
      filteredComponents.value = components.value
    } catch (error) {
      console.error('获取组件数据失败:', error)
      ElMessage.error('获取组件数据失败')
    }
  }
}

const handleComponentCurrentChange = async (page) => {
  componentPagination.value.currentPage = page

  // 如果是在搜索状态，保持搜索结果
  if (searchSelectedComponentId.value) {
    return
  }

  // 如果是在分类筛选状态，重新获取该分类的数据
  if (selectedCategoryId.value) {
    try {
      const response = await componentApi.list({
        category: selectedCategoryId.value,
        page: page,
        pageSize: componentPagination.value.pageSize
      })
      components.value = response.data.map(component => ({
        ...component,
        image_url: component.image_url || ''
      }))
      filteredComponents.value = components.value
    } catch (error) {
      console.error('获取组件数据失败:', error)
      ElMessage.error('获取组件数据失败')
    }
  }
}

// 添加处理拖拽上传的方法
const handleImageDrop = async (file) => {
    // 复用现有的图片处理逻辑
    await handleImageChange({ raw: file })
}

// 添加删除图片的方法
const removeImage = (field) => {
    componentForm.value[field] = ''
    ElMessage.success('图片已删除')
}

// 添加处理展示图片的方法
const handleShowImageChange = async (file) => {
    const isImage = file.raw.type.startsWith('image/')
    const isLt2M = file.raw.size / 1024 / 1024 < 2

    if (!isImage) {
        ElMessage.error('只能上传图片文件!')
        return
    }
    if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!')
        return
    }

    try {
        const formData = new FormData()
        formData.append('image', file.raw)

        const response = await uploadApi.uploadImage(formData)
        componentForm.value.show_image_url = response.data.imagePath
        ElMessage.success('图片上传成功')
    } catch (error) {
        console.error('上传失败:', error)
        if (error.response && error.response.data.error) {
            ElMessage.error(error.response.data.error)
        } else {
            ElMessage.error('图片上传失败')
        }
    }
}

const handleShowImageDrop = async (file) => {
    await handleShowImageChange({ raw: file })
}
</script>

<style scoped>
.component-manager {
  padding: 20px;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.management-tabs {
  height: 100%;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.management-tabs :deep(.el-tabs__header) {
  margin: 0;
  position: sticky;
  top: 0;
  z-index: 2;
  background: white;
}

.management-tabs :deep(.el-tabs__content) {
  padding: 20px;
  height: calc(100% - 40px);
  overflow-y: auto;
}

.el-card {
  margin-bottom: 0;
  height: 100%;
}

.el-card :deep(.el-card__body) {
  height: calc(100% - 60px);
  padding: 10px;
  overflow: hidden;
}

.pagination-container {
  padding: 10px;
  background: white;
  position: sticky;
  bottom: 0;
  z-index: 1;
}

.category-section,
.component-section,
.relation-section {
  margin-bottom: 20px;
}

.el-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-item {
  white-space: nowrap;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 240px;  /* 增加宽度 */
  height: 200px; /* 增加高度 */
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.upload-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.el-icon--upload {
  font-size: 28px;
  color: #8c939d;
  margin-bottom: 8px;
}

.el-upload__text {
  color: #8c939d;
  font-size: 14px;
  text-align: center;
  margin-bottom: 4px;
}

.el-upload__text em {
  color: var(--el-color-primary);
  font-style: normal;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
  text-align: center;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain; /* 改为 contain 以保持图片比例 */
}

.header-left {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 调表格容器的最小高度，确保分页位置稳定 */
.el-card {
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.el-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.el-table {
  flex: 1;
}

/* 修改父组件关系选择框的样式 */
.parent-relation {
  margin-bottom: 20px;
}

.parent-relation :deep(.el-form-item__content) {
  width: calc(100% - 100px); /* 减去label的宽度 */
}

.parent-relation .el-row {
  width: 100%;
}

.parent-relation .el-col {
  padding: 0 10px;
}

.parent-relation :deep(.el-select) {
  width: 100%;
}

.parent-relation :deep(.el-select .el-input__wrapper) {
  height: 40px;
}

/* 调整下拉选项的最大宽度 */
.parent-relation :deep(.el-select-dropdown__wrap) {
  max-width: none;
}

/* 调整多选标签的样式 */
.parent-relation :deep(.el-select__tags) {
  max-width: calc(100% - 30px);
}

/* 添加子组件关系选择框的样式 */
.child-relation {
  margin-bottom: 20px;
}

.child-relation :deep(.el-form-item__content) {
  width: calc(100% - 100px);
}

.child-relation .el-row {
  width: 100%;
}

.child-relation .el-col {
  padding: 0 10px;
}

.child-relation :deep(.el-select) {
  width: 100%;
}

.child-relation :deep(.el-select .el-input__wrapper) {
  height: 40px;
}

.child-relation :deep(.el-select-dropdown__wrap) {
  max-width: none;
}

.child-relation :deep(.el-select__tags) {
  max-width: calc(100% - 30px);
}

.header-right {
  display: flex;
  align-items: center;
}

/* 修改级联选择器的样式 */
:deep(.el-cascader .el-input__wrapper) {
  height: 40px;
}

.filter-section {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.search-option {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 4px 0;
}

.option-main {
  flex: 1;
  margin-right: 10px;
}

.option-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-sub {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  display: flex;
  gap: 8px;
}

.option-category {
  font-size: 12px;
  color: #409EFF;
  background-color: #ecf5ff;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

:deep(.el-select-dropdown__item) {
  padding: 0 12px;
}

/* 添加新的样式 */
.relations-list {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
}

.relations-header {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.relations-list .el-table {
  margin-top: 10px;
}

/* 添加筛选器样式 */
.relations-filter {
  margin-bottom: 15px;
  padding: 0 10px;
}

.drag-handle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-icon {
  color: #909399;
}

/* 添加拖动时的样式 */
.el-table__row.dragging {
  background-color: #f5f7fa;
  opacity: 0.8;
}

.el-table__row.drag-over {
  border-top: 2px solid #409eff;
}

.sort-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-handle {
  cursor: move;
  color: #909399;
}

.el-table__body-wrapper tr.dragging {
  opacity: 0.5;
  background-color: #f5f7fa;
}

.el-table__body-wrapper tr.drag-over {
  border-top: 2px solid #409eff;
}

/* 添加拖动时的视觉反馈 */
.el-table__body-wrapper tr {
  transition: all 0.3s;
}

/* 修改上传组件样式 */
.image-upload-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 120px;
}

.avatar-uploader:hover {
    border-color: var(--el-color-primary);
}

.image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.upload-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.el-icon--upload {
    font-size: 24px;
    color: #8c939d;
    margin-bottom: 4px;
}

.el-upload__text {
    color: #8c939d;
    font-size: 12px;
    text-align: center;
}

.avatar {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
}

.remove-icon {
    position: absolute;
    top: -6px;
    right: -6px;
    color: #fff;
    background-color: #F56C6C;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;
    z-index: 9;  /* 增加 z-index 值 */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
}

.remove-icon:hover {
    background-color: #f78989;
}

/* 修改上传组件相关的样式 */
.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 120px;
}

.avatar-uploader :deep(.el-upload) {
    width: 100%;
    height: 100%;
}

.image-wrapper {
    position: static;  /* 改为 static，让删除图标相对于 avatar-uploader 定位 */
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.avatar {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
}

/* 修改上传组件相关的样式 */
.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 120px;
}

.avatar-uploader :deep(.el-upload) {
    width: 100%;
    height: 100%;
}

/* 添加这个样��来覆盖默认��内边距 */
.avatar-uploader :deep(.el-upload-dragger) {
    width: 100%;
    height: 100%;
    padding: 0;
    position: relative;  /* 添加相对定位 */
    z-index: 1;  /* 设置较低的 z-index */
}

.image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.avatar {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
}

/* 修改删除图标的样式 */
.remove-icon {
    position: absolute;
    top: -6px;
    right: -6px;
    color: #fff;
    background-color: #F56C6C;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
}

.remove-icon:hover {
    background-color: #f78989;
}

/* 修改图片上传容器的样式 */
.image-upload-container {
    position: relative;  /* 添加相对定位 */
    width: fit-content;  /* 让容器宽度适应内容 */
}

/* 其他样式保持不变 */
.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 120px;
}

.avatar-uploader :deep(.el-upload-dragger) {
    width: 100%;
    height: 100%;
    padding: 0;
}

/* 修改容器和删除图标的样式 */
.image-upload-container {
    position: relative;
    width: fit-content;
}

.remove-icon {
    position: absolute;
    top: -6px;
    right: -6px;
    color: #fff;
    background-color: #F56C6C;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
}

.remove-icon:hover {
    background-color: #f78989;
}

/* 添加新的样式 */
.images-container {
    display: flex;
    gap: 20px;
}

/* 添加标签样式 */
.image-upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.upload-label {
    font-size: 12px;
    color: #606266;
}

/* 添加以下样式到已有的 style 部分 */
.component-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  gap: 12px;
}

.component-info {
  flex: 1;
  min-width: 0;
}

.component-main {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.component-name {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.component-sub {
  font-size: 12px;
  color: #909399;
}

.component-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  flex-shrink: 0;
  cursor: pointer; /* 添加指针样式提示可以预览 */
  transition: all 0.3s; /* 添加过渡效果 */
}

.component-image:hover {
  transform: scale(1.05); /* 悬停时轻微放大效果 */
}

/* 调整下拉选项的最大高度 */
:deep(.el-select-dropdown__wrap) {
  max-height: 400px;
}

/* 调整选项的宽度 */
:deep(.el-select-dropdown) {
  min-width: 300px !important;
}

/* 确保弹出层在其他元素之上 */
:deep(.el-popover) {
  z-index: 9999;
}

/* 调整预览图片的容器样式 */
:deep(.el-popover .el-image) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>