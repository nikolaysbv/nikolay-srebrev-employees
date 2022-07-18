import { useState, useEffect } from "react";
import "./App.css";
import * as XLSX from "xlsx";

function App() {
  const [data, setData] = useState([]);

  const handleChange = function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const binaryFile = evt.target.result;
      const excelFileObj = XLSX.read(binaryFile, { type: "binary" });
      const sheetName = excelFileObj.SheetNames[0];
      const sheetData = excelFileObj.Sheets[sheetName];
      const sheetDataJSON = XLSX.utils.sheet_to_json(sheetData, { header: 1 });
      console.log(sheetDataJSON);
      setData(sheetDataJSON);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <main>
      <section className="upload-section">
        <input type="file" id="sheet" onChange={handleChange} />
      </section>
      <section className="table-section">
        <table>
          <thead>
            <tr>
              <th colSpan="4">Pair of employees who have worked together</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Employee ID #1</td>
              <td>Employee ID #2</td>
              <td>Project ID</td>
              <td>Days worked</td>
            </tr>
            {data.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default App;
