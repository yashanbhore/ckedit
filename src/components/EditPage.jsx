// components/EditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { db, serverTimestamp, imageDb } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MyCustomUploadAdapterPlugin from "../utils/MyUploadAdapter";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editorData, setEditorData] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, 'editorData', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEditorData(docSnap.data().content);
      } else {
        console.error("No such document!");
      }
    };

    fetchBlog();
  }, [id]);

  const handleImageUpload = (file) => {
    return new Promise((resolve) => {
      const index = imageFiles.length;
      setImageFiles([...imageFiles, file]);
      setEditorData(editorData.replace(
        `<img src="data:image-placeholder-${index}"`,
        `<img src="data:image-placeholder-${index}"`
      ));
      resolve(`data:image-placeholder-${index}`);
    });
  };

  const handleSubmit = async () => {
    const uploadPromises = imageFiles.map((file, index) => uploadImage(file, index));
    const urls = await Promise.all(uploadPromises);

    let updatedEditorData = editorData;
    urls.forEach((url, index) => {
      updatedEditorData = updatedEditorData.replace(`data:image-placeholder-${index}`, url);
    });

    const docRef = doc(db, 'editorData', id);
    await updateDoc(docRef, {
      content: updatedEditorData,
      timestamp: serverTimestamp(),
    });

    navigate('/blogs');
  };

  const uploadImage = (file, index) => {
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

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Edit Blog</h2>
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onReady={(editor) => {
              console.log("Editor is ready to use!", editor);
              MyCustomUploadAdapterPlugin(editor, handleImageUpload);
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
              setEditorData(data);
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
            <div className="border p-3 bg-light" dangerouslySetInnerHTML={{ __html: editorData }} />
          </div>
          <div className="mt-4 d-flex justify-content-between">
            <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
            <button className="btn btn-secondary" onClick={() => navigate('/blogs')}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
