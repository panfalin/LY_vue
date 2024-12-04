<template>
  <div class="container">
    <!-- 左侧图片展示区域 -->
    <div class="left-column">
      <div class="background-board">
        <!-- 保持原有的图片框和文本位置不变 -->
        <div v-if="module_type_img" class="image-frame" style="top: 70px; left: 375px;">
          <el-popover
            effect="light"
            trigger="hover"
            placement="left"
            width="auto"
          >
            <template #default>
              <el-image
                :src="module_type_img"
                style="max-width: 300px; max-height: 400px;"
                fit="contain"
              />
            </template>
            <template #reference>
              <img :src="module_type_img" alt="Image 1" class="image-box" />
            </template>
          </el-popover>
        </div>

        <div v-if="special_plug_img" class="image-frame2" style="top: 378px; left: 400px;">
          <el-popover
            effect="light"
            trigger="hover"
            placement="left"
            width="auto"
          >
            <template #default>
              <el-image
                :src="special_plug_img"
                style="max-width: 500px; max-height: 500px;"
                fit="contain"
              />
            </template>
            <template #reference>
              <img :src="special_plug_img" alt="Image 2" class="image-box" />
            </template>
          </el-popover>
        </div>

        <div v-if="gun_head_img" class="image-frame3" style="top: 14px; left: 40px;">
          <el-popover
            effect="light"
            trigger="hover"
            placement="right"
            width="auto"
          >
            <template #default>
              <el-image
                :src="gun_head_img"
                style="max-width: 400px; max-height: 400px;"
                fit="contain"
              />
            </template>
            <template #reference>
              <img :src="gun_head_img" alt="Image 3" class="image-box2" />
            </template>
          </el-popover>
        </div>

        <div class="image-frame4" style="top: 460px; left: 200px;">
          <el-popover
            effect="light"
            trigger="hover"
            placement="right"
            width="auto"
          >
            <template #default>
              <el-image
                src="http://192.168.1.204:8080/uploads/image-1731609939263-900390322.jpg"
                style="max-width: 400px; max-height: 400px;"
                fit="contain"
              />
            </template>
            <template #reference>
              <img src="http://192.168.1.204:8080/uploads/image-1731609939263-900390322.jpg" alt="Image 4" class="image-box" />
            </template>
          </el-popover>
        </div>

        <div v-if="package_img" class="image-frame5" style="top: 460px; left: 50px;">
          <el-popover
            effect="light"
            trigger="hover"
            placement="right"
            width="auto"
          >
            <template #default>
              <el-image
                :src="package_img"
                style="max-width: 100px; max-height: 100px;"
                fit="contain"
              />
            </template>
            <template #reference>
              <img :src="package_img" alt="Image 5" class="image-box" />
            </template>
          </el-popover>
        </div>

        <!-- 文本显示 -->
        <div v-if="text1" class="text-box red-large-text1" style="top: 280px; left: 34px;">
          {{ text1 }}
        </div>

        <div v-if="text3" class="text-box black-normal-text" style="top: 350px; left: 34px;">
          {{ text3 }} {{ text4 }}
        </div>

        <div v-if="text5" class="text-box black-normal-text3" style="top: 14px; left: 490px;">
          {{ text5 }}
        </div>

        <div v-if="text6" class="text-box black-normal-text2" style="top: 410px; left: 480px;">
          {{ text6 }}
        </div>

        <div v-if="text7" class="text-box black-normal-text" style="top: 400px; left: 34px;">
          {{ text7 }}
        </div>
      </div>
    </div>

    <!-- 中间组件选择区域 -->
    <div class="middle-column">
      <!-- 主组件选择 -->
      <div class="component-buttons">
        <el-button
          v-for="component in mainComponents"
          :key="component.component_id"
          :type="selectedMainComponent === component.component_id ? 'primary' : 'default'"
          @click="handleMainComponentChange(component.component_id)"
          class="component-button"
        >
          {{ component.component_name }}
        </el-button>
      </div>

      <!-- 按分类显示组件选择 -->
      <div class="component-groups-container">
        <template v-if="sortedComponentGroups.length > 0">
          <template v-for="group in sortedComponentGroups" :key="group.category_id">
            <!-- 判断该分类下是否有组件带图片 -->
            <div v-if="hasImages(group.components)" class="image-selection">
              <div class="category-header">
                <div class="category-title">{{ group.category_name }}</div>
                <el-switch
                  v-if="shouldShowSwitch(group.category_id)"
                  v-model="categoryVisibility[group.category_id]"
                  active-text="显示"
                  inactive-text="隐藏"
                />
              </div>
              <div class="image-grid" v-show="shouldShowContent(group.category_id)">
                <div
                  v-for="component in group.components"
                  :key="component.component_id"
                  class="image-item"
                  :class="{ 'selected': selectedComponents[group.category_id] === component.component_id }"
                  @click="handleComponentSelect(group.category_id, component.component_id)"
                >
                  <template v-if="component.image_url">
                    <el-image
                      :src="component.image_url"
                      fit="contain"
                      class="component-image"
                    />
                  </template>
                  <div v-else class="component-text">
                    {{ component.component_name }}
                  </div>
                  <div class="component-info">
                    <div class="component-name">{{ component.component_name }}</div>
                    <div v-if="component.sku" class="component-detail">商品编码: {{ component.sku }}</div>
                    <div v-if="component.sku_name" class="component-detail">商品名称: {{ component.sku_name }}</div>
                    <div v-if="component.bom_number" class="component-detail">BOM单号: {{ component.bom_number }}</div>
                    <div v-if="component.cost" class="component-cost-detail">
                      成本: <span class="cost-value">¥{{
                        component.category_id === 21 ? component.originalCost || component.cost : component.cost
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="button-group">
              <div class="category-header">
                <div class="category-title">{{ group.category_name }}</div>
                <el-switch
                  v-if="shouldShowSwitch(group.category_id)"
                  v-model="categoryVisibility[group.category_id]"
                  active-text="显示"
                  inactive-text="隐藏"
                />
              </div>
              <div class="component-buttons" v-show="shouldShowContent(group.category_id)">
                <el-button
                  v-for="component in group.components"
                  :key="component.component_id"
                  :type="selectedComponents[group.category_id] === component.component_id ? 'primary' : 'default'"
                  @click="handleComponentSelect(group.category_id, component.component_id)"
                  class="component-button"
                >
                  <div class="component-info">
                    <div class="component-name">{{ component.component_name }}</div>
                    <div v-if="component.sku" class="component-detail">商品编码: {{ component.sku }}</div>
                    <div v-if="component.sku_name" class="component-detail">商品名称: {{ component.sku_name }}</div>
                    <div v-if="component.bom_number" class="component-detail">BOM单号: {{ component.bom_number }}</div>
                    <div v-if="component.cost" class="component-cost-detail">
                      成本: <span class="cost-value">¥{{
                        component.category_id === 21 ? component.originalCost || component.cost : component.cost
                      }}</span>
                    </div>
                  </div>
                </el-button>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- 右侧成本展示区域 -->
    <div class="right-column">
      <!-- 添加编码解析部分 - 移到最上方 -->
      <div class="code-parser">
        <div class="parser-header">编码解析</div>
        <el-input
          v-model="codeToAnalyze"
          placeholder="请输入编码(如:G...)"
          clearable
          @change="parseCode"
        >
          <template #append>
            <el-button @click="parseCode">解析</el-button>
          </template>
        </el-input>

        <!-- 添加编码规则说明 -->
        <!-- <div class="code-rule">
          <div class="rule-title">编码规则说明：</div>
          <div class="rule-content">
            <div class="rule-item">
               <span class="rule-prefix">前缀:</span> -->
              <!-- <span>G(国标) / E(欧标) / A(美标)</span> -->
            <!-- </div> -->
            <!--<div class="rule-grid">-->
            <!--  <template v-for="(category, index) in codeRules" :key="index">-->
            <!--    <div class="rule-position">{{index + 1}}</div>-->
            <!--    <div class="rule-category">{{category.name}}</div>-->
            <!--    <div class="rule-example">-->
            <!--      <el-popover-->
            <!--        placement="right"-->
            <!--        :width="200"-->
            <!--        trigger="hover"-->
            <!--      >-->
            <!--        <template #default>-->
            <!--          <div class="code-examples">-->
            <!--            <div v-for="comp in getCategoryComponents(category.id)" :key="comp.component_id">-->
            <!--              {{comp.component_name}}: {{comp.component_code}}-->
            <!--            </div>-->
            <!--          </div>-->
            <!--        </template>-->
            <!--        <template #reference>-->
            <!--          <span class="example-text">查看示例</span>-->
            <!--        </template>-->
            <!--      </el-popover>-->
            <!--    </div>-->
            <!--  </template>-->
            <!--</div>-->
          <!-- </div> -->
        <!-- </div> -->
      </div>

      <!-- 编码显示部分 -->
      <div class="code-display">
        <div class="copyable" @click="copyToClipboard(realShortCode.join(''))">
          <div v-if="selectedValues.length > 0">
            <template v-for="(value, index) in realShortCode" :key="index">{{ value }}</template>
          </div><!-- 这里替换为实际的可复制信息 -->
        </div>
        <div class="non-copyable">
          <template v-if="gunHeadsName?.includes('国')">GO-G</template>
          <template v-else-if="gunHeadsName?.includes('欧')">GO-E</template>
          <template v-else-if="gunHeadsName?.includes('美')">GO-A</template>
          <template v-else-if="1 === 1">****</template>
          <template v-for="(value, index) in selectedValues" :key="index">{{ value }}</template>
          <!-- 这里可以替换为实际的不可复制信息 -->
        </div>
      </div>
      <div v-if="selectedPower !== null" class="code-display">
        <div v-if="selectedNames.length > 0">
          <span>绿洋</span>
          <template v-for="(value, index) in selectedNames" :key="index">{{ value }} </template>
        </div>
      </div>

      <!-- 成本汇总部分 -->
      <div class="cost-summary" v-if="hasCostComponents">
        <div class="summary-title">已选组件明细</div>
        <div class="selected-components">
          <div class="components-list">
            <template v-for="(component, index) in costComponentsList" :key="index">
              <div class="component-item">
                <div class="component-info">
                  <div class="component-name">{{ component.component_name }}</div>
                  <div class="component-sku">{{ component.sku || '无商品编码' }}</div>
                </div>
                <div class="component-cost">¥{{ component.cost || 0 }}</div>
              </div>
            </template>
          </div>
        </div>
        <div class="total-cost">
          总成本：<span class="cost-value">¥{{ totalCost }}</span>
        </div>
        <!-- 添加导出按钮 -->
        <el-button
          type="primary"
          class="export-button"
          @click="exportToExcel"
        >
          导出明细
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { componentApi, categoryApi, relationApi, hashMappingApi } from '@/api/gocean/skuCreate/index'
import * as XLSX from 'xlsx'
import { getSwitchCategoryIds, getCategoryClearConfig, accessoryCodeCategories } from './constants/categoryConfig'
import { ElMessage } from 'element-plus'
import CryptoJS from 'crypto-js';
const base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// 生成哈希并转换为 7 位 Base62 编码
function generateShortCode(input) {
    const hash = CryptoJS.MD5(input).toString();
    let num = parseInt(hash.slice(0, 12), 16);
    let shortCode = '';

    while (shortCode.length < 7) {
        shortCode = base62Chars[num % 62] + shortCode;
        num = Math.floor(num / 62);
    }
    return shortCode;
}

const shortCode = ref('*******')
// 添加基础数据
const categories = ref([])
const components = ref([])
const relations = ref([])

// 添加始化数据的方法
const fetchData = async () => {
  try {
    const [categoriesRes, componentsRes, relationsRes] = await Promise.all([
      categoryApi.list(),
      componentApi.list(),
      relationApi.allList()
    ]);
    
    // 处理响应数据
    categories.value = categoriesRes.data;
    components.value = componentsRes.data;
    relations.value = relationsRes.data;

    console.log('数据加载完成:', {
      categories: categories.value,
      components: components.value,
      relations: relations.value
    });
  } catch (error) {
    console.error('获取数据失败:', error);
    ElMessage.error('获取数据失败，请检查网络或API设置');
  }
}

// 确保组件挂载时获取数据
onMounted(async () => {
  try {
    await fetchData()
  } catch (error) {
    console.error('初始化数据失败:', error)
    ElMessage.error('初始化数据失败')
  }
})

// 修数据部分
const selectedMainComponent = ref(null)
const selectedComponents = ref({})
const componentGroups = ref({})

// 添加文本和图片的响应式变量
const module_type_img = ref(null)
const special_plug_img = ref(null)
const gun_head_img = ref(null)
const package_img = ref(null)
const image4 = ref(null)
const text1 = ref(null)
const text2 = ref(null)
const text3 = ref("**枪头")
const text4 = ref(null)
const text5 = ref(null)
const text6 = ref(null)
const text7 = ref("销售平台")

// 修改主组件列表计算属性
const mainComponents = computed(() => {
  // 返回分类ID为6的组件，并按照分类的排序值排序
  return components.value
    .filter(component => component.category_id === 6)
    .sort((a, b) => {
      const categoryA = categories.value.find(c => c.category_id === a.category_id)
      const categoryB = categories.value.find(c => c.category_id === b.category_id)
      return (categoryA?.sort || 0) - (categoryB?.sort || 0)
    })
})

// 修改组件选择处理方法中的组件组织逻辑
const organizeComponentsByCategory = (components) => {
  const groups = {}
  components.forEach(component => {
    if (!groups[component.category_id]) {
      const category = categories.value.find(cat => cat.category_id === component.category_id)
      groups[component.category_id] = {
        category_id: component.category_id,
        category_name: category?.category_name || '',
        sort: category?.sort || 0,
        components: []
      }
    }
    if (!groups[component.category_id].components.some(c => c.component_id === component.component_id)) {
      groups[component.category_id].components.push(component)
    }
  })

  // 按照分类的排序值排序，返回排序后的数组
  return Object.entries(groups)
    .sort(([, a], [, b]) => a.sort - b.sort)
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})
}

