module.exports = {
  type: "object",
  required: ["name", "api", "apps"],
  additionalProperties: false,
  errorMessage:
    "`admin.update_network` must only be given `name`, `metadata`, `api`, `apps`",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      errorMessage: "`name` must be given",
    },
    metadata: {
      type: "array",
      items: {
        type: "object",
        required: ["key", "value"],
        additionalProperties: false,
        properties: {
          key: { type: "string" },
          value: { type: "string" },
        },
      },
    },
    api: {
      type: "object",
      // TODO: closely specify the types here
    },
    apps: {
      type: "object",
      // TODO: closely specify the types here
    },
  },
};
