FROM python:3.12.0-slim-bullseye
ADD . /usr/src/app/
WORKDIR /usr/src/app
RUN echo '\
Acquire::Retries "100";\
Acquire::https::Timeout "240";\
Acquire::http::Timeout "240";\
APT::Get::Assume-Yes "true";\
APT::Install-Recommends "false";\
APT::Install-Suggests "false";\
Debug::Acquire::https "true";\
' > /etc/apt/apt.conf.d/99custom
RUN apt update && apt -y upgrade
RUN pip install --no-cache-dir --upgrade -r requirements.txt
ENTRYPOINT python bot.py
