import {useCallback} from 'react';
import ReactNativeBlobUtil from 'react-native-blob-util';

export default function useFileDownloader() {
  const downloadFile = useCallback(async fileUrl => {
    try {
      const {fs, config} = ReactNativeBlobUtil;
      const downloads = fs.dirs.DownloadDir;

      // Extract file name
      const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

      const options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${downloads}/${fileName}`,
          title: fileName,
          description: 'Downloading file...',
          mediaScannable: true,
        },
      };

      config(options)
        .fetch('GET', fileUrl)
        .then(res => {
          console.log('File saved to:', res.path());
          alert('Downloaded Successfully!');
        })
        .catch(err => {
          console.log(err);
          alert('Download Failed!');
        });
    } catch (error) {
      console.log('Download error:', error);
      alert('Something went wrong!');
    }
  }, []);

  return {downloadFile};
}
