import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

export const pickImages = async () => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 0, // 0 = unlimited multi selection
      includeBase64: false,
    });

    if (result.didCancel) return [];
    if (!result.assets || result.assets.length === 0) return [];

    return result.assets.map(asset => ({
      uri: asset.uri,
      name: asset.fileName,
      type: asset.type,
    }));
  } catch (error) {
    console.log('Multi Image Picker Error:', error);
    return [];
  }
};

export const pickDocuments = async () => {
  try {
    const results = await DocumentPicker.pick({
      type: [
        DocumentPicker.types.pdf,
        DocumentPicker.types.doc,
        DocumentPicker.types.docx,
        DocumentPicker.types.images,
      ],
      allowMultiSelection: true, // latest versions me ye kaam karta hai
    });

    return results.map(file => ({
      uri: file.fileCopyUri || file.uri,
      name: file.name,
      type: file.type,
    }));
  } catch (err) {
    if (DocumentPicker.isCancel(err)) return [];
    console.log('Multi Document Picker Error:', err);
    return [];
  }
};
