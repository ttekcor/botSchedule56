import React, { useState } from "react";
import { Layout, Tabs } from "antd";
import MainPage from "./MainPage";
import SchedulePage from "./SchedulePage";
import UploadPage from "./UploadPage";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const [classes, setClasses] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<any[][]>([]);

  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  const handleScheduleUpload = (uploadedSchedule: any[][]) => {
    if (!uploadedSchedule || uploadedSchedule.length === 0) {
      console.error("Пустое или некорректное расписание");
      return;
    }
    setSchedule(uploadedSchedule);

    const classNames = extractClassNames(uploadedSchedule);
    setClasses(classNames);
  };

  const extractClassNames = (scheduleData: any[][]): string[] => {
    if (scheduleData.length === 0) return [];
    const headerRow = scheduleData[0];

    const classNames = headerRow.filter(
      (cell: any, index: number) => index % 3 === 1 && typeof cell === "string"
    );
    return Array.from(new Set(classNames));
  };

  const tabItems = [
    {
      key: "1",
      label: "Главная",
      children: <MainPage images={carouselImages} />,
    },
    {
      key: "2",
      label: "Расписание",
      children: <SchedulePage />,
    },
    {
      key: "3",
      label: "Загрузка расписания",
      children: <UploadPage onUpload={handleScheduleUpload} />,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <h1 style={{ color: "white" }}>Школьное расписание</h1>
      </Header>
      <Content style={{ padding: "20px" }}>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Content>
      <Footer style={{ textAlign: "center" }}>© 2024 Школа</Footer>
    </Layout>
  );
};

export default App;
