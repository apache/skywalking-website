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

#!/usr/bin/env sh

set -e

SW_STORAGE=

SW_VERSION=${SW_VERSION:-9.7.0}
SW_BANYANDB_VERSION=${SW_BANYANDB_VERSION:-0.5.0}

usage() {
  echo "Usage: quickstart-docker.sh [-f]"
  echo "  -f  Run in the foreground"
  exit 1
}

while getopts "hf" opt; do
  case $opt in
    f)
      DETACHED=false
      ;;
    h)
      usage
      exit 0
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

echo "Checking if Docker is installed..."
if ! [ -x "$(command -v docker)" ]; then
  echo "Docker is not installed. Please install Docker and try again."
  exit 1
fi

temp_dir=$(mktemp -d)

curl -fsSL https://github.com/apache/skywalking/raw/master/docker/docker-compose.yml -o "$temp_dir/docker-compose.yml"

# If SW_STORAGE is not set, prompt the user to select a storage option
if [ -z "$SW_STORAGE" ]; then
  echo "Please select a storage option:"
  echo "1. Elasticsearch"
  echo "2. BanyanDB"
  read -p "Enter the number of your choice: " storage_option
fi

case $storage_option in
  1)
    SW_STORAGE=elasticsearch
    ;;
  2)
    SW_STORAGE=banyandb
    ;;
  *)
    echo "Invalid choice. Please enter 1 or 2."
    exit 1
    ;;
esac

export BANYANDB_IMAGE=apache/skywalking-banyandb:${SW_BANYANDB_VERSION}
export OAP_IMAGE=apache/skywalking-oap-server:${SW_VERSION}
export UI_IMAGE=apache/skywalking-ui:${SW_VERSION}

echo "Instaing SkyWalking ${SW_VERSION} with ${SW_STORAGE} storage..."

docker compose -f "$temp_dir/docker-compose.yml" \
  --project-name=skywalking-quickstart \
  --profile=$SW_STORAGE \
  up \
  --detach=${DETACHED:-true} \
  --wait

echo "SkyWalking is now running. You can send telemetry data at localhost:11800 and access the UI at http://localhost:8080"
