function typeOf(value: unknown) {
    return Object.prototype.toString.call(value).split(']')[0].split(' ')[1].toLowerCase()
}

/**
 *
 * @param {unknown} data
 * @return {boolean}
 */
export function isDefined(data: unknown) {
    return data !== undefined && data !== null
}

type Validator = (data: unknown) => boolean;
function makeValidator(type: string): Validator {
    return function validate(data: unknown) {
        return typeOf(data) === type
    }
}

function makeOptionalValidator(type: string): Validator {
    const validate = makeValidator(type)
    return function optionalValidate(data: unknown) {
        if (!isDefined(data)) {
            return true
        }
        return validate(data)
    }
}

export const number: Validator = (data: unknown) => makeValidator('number')(data) && !Number.isNaN(data)
export const optNumber: Validator = (data: unknown) => makeOptionalValidator('number')(data) && !Number.isNaN(data)
export const string: Validator = makeValidator('string')
export const optString: Validator = makeOptionalValidator('string')
export const date: Validator = makeValidator('date')
export const optDate: Validator = makeOptionalValidator('date')
export const bool: Validator = makeValidator('boolean')
export const optBool: Validator = makeOptionalValidator('boolean')
export const object: Validator = makeValidator('object')
export const optObject: Validator = makeOptionalValidator('object')
export const any: Validator = () => true


type ObjectDefinition = {[key: string]: Validator}

export function shape(objDef: ObjectDefinition): Validator {
    return function shapeValidate(obj: any) {
        if (!object(obj)) {
            return false
        }
        const defKeys = Object.keys(objDef)
        return defKeys.every((key) => {
            const validate = objDef[key]
            return validate(obj[key])
        })
    }
}


export function optShape(objDef: ObjectDefinition): Validator {
    const validate = shape(objDef)
    return function shapeOptionalValidate(obj: unknown) {
        if (!isDefined(obj)) {
            return true
        }
        return validate(obj)
    }
}

export function array(validator: Validator = any): Validator {
    return function arrayValidate(arr) {
        if (!Array.isArray(arr)) {
            return false
        }
        if(validator === any){
            return true
        }
        return arr.every((item) => validator(item))
    }
}


export function optArray(validator: Validator = any): Validator {
    const validate = array(validator)
    return function arrayOptionalValidate(arr) {
        if (!isDefined(arr)) {
            return true
        }
        return validate(arr)
    }
}

export function or(...validators: Validator[]): Validator {
    return function orValidator(data: unknown): boolean {
        return validators.some( validate => validate(data) )
    }
}

export function and(...validators: Validator[]): Validator {
    return function orValidator(data: unknown): boolean {
        return validators.every( validate => validate(data) )
    }
}