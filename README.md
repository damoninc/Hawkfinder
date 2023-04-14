# csc450-sp23-project-team1

## Installation
1) Install node.js - https://nodejs.org/en/download/
	- Type npm -v to verify installation
2) Go to the directory where you wish to clone
3) Type the following command in the terminal: "git clone https://github.com/UNCW-CSC-450/csc450-sp23-project-team1.git"
4) Type "npm i" to install required dependencies
5) Install firebase dependencies with the following commands:
- `npm install firebase`
- `npm install -g firebase-tools`
6) Install extra dependencies
- `npm run extra_scripts`
7) Type "npm run dev" to run the application
8) Open "http://localhost:5173/" in browser of your choice
9) Ctrl+C or "q" to close the local server

-------------------------------------------------------------------------------------------------------------------------
## Running .ts Files
TypeScript files are generally never run by themselves as they are used with React + Vite to build the project. However, if there's ever an occasion where you need to run one, refer to this guide. Unfortunately, .ts files cannot be run by themselves. You must run the TypeScript compiler to convert them into .js files and then run them through Node.js.

1) Type "npm install -g typescript" if the TypeScript compiler is not installed.
	- Test your installation by typing "tsc --version".
		- If you get an error stating "running scripts is disabled on this system", refer to the thread below.
2) Navigate to the .ts file directory.
3) Type "tsc [your_ts_file_here].ts". This will convert the .ts file to a .js one with the same name.
	- You may recieve a "Accessors are only available when targeting ECMAScript 5 and higher" error. 
		- If that happens, instead type "tsc -t es5 [your_ts_file_here].ts".
4) Type "node [your_js_file_here].js".
	- The script may not run and tell you to change the file extension from .js to .cjs. Preferably, you can change the package.json "type" field from "module" to "commonjs", so you don't have to keep changing file extension for every script you run. Either method will work, but if you change package.json, don't forget to change it back.
5) Profit.
	- You could optionally combine steps 3 and 4 by stringing the commands together using a semicolon.
		- Ex: "tsc test_data.ts; node test_data.js" or "tsc -t es5 User.ts; node User.js".
### HELP! I get an error about running scripts being disabled!
By default, most machines have their execution policy set to "Restricted" to protect from malicious scripts. For Windows, you can check your execution policy by running "Get-ExecutionPolicy" in the Powershell. In order to run the .ts files, you'd need to change your execution policy to "RemoteSigned". This should allow scripts to run so long as you trust this project on your machine.

On Windows, this is done by:
1) Running "Windows Powershell" as an adminstrator.
2) Type "Set-ExecutionPolicy RemoteSigned".
3) Type "a" to agree to all.
4) Profit.
	- Unfortunately, I don't know how this works for Mac. Luckily, most of the Devs here use Windows (Sorry Damon!).
	- You may want to consider switching your execution policy back to "Restricted" after you have finished running your scripts.
-------------------------------------------------------------------------------------------------------------------------
## Developer Guide
Preferred IDE
- VSCode
Code Standards
- Follow the official TS guide created by Google: https://google.github.io/styleguide/tsguide.html
Linters
- ESLint
	- "npm install -g eslint" to install eslint globally on your machine
	- The linter is already a dependency in our project, so it will find any lint errors automatically
Pretty Formatting
- Install the Prettier extension
	- https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
- To format your code, right-click your workspace, click "Format Document With...", and choose "Prettier - Code Formatter"
- A better option would be to go into your VSCode settings and enable "Editor: Format On Save"
	- This will auto-format your code every time the file is saved
-------------------------------------------------------------------------------------------------------------------------
## About
Hawk Finder is a UNCW social media web app where users can share their interests with others. The app targets UNCW students looking to socialize and meet with other students based on their common interests.

Project Manager:
- Nicholas Brunsink

Lead Developer:
- John Bejar

Developers:
- Octavio Galindo
- Damon Incorvaia

---------------------------------------------------------------------------------------------------------------------------
## Components
Posts 
- Being Implemented by John Bejar

Main Feed 
- Being Implemented by John Bejar

FireBase
- Being Implemented by Damon Incorvaia

Authentication
- Being Implemented by Octavio Galindo

UserManger
- Being Implemented by Octavio Galindo, Damon Incorvaia

Spotify Integration
- Being implemented by Nicholas Brunsink

Friend System
- Being implemented by Nicholas Brunsink
---------------------------------------------------------------------------------------------------------------------------
This is a react.js project bootstrapped with Vite

## Links to Tutorials
- https://www.youtube.com/watch?v=bMknfKXIFA8
- https://beta.reactjs.org/
- https://www.youtube.com/watch?v=b0IZo2Aho9Y
- https://www.youtube.com/watch?v=s2skans2dP4 ← React Concepts
