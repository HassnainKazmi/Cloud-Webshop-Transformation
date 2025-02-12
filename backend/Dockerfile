# Use Python 3.11.5 as the base image
FROM python:3.11.5-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container
# The .dockerignore will exclude the .env files
COPY . /app

# Install dependencies listed in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 80
EXPOSE 80

# Command to run the Flask app when the container starts
CMD ["flask", "--app", "app.py", "run", "-h", "0.0.0.0", "-p", "80"]
# ENTRYPOINT [ "executable" ]
