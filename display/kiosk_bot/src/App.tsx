import React, { useState } from "react";
import { Layout, Tabs } from "antd";
import MainPage from "./MainPage";
import SchedulePage from "./SchedulePage";
import UploadPage from "./UploadPage";

const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;

const App: React.FC = () => {
  const [classes, setClasses] = useState<string[]>([]); // Классы
  const [schedule, setSchedule] = useState<any[][]>([]); // Расписание
  const [carouselImages, setCarouselImages] = useState<string[]>([]); // Фото для карусели

  // Функция для обработки загруженных данных
  const handleScheduleUpload = (uploadedSchedule: any[][]) => {
    console.log("2", uploadedSchedule);
    setSchedule(uploadedSchedule); // Устанавливаем расписание
    const classNames = extractClassNames(uploadedSchedule); // Извлекаем список классов
    console.log("2", classNames);
    setClasses(classNames); // Устанавливаем классы
  };

  // Функция для извлечения уникальных классов из загруженного расписания
  const extractClassNames = (scheduleData: any[][]): string[] => {
    if (scheduleData.length === 0) return [];
    const headerRow = scheduleData[0]; // Предположим, что первая строка содержит названия классов
    const classNames = headerRow.filter(
      (cell: any, index: number) => index % 3 === 1
    ); // Предположим, что классы находятся в каждом 2-ом столбце
    return Array.from(new Set(classNames)); // Убираем дубли
  };
  console.log("rk", classes);

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <h2 style={{ color: "white" }}>Школьное расписание</h2>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Главная" key="1">
            <MainPage images={carouselImages} />
          </TabPane>
          <TabPane tab="Расписание" key="2">
            <SchedulePage classes={classes} />
          </TabPane>
          <TabPane tab="Загрузить данные" key="3">
            {/* Передаем функцию handleScheduleUpload в UploadPage */}
            <UploadPage onUpload={handleScheduleUpload} />
          </TabPane>
        </Tabs>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2024 Created by You
      </Footer>
    </Layout>
  );
};

export default App;
