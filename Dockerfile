FROM python:3.12.0-slim-bullseye
FROM alpine  
ENV TZ=Asia/Vladivostok 
ADD . /usr/src/app/
WORKDIR /usr/src/app

RUN apk add --no-cache tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && apt -y upgrade
RUN pip install --no-cache-dir --upgrade -r requirements.txt
ENTRYPOINT python bot.py
