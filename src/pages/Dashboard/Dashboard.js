import React from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS,LineElement,ArcElement, BarElement, CategoryScale,PointElement, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement,ArcElement, BarElement, CategoryScale,PointElement, LinearScale, Title, Tooltip, Legend);

const Dashboard = () => {
  const dataLine = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales 2023",
        data: [30, 50, 40, 60, 75, 90],
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
      {
        label: "Sales 2024",
        data: [20, 40, 35, 55, 70, 25],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };
  const dataBar = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Sales",
        data: [30, 45, 28, 50, 75],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };
  const dataPI = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
    datasets: [
      {
        label: "Colors",
        data: [12, 19, 8, 5, 15],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"],
      },
    ],
  };
  const optionsLine = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
  };
 
  const optionsPI = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Sales Data" },
    },
  };
  return (
    <div className="container-fluid">
   <div style={{height:'80vh',overflowY:'scroll',overflowX:'hidden'}}>
   <div className="row text-center g-3">
      <div className="col-sm  p-3 rounded" style={{background:'#B8FEB3'}}>
        <h3>Total Purchase</h3>
        <div className="row">
          <div className="col-md-6"><p>Quantity: 1500</p></div>
          <div className="col-md-6"><p>Amount: $1,500,000</p></div>
        </div>
      </div>

      <div className="col-sm p-3 rounded text-white" style={{background:'#2DDC1B'}}>
        <h3>Total Sales</h3>
        <div className="row">
          <div className="col-md-6"><p>Quantity: 1500</p></div>
          <div className="col-md-6"><p>Amount: $1,500,000</p></div>
        </div>
      </div>

      <div className="col-sm  p-3 rounded" style={{background:'#B8FEB3'}}>
        <h3>Total Production</h3>
        <div className="row">
          <div className="col-md-6"><p>Quantity: 1500</p></div>
          <div className="col-md-6"><p>Amount: $1,500,000</p></div>
        </div>
      </div>
    </div>

    {/* Charts Section */}
    <div className="row mt-4">
      <div className="col-sm-6">
        <div className="bg-light p-3 rounded shadow">

          <Bar data={dataBar} options={options} />
        </div>
      </div>
      <div className="col-sm-6">
        <div className="bg-light p-3 rounded shadow ">
          <Pie data={dataPI} options={optionsPI} />
        </div>
      </div>
      <div className="col-sm-6">
        <div className="bg-light p-3 rounded shadow">
          <Line data={dataLine} options={optionsLine} />
        </div>
      </div>
    </div>
   </div>
  </div>
);
}

export default Dashboard
