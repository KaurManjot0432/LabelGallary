FROM python

WORKDIR /home/hp/Documents/LabelGallary/server

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver"]