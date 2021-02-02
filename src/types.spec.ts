import mocha from 'mocha'
import assert from 'assert'
import * as types from './types'

const { describe, it } = mocha

describe('checkType', () => {
    describe('string', () => {

        interface TestCase {
            desc: string,
            expectedValidity: boolean,
            data: unknown,
            validator: (data: unknown) => boolean,
        }

        const featureTests: TestCase[] = [
            {
                desc: 'a number validates as number',
                expectedValidity: true,
                data: 1,
                validator: types.number,
            },
            {
                desc: 'a string does not validates as number',
                expectedValidity: false,
                data: '1',
                validator: types.number,
            },
            {
                desc: 'shape validation',
                expectedValidity: true,
                data: { a: 1 },
                validator: types.shape({ a: types.number }),
            },
            {
                desc: 'array validation simple',
                expectedValidity: true,
                data: [1, 2, 3],
                validator: types.array(types.number),
            },
            {
                desc: 'array validation shape',
                expectedValidity: true,
                data: [{ a: 1 }, { a: 2 }, { a: 3 }],
                validator: types.array(types.shape({ a: types.number })),
            },
            {
                desc: 'array in shape',
                expectedValidity: true,
                data: { a: [1, 2, 3, 4] },
                validator: types.shape({ a: types.array(types.number) }),
            },
            {
                desc:'number or string',
                expectedValidity: true,
                data: 'this is a string',
                validator: types.or(types.number,types.string)
            },
            {
                desc:'number or string',
                expectedValidity: true,
                data: 1,
                validator: types.or(types.number,types.string)
            },
            {
                desc:'number or string',
                expectedValidity: false,
                data: new Date(),
                validator: types.or(types.number,types.string)
            },
            {
                desc:'number or string array',
                expectedValidity: true,
                data: [1,2,"3",4,"five"],
                validator: types.array(types.or(types.number,types.string)),
            },
        ]

  
        function testFeature(tc: TestCase) {
            it(tc.desc, () => {
                const isValid = tc.validator(tc.data)
                assert.strictEqual(isValid, tc.expectedValidity)
            })
        }

        featureTests.forEach(testFeature)
    })
})
