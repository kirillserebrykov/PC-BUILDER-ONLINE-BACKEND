import Fastify from 'fastify'
import {GetPage} from './puppeteer.js'
import cluster  from "cluster";
import os from "os"
const port = process.env.PORT || 3000 
const host = process.env.PORT || '0.0.0.0'
const numCPUs = os.cpus().length

let price = 0
const fastify = Fastify({
  logger: true,
})
// Declare a route

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: port })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()



/*

fastify.get('/', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET");

    console.log("")
    return "gfdgdf"
})

fastify.get('/getDataComponent', async (request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET");
       // const url_site = new URL(request.query.url)
       //return GetPage(url_site).then(value => value)
    })


if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', worker => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    
    fastify.listen({
        port,
		host,
        maxRequestsPerSocket: 199
    }, () => {
        console.log(`Fastify "start" listening on port ${port}, PID: ${process.pid}`);
    });
}
*/
