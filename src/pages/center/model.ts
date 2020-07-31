import { Reducer, Effect } from 'umi';
import { queryCurrent } from "./service";
import { CurrentUser } from './data.d'

export interface ModelState {
  currentUser: Partial<CurrentUser>
}


interface ModelType {
  namespace: string;
  state: ModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<ModelState>
  }
}

const Model: ModelType = {
  namespace: 'center',
  state: {
    currentUser: {}
  },
  effects: {
    *fetchCurrent(_, {call, put}) {
      const {data} = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: data,
      })
    }
  },
  reducers: {
    saveCurrentUser(state, action) {
      console.log('action', action)
      return {
        ...state,
        currentUser: action.payload
      }
    }
  }

}

export default Model;