/* eslint-disable */
/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
"use strict";export const validate = validate14;export default validate14;const schema16 = {"type":"object","additionalProperties":false,"required":["wallet"],"properties":{"wallet":{"type":"string"},"name":{"type":"string"},"metadata":{"type":"object"},"options":{"type":"object","additionalProperties":false,"properties":{}}}};function validate14(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data && typeof data == "object" && !Array.isArray(data)){if(data.wallet === undefined){const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "wallet"},message:"must have required property '"+"wallet"+"'"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}for(const key0 in data){if(!((((key0 === "wallet") || (key0 === "name")) || (key0 === "metadata")) || (key0 === "options"))){const err1 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}}if(data.wallet !== undefined){if(typeof data.wallet !== "string"){const err2 = {instancePath:instancePath+"/wallet",schemaPath:"#/properties/wallet/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}}if(data.name !== undefined){if(typeof data.name !== "string"){const err3 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}}if(data.metadata !== undefined){let data2 = data.metadata;if(!(data2 && typeof data2 == "object" && !Array.isArray(data2))){const err4 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}if(data.options !== undefined){let data3 = data.options;if(data3 && typeof data3 == "object" && !Array.isArray(data3)){for(const key1 in data3){const err5 = {instancePath:instancePath+"/options",schemaPath:"#/properties/options/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}}else {const err6 = {instancePath:instancePath+"/options",schemaPath:"#/properties/options/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}}}else {const err7 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}validate14.errors = vErrors;return errors === 0;}
