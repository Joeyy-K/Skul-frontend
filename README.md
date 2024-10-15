# Skul - School Management System Frontend

I builtthis project after I noticed that the mzizi app that my sister uses to recieve her holidays assignments is too junky, slow and overall a very bad for User Experience especially on smartphones, it just tries to do so much for one application, the every day person should be able to navigate but my mother can not so I figured I would atleast try to create a tool for students to recieve their assignments.

Skul is a comprehensive school management system built with Vite, React, and Tailwind CSS. This frontend application provides an intuitive interface for managing various aspects of school administration, including student and teacher management, scheduling, and communication.

## Features

- Multi-user system with different roles (School Admin, Teacher, Student)
- Student and teacher management
- Grade and class management
- Schedule management
- User-friendly dashboard
- Responsive design for various screen sizes

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
git clone https://github.com/Joeyy-K/Skul-frontend.git
Copy
2. Navigate to the project directory:
cd skul-frontend
Copy
3. Install dependencies:
npm install
Copy
4. Start the development server:
npm run dev
Copy
5. Open your browser and visit `http://localhost:5173` (or the port shown in your terminal).

## User Roles and Functionality

### School Administrator
- Manage student profiles (add, edit, delete)
![School View](/skul/public/images/Screenshot%20(18).png)
- Manage teacher profiles (add, edit, delete)
![School View](/skul/public/images/Screenshot%20(19).png)
- Create and manage grades
![School View](/skul/public/images/Screenshot%20(17).png)
- Assign teachers to specific grades
![School View](/skul/public/images/Screenshot%20(20).png)
- Upload and manage school schedules and exam timetables
![School View](/skul/public/images/Screenshot%20(28).png)
![School View](/skul/public/images/Screenshot%20(29).png)
- Create and manage communication channels
- View and manage all users in the school system
![School View](/skul/public/images/Screenshot%20(32).png)

### Teacher
- View assigned grade and list of students
![Teacher View](/skul/public/images/Screenshot%20(21).png)
- Create and manage assignments for their grade
![Teacher View](/skul/public/images/Screenshot%20(26).png)
![Teacher View](/skul/public/images/Screenshot%20(24).png)
- View and grade assignment submissions from students
![Teacher View](/skul/public/images/Screenshot%20(25).png)
- Upload learning materials for students
- Communicate with students through designated channels
![Teacher View](/skul/public/images/Screenshot%20(31).png)
![Teacher View](/skul/public/images/Screenshot%20(32).png)
- View school schedules and exam timetables
- Update their own profile information
![Teacher View](/skul/public/images/Screenshot%20(30).png)

### Student
- View personal profile and assigned grade
- Access class schedules and exam timetables
![Student View](/skul/public/images/Screenshot%20(15).png)
- View and submit assignments
![Student View](/skul/public/images/Screenshot%20(22).png)
- Access learning materials uploaded by teachers
- Communicate with teachers and classmates through channels
![Student View](/skul/public/images/Screenshot%20(31).png)
- Update their own profile information
![Student View](/skul/public/images/Screenshot%20(30).png)

## Main Views

1. **Dashboard**: Displays latest schedules, upcoming exams.
2. **Student Management**: Lists all students with options to add, edit, or remove students. (School Admin view)
3. **Teacher Management**: Shows all teachers with their assigned grades and channels. (School Admin view)
4. **Create Student/Teacher Profile**: Forms to add new students or teachers to the system. (School Admin view)
5. **Grade Management**: Interface for creating and managing school grades. (School Admin view)
6. **Assignment Management**: Interface for teachers to create, view, and grade assignments.
7. **Schedule View**: Calendar interface showing school schedules and exam timetables.
8. **Communication Channels**: Chat-like interface for school-wide or grade-specific communication.

## Technologies Used

- Vite
- React
- Tailwind CSS
- Python(Django rest api for the backend)
- React Router (for navigation)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).