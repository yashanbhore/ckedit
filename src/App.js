// App.jsx / App.tsx

import React, { Component } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import MyCustomUploadAdapterPlugin from "./utils/MyUploadAdapter";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorData: "<p>Hello from CKEditor&nbsp;5!</p>",
    };
  }

  render() {
    return (
      <div className="App">
        <h2>Using CKEditor&nbsp;5 build in React</h2>
        <CKEditor
          editor={ClassicEditor}
          data={this.state.editorData}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
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
            console.log({ event, editor, data });
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />
        <div className="editor-output">
          <h3>Generated HTML</h3>
          <div dangerouslySetInnerHTML={{ __html: this.state.editorData }} />
        </div>
      </div>
    );
  }
}

export default App;
