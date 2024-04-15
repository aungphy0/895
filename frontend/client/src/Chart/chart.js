import React, { useState, useEffect } from 'react';
import SankeyDiagram from './SankeyDiagram'; 
import CircleSankey from './CircleSankey';

const Chart = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/users", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setData(data); // Set data here inside the async operation
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div id='chartContainer'>
            {data ? (
                <CircleSankey
                    images={data.imageClassMapping}
                    classMap={data.classData}
                    modelData={data.modelData}
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Chart;
