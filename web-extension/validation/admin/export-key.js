/* eslint-disable */
/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
const validate = validate14;function validate14(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.passphrase === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "passphrase"},message:"must have required property '"+"passphrase"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(data.publicKey === undefined){const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "publicKey"},message:"must have required property '"+"publicKey"+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}for(const key0 in data){if(!((key0 === "passphrase") || (key0 === "publicKey"))){const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.passphrase !== undefined){if(typeof data.passphrase !== "string"){const err3 = {instancePath:instancePath+"/passphrase",schemaPath:"#/properties/passphrase/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.publicKey !== undefined){if(typeof data.publicKey !== "string"){const err4 = {instancePath:instancePath+"/publicKey",schemaPath:"#/properties/publicKey/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}}else {const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}validate14.errors = vErrors;return errors === 0;}

export { validate14 as default, validate };
