import { z } from 'zod';

export const paidMoiSchema = z.object({
  beneficiaryName: z.string().min(1, 'Beneficiary name is required'),
  amount: z.string().min(1, 'Amount is required').transform(Number),
  date: z.string().min(1, 'Date is required'),
  eventType: z.string().min(1, 'Event type is required'),
  area: z.string().min(1, 'Area is required'),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  remarks: z.string().optional()
});

export const receivedMoiSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  amount: z.string().min(1, 'Amount is required').transform(Number),
  date: z.string().min(1, 'Date is required'),
  eventType: z.string().min(1, 'Event type is required'),
  area: z.string().min(1, 'Area is required'),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits')
});

export const createEventSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventType: z.string().min(1, 'Event type is required'),
  area: z.string().min(1, 'Area is required'),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  formFields: z.array(z.string())
});

export type PaidMoiFormData = z.infer<typeof paidMoiSchema>;
export type ReceivedMoiFormData = z.infer<typeof receivedMoiSchema>;
export type CreateEventFormData = z.infer<typeof createEventSchema>;