import React, { useState, useEffect } from "react";
import { Layout, Menu, Table, Empty, Tabs, Button } from "antd";
import axios from "axios";
import type { MenuProps } from "antd";

const { Sider, Content } = Layout;

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
  const [teachers, setTeachers] = useState<string[]>([]); // Список учителей
  const [selectedDay, setSelectedDay] = useState<string>("pn");

  const dayToFileMap: { [key: string]: string } = {
    pn: "sch_pn.xlsx",
    vt: "sch_vt.xlsx",
    sr: "sch_sr.xlsx",
    cht: "sch_cht.xlsx",
    pt: "sch_pt.xlsx",
  };

  // Загружаем расписание на день
  const loadScheduleForDay = (day: string) => {
    axios
      .get(`http://localhost:5000/api/schedule/${dayToFileMap[day]}`)
      .then((response) => {
        setSchedule(response.data);
        setSelectedClass(null);
        setSelectedTeacher(null);
        console.log("Загруженные данные (расписание):", response.data); // Отладочное сообщение
      })
      .catch((error) => {
        console.error("Ошибка при загрузке расписания", error);
      });

    // Загружаем учителей для текущего дня
    axios
      .get(`http://localhost:5000/api/teachers/${dayToFileMap[day]}`)
      .then((response) => {
        setTeachers(response.data);
        console.log("Загруженные данные (учителя):", response.data); // Отладочное сообщение
      })
      .catch((error) => {
        console.error("Ошибка при загрузке учителей", error);
      });
  };

  const getClassSchedule = (className: string): ScheduleRow[] => {
    const headerRow = schedule[0] || [];
    const classIndex = headerRow.indexOf(className);

    if (classIndex === -1) return [];

    const classSchedule: ScheduleRow[] = schedule.slice(1).map((row: any[]) => {
      return {
        number: row[0], // Номер урока
        lesson: row[classIndex], // Название урока
        teacher1: row[classIndex + 1], // Учитель 1
        teacher2: row[classIndex + 2] || "", // Учитель 2
      };
    });

    return classSchedule.filter((row) => row.lesson); // Фильтруем пустые строки
  };

  const getTeacherSchedule = (
    teacherName: string
  ): { number: string; class: string; lesson: string }[] => {
    const teacherSchedule: { number: string; class: string; lesson: string }[] =
      [];

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
            lesson: lesson.lesson,
          });
        }
      });
    });

    return teacherSchedule;
  };

  useEffect(() => {
    loadScheduleForDay(selectedDay);
  }, [selectedDay]);

  // Колонки для отображения расписания классов
  const classColumns = [
    { title: "Номер урока", dataIndex: "number", key: "number" },
    { title: "Урок", dataIndex: "lesson", key: "lesson" },
    { title: "Учитель 1", dataIndex: "teacher1", key: "teacher1" },
    { title: "Учитель 2", dataIndex: "teacher2", key: "teacher2" },
  ];

  // Колонки для отображения расписания учителей
  const teacherColumns = [
    { title: "Номер урока", dataIndex: "number", key: "number" },
    { title: "Класс", dataIndex: "class", key: "class" },
    { title: "Урок", dataIndex: "lesson", key: "lesson" },
  ];

  // Извлекаем уникальные классы
  const uniqueClasses = Array.from(
    new Set(
      (schedule[0] || []).filter((className: string, index: number) => {
        // Фильтруем, чтобы убрать случайные уроки
        return typeof className === "string" && index % 3 === 1; // Убираем первый столбец с номерами уроков
      })
    )
  );

  // Элементы меню для классов
  const classMenuItems: MenuProps["items"] = uniqueClasses.map(
    (className: string) => ({
      key: className,
      label: className,
      onClick: () => setSelectedClass(className),
    })
  );

  // Элементы меню для учителей
  const teacherMenuItems: MenuProps["items"] = teachers.map((teacherName) => ({
    key: teacherName,
    label: teacherName,
    onClick: () => setSelectedTeacher(teacherName),
  }));

  const tabItems = [
    {
      key: "1",
      label: "Расписание классов",
      children: (
        <Layout>
          <Sider width={200}>
            <Menu mode="inline" items={classMenuItems} />
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
      ),
    },
    {
      key: "2",
      label: "Расписание учителей",
      children: (
        <Layout>
          <Sider width={200}>
            <Menu mode="inline" items={teacherMenuItems} />
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
      ),
    },
  ];

  return (
    <Layout>
      <div style={{ marginBottom: "20px" }}>
        <Button onClick={() => setSelectedDay("pn")}>Понедельник</Button>
        <Button onClick={() => setSelectedDay("vt")}>Вторник</Button>
        <Button onClick={() => setSelectedDay("sr")}>Среда</Button>
        <Button onClick={() => setSelectedDay("cht")}>Четверг</Button>
        <Button onClick={() => setSelectedDay("pt")}>Пятница</Button>
      </div>

      <Tabs defaultActiveKey="1" items={tabItems} />
    </Layout>
  );
};

export default SchedulePage;
