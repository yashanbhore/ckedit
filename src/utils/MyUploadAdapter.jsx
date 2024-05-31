// utils/MyUploadAdapter.js
class MyUploadAdapter {
  constructor(loader, handleImageUpload) {
    this.loader = loader;
    this.handleImageUpload = handleImageUpload; 
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve) => {
          this.handleImageUpload(file).then((url) => {
            resolve({
              default: url, 
            });
          });
        })
    );
  }

  abort() {
    return Promise.reject();
  }
}

export default function MyCustomUploadAdapterPlugin(editor, handleImageUpload) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader, handleImageUpload);
  };
}
