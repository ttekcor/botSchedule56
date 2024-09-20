import React, { useState, useEffect } from "react";
import { Layout, Menu, Table, Empty, Tabs, Button } from "antd";
import axios from "axios";
import type { MenuProps } from "antd";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

interface ScheduleRow {
  number: string;
  lesson: string;
  teacher1: string;
  teacher2: string;
}

interface SchedulePageProps {
  classes: string[];
}

const SchedulePage: React.FC<SchedulePageProps> = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("pn");

  const dayToFileMap: { [key: string]: string } = {
    pn: "sch_pn.xlsx",
    vt: "sch_vt.xlsx",
    sr: "sch_sr.xlsx",
    cht: "sch_cht.xlsx",
    pt: "sch_pt.xlsx",
  };

  const loadScheduleForDay = (day: string) => {
    axios
      .get(`http://localhost:5000/api/schedule/${dayToFileMap[day]}`)
      .then((response) => {
        setSchedule(response.data);
        setSelectedClass(null);
        setSelectedTeacher(null);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке расписания", error);
      });
  };

  useEffect(() => {
    loadScheduleForDay(selectedDay);
  }, [selectedDay]);

  const getClassSchedule = (className: string): ScheduleRow[] => {
    const headerRow = schedule[0] || [];
    const classIndex = headerRow.indexOf(className);

    if (classIndex === -1) return [];

    const classSchedule: ScheduleRow[] = schedule
      .slice(1)
      .map((row: any[]) => ({
        number: row[0],
        lesson: row[classIndex],
        teacher1: row[classIndex + 1],
        teacher2: row[classIndex + 2] || "",
      }));

    return classSchedule.filter((row) => row.lesson);
  };

  const getTeacherSchedule = (
    teacherName: string
  ): { number: string; class: string }[] => {
    const teacherSchedule: { number: string; class: string }[] = [];

    classes.forEach((className) => {
      const classSchedule = getClassSchedule(className);

      classSchedule.forEach((lesson) => {
        if (
          lesson.teacher1 === teacherName ||
          lesson.teacher2 === teacherName
        ) {
          teacherSchedule.push({
            number: lesson.number,
            class: className,
          });
        }
      });
    });

    return teacherSchedule;
  };

  const classColumns = [
    { title: "Номер урока", dataIndex: "number", key: "number" },
    { title: "Урок", dataIndex: "lesson", key: "lesson" },
    { title: "Учитель 1", dataIndex: "teacher1", key: "teacher1" },
    { title: "Учитель 2", dataIndex: "teacher2", key: "teacher2" },
  ];

  const teacherColumns = [
    { title: "Номер урока", dataIndex: "number", key: "number" },
    { title: "Класс", dataIndex: "class", key: "class" },
  ];

  // Извлечение уникальных классов
  const uniqueClasses: string[] = Array.from(
    new Set(
      schedule[0]?.slice(1).filter((_: any, index: number) => index % 3 === 0)
    )
  );

  // Корректная типизация для элементов меню классов
  const classMenuItems: MenuProps["items"] = uniqueClasses.map(
    (className: string) => ({
      key: className,
      label: className,
      onClick: () => setSelectedClass(className as string), // Приведение типа
    })
  );

  // Корректная типизация для элементов меню учителей
  const teacherMenuItems: MenuProps["items"] = classes
    .reduce<string[]>((teachers, className) => {
      const classSchedule = getClassSchedule(className);
      classSchedule.forEach((lesson) => {
        if (!teachers.includes(lesson.teacher1)) teachers.push(lesson.teacher1);
        if (lesson.teacher2 && !teachers.includes(lesson.teacher2))
          teachers.push(lesson.teacher2);
      });
      return teachers;
    }, [])
    .map((teacherName: string) => ({
      key: teacherName,
      label: teacherName,
      onClick: () => setSelectedTeacher(teacherName),
    }));

  return (
    <Layout>
      {/* Кнопки для выбора дня недели */}
      <div style={{ marginBottom: "20px" }}>
        <Button onClick={() => setSelectedDay("pn")}>Понедельник</Button>
        <Button onClick={() => setSelectedDay("vt")}>Вторник</Button>
        <Button onClick={() => setSelectedDay("sr")}>Среда</Button>
        <Button onClick={() => setSelectedDay("cht")}>Четверг</Button>
        <Button onClick={() => setSelectedDay("pt")}>Пятница</Button>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Расписание классов" key="1">
          <Layout>
            <Sider width={200}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                style={{ height: "100%" }}
                items={classMenuItems}
              />
            </Sider>
            <Content style={{ padding: "24px" }}>
              {selectedClass ? (
                getClassSchedule(selectedClass).length > 0 ? (
                  <Table
                    columns={classColumns}
                    dataSource={getClassSchedule(selectedClass)}
                    rowKey="number"
                  />
                ) : (
                  <Empty description="Нет данных для этого класса" />
                )
              ) : (
                <h3>Выберите класс для отображения расписания</h3>
              )}
            </Content>
          </Layout>
        </TabPane>

        <TabPane tab="Расписание учителей" key="2">
          <Layout>
            <Sider width={200}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                style={{ height: "100%" }}
                items={teacherMenuItems}
              />
            </Sider>
            <Content style={{ padding: "24px" }}>
              {selectedTeacher ? (
                getTeacherSchedule(selectedTeacher).length > 0 ? (
                  <Table
                    columns={teacherColumns}
                    dataSource={getTeacherSchedule(selectedTeacher)}
                    rowKey="number"
                  />
                ) : (
                  <Empty description="Нет данных для этого учителя" />
                )
              ) : (
                <h3>Выберите учителя для отображения расписания</h3>
              )}
            </Content>
          </Layout>
        </TabPane>
      </Tabs>
    </Layout>
  );
};

export default SchedulePage;
