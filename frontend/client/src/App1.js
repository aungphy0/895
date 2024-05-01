// App.js
import React from 'react';
import FamilyTree from './FamilyTree';
import TreeChart from './Chart/TreeChart';

function App1() {
    const data = [
        {"parent":null,"child":"1"},
        {"parent":"1","child":"2"},
        {"parent":"1","child":"3"},
        {"parent":"2","child":"4"},
        {"parent":"4","child":"5"},
        {"parent":"5","child":"6"},
        {"parent":"5","child":"7"},
    ];

    return (
        <div className="App">
            <h1>Family Tree Visualization</h1>
            <FamilyTree data={data} />
        </div>
    );
}

export default App1;
