# Head Hunter Backend

This part of the Head Hunter application is a capstone project for the Mega K course, 3rd edition, designed to evaluate group performance in a Scrum framework. It supports the main application's goal of connecting HR professionals with IT job seekers, focusing on showcasing the skills and competencies of the course's participants.

## Live 

[HEAD HUNTER LIVE](https://head-hunter-ynt4.onrender.com/)

## 🖥️ Technology Stack

![NestJS Logo](https://img.shields.io/badge/NestJS-E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-ff6b6b.svg?style=for-the-badge&logo=typeorm&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000.svg?style=for-the-badge&logo=JSONWebTokens&logoColor=white) ![Passport](https://img.shields.io/badge/Passport-34E27A.svg?style=for-the-badge&logo=Passport&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)

##  Business Objective

### Purpose
This application simplifies connecting HR departments, including headhunters, with individuals seeking IT jobs. It serves multiple functions:
- Enables Mega K students (referred to as "Students") to showcase their skills in a unified manner.
- Assists HR professionals in easily finding suitable job candidates, conducting interviews, and proposing collaboration.
- Allows administrators to manage access to the student database.
- Complements the job market, particularly for Mega K students, without directly competing with job portals.

### Business Model
- **Administrator Control**: Admins regulate access to the student database, thereby controlling the quantity of CVs downloaded by each HR user.

### Target Audience
- **Students**: Young programmers who are the central focus of the application.
- **HR Professionals**: Looking to hire IT talent.
- **Administrators**: Overseeing student database access and HR user management.

## Application Workflow

### Student Profile Management
- **Import and Registration**: Admins import a list of students from a CSV or JSON file. Each student receives a registration link.
- **Profile Completion**: Students fill in their profiles during or after registration, with certain fields being optional.

### HR Operations
- **Adding HR Users**: Admins add HR users, setting specific parameters. Post-registration, HR users view a table with partial student information.
- **Student Selection for Interviews**: HR can select students for interviews. Their capacity to add students to the "Interview" list is limited.A key feature for HR is an advanced filtering form that allows specifying student parameters such as course grades, preferred employment type, and expected salary.

### Interview and Hiring Process
- **Interview List Review**: HR has access to a "Candidates for Interview" tab. Each candidate's entry includes additional text and three action buttons.
- **Hiring Decisions**: Decisions made by HR are communicated to admins. Unselected candidates are returned to the available pool.

## System Roles

- **Admin**: Authorized to add HR users and import students. Assumes a singular role, manually added to the database with password management capabilities.
- **Student**: Completes and updates their profile, which is then accessible to HR for potential employment opportunities.
- **HR**: Works in HR or as a headhunter, accessing student profiles subject to settings and limits imposed by the admin.

## Getting Started 

To get the backend up and running:

1. **Clone the repository**:
   ```bash
   git clone [Repo-URL]
   ```

2. **Navigate to the project directory**:
   ```bash
   cd [Repo-Name]
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the application**:
   - Start the app in development mode: `npm run start:dev`
   - Build the app: `npm run build`
   - Start the built app: `npm run start`
   - Start in debug mode: `npm run start:debug`
   - Start in production mode: `npm run start:prod`
   

5. **Environment Variables**: Create a `.env` file in the root of your project and add the following variables:
   ```
   MYSQL_HOST=
   MYSQL_PORT=
   MYSQL_USER=
   MYSQL_PASSWORD=
   MYSQL_DATABASE=

   ACCESS_TOKEN_SECRET=
   REFRESH_TOKEN_SECRET=
   CONFIRMATION_TOKEN_SECRET=

   EMAIL_IP=
   EMAIL_USER=
   EMAIL_PASSWORD=
   EMAIL_ADDRESS=
   EMAIL_SECRET=
   ```
   

To check BE in use, remember to download the server from the link and run it according to the instructions provided 
[go to FE repository](https://github.com/WitWitWitek/head-hunter-gr4-v3-FE)


## Contributors
Team members from both repositories FE & BE

- [WitWitWitek](https://github.com/WitWitWitek)
- [PmitPoland](https://github.com/PmitPoland)
- [wiesienk](https://github.com/wiesienk)
- [Insterek](https://github.com/Insterek)
- [kozerka](https://github.com/kozerka)


## License

This project is licensed under the MIT License. The MIT License is a permissive free software license originating at the Massachusetts Institute of Technology (MIT). It puts only very limited restriction on reuse and has, therefore, high license compatibility.


##  What We Learned

In the process of developing this project, our team navigated various challenges that provided valuable lessons in teamwork, especially under difficult conditions such as remote collaboration and time constraints. Key takeaways include:

- **Effective Communication**: Learning to communicate clearly and efficiently was crucial for remote teamwork.
- **Time Management**: Balancing different time zones and personal schedules taught us the importance of time management.
- **Flexibility and Adaptation**: Adapting to unforeseen challenges and being flexible in our approach was vital.
- **Collaboration Tools**: Utilizing various digital tools enhanced our ability to work together despite being remote.
- **Team Cohesion**: Despite the distance, we learned to work as a cohesive unit, supporting and learning from each other.

This project not only helped us enhance our technical skills but also strengthened our capabilities in working as a part of a diverse, distributed team.
