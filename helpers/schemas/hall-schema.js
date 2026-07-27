import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/helpers/messages/validation-messages";

export const HALL_TYPE_OPTIONS = [
  { value: "STANDARD", label: "Standart" },
  { value: "IMAX", label: "IMAX" },
  { value: "VIP", label: "VIP" },
];

const hallTypeValues = HALL_TYPE_OPTIONS.map((option) => option.value);

const positiveIntegerString = (message) => z.string().regex(/^[1-9]\d*$/, message);

export const hallSchema = z.object({
  cinemaId: z
    .string({ required_error: VALIDATION_MESSAGES.hall.cinemaId.required })
    .min(1, VALIDATION_MESSAGES.hall.cinemaId.required),

  name: z
    .string({ required_error: VALIDATION_MESSAGES.hall.name.required })
    .min(1, VALIDATION_MESSAGES.hall.name.required),

  hallType: z.enum(hallTypeValues, {
    required_error: VALIDATION_MESSAGES.hall.hallType.required,
    invalid_type_error: VALIDATION_MESSAGES.hall.hallType.required,
  }),

  rows: positiveIntegerString(VALIDATION_MESSAGES.hall.rows.invalid),
  seatsPerRow: positiveIntegerString(VALIDATION_MESSAGES.hall.seatsPerRow.invalid),
});

export default hallSchema;
