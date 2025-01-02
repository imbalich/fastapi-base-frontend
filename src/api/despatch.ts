import axios from 'axios';
import qs from 'query-string';

export interface DmDespatchParams {
  model?: string;
  identifier?: string;
  repair_level?: string;
  time_range?: string[];
  page?: number;
  size?: number;
}

export interface DmDespatchRes {
  id: number;
  model: string;
  identifier: string;
  repair_level: string;
  life_cycle_time: string;
  repair_level_num: number;
  attach_company?: string;
  attach_dept?: string;
  cust_name?: string;
  dopt_name?: string;
  factory_name?: string;
  date_source?: string;
  sync_time?: string;
}

export interface DmDespatchListRes {
  items: DmDespatchRes[];
  total: number;
}

export function queryDmDespatchList(
  params: DmDespatchParams
): Promise<DmDespatchListRes> {
  return axios.get('/api/v1/datamanage/despatch', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryDmDespatchModelList(): Promise<string[]> {
  return axios.get('/api/v1/datamanage/despatch/models');
}

export function queryRepairLevelList(): Promise<string[]> {
  return axios.get('/api/v1/datamanage/despatch/repair-levels');
}
