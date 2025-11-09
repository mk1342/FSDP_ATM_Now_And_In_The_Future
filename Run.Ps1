Write-Host "this file runs the frontend and backend of the project."
# Ensure you're in the root folder of the project
Write-Host "Moving to project directory..."


Set-Location -Path "$PSScriptRoot"
Write-Host "Starting the backend server..."
Start-Process -NoNewWindow -FilePath "node" -ArgumentList ".\app.js"
Write-Host "Backend server started."

Write-Host "Starting the frontend server..."
Set-Location -Path "$PSScriptRoot\my-vue-app"
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run serve"
Write-Host "Frontend server started."


Write-Host "Both backend and frontend servers are running."