// 修改主组件选择处理方法
const handleMainComponentChange = async (componentId) => {
  // 如果点击的是已选中的组件，则取消选择
  if (selectedMainComponent.value === componentId) {
    selectedMainComponent.value = null
    selectedComponents.value = {}
    componentGroups.value = {}
    return
  }

  // 原有的选择逻辑保持不变
  selectedMainComponent.value = componentId
  selectedComponents.value = {}
  componentGroups.value = {}

  if (!componentId) return

  // 获取包含关系
  const containRelations = relations.value.filter(r =>
    r.parent_component_id === componentId &&
    r.relation_type === 'contain'
  )

  if (containRelations.length > 0) {
    const relatedComponents = containRelations.map(relation =>
      components.value.find(c => c.component_id === relation.child_component_id)
    ).filter(Boolean)

    // 使用新的组织方法
    componentGroups.value = organizeComponentsByCategory(relatedComponents)
  }
}

// 添加提取功率数字的辅助函数
const extractPower = (str) => {
  if (typeof str !== 'string') return null
  const regex = /(\d+(\.\d+)?)\s*KW/
  const match = str.match(regex)
  return match ? match[1] : null
}

function extractStandard(description, knownStandards = []) {
  // 优先匹配已知标准
  for (const standard of knownStandards) {
    if (description.includes(standard)) {
      return standard;
    }
  }

  // 匹配数字前最近的非空字符段
  const match = description.match(/(\S+)\s*\d/); // 捕获数字前面的非空字符段

  // 返回匹配结果或默认值
  return match ? match[1] : "未知标准";
}

const getStandardType = (str) => {
  const regex = /(欧标|国标|美标)/;
  const match = str.match(regex);
  return match ? match[0] : null;
};

