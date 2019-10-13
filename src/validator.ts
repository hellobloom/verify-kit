import {uniq} from 'ramda'
const logSymbols = require('log-symbols')

export type TUnvalidated<ValidatedSchema> = {readonly [Key in keyof ValidatedSchema]?: any}

export type TReject = (error: string) => void

export interface IInvalidParamError {
  kind: 'invalid_param'
  message: string
}

export const requiredField = <T>(data: T) => (field: keyof T) => {
  if (data[field] === undefined) {
    return false
  }
  return true
}

export interface IValidatorOpts {
  verbose: boolean
}

export const genParamsValidator = <ParamType>(
  validations: Array<[keyof TUnvalidated<ParamType>, (value: any, data?: any, opts?: IValidatorOpts) => boolean, boolean, string]>,
) => {
  return (data: TUnvalidated<ParamType>, opts: IValidatorOpts): data is ParamType => {
    const requiredFields = uniq(validations.map(([first]) => first))

    if (!requiredFields.every(requiredField(data))) return false

    const allValidationsPassed = validations.every(([fieldName, validation, useFullData, message]) => {
      let outcome = useFullData ? validation(data[fieldName], data, opts) : validation(data[fieldName], opts)
      if (outcome) {
        if (opts.verbose) console.log(logSymbols.success, message)
        return true
      }
      if (opts.verbose) console.log(logSymbols.error, message)
      throw new Error(`Invalid ${fieldName}: ${JSON.stringify(data[fieldName])}`)
    })

    return allValidationsPassed
  }
}

export const genParamsDataValidator = <ParamType>(
  validations: Array<[keyof TUnvalidated<ParamType>, (value: any, data?: any) => boolean, boolean, string]>,
) => {
  return (data: TUnvalidated<ParamType>, opts: IValidatorOpts): ParamType => {
    const validateParamsType = genParamsValidator(validations)
    if (!validateParamsType(data, opts)) {
      throw new Error(`Invalid`)
    }
    return data
  }
}

export const genValidateFn = <ParamType>(
  validations: Array<[keyof TUnvalidated<ParamType>, (value: any, data?: any) => boolean, boolean, string]>,
) => {
  return (
    input: TUnvalidated<ParamType>,
    opts: IValidatorOpts = {verbose: false},
  ): IInvalidParamError | {kind: 'validated'; data: ParamType} => {
    try {
      const paramDataValidator = genParamsDataValidator(validations)
      const validated = paramDataValidator(input, opts)
      return {kind: 'validated', data: validated}
    } catch (error) {
      return {kind: 'invalid_param', message: error.message}
    }
  }
}
