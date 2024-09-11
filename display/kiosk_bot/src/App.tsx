import React, { useState } from 'react';
import { Layout, Menu, Table } from 'antd';
import * as XLSX from 'xlsx';

const { Header, Content, Footer, Sider } = Layout;

interface ScheduleRow {
  number: number;
  lesson: string;
  teacher1: string;
  teacher2: string;
}

const App: React.FC = () => {
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<any[][]>([]); // Массив строк данных

  // Функция для парсинга Excel
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      // Извлекаем первый лист
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      // Преобразуем лист в JSON
      const rows: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      // Извлекаем заголовки (классы)
      const headerRow = rows[0];
      const classNames: string[] = [];

      for (let i = 1; i < headerRow.length; i += 3) {
        classNames.push(headerRow[i]);
      }
      setClasses(classNames);

      // Сохраняем данные для дальнейшего использования
      setSchedule(rows);
    };

    reader.readAsArrayBuffer(file);
  };

  // Функция для получения расписания конкретного класса
  const getClassSchedule = (className: string): ScheduleRow[] => {
    if (!schedule.length) return [];

    // Находим индекс столбца для выбранного класса
    const headerRow = schedule[0];
    const classIndex = headerRow.indexOf(className);

    if (classIndex === -1) return []; // Если класс не найден

    // Извлекаем данные для выбранного класса и фильтруем строки, где данные по урокам пусты
    const classSchedule: ScheduleRow[] = schedule.slice(1).map((row: any[]) => ({
      number: row[0], // Номер урока
      lesson: row[classIndex], // Название урока
      teacher1: row[classIndex + 1], // Учитель 1
      teacher2: row[classIndex + 2] || '', // Учитель 2 (если есть)
    })).filter(row => row.lesson); // Фильтруем строки, где нет данных по урокам

    return classSchedule;
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
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Главная</Menu.Item>
          <Menu.Item key="2">Расписание</Menu.Item>
          <Menu.Item key="3">Игра</Menu.Item>
          <Menu.Item key="4">Заказ пропуска</Menu.Item>
          
        </Menu>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Layout>
          <Sider width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              {classes.map((className) => (
                <Menu.Item
                  key={className}
                  onClick={() => setSelectedClass(className)}
                >
                  {className}
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            {selectedClass && (
              <>
                <h3>Расписание для класса {selectedClass}</h3>
                <Table
                  columns={columns}
                  dataSource={getClassSchedule(selectedClass)}
                  rowKey="number"
                  pagination={false}
                />
              </>
            )}
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2024 Created by You</Footer>
    </Layout>
  );
};

export default App;
