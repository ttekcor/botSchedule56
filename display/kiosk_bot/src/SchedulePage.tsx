import React, { useEffect, useState } from "react";
import { Layout, Menu, Table, Segmented, message } from "antd";
import { LaptopOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";

const { Sider, Content } = Layout;

interface ScheduleRow {
  number: string;
  lesson: string;
  teacher1: string;
  teacher2: string;
}

interface TeacherSchedule {
  number: string;
  lesson: string;
  class: string;
}

interface SchedulePageProps {}

const SchedulePage: React.FC<SchedulePageProps> = () => {
  const [classes, setClasses] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<any[][]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [activeMenuKey, setActiveMenuKey] = useState<string>("classes");
  const [mode, setMode] = useState<"schedule" | "teachers">("schedule");

  const dayToFileMap: { [key: string]: string } = {
    pn: "sch_pn.xlsx",
    vt: "sch_vt.xlsx",
    sr: "sch_sr.xlsx",
    cht: "sch_cht.xlsx",
    pt: "sch_pt.xlsx",
  };

  // Функция для загрузки расписания
  const loadSchedule = (fileName: string) => {
    axios
      .get(`http://127.0.0.1:5000/api/schedule/${fileName}`) // Запрос на получение расписания
      .then((response) => {
        const data = response.data; // Данные в формате JSON
        if (data && data.length > 0) {
          setSchedule(data); // Сохранение данных расписания
          console.log(data);

          // Извлечение уникальных классов
          const uniqueClasses = Array.from(
            new Set(
              data[0]
                .slice(2) // Пропускаем первые два столбца (например, номер урока и другие поля)
                .filter((_: any, index: number) => index % 3 === 0) // Извлекаем каждый третий элемент (классы)
            )
          ) as string[];

          setClasses(uniqueClasses); // Установка классов в состояние

          if (uniqueClasses.length > 0) {
            setSelectedClass(uniqueClasses[0]); // Устанавливаем первый класс как выбранный по умолчанию
          }
        } else {
          message.error("Данные с расписанием пусты или некорректны.");
        }
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          message.error("Файл с расписанием не найден");
        } else {
          message.error("Ошибка при загрузке данных с бэкенда");
        }
      });
  };

  // Функция для загрузки расписания учителей
  const loadTeacherSchedule = (fileName: string, teacherName?: string) => {
    const url = teacherName
      ? `http://127.0.0.1:5000/api/teachers/${fileName}/${teacherName}`
      : `http://127.0.0.1:5000/api/teachers/${fileName}`;

    axios
      .get(url) // Запрос на получение расписания учителя
      .then((response) => {
        const data = response.data;
        if (data && data.length > 0) {
          setTeachers(data); // Сохранение данных по учителям
          console.log(data);
        } else {
          message.error("Данные по учителям пусты или некорректны.");
        }
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          if (teacherName) {
            message.error(`Учитель ${teacherName} не найден`);
          } else {
            message.error("Файл с расписанием не найден");
          }
        } else {
          message.error("Ошибка при загрузке данных с бэкенда");
        }
      });
  };

  useEffect(() => {
    if (mode === "schedule") {
      console.log(activeMenuKey);
      loadSchedule(dayToFileMap[activeMenuKey]);
    } else {
      loadTeacherSchedule(dayToFileMap[activeMenuKey]);
    }
  }, [activeMenuKey, mode]);

  const getClassSchedule = (className: string): ScheduleRow[] => {
    const classIndex = schedule[0]?.indexOf(className);
    if (classIndex === -1 || classIndex === undefined) return [];
    return schedule.slice(1).map((row: any[]) => ({
      number: row[0], // Номер урока
      lesson: row[classIndex],
      teacher1: row[classIndex + 1],
      teacher2: row[classIndex + 2],
    }));
  };

  const getTeacherSchedule = (teacherName: string): TeacherSchedule[] => {
    const teacherData = teachers.find(
      (teacher: any) => teacher.teacher === teacherName
    );
    return teacherData?.schedule || [];
  };

  const classColumns = [
    { title: "Номер урока", dataIndex: "number", key: "number" },
    { title: "Урок", dataIndex: "lesson", key: "lesson" },
    { title: "Учитель 1", dataIndex: "teacher1", key: "teacher1" },
    { title: "Учитель 2", dataIndex: "teacher2", key: "teacher2" },
  ];

  const teacherColumns = [
    { title: "Номер урока", dataIndex: "number", key: "number" },
    { title: "Урок", dataIndex: "lesson", key: "lesson" },
    { title: "Класс", dataIndex: "class", key: "class" },
  ];

  return (
    <Layout>
      <Segmented
        options={[
          { label: "Расписание", value: "schedule" },
          { label: "Учителя", value: "teachers" },
        ]}
        value={mode}
        onChange={(value) => setMode(value as "schedule" | "teachers")}
      />
      <Segmented
        options={["pn", "vt", "sr", "cht", "pt"]}
        value={activeMenuKey}
        onChange={(value) => setActiveMenuKey(value as string)}
      />
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            selectedKeys={[activeMenuKey]}
            onClick={(e) =>
              mode === "schedule"
                ? setSelectedClass(e.key)
                : setSelectedTeacher(e.key)
            }
            items={[
              {
                key: "classes",
                icon: <LaptopOutlined />,
                label: "Классы",
                children: classes.map((className) => ({
                  key: className,
                  label: className,
                })),
              },
              {
                key: "teachers",
                icon: <UserOutlined />,
                label: "Учителя",
                children: teachers.map((teacher: any) => ({
                  key: teacher.teacher,
                  label: teacher.teacher,
                })),
              },
            ]}
          />
        </Sider>
        <Content style={{ padding: "24px" }}>
          {mode === "schedule" && selectedClass && (
            <Table
              columns={classColumns}
              dataSource={getClassSchedule(selectedClass)}
              rowKey="number"
            />
          )}
          {mode === "teachers" && selectedTeacher && (
            <Table
              columns={teacherColumns}
              dataSource={getTeacherSchedule(selectedTeacher)}
              rowKey="number"
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SchedulePage;
