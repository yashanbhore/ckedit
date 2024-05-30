import { imageDb } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    const randomNo = Math.floor(1000 + Math.random() * 9000);
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const imgRef = ref(imageDb, `traceforceBlogs/${randomNo}.png`);

          // Upload the file to Firebase Storage
          uploadBytes(imgRef, file)
            .then((snapshot) => {
              console.log("Snapshot here", snapshot);
              return getDownloadURL(imgRef);
            })
            .then((url) => {
              console.log("Download URL:", url);
              this.loader.uploaded = true;
              resolve({
                default: url, // URL from Firebase Storage
              });
            })
            .catch((error) => {
              console.error("Error during upload or URL retrieval:", error);
              reject(`Couldn't upload file: ${file.name}. Error: ${error}`);
            });
        })
    );
  }

  abort() {
    return Promise.reject();
  }
}

export default function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}
