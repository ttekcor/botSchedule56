import React, { useEffect, useState } from "react";
import { Layout, Menu, Table, Segmented, message } from "antd";
import { LaptopOutlined, UserOutlined } from "@ant-design/icons";

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
    fetch(`http://localhost:5000/api/schedule/${fileName}`)
      .then((res) => res.json())
      .then((data: any[][]) => {
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
        message.error("Ошибка при загрузке данных с бэкенда");
        console.error(error);
      });
  };

  // Функция для загрузки расписания учителей
  const loadTeachers = (fileName: string) => {
    fetch(`http://localhost:5000/api/teachers/${fileName}`)
      .then((res) => res.json())
      .then((data: any[]) => {
        if (data && data.length > 0) {
          setTeachers(data);
          const firstTeacher = data[0]?.teacher || "";
          setSelectedTeacher(firstTeacher);
        } else {
          message.error("Данные с учителями пусты или некорректны.");
        }
      })
      .catch((error) => {
        message.error("Ошибка при загрузке данных с бэкенда");
        console.error(error);
      });
  };

  useEffect(() => {
    if (mode === "schedule") {
      loadSchedule(dayToFileMap[activeMenuKey]);
    } else {
      loadTeachers(dayToFileMap[activeMenuKey]);
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
