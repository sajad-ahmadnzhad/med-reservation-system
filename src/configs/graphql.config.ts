import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import {ApolloServerPluginLandingPageLocalDefault} from '@apollo/server/plugin/landingPage/default'

export default (): ApolloDriverConfig => {
  return {
    driver: ApolloDriver,
    playground: false,
    autoSchemaFile: "src/schema.gql",
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  };
};
