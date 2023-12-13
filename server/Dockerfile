# Use an official Python runtime as a parent image
FROM python

WORKDIR /home/hp/Documents/LabelGallary/server

COPY . .

RUN pip install -r requirements.txt

EXPOSE 8000

# Run app.py when the container launches
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "server.wsgi:application"]