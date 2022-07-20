import Fastify from 'fastify'
import {GetPage} from './puppeteer.js'
import cluster  from "cluster";
import os from "os"
const numCPUs = os.cpus().length

let price = 0
const fastify = Fastify({
  logger: true,
})





fastify.get('/', async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET");

    console.log("")
    return "gfdgdf"
})

fastify.get('/getDataComponent', async (request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET");
        const url_site = new URL(request.query.url)
        return GetPage(url_site).then(value => value)
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
  fastify.listen(process.env.PORT, '0.0.0.0', err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
  })
}
