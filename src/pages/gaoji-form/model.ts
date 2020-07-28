import { Effect } from 'umi';
import { message } from 'antd';
import Model from '@/models/login';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submit: Effect;
  };
}

const Model: ModelType = {
  namespace: 'gaojiForm',

  state: {},

  effects: {
    *submit({payload}, {call}) {
      yield call()
      message.success("提交成功！")
    }
  }
}

export default Model;