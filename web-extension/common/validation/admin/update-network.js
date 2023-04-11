/// Autogenerated by `make` target `schemas`
'use strict'; export const validate = validate14; export default validate14; const schema16 = { type: 'object', required: ['name', 'api', 'apps'], additionalProperties: false, errorMessage: '`admin.update_network` must only be given `name`, `metadata`, `api`, `apps`', properties: { name: { type: 'string', minLength: 1, errorMessage: '`name` must be given' }, metadata: { type: 'array', items: { type: 'object', required: ['key', 'value'], additionalProperties: false, properties: { key: { type: 'string' }, value: { type: 'string' } } } }, api: { type: 'object' }, apps: { type: 'object' } } }; const func2 = require('ajv/dist/runtime/ucs2length').default; function validate14 (data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) { let vErrors = null; let errors = 0; if (data && typeof data === 'object' && !Array.isArray(data)) { if (data.name === undefined) { const err0 = { instancePath, schemaPath: '#/required', keyword: 'required', params: { missingProperty: 'name' }, message: "must have required property '" + 'name' + "'" }; if (vErrors === null) { vErrors = [err0] } else { vErrors.push(err0) }errors++ } if (data.api === undefined) { const err1 = { instancePath, schemaPath: '#/required', keyword: 'required', params: { missingProperty: 'api' }, message: "must have required property '" + 'api' + "'" }; if (vErrors === null) { vErrors = [err1] } else { vErrors.push(err1) }errors++ } if (data.apps === undefined) { const err2 = { instancePath, schemaPath: '#/required', keyword: 'required', params: { missingProperty: 'apps' }, message: "must have required property '" + 'apps' + "'" }; if (vErrors === null) { vErrors = [err2] } else { vErrors.push(err2) }errors++ } for (const key0 in data) { if (!((((key0 === 'name') || (key0 === 'metadata')) || (key0 === 'api')) || (key0 === 'apps'))) { const err3 = { instancePath, schemaPath: '#/additionalProperties', keyword: 'additionalProperties', params: { additionalProperty: key0 }, message: 'must NOT have additional properties' }; if (vErrors === null) { vErrors = [err3] } else { vErrors.push(err3) }errors++ } } if (data.name !== undefined) { const data0 = data.name; if (typeof data0 === 'string') { if (func2(data0) < 1) { const err4 = { instancePath: instancePath + '/name', schemaPath: '#/properties/name/minLength', keyword: 'minLength', params: { limit: 1 }, message: 'must NOT have fewer than 1 characters' }; if (vErrors === null) { vErrors = [err4] } else { vErrors.push(err4) }errors++ } } else { const err5 = { instancePath: instancePath + '/name', schemaPath: '#/properties/name/type', keyword: 'type', params: { type: 'string' }, message: 'must be string' }; if (vErrors === null) { vErrors = [err5] } else { vErrors.push(err5) }errors++ } if (errors > 0) { const emErrs0 = []; for (const err6 of vErrors) { if (((((err6.keyword !== 'errorMessage') && (!err6.emUsed)) && ((err6.instancePath === instancePath + '/name') || ((err6.instancePath.indexOf(instancePath + '/name') === 0) && (err6.instancePath[instancePath + '/name'.length] === '/')))) && (err6.schemaPath.indexOf('#/properties/name') === 0)) && (err6.schemaPath['#/properties/name'.length] === '/')) { emErrs0.push(err6); err6.emUsed = true } } if (emErrs0.length) { const err7 = { instancePath: instancePath + '/name', schemaPath: '#/properties/name/errorMessage', keyword: 'errorMessage', params: { errors: emErrs0 }, message: '`name` must be given' }; if (vErrors === null) { vErrors = [err7] } else { vErrors.push(err7) }errors++ } const emErrs1 = []; for (const err8 of vErrors) { if (!err8.emUsed) { emErrs1.push(err8) } }vErrors = emErrs1; errors = emErrs1.length } } if (data.metadata !== undefined) { const data1 = data.metadata; if (Array.isArray(data1)) { const len0 = data1.length; for (let i0 = 0; i0 < len0; i0++) { const data2 = data1[i0]; if (data2 && typeof data2 === 'object' && !Array.isArray(data2)) { if (data2.key === undefined) { const err9 = { instancePath: instancePath + '/metadata/' + i0, schemaPath: '#/properties/metadata/items/required', keyword: 'required', params: { missingProperty: 'key' }, message: "must have required property '" + 'key' + "'" }; if (vErrors === null) { vErrors = [err9] } else { vErrors.push(err9) }errors++ } if (data2.value === undefined) { const err10 = { instancePath: instancePath + '/metadata/' + i0, schemaPath: '#/properties/metadata/items/required', keyword: 'required', params: { missingProperty: 'value' }, message: "must have required property '" + 'value' + "'" }; if (vErrors === null) { vErrors = [err10] } else { vErrors.push(err10) }errors++ } for (const key1 in data2) { if (!((key1 === 'key') || (key1 === 'value'))) { const err11 = { instancePath: instancePath + '/metadata/' + i0, schemaPath: '#/properties/metadata/items/additionalProperties', keyword: 'additionalProperties', params: { additionalProperty: key1 }, message: 'must NOT have additional properties' }; if (vErrors === null) { vErrors = [err11] } else { vErrors.push(err11) }errors++ } } if (data2.key !== undefined) { if (typeof data2.key !== 'string') { const err12 = { instancePath: instancePath + '/metadata/' + i0 + '/key', schemaPath: '#/properties/metadata/items/properties/key/type', keyword: 'type', params: { type: 'string' }, message: 'must be string' }; if (vErrors === null) { vErrors = [err12] } else { vErrors.push(err12) }errors++ } } if (data2.value !== undefined) { if (typeof data2.value !== 'string') { const err13 = { instancePath: instancePath + '/metadata/' + i0 + '/value', schemaPath: '#/properties/metadata/items/properties/value/type', keyword: 'type', params: { type: 'string' }, message: 'must be string' }; if (vErrors === null) { vErrors = [err13] } else { vErrors.push(err13) }errors++ } } } else { const err14 = { instancePath: instancePath + '/metadata/' + i0, schemaPath: '#/properties/metadata/items/type', keyword: 'type', params: { type: 'object' }, message: 'must be object' }; if (vErrors === null) { vErrors = [err14] } else { vErrors.push(err14) }errors++ } } } else { const err15 = { instancePath: instancePath + '/metadata', schemaPath: '#/properties/metadata/type', keyword: 'type', params: { type: 'array' }, message: 'must be array' }; if (vErrors === null) { vErrors = [err15] } else { vErrors.push(err15) }errors++ } } if (data.api !== undefined) { const data5 = data.api; if (!(data5 && typeof data5 === 'object' && !Array.isArray(data5))) { const err16 = { instancePath: instancePath + '/api', schemaPath: '#/properties/api/type', keyword: 'type', params: { type: 'object' }, message: 'must be object' }; if (vErrors === null) { vErrors = [err16] } else { vErrors.push(err16) }errors++ } } if (data.apps !== undefined) { const data6 = data.apps; if (!(data6 && typeof data6 === 'object' && !Array.isArray(data6))) { const err17 = { instancePath: instancePath + '/apps', schemaPath: '#/properties/apps/type', keyword: 'type', params: { type: 'object' }, message: 'must be object' }; if (vErrors === null) { vErrors = [err17] } else { vErrors.push(err17) }errors++ } } } else { const err18 = { instancePath, schemaPath: '#/type', keyword: 'type', params: { type: 'object' }, message: 'must be object' }; if (vErrors === null) { vErrors = [err18] } else { vErrors.push(err18) }errors++ } if (errors > 0) { const emErrs2 = []; for (const err19 of vErrors) { if (((((err19.keyword !== 'errorMessage') && (!err19.emUsed)) && ((err19.instancePath === instancePath) || ((err19.instancePath.indexOf(instancePath) === 0) && (err19.instancePath[instancePath.length] === '/')))) && (err19.schemaPath.indexOf('#') === 0)) && (err19.schemaPath['#'.length] === '/')) { emErrs2.push(err19); err19.emUsed = true } } if (emErrs2.length) { const err20 = { instancePath, schemaPath: '#/errorMessage', keyword: 'errorMessage', params: { errors: emErrs2 }, message: '`admin.update_network` must only be given `name`, `metadata`, `api`, `apps`' }; if (vErrors === null) { vErrors = [err20] } else { vErrors.push(err20) }errors++ } const emErrs3 = []; for (const err21 of vErrors) { if (!err21.emUsed) { emErrs3.push(err21) } }vErrors = emErrs3; errors = emErrs3.length }validate14.errors = vErrors; return errors === 0 }
