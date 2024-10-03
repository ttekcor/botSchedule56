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

// Эндпоинт для получения учителей и их расписания из загруженного расписания
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

  const teachers = new Map();
  console.log(jsonData);

  // Обрабатываем строки с расписанием
  jsonData.slice(1).forEach((row) => {
    const lessonNumber = row[0]; // Номер урока
    const lessonName = row[1]; // Название урока
    // Проходим по каждому третьему столбцу, начиная со второго
    for (let i = 2; i < row.length; i += 3) {
      const teacher1 = row[i]; // Первый учитель
      const teacher2 = row[i + 1]; // Второй учитель (если есть)

      if (teacher1) {
        if (!teachers.has(teacher1)) {
          teachers.set(teacher1, []);
        }
        teachers
          .get(teacher1)
          .push({ number: lessonNumber, lesson: lessonName });
      }

      if (teacher2) {
        if (!teachers.has(teacher2)) {
          teachers.set(teacher2, []);
        }
        teachers
          .get(teacher2)
          .push({ number: lessonNumber, lesson: lessonName });
      }
    }
  });

  const teacherArray = Array.from(teachers.entries()).map(
    ([teacher, schedule]) => ({
      teacher,
      schedule,
    })
  );

  console.log("Расписание для учителей:", teacherArray);
  res.json(teacherArray);
});

// Запуск сервера
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
