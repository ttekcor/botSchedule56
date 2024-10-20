import os
from openpyxl import load_workbook

UPLOAD_FOLDER = os.path.join(os.getcwd(), r'botSchedule56\display\kiosk_bot\server\upload')

def get_schedule_from_excel(file_name):
    """Читает файл Excel и возвращает данные в формате JSON."""
    file_path = os.path.join(UPLOAD_FOLDER, file_name)
    workbook = load_workbook(file_path)
    sheet = workbook.active
    print(sheet)

    schedule = []
    for row in sheet.iter_rows(values_only=True):
        schedule.append(list(row))

    return schedule

def get_teacher_schedule(file_name, teacher_name=None):
    """Возвращает расписание для конкретного учителя или всех учителей."""
    file_path = os.path.join(UPLOAD_FOLDER, file_name)
    workbook = load_workbook(file_path)
    sheet = workbook.active

    data = []
    for row in sheet.iter_rows(values_only=True):
        data.append(list(row))

    teachers = {}
    class_names = data[0][2:]  # Классы начинаются с 3-го столбца

    for row in data[1:]:
        lesson_number = row[0]
        lesson_name = row[1]

        if not lesson_number or not lesson_name:
            continue

        for i in range(2, len(row), 3):
            class_index = (i - 2) // 3
            class_name = class_names[class_index]
            teacher1 = row[i]
            teacher2 = row[i + 1] if i + 1 < len(row) else None

            if teacher1:
                if teacher1 not in teachers:
                    teachers[teacher1] = []
                teachers[teacher1].append({
                    'number': lesson_number,
                    'lesson': lesson_name,
                    'class': class_name
                })

            if teacher2:
                if teacher2 not in teachers:
                    teachers[teacher2] = []
                teachers[teacher2].append({
                    'number': lesson_number,
                    'lesson': lesson_name,
                    'class': class_name
                })

    # Возвращаем расписание конкретного учителя
    if teacher_name:
        if teacher_name in teachers:
            schedule = teachers[teacher_name]
            combined_schedule = {}
            for entry in schedule:
                lesson = entry['lesson']
                if lesson not in combined_schedule:
                    combined_schedule[lesson] = []
                combined_schedule[lesson].append(entry['class'])

            return {
                'teacher': teacher_name,
                'schedule': [{'lesson': k, 'classes': v} for k, v in combined_schedule.items()]
            }
        else:
            return None

    # Возвращаем расписание для всех учителей
    teacher_list = []
    for teacher, schedule in teachers.items():
        combined_schedule = {}
        for entry in schedule:
            lesson = entry['lesson']
            if lesson not in combined_schedule:
                combined_schedule[lesson] = []
            combined_schedule[lesson].append(entry['class'])

        teacher_list.append({
            'teacher': teacher,
            'schedule': [{'lesson': k, 'classes': v} for k, v in combined_schedule.items()]
        })

    return teacher_list

