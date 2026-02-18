/**
 * Progressive JSON parser for streaming AI schema output.
 *
 * Extracts partial schema data from an incomplete JSON buffer
 * as tokens stream in from the WebSocket.
 */

export interface ParsedField {
  name: string;
  type?: string;
}

export interface ParsedObject {
  name: string;
  icon?: string;
  description?: string;
  fields: ParsedField[];
  sampleData?: Record<string, unknown>[];
}

export interface PartialSchema {
  templateName?: string;
  category?: string;
  objects: ParsedObject[];
  currentObjectName?: string;
  currentFields: ParsedField[];
}

const EMPTY: PartialSchema = {
  objects: [],
  currentFields: [],
};

/**
 * Parse an incomplete JSON buffer to extract whatever schema data
 * has been written so far.
 */
export function parseStreamingSchema(buffer: string): PartialSchema {
  if (!buffer || buffer.length < 10) return EMPTY;

  // Extract template_name
  const nameMatch = buffer.match(/"template_name"\s*:\s*"([^"]+)"/);
  const templateName = nameMatch?.[1];

  // Extract category
  const categoryMatch = buffer.match(/"category"\s*:\s*"([^"]+)"/);
  const category = categoryMatch?.[1];

  // Find "objects" array start
  const objectsIdx = buffer.indexOf('"objects"');
  if (objectsIdx === -1) return { ...EMPTY, templateName, category };

  const bracketStart = buffer.indexOf("[", objectsIdx);
  if (bracketStart === -1) return { ...EMPTY, templateName, category };

  // Extract complete objects using bracket-depth counting
  const objects: ParsedObject[] = [];
  let depth = 0;
  let objStart = -1;
  let lastObjEnd = bracketStart + 1;

  for (let i = bracketStart + 1; i < buffer.length; i++) {
    const ch = buffer[i];

    // Skip strings to avoid counting braces inside string values
    if (ch === '"') {
      let j = i + 1;
      while (j < buffer.length && buffer[j] !== '"') {
        if (buffer[j] === "\\") j++; // skip escaped chars
        j++;
      }
      i = j; // move past closing quote
      continue;
    }

    // ']' at depth 0 = end of the "objects" array — stop here
    // to avoid leaking into "relations" / "sample_data" sections
    if (ch === "]" && depth === 0) break;

    if (ch === "{") {
      if (depth === 0) objStart = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && objStart >= 0) {
        const block = buffer.slice(objStart, i + 1);
        const parsed = tryParseObject(block);
        if (parsed) objects.push(parsed);
        objStart = -1;
        lastObjEnd = i + 1;
      }
    }
  }

  // Try to extract info from the partial (incomplete) object being written
  let currentObjectName: string | undefined;
  const currentFields: ParsedField[] = [];

  if (depth > 0 && objStart >= 0) {
    const partial = buffer.slice(objStart);
    const partialName = partial.match(/"name"\s*:\s*"([^"]+)"/);
    currentObjectName = partialName?.[1];

    // Extract fields from partial object
    const fieldsIdx = partial.indexOf('"fields"');
    if (fieldsIdx >= 0) {
      const fieldBracket = partial.indexOf("[", fieldsIdx);
      if (fieldBracket >= 0) {
        // Find complete field objects within the partial
        let fd = 0;
        let fs = -1;
        for (let i = fieldBracket + 1; i < partial.length; i++) {
          const ch = partial[i];
          if (ch === '"') {
            let j = i + 1;
            while (j < partial.length && partial[j] !== '"') {
              if (partial[j] === "\\") j++;
              j++;
            }
            i = j;
            continue;
          }
          if (ch === "{") {
            if (fd === 0) fs = i;
            fd++;
          } else if (ch === "}") {
            fd--;
            if (fd === 0 && fs >= 0) {
              const fb = partial.slice(fs, i + 1);
              try {
                const f = JSON.parse(fb);
                if (f.name) {
                  currentFields.push({ name: f.name, type: f.type });
                }
              } catch {
                // incomplete field, try regex
                const fn = fb.match(/"name"\s*:\s*"([^"]+)"/);
                if (fn) currentFields.push({ name: fn[1] });
              }
              fs = -1;
            }
          }
        }
        // Try to get name from an incomplete field block
        if (fd > 0 && fs >= 0) {
          const partialField = partial.slice(fs);
          const fn = partialField.match(/"name"\s*:\s*"([^"]+)"/);
          if (fn) currentFields.push({ name: fn[1] });
        }
      }
    }
  }

  return {
    templateName,
    category,
    objects,
    currentObjectName,
    currentFields,
  };
}

function tryParseObject(block: string): ParsedObject | null {
  try {
    const obj = JSON.parse(block);
    if (!obj.name || !obj.fields) return null;

    const fields: ParsedField[] = (obj.fields || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (f: any) => ({
        name: f.name || f.field_name || "field",
        type: f.type,
      })
    );

    // Extract sample_data for this object if available
    let sampleData: Record<string, unknown>[] | undefined;
    if (obj.sample_data && Array.isArray(obj.sample_data)) {
      sampleData = obj.sample_data;
    }

    return {
      name: obj.name,
      icon: obj.icon,
      description: obj.description,
      fields,
      sampleData,
    };
  } catch {
    return null;
  }
}
