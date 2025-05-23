// Use server directive.
'use server';

/**
 * @fileOverview Provides a Genkit flow for summarizing artwork details.
 *
 * - summarizeArtwork - A function that takes artwork details and returns a concise summary.
 * - SummarizeArtworkInput - The input type for the summarizeArtwork function.
 * - SummarizeArtworkOutput - The return type for the summarizeArtwork function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeArtworkInputSchema = z.object({
  title: z.string().describe('The title of the artwork.'),
  artist: z.string().describe('The artist of the artwork.'),
  description: z.string().describe('A detailed description of the artwork.'),
});
export type SummarizeArtworkInput = z.infer<typeof SummarizeArtworkInputSchema>;

const SummarizeArtworkOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the artwork.'),
});
export type SummarizeArtworkOutput = z.infer<typeof SummarizeArtworkOutputSchema>;

export async function summarizeArtwork(input: SummarizeArtworkInput): Promise<SummarizeArtworkOutput> {
  return summarizeArtworkFlow(input);
}

const summarizeArtworkPrompt = ai.definePrompt({
  name: 'summarizeArtworkPrompt',
  input: {schema: SummarizeArtworkInputSchema},
  output: {schema: SummarizeArtworkOutputSchema},
  prompt: `You are an art expert. Create a concise summary of the artwork provided.

Title: {{{title}}}
Artist: {{{artist}}}
Description: {{{description}}}

Concise Summary:`,
});

const summarizeArtworkFlow = ai.defineFlow(
  {
    name: 'summarizeArtworkFlow',
    inputSchema: SummarizeArtworkInputSchema,
    outputSchema: SummarizeArtworkOutputSchema,
  },
  async input => {
    const {output} = await summarizeArtworkPrompt(input);
    return output!;
  }
);
