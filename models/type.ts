import { Schema, model, Document, models, type Model } from 'mongoose'

export interface IBarometerType extends Document {
  name: string
  description?: string
}

/**
 * Schema for barometer types
 */
const barometerTypeSchema = new Schema<IBarometerType>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
})

const BarometerType: Model<IBarometerType> =
  models?.BarometerType || model<IBarometerType>('BarometerType', barometerTypeSchema)

export default BarometerType