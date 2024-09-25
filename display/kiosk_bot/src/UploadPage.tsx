import React, { useState } from 'react';
import { Layout, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;

interface UploadPageProps {
  onUpload: (schedule: any[][]) => void; // Пропс для передачи данных в App
}

const UploadPage: React.FC<UploadPageProps> = ({ onUpload }) => {
  const [selectedDay, setSelectedDay] = useState<string>('pn');

  const dayToFileMap: { [key: string]: string } = {
    pn: 'sch_pn.xlsx',
    vt: 'sch_vt.xlsx',
    sr: 'sch_sr.xlsx',
    cht: 'sch_cht.xlsx',
    pt: 'sch_pt.xlsx',
  };

  const handleFileUpload = (file: File) => {
    const fileName = dayToFileMap[selectedDay];
    console.log('Загружаемый файл:', fileName); // Логирование имени файла
  
    const formData = new FormData();
    formData.append('file', file);
  
    axios.post(`http://localhost:5000/api/upload/${fileName}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        message.success('Файл успешно загружен и сохранен!');
        console.log(response.data)
        // Если сервер возвращает данные с расписанием, то передаём их через onUpload
        if (response.data && Array.isArray(response.data)) {
          onUpload(response.data);  // Передаём загруженные данные в App
        } else {
          message.error('Некорректный формат данных.');
        }
      })
      .catch((error) => {
        message.error('Ошибка при загрузке файла.');
        console.error('Ошибка загрузки файла:', error.response?.data || error);
      });
  };
  

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Button onClick={() => setSelectedDay('pn')}>Понедельник</Button>
          <Button onClick={() => setSelectedDay('vt')}>Вторник</Button>
          <Button onClick={() => setSelectedDay('sr')}>Среда</Button>
          <Button onClick={() => setSelectedDay('cht')}>Четверг</Button>
          <Button onClick={() => setSelectedDay('pt')}>Пятница</Button>
        </div>

        <Upload
          customRequest={({ file }) => handleFileUpload(file as File)}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Загрузить файл</Button>
        </Upload>
      </Content>
    </Layout>
  );
};

export default UploadPage;
