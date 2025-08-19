# 🏡 Real Estate Project

## 📌 Overview
This project is a **Real Estate Management Application** built with:
- **Frontend:** Angular  
- **Backend:** Spring Boot (Java)  
- **Database:** MySQL (via XAMPP, port `3308`)  

---

## ⚙️ Requirements

Before running the project, make sure you have installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)  
- [Angular CLI](https://angular.io/cli)  
- [IntelliJ IDEA](https://www.jetbrains.com/idea/) or any IDE for Java  
- [XAMPP](https://www.apachefriends.org/) (MySQL on port `3308`)  
- [Maven](https://maven.apache.org/) (if not included in IntelliJ)  
- [Java JDK 17+](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)  

---

## 🗄 Database Setup (MySQL with XAMPP)

1. Start **XAMPP Control Panel**.  
2. Run **Apache** and **MySQL**.  
3. Open **phpMyAdmin** at [http://localhost:8080/phpmyadmin](http://localhost:8080/phpmyadmin).  
4. Create a new database:  

   ```sql
   CREATE DATABASE real_estate_db;
   Update your application.properties (Spring Boot) with:

spring.datasource.url=jdbc:mysql://localhost:3308/real_estate_db
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

🚀 Running the Project
1️⃣ Run Backend (Spring Boot)

Open the backend project in IntelliJ IDEA.

Wait until Maven dependencies are downloaded.

Start the project using:

mvn spring-boot:run


or click Run ▶ inside IntelliJ.

The backend will run at: http://localhost:8080

2️⃣ Run Frontend (Angular)

Navigate to the Angular project folder:

cd frontend


Install dependencies:

npm install


Run Angular with:

ng serve


Open browser at: http://localhost:4200

✅ Test the Application

Make sure XAMPP MySQL is running on port 3308.

Start Spring Boot backend → http://localhost:8080

Start Angular frontend → http://localhost:4200

Register/Login and test the app 🎉

📂 Project Structure
real-estate-project/
│── backend/        # Spring Boot Project
│── frontend/       # Angular Project
└── README.md       # Documentation

👨‍💻 Authors

Your Name
