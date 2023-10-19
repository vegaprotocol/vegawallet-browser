#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <environment> <node>"
    echo "Available environments: mainnet, testnet"
    echo "If <node> is not provided, it will be generated based on the environment."
    exit 1
fi

env="$1"
node="$2"
script_dir="$(dirname "$0")"

if [ -z "$node" ]; then
    if [ "$env" = "mainnet" ]; then
        configPath="../../../config/mainnet.js"
    elif [ "$env" = "testnet" ]; then
        configPath="../../../config/testnet.js"
    else
        echo "Invalid environment: $env, please choose mainnet or testnet"
        exit 1
    fi
    # If <node> is not provided, generate it based on the environment
    vega_node=$(node "$script_dir/get-healthy-node-or-version.js" "$configPath" get-healthy-node)
fi


vega_node="${vega_node}/graphql"
echo $vega_node
docker_command="docker run -d --name console -e NX_VEGA_URL=\"$vega_node\""
poll_command="node $script_dir/poll_for_endpoint_health.js"

if [ "$env" = "mainnet" ]; then
    $docker_command -p 3001:80 vegaprotocol/trading:mainnet
    $poll_command mainnet
elif [ "$env" = "testnet" ]; then
    $docker_command -e NX_VEGA_ENV=TESTNET -p 3000:80 vegaprotocol/trading:testnet
    $poll_command testnet
else
    echo "Invalid environment: $env, please choose mainnet or testnet"
    exit 1
fi
