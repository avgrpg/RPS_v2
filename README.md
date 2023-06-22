

<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h2 align="center">Remote Proctoring System</h2>

  <p align="center">
    This repo is the source code developed in my final year project. (for showcase)
    <br />
  </p>
  <br>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Tech Stack</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Backend setup</a></li>
        <li><a href="#installation">Setup</a></li>
      </ul>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]]()

(A range score Final Year Project) This project aims to develop a system that allows students to take programming examinations in remote locations. The system is built as a VS Code extension to enhance accessibility. It includes underlying functions in monitoring and logging students' typing behavior, computation of students' suspicion scores, two frontend interfaces for students and teachers, respectively, and a backend server.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Tech Stack

The system is split into three parts: extension core, frontend, and backend. The extension core part is developed with VS Code API, Node.js, and typescript. The frontend interfaces are built using React, Material UI, Redux, and Vite for bundling. For the backend server, Express.js is used to create APIs and provide server routes. MongoDB is used as the backend database. Various technologies like Bcrypt and Jsonwebtoken are also utilized for enhancing server security.

* Extension Core: VS Code API, Node.js, Typescript
* Frontend Interfaces: React, Material UI, Redux, Vite
* Backend: Express.js, MongoDB, jsonwebtoken, bcrypt

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

1. Dowload and install the .visx file from publish for regular users.
2. Go to setting amd set up the link to backend.


### Backend setup

1. Download the folder, server_v2.
2. Get the Mongo URL (Standard Connection String Format) at MongoDB
3. creat a new file called .env and setup the variables according to .env.example
* npm
  ```sh
  npm init
  ```
4. run index.js file

### Setup

_This section is for developing extension _

1. Clone the repo
   ```sh
   git clone https://github.com/avgrpg/RPS_v2.git
   ```
2. Install NPM packages
   ```sh
   npm install:all
   ```
3. Dev student interface 
   ```sh
   cd webview-ui
   npm run start
   ```
   Build student interface
   ```sh
   npm run build
   ```
4. Dev teacher interface 
   ```sh
   cd webview-ui2
   npm run start
   ```
   Build teacher interface
   ```sh
   npm run build
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
