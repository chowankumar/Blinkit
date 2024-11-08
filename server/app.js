import Fastify from "fastify";
import "dotenv/config"
import { connectDB } from "./src/config/connect.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { PORT } from "./src/config/config.js";

const start = async () => {
    await connectDB(process.env.MONGO_URI);
    const app = Fastify();
    await buildAdminRouter(app);
    app.listen({ port: PORT, host: "0.0.0.0" },
        (err, addr) => {
            if (err) {
                console.log(err);
            } else {
                console.log("application start on http://localhost:" + PORT + admin.options.rootPath)
            }
        }

    )
}

start();