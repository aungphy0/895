import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
//   const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    // const fileList = event.target.files;
    // const filesArray = Array.from(fileList);
    // setSelectedFiles(filesArray);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('images', file);
    }

    try {
      await axios.post('http://localhost:5000/upload_images', formData);
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images.');
    }
  };

//   const handleFetchImages = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/images');
//       setImages(response.data);
//     } catch (error) {
//       console.error('Error fetching images:', error);
//     }
//   };

  return (
    <div>
      <label htmlFor="folderInput">Select a data folder</label>
      <input
              className="input_data"
              type="file"
            //   id="folderInput"
            //   directory=""
            //   webkitdirectory=""
              multiple
              onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload Images</button>
      {/* <button onClick={handleFetchImages}>Fetch Images</button> */}
      {/* <div>
        {images.map((image, index) => (
          <img key={index} src={`http://localhost:5000/${image}`} alt={`Image ${index}`} width="200" />
        ))}
      </div> */}
    </div>
  );
};

export default ImageUpload;