// 修改组件选择处理方法
const handleComponentSelect = async (categoryId, componentId) => {
  // 如果点击的是已选中的组件，则取消选择
  if (selectedComponents.value[categoryId] === componentId) {
    selectedComponents.value[categoryId] = null

    // 根据分类清除对应的 image 和 text
    switch (parseInt(categoryId)) {
      case 8: // 型号
        module_type_img.value = null
        text1.value = null
        modelTypeValid.value = '***'
        modelTypeName.value = null
        break
      case 11: // 结构
        const muduleType = components.value.find(c =>
          c.category_id === 8 &&
          selectedComponents.value[8] === c.component_id
        )
        mirrorValid.value = changeMirrorsValid()
        mirrorName.value = null
        break
      case 9: // 功率
        powerName.value = null
        powerValid.value = '***'
        text1.value = null
        break
      case 14: // 特殊插头
        special_plug_img.value = null
        text6.value = null
        countLengthsName.value = null
        specialPlugsName.value = null
        specialPlugsValid.value = '-*'
        break
      case 12: // 枪头
        gun_head_img.value = null
        text3.value = "**枪头" // 恢复默认值
        gunHeadsName.value = null
        powerTypeName.value = null
        gunHeadsValid.value = changeGunHeadsValid()
        break
      case 13: // 认证
        image4.value = null
        certificationName.value = null
        certificationValid.value = '**'
        break
      case 10: // 主板
        boardFeatureName.value = null
        boardFeatureValid.value = '-***'
        break
      case 16: // 电缆长度
        text5.value = null
        cableLengthsName.value = null
        countLengthsName.value = null
        cableLengthsValid.value = null
        gunHeadsValid.value = changeGunHeadsValid()
        // 恢复线缆原始成本
        const cableComponent = components.value.find(c =>
          c.category_id === 21 &&
          selectedComponents.value[21] === c.component_id
        )
        if (cableComponent && cableComponent.originalCost) {
          cableComponent.cost = cableComponent.originalCost
        }
        break
      case 15: // 销售平台
        text7.value = "销售平台" // 恢复默认值
        platformsName.value = null
        platformsValid.value = '-**'
        break
      case 20:
        const moduleTypeComponent = components.value.find(c =>
          c.category_id === 11 &&
          selectedComponents.value[11] === c.component_id
        )
        if (moduleTypeComponent) {
          module_type_img.value = moduleTypeComponent.show_image_url
        }
        mirrorValid.value = changeMirrorsValid()
        break
      case 21:
        gunHeadsValid.value = changeGunHeadsValid()
      case 22:
        package_img.value = null
        break
    }

    // 获取当组件的所有关系
    const currentComponentRelations = relations.value.filter(r =>
      r.parent_component_id === componentId &&
      (r.relation_type === 'contain' || r.relation_type === 'depend')
    )

    // 只清空有关联关系的组件
    if (currentComponentRelations.length > 0) {
      // 获取所有关联的子组件ID
      const relatedChildIds = currentComponentRelations.map(r => r.child_component_id)

      // 清空相关的组件选择
      Object.entries(selectedComponents.value).forEach(([id, selectedId]) => {
        if (relatedChildIds.includes(selectedId)) {
          selectedComponents.value[id] = null
        }
      })

      // 清空相关的组件组
      Object.keys(componentGroups.value).forEach(id => {
        const groupComponents = componentGroups.value[id].components
        if (groupComponents.some(c => relatedChildIds.includes(c.component_id))) {
          delete componentGroups.value[id]
        }
      })
    }
    return
  }

  // 原有的选择逻辑保持不变
  selectedComponents.value[categoryId] = componentId

  // 获取所有已选组件
  const selectedComponentIds = Object.values(selectedComponents.value).filter(Boolean)

  // 获取包含关系子组件
  const containRelations = relations.value.filter(r =>
    selectedComponentIds.includes(r.parent_component_id) &&
    r.relation_type === 'contain'
  )

  // 获取依赖关系的子组件
  const dependRelations = relations.value.filter(r =>
    r.relation_type === 'depend'
  )

  // 获取所有可显示的组件
  const availableComponents = []

  // 处理包含关系的组件
  containRelations.forEach(relation => {
    const component = components.value.find(c => c.component_id === relation.child_component_id)
    if (component) {
      // 检查该组件是否有依赖关系
      const dependsOn = dependRelations.filter(r => r.child_component_id === component.component_id)

      if (dependsOn.length === 0) {
        // 如果没有依赖关系，直接添加
        availableComponents.push({
          ...component,
          relation_type: 'contain'
        })
      } else {
        // 如果有依赖关系，检查依赖的父组件是否被选中
        const dependencyMet = dependsOn.some(dep =>
          selectedComponentIds.includes(dep.parent_component_id)
        )
        if (dependencyMet) {
          availableComponents.push({
            ...component,
            relation_type: 'contain'
          })
        }
      }
    }
  })

  // 按分类组织组件
  const newGroups = {}
  availableComponents.forEach(component => {
    const categoryId = component.category_id
    if (!newGroups[categoryId]) {
      const category = categories.value.find(cat => cat.category_id === categoryId)
      newGroups[categoryId] = {
        category_id: categoryId,
        category_name: category?.category_name || '',
        sort: category?.sort || 0,
        components: []
      }
    }
    if (!newGroups[categoryId].components.some(c => c.component_id === component.component_id)) {
      newGroups[categoryId].components.push(component)
    }
  })

  // 检查每个分下是否只有一个组件，如果是则自动选择
  Object.entries(newGroups).forEach(([catId, group]) => {
    if (group.components.length === 1) {
      const singleComponent = group.components[0]
      selectedComponents.value[catId] = singleComponent.component_id

      // 如果是需要设置片或文字的分类，也自动处理
      const selectedComponent = components.value.find(c => c.component_id === singleComponent.component_id)
      if (selectedComponent) {
        switch (parseInt(catId)) {
          case 8:
            module_type_img.value = selectedComponent.image_url
            text1.value = selectedComponent.component_name + '款'
            modelTypeName = modelTypeName + '款'
            break
            case 11:
              module_type_img.value = selectedComponent.show_image_url
              const power11 = extractPower(selectedComponent.component_name)
              if (power11) {
                const modelComponent = components.value.find(c => c.component_id === selectedComponents.value['8'])
                text1.value = modelComponent ? modelComponent.component_name + '款' : ''
              text1.value = text1.value + power11 + 'KW'
            }
            break
          case 9:
            const power9 = extractPower(selectedComponent.component_name)
            if (power9) {
              const modelComponent = components.value.find(c => c.component_id === selectedComponents.value['8'])
              text1.value = modelComponent ? modelComponent.component_name + '款' : ''
              text1.value = text1.value + power9 + 'KW'
            }
            break
          case 14:
            special_plug_img.value = selectedComponent.image_url
            const length = extractLength(selectedComponent.component_name)
            if (length) {
              text6.value = length + 'M'
            }
            break
          case 12:
            gun_head_img.value = selectedComponent.image_url
            if (selectedComponent.component_name.includes('国标')) {
              text3.value = '国标枪头'
            } else if (selectedComponent.component_name.includes('欧标')) {
              text3.value = '欧标枪头'
            } else if (selectedComponent.component_name.includes('美标')) {
              text3.value = '美标枪头'
            }
            break
          case 13:  // 添加镜面图片
            image4.value = selectedComponent.image_url
            break
          case 16:
            text5.value = selectedComponent.component_name.replace('米', 'M')
            break
          case 15:
            text7.value = selectedComponent.component_name
            break
          case 20:
            module_type_img.value = selectedComponent.show_image_url
            break
        }
      }
    }
  })

  // 按分类排序值排序
  const sortedGroups = Object.entries(newGroups)
    .sort(([, a], [, b]) => a.sort - b.sort)
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})

  // 合并现有的组件组
  componentGroups.value = {
    ...Object.entries(componentGroups.value)
      .filter(([id]) => parseInt(id) <= parseInt(categoryId))
      .reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {}),
    ...sortedGroups
  }

  // 根据分类ID设置图片、文字和编码
  const selectedComponent = components.value.find(c => c.component_id === componentId)
  if (selectedComponent) {
    switch (parseInt(categoryId)) {
      case 8: // 型号
        module_type_img.value = selectedComponent.image_url
        text1.value = selectedComponent.component_name + '款'
        modelTypeValid.value = selectedComponent.component_code.replace(' ', '')
        shortModelCode.value = selectedComponent.component_name.replace(' ', '').slice(0, 3) + '-'
        modelTypeName.value = selectedComponent.component_name + ' '
        selectedPower.value = modelTypeValid.value
        selectedModelType.value = modelTypeName.value
        break
      case 11: // 结构
        module_type_img.value = selectedComponent.show_image_url
        mirrorName.value = extractCover(selectedComponent.component_name) + ' '
        const lensComponent = components.value.find(c => c.category_id === 20 && selectedComponents.value[20] === c.component_id)
        mirrorValid.value = changeMirrorsValid()
        break
      case 9: // 功率
        const power9 = extractPower(selectedComponent.component_name)
        powerName.value = power9 + 'KW'
        powerValid.value = selectedComponent.component_code.replace(' ', '')
        if (power9) {
          const modelComponent = components.value.find(c => c.component_id === selectedComponents.value['8'])
          text1.value = modelComponent ? modelComponent.component_name + '款' : ''
          text1.value = text1.value + power9 + 'KW'
        }
        break
      case 14: // 特殊插头
        special_plug_img.value = selectedComponent.image_url
        const length = extractLength(selectedComponent.component_name)
        if (cableLengthsName.value) {
          const cableLength = extractLength(cableLengthsName.value)
          countLengthsName.value = '总长' + (cableLength + length) + '米 '
        }
        specialPlugsName.value = extractStandard(selectedComponent.component_name) + length + '米插头 '
        specialPlugsValid.value = '-' + selectedComponent.component_code.replace(' ', '')
        if (length) {
          text6.value = length + 'M'
        }
        break
      case 12: // 枪头
        gunHeadsName.value = selectedComponent.component_name
        gunHeadName.value = formatGunHeadName(selectedComponent.component_name) + ' '
        powerTypeName.value = getStandardType(selectedComponent.component_name)+ ' '
        gunHeadsValid.value = changeGunHeadsValid()
        gun_head_img.value = selectedComponent.image_url
        if (selectedComponent.component_name.includes('国标')) {
          text3.value = '国标枪头'
        } else if (selectedComponent.component_name.includes('欧标')) {
          text3.value = '欧标枪头'
        } else if (selectedComponent.component_name.includes('美标')) {
          text3.value = '美标枪头'
        }
        break
      case 13:  // 认证
        certificationName.value = selectedComponent.component_name + ' '
        certificationValid.value = selectedComponent.component_code.replace(' ', '')
        image4.value = selectedComponent.image_url
        break
      case 10:  // 主板
        boardFeatureName.value = selectedComponent.component_name.slice(-8) + ' ';
        boardFeatureValid.value = '-' + selectedComponent.component_code
        break
      case 16: // 电缆长度
        cableLengthsName.value = '枪线' + selectedComponent.component_name + ' '
        cableLengthsValid.value = selectedComponent.component_code.replace(' ', '')
        text5.value = selectedComponent.component_name.replace('米', 'M')
        // 提取电缆长度数值
        const cableLength = parseFloat(selectedComponent.component_name)
        if (specialPlugsName.value) {
          const length = extractLength(specialPlugsName.value)
          countLengthsName.value = '总长' + (cableLength + length) + '米'
        }

        // 获取分类21(线缆)的组件
        const cableComponent = components.value.find(c =>
          c.category_id === 21 &&
          selectedComponents.value[21] === c.component_id
        )

        // 如果存在线缆组件,更新其成本
        if (cableComponent) {
          // 保存原始成本（如果还没有保存的话）
          if (!cableComponent.originalCost) {
            cableComponent.originalCost = cableComponent.cost
          }
          // 更新线缆组件的成本为基础成本乘以长度
          const baseCost = parseFloat(cableComponent.originalCost) || 0
          cableComponent.cost = (baseCost * cableLength).toFixed(2)
        }
        gunHeadsValid.value = changeGunHeadsValid()
        break
      case 15: // 销售平台
        platformsName.value = selectedComponent.component_name
        platformsValid.value = '-' + selectedComponent.component_code.replace(' ', '')
        text7.value = selectedComponent.component_name
        break
      case 20:
        mirrorValid.value = changeMirrorsValid()
        module_type_img.value = selectedComponent.show_image_url
        break
      case 21: // 线缆
        const cableLengthComponent = components.value.find(c => c.component_id === selectedComponents.value[16])
        if (cableLengthComponent) {
          const cableLength = parseFloat(cableLengthComponent.component_name)
          if (!selectedComponent.originalCost) {
            selectedComponent.originalCost = selectedComponent.cost
          }
          const baseCost = parseFloat(selectedComponent.originalCost) || 0
          selectedComponent.cost = (baseCost * cableLength).toFixed(2)
        }
        gunHeadsValid.value = changeGunHeadsValid()
        break
      case 22: // 收纳包
        const packageComponent = components.value.find(c => c.component_id === selectedComponents.value[22])
        package_img.value = packageComponent.image_url
        break
    }
  }

  // 在处理枪头的逻辑中添加前缀拼接
  if (1 === 1) { // 假设 12 是枪头的分类ID
    let prefix = '';
    if (gunHeadsName.value?.includes('国')) {
      prefix = 'GO-G';
    } else if (gunHeadsName.value?.includes('欧')) {
      prefix = 'GO-E';
    } else if (gunHeadsName.value?.includes('美')) {
      prefix = 'GO-A';
    }

    // 检查前缀是否已经添加
    const hasPrefix = selectedValues.value.some(value => value.startsWith(prefix));

    // 拼接前缀和 selectedValues
    const prefixedValues = hasPrefix
      ? selectedValues.value
      : [`${prefix}${selectedValues.value.join('')}`];

    // 打印拼接后的值
    console.log('prefixed selectedValues:', prefixedValues);

    // 调用 generateShortCode 函数
    shortCode.value = generateShortCode(prefixedValues.join('-')); // 确保传递的是字符串
    console.log('shortCode:', shortCode.value);
  }
}

