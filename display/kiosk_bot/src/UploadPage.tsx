import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface UploadPageProps {
  onUpload: (data: any[][]) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      // Здесь можно использовать библиотеку для обработки Excel файла, например, SheetJS (xlsx)
      // Допустим, dataParsed - это результат парсинга файла
      // onUpload(dataParsed);
      // Условная логика для демонстрации
      if (data) {
        // Имитация данных
        const simulatedData: any[][] = [
          ["Номер", "Класс", "Учитель 1", "Учитель 2"],
          ["1", "Математика", "Иванов", "Петров"],
          ["2", "Русский язык", "Сидоров", "Кузнецова"],
        ];
        onUpload(simulatedData);
      }
      message.success("Файл успешно загружен");
      setLoading(false);
    };

    reader.onerror = () => {
      message.error("Ошибка при загрузке файла");
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      handleUpload(file);
      return false; // Не отправлять файл на сервер
    },
  };

  return (
    <div>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} loading={loading}>
          Загрузить расписание
        </Button>
      </Upload>
    </div>
  );
};

export default UploadPage;
