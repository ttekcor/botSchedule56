from flask import request, jsonify
from file_service import save_file, file_exists
from schedule_service import get_schedule_from_excel, get_teacher_schedule

def register_routes(app):
    # Маршрут для загрузки файлов
    @app.route('/api/upload/<fileName>', methods=['POST'])
    def upload_file(fileName):
        if 'file' not in request.files:
            return 'No file uploaded', 400

        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400

        save_file(file, fileName)
        return jsonify({'message': f'{fileName} uploaded successfully'}), 200

    # Маршрут для получения расписания
    @app.route('/api/schedule/<fileName>', methods=['GET'])
    def get_schedule(fileName):
        if not file_exists(fileName):
            return 'File not found', 404

        schedule = get_schedule_from_excel(fileName)
        return jsonify(schedule), 200

    # Маршрут для получения расписания учителя
    @app.route('/api/teachers/<fileName>/<teacherName>', methods=['GET'])
    def get_teacher(fileName, teacherName=None):
        if not file_exists(fileName):
            return 'File not found', 404

        if teacherName:
            schedule = get_teacher_schedule(fileName, teacherName)
            if schedule:
                return jsonify(schedule), 200
            else:
                return f'Teacher {teacherName} not found', 404
        else:
            all_schedules = get_teacher_schedule(fileName)
            return jsonify(all_schedules), 200

