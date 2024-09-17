import React, { useState } from 'react';
import { Layout, Menu, Table, Empty, Tabs } from 'antd';

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
  schedule: any[][]; // Расписание (двумерный массив)
}

const SchedulePage: React.FC<SchedulePageProps> = ({ classes, schedule }) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  // Функция для получения расписания конкретного класса
  const getClassSchedule = (className: string): ScheduleRow[] => {
    if (!schedule.length) return [];

    const headerRow = schedule[0];
    const classIndex = headerRow.indexOf(className);

    if (classIndex === -1) return []; // Если класс не найден

    const classSchedule: ScheduleRow[] = schedule.slice(1).map((row: any[]) => ({
      number: row[0], // Номер урока
      lesson: row[classIndex], // Название урока
      teacher1: row[classIndex + 1], // Учитель 1
      teacher2: row[classIndex + 2] || '', // Учитель 2 (если есть)
    }));

    return classSchedule.filter((row) => row.lesson);
  };

  // Функция для получения расписания конкретного учителя
  const getTeacherSchedule = (teacherName: string): { number: string; class: string }[] => {
    const teacherSchedule: { number: string; class: string }[] = [];

    // Проходим по каждому классу
    classes.forEach((className) => {
      const classSchedule = getClassSchedule(className);

      classSchedule.forEach((lesson) => {
        // Если учитель найден в расписании, добавляем его урок
        if (lesson.teacher1 === teacherName || lesson.teacher2 === teacherName) {
          teacherSchedule.push({
            number: lesson.number, // Номер урока
            class: className, // Номер класса
          });
        }
      });
    });

    return teacherSchedule;
  };

  // Колонки для таблицы расписания классов
  const classColumns = [
    {
      title: 'Номер урока',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Урок',
      dataIndex: 'lesson',
      key: 'lesson',
    },
    {
      title: 'Учитель 1',
      dataIndex: 'teacher1',
      key: 'teacher1',
    },
    {
      title: 'Учитель 2',
      dataIndex: 'teacher2',
      key: 'teacher2',
    },
  ];

  // Колонки для таблицы расписания учителей
  const teacherColumns = [
    {
      title: 'Номер урока',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Класс',
      dataIndex: 'class',
      key: 'class',
    },
  ];

  return (
    <Layout>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Расписание классов" key="1">
          <Layout>
            <Sider
              width={200}
              style={{
                maxHeight: '100vh',
                height: '100vh',
                overflowY: 'auto',
                borderRight: '1px solid #ddd',
              }}
            >
              <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
                {classes.map((className) => (
                  <Menu.Item key={className} onClick={() => setSelectedClass(className)}>
                    {className}
                  </Menu.Item>
                ))}
              </Menu>
            </Sider>

            <Content style={{ padding: '24px' }}>
              {selectedClass ? (
                getClassSchedule(selectedClass).length > 0 ? (
                  <>
                    <h3>Расписание для класса {selectedClass}</h3>
                    <Table
                      columns={classColumns}
                      dataSource={getClassSchedule(selectedClass)}
                      rowKey="number"
                      pagination={false}
                    />
                  </>
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
            <Sider
              width={200}
              style={{
                maxHeight: '100vh',
                height: '100vh',
                overflowY: 'auto',
                borderRight: '1px solid #ddd',
              }}
            >
              <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
                {classes.reduce<string[]>((teachers, className) => {
                  // Получаем всех учителей из расписания классов
                  const classSchedule = getClassSchedule(className);
                  classSchedule.forEach((lesson) => {
                    if (!teachers.includes(lesson.teacher1)) teachers.push(lesson.teacher1);
                    if (lesson.teacher2 && !teachers.includes(lesson.teacher2)) teachers.push(lesson.teacher2);
                  });
                  return teachers;
                }, []).map((teacherName) => (
                  <Menu.Item key={teacherName} onClick={() => setSelectedTeacher(teacherName)}>
                    {teacherName}
                  </Menu.Item>
                ))}
              </Menu>
            </Sider>

            <Content style={{ padding: '24px' }}>
              {selectedTeacher ? (
                getTeacherSchedule(selectedTeacher).length > 0 ? (
                  <>
                    <h3>Расписание для учителя {selectedTeacher}</h3>
                    <Table
                      columns={teacherColumns}
                      dataSource={getTeacherSchedule(selectedTeacher)}
                      rowKey="number"
                      pagination={false}
                    />
                  </>
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
