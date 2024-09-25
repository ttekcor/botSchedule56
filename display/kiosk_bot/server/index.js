const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const XLSX = require("xlsx");

const uploadDir = path.join(__dirname, "upload");

// Создаем папку для загрузки файлов, если она не существует
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

// Включение CORS для всех маршрутов
app.use(cors());

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Имя файла остается таким же
  },
});

const upload = multer({ storage });

// Маршрут для загрузки файлов
app.post("/api/upload/:fileName", upload.single("file"), (req, res) => {
  const fileName = req.params.fileName;
  if (!req.file) {
    console.error("Ошибка: Файл не был загружен");
    return res.status(400).send("No file uploaded");
  }
  console.log("Файл загружен:", req.file); // Логирование информации о файле
  res.send({ message: `${fileName} uploaded successfully` });
});

// Маршрут для получения расписания для конкретного дня в формате JSON
app.get("/api/schedule/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(uploadDir, fileName);

  // Проверяем, существует ли файл
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  // Читаем Excel файл
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Выбираем первый лист
  const sheet = workbook.Sheets[sheetName];

  // Преобразуем данные в формат JSON
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Отправляем JSON клиенту
  res.json(jsonData);
});

// Эндпоинт для получения учителей из загруженного расписания
app.get("/api/teachers/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(uploadDir, fileName);

  // Проверяем, существует ли файл
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  // Читаем Excel файл
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Выбираем первый лист
  const sheet = workbook.Sheets[sheetName];

  // Преобразуем данные в формат JSON
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const teachers = new Set();
  console.log(jsonData);
  
  jsonData.slice(1).forEach((row) => {
    console.log('Row data:', row);
  
    // Проходим по каждому третьему столбцу, начиная с 2 и 3 столбца
    for (let i = 2; i < row.length; i += 3) {
      if (row[i]) {
        console.log('Teacher:', row[i]);
        teachers.add(row[i]); // Учитель из каждого 3-го столбца начиная с 2-го
      }
      if (row[i + 1]) {
        console.log('Teacher:', row[i + 1]);
        teachers.add(row[i + 1]); // Учитель из каждого 3-го столбца начиная с 3-го
      }
    }
  });
  
  const teacherArray = Array.from(teachers);
  console.log('Final list of teachers:', teacherArray);
  res.json(teacherArray);
  
});

// Запуск сервера
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