function changeGunHeadsValid() {
  const cableComp = components.value.find(c => c.category_id === 21 && selectedComponents.value[21] === c.component_id)
  if (cableComp) {
    cableValid.value = cableComp.component_code.replace(' ', '')
  } else {
    cableValid.value = '**'
  }
  // 获取电缆长度组件
  const lengthComp = components.value.find(c => c.category_id === 16 && selectedComponents.value[16] === c.component_id)
  if (lengthComp) {
    lengthValid.value = lengthComp.component_code.replace(' ', '')
        .replace(/(\d+)\.?(\d)?M?/i, (_, num1, num2) => {
          return (num1 + (num2 || '0')).padStart(3, '0')
        })
  } else {
    lengthValid.value = '***'
  }
  const gunHeadsComponent = components.value.find(c => c.category_id === 12 && selectedComponents.value[12] === c.component_id)
  if (gunHeadsComponent) {
    gunHeadsValid.value = gunHeadsComponent.component_code.replace(' ', '')
  } else {
    gunHeadsValid.value = '**'
  }
  return '-' + gunHeadsValid.value + cableValid.value + lengthValid.value
}

function changeMirrorsValid() {
  const mirrorComp = components.value.find(c => c.category_id === 11 && selectedComponents.value[11] === c.component_id)
  if (mirrorComp) {
    mirrorValid.value = mirrorComp.component_code.replace(' ', '')
  } else {
    mirrorValid.value = '**'
  }
  const lensComp = components.value.find(c => c.category_id === 20 && selectedComponents.value[20] === c.component_id)
  if (lensComp) {
    lensValid.value = lensComp.component_code.replace(' ', '')
  } else {
    lensValid.value = '**'
  }
  return '-' + mirrorValid.value + lensValid.value
}

// 提取 "颜色上盖" 的方法
function extractCover(input) {
    console.log("输入字符串：", input);
    // 匹配 "颜色上盖" 的格式，无论它位于字符串的中间或结尾
    const regex = /(黑色|白色|银色|绿色|红色|蓝色|灰色|金色)上盖/;
    const match = input.match(regex); // 查找第一个符合条件的 "颜色上盖"
    return match ? match[0] : null; // 如果匹配成功，返回完整匹配结果，否则返回 null
}

function formatGunHeadName(description) {
  // 匹配“款”信息
  const matchModel = description.match(/(\d+)款/);
  // 匹配颜色信息
  const matchColor = description.match(/(白色|黑色|红色|蓝色|绿色|黄色|灰色)/);

  // 如果匹配成功，组合结果
  if (matchModel && matchColor) {
    return `${matchModel[1]}款${matchColor[0]}枪头 `;
  }

  // 如果没有匹配到完整信息，返回原始字符串
  return description;
}

// 添加提取长度的辅助函数
const extractLength = (str) => {
  if (typeof str !== 'string') return null;

  // 匹配包含数字和"米"的模式，如 "5.0米", "10米", "1.5M" 等
  const regex = /(\d+(\.\d+)?)\s*(米|M)/;

  const match = str.match(regex);

  // 如果匹配到有效的长度值，返回数字，否则返回 null
  return match ? parseFloat(match[1]) : null;
};

// 添加响应式数据
const modelTypeValid = ref('****')
const modelTypeName = ref(null)
const powerTypeName = ref(null)
const powerValid = ref('***')
const powerName = ref(null)
const certificationValid = ref('**')
const certificationName = ref(null)
const boardFeatureValid = ref('-***')
const boardFeatureName = ref(null)
const mirrorValid = ref('-****')
const mirrorName = ref(null)
const gunHeadsValid = ref('-*******')
const gunHeadsName = ref(null)
const gunHeadName = ref(null)
const countLengthsName = ref(null)
const specialPlugsValid = ref('-*')
const specialPlugsName = ref(null)
const cableLengthsValid = ref(null)
const cableLengthsName = ref(null)
const platformsValid = ref('-**')
const platformsName = ref(null)
const accessoryValid = ref('-********')
const accessoryName = ref(null)
const lensValid = ref(null)
const cableValid = ref(null)
const lengthValid = ref(null)
const shortModelCode = ref('**-')

