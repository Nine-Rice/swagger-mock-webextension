import { OpenAPIV3 } from "openapi-types";

const transformSchemaRef = (swagger: OpenAPIV3.Document, ref: string) => {
  const propRoute = ref.slice(2).replace(/\//g, ".");
  const schema = _.get(swagger, propRoute) as OpenAPIV3.SchemaObject;
  switch (schema.type) {
    case "object":
      for (const key in schema.properties) {
        const propItem = schema.properties[key];
        if ("$ref" in propItem) {
          schema.properties[key] = transformSchemaRef(
            swagger,
            propItem["$ref"]
          );
        } else if (propItem.type === "array" && "$ref" in propItem.items) {
          propItem.items = transformSchemaRef(swagger, propItem.items["$ref"]);
        }
      }
      break;
  }
  return schema;
};

export default transformSchemaRef;
