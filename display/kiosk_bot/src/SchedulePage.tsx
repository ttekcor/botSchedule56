import React, { useState } from 'react';
import { Layout, Menu, Table, Empty, theme } from 'antd';
import './App.css';


const { Sider, Content } = Layout;
const { SubMenu } = Menu;

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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  // Массив с фамилиями учителей
  const teachers = ['Иванов', 'Петров', 'Сидоров', 'Кузнецов', 'Смирнов'];

  // Функция для получения расписания конкретного класса
  const getClassSchedule = (className: string): ScheduleRow[] => {
    if (!schedule.length) return [];

    // Находим индекс столбца для выбранного класса
    const headerRow = schedule[0];
    const classIndex = headerRow.indexOf(className);

    if (classIndex === -1) return []; // Если класс не найден

    // Извлекаем данные для выбранного класса
    const classSchedule: ScheduleRow[] = schedule.slice(1).map((row: any[]) => ({
      number: row[0], // Номер урока
      lesson: row[classIndex], // Название урока
      teacher1: row[classIndex + 1], // Учитель 1
      teacher2: row[classIndex + 2] || '', // Учитель 2 (если есть)
    }));

    // Убираем пустые строки (если урок пуст)
    return classSchedule.filter((row) => row.lesson);
  };

  // Колонки для таблицы
  const columns = [
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

  return (
    <Layout style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}>
      <Sider
        style={{ background: colorBgContainer }} width={200}
        
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
         
        >
          {/* Группа для классов */}
          <SubMenu key="classes" title="Классы">
            {classes.map((className) => (
              <Menu.Item
                key={className}
                onClick={() => setSelectedClass(className)}
                
              >
                {className}
              </Menu.Item>
            ))}
          </SubMenu>

          {/* Группа для учителей */}
          <SubMenu key="teachers" title="Учителя">
            {teachers.map((teacher) => (
              <Menu.Item
                key={teacher}
                
              >
                {teacher}
              </Menu.Item>
            ))}
          </SubMenu>
        </Menu>
      </Sider>

      <Content style={{ padding: '24px' }}>
        {selectedClass ? (
          getClassSchedule(selectedClass).length > 0 ? (
            <>
              <h3>Расписание для класса {selectedClass}</h3>
              <Table
                columns={columns}
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
  );
};

export default SchedulePage;
