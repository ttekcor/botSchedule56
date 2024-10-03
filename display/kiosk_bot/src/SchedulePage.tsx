import React, { useState, useEffect } from "react";
import { Layout, Menu, Table, Empty, Segmented } from "antd";
import axios from "axios";
import { LaptopOutlined, UserOutlined } from "@ant-design/icons"; // Импортируем иконки
import { MenuInfo } from "rc-menu/lib/interface";

const { Sider, Content } = Layout;
const { SubMenu } = Menu; // Для создания вложенных меню

interface ScheduleRow {
  number: string;
  lesson: string;
  teacher1: string;
  teacher2: string;
}

interface TeacherScheduleRow {
  number: string;
  class: string;
  lesson: string;
}

interface Teacher {
  teacher: string;
}

interface SchedulePageProps {
  classes: string[];
}

const SchedulePage: React.FC<SchedulePageProps> = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState<string>("5А");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("Петровская");
  const [schedule, setSchedule] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherSchedule, setTeacherSchedule] = useState<TeacherScheduleRow[]>(
    []
  );
  const [selectedDay, setSelectedDay] = useState<string>("pn");
  const [activeMenuKey, setActiveMenuKey] = useState<string>("classes");
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
        console.log("Загруженные данные (расписание):", response.data);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке расписания", error);
      });

    axios
      .get(`http://localhost:5000/api/teachers/${dayToFileMap[day]}`)
      .then((response) => {
        setTeachers(response.data);
        console.log("Загруженные данные (учителя):", response.data);
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
        number: row[0],
        lesson: row[classIndex],
        teacher1: row[classIndex + 1],
        teacher2: row[classIndex + 2] || "",
      };
    });

    return classSchedule.filter((row) => row.lesson);
  };

  const normalizeString = (str: string | null) =>
    str ? str.trim().toLowerCase() : "";

  const getTeacherSchedule = (teacherName: string): TeacherScheduleRow[] => {
    const teacherSchedule: TeacherScheduleRow[] = [];
    classes.forEach((className) => {
      const classSchedule = getClassSchedule(className);
      classSchedule.forEach((lesson) => {
        if (
          normalizeString(lesson.teacher1) === normalizeString(teacherName) ||
          normalizeString(lesson.teacher2) === normalizeString(teacherName)
        ) {
          teacherSchedule.push({
            number: lesson.number,
            class: className,
            lesson: lesson.lesson,
          });
        }
      });
    });
    console.log(classes);
    return teacherSchedule;
  };

  useEffect(() => {
    selectedTeacher && setTeacherSchedule(getTeacherSchedule(selectedTeacher));
  }, [selectedTeacher]);

  useEffect(() => {
    loadScheduleForDay(selectedDay);
    console.log(selectedDay);
  }, [selectedDay]);

  const classColumns = [
    { title: "Номер урока", dataIndex: "number", key: "number" },
    { title: "Урок", dataIndex: "lesson", key: "lesson" },
    { title: "Учитель 1", dataIndex: "teacher1", key: "teacher1" },
    { title: "Учитель 2", dataIndex: "teacher2", key: "teacher2" },
  ];

  const teacherColumns = [
    { title: "Номер урока", dataIndex: "number", key: "number" },
    { title: "Класс", dataIndex: "class", key: "class" },
    { title: "Урок", dataIndex: "lesson", key: "lesson" },
  ];

  const uniqueClasses: string[] = Array.from(
    new Set(
      (schedule[0] || []).filter((className: any, index: number) => {
        return typeof className === "string" && index % 3 === 1;
      })
    )
  );
  const handleMenuKeyChange = (e: MenuInfo) => {
    setActiveMenuKey(e.keyPath[1]);
    setSelectedClass(e.keyPath[0]);

    console.log(e);
  };
  return (
    <Layout>
      <Segmented
        options={["pn", "vt", "sr", "cht", "pt"]}
        value={selectedDay}
        onChange={setSelectedDay}
      />
      <Sider width={200}>
        <Menu
          mode="inline"
          style={{ height: "100%" }}
          activeKey={activeMenuKey}
          onClick={handleMenuKeyChange}
        >
          <SubMenu key="classes" icon={<LaptopOutlined />} title="Классы">
            {uniqueClasses.map((className: string) => (
              <Menu.Item key={className}>{className}</Menu.Item>
            ))}
          </SubMenu>
          <SubMenu key="teachers" icon={<UserOutlined />} title="Учителя">
            {teachers.map((teacher) => (
              <Menu.Item key={teacher.teacher}>{teacher.teacher}</Menu.Item>
            ))}
          </SubMenu>
        </Menu>
      </Sider>
      <Content style={{ padding: "24px" }}>
        {activeMenuKey === "classes" && (
          <Table
            columns={classColumns}
            dataSource={getClassSchedule(selectedClass)}
            rowKey="number"
          />
        )}
        {activeMenuKey === "teachers" && (
          <Table
            columns={teacherColumns}
            dataSource={getTeacherSchedule(selectedTeacher)}
            rowKey="number"
          />
        )}
      </Content>
    </Layout>
  );
};

export default SchedulePage;
