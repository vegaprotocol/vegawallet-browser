/* eslint-disable */
/// Autogenerated by 'scripts/compile-ajv-schema.js' target 'schemas'
const validate = validate14;function validate14(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(data !== null){const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(errors > 0){const emErrs0 = [];for(const err1 of vErrors){if(((((err1.keyword !== "errorMessage") && (!err1.emUsed)) && ((err1.instancePath === instancePath) || ((err1.instancePath.indexOf(instancePath) === 0) && (err1.instancePath[instancePath.length] === "/")))) && (err1.schemaPath.indexOf("#") === 0)) && (err1.schemaPath["#".length] === "/")){emErrs0.push(err1);err1.emUsed = true;}}if(emErrs0.length){const err2 = {instancePath,schemaPath:"#/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"`client.is_connected` does not take any parameters"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}const emErrs1 = [];for(const err3 of vErrors){if(!err3.emUsed){emErrs1.push(err3);}}vErrors = emErrs1;errors = emErrs1.length;}validate14.errors = vErrors;return errors === 0;}

export { validate14 as default, validate };
