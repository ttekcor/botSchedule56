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

app.get("/api/teachers/:fileName/:teacherName?", (req, res) => {
  const fileName = req.params.fileName;
  const teacherName = req.params.teacherName; // Получаем имя учителя из параметра
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

  // Получаем список классов из первой строки
  const classNames = jsonData[0].slice(2); // Все столбцы начиная со 2-го

  // Обрабатываем строки с расписанием
  jsonData.slice(1).forEach((row) => {
    const lessonNumber = row[0]; // Номер урока
    const lessonName = row[1]; // Название урока

    // Если строка пустая, пропускаем
    if (!lessonNumber || !lessonName) {
      return; // Пропускаем пустые строки
    }

    // Проходим по каждому третьему столбцу, начиная с 2-го
    for (let i = 2; i < row.length; i += 3) {
      const classIndex = Math.floor((i - 2) / 3); // Индекс для класса из первой строки
      const className = classNames[classIndex]; // Соответствующий номер класса
      const teacher1 = row[i]; // Первый учитель
      const teacher2 = row[i + 1]; // Второй учитель (если есть)

      // Если есть учитель1, добавляем его урок
      if (teacher1) {
        if (!teachers.has(teacher1)) {
          teachers.set(teacher1, []);
        }
        teachers.get(teacher1).push({
          number: lessonNumber,
          lesson: lessonName,
          class: className,
        });
      }

      // Если есть учитель2, добавляем его урок
      if (teacher2) {
        if (!teachers.has(teacher2)) {
          teachers.set(teacher2, []);
        }
        teachers.get(teacher2).push({
          number: lessonNumber,
          lesson: lessonName,
          class: className,
        });
      }
    }
  });

  // Если передано имя учителя, фильтруем результат
  if (teacherName) {
    if (teachers.has(teacherName)) {
      const schedule = teachers.get(teacherName).reduce((acc, curr) => {
        const existing = acc.find((item) => item.lesson === curr.lesson);
        if (existing) {
          existing.classes.push(curr.class);
        } else {
          acc.push({ lesson: curr.lesson, classes: [curr.class] });
        }
        console.log(acc);
        return acc;
      }, []);
      return res.json({
        teacher: teacherName,
        schedule: schedule,
      });
    } else {
      return res.status(404).send(`Teacher ${teacherName} not found`);
    }
  }

  // Преобразуем Map в массив объектов
  const teacherArray = Array.from(teachers.entries()).map(
    ([teacher, schedule]) => {
      const combinedSchedule = schedule.reduce((acc, curr) => {
        const existing = acc.find((item) => item.lesson === curr.lesson);
        console.log(item);
        if (existing) {
          existing.classes.push(curr.class);
        } else {
          acc.push({ lesson: curr.lesson, classes: [curr.class] });
        }
        return acc;
      }, []);
      return {
        teacher,
        schedule: combinedSchedule,
      };
    }
  );

  // console.log(
  //   "Расписание для учителей:",
  //   teacherArray,
  //   teacherArray.map((_) => _.schedule)
  // );
  res.json(teacherArray);
});

// Запуск сервера
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
