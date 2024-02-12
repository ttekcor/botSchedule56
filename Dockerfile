FROM python:3.12.0-slim-bullseye
FROM alpine  
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ADD . /usr/src/app/
WORKDIR /usr/src/app
ENV TZ=Asia/Vladivostok 
RUN apk add --no-cache tzdata
RUN apt update && apt -y upgrade
RUN pip install --no-cache-dir --upgrade -r requirements.txt
ENTRYPOINT python bot.py
