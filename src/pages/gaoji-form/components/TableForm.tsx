import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Popconfirm, Table, message } from 'antd';
import React, { FC, useState } from 'react';

import styles from '../style.less';

interface TableFormProps {
  value?: TableFormDateType[];
  onChange?: (value: TableFormDateType[]) => void;
}

interface TableFormDateType {
  key: string;
  workId?: string;
  name?: string;
  department?: string;
  isNew?: boolean;
  editable?: boolean;
}

const TableForm: FC<TableFormProps> = ({value, onChange}) => {

  // 使用useState声明state， 通过泛型 传入 state的 type
  const [clickedCancel, setClickCancel] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [index, setIndex] = useState(0);
  const [cacheOriginData, setCacheOriginData] = useState({});
  const [data, setData] = useState(value);


  // 声明方法 设置形参的类型
  const getRowByKey = (key: string, newData?: TableFormDateType[]) => {

    // 这里的 ?. 意思是：newData存在不为空才执行filter 相当于 if(newData) { newData.filter }
    return newData?.filter(item => item.key === key)[0]
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, fileName: string, key: string) => {
   
    const newData = [...(data as TableFormDateType[] )];
    const target = getRowByKey(key, newData);
    if(target) {
      target[fileName] = e.target.value;
      setData(newData);
    }
  }
  const handleKeyPress = (e: React.KeyboardEvent, key: string) => {
    if(e.key === 'Enter') {
      saveRow(e, key);
    }
  }

  const saveRow = (e: React.MouseEvent | React.KeyboardEvent, key: string) => {
    const newData = [...(data as TableFormDateType[] )];
    // 异步获取事件
    e.persist();
    setLoading(true);
    setTimeout(() => {
      if(clickedCancel) {
        setClickCancel(false);
        return;
      }

      const target = getRowByKey(key, newData) || ({} as any);
      console.log(key, target, '<---target')

      if (!target.workId || !target.name || !target.department) {
        message.error('请填写完整成员信息。');
        (e.target as HTMLInputElement).focus();
        setLoading(false);
        return;
      }

      // 删除对象属性
      delete target.isNew;

      toggleEditable(e, key);

      if (onChange) {
        onChange(newData as TableFormDateType[]);
      }

      setLoading(false);
    }, 1000)

  }
  const cancel = (e: React.MouseEvent, key: string) => {
    setClickCancel(true);
    e.preventDefault();
    const newData = [...(data as TableFormDateType[])];
    let cacheData = [];

    // 复制data数据为newData，遍历newData 找到key对应的的那一条原始数据，他保存在cacheOriginData中
    // 找到后 利用合并的方式 覆盖掉被我们修改了的这条数据
    // 然后从缓存原始数据的地方 删除这一条数据
    // 把组装的数据 重新setData
    cacheData = newData.map( i => {

      if(i.key === key) {
        if(cacheOriginData[key]) {
          const originItem = {
            ...i,
            ...cacheOriginData[key],
            editable: false,
          }

          delete cacheOriginData[key];
          setCacheOriginData(cacheOriginData);
          return originItem;
        }
      }
      return i;
    })

    setData(cacheData);
    setClickCancel(false);

  }
  const remove = ( key: string) => {
    const newData = data?.filter(i => i.key !== key) as TableFormDateType[];;

    setData(newData)
    if(onChange) {
      onChange(newData)
    }
  }
  const toggleEditable = (e: React.MouseEvent | React.KeyboardEvent, key: string) => {
    e.preventDefault();
    const newData = data?.map( item => ({...item}) );

    const target = getRowByKey(key, newData);

    if(target) {
      if(!target.editable) {
        cacheOriginData[key] = {...target};
        setCacheOriginData(cacheOriginData);
      }

      target.editable = !target.editable;
      setData(newData);
    }

    // const a = data?.map(i => {
    //   if(i.key === key) {
      // cacheOriginData[key] = {...i};
      // setCacheOriginData(cacheOriginData);
    //     return {...i, editable: !i.editable}
    //   }
    //   return {...i}
    // })

    // setData(a)

  }

  const newMember = () => {
    const newData = data?.map(item => ({...item})) || [];

    newData.push({
      key: `NEW_TEMP_ID_${index}`,
      workId: '',
      name: '',
      department: '',
      editable: true,
      isNew: true,
    })

    setIndex(index + 1);
    setData(newData);
  }


  const columns: any[] = [
    {
      title: '成员姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text: string, record: TableFormDateType) => {
        if(record.editable) {
          return (
            <Input 
              value={text}
              autoFocus
              onChange={ (e) => handleFieldChange(e, 'name', record.key) }
              onKeyPress={ (e) => handleKeyPress(e, record.key) }
              placeholder="成员姓名"
            />
          )
        }
        return text
      }  
    },
    {
      title: '工号',
      dataIndex: 'workId',
      key: 'workId',
      width: '20%',
      render: (text: string, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={(e) => handleFieldChange(e, 'workId', record.key)}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="工号"
            />
          );
        }
        return text;
      },
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department',
      width: '40%',
      render: (text: string, record: TableFormDateType) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={(e) => handleFieldChange(e, 'department', record.key)}
              onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="所属部门"
            />
          );
        }
        return text;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: TableFormDateType) => {
        if(!!record.editable && loading) {
          return null
        }

        if(record.editable) {
          if(record.isNew) {
            return (
              <span>
                <a onClick={(e) => saveRow(e, record.key) }>添加</a>
                <Divider type="vertical" />
                <Popconfirm title="是否删除这一行" onConfirm={() => remove( record.key)} > 
                  <a>删除</a>
                </Popconfirm>
              </span>
            )
          }

          return (
            <span>
            <a onClick={(e) => saveRow(e, record.key)}>保存</a>
            <Divider type="vertical" />
            <a onClick={(e) => cancel(e, record.key)}>取消</a>
          </span>
          )
        }

        return (
          <span>
            <a onClick={(e) => toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      }
    }
  ]
 


  return (<>
  
  <Table<TableFormDateType>
    loading={loading}
    columns={columns}
    dataSource={data}
    pagination={false}
    rowClassName={ (record) => (record.editable ? styles.editable : '') }
  />

  <Button
    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
    type="dashed"
    onClick={newMember}
  >
    <PlusOutlined />
    新增成员
  </Button>
    </>)
}

export default TableForm;