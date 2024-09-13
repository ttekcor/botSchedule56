import React, { useState } from 'react';
import { Layout, Menu, Table, Empty } from 'antd';

const { Sider, Content } = Layout;

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
    <Layout>
        
      <Sider
      
        width={200}
        style={{
          maxHeight: '500px', // Ограничиваем высоту Sider
          overflowY: 'auto', // Добавляем вертикальную прокрутку
          borderRight: '1px solid #ddd', // Визуально разделяем Sider
        }}
      >
        
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
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
                columns={columns}
                dataSource={getClassSchedule(selectedClass)}
                rowKey="number"
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
