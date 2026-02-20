import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

function ExpenseUploader({ onFileUpload }) {
  return (
    <FileUploaderRegular
      pubkey="75ab016016c73a80f5d2"
      multiple={false}
      onFileUploadSuccess={(fileInfo) => {
        if (fileInfo?.cdnUrl) {
          console.log("Upload Success:", fileInfo.cdnUrl);
          onFileUpload(fileInfo.cdnUrl);
        }
      }}
    />
  );
}

export default ExpenseUploader;