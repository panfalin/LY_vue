// 需要显示开关的分类配置
export const SWITCH_CATEGORIES = {
  // 分类ID
  22: {
    // 当隐藏时需要清除的内容
    clearContent: {
      images: [], // 需要清除的图片
      texts: [],  // 需要清除的文本
      others: []  // 需要清除的其他内容
    }
  },
  24: {
    clearContent: {
      images: [],
      texts: [],
      others: []
    }
  },
  26: {
    clearContent: {
      images: [],
      texts: [],
      others: []
    }
  },
  28: {
    clearContent: {
      images: [],
      texts: [],
      others: []
    }
  }
}

// 获取所有需要显示开关的分类ID
export const getSwitchCategoryIds = () => Object.keys(SWITCH_CATEGORIES).map(Number)

// 获取分类的清除配置
export const getCategoryClearConfig = (categoryId) => {
  return SWITCH_CATEGORIES[categoryId]?.clearContent || null
}

// 添加配件编码分类配置
export const accessoryCodeCategories = [
  { categoryId: 19, position: 0 }, //包装
  { categoryId: 22, position: 1 }, //收纳包
  { categoryId: 30, position: 2 }, //背贴
  { categoryId: 24, position: 3 },
  { categoryId: 27, position: 4 },
  { categoryId: 28, position: 5 },
  { categoryId: 29, position: 6 },
  // { categoryId: 30, position: 4 },
  // 后续分类
]
