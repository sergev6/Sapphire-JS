Lightweight Node.js CMS with Angular Material Design UI

Requirements

- Node.js or higher version

- MySQL 5.x or higher version

Installation

- Copy the admin and frontend folders where you want nodecart to be installed

- Install the database script avaiable from SQL folder

- Change the database configuration inside config folder (admin.js, config.js) - for both admin/frontend - specify the same configuration details in both files only specify different port, if you specify in admin then you can copy those configuration files in frontend

- Use: npm install 

- That will install the dependencies packages (use npm install in the both admin and frontend folders where package.json files resides)

- Start the admin by the command line go to the downloaded admin folder : use: node server.js 

- Admin will listen on 3000 port you can access admin by http://localhost:3000

- Start the frontend by the command line go to the downloaded frontend folder : use: node app.js 

- Frontend will listen on 1984 port you can access frontend by http://localhost:1984
