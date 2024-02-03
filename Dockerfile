FROM python:3.12.0
ADD . /usr/src/app/
WORKDIR /usr/src/app
RUN apt update && apt -y upgrade
RUN pip install --no-cache-dir --upgrade -r requirements.txt
ENTRYPOINT python bot.py