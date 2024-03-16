# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Default values for SkyWalking versions
$SW_VERSION = "9.7.0"
$SW_BANYANDB_VERSION = "0.5.0"

$env:BANYANDB_IMAGE = "apache/skywalking-banyandb:$SW_BANYANDB_VERSION"
$env:OAP_IMAGE = "apache/skywalking-oap-server:$SW_VERSION"
$env:UI_IMAGE = "apache/skywalking-ui:$SW_VERSION"

# Unset the SW_STORAGE environment variable at the start of the script
Remove-Item Env:\SW_STORAGE -ErrorAction Ignore

# Ensuring script stops on error
$ErrorActionPreference = "Stop"

$storageOptionProvided = $false
$detachOptionProvided = $false

# Function to display usage information
function Show-Usage {
    Write-Host "Usage: quickstart-docker.ps1 [-h/--help] [-f] [--storage <storage_option>]"
    Write-Host "Options:"
    Write-Host "  -h/--help           About running the quickstart script without interaction"
    Write-Host "  -d                  Run in background mode (docker compose up -d)"
    Write-Host "  -f                  Run in foreground mode (docker compose up)"
    Write-Host "  --storage <option>  Set the storage option (elasticsearch or banyandb)"
    exit
}

# Process command-line arguments
for ($i = 0; $i -lt $args.Length; $i++) {
    switch ($args[$i]) {
        "-h" { Show-Usage; exit }
        "--help" { Show-Usage; exit }
        "-d" { $DETACHED = $true; $detachOptionProvided = $true; }
        "-f" { $DETACHED = $false; $detachOptionProvided = $true; }
        "--storage" {
            if ($i -lt $args.Length - 1) {
                $env:SW_STORAGE = $args[++$i]
                $storageOptionProvided = $true
                # Validate storage option if provided
                if ($storageOptionProvided -and -not ($env:SW_STORAGE -eq "elasticsearch" -or $env:SW_STORAGE -eq "banyandb")) {
                    Write-Host "Invalid storage option: $env:SW_STORAGE. Valid options are 'elasticsearch' or 'banyandb'."
                    exit 1
                }
            }
            else {
                Write-Host "Error: --storage option requires an argument."
                exit 1
            }
        }
        default {
            Write-Host "Invalid option: $($args[$i]), try -h or --help"
            exit 1
        }
    }
}


if (-not (Get-Command "docker" -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not found. Please make sure Docker is installed and the docker command is available in PATH.`n"
    exit 1
}
Write-Host "Docker is installed, continue...`n"

# In place download
Invoke-WebRequest -Uri "https://github.com/apache/skywalking/raw/master/docker/docker-compose.yml" -OutFile ".\docker-compose.yml"
Write-Host "Downloaded SkyWalking Docker Compose Manifest to the current directory...`n"

# If SW_STORAGE is not set, prompt the user to select a storage option
if (-not $storageOptionProvided) {
    Write-Host "Please select a storage option:"
    Write-Host "1. Elasticsearch"
    Write-Host "2. BanyanDB ($SW_BANYANDB_VERSION)"
    $storage_option = Read-Host "Enter the number of your choice"
    
    # Validate and process the input
    if ($storage_option -eq "1") {
        $env:SW_STORAGE = "elasticsearch"
        Write-Host "You have selected: Elasticsearch as the storage option.`n"
    }
    elseif ($storage_option -eq "2") {
        $env:SW_STORAGE = "banyandb"
        Write-Host "You have selected: BanyanDB as the storage option.`n"
    }
    else {
        Write-Host "Invalid choice. Please enter 1 or 2.`n"
        exit 1
    }
}

if (-not $detachOptionProvided) {
    $detachedFlag = Read-Host "Do you want to run Docker in detached mode (default: True)? [Y/n]: "

    $DETACHED = $true
    if ($detachedFlag -eq 'n' -or $detachedFlag -eq 'N') {
        $DETACHED = $false
    }
}

# Concatenate detached flag here
$composeCommand = "docker compose -f .\docker-compose.yml --project-name=skywalking-quickstart --profile=$env:SW_STORAGE up"

# Note the leading blank " --"
if ($DETACHED) {
    $composeCommand += " --detach --wait" # --wait implies implicit detached mode, just to be safe provide both
}

# Attempt to start Docker compose
Write-Host "Starting to set up SkyWalking ($SW_VERSION) with $env:SW_STORAGE storage, this might take a while...`n"

Invoke-Expression $composeCommand

# Check if the command was successful, try catch won't work here
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nFailed to start SkyWalking. Please check the Docker compose logs for more information.`n"
    exit $LASTEXITCODE
}
else {
    Write-Host "`nSkyWalking is now running. You can send telemetry data to localhost:11800 and access the UI at http://localhost:8080.`n"
    if ($env:SW_STORAGE -eq "banyandb") {
        Write-Host "You can access BanyanDB web UI at http://localhost:17913.`n"
    }
    Write-Host "To find SkyWalking Docs, follow the link to our documentation site https://skywalking.apache.org/docs/.`n"

    Write-Host "To stop SkyWalking, run 'docker compose --project-name=skywalking-quickstart down'.`n"
}
