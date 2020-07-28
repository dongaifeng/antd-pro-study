// import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, Radio, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { connect, Dispatch } from 'umi';
import React, { FC, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { List } from './data.d';

import { StateType  } from './model';

const FormItem = Form.Item;
const { Option } = Select;

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
  layout: 'inline'
}

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 9 },
  },
};


const columns: ColumnsType<List>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => (<a>{text}</a>)
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
]

// const tableData: User[] = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//   },
// ];

interface FormProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
  myName: string;
  dataList: List[]
}

const MyForm: FC<FormProps> = (props) => {
  const {submitting, myName, dispatch, dataList } = props;
  const [form] = Form.useForm();
  // const [showPublicUsers, setshowPublicUsers] = React.useState(false);

// 初始 加载表格数据
  useEffect(() => {
    dispatch({
      type: 'myForm/tableList',
      payload: {
        page: 1,
      }
    })
  }, []);

  // const btn = () => {
  //   dispatch({
  //     type: 'myForm/getName',
  //     payload: '董喧起'
  //   })
  // }
  
  // 提交表单且数据验证成功后回调事件
  const onFinish = (values: { [key: string]: any }) => {
    dispatch({
      type: 'myForm/submitData',
      payload: values
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
       <Card bordered={false}>

      <Form
        {...layout}
        hideRequiredMark
        style={{marginTop: 8, marginBottom: 10}}
        form={form}
        name="my_form"
        initialValues={{sex: 'man'}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
      >
        {/* 输入框 */}
        <FormItem
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入名字'
            }
          ]}
        >
          <Input placeholder="请输入姓名" />
        </FormItem>

         {/* 下拉框 */}
        <FormItem
           label="性别"
           name="sex"
        >
          <Select
            style={{ width: '100%' }}
          >
          <Option value="man">男</Option>
          <Option value="woman">女</Option>
          </Select>
        </FormItem>

         {/* 日期框 */}
         <FormItem
          label="生日"
          name="date"
          rules={[
            {
              required: true,
              message: '请输入日期'
            }
          ]}
         >
         <DatePicker
          style={{width: '100%'}}
        />
         </FormItem>

         {/* 单选框 */}
         <FormItem
          label="选择方式"
          name="type"
         >
           <div>
             <Radio.Group>
               <Radio value="1">1</Radio>
               <Radio value="2">2</Radio>
             </Radio.Group>
           </div>
         </FormItem>

         {/* 提交按钮 */}
         <FormItem
          {...submitFormLayout}
          
         >
           <Button style={{marginRight: 8}}>取消</Button>
           <Button type="primary" htmlType="submit" loading={submitting}>提交</Button>
         </FormItem>
      </Form>
      </Card>


      <Table
        bordered
        title={() => (<h2>人员列表</h2>)}
        columns={columns}
        dataSource={dataList}
      />

    
    </PageHeaderWrapper>
  )
}


export interface P {
  loading: {effects: {[key: string]: boolean}};
   myForm: StateType 
}


export default connect(
  ({ loading, myForm }: P) => ({
    submitting: loading.effects['formAndbasicForm/submitRegularForm'],
    myName: myForm.myName,
    dataList: myForm.list
  })
)(MyForm)