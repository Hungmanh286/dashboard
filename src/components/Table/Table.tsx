import React from 'react';
import './Table.css';

interface TableProps {
  columns: string[];
  data: {
    Total: string;
    Room: string;
    Distribution: string;
    LinkCamera: string;
  }[];
}


const Table: React.FC<TableProps> = ({ columns, data }) => {
  const getGradient = (value: string): string => {
    const [numerator, denominator] = value.split('/').map(Number);
    const percentage = (numerator / denominator) * 100;
    return `linear-gradient(to right, ${getColor(percentage)} ${percentage}%, #f2f2f2 ${percentage}%)`;
  };

  const getColor = (percentage: number): string => {
    if (percentage >= 66.6) return '#41d762';
    if (percentage >= 33.3) return '#f7f700';
    if (percentage > 0) return '#fa2727';
    return '#f2f2f2';
  };

  const getDotColor = (total: string): string => {
    if (total === '0/100') return 'red';
    return 'green';
  };

  return (
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td className="room-cell">
              <span className={`dot ${getDotColor(row.Total)}`}></span> {row.Room}
            </td>
            <td style={{ background: getGradient(row.Total) }}>{row.Total}</td>
            <td style={{ backgroundColor: getColor(parseInt(row.Distribution, 10)) }}>{row.Distribution}</td>
            <td className='link-camera-cell'>
                <span 
                    className="camera-link"
                    // onClick={() => handleSubmit(row.LinkCamera)}
                    // role="button"
                    // tabIndex={0}
                >
                    {row.LinkCamera}
                </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