// 添加计算属性
const selectedValues = computed(() => {
  return [
    modelTypeValid.value,
    powerValid.value,
    certificationValid.value,
    boardFeatureValid.value,
    mirrorValid.value,
    gunHeadsValid.value,
    specialPlugsValid.value,
    generateAccessoryCode(),  // 添加动态生成的配件编码
    platformsValid.value,
  ].filter(value => value !== undefined && value !== null)
})

const realShortCode = computed(() => {
  return [
    shortModelCode.value,
    shortCode.value,
    platformsValid.value,
  ].filter(value => value !== undefined && value !== null)
})

const selectedNames = computed(() => {
  return [
    modelTypeName.value,
    powerTypeName.value,
    powerName.value,
    certificationName.value,
    mirrorName.value,
    gunHeadName.value,
    cableLengthsName.value,
    specialPlugsName.value,
    countLengthsName.value,
    boardFeatureName.value,
    platformsName.value,
    // accessoryName.value
  ].filter(value => value !== undefined && value !== null)
})

// 添加判断分类是否有图片的方法
const hasImages = (components) => {
  return components.some(component => component.image_url)
}

// 添加处理组件显示的辅助方法
// const handleComponentDisplay = (categoryId, component) => {
//   switch (parseInt(categoryId)) {
//     case 8:
//       module_type_img.value = component.image_url
//       text1.value = component.component_name + '款'
//       break
//     case 11:
//       module_type_img.value = component.show_image_url
//       const power11 = extractPower(component.component_name)
//       if (power11) {
//         const modelComponent = components.value.find(c => c.component_id === selectedComponents.value['8'])
//         text1.value = modelComponent ? modelComponent.component_name + '款' : ''
//         text1.value = text1.value + power11 + 'KW'
//       }
//       break
//     case 20:
//       module_type_img.value = selectedComponent.show_image_url
//       break
//     // ... 其他 case 持不变 ...
//   }
// }

// 添加已选组件列表的计算属
const selectedComponentsList = computed(() => {
  return Object.values(selectedComponents.value)
    .filter(Boolean)
    .map(componentId => components.value.find(c => c.component_id === componentId))
    .filter(Boolean)
})

// 修改成本相关的计算属性
const costComponentsList = computed(() => {
  return selectedComponentsList.value
    .filter(component => {
      // 只包含可见分类的组件
      const categoryId = component.category_id
      return !shouldShowSwitch(categoryId) || categoryVisibility.value[categoryId]
    })
    .map(component => {
      // 如果是线缆组件且选择了长度,动态计算成本
      if (component.category_id === 21 && selectedComponents.value[16]) {
        const lengthComponent = components.value.find(c =>
          c.component_id === selectedComponents.value[16]
        )
        if (lengthComponent) {
          const length = parseFloat(lengthComponent.component_name)
          const cableCost = parseFloat(component.originalCost)
          return {
            ...component,
            calculatedCost: (cableCost * length).toFixed(2)
          }
        }
      }
      return component
    })
    .filter(component => component.cost || component.calculatedCost)
})

const hasCostComponents = computed(() => {
  return costComponentsList.value.length > 0
})

const totalCost = computed(() => {
  return costComponentsList.value
    .reduce((sum, component) => sum + (parseFloat(component.cost) || 0), 0)
    .toFixed(2)
})

// 修改处理组件关系树的计算属性
const relationTreeOptions = computed(() => {
  // 构建组件树
  const treeMap = new Map()

  // 首先添加所有组件作为可能的父节点
  components.value.forEach(component => {
    treeMap.set(component.component_id, {
      label: component.component_name,
      value: component.component_id,
      children: []
    })
  })

  // 添加所有类型的关系
  relations.value.forEach(relation => {
    const parentNode = treeMap.get(relation.parent_component_id)
    const childComponent = components.value.find(c => c.component_id === relation.child_component_id)

    if (parentNode && childComponent) {
      // 检查是否已经添加过这个子节点
      const existingChild = parentNode.children.find(child => child.value === childComponent.component_id)
      if (!existingChild) {
        // 创建子节点，并递归添加其子组件
        const childNode = {
          label: `${childComponent.component_name} (${relationTypeMap[relation.relation_type]})`,
          value: childComponent.component_id,
          children: []
        }
        parentNode.children.push(childNode)

        // 递归添加子节点的所有关系
        const addChildrenRecursively = (node, parentId) => {
          const childRelations = relations.value.filter(r =>
            r.parent_component_id === parentId
          )

          childRelations.forEach(childRelation => {
            const grandChild = components.value.find(c => c.component_id === childRelation.child_component_id)
            if (grandChild) {
              const grandChildNode = {
                label: `${grandChild.component_name} (${relationTypeMap[childRelation.relation_type]})`,
                value: grandChild.component_id,
                children: []
              }
              node.children.push(grandChildNode)
              // 递归添加更深层的子组件
              addChildrenRecursively(grandChildNode, grandChild.component_id)
            }
          })
        }

        // 开始递归添加子组件
        addChildrenRecursively(childNode, childComponent.component_id)
      }
    }
  })

  // 返回有有子节点的组件作为根节点
  return Array.from(treeMap.values())
    .filter(node => node.children.length > 0)
})

// 添加关系类型映射
const relationTypeMap = {
  'contain': '包含',
  'depend': '依赖',
  'alternative': '替代'
}

// 改计算属性
const selectedPower = computed(() => powerValid.value || modelTypeValid.value)
const selectedModelType = computed(() => modelTypeName.value)

// 添加放相关的响应式数
const scaleValue = ref(85) // 默认值与当前的 transform: scale(0.85) 一致

// 添加处理缩放变化的方法
const handleScaleChange = (value) => {
  const scale = value / 100
  const board = document.querySelector('.background-board')
  if (board) {
    board.style.transform = `scale(${scale})`
  }
}

// 添加一个新的计算属性来处理排序
const sortedComponentGroups = computed(() => {
  return Object.values(componentGroups.value)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
})

// 监听所有分类的组件变化
watch(
  () => componentGroups.value,
  (newGroups) => {
    // 遍历所有分类
    Object.entries(newGroups).forEach(([categoryId, group]) => {
      // 如果该分类下只有一个组件
      if (group.components && group.components.length === 1) {
        const component = group.components[0]

        // 自动选择该组件
        selectedComponents.value[categoryId] = component.component_id

        // 根据不同分类处理特殊逻辑
        switch (parseInt(categoryId)) {
          case 9: // 功率
            powerValid.value = component.component_code.replace(' ', '')
            const power = extractPower(component.component_name)
            powerName.value = power + 'KW '
            if (power) {
              const modelComponent = components.value.find(c =>
                c.component_id === selectedComponents.value['8']
              )
              text1.value = modelComponent ? modelComponent.component_name + '款' : ''
              text1.value = text1.value + power + 'KW'
            }
            break

          case 8: // 型号
            module_type_img.value = component.image_url
            text1.value = component.component_name + '款'
            modelTypeValid.value = component.component_code.replace(' ', '')
            modelTypeName.value = component.component_name + ' '
            break

          case 10: // 主板
            boardFeatureValid.value = '-' + component.component_code.replace(' ', '')
            break

          case 14: // 特殊插头
            special_plug_img.value = component.image_url
            specialPlugsValid.value = '-' + component.component_code.replace(' ', '')
            const length = extractLength(component.component_name)
            if (cableLengthsName.value) {
              const cableLength = extractLength(cableLengthsName.value)
              countLengthsName.value = '总长' + (cableLength + length) + '米 '
            }
            specialPlugsName.value = extractStandard(component.component_name) + length + '米插头 '
            if (length) {
              text6.value = length + 'M'
            }
            break
          case 20:
            module_type_img.value = component.show_image_url
            break
        }
      }
    })
  },
  { immediate: true, deep: true }
)

// 添加分类可见性的响应式对象
const categoryVisibility = ref({})

// 初始化所有分类的可见性为true
watch(() => componentGroups.value, (newGroups) => {
  Object.keys(newGroups).forEach(categoryId => {
    if (categoryVisibility.value[categoryId] === undefined) {
      categoryVisibility.value[categoryId] = true
    }
  })
}, { immediate: true })

