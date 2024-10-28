from flask import request, jsonify
from file_service import save_file, file_exists
from schedule_service import get_schedule_from_excel, get_teacher_schedule

def register_routes(app):
    # Маршрут для загрузки файлов расписания
    @app.route('/api/upload/<fileName>', methods=['POST'])
    def upload_file(fileName):
        if 'file' not in request.files:
            return 'No file uploaded', 400

        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400

        # Сохраняем файл на сервере
        save_file(file, fileName)
        return jsonify({'message': f'{fileName} uploaded successfully'}), 200

    # Маршрут для получения полного расписания из файла
    @app.route('/api/schedule/<fileName>', methods=['GET'])
    def get_schedule(fileName):
        print(f"Запрос расписания для файла: {fileName}")
        if not file_exists(fileName):
            print(f"Файл {fileName} не найден")
            return 'File not found', 404

        schedule = get_schedule_from_excel(fileName)
        return jsonify(schedule), 200

    # Маршрут для получения списка всех учителей или расписания конкретного учителя
    @app.route('/api/teachers/<fileName>', methods=['GET'])
    def get_teacher_list(fileName):
        if not file_exists(fileName):
            return 'File not found', 404

        all_schedules = get_teacher_schedule(fileName)
        teacher_names = [schedule['teacher'] for schedule in all_schedules]
        return jsonify(teacher_names), 200

    # Маршрут для получения расписания конкретного учителя по имени
    @app.route('/api/teachers/<fileName>/<teacherName>', methods=['GET'])
    def get_teacher(fileName, teacherName):
        if not file_exists(fileName):
            return 'File not found', 404

        schedule = get_teacher_schedule(fileName, teacherName)
        if schedule:
            return jsonify(schedule), 200
        else:
            return f'Teacher {teacherName} not found', 404
