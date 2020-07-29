import { Effect } from 'umi';
import { message } from 'antd';
import { submit } from './service';

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
      yield call(submit, payload);
      message.success("提交成功！")
    }
  }
}

export default Model;