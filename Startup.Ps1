Write-Host "this file contains the nessacary startup dependencies."
#setup for starting project

#Ensure you're in the root folder of the project
Set-Location -Path "$PSScriptRoot"
Write-Host "Working directory set to project root: $PSScriptRoot"

## ---------------------- backend setup ---------------------- ##



# npm packages setup (if applicable)
Write-Host "Installing required npm packages..."
npm install express dotenv mongoose cors axios googleapi# check with package.json for any additional dependencies

# vue cli (check)
Write-Host "Checking if Vue CLI is installed..."


# :) 
$vueExists = (Get-Command vue -ErrorAction SilentlyContinue)

if ($null -eq $vueExists) {
    Write-Host "Vue CLI not detected. Installing globally..."
    npm install -g @vue/cli
    Write-Host "Vue CLI installed."
} else {
    Write-Host "Vue CLI already installed."
}

# Frontend dependencies setup
Write-Host "Installing frontend dependencies..."
Set-Location -Path ".\frontend"
npm install
Set-Location -Path "$PSScriptRoot"
Write-Host "Frontend dependencies installed."=

# MongoDB setup
Write-Host "Please ensure MongoDB is installed locally."
Write-Host "No automatic database setup is performed here."

# Node.js setup (check)
Write-Host "Installing required Node.js packages..."


Write-Host " Setup complete!"


Write-Host ""
Write-Host ""

Write-Host " To start the project, run:  .\run.ps1"

Write-Host ""

Write-Host " To exit the terminal, press: Ctrl + C"

# Prevent the script from blowing up user terminal
while ($true) {
    Start-Sleep -Seconds 1
}

