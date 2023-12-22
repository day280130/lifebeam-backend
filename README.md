# Lifebeam's Backend Application

The backend API of Lifebeam : Lifestyle Improvement and Fitness Enhancement Application.

## How to Run in Local Server

1. Make .env File

Run this command
```bash
cp .env.example .env 
```
to copy the .env template. Fill the variables with your own valid credential including the firebase service account key. DB URL, and model API URL.

2. Download the packages

Run
```bash
npm install
```
to download all of the necessary packages for the project.

3. Setup Database

In this project, we are using SQL-based DBMS, MySQL, with ssl certificates to connect to them. If you are using the certificates too, make a folder named `cert` in the project root and fill it with your DB's server ca, client cert, and client key. After that, modify the `cert-generate` npm script in `package.json` to suit your needs. And then, and run it.
```bash
npm run cert-generate
```
Make sure to adjust your db url in `.env` file accordingly.
If you are not using ssl, skip this step.

4. Initiate Prisma

Run :
```bash
npx prisma generate && npx prisma migrate deploy
```
to generate prisma client and migrate the existing schema and migration file to your database.

5. Transpile the Typescript Code

Run :
```bash
npm run build
```
to transpile the typescript code into javascript. And then...

6. Run Your Code
Run :
```bash
npm start
```
to start the server.
