import Fastify from 'fastify'
import {GetPage} from './puppeteer.js'
import fastifyCors from "@fastify/cors";

let price = 0
const fastify = Fastify({
    logger: false
});
fastify.register(fastifyCors, {
    origin:false
})
// Declare a route
fastify.get('/', async (request, reply) => {
    const url_site = new URL(request.query.url)
    return GetPage(url_site).then(value => value)
})


// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})