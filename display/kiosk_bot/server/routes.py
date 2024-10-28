from flask import request, jsonify, send_from_directory
from file_service import save_file, file_exists
from schedule_service import get_schedule_from_excel, get_teacher_schedule
import os

def register_routes(app):
    PHOTO_FOLDER = 'photos'
    os.makedirs(PHOTO_FOLDER, exist_ok=True)  # Создаем папку, если она не существует

    # Маршрут для загрузки фотографий
    @app.route('/api/upload/photo', methods=['POST'])
    def upload_photo():
        if 'file' not in request.files:
            return 'No file uploaded', 400

        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400

        # Сохраняем фотографию на сервере
        photo_path = os.path.join(PHOTO_FOLDER, file.filename)
        file.save(photo_path)
        return jsonify({'message': f'Photo {file.filename} uploaded successfully'}), 200

    # Маршрут для получения списка всех фото
    @app.route('/api/photos', methods=['GET'])
    def list_photos():
        photos = os.listdir(PHOTO_FOLDER)
        photo_urls = [f'/photos/{photo}' for photo in photos]
        return jsonify(photo_urls)

    # Маршрут для доступа к файлам фото
    @app.route('/photos/<filename>')
    def get_photo(filename):
        return send_from_directory(PHOTO_FOLDER, filename)


    # Маршрут для загрузки файлов расписания
    @app.route('/api/upload/<fileName>', methods=['POST'])
    def upload_file(fileName):
        if 'file' not in request.files:
            return 'No file uploaded', 400

        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400

        # Сохраняем файл расписания на сервере
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
