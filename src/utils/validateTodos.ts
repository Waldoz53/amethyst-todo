import Ajv from "ajv"
import { TodoItem } from "./todoStorage"

const todoItemSchema = {
  type: "object",
  properties: {
    text: { type: 'string', default: "[App updated. This task's data might be corrupted! Delete and readd this task]" },
    completed: { type: 'boolean', default: false },
    createdAt: { type: 'string' },
    dueDate: { type: 'string' }
  },
  required: ['text', 'completed', 'createdAt', 'dueDate'],
  additionalProperties: false
} as const

export const todoListSchema = {
  type: "array",
  items: todoItemSchema
} as const;

const ajv = new Ajv({ useDefaults: true, allErrors: true })
const validate = ajv.compile(todoItemSchema)

export function validateAndFixTodos(data: any): TodoItem[] {
  const now = new Date().toISOString();

  if (!Array.isArray(data)) {
    console.warn("Invalid todos.json format: expected array.");
    return [];
  }

  const result: TodoItem[] = [];

  for (const [i, raw] of data.entries()) {
    const item = { ...raw };
    const valid = validate(item);

    if (!valid) {
      console.warn(`Todo item at index ${i} was invalid:`, validate.errors);
    }

    result.push({
      text: typeof item.text === "string" ? item.text : "[App updated. This task's data might be corrupted! Delete and readd this task]",
      completed: typeof item.completed === "boolean" ? item.completed : false,
      createdAt: typeof item.createdAt === "string" ? item.createdAt : now,
      dueDate: typeof item.dueDate === "string" ? item.dueDate : now
    });
  }

  return result;
}

