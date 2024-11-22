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
  const [selectedClass, setSelectedClass] = useState<string>("5А");
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

  const getTeacherSchedule = (): TeacherSchedule[] => {
    const teacherData = teacherSchedule;

    // Преобразуем вложенные массивы в одномерный массив объектов для таблицы
    return teacherData
      .flat()
      .filter((entry: any) => entry.number) // Удаляем пустые строки
      .map((entry: any, index) => ({
        key: `${entry.number}-${index}`, // Уникальный ключ
        number: entry.number,
        lesson: entry.lesson,
        class: entry.class,
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
    }
  }, [selectedTeacher, activeMenuKey, mode]);
  const getClassSchedule = (className: string): ScheduleRow[] => {
    const classIndex = schedule[0]?.indexOf(className);
    if (classIndex === -1 || classIndex === undefined) return [];

    return schedule
      .slice(1)
      .filter((row: any[]) => row[classIndex]) // Удаляем пустые строки
      .map((row: any[], index) => ({
        key: `${row[0]}-${index}`, // Уникальный ключ
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
        defaultValue="pn"
        value={activeMenuKey}
        onChange={(value) => setActiveMenuKey(value as string)}
      />

      <Layout>
        {/* Боковое меню */}
        <Sider
          width={200}
          style={{
            height: "100vh", // Высота на весь экран
            overflow: "hidden", // Убираем лишнюю прокрутку у самого Sider
            background: "#fff", // Белый фон
          }}
        >
          <Menu
            className="menu-container" // Используем единый класс
            mode="vertical"
            selectedKeys={[
              mode === "schedule" ? selectedClass : selectedTeacher,
            ]}
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

        {/* Основное содержимое */}
        <Content style={{ padding: "24px" }}>
          {mode === "schedule" && selectedClass && (
            <Table
              columns={classColumns}
              loading={loading}
              dataSource={getClassSchedule(selectedClass)}
              rowKey="key"
              pagination={false}
            />
          )}
          {mode === "teachers" && selectedTeacher && (
            <Table
              columns={teacherColumns}
              loading={loading}
              dataSource={getTeacherSchedule()}
              rowKey="key"
              pagination={false}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SchedulePage;
