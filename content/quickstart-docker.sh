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

SW_VERSION=${SW_VERSION:-11.0.0}
SW_HORIZON_UI_VERSION=${SW_HORIZON_UI_VERSION:-1.0.0}
SW_BANYANDB_VERSION=${SW_BANYANDB_VERSION:-0.11.0}

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
  echo "Docker is not found. Please make sure Docker is installed and the docker command is available in PATH."
  exit 1
fi

temp_dir=$(mktemp -d)

curl -fsSL https://github.com/apache/skywalking/raw/master/docker/docker-compose.yml -o "$temp_dir/docker-compose.yml"

# The ui service bind-mounts ./horizon.yaml relative to the compose file, and the
# image reads its OAP URLs and login users only from there, so it has to land in
# the same directory or compose fails on the missing mount. Served from this site
# rather than a branch tip, so it stays in step with the versions pinned above.
curl -fsSL https://skywalking.apache.org/horizon.yaml -o "$temp_dir/horizon.yaml"

# If SW_STORAGE is not set, prompt the user to select a storage option
if [ -z "$SW_STORAGE" ]; then
  echo "Please select a storage option:"
  echo "1. Elasticsearch"
  echo "2. BanyanDB ($SW_BANYANDB_VERSION)"
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
export UI_IMAGE=apache/skywalking-ui:horizon-${SW_HORIZON_UI_VERSION}

echo "Installing SkyWalking ${SW_VERSION} with Horizon UI ${SW_HORIZON_UI_VERSION} and ${SW_STORAGE} storage..."

docker compose -f "$temp_dir/docker-compose.yml" \
  --project-name=skywalking-quickstart \
  --profile=$SW_STORAGE \
  up \
  --detach=${DETACHED:-true} \
  --wait

echo "SkyWalking is now running. You can send telemetry data to localhost:11800 and access the UI at http://localhost:8080."
if [ "$SW_STORAGE" = "banyandb" ]; then
  echo "You can access BanyanDB web UI at http://localhost:17913."
fi
echo "To find SkyWalking Docs, follow the link to our documentation site https://skywalking.apache.org/docs/."

echo "To stop SkyWalking, run 'docker compose --project-name=skywalking-quickstart down'."

echo ""
echo "Sign in to the UI at http://localhost:8080 with:"
echo "  username: skywalking"
echo "  password: skywalking"
echo "These are quickstart credentials — change them before exposing the UI beyond localhost."
