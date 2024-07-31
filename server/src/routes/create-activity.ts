import dayjs from "dayjs";
import { prisma } from "../lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const createTripActivity = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/activities",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          occurse_at: z.coerce.date(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { title, occurse_at } = request.body;

      const trip = await prisma.trip.findUnique({ where: { id: tripId } });

      if (!trip) {
        throw new Error("Trip not found");
      }

      if (dayjs(occurse_at).isBefore(trip.starts_at)) {
        throw new Error("Invalide activity date");
      }
      if (dayjs(occurse_at).isAfter(trip.ends_at)) {
        throw new Error("Invalide activity date");
      }
      const activity = await prisma.activity.create({
        data: {
          tripId: tripId,
          title,
          occurse_at,
        },
      });

      return { activityId: activity.id };
    }
  );
};
