import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import { createtrip } from "./routes/create-trip";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipants } from "./routes/confirm-participant";
import { createTripActivity } from "./routes/create-activity";
import { getActivities } from "./routes/get-activities";
import { createTripLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createtrip);
app.register(confirmTrip);
app.register(confirmParticipants);
app.register(createTripActivity);
app.register(getActivities);
app.register(createTripLink);
app.register(getLinks);

app.get("/teste", () => {
  return "Hello World";
});

app.listen({ port: 3333 }).then(() => {
  console.log("server is running!");
});
