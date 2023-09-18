env="$1"

if [ "$env" = "mainnet" ]; then
    docker run -d --name console -e NX_VEGA_URL=https://vega.aurora-edge.com/graphql -p 3001:80 vegaprotocol/trading:mainnet
elif [ "$env" = "testnet" ]; then
    docker run -d --name console -e NX_VEGA_ENV=TESTNET -e NX_VEGA_URL=https://api.n08.testnet.vega.rocks/graphql -p 3000:80 vegaprotocol/trading:testnet
else
    echo "Invalid environment: $env, please choose mainnet or testnet"
    exit 1
fi
