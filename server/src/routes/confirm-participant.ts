import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function confirmParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/participants/:participantId/confirm",
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { participantId } = request.params;

      const participant = await prisma.participant.findUnique({
        where: { id: participantId },
      });

      if (!participant) {
        throw new Error("Participant not found");
      }

      if (participant.is_confirmad) {
        return reply.redirect(`http://localhost:3000/trips/${participantId}`);
      }
      await prisma.participant.update({
        where: { id: participantId },
        data: { is_confirmad: true },
      });
      return reply.redirect(
        `http://localhost:3000/trips/${participant.tripId}`
      );
    }
  );
}
