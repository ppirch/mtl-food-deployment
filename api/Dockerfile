FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

WORKDIR /api

COPY ./requirements.txt ./requirements.txt

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

COPY . .