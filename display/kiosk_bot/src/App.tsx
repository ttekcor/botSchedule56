import React from 'react';
import { NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import styles from '/src/app.module.css';
import * as XLSX from 'xlsx';

const { Header, Content, Footer, Sider } = Layout;

const items1: MenuProps['items'] = ['Главная', 'Расписание', 'Игра','Заказ пропуска'].map((key) => ({
  key,
  label: key,
}));

const items2: MenuProps['items'] = [UserOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = ['Учителя', 'Классы'];

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `Класс ${subKey}`,
        };
      }),
    };
  },
);

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className={styles.layout} >
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px' }} >
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}
        >
          <Sider style={{ background: colorBgContainer, height:10 }} width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '10%' }}
              items={items2}
            />
          </Sider>
          
          <Content style={{ padding: '0 24px', minHeight: 1920 }} >Content</Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getTime()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default App;