// 使用配置中的分类ID
const shouldShowSwitch = (categoryId) => getSwitchCategoryIds().includes(Number(categoryId))

// 修改 watch 函数来处理已选组件明细
watch(categoryVisibility, (newVisibility, oldVisibility) => {
  Object.entries(newVisibility).forEach(([categoryId, isVisible]) => {
    if (oldVisibility[categoryId] && !isVisible) {
      const id = Number(categoryId)

      if (selectedComponents.value[id]) {
        selectedComponents.value[id] = null
        selectedComponents.value = { ...selectedComponents.value }
      }

      // 使用配置处理清除逻辑
      const clearConfig = getCategoryClearConfig(id)
      if (clearConfig) {
        // 清除图片
        clearConfig.images.forEach(imageName => {
          if (typeof imageName === 'string' && imageName in window) {
            window[imageName].value = null
          }
        })

        // 清除文本
        clearConfig.texts.forEach(textName => {
          if (typeof textName === 'string' && textName in window) {
            window[textName].value = null
          }
        })

        // 清除其他内容
        clearConfig.others.forEach(clearFn => {
          if (typeof clearFn === 'function') {
            clearFn()
          }
        })
      }
    }
  })
}, { deep: true })

// 添加判断分类内是否显示的计算属性
const shouldShowContent = (categoryId) => {
  const id = Number(categoryId)
  return shouldShowSwitch(id) ? categoryVisibility.value[id] : true
}
// 修改导出 Excel 的方法
const exportToExcel = async () => {
  try {
    // 直接使用 public 目录下的文件
    const response = await fetch('./template/导出BOM模板.xlsx')
    if (!response.ok) {
      throw new Error('模板文件加载失败')
    }

    const templateArrayBuffer = await response.arrayBuffer()

    // 创建新的工作簿
    const wb = XLSX.read(templateArrayBuffer, {
      type: 'array',
      cellStyles: true,
      cellDates: true,
      cellNF: true
    })

    // 获取第一个工作表
    const ws = wb.Sheets[wb.SheetNames[0]]

    // 获取编码信息
    const codePrefix = gunHeadsName.value?.includes('国') ? 'G' :
                      gunHeadsName.value?.includes('欧') ? 'E' :
                      gunHeadsName.value?.includes('美') ? 'A' : ''
    const fullCode = codePrefix + selectedValues.value.join('')

    // 从第4行开始添加组件数据
    const componentData = costComponentsList.value.map((component, index) => [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      component.sku || '无商品编码',       // 物料编码
      component.sku_name,           // 物料名称
      '个',                              // 单位
      1,                                 // 数量
    ])

    // 添加组件数据，从第4行开始
    XLSX.utils.sheet_add_aoa(ws, componentData, { origin: 'A4' })

    // 添加合计行
    // XLSX.utils.sheet_add_aoa(ws, [
    //   ['合计', '', '', '', '', '', '', parseFloat(totalCost.value), '']
    // ], { origin: `A${4 + componentData.length}` })

    // 生成文件名
    const now = new Date()
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
    const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
    const fileName = `组件明细_${dateStr}_${timeStr}.xlsx`

    // 导出文件
    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true,
      cellDates: true,
      cellNF: true
    })

    // 创建 Blob 对象
    const blob = new Blob([wbout], { type: 'application/octet-stream' })

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()

    // 清理
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败：' + error.message)
  }
}

// 添加新的响应式变量
const codeToAnalyze = ref('')

// 修改 parseCode 方法
const parseCode = async () => {
  if (!codeToAnalyze.value) {
    ElMessage.warning('请输入需要解析的编码')
    return
  }

  try {
    // 清空当前选择
    selectedMainComponent.value = null
    selectedComponents.value = {}
    componentGroups.value = {}

    const code = codeToAnalyze.value.trim()

    // // 解析前缀
    // let prefix = ''
    // if (code.startsWith('G')) {
    //   prefix = '国标'
    // } else if (code.startsWith('E')) {
    //   prefix = '欧标'
    // } else if (code.startsWith('A')) {
    //   prefix = '美标'
    // } else {
    //   throw new Error('无效的编码前缀')
    // }

    // 获取短编码
    const hashParts = code.split('-')
    const shortHash = hashParts.slice(1, hashParts.length - 1).join('-'); // 提取短编码部分

    // 从数据库中获取长编码
    const response = await hashMappingApi.getOriginalValue(shortHash)
    let originalCode = response.data.original_value; // 将 const 改为 let
    // 根据长编码解析

    // 查找匹配的组件
    const findComponentByCode = (categoryId, code) => {
      return components.value.find(c =>
        c.category_id === categoryId &&
        c.component_code.replace(/\s/g, '') === code
      )
    }

    // 1. 型号 (通常是前面的部分)
    const modelComponent = components.value.find(c =>
      c.category_id === 8 &&
      originalCode.startsWith(c.component_code.replace(/\s/g, ''))
    )

    if (modelComponent) {
      // 首先获取父组件数据
      const serierData = await getParentComponents(modelComponent.component_id)
      if (serierData && serierData.length > 0) {
        const seriesComponent = serierData[0]  // 获取第一个父组件
        if (seriesComponent) {
          const typeComponent = components.value.find(c =>
            c.category_id === seriesComponent.parent_category_id &&
            c.component_code === seriesComponent.parent_component_code
          )
          if (typeComponent) {
            const modoleData = await getParentComponents(typeComponent.component_id)
            await handleMainComponentChange(modoleData[0].parent_component_id)
            await nextTick()
            await handleComponentSelect(typeComponent.category_id, typeComponent.component_id)
          }
        }
      }

      // 然后选择型号组件
      await handleComponentSelect(modelComponent.category_id, modelComponent.component_id)
      module_type_img.value = modelComponent.image_url
      text1.value = modelComponent.component_name + '款'
      modelTypeValid.value = modelComponent.component_code.replace(' ', '')
      modelTypeName.value = modelComponent.component_name + ' '
      originalCode = originalCode.slice(modelComponent.component_code.replace(/\s/g, '').length)
    }

    // 2. 功率
    const powerComponent = findComponentByCode(9, originalCode.slice(0, 3))
    if (powerComponent) {
      await handleComponentSelect(powerComponent.category_id, powerComponent.component_id)
      powerValid.value = powerComponent.component_code.replace(' ', '')
      const power = extractPower(powerComponent.component_name)
      powerName.value = power + 'KW'
      if (power) {
        text1.value = modelComponent ? modelComponent.component_name + '款' : ''
        text1.value = text1.value + power + 'KW'
      }
      originalCode = originalCode.slice(powerComponent.component_code.replace(/\s/g, '').length)
    }

    // 3. 认证
    const certComponent = findComponentByCode(13, originalCode.slice(0, 2))
    if (certComponent) {
      await handleComponentSelect(certComponent.category_id, certComponent.component_id)
      certificationName.value = certComponent.component_name + ' '
      certificationValid.value = certComponent.component_code.replace(' ', '')
      image4.value = certComponent.image_url
      originalCode = originalCode.slice(certComponent.component_code.replace(/\s/g, '').length + 1)
    }

    // 4. 主板
    const boardComponent = findComponentByCode(10, originalCode.slice(0, 3))
    if (boardComponent) {
      await handleComponentSelect(boardComponent.category_id, boardComponent.component_id)
      boardFeatureName.value = boardComponent.component_name.slice(-8) + ' ';
      boardFeatureValid.value = '-' + boardComponent.component_code
      originalCode = originalCode.slice(boardComponent.component_code.replace(/\s/g, '').length + 1)
    }

    // 5. 结构
    const mirrorComponent = findComponentByCode(11,originalCode.slice(0, 2))
    if (mirrorComponent) {
      await handleComponentSelect(mirrorComponent.category_id, mirrorComponent.component_id)
      mirrorValid.value = '-' + mirrorComponent.component_code.replace(' ', '')
      mirrorName.value = extractCover(mirrorComponent.component_name) + ' '
      module_type_img.value = mirrorComponent.show_image_url
      originalCode = originalCode.slice(mirrorComponent.component_code.replace(/\s/g, '').length)
    }

    // 5.5 镜片
    const mirrorGlassComponent = findComponentByCode(20,originalCode.slice(0, 2))
    if (mirrorGlassComponent) {
      if (!selectedComponents.value[mirrorGlassComponent.category_id]) {
        await handleComponentSelect(mirrorGlassComponent.category_id, mirrorGlassComponent.component_id)
      }
      originalCode = originalCode.slice(mirrorGlassComponent.component_code.replace(/\s/g, '').length + 1)
    }

    // 6. 枪头
    const gunComponent = findComponentByCode(12,originalCode.slice(0, 2))
    if (gunComponent) {
      await handleComponentSelect(gunComponent.category_id, gunComponent.component_id)
      gunHeadsName.value = gunComponent.component_name
      gunHeadName.value = formatGunHeadName(gunComponent.component_name) + ' '
      powerTypeName.value = getStandardType(gunComponent.component_name)+ ' '
      gunHeadsValid.value = '-' + gunComponent.component_code.replace(' ', '')
      gun_head_img.value = gunComponent.image_url
      if (gunComponent.component_name.includes('国标')) {
        text3.value = '国标枪头'
      } else if (gunComponent.component_name.includes('欧标')) {
        text3.value = '欧标枪头'
      } else if (gunComponent.component_name.includes('美标')) {
        text3.value = '美标枪头'
      }
      originalCode = originalCode.slice(gunComponent.component_code.replace(/\s/g, '').length)
    }

    // 6.5 线缆供应商
    const cableSupplierComponent = findComponentByCode(21,originalCode.slice(0, 2))
    if (cableSupplierComponent) {
      await handleComponentSelect(cableSupplierComponent.category_id, cableSupplierComponent.component_id)
      originalCode = originalCode.slice(cableSupplierComponent.component_code.replace(/\s/g, '').length)
    }

    // 6.7 线缆长度
    const cableLengthCode = originalCode.slice(0, 3)
    let formatCableLengthCode = (parseInt(cableLengthCode, 10) / 10).toFixed(cableLengthCode < 100 ? 1 : 0) + 'M';
    const cableLengthComponent = findComponentByCode(16,formatCableLengthCode)
    if (cableLengthComponent) {
      await handleComponentSelect(cableLengthComponent.category_id, cableLengthComponent.component_id)
      originalCode = originalCode.slice(cableLengthCode.replace(/\s/g, '').length + 1)
    }

    // 7. 特殊插头
    const plugComponent = findComponentByCode(14,originalCode.slice(0, 1))
    if (plugComponent) {
      await handleComponentSelect(plugComponent.category_id, plugComponent.component_id)
      special_plug_img.value = plugComponent.image_url
      specialPlugsValid.value = '-' + plugComponent.component_code.replace(' ', '')
      const length = extractLength(plugComponent.component_name)
      if (cableLengthsName.value) {
        const cableLength = extractLength(cableLengthsName.value)
        countLengthsName.value = '总长' + (cableLength + length) + '米 '
      }
      specialPlugsName.value = extractStandard(plugComponent.component_name) + length + '米插头 '
      if (length) {
        text6.value = length + 'M'
      }
      originalCode = originalCode.slice(2)
    }

    // 9. 配件处理
    const accessoryCode = originalCode.slice(0, 8) // 配件的编码在销售平台前面
    if (accessoryCode) {
      await parseAccessoryCode(accessoryCode)
    }

    // 8. 销售平台
    const platformComponent = findComponentByCode(15,originalCode.slice(-2))
    if (platformComponent) {
      await handleComponentSelect(platformComponent.category_id, platformComponent.component_id)
      selectedComponents.value[15] = platformComponent.component_id
      platformsName.value = platformComponent.component_name
      platformsValid.value = '-' + platformComponent.component_code.replace(' ', '')
      text7.value = platformComponent.component_name
    }

    // 强制更新组件状态
    selectedComponents.value = { ...selectedComponents.value }

    // 等待视图更新
    await nextTick()

    ElMessage.success('编码解析完成')
  } catch (error) {
    console.error('编码解析失败:', error)
    ElMessage.error(error.message || '编码解析失败')
  }
}

