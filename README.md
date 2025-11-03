# Get top 5 cryptocurrencies
curl "http://localhost:3000/api/v1/cryptocurrencies?limit=5"

# Get Bitcoin details
curl "http://localhost:3000/api/v1/cryptocurrencies/bitcoin"

# Get Ethereum price chart for last 30 days
curl "http://localhost:3000/api/v1/cryptocurrencies/ethereum/chart?days=30"

# Search for 'sol' (Solana)
curl "http://localhost:3000/api/v1/cryptocurrencies/search?q=sol"

# Get trending cryptocurrencies
curl "http://localhost:3000/api/v1/cryptocurrencies/trending"