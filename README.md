Village Rentals App

Village Rentals App is a full-stack web application for managing an equipment rental business. Built with Next.js, TypeScript, and MySQL (via Prisma ORM), it allows staff to manage customers, equipment, rentals and categories.


Frontend & Backend: Next.js 
Language: TypeScript
Styling: Tailwind CSS
Database: MySQL
ORM: Prisma
Local DB GUI: TablePlus (recommended)
Deployment: Vercel-compatible

Getting Started:

1. Clone the Repository
git clone https://github.com/nayabektenova/village-rentals-app.git
cd village-rentals-app
2. Install Dependencies
npm install
3. Configure Environment
Create a .env file in the project root and add your database connection string:
DATABASE_URL="mysql://username:password@localhost:3306/village_rentals"
Make sure your MySQL server is running and the database village_rentals exists.
4. Set Up Prisma Schema
npx prisma db push
5. Run the Development Server
npm run dev
Visit http://localhost:3000 to view the application.

Mock Data:

This project includes mock data in CSV format to simulate database records during development. The files are located in the mock-data/ folder:
customers.csv
equipment.csv
equipmentcategory.csv
rentals.csv

Resources:

Next.js Documentation
Prisma Documentation
Tailwind CSS Docs
Deployment

Author: Naya Bektenova
