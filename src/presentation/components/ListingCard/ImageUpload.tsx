/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
interface ImageUploadProps {
  setSelectedFiles: (files: File[]) => void;
  selectedFiles: File[];
}

const ImageUpload = ({ setSelectedFiles, selectedFiles }: ImageUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block mb-2"
      />

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {selectedFiles.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
