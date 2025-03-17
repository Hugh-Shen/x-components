import { PropType, ExtractPropTypes } from 'vue'

export const iconProps = {
  color: String,
  size: [Number, String] as PropType<number | string>,
} as const


export type IconOptions = ExtractPropTypes<typeof iconProps>
