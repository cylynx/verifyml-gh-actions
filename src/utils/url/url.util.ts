import { URL } from 'url';
import { IURLUtil } from './url.interface';

class URLUtil implements IURLUtil {
  public constructor() {}

  public isGithubProto = (protobufUrl: string) => {
    const url = new URL(protobufUrl);

    const { hostname } = url;
    const fileName = protobufUrl.split('/').pop() as string;
    const [, extension] = fileName.split('.');

    if (hostname !== 'github.com' || extension !== 'proto') {
      return false;
    }

    return true;
  };

  public transformToJsDelivr = (githubUrl: string) => {
    const url = new URL(githubUrl);
    const { pathname } = url;

    const [, username, repository, , branch, ...directory] =
      pathname.split('/');
    const fullPath = directory.join('/');

    const jsDelivrUrl: string = `https://cdn.jsdelivr.net/gh/${username}/${repository}@${branch}/${fullPath}`;
    return jsDelivrUrl;
  };
}

export default URLUtil;
