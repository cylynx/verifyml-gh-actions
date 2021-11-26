import type { IProtobuf } from './protobuf.interface';
import type { ModelCard } from './protobuf.type';
import protobuf, { Reader, Root } from 'protobufjs';
import jsonDescriptor from './protobuf.schema.json';

class ProtobufController implements IProtobuf {
  constructor() {}

  public decodeMessage = (fileBuffer: ArrayBuffer) => {
    const uint8Arr = new Uint8Array(fileBuffer);
    const root: Root = protobuf.Root.fromJSON(jsonDescriptor);
    console.log(root);

    const modelDetails = root.lookupType('model_card_toolkit.proto.ModelCard');

    const isInvalid = modelDetails.verify(uint8Arr);
    if (isInvalid) {
      throw isInvalid;
    }

    const reader = new Reader(uint8Arr);

    const message = modelDetails.decode(reader) as unknown as ModelCard;
    return message;
  };

  // private strToArrayBuffer = (str: string): ArrayBuffer => {
  //   let buf = new ArrayBuffer(str.length * 2);
  //   let bufView = new Uint8Array(buf);

  //   for (let i = 0, strLen = str.length; i < strLen; i++) {
  //     bufView[i] = str.charCodeAt(i);
  //   }

  //   return buf;
  // };
}

export default ProtobufController;
