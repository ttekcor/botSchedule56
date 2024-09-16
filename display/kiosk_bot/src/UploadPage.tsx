import React, { useState } from "react";
import * as XLSX from "xlsx";
import { message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface UploadPageProps {
  setClasses: (classes: string[]) => void;
  setSchedule: (schedule: any[][]) => void;
  setCarouselImages: (images: string[]) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({
  setClasses,
  setSchedule,
  setCarouselImages,
}) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Извлекаем первый лист
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      // Преобразуем лист в JSON
      const rows: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      // Извлекаем заголовки классов
      const headerRow = rows[0];
      const classNames: string[] = [];

      for (let i = 1; i < headerRow.length; i += 3) {
        classNames.push(headerRow[i]);
      }

      // Устанавливаем классы и расписание в состояние
      setClasses(classNames);
      setSchedule(rows);

      // Отображаем сообщение об успешной загрузке
      message.success("Данные загружены успешно");
    };

    reader.readAsArrayBuffer(file);
  };

  // Функция для обработки загрузки изображений
  const handleImageUpload = ({ file }: any) => {
    setImageFiles((prevFiles) => [...prevFiles, file]);
  };

  // Сохранение загруженных изображений
  const handleImageUploadFinish = () => {
    const imageUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setCarouselImages(imageUrls);
    message.success("Фотографии для карусели загружены успешно");
  };

  return (
    <div>
      <h3>Загрузить расписание</h3>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />
      <h3 style={{ marginTop: "20px" }}>Загрузить фотографии для карусели</h3>
      <Upload multiple beforeUpload={() => false} onChange={handleImageUpload}>
        <Button icon={<UploadOutlined />}>Загрузить изображения</Button>
      </Upload>
      {imageFiles.length > 0 && (
        <Button style={{ marginTop: "10px" }} onClick={handleImageUploadFinish}>
          Сохранить изображения
        </Button>
      )}
    </div>
  );
};

export default UploadPage;
