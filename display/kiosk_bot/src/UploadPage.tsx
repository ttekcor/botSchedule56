import React, { useState } from "react";
import { Upload, Button, message, Segmented } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

interface UploadPageProps {
  onUpload: (data: any[][]) => void;
}

const weekdayFileNames: Record<
  "Понедельник" | "Вторник" | "Среда" | "Четверг" | "Пятница",
  string
> = {
  Понедельник: "sch_pn.xlsx",
  Вторник: "sch_vt.xlsx",
  Среда: "sch_sr.xlsx",
  Четверг: "sch_cht.xlsx",
  Пятница: "sch_pt.xlsx",
};

const UploadPage: React.FC<UploadPageProps> = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<
    "Понедельник" | "Вторник" | "Среда" | "Четверг" | "Пятница"
  >("Понедельник");

  const handleUpload = (file: File) => {
    const fileName = weekdayFileNames[selectedDay];
    const formData = new FormData();
    formData.append("file", file, fileName);

    setLoading(true);
    axios
      .post(`http://127.0.0.1:5000/api/upload/${fileName}`, formData)
      .then(() => {
        message.success(`${fileName} успешно загружен`);
        // Optionally, parse and update the UI here if needed.
      })
      .catch(() => message.error("Ошибка при загрузке файла"))
      .finally(() => setLoading(false));
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      handleUpload(file);
      return false;
    },
  };

  return (
    <div>
      <Segmented
        options={["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"]}
        value={selectedDay}
        onChange={(day) =>
          setSelectedDay(
            day as "Понедельник" | "Вторник" | "Среда" | "Четверг" | "Пятница"
          )
        }
        style={{ marginBottom: 16 }}
      />
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} loading={loading}>
          Загрузить расписание
        </Button>
      </Upload>
    </div>
  );
};

export default UploadPage;
