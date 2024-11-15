import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

export default (): ApolloDriverConfig => {
  return {
    driver: ApolloDriver,
    playground: true,
    autoSchemaFile: "src/schema.gql",
  };
};
