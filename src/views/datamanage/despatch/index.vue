<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <Breadcrumb
        :items="[$t('menu.datamanage'), $t('menu.datamanage.despatch')]"
      />
      <a-card :title="$t('menu.datamanage.despatch')" class="general-card">
        <a-row>
          <a-col :span="12">
            <!-- Form 表单 -->
            <a-form
              :auto-label-width="true"
              :label-col-props="{ span: 6 }"
              :model="formModel"
              label-align="right"
            >
              <a-row>
                <a-col :span="12">
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
                      :allow-search="{ retainInputValue: true }"
                      allow-clear
                      @clear="resetModel"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
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
              </a-row>
            </a-form>
          </a-col>
          <a-divider direction="vertical" style="height: 30px" />
          <a-col :span="8">
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
      life_cycle_time: undefined,
    };
  };
  const formModel = ref(generateFormModel());
  const modelOptions = ref<SelectOptionData[]>([]);

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
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: t('datamanage.despatch.columns.model'),
      dataIndex: 'model',
      slotName: 'model',
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
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('datamanage.despatch.columns.life_cycle_time'),
      dataIndex: 'life_cycle_time',
      slotName: 'life_cycle_time',
    },
    {
      title: t('datamanage.despatch.columns.repair_level_num'),
      dataIndex: 'repair_level_num',
      slotName: 'repair_level_num',
    },
    {
      title: t('datamanage.despatch.columns.attach_company'),
      dataIndex: 'attach_company',
      slotName: 'attach_company',
    },
    {
      title: t('datamanage.despatch.columns.attach_dept'),
      dataIndex: 'attach_dept',
      slotName: 'attach_dept',
    },
    {
      title: t('datamanage.despatch.columns.cust_name'),
      dataIndex: 'cust_name',
      slotName: 'cust_name',
    },
    {
      title: t('datamanage.despatch.columns.dopt_name'),
      dataIndex: 'dopt_name',
      slotName: 'dopt_name',
    },
    {
      title: t('datamanage.despatch.columns.factory_name'),
      dataIndex: 'factory_name',
      slotName: 'factory_name',
    },
    {
      title: t('datamanage.despatch.columns.date_source'),
      dataIndex: 'date_source',
      slotName: 'date_source',
    },
    {
      title: t('datamanage.despatch.columns.sync_time'),
      dataIndex: 'sync_time',
      slotName: 'sync_time',
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
    await fetchDespatchList({ page: current, size: pagination.pageSize });
  };

  // 事件: 分页大小
  const onPageSizeChange = async (pageSize: number) => {
    pagination.pageSize = pageSize;
    await fetchDespatchList({ page: 1, size: pageSize });
  };

  // 搜索
  const search = async () => {
    await fetchDespatchList({
      ...formModel.value,
    } as unknown as DmDespatchParams);
  };

  // 重置
  const resetSelect = () => {
    formModel.value = generateFormModel();
  };

  // 重置状态
  const resetModel = () => {
    formModel.value.model = undefined;
  };
</script>

<style lang="less" scoped>
  .content {
    padding-top: 20px;
  }
</style>
