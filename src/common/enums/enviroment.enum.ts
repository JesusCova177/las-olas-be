import { EnviromentParseException } from '../exceptions';

export enum Enviroment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export const parseEnviroment = (env: string): Enviroment => {
  if (env === 'dev' || env === 'development') {
    return Enviroment.DEVELOPMENT;
  } else if (env === 'prod' || env === 'production') {
    return Enviroment.PRODUCTION;
  }
  throw new EnviromentParseException(`Invalid Enviroment String: ${env}`);
};
