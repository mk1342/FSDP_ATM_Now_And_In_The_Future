Write-Host "this file contains the nessacary startup dependencies."
#setup for starting project

Write-Host "If the current setup does not run, Please run the following command to install the dependencies:"
Write-Host "pip install -r requirements.txt"
Write-Host "depending on your python installation."

#Ensure you're in the root folder of the project
Write-Host "Moving to project directory..."
Set-Location -Path "$PSScriptRoot"
Write-Host "Starting the project..."



# MongoDB setup
choco install mongodb-atlas-cli
choco install docker-desktop

Write-Host "27017 SHOULD be default port for mongodb"
atlas deployments setup testing --type local \ --mdbVersion 8.0 --port 27017 --connectWith skip

# npm packages setup (if applicable)
Write-Host "Installing required npm packages..."
npm install express dotenv # check with package.json for any additional dependencies

# vue.js (check)
npm install -g @vue/cli
vue create my-vue-app
cd my-vue-app
npm run serve
cd ..

# Node.js setup (check)
Write-Host "Installing required Node.js packages..."
#npm install mongoose cors body-parser
#npm install nodemon --save-dev



# Test connection
atlas deployments connect myTestDb --connectWith mongosh
show dbs
use myTestDb
show collections
db.createCollection("testCollection")
db.testCollection.insertOne({name: "test"})
db.testCollection.find({name: "test"})
exit
Write-Host MongoDB setup complete.

# Start the project
Write-Host were not using pyhton

node .\app.js

Write-Host Project started successfully.
Write-Host documentation? lol.