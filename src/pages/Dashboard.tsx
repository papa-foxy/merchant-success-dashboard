import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/firebaseConfig";
import 'chart.js/auto';
import ReactApexChart from "react-apexcharts";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function MSDashboard({session, logout}) {
  interface ChartState {
    series: { name: string; data: number[] }[];
    options: {
      chart: {
        type: string;
        height: number;
        zoom: { enabled: boolean };
      };
      dataLabels: { enabled: boolean };
      stroke: { curve: string };
      title: { text: string; align: string };
      xaxis: { categories: string[] };
      yaxis: { opposite: boolean };
      legend: { horizontalAlign: string };
    };
  }

  interface DateRange {
    startDate: Date;
    endDate: Date;
    key: string;
  }

  interface Ranges {
    selection: DateRange;
  }

  const times = ["24H", "7D", "1M", "1Y"];
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [selectedTicketType, setSelectedTicketType] = useState("regular-daily-tickets");
  const [totalRegularTickets, setTotalRegularTickets] = useState(0);
  const [totalCloseTickets, setTotalCloseTickets] = useState(0);
  const [totalPendingTickets, setTotalPendingTickets] = useState(0);
  const [totalClickUpTickets, setTotalClickUpTickets] = useState(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    key: "selection",
  });

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleDateChange = (ranges: Ranges) => {
    const { selection } = ranges;
    setSelectedDateRange(selection);
  };

  const handleTimeChange = (index: number) => {
    setSelectedIndex(index);
    const now = new Date();
    let startDate = new Date();
    
    switch (index) {
      case 0: // 24H
        startDate.setDate(now.getDate() - 1);
        break;
      case 1: // 7D
        startDate.setDate(now.getDate() - 7);
        break;
      case 2: // 1M
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 3: // 1Y
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    setSelectedDateRange({
      startDate: startDate,
      endDate: now,
      key: "selection"
    });
  };

  const [state, incomingTicketByHour] = useState<ChartState>({
    series: [
      {
        name: "Total Ticket",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false,
        },
      },
      grid: {
        padding: {
          left: 30,
          right: 30
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        margin: 20,
        text: "Incoming Ticket By Hours",
        align: "left",
      },
      xaxis: {
        categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      },
      yaxis: {
        opposite: true,
      },
      legend: {
        horizontalAlign: "left",
      },
    },
  });

  const [horizontalBarChartData, setHorizontalBarChartData] = useState({
    series: [{
      name: 'Tickets Handled',
      data: []
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: 'Total Tickets Handled by MS PIC',
        align: 'left'
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: 'MS PIC'
        }
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " tickets"
          }
        }
      }
    },
  });

  const [donutChartData, setDonutChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'donut',
        height: 200
      },
      title: {
        text: 'Ticket Categories',
        align: 'left'
      },
      labels: [],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
  });

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const regularSnapshot = await getDocs(collection(db, selectedTicketType));
        const ticket_time = Array(24).fill(0);
        let totalTicket = 0;
        let closedCount = 0;
        let pendingCount = 0;
        let clickUpCount = 0;

        const totalTicketHandleByPic: { [key: string]: number } = {};
        const ticketCategories: { [key: string]: number } = {};
  
        regularSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const { Status, Click_Up_Link, Merchant_PIC, incoming_ticket_date, incoming_ticket_time, Category_2 } = data;

          const incomingDate = new Date(incoming_ticket_date);
          const [hours, minutes] = incoming_ticket_time.split(":").map(Number);
  
          const startDate = new Date(selectedDateRange.startDate);
          const endDate = new Date(selectedDateRange.endDate);
          const isSingleDate = startDate.toDateString() === endDate.toDateString();
          const isInDateRange = isSingleDate 
                                ? incomingDate.toDateString() === startDate.toDateString() 
                                : incomingDate >= startDate && incomingDate <= endDate;
                                
          if (isInDateRange) {
            totalTicket++;
            incomingDate.setHours(hours, minutes);
            ticket_time[incomingDate.getHours()]++;
            if (Status === "Closed") closedCount++;
            if (Status === "Pending") pendingCount++;
            if (Click_Up_Link?.trim()) clickUpCount++;
            
            if (Merchant_PIC) {
              totalTicketHandleByPic[Merchant_PIC] = (totalTicketHandleByPic[Merchant_PIC] || 0) + 1;
            }

            if (Category_2) {
              ticketCategories[Category_2] = (ticketCategories[Category_2] || 0) + 1;
            }
          }
        });
  
        setTotalRegularTickets(totalTicket);
        setTotalCloseTickets(closedCount);
        setTotalPendingTickets(pendingCount);
        setTotalClickUpTickets(clickUpCount);

        incomingTicketByHour((prevState) => ({
          ...prevState,
          series: [
            {
              name: "Total Ticket",
              data: ticket_time,
            },
          ],
        }));

        const picNames = Object.keys(totalTicketHandleByPic);
        const picTicketCounts = Object.values(totalTicketHandleByPic);
 
        setHorizontalBarChartData({
          ...horizontalBarChartData,
          series: [{
            name: 'Tickets Handled',
            data: picTicketCounts
          }],
          options: {
            ...horizontalBarChartData.options,
            xaxis: {
              categories: picNames
            }
          }
        });

        setDonutChartData({
          ...donutChartData,
          series: Object.values(ticketCategories),
          options: {
            ...donutChartData.options,
            labels: Object.keys(ticketCategories)
          }
        });

      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
  
    fetchTicketData();
  }, [selectedTicketType, selectedDateRange]);

  const cardData = [
    {
      icon: "bi bi-ticket-perforated",
      header: "Total Ticket",
      value: totalRegularTickets,
    },
    {
      icon: "bi bi-check-circle",
      header: "Close Ticket",
      value: totalCloseTickets,
    },
    {
      icon: "bi bi-clock-history",
      header: "Pending Ticket",
      value: totalPendingTickets,
    },
    {
      icon: "bi bi-exclamation-circle",
      header: "Click Up Ticket",
      value: totalClickUpTickets,
    }
  ];

  const renderCards = () =>
    cardData.map((card, index) => (
      <div className="col-sm-3" key={index}>
        <div className="card shadow-sm mt-2">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-3 d-flex justify-content-center align-items-center rounded">
                <i className={`${card.icon} fs-4`}></i>
              </div>
              <div className="col-9">
                <h6 className="card-title mb-1">{card.header}</h6>
                <p className="card-text text-muted">{card.value}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="container-fluid">
      <div className="d-flex">
        <div className="ms-me border rounded dropdown">
          <button
            className="btn btn-outline font-monospace dropdown-toggle"
            type="button"
            id="incoming-ticket"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {selectedTicketType === "regular-daily-tickets" ? "Regular Daily Ticket" : "Plus Daily Ticket"}
          </button>
          <ul className="dropdown-menu" aria-labelledby="incoming-ticket">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSelectedTicketType("regular-daily-tickets")}
              >
                Regular Daily Ticket
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSelectedTicketType("plus-daily-tickets")}
              >
                Plus Daily Ticket
              </button>
            </li>
          </ul>
        </div>

        <div className="ms-auto d-flex">
          <div className="mx-3">
            <div className="row">
              <div className="col border border-2 rounded bg-light d-flex align-items-center justify-content-center py-2">
                <p className="mb-0 fw-bold text-muted">
                  {selectedDateRange.startDate.toLocaleDateString()} - {selectedDateRange.endDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mx-2 border rounded d-flex bg-secondary">
            {times.map((item, index) => (
              <button
                key={index}
                className={
                  selectedIndex === index
                    ? "btn btn-outline font-monospace text-white bg-dark"
                    : "btn btn-outline font-monospace text-white bg-secondary"
                }
                onClick={() => handleTimeChange(index)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mx-2 border rounded d-flex align-items-center position-relative">
            <button
              className="btn btn-outline font-monospace"
              onClick={toggleDatePicker}
            >
              <i className="bi bi-calendar pe-2"></i>
              Select Date
            </button>
            {isDatePickerOpen && (
              <div
                className="position-absolute"
                style={{
                  margin: "2px",
                  zIndex: 1000,
                  top: "100%",
                  right: 0,
                }}
              >
                <DateRangePicker
                  ranges={[selectedDateRange]}
                  onChange={handleDateChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-fluid mt-4 ">
        <div className="row">{renderCards()}</div>
      </div>

      <div className="mt-3" style={{ height: "450px", width: "100%" }}>
        <div className="container-fluid h-100">
          <div className="row h-100">
            <div className="col-6 col-auto">
              <div className="bg-light h-100 d-flex align-items-center justify-content-center border border-1 rounded shadow-sm ">
                <div style={{ width: "100%", height: "100%" }}>
                  <ReactApexChart options={state.options} series={state.series} type="area" height="100%"/>
                </div>
              </div>
            </div>

            <div className="col-6 d-flex flex-column" style={{ height: '450px' }}>
              <div className="row flex-grow-1 mb-2">
                <div className="col bg-light border border-1 rounded shadow-sm">
                  <ReactApexChart options={horizontalBarChartData.options} series={horizontalBarChartData.series} type="bar" height="100%" />
                </div>
              </div>

              <div className="row flex-grow-1">
                <div className="col bg-light border border-1 rounded shadow-sm">
                  <ReactApexChart options={donutChartData.options} series={donutChartData.series} type="donut" height="100%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MSDashboard;

