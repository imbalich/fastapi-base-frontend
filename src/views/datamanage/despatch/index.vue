<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb
        :items="[$t('menu.datamanage'), $t('menu.datamanage.despatch')]"
      />
      <a-card :title="$t('menu.datamanage.despatch')" class="general-card">
        <a-row>
          <a-col :flex="62">
            <!-- Form 表单 -->
            <a-form
              :auto-label-width="true"
              :label-col-props="{ span: 6 }"
              :model="formModel"
              label-align="right"
            >
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item
                    :label="$t('datamanage.despatch.form.model')"
                    field="model"
                  >
                    <a-select
                      v-model="formModel.model"
                      :options="modelOptions"
                      :placeholder="
                        $t('datamanage.despatch.form.model.placeholder')
                      "
                      allow-search
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :label="$t('datamanage.despatch.form.identifier')"
                    field="identifier"
                  >
                    <a-input
                      v-model="formModel.identifier"
                      :placeholder="
                        $t('datamanage.despatch.form.identifier.placeholder')
                      "
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :label="$t('datamanage.despatch.form.repair_level')"
                    field="repair_level"
                  >
                    <a-select
                      v-model="formModel.repair_level"
                      :options="repairOptions"
                      :placeholder="
                        $t('datamanage.despatch.form.repair_level.placeholder')
                      "
                      allow-search
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :label="$t('datamanage.despatch.form.life_cycle_time')"
                    field="time_range"
                  >
                    <a-range-picker
                      v-model="formModel.time_range"
                      :disabled-date="
                        (current) => dayjs(current).isAfter(dayjs())
                      "
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider direction="vertical" style="height: 30px" />
          <a-col :flex="8">
            <a-space :size="'medium'" direction="horizontal">
              <a-button type="primary" @click="search">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('datamanage.despatch.form.search') }}
              </a-button>
              <a-button @click="resetSelect">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('datamanage.despatch.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-divider />
        <div class="content">
          <a-table
            v-model:selected-keys="rowSelectKeys"
            :bordered="false"
            :columns="columns"
            :data="renderData"
            :loading="loading"
            :pagination="pagination"
            :row-selection="rowSelection"
            :scroll="{ x: 1900, y: 500 }"
            :size="'medium'"
            row-key="id"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
          >
            <template #index="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
          </a-table>
        </div>
      </a-card>
    </a-layout>
  </div>
  <div class="footer">
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { computed, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import Breadcrumb from '@/components/breadcrumb/index.vue';
  import Footer from '@/components/footer/index.vue';
  import {
    DmDespatchParams,
    DmDespatchRes,
    queryDmDespatchList,
    queryDmDespatchModelList,
    queryRepairLevelList,
  } from '@/api/despatch';
  import { Pagination } from '@/types/global';
  import { TableColumnData, SelectOptionData } from '@arco-design/web-vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  // 表单
  const generateFormModel = () => {
    return {
      model: undefined,
      identifier: undefined,
      repair_level: undefined,
      time_range: undefined,
    };
  };
  const formModel = ref(generateFormModel());
  const modelOptions = ref<SelectOptionData[]>([]);
  const repairOptions = ref<SelectOptionData[]>([]);

  const fetchDespatchModel = async () => {
    setLoading(true);
    try {
      const res = await queryDmDespatchModelList();
      modelOptions.value = res.map((item) => ({
        label: item,
        value: item,
      }));
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  fetchDespatchModel();

  const queryRepairLevel = async () => {
    setLoading(true);
    try {
      const res = await queryRepairLevelList();
      repairOptions.value = res.map((item) => ({
        label: item,
        value: item,
      }));
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  queryRepairLevel();

  // 表格
  const renderData = ref<DmDespatchRes[]>([]);
  const rowSelectKeys = ref<number[]>([]);
  const rowSelection = reactive({
    showCheckedAll: true,
    selectedRowKeys: rowSelectKeys.value,
  });
  const basePagination: Pagination = {
    current: 1,
    defaultPageSize: 20,
    showTotal: true,
    showPageSize: true,
    bufferSize: 3,
  };
  const pagination: Pagination = reactive({
    ...basePagination,
  });

  const columns = computed<TableColumnData[]>(() => [
    {
      title: 'ID',
      dataIndex: 'index',
      slotName: 'index',
      width: 50,
      fixed: 'left',
    },
    {
      title: t('datamanage.despatch.columns.model'),
      dataIndex: 'model',
      slotName: 'model',
      align: 'center',
      fixed: 'left',
    },
    {
      title: t('datamanage.despatch.columns.identifier'),
      dataIndex: 'identifier',
      slotName: 'identifier',
      align: 'center',
    },
    {
      title: t('datamanage.despatch.columns.repair_level'),
      dataIndex: 'repair_level',
      slotName: 'repair_level',
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('datamanage.despatch.columns.life_cycle_time'),
      dataIndex: 'life_cycle_time',
      slotName: 'life_cycle_time',
      align: 'center',
    },
    {
      title: t('datamanage.despatch.columns.repair_level_num'),
      dataIndex: 'repair_level_num',
      slotName: 'repair_level_num',
      align: 'center',
    },
    {
      title: t('datamanage.despatch.columns.attach_company'),
      dataIndex: 'attach_company',
      slotName: 'attach_company',
      align: 'center',
    },
    {
      title: t('datamanage.despatch.columns.attach_dept'),
      dataIndex: 'attach_dept',
      slotName: 'attach_dept',
      align: 'center',
    },
    {
      title: t('datamanage.despatch.columns.cust_name'),
      dataIndex: 'cust_name',
      slotName: 'cust_name',
      align: 'center',
    },
    {
      title: t('datamanage.despatch.columns.dopt_name'),
      dataIndex: 'dopt_name',
      slotName: 'dopt_name',
      align: 'center',
    },
    {
      title: t('datamanage.despatch.columns.factory_name'),
      dataIndex: 'factory_name',
      slotName: 'factory_name',
      align: 'center',
    },
    {
      title: t('datamanage.despatch.columns.date_source'),
      dataIndex: 'date_source',
      slotName: 'date_source',
      align: 'center',
    },
    {
      title: t('datamanage.despatch.columns.sync_time'),
      dataIndex: 'sync_time',
      slotName: 'sync_time',
      align: 'center',
    },
  ]);

  // 请求列表
  const fetchDespatchList = async (params: DmDespatchParams = {}) => {
    setLoading(true);
    try {
      const res = await queryDmDespatchList(params);
      renderData.value = res.items;
      pagination.total = res.total;
      pagination.current = params.page;
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  fetchDespatchList();

  // 事件: 分页
  const onPageChange = async (current: number) => {
    await fetchDespatchList({
      ...formModel.value,
      page: current,
      size: pagination.pageSize,
    });
  };

  // 事件: 分页大小
  const onPageSizeChange = async (pageSize: number) => {
    pagination.pageSize = pageSize;
    await fetchDespatchList({ ...formModel.value, page: 1, size: pageSize });
  };

  // 搜索
  const search = async () => {
    await fetchDespatchList({
      ...formModel.value,
    } as unknown as DmDespatchParams);
  };

  // 重置
  // 重置
  const resetSelect = async () => {
    // 重置表单模型
    formModel.value = generateFormModel();

    // 重置分页信息
    pagination.current = basePagination.current;
    pagination.pageSize = basePagination.defaultPageSize;

    // 清除已选中的行键
    rowSelectKeys.value = [];

    // 重新加载数据，不带任何过滤条件
    await fetchDespatchList({
      page: pagination.current,
      size: pagination.pageSize,
    });
  };
</script>

<style lang="less" scoped>
  .content {
    padding-top: 20px;
  }
</style>
