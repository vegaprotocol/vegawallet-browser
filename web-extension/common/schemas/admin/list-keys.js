module.exports = {
  type: "object",
  required: ["wallet", "passphrase"],
  additionalProperties: false,
  errorMessage: "`admin.list_keys` must only be given `wallet`, `passphrase`",
  properties: {
    wallet: {
      type: "string",
    },
    passphrase: {
      type: "string",
    },
  },
};
