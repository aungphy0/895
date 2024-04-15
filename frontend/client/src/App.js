import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ParallelCoordinatesPlot from './components/ParallelCoordinatesPlot';
import ParallelCoordinatesWide from './components/ParallelCoordinatesWide';
// import { data } from './data';
import { useState, useEffect } from 'react';
import axios from 'axios';
// import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
// import FileInput from 'react-file-reader-input';
// import theimg from 'https://github.com/aungphy0/895/blob/main/backend/dataset/n01496331_21079.jpeg';

function App() {

  const [ selectedModel, setSelectedModel ] = useState("");
  const [ pdata, setPData ] = useState([]);
  
  const [ img, setImg ] = useState('./default-placeholder.png');

  // const [ selectedRunModel, setSelectedRunModel ] = useState("");

  // useEffect(() => {
  //   const runData = async () => {
  //      try {
  //        const response = await axios.get(`http://127.0.0.1:5000/${selectedRunModel}`, {
  //             params: {
  //                data: './dataset',
  //                truth: './truth.json',
  //             },
  //        });
  //        console.log("Running!");
  //       //  setPData(response.data || []);
  //       if(response){
  //         console.log("Done!");
  //       }
  //      } catch (error) {
  //        console.error('Error fetching data:', error);
  //      }
  //   };

  //   runData();
  // }, [selectedRunModel]);



  useEffect(() => {
    const fetchData = async () => {
       try {
         const response = await axios.get(`http://127.0.0.1:5000/${selectedModel}`);
         setPData(response.data || []);
       } catch (error) {
         console.error('Error fetching data:', error);
       }
    };

    fetchData();
  }, [selectedModel]);


  // const handleRunModelChange = (event) => {
  //   setSelectedRunModel(event.target.value);
  //   // handleFolderSubmit();
  //   // handleFileSubmit();
  // };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

 

  // const data = [{"name": "image_name", "probabilities": pdata}];
  const data = pdata
  
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(20);
                            // slider, event
  const handleSliderChange = (event) => {
      const value = parseInt(event.target.value);
      setValue1(value);
      setValue2(value+20);
      
  };

  // ################  data folder input  ############### 
  const [selectedFiles, setselectedFiles] = useState([]);
  const [file, setFile] = useState(null);

  const handleFolderChange = (event) => {
    const fileList = event.target.files;
    const filesArray = Array.from(fileList);
    setselectedFiles(filesArray);
  }

  const handleFolderSubmit = (event) => {
    // event.preventDefault();
    if (selectedFiles && file) {
      // Here you can perform actions like submitting the file
      // to a server or handling it within your React application.
      console.log('Selected Folder:', selectedFiles);
      console.log('Selected File:', file);
      // Reset the file state after submission if needed
      setselectedFiles(null);
      setFile(null);
    } else {
      if(!selectedFiles)
        alert('Please select a data folder.');
      if(!file)
        alert('Please select a file.');
    }
  };
  // ################  data folder input  ############### 

  // ################  truth.json file input  ############### 
  // const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  }

  const handleFileSubmit = (event) => {
    // event.preventDefault();
    if (file) {
      // Here you can perform actions like submitting the file
      // to a server or handling it within your React application.
      console.log('Selected File:', file);
      // Reset the file state after submission if needed
      setFile(null);
    } else {
      alert('Please select a file.');
    }
  }
  // ################  truth.json file input  ############### 
  
  return (
    <div className="App">
   
      <form className="LeftPanel" onSubmit={handleFolderSubmit}>

        {/* ################  data folder input  ############### */}
        <div className="datafolder">
          <form onSubmit={handleFolderSubmit}>
            <label htmlFor="folderInput">Select a folder:</label>
            <input
              type="file"
              id="folderInput"
              directory=""
              webkitdirectory=""
              onChange={handleFolderChange}
              multiple
            />
            {/* <button type="submit">Submit Folder</button> */}
          </form>
        </div>
        {/* ################  data folder input  ############### */}


        {/* ################  truth.json file input  ############### */}
        <div className="truth">
          <form onSubmit={handleFileSubmit}>
            <br/>
            <label>Select truth.json file</label>
            <input type="file" onChange={handleFileChange} />
            {/* <button type="submit">Submit File</button> */}
          </form>
        </div>
        {/* ################  truth.json file input  ############### */}

        <br></br>
        <button type="submit">Upload</button>

        {/* for models selction to run model */}
        {/* <div className="ModelSelect">
          <label> Run Models </label> <br/><br/>
          <select onChange={handleRunModelChange} value={selectedRunModel}>
              <option value="">Select Model</option>
              <option value="runAlex">AlexNet</option>
              <option value="runMobile">MobileNet</option>
              <option value="runShuffle">ShuffleNet</option>
              <option value="runSqueezenet1_0">SqueezeNet1_0</option>
              <option value="runSqueezenet1_1">SqueezeNet1_1</option>
              <option value="runMnasnet0_5">Mnasnet0_5</option>
          </select>
        </div> */}
        {/* for models selction to run model */}
        

        {/* for models selction to show data */}
        <div className="ModelSelect">
          <label> Models </label> <br/><br/>
          <select onChange={handleModelChange} value={selectedModel}>
              <option value="">Select Model</option>
              <option value="fetchAlex">AlexNet</option>
              <option value="fetchMobile">MobileNet</option>
              <option value="fetchShuffle">ShuffleNet</option>
              <option value="fetchSqueezenet1_0">SqueezeNet1_0</option>
              <option value="fetchSqueezenet1_1">SqueezeNet1_1</option>
              <option value="fetchMnasnet0_5">Mnasnet0_5</option>
          </select>
        </div>
        {/* for models selction to show data */}
        
        <div className="FromRange">
            <label>Focus: </label>
            <input
              type="range"
              min="0"
              max="980"
              value={value1}  
              //onChange={(e) => handleSliderChange(1, e)}
              onChange={handleSliderChange}
            />
            <span>{value1}</span>
        </div>
        
        {/* <div className="ToRange">
            <label>To:</label>
            <input
            type="range"
            min="20"
            max="1000"
            value={value2}
            onChange={(e) => handleSliderChange(2, e)}
            />
            <span>{value2}</span>
        </div> */}
        <div>
          <img src={ img === "./default-placeholder.png" ? './default-placeholder.png' : `./dataset/${img}`}
               alt={"pic"}
               style={{ width: '150px', height: 'auto' }}
          />
        </div>
      </form>
      
      
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <ParallelCoordinatesPlot
                data={data}
                width={1800}
                height={400}
                FROM_VARIABLES={value1}
                TO_VARIABLES={value2}
                img = {img}
                setImg = {setImg}
              />
            }
          />
        </Routes>
      </BrowserRouter>

      <h1> {`${selectedModel.slice(5)}`.concat(`${selectedModel ? "Net" : ""}`)} </h1>

      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <ParallelCoordinatesWide
                data={data}
                width={1800}
                height={150}
                FROM_VARIABLES={0}
                TO_VARIABLES={1000}
                START={value1}
                END={value2}
              />
            }
          />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
