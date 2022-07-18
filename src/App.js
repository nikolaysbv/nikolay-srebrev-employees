import { useState, useEffect } from "react";
import "./App.css";
import * as XLSX from "xlsx";

function App() {
  const [data, setData] = useState([]);

  function dateToUnixTimestamp(date) {
    if (date === "NULL")
      return Math.floor(new Date(Date.now()).getTime() / (1000 * 60 * 60 * 24));
    return Math.floor(new Date(date).getTime() / (1000 * 60 * 60 * 24));
  }

  function extractEmployeePairsFromData(data) {
    const projects = Array.from(new Set(data.map((row) => row[1])));

    const res = [];

    for (let project of projects) {
      const rowsWithProjectInData = data.filter((row) => row[1] === project);

      for (let row in rowsWithProjectInData) {
        const employee1 = rowsWithProjectInData[row][0];
        const employee1Dates = [...rowsWithProjectInData[row].slice(2)].map(
          (date) => dateToUnixTimestamp(date)
        );
        let nextRow = parseInt(row) + 1;

        while (nextRow < rowsWithProjectInData.length) {
          let daysWorked = 0;
          const employee2 = rowsWithProjectInData[nextRow][0];
          const employee2Dates = [
            ...rowsWithProjectInData[nextRow].slice(2),
          ].map((date) => dateToUnixTimestamp(date));

          if (
            !(
              (employee1Dates[1] < employee2Dates[1] &&
                employee1Dates[1] < employee2Dates[0]) ||
              (employee2Dates[1] < employee1Dates[1] &&
                employee2Dates[1] < employee1Dates[0])
            )
          ) {
            const timestampsWorked = [
              ...employee1Dates,
              ...employee2Dates,
            ].sort();
            daysWorked = timestampsWorked[2] - timestampsWorked[1] + 1;
          } else {
            nextRow++;
            continue;
          }

          res.push([employee1, employee2, project, daysWorked]);
          nextRow++;
        }
      }
    }

    return res.sort((a, b) => b[3] - a[3]);
  }

  const handleChange = function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const binaryFile = evt.target.result;
      const excelFileObj = XLSX.read(binaryFile, { type: "binary" });
      const sheetName = excelFileObj.SheetNames[0];
      const sheetData = excelFileObj.Sheets[sheetName];
      const sheetDataJSON = XLSX.utils.sheet_to_json(sheetData, { header: 1 });
      setData(extractEmployeePairsFromData(sheetDataJSON));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <main>
      <section className="upload-section">
        <div className="upload-container">
          <label for="sheet" class="label-file-upload">
            Upload Excel sheet
          </label>
          <input type="file" id="sheet" onChange={handleChange} />
        </div>
      </section>
      <section className="table-section">
        <table>
          <thead>
            <tr>
              <th colSpan="4">Pair of employees who have worked together</th>
            </tr>
          </thead>
          <tbody>
            <tr className="colnames">
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
