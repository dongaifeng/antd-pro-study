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
const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
}



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

  const onFinish = (values: { [key: string]: any }) => {
    dispatch({
      type: 'ddd/getName',
      payload: '董喧起'
    })
  }

  const onFinishFailed = ({values, errorFields, outOfDate}: {values:{ [key: string]: any }, errorFields: any, outOfDate: any}) => {
    // eslint-disable-next-line no-console
    console.log(values, errorFields, outOfDate)
  }

  const onValuesChange = (changedFields: {[key: string]: any}, allFields: any) => {
    const {name } = changedFields;
    // eslint-disable-next-line no-console
    console.log(name, allFields);
  }


  return (
    <PageHeaderWrapper>
      <Form
        {...layout}
        hideRequiredMark
        style={{marginTop: 8}}
        form={form}
        name="my_form"
        initialValues={{username:'董爱锋'}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
      >
        <FormItem
          label="用户名"
          name="username"
        >
          <Input />

        </FormItem>
      </Form>

    
    
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