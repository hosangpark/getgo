import {launchImageLibrary} from 'react-native-image-picker';
import { FileType } from '../types/componentType';


export const onImagePick = async (
    selectImage: (image: FileType) => void,
    // onMessage: (message: string) => void,
  ) => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      presentationStyle: 'fullScreen',
    });
  
    if (result.didCancel) {
    } else if (result.errorCode) {
    } else {
      const imageFile =
        result.assets && result.assets?.length > 0 ? result.assets[0] : undefined;
      console.log(imageFile);
      if (imageFile) {
        // if (imageFile.fileSize && imageFile.fileSize / 1048576 > 8)
        //   return onMessage('파일크기가 8MB보다 큽니다.');
        selectImage({
          name: imageFile.fileName ?? '',
          uri: imageFile.uri ?? '',
          type: imageFile.type ?? '',
        });
        // onMessage('');
      }
    }
  };