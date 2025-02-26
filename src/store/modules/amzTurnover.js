import { defineStore } from 'pinia';

export const useAmzTurnoverStore = defineStore('amzTurnover', {
  state: () => ({
    listQueryParams: {
      pageNum: 1,
      pageSize: 10
    },
    summaryData: null,
    summaryQueryParams: null
  }),
  actions: {
    setListQueryParams(params) {
      this.listQueryParams = params;
    },
    setSummaryData(data) {
      this.summaryData = data;
    },
    setSummaryQueryParams(params) {
      this.summaryQueryParams = params;
    }
  }
}); 