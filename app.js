import Fastify from 'fastify'
import {GetPage} from './puppeteer.js'
import cluster  from "cluster";
import os from "os"
const port = process.env.PORT || 8080
const numCPUs = os.cpus().length

let price = 0
const fastify = Fastify({
    logger: false
});

// Declare a route






fastify.get('/cluster', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET");

    console.log(numCPUs)
    return numCPUs
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
    fastify.get('/getDataComponent', async (request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET");
        const url_site = new URL(request.query.url)
        return GetPage(url_site).then(value => value)
    })
    fastify.listen({
        port,
        maxRequestsPerSocket: 199
    }, () => {
        console.log(`Fastify "start" listening on port ${port}, PID: ${process.pid}`);
    });
}