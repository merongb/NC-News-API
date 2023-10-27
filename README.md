# Northcoders News API

This project entails the creation of an API that facilitates programmatic retrieval of application data. As part of the development process, the aim is to build a robust backend service, ensuring seamless data delivery to the frontend architecture, which closely mirrors the functionality seen in real-world applications.

Here is a link to the hosted version
https://news-article-slsk.onrender.com/api

To clone and run this locally, install dotenv >>>>> "npm install dotenv" in the terminal.
Then create two files named ".env.test" and ".env.development".
Add "PGDATABASE=nc_news" to the development folder.
Add "PGDATABASE=nc_news_test" to the test folder.

You will also need to install the following dependencies using "npm install" :

- Express >>>>> "npm install express"
- pg >>>>> "npm install pg"
- Supertest >>>>> "npm install supertest"

And the following as devDependencies :

- Pg-format >>>>> "npm install -D pg-format"
- jest-sorted >>>>> "npm install -D jest-sorted"

To seed the local database run the following scripts in order:

1. "npm run setup-dbs"
2. "npm run seed"

You need the following versions of Node and PostgreSQL to run this project :

- Node v18.17.1
- psql (PostgreSQL) 14.9 (Homebrew)
