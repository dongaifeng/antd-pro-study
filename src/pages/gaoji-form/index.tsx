import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Popover, Row, Select, TimePicker } from 'antd';

import React, { FC, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';

import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park',
  },
];

type NamePath = (string | number)[];

interface GaojiFormProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
}

interface ErrorField {
  name: NamePath;
  errors: string[];
}
 
const GaojiForm: FC<GaojiFormProps> = ({ submitting, dispatch }) => {

  const [form] = Form.useForm();
  const [error, setError] = useState<ErrorField[]>([]);
  const getErrorInfo = (errors: ErrorField[]) => {
    console.log(errors, '<------')
    const errorCount = error.filter(item => item.errors.length > 0).length;

    if(!errors || errorCount === 0 ) {
      return null;
    }

    const errorList = errors.map(item => {
      if(!item || item.errors.length === 0) {
        return null;

      }

      const key = item.name[0] as string
      return (
        <li key={key} className={styles.errorListItem} >
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{item.errors[0]}</div>
          <div className={styles.errorField}>{item.name[0]}</div>
        </li>
      )
    })

    return (<span className={styles.errorIcon}>
      <Popover 
        title="错误信息"
        content={errorList}
        overlayClassName={styles.errorPopover}
        trigger="click"
        getPopupContainer={
          (trigger: HTMLElement) => {
            return trigger
          }
        }
      >
        <CloseCircleOutlined />
       
      </Popover>
       {errorCount}
       </span>
    )
  }

  // 定义values的类型别名   
  // {
  //   [key: string]: any
  // }
  const onFinish = (values: {[key: string]: any}) => {
    setError([]);

    dispatch({
      type: 'gaojiForm/submit',
      payload: values
    })
    
  }
  const onFinishFailed = (errorInfo: any) => {
    setError(errorInfo.errorFields);
  }


  return (
    <Form
      form={form}
      initialValues={{ members: tableData }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Card title="仓库管理" className={styles.card} bordered >
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item
              label="仓库名称"
              name="name"
              rules={[{required: true, message: '请输入名称'}]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>

          <Col xl={{ span: 6, offset: 0 }} lg={{ span: 6 }} md={{ span: 24 }} sm={24} >
            <Form.Item label="选择框" name="appa">
              <Select placeholder="请选择审批员">
                <Option value="xiao">付晓晓</Option>
                <Option value="mao">周毛毛</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xl={{ span: 6, offset: 0 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label="日期框"
                name="dateRange2"
                rules={[{ required: true, message: '请输入' }]}
              >
                <TimePicker
                  placeholder="提醒时间"
                  style={{ width: '100%' }}
                  getPopupContainer={(trigger) => {
                    if (trigger && trigger.parentNode) {
                      return trigger.parentNode as HTMLElement;
                    }
                    return trigger;
                  }}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item>
                <Button style={{marginRight: 10}} onClick={() => form.resetFields()}>取消</Button>
                <Button type="primary" onClick={() => form.submit()} loading={submitting}>提交</Button>
                { getErrorInfo(error) }
              </Form.Item>
            </Col>
        </Row>
      </Card>


    </Form>
  )
}

type P = {
  loading: {
    effects: { [key: string]: boolean}
   }
}

export default connect(
  // mapStateToProps      (state) => ({ })
  ({loading}: P) => ({ 
    submitting: loading.effects['gaojiForm/submit'],
  })
)(GaojiForm); 