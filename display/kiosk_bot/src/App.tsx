import React, { useState } from 'react';
import { Layout, Tabs } from 'antd';
import MainPage from './MainPage';
import SchedulePage from './SchedulePage';
import UploadPage from './UploadPage';

const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;

const App: React.FC = () => {
  const [classes, setClasses] = useState<string[]>([]); // Классы
  const [schedule, setSchedule] = useState<any[][]>([]); // Расписание
  const [carouselImages, setCarouselImages] = useState<string[]>([]); // Фото для карусели

  return (
    
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ color: 'white' }}>Школьное расписание</h2>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Главная" key="1">
            <MainPage images={carouselImages} />
          </TabPane>
          <TabPane tab="Расписание" key="2">
            <SchedulePage classes={classes} schedule={schedule} />
          </TabPane>
          <TabPane tab="Загрузить данные" key="3">
            <UploadPage setClasses={setClasses} setSchedule={setSchedule} setCarouselImages={setCarouselImages} />
          </TabPane>
        </Tabs>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2024 Created by You</Footer>
    </Layout>
  );
};

export default App;
