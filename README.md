# SimpleFM

### A simple version of Football Manager
#### React Native, Node, Express, MySQL

Reqs, notes etc can be found here: https://docs.google.com/document/d/1CPjBUB_xIeGby0FUNNhlLmA9KSrggnHKitWkQZ9eZ-s/edit?usp=sharing

Complexity should increase with time!

### Stuff up next:  

Logic for gameweeks: Append results and display them  
Randomize how players are chosen to have scored etc  
Clean the code after minimum functionality is implemented -- we can probably reuse some components, for example the table

### Setup:  

Clone the repo, then run npm install to set up all the packages required.  
You'll also need to set up three MySQL databases: players, season, and results -- the specifications of which you can check out in server.js -- and you'll need to set up an env file, referenced in server.js as well!