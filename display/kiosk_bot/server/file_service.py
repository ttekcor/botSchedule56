import os

UPLOAD_FOLDER = os.path.join(os.getcwd(), r'botSchedule56\display\kiosk_bot\server\upload')

# Убедимся, что папка для загрузки существует
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def save_file(file, file_name):
    """Сохраняет файл на сервер."""
    file_path = os.path.join(UPLOAD_FOLDER, file_name)
    file.save(file_path)

def file_exists(file_name):
    """Проверяет, существует ли файл на сервере."""
    return os.path.exists(os.path.join(UPLOAD_FOLDER, file_name))

