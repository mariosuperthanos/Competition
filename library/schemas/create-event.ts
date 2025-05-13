import { z } from "zod";
import { timeToMinutes } from "../converters/timeToMinutes";

const timeRegex = /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;

export const formSchema = z
  .object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }),
    date: z
      .date({
        message: "A date is required.",
      })
      .refine((date) => date > new Date(), {
        message: "Date must be in the future.",
      }),
    startHour: z
      .string()
      .refine((value) => timeRegex.test(value), {
        message: "Start hour must be in HH:MM AM/PM format.",
      }),
    finishHour: z
      .string()
      .refine((value) => timeRegex.test(value), {
        message: "Finish hour must be in HH:MM AM/PM format.",
      }),
    country: z.string().min(1, "A country is required"),
    city: z.string().min(1, "A county is required"),
    map: z.boolean().refine((value) => value === true, {
      message: "Map must be true",
    }),
    lat: z.string(),
    lng: z.string(),
    file: z
      .custom<FileList>((v) => v instanceof FileList && v.length > 0, {
        message: "A file is required.",
      })
      .refine((v) => v && v[0]?.size <= 5 * 1024 * 1024, {
        message: "File must be less than 5MB",
      })
      .refine((file) => {
        const allowedExtension = ['jpg', 'png', 'jpeg'];
        const filename = file[0].name?.toLowerCase() || "";
        console.log(file);

        return allowedExtension.some(ext => filename.endsWith(ext))
      }, {
        message: "Only image files are allowed",
      }),
  })
  .refine(
    (data) => {
      const startMinutes = timeToMinutes(data.startHour);
      const finishMinutes = timeToMinutes(data.finishHour);
      return finishMinutes > startMinutes;
    },
    {
      message: "Finish hour must be greater than start hour.",
      path: ["finishHour"],
    }
  );
