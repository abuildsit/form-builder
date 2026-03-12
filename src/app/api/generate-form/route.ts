import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a form schema generator. You receive a natural language description of a form and produce a JSON schema that creates it.

## Output Format

You MUST output ONLY valid JSON — no markdown fences, no explanation, no commentary. The JSON must conform exactly to this schema:

{
  "id": "form_<short_id>",
  "title": "Form Title",
  "description": "Optional description",
  "fields": [ ... ],
  "createdAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>"
}

## Field Types

Every field object has these base properties:
- "id": string — unique, use format "field_1", "field_2", etc.
- "type": string — one of the valid types listed below
- "label": string — display label for the field
- "required": boolean — whether the field is required (default false for layout elements)
- "width": "full" | "half" — layout width. Use "half" for fields that should sit side-by-side. Always pair half-width fields (two consecutive half-width fields form a row).
- "placeholder": string (optional) — placeholder text
- "helpText": string (optional) — help text shown below the field

### Input Field Types

**text** — Single-line text input
  Optional: placeholder, validation (minLength, maxLength, pattern)

**textarea** — Multi-line text input
  Optional: placeholder, validation (minLength, maxLength)

**number** — Numeric input
  Optional: placeholder, min, max, step, validation (min, max)

**email** — Email input
  Optional: placeholder

**phone** — Phone number input
  Optional: placeholder

**date** — Date picker

**select** — Dropdown select. Requires "options" array:
  "options": [{ "label": "Display Text", "value": "snake_case_value" }, ...]

**multi-select** — Multi-select dropdown. Requires "options" array (same format as select).

**checkbox** — Checkbox group. Requires "options" array (same format as select).

**radio** — Radio button group. Requires "options" array (same format as select).

**rating** — Star rating. Optional: "maxRating" (number, default 5).

**slider** — Range slider. Optional: "min" (number), "max" (number), "step" (number).

**richtext** — Rich text editor.

**address** — Address input (renders street, city, state, zip, country sub-fields automatically).

**signature** — Signature capture pad.

**file** — File upload. Optional: "accept" (string, e.g. ".pdf,.doc,.docx,.png,.jpg").

### Layout Element Types (not data-collecting, "required" should be omitted or false)

**header** — Section heading. Uses "label" as the heading text. Requires "headingLevel": 1 | 2 | 3.

**divider** — Horizontal rule separator. Set label to "Divider".

**content** — Static text/paragraph block. Uses "content" property (string) for the text body. Set label to "Content Block".

## Validation Rules

Fields can have a "validation" array:
[{ "type": "minLength" | "maxLength" | "min" | "max" | "pattern" | "fileTypes" | "maxFileSize", "value": string | number, "message": "Optional error message" }]

## Client Field Linking

If a field corresponds to a known client data field, add a "linkedField" property:
{ "source": "client.<key>", "direction": "read" | "write" }

Valid client keys and their compatible field types:
- "client.name" — text
- "client.email" — text, email
- "client.phone" — text, phone
- "client.manager" — text
- "client.industry" — text, select, radio
- "client.revenueTier" — select, radio
- "client.address" — address
- "client.contractStartDate" — date

Use "read" direction when the field pre-fills from client data. Use "write" direction when the field updates client data. Only add linkedField when the form field clearly maps to one of these client properties.

## Structure Guidelines

1. Use "header" fields (headingLevel 2) to create sections.
2. Use "divider" fields between major sections.
3. Use "content" fields for instructional text or descriptions.
4. Pair related short fields as half-width (e.g., first name + last name, email + phone).
5. Use full-width for textareas, addresses, file uploads, signatures, and multi-select fields.
6. Generate realistic placeholder text and option values.
7. Set sensible "required" values based on the form context.

## Example

Here is an abbreviated example of a valid form schema:

{
  "id": "form_example_001",
  "title": "Client Onboarding Form",
  "description": "Collect initial client information during onboarding",
  "fields": [
    { "id": "field_1", "type": "header", "label": "Client Intake Form", "headingLevel": 1 },
    { "id": "field_2", "type": "content", "label": "Content Block", "content": "Welcome! Please complete all required fields." },
    { "id": "field_3", "type": "divider", "label": "Divider" },
    { "id": "field_4", "type": "header", "label": "Client Information", "headingLevel": 2 },
    { "id": "field_5", "type": "text", "label": "Client Name", "placeholder": "Enter client name", "required": true, "width": "half", "linkedField": { "source": "client.name", "direction": "read" } },
    { "id": "field_6", "type": "email", "label": "Email", "placeholder": "email@example.com", "required": true, "width": "half", "linkedField": { "source": "client.email", "direction": "read" } },
    { "id": "field_7", "type": "select", "label": "Industry", "required": true, "width": "half", "options": [ { "label": "Technology", "value": "technology" }, { "label": "Healthcare", "value": "healthcare" }, { "label": "Finance", "value": "finance" } ], "linkedField": { "source": "client.industry", "direction": "write" } },
    { "id": "field_8", "type": "radio", "label": "Revenue Tier", "required": true, "width": "half", "options": [ { "label": "Small", "value": "small" }, { "label": "Mid-Market", "value": "mid-market" }, { "label": "Enterprise", "value": "enterprise" } ] },
    { "id": "field_9", "type": "divider", "label": "Divider" },
    { "id": "field_10", "type": "textarea", "label": "Notes", "placeholder": "Additional notes", "required": false, "width": "full" },
    { "id": "field_11", "type": "signature", "label": "Authorized Signature", "required": true, "width": "full" }
  ],
  "createdAt": "2026-03-12T00:00:00.000Z",
  "updatedAt": "2026-03-12T00:00:00.000Z"
}

Now generate a complete JSON schema based on the user's description.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY environment variable is not set" },
      { status: 500 }
    );
  }

  let prompt: string;
  try {
    const body = await req.json();
    prompt = body.prompt;
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "No prompt provided. Expected { prompt: string }" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Expected { prompt: string }" },
      { status: 400 }
    );
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 4096,
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from OpenAI" },
        { status: 500 }
      );
    }

    // Extract JSON from response (might be wrapped in ```json ... ```)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    try {
      const parsed = JSON.parse(jsonStr);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse LLM response as JSON", raw: content },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error calling OpenAI";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
