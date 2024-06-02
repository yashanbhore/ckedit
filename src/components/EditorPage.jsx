// components/EditorPage.jsx
import React, { Component } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import MyCustomUploadAdapterPlugin from "../utils/MyUploadAdapter";
import { db, serverTimestamp, imageDb } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

class EditorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorData: "<p>Hello from CKEditor&nbsp;5!</p>",
      imageFiles: [],
    };
  }

  saveDataToFirestore = async (data) => {
    try {
      await addDoc(collection(db, 'editorData'), {
        content: data,
        timestamp: serverTimestamp(),
      });
      console.log("Data successfully written to Firestore!");
    } catch (error) {
      console.error("Error writing document to Firestore: ", error);
    }
  };

  handleSubmit = async () => {
    const { editorData, imageFiles } = this.state;

    try {
      const uploadPromises = imageFiles.map((file, index) => this.uploadImage(file, index));
      const urls = await Promise.all(uploadPromises);

      let updatedEditorData = editorData;
      urls.forEach((url, index) => {
        updatedEditorData = updatedEditorData.replace(`data:image-placeholder-${index}`, url);
      });

      this.setState({ editorData: updatedEditorData }, async () => {
        await this.saveDataToFirestore(this.state.editorData);
      });
    } catch (error) {
      console.error("Error during image upload or saving data:", error);
    }
  };

  uploadImage = (file, index) => {
    const randomNo = Math.floor(1000 + Math.random() * 9000);
    const imgRef = ref(imageDb, `traceforceBlogs/${randomNo}.png`);

    return uploadBytes(imgRef, file)
      .then(() => getDownloadURL(imgRef))
      .then((url) => {
        console.log("Download URL:", url);
        return url;
      })
      .catch((error) => {
        console.error("Error during upload or URL retrieval:", error);
        throw new Error(`Couldn't upload file: ${file.name}. Error: ${error}`);
      });
  };

  handleImageUpload = (file) => {
    return new Promise((resolve) => {
      const { imageFiles } = this.state;
      const index = imageFiles.length;
      this.setState({
        imageFiles: [...imageFiles, file],
        editorData: this.state.editorData.replace(
          `<img src="data:image-placeholder-${index}"`,
          `<img src="data:image-placeholder-${index}"`
        ),
      }, () => resolve(`data:image-placeholder-${index}`));
    });
  };

  render() {
    return (
      <div className="container my-5">
        <div className="card shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">Using CKEditor 5 build in React</h2>
            <CKEditor
              editor={ClassicEditor}
              data={this.state.editorData}
              onReady={(editor) => {
                console.log("Editor is ready to use!", editor);
                MyCustomUploadAdapterPlugin(editor, this.handleImageUpload);
              }}
              config={{
                extraPlugins: [MyCustomUploadAdapterPlugin],
                image: {
                  toolbar: [
                    "imageStyle:alignLeft",
                    "imageStyle:full",
                    "imageStyle:alignRight",
                    "|",
                    "imageResize",
                    "|",
                    "imageTextAlternative",
                  ],
                  styles: ["full", "alignLeft", "alignRight"],
                },
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                this.setState({ editorData: data });
                console.log("Editor data changed:", data);
              }}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
            <div className="editor-output mt-4">
              <h3>Generated HTML</h3>
              <div className="border p-3 bg-light" dangerouslySetInnerHTML={{ __html: this.state.editorData }} />
            </div>
            <button className="btn btn-primary mt-4" onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    );
  }
}

export default EditorPage;
