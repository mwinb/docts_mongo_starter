import { Document, SchemaDefinition } from 'mongoose';

export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export const BaseSchemaDefinition: SchemaDefinition = {
  updatedAt: {
    type: Date
  },
  createdAt: {
    type: Date
  }
};
