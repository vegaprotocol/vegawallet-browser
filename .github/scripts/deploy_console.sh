#!/bin/bash

env="$1"
script_dir="$(dirname "$0")"  # Get the directory of the Bash script

if [ "$env" = "mainnet" ]; then
    docker run -d --name console -e NX_VEGA_URL=https://vega.aurora-edge.com/graphql -p 3001:80 vegaprotocol/trading:mainnet
    node "$script_dir/poll_for_endpoint_health.js" mainnet
elif [ "$env" = "testnet" ]; then
    docker run -d --name console -e NX_VEGA_ENV=TESTNET -e NX_VEGA_URL=https://api.n08.testnet.vega.rocks/graphql -p 3000:80 vegaprotocol/trading:testnet
    node "$script_dir/poll_for_endpoint_health.js" testnet
else
    echo "Invalid environment: $env, please choose mainnet or testnet"
    exit 1
fi