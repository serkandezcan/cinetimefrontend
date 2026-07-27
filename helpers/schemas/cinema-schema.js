import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/helpers/messages/validation-messages";

const phoneRegex = /^[0-9+()\s-]{7,20}$/;

const optionalCoordinate = (min, max) =>
  z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(min).max(max).optional()
  );

export const cinemaSchema = z.object({
  name: z
    .string({ required_error: VALIDATION_MESSAGES.cinema.name.required })
    .min(1, VALIDATION_MESSAGES.cinema.name.required),

  city: z
    .string({ required_error: VALIDATION_MESSAGES.cinema.city.required })
    .min(1, VALIDATION_MESSAGES.cinema.city.required),

  district: z
    .string({ required_error: VALIDATION_MESSAGES.cinema.district.required })
    .min(1, VALIDATION_MESSAGES.cinema.district.required),

  address: z
    .string({ required_error: VALIDATION_MESSAGES.cinema.address.required })
    .min(1, VALIDATION_MESSAGES.cinema.address.required),

  phone: z
    .string({ required_error: VALIDATION_MESSAGES.cinema.phone.required })
    .min(1, VALIDATION_MESSAGES.cinema.phone.required)
    .regex(phoneRegex, VALIDATION_MESSAGES.cinema.phone.invalid),

  latitude: optionalCoordinate(-90, 90),
  longitude: optionalCoordinate(-180, 180),
});

export default cinemaSchema;
