import React, { useEffect, useState } from "react";
import { Layout, Menu, Table, Segmented, message } from "antd";
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
  const [teacherSchedule, setTeacherSchedule] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [activeMenuKey, setActiveMenuKey] = useState<string>("classes");
  const [mode, setMode] = useState<"schedule" | "teachers">("schedule");
  const [loading, setLoading] = useState<boolean>(false);

  const dayToFileMap: { [key: string]: string } = {
    pn: "sch_pn.xlsx",
    vt: "sch_vt.xlsx",
    sr: "sch_sr.xlsx",
    cht: "sch_cht.xlsx",
    pt: "sch_pt.xlsx",
  };

  // Функция для загрузки расписания
  const loadSchedule = (fileName: string) => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:5000/api/schedule/${fileName}`)
      .then((response) => {
        const data = response.data;
        if (data && data.length > 0) {
          setSchedule(data);
          console.log(data);

          const uniqueClasses = Array.from(
            new Set(
              data[0]
                .slice(2)
                .filter((_: any, index: number) => index % 3 === 0)
            )
          ) as string[];

          setClasses(uniqueClasses);

          if (uniqueClasses.length > 0) {
            setSelectedClass(uniqueClasses[0]);
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
      })
      .finally(() => setLoading(false));
  };

  // Функция для загрузки списка учителей
  const loadTeacherList = (fileName: string) => {
    const url = `http://127.0.0.1:5000/api/teachers/${fileName}`;
    setLoading(true);
    axios
      .get(url) // Запрос на получение списка учителей
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setTeachers(data); // Сохраняем имена учителей
        } else {
          message.error("Данные по учителям пусты или некорректны.");
        }
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          message.error("Файл с учителями не найден");
        } else {
          message.error("Ошибка при загрузке данных с бэкенда");
        }
      })
      .finally(() => setLoading(false));
  };

  // Функция для загрузки расписания конкретного учителя
  const loadTeacherSchedule = (fileName: string, teacherName: string) => {
    // Декодируем имя учителя перед использованием в запросе

    const url = `http://127.0.0.1:5000/api/teachers/${fileName}/${teacherName}`;
    setLoading(true);

    axios
      .get(url)
      .then(({ data }) => {
        console.log(data, "req");
        if (data) {
          setTeacherSchedule([data]);
        } else {
          message.error(
            `Расписание для учителя ${teacherName} не найдено или некорректно.`
          );
        }
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          message.error(`Учитель ${teacherName} не найден`);
        } else {
          message.error("Ошибка при загрузке данных с бэкенда");
        }
      })
      .finally(() => setLoading(false));
  };

  // Функция для получения расписания выбранного учителя
  const getTeacherSchedule = (): TeacherSchedule[] => {
    console.log(teacherSchedule, "one person");
    const teacherData = teacherSchedule;

    // Преобразуем вложенные массивы в одномерный массив объектов для таблицы
    return teacherData.flat().map((entry: any) => ({
      number: entry.number, // Номер урока
      lesson: entry.lesson, // Урок
      class: entry.class, // Класс
    }));
  };

  useEffect(() => {
    if (mode === "schedule") {
      loadSchedule(dayToFileMap[activeMenuKey]); // Загрузка расписания классов
    } else {
      loadTeacherList(dayToFileMap[activeMenuKey]); // Загрузка списка учителей
    }
  }, [activeMenuKey, mode]);
  useEffect(() => {
    if (mode === "teachers" && selectedTeacher) {
      loadTeacherSchedule(dayToFileMap[activeMenuKey], selectedTeacher);
      console.log(teacherSchedule, "here"); // Загрузка расписания конкретного учителя
    }
  }, [selectedTeacher, activeMenuKey, mode]);
  const getClassSchedule = (className: string): ScheduleRow[] => {
    const classIndex = schedule[0]?.indexOf(className);
    if (classIndex === -1 || classIndex === undefined) return [];
    return schedule.slice(1).map((row: any[]) => ({
      number: row[0],
      lesson: row[classIndex],
      teacher1: row[classIndex + 1],
      teacher2: row[classIndex + 2],
    }));
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
  const dayLabels: { [key: string]: string } = {
    pn: "Понедельник",
    vt: "Вторник",
    sr: "Среда",
    cht: "Четверг",
    pt: "Пятница",
  };

  return (
    <Layout>
      <Segmented
        options={[
          { label: "Классы", value: "schedule" },
          { label: "Учителя", value: "teachers" },
        ]}
        value={mode}
        onChange={(value) => setMode(value as "schedule" | "teachers")}
      />
      <Segmented
        options={[
          { label: dayLabels["pn"], value: "pn" },
          { label: dayLabels["vt"], value: "vt" },
          { label: dayLabels["sr"], value: "sr" },
          { label: dayLabels["cht"], value: "cht" },
          { label: dayLabels["pt"], value: "pt" },
        ]}
        value={activeMenuKey}
        onChange={(value) => setActiveMenuKey(value as string)}
      />

      <Layout>
        <Sider width={200}>
          <Menu
            mode="vertical"
            selectedKeys={[activeMenuKey]}
            onClick={(e) =>
              mode === "schedule"
                ? setSelectedClass(e.key)
                : setSelectedTeacher(e.key)
            }
            items={
              mode === "schedule"
                ? classes.map((className) => ({
                    key: String(className),
                    label: String(className),
                  }))
                : teachers.map((teacher) => ({
                    key: String(teacher),
                    label: String(teacher),
                  }))
            }
          />
        </Sider>
        <Content style={{ padding: "24px" }}>
          {mode === "schedule" && selectedClass && (
            <Table
              locale={{ emptyText: "" }}
              columns={classColumns}
              loading={loading}
              dataSource={getClassSchedule(selectedClass)}
              rowKey="number"
              pagination={false}
            />
          )}
          {mode === "teachers" && selectedTeacher && (
            <Table
              columns={teacherColumns}
              loading={loading}
              dataSource={getTeacherSchedule()}
              rowKey="number"
              pagination={false}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SchedulePage;
