import Fastify from 'fastify'
import {GetPage,GetDataComputerUniverse} from './puppeteer.js'
import cluster  from "cluster";
import os from "os"
const numCPUs = os.cpus().length

const fastify = Fastify({
  logger: true,
})


fastify.get('/getDataComponent', async (request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET");

        const url_site = new URL(request.query.url)
        if(url_site.host !== "www.computeruniverse.net") {
            return GetPage(url_site).then(value => value)
        }else {
            const id = url_site.toString().replace(`https://www.computeruniverse.net/ru/p/`, "")
            return GetDataComputerUniverse(id).then(value => value)
        }

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
    // process.env.PORT, '0.0.0.0',
    // process.env.PORT || 5000
  fastify.listen(process.env.PORT || 5000,err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
  })
}
