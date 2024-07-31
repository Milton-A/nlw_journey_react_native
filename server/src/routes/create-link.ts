import { prisma } from "../lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const createTripLink = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/links",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          url: z.string().url(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { title, url } = request.body;

      const trip = await prisma.trip.findUnique({ where: { id: tripId } });

      if (!trip) {
        throw new Error("Trip not found");
      }

      const link = await prisma.link.create({
        data: {
          tripId: tripId,
          title,
          url,
        },
      });

      return { linkId: link.id };
    }
  );
};
