import { Effect, Reducer} from 'umi';
import { quertList } from './service'


export interface StateType {
  myName: string
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submitRegularForm: Effect;
    getName: Effect;
  };
  reducers: {
    ddd: Reducer<StateType>
  }
}

const Model: ModelType = {
  namespace: 'ddd',

  state: {
    myName: '董爱锋'
  },

  effects: {
    *submitRegularForm({ payload }, { call, put }) {
      
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
    ddd(state, action) {
      
      return {
        ...state,
        myName: action.payload,
      }
    }
  }
}


export default Model