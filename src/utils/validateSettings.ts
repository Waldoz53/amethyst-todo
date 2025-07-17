import Ajv from 'ajv';
import { Settings } from './settingsStorage';

const settingsSchema = {
  type: 'object',
  properties: {
    defaultHours: { type: 'number', default: 1, minimum: 0 },
    autoDeleteTasksOnComplete: { type: 'boolean', default: false },
    autoDeleteTimer: { type: 'number', default: 30, minimum: 0 },
    enablePopupAfterTaskExpiry: { type: 'boolean', default: false },
    autoSync: { type: 'boolean', default: false }
  },
  required: [],
  additionalProperties: false,
} as const;

const ajv = new Ajv({ useDefaults: true, allErrors: true });
const validate = ajv.compile(settingsSchema);

export function validateAndFixSettings(data: unknown): Settings {
  const valid = validate(data);

  if (!valid) {
    console.warn(
      'settings.json was invalid, but fixed with defaults',
      validate.errors
    );
  }

  return data as Settings;
}
