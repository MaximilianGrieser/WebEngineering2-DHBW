This Project is made by 2319319 and 7872819

Navigate to frontend and run npm install
navigate to backend and run npm install

Goto Backend/app.js -> put in your credentials to your mySql server in line 20ff (We used xampp and the included mySql Server).
Run gulp build in WebProj (note: this only works with an empty database, otherwiese tests will fail and the server wont start, you can start it manualy with running the comand node app.js in backend).
	gulp does:
		- Compile angular
		- Copy compiled angular files to Express Server
		- execute tsLint
		- execute mocha Tests
		- start Express Server
Goto localhost:3000 in your Web Browser, ther you should see the login page from the Calendar.

First Create a user by enterying the user id and a pw and click new User.
Then login with these credentials.
First head over to categories, there you can make your own ore use the preconfigured ones.
Then, add yourself to the Team Group, or any other group you may create. Otherwiese you wont be able to see your events in the Calendar!!
Now you can use the Calendar as you wish.
A special feature of our calendar is the dynamic categorie selection.


We tested the site in Chrome and OperaGX
We ported the site to angular therfor we needed to change our design a litle bit (acording to the last semester), witch may lock not as apealing.