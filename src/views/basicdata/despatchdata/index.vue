<template>
  <div class="container">
    <a-layout style="padding: 0 18px">
      <a-card :title="$t('menu.basicdata.despatchdata')" class="general-card">
        <a-row>
          <a-col :flex="62">
            <a-form
              :label-col-props="{ span: 6 }"
              :model="formModel"
              label-align="right"
              :auto-label-width="true"
            > 
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item
                    :label="$t('basicdata.despatchdata.form.model')" 
                    field="model"
                  >
                    <a-select
                      v-model="formModel.model"
                      :options="modelData"
                      :placeholder="$t('basicdata.despatchdata.form.model.placeholder')"
                      allow-search
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :label="$t('basicdata.despatchdata.form.repairLevel')" 
                    field="repairLevel"
                  >
                    <a-select
                      v-model="formModel.repairLevel"
                      :options="repairData"
                      :placeholder="$t('basicdata.despatchdata.form.repairLevel.placeholder')"
                      allow-search
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item 
                    :label="$t('basicdata.despatchdata.form.range')" 
                    field="rangeValue"
                    >
                    <a-range-picker
                      v-model="formModel.rangeValue"
                      :disabledDate="(current) => dayjs(current).isAfter(dayjs())"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider direction="vertical" style="height: 30px;"/>
          <a-col :flex="8">
            <a-space :size="'medium'" direction="horizontal">
                <!-- 缺少@click="search" 和 @click="reset"-->
                <a-button type="primary">
                  <template #icon>
                    <icon-search />
                  </template>
                  {{ $t('basicdata.despatchdata.form.search') }}
                </a-button>
                <a-button>
                  <template #icon>
                    <icon-refresh />
                  </template>
                  {{ $t('basicdata.despatchdata.form.reset') }}
                </a-button>
              </a-space>
          </a-col>
        </a-row>
        <a-divider />
        <div class="content">

        </div>
      </a-card>
    </a-layout>
  </div>
</template>
  
<script lang="ts" setup>
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import { useI18n } from 'vue-i18n';
  import { ModelListRes, queryModelList,RepairLevelRes, queryRepairLevel } from '@/api/datamanage';
  import useLoading from '@/hooks/loading';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  const generateFormModel = () => {
    return {
      model: undefined,
      repairLevel: undefined,
      rangeValue: undefined,
    };
  };
  const formModel = ref(generateFormModel());
  const modelData = ref<string[]>([]);
  const repairData = ref<string[]>([]);
  // 请求数据
  const modelListData = async() => {
    setLoading(true);
    try{
      const res = await queryModelList();
      console.log(res)
      modelData.value = res;
      console.log('modelData', modelData.value)
    } catch (error) {
      console.error('Failed to fetch model list:', error);
    } finally {
      setLoading(false);
    }
  }
  modelListData();

  const repairLevelData = async() => {
    setLoading(true);
    try{
      const res = await queryRepairLevel();
      console.log(res)
      repairData.value = res;
      console.log('repairData', repairData.value)
    } catch (error) {
      console.error('Failed to fetch model list:', error);
    } finally {
      setLoading(false);
    }
  }
  repairLevelData();

  
  
</script>
  
<style scoped>
  /* 在这里添加样式 */
</style>