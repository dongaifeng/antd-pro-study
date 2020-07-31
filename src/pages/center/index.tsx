import { PlusOutlined, HomeOutlined, ContactsOutlined, ClusterOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Input, Row, Tag } from 'antd';
import React, { Component, useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Link, connect, Dispatch } from 'umi';
import { RouteChildrenProps } from 'react-router';

import { ModelState } from "./model";
import { CurrentUser, TagType } from './data.d';

import Projects from './components/Projects';
import Articles from './components/Articles';
import Applications from './components/Applications';

import styles from "./center.less";

const operationTabList = [
  {
    key: 'articles',
    tab: (
      <span>
        文章 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
  {
    key: 'applications',
    tab: (
      <span>
        应用 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
  {
    key: 'projects',
    tab: (
      <span>
        项目 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
];


interface  CenterProps extends RouteChildrenProps {
  currentUser: Partial<CurrentUser>;
  currentUserLoading: boolean;
  dispatch: Dispatch;
}
interface  CenterState  {
  tabKey: string;
}

interface TagProps {
  tags: CurrentUser['tags']
}

// 点击 + 把 + 变成input 通过改变 inputVisible的值
// 输入内容 change事件 响应式数据
// combit的时候 需要把输入的值 变成 tag 数据 保存到newTags里面，还要判断newTags里面有没有相同标签名
// 然后 把输入框变成加号，把input制空 ， 把newTags 合并到Tags里 

const TagList: React.FC<TagProps> = ({ tags=[] }) => {

  const [newTags, setNewTags] = useState<TagType[]>([]);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const ref = useRef<Input | null>(null);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

  }

  const handleInputConfirm = () => {
    let tempsTags = [...newTags];
    if(inputValue && tempsTags.filter(i => i.label ===inputValue).length === 0) {
      tempsTags = [...tempsTags, {key: `new-${tempsTags.length}`, label: inputValue}];
    }

    setNewTags(tempsTags);
    setInputVisible(false);
    setInputValue('');
  }

  const showInput = () => {
    setInputVisible(true)
    console.log(ref)
    ref.current?.focus()
    
  }


  return (
    <div className={styles.tags}>
      <div className={styles.tagsTitle}>标签</div>
      {
        tags.concat(newTags).map( i => (
        <Tag key={i.key} >{i.label}</Tag>
        ))
      }
      {
        inputVisible && (
          <Input
            ref={ref}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={inputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        )
      }
      {
        !inputVisible && (
          <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
          <PlusOutlined />
        </Tag>
        )
      }
    </div>
  )
}


class Center extends Component<CenterProps, CenterState> {

  state: CenterState = {
    tabKey: 'articles'
  }

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'center/fetchCurrent'
    })
  }

  // 如果逻辑比较复杂 可以把这部分拿出来 用函数封装
  renderUserInfo = (currentUser: Partial<CurrentUser>) => (
    <div className={styles.detail}>
      <p>
        <ContactsOutlined
          style={{
            marginRight: 8
          }}
        />
        { currentUser.title }
      </p>

      <p>
        <ClusterOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser.group}
      </p>

      <p>
        <HomeOutlined
          style={{
            marginRight: 8,
          }}
        />
          {
            // (currentUser.geographic || { province: { label: '' } }).province.label
            currentUser.geographic?.province?.label
          }
          {
          ( currentUser.geographic || { city: { label: '', } } ).city.label
          }
      </p>
        

    </div>)


  onTabChange = (key: string) => {
    this.setState({
      tabKey: key
    })
  }

  renderChildrenByTabKey = (tabKey: CenterState['tabKey']) => {
    if (tabKey === 'projects') {
      return <div> Projects </div>;
    }
    if (tabKey === 'applications') {
      return <div>Applications </div>;
    }
    if (tabKey === 'articles') {
      return <div>Articles </div>;
    }
    return null;
  }


  render () {
    const { tabKey } = this.state;
    const { currentUser, currentUserLoading } = this.props;
   
    const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length )
    return (
     <GridContent>
       <Row gutter={25}>
         <Col lg={7} md={24}>
          <Card bordered style={{ marginBottom: 23 }} loading={dataLoading} >
            {
              !dataLoading && (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.name}</div>
                    <div>{currentUser.signature}</div>
                  </div>
                { this.renderUserInfo(currentUser) }
                <Divider dashed />
                <TagList tags={currentUser.tags || []} />

                <Divider style={{ marginTop: 16 }} dashed />

                <div className={styles.team}>
                    <div className={styles.teamTitle}>团队</div>
                    <Row gutter={36}>
                      {currentUser.notice &&
                        currentUser.notice.map((item) => (
                          <Col key={item.id} lg={24} xl={12}>
                            <Link to={item.href}>
                              <Avatar size="small" src={item.logo} />
                              {item.member}
                            </Link>
                          </Col>
                        ))}
                    </Row>
                  </div>
                </div>
              )
            }
          </Card>
         </Col>

         <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
       </Row>




     </GridContent>
    )
  }
}

type P = {
  loading: { effects: { [key: string] : boolean }};
  center: ModelState
}


export default connect(

  // mapStatusToProps
  ({loading, center}: P) => ({
    currentUser: center.currentUser,
    currentUserLoading: loading.effects['center/fetchCurrent'],
  })
)(Center)