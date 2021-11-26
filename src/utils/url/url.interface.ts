export interface IURLUtil {
  isGithubProto: (protobufUrl: string) => boolean;
  transformToJsDelivr: (githubUrl: string) => string;
}
