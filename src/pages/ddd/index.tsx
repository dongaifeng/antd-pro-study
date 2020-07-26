import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, InputNumber, Radio, Select, Tooltip } from 'antd';
import { connect, Dispatch, FormattedMessage, formatMessage } from 'umi';
import React, { FC } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


import { StateType  } from './model';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;



interface FormProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
  myName: string;
}

const MyForm: FC<FormProps> = (props) => {
  const {submitting, myName, dispatch } = props;
  const [form] = Form.useForm();
  const [showPublicUsers, setshowPublicUsers] = React.useState(false);

  const btn = () => {
    dispatch({
      type: 'ddd/getName',
      payload: '董喧起'
    })
  }


  return (
    <PageHeaderWrapper>
    
    
      哈哈哈 { myName }
      <Button onClick={btn}>按钮</Button>
    </PageHeaderWrapper>
  )
}


export interface P {
  loading: {effects: {[key: string]: boolean}};
   ddd: StateType 
}


export default connect(
  ({ loading, ddd }: P) => ({
    submitting: loading.effects['formAndbasicForm/submitRegularForm'],
    myName: ddd.myName
  })
)(MyForm)