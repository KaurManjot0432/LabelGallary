# Project: Label Gallary

## Overview

Label Gallary is an image management app where admins can upload images and users will be able to access all the images and can assign different labels to the images. 


## Functional Requirements

LabelGallary meets a range of functional requirements:

- **User Authentication**: Authentication ensures secure access to user-specific features.
- **Image Management**: managing images by storing directly in S3, reducing server load
- **Labeling and Tagging**: Users can assign labels or tags to images, Labels help in categorizing and searching for images.
- **Gallery Display**: Images are displayed in a grid or carousel format.
- **Pagination and Lazy Loading**:Implemented pagination in backend and lazy loading in frontend to optimize the performance
- **Search and Filter**: Users can search for images based on labels, tags, or other metadata.
- **Role based Access**: The system supports different user roles, such as "Admin," "User," etc.

## Non-Functional Requirements

In addition to its functional features, Label Gallary prioritizes non-functional requirements for reliability, security, and performance:

- **Performance**: The application load images quickly using presigned urls of S3
- **Reliability**: Ensure the system functions well and recovers gracefully from issues.
- **Usability**: The user interface is intuitive and easy to navigate
- **Scalability**: Scalability ensures the application's performance remains stable under increased load.


## Technology Stack
#### Backend
- Python
- Django
- MongoDB
- S3 for storing static images

#### Frontend
- TypeScript
- React
- Redux
- material ui

## Screenshots

Here are some screenshots showcasing the platform:

- **Screenshot 1**: 
![Alt text](/screenshots/ss1.png?raw=true "Optional Title")

## Getting Started

Follow the steps below to run the project.

System Requirements - Node, MongoDB, Python

1. unzip the file


2. Run the backend server inside server folder using the command line simply using,

```bash
python manage.py runserver
```

3. Run the frontend server at root directory using the command line simply using,

```bash
npm start
```
you can create superuser using following command - 
```
python manage.py createsuperuser
```

Run the application on http://localhost:3000/



**Happy task management with Label Gallary!**
