/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPLOAD_IMAGES } from '@/application/graphql/queries';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
}

const ImageUpload = ({ onUpload }: ImageUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadImages, { loading }] = useMutation(UPLOAD_IMAGES);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));

    try {
      const { data } = await uploadImages({
        variables: { files: selectedFiles },
      });

      if (data?.uploadImages) {
        onUpload(data.uploadImages);
      }
    } catch (err) {
      console.error('Error uploading images:', err);
    }
  };


  return (
    <div className="mb-4">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block mb-2"
      />
      <button
        type="button"
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Uploading..." : "Upload Images"}
      </button>

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
