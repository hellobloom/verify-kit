import {Validation as HashingValidation} from '@bloomprotocol/attestations-lib'

export const isArrayOfNonEmptyStrings = (value: any): boolean => {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  return value.every(HashingValidation.isNotEmptyString)
}

export type Unvalidated<T> = {readonly [key in keyof T]?: any}

export type ValidationSuccessResponse<T> = {
  kind: 'validated'
  data: T
}

export type ValidationInvalidParamResponse = {
  kind: 'invalid_param'
  message: string
}

export type ValidationResponse<T> = ValidationSuccessResponse<T> | ValidationInvalidParamResponse

export type Validator = ((value: any) => boolean) | ((value: any, data: any) => boolean)

export type Validations<T> = {
  [k in keyof T]: Validator | Validator[]
}

export const genValidateFn = <T>(validations: Validations<T>) => (data: Unvalidated<T>): ValidationResponse<T> => {
  try {
    Object.keys(validations).forEach(_fieldName => {
      const fieldName = _fieldName as keyof T
      if (data[fieldName] === undefined) {
        throw new Error(`Missing ${fieldName}`)
      }

      const validator: Validator | Validator[] = validations[fieldName]

      try {
        const outcome = Array.isArray(validator) ? validator.every(fn => fn(data[fieldName], data)) : validator(data[fieldName], data)
        if (!outcome) throw new Error(`Invalid ${fieldName}: ${JSON.stringify(data[fieldName])}`)
      } catch {
        throw new Error(`Invalid ${fieldName}: ${JSON.stringify(data[fieldName])}`)
      }
    })
  } catch (error) {
    return {
      kind: 'invalid_param',
      message: error.message,
    }
  }

  return {
    kind: 'validated',
    data: data as T,
  }
}
