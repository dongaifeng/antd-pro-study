import { Effect, Reducer} from 'umi';
import { quertList, queryData, queryTableList } from './service'
import { message } from 'antd';
import { List } from './data.d';

export interface StateType {
  myName: string;
  list: List[]
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submitData: Effect;
    getName: Effect;
    tableList: Effect;
  };
  reducers: {
    ddd: Reducer<StateType>;
    setTableList: Reducer<StateType>;
    resetTableList: Reducer<StateType>;
  }
}

const Model: ModelType = {
  namespace: 'myForm',

  state: {
    myName: '董爱锋',
    list: []
  },

  effects: {
    *tableList({ payload }, { call, put }) {
      const {data } = yield call(queryTableList, payload);
      yield put({
        type: 'setTableList',
        payload: Array.isArray(data) ? data : []
      })
    },

    *submitData({ payload }, { call, put }) {
      const {data} = yield call(queryData, payload)
      yield put({
        type: 'resetTableList',
        payload: Array.isArray(data) ? data : []
      })
      message.success('提交成功')
    },

    *getName({ payload }, { call, put }) {
      const res = yield call(quertList, {name: payload})

      yield put({
        type: 'ddd',
        payload: res.name,
      });
    }
  },

  reducers: {
    ddd(state: StateType, action) {
      
      return {
        ...state,
        myName: action.payload,
      }
    },
    setTableList(state: StateType, action) {
      return {
        ...state,
        list: state.list.concat(action.payload)
      }
    },
    resetTableList(state: StateType, action) {
      return {
        ...state,
        list: action.payload
      }
    }
  }
}


export default Model