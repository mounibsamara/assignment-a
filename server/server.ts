
// Start a Websocket server.
import { WebSocketServer } from 'ws';


const wss = new WebSocketServer({ port: 3001 }); //creates websocket server

// Function which grabs the gas price and ether price from ether scan
// Returns only the information needed for the socket to send to the frontend
async function fetcher () {
  const gasData = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=WC6N3667D35DQK5V89X96ZXVZJHWNMWDCZ`);
  const resGas = await gasData.json();

  let convertedResGas = parseInt(resGas.result,16);
  convertedResGas = Math.round(convertedResGas/1e9);
  

  const ethData = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=WC6N3667D35DQK5V89X96ZXVZJHWNMWDCZ`);
  const resEth = await ethData.json();
  
  let convertedEthPrice = resEth.result.ethusd;


  return JSON.stringify({resGas:convertedResGas,resEth:parseFloat(convertedEthPrice).toFixed(2)});
}
// Behaviour when a connection occurs
wss.on('connection', async (ws) => {
  console.log('New client connected');
  ws.send(await fetcher()); // Send data on connection as first set of information
  setInterval( async () => {
    ws.send(await fetcher());
  }, 5000)  // Updates said information every 5 seconds to keep it live.
  
  
 


  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
console.log('listening on port 3001...');