// 添加编码规则配置
const codeRules = [
  { id: 8, name: '型号' },
  { id: 9, name: '功率' },
  { id: 13, name: '认证' },
  { id: 10, name: '主板' },
  { id: 11, name: '结构' },
  { id: 12, name: '枪头' },
  { id: 14, name: '特殊插头' },
  { id: 15, name: '销售平台' }
]

// 获取分类下的组件示例
const getCategoryComponents = (categoryId) => {
  return components.value.filter(comp => comp.category_id === categoryId)
}

// 在 setup 中添加获取父组件关系的方法
const getParentComponents = async (componentId) => {
  try {
    const response = await relationApi.getParentRelations(componentId)
    // 检查是否有父组件关系
    if (response.data.data && response.data.data.length > 0) {
      // 这里可以处理父组件关系数据
      return response.data.data
    }
    return []
  } catch (error) {
    console.error('获取父组件关系失败:', error)
    return []
  }
}

// 在现有代码中添加32进制转换函数
const convertToBase62 = (decimal) => {
  if (decimal === null || decimal === undefined) return '0'
  const base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const num = parseInt(decimal, 10)
  return base62Chars[num] || '0'
}

// 修改 generateAccessoryCode 函数为更通用的版本
const generateAccessoryCode = () => {
  let codeArray = new Array(8).fill('0') // 保持8位编码数组

  // 遍历配置的所有分类
  accessoryCodeCategories.forEach(({ categoryId, position }) => {
    const component = components.value.find(c =>
      c.component_id === selectedComponents.value[categoryId]
    )

    if (component) {
      const code = component.component_code.replace(/\s/g, '')
      codeArray[position] = convertToBase62(code)
    }
  })

  return '-' + codeArray.join('')
}

// 修改监听逻辑为更通用的版本
watch(
  // 监听所有配置的分类
  () => accessoryCodeCategories.map(({ categoryId }) =>
    selectedComponents.value[categoryId]
  ),
  (newValues, oldValues) => {
    // 检查是否有变化
    const hasChanges = newValues.some((value, index) => value !== oldValues?.[index])

    if (hasChanges) {
      // 生成新的配件编码
      const newCode = generateAccessoryCode()

      // 更新配件编码显示
      if (newCode) {
        accessoryValid.value = newCode

        // 更新显示的配件名称
        const names = accessoryCodeCategories
          .map(({ categoryId }) => {
            const componentId = selectedComponents.value[categoryId]
            if (componentId) {
              const comp = components.value.find(c => c.component_id === componentId)
              return comp ? comp.component_name : null
            }
            return null
          })
          .filter(Boolean)

        accessoryName.value = names.join(' + ')
      }
    }
  },
  { immediate: true }
)

// 添加 base62 解码函数
const convertFromBase62 = (char) => {
  const base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return base62Chars.indexOf(char)
}

// 修改配件编码解析部分
const parseAccessoryCode = async (accessoryCode) => {
  if (!accessoryCode || accessoryCode === '00000000') {
    return
  }

  await handleComponentSelect(23, 257)

  // 遍历配件编码的每个位置
  for (let i = 0; i < accessoryCode.length; i++) {
    const char = accessoryCode[i]
    if (char === '0') {
      continue // 跳过未选择的位置
    }

    // 找到对应位置的分类配置
    const categoryConfig = accessoryCodeCategories.find(config => config.position === i)
    if (!categoryConfig) {
      continue
    }

    // 解码获取组件编码
    const componentCode = convertFromBase62(char).toString().padStart(2, '0')

    // 查找对应的组件
    const component = components.value.find(c =>
      c.category_id === categoryConfig.categoryId &&
      c.component_code.replace(/\s/g, '') === componentCode
    )

    if (component) {
      // 选择找到的组件
      await handleComponentSelect(categoryConfig.categoryId, component.component_id)
    }
  }
}

function copyToClipboard(text) {
    // 检查 selectedValues 中是否包含 '*'
    const hasAsterisk = selectedValues.value.some(value => value.includes('*'));

    if (hasAsterisk) {
        ElMessage.warning('必选组件未选择，无法复制！');
        return; // 如果包含 *，则不执行复制
    }

    navigator.clipboard.writeText(text).then(async () => {
        ElMessage.success('SKU 已复制到剪贴板！');

        // 处理 short_hash，提取中间部分
        const hashParts = text.split('-');
        const processedHash = hashParts.slice(1, hashParts.length - 1).join('-'); // 提取中间部分并连接

        // 连接 selectedValues 形成 original_value
        const originalValue = selectedValues.value.join(''); // 将 selectedValues 连接成字符串

        // 添加写入数据库的逻辑
        try {
            await hashMappingApi.create({ original_value: originalValue, short_hash: processedHash }); // 传递原始值和短哈希
        } catch (error) {
            console.error('写入数据库失败:', error);
            ElMessage.error('写入数据库失败，请重试。');
        }
    }).catch(err => {
        console.error('复制失败:', err);
        ElMessage.error('复制失败，请重试。');
    });
}

</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  height: calc(100vh - 60px);
  overflow: hidden;
  padding: 0 20px;
  gap: 20px;
}

.left-column {
  width: 600px;
  position: relative;
  flex-shrink: 0;
}

.middle-column {
  flex: 1;
  min-width: 500px;
  overflow-y: auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  width: 350px;
  flex-shrink: 0;
  overflow-y: auto;
  padding-left: 20px;
  border-left: 1px solid #EBEEF5;
}

.component-groups-container {
  flex: 1;
  overflow-y: auto;
}

.background-board {
  width: 600px;
  height: 600px;
  position: sticky;
  top: 0;
  background-color: #f0f0f0;
  border: 2px solid #ccc;
  overflow: hidden;
  background-image: url('http://192.168.1.204:8080/uploads/image-1731575728577-694749955.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(0.85);
  transform-origin: top left;
}

.image-frame {
  position: absolute;
  width: 175px;
  height: 365px;
  overflow: hidden;
  top: 80px;
  left: 350px;
}

.image-frame2 {
  position: absolute;
  width: 120px;
  height: 280px;
  overflow: hidden;
  top: 378px;
  left: 464px;
}

.image-frame3 {
  position: absolute;
  width: 220px;
  height: 270px;
  overflow: hidden;
  top: 26px;
  left: 57px;
}

.image-frame4 {
  position: absolute;
  width: 130px;
  height: 120px;
  overflow: hidden;
  top: 200px;
  left: 300px;
}

.image-frame5 {
  position: absolute;
  width: 130px;
  height: 120px;
  overflow: hidden;
  top: 450px;
  left: 300px;
}

.image-box,
.image-box2 {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.text-box {
  position: absolute;
  padding: 5px 10px;
  border-radius: 5px;
}

.red-large-text1 {
  color: red;
  font-size: 41px;
}

.black-normal-text {
  color: #2a2525;
  font-size: 21px;
  font-weight: bold;
}

.black-normal-text2 {
  color: #2a2525;
  font-size: 21px;
  font-weight: bold;
}

.black-normal-text3 {
  color: #000000;
  font-size: 31px;
  font-weight: bold;
}

.image-selection {
  margin-bottom: 20px;
}

.category-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.image-item {
  width: 200px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.3s;
}

.image-item:hover {
  background: #ecf5ff;
}

.image-item.selected {
  border-color: #80acd8;
  background: #ecf5ff;
}

.component-image {
  width: 120px;
  height: 120px;
}

.component-text {
  width: 120px;
  height: 120px;
  font-size: 13px;
  padding: 10px;
  word-break: break-word;
}

.component-info {
  text-align: left;
  width: 100%;
}

.component-name {
  font-size: 14px;
  margin-bottom: 5px;
  color: #303133;
  word-break: break-word;
  white-space: normal;
}

.component-detail {
  font-size: 12px;
  color: #909399;
  margin-top: 3px;
}

.component-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.component-button {
  flex: 0 1 auto;
  min-width: 200px;
  margin: 0;
  height: auto;
  padding: 10px 15px;
  line-height: 1.4;
  white-space: normal;
}

.button-group {
  margin-bottom: 15px;
}

.category-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
  font-weight: bold;
}

.cost-summary {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.summary-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #303133;
  flex-shrink: 0;
}

.selected-components {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 15px;
  min-height: 100px;
}

.components-list {
  padding-right: 10px;
}

.component-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #EBEEF5;
}

.component-info {
  flex: 1;
  margin-right: 15px;
}

.component-name {
  font-size: 14px;
  color: #303133;
  margin-bottom: 5px;
  word-break: break-all;
}

.component-sku {
  font-size: 12px;
  color: #909399;
}

.component-cost {
  font-size: 14px;
  color: #F56C6C;
  font-weight: bold;
  white-space: nowrap;
}

.total-cost {
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  padding-top: 10px;
  border-top: 2px solid #EBEEF5;
  margin-top: auto;
  flex-shrink: 0;
}

.cost-value {
  color: #F56C6C;
  font-size: 20px;
  margin-left: 10px;
}

.right-column::-webkit-scrollbar {
  width: 6px;
}

.right-column::-webkit-scrollbar-thumb {
  background-color: #909399;
  border-radius: 3px;
}

.right-column::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

/* 添加显示区域的样式 */
.code-display,
.name-display {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.code-display span,
.name-display span {
  margin-right: 5px;
}

.code-section {
  margin-bottom: 20px;
}

.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  height: calc(100vh - 800px);
  margin-top: 20px;
}

/* 添加滑动框样式 */
.scale-control {
  position: fixed;
  top: 90px;
  right: 30px;
  z-index: 3;
  background: white;
  padding: 10px 15px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
}

.scale-control span {
  white-space: nowrap;
  color: #606266;
  font-size: 14px;
}

/* 添加可滚动内容区域样式 */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 0px;
}

/* 自定义滚动条样式 */
.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background-color: #909399;
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

/* 修改选中组件的样 */
:deep(.el-select-dropdown__item.selected) {
  background-color: #1d4ed8 !important;  /* 使用更深的蓝色背景 */
  color: #ffffff !important;  /* 文字改为白色 */
}

/* 选中项中的子元素样式调整 */
:deep(.el-select-dropdown__item.selected .option-sub) {
  color: #ffffff !important;  /* 副标题文字改为白色 */
}

:deep(.el-select-dropdown__item.selected .option-category) {
  background-color: rgba(255, 255, 255, 0.2);  /* 分类标签背景改为半透明白色 */
  color: #ffffff !important;  /* 分类标签文字改为白色 */
}

/* 鼠标悬停时的样式 */
:deep(.el-select-dropdown__item:hover) {
  background-color: #2563eb !important;  /* 使用较深的蓝色 */
  color: #ffffff !important;
}

:deep(.el-select-dropdown__item:hover .option-sub) {
  color: #ffffff !important;
}

:deep(.el-select-dropdown__item:hover .option-category) {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff !important;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.category-title {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
  margin-bottom: 0; /* 移除原有的底部边距 */
}

:deep(.el-switch__label) {
  color: #909399;
  font-size: 12px;
}

:deep(.el-switch__label.is-active) {
  color: #409EFF;
}

/* 添加新的样式 */
.code-parser {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.parser-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #303133;
}

/* 添加编码规则样式 */
.code-rule {
  margin-top: 15px;
  border-top: 1px solid #EBEEF5;
  padding-top: 15px;
}

.rule-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.rule-content {
  font-size: 13px;
  color: #606266;
}

.rule-item {
  margin-bottom: 8px;
}

.rule-prefix {
  font-weight: bold;
  margin-right: 8px;
}

.rule-grid {
  display: grid;
  grid-template-columns: 30px 1fr 80px;
  gap: 8px;
  align-items: center;
}

.rule-position {
  font-weight: bold;
  color: #409EFF;
  text-align: center;
}

.rule-category {
  color: #303133;
}

.rule-example {
  text-align: right;
}

.example-text {
  color: #409EFF;
  cursor: pointer;
}

.example-text:hover {
  text-decoration: underline;
}

.code-examples {
  max-height: 200px;
  overflow-y: auto;
  font-size: 12px;
}

.code-examples > div {
  padding: 4px 0;
  border-bottom: 1px solid #EBEEF5;
}

.code-examples > div:last-child {
  border-bottom: none;
}

.component-cost-detail {
  font-size: 14px;
  color: #303133;
  margin-top: 5px;
  font-weight: bold;
  padding: 4px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: inline-block;
}

.cost-value {
  color: #F56C6C;
  font-size: 16px;
  margin-left: 4px;
}

.component-detail {
  font-size: 12px;
  color: #606266;
  margin-top: 3px;
}

.component-name {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.copyable {
  color: #333; /* 设置深色 */
  margin-top: 10px; /* 添加一些顶部边距 */
  padding: 10px; /* 添加内边距 */
  border: 1px dashed #ccc; /* 添加边框样式 */
  border-radius: 5px; /* 添加圆角 */
  cursor: pointer; /* 鼠标悬停时显示为可点�� */
  transition: background-color 0.3s; /* 添加过渡效果 */
}

.copyable:hover {
  background-color: #f0f0f0; /* 鼠标悬停时的背景色 */
}

.non-copyable {
  color: #d3d3d3; /* 设置淡色 */
  pointer-events: none; /* 禁止复制 */
}
</style>