#!/bin/bash

env="$1"
nx_vega_url="$2"
script_dir="$(dirname "$0")"

docker_command="docker run -d --name console -e NX_VEGA_URL=\"$nx_vega_url\""
node_command="node $script_dir/poll_for_endpoint_health.js"

if [ "$env" = "mainnet" ]; then
    $docker_command -p 3001:80 vegaprotocol/trading:mainnet
    $node_command mainnet
elif [ "$env" = "testnet" ]; then
    $docker_command -e NX_VEGA_ENV=TESTNET -p 3000:80 vegaprotocol/trading:testnet
    $node_command testnet
else
    echo "Invalid environment: $env, please choose mainnet or testnet"
    exit 1
fi
