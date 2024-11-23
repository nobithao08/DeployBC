import React, { useState, useEffect } from 'react';
import { getDoctorStatsByMonth } from "../../../services/userService";
import Chart from 'react-apexcharts';
import './ManageChartDoctor.scss';
import { FormattedMessage } from 'react-intl';

const ManageChartDoctor = () => {
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [chartSeries, setChartSeries] = useState([]);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            id: 'doctor-stats-chart',
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        xaxis: {
            categories: [],
        },
        yaxis: {
            min: 0,
            labels: {
                formatter: (value) => parseInt(value),
            },
        },
        title: {
            text: 'Thống kê số lượng lịch hẹn hoàn thành của bác sĩ theo tháng',
            align: 'left',
        },
        colors: ['#00E396', '#FF4560', '#008FFB', '#775DD0', '#FEB019'],
        stroke: {
            curve: 'smooth',
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
        },
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        getDoctorStatsByMonth()
            .then(response => {
                if (response && Array.isArray(response) && response.length > 0) {
                    const groupedData = response.map(item => ({
                        month: item.month,
                        doctorName: `${item["doctorInfo.lastName"]} ${item["doctorInfo.firstName"]}`,
                        completed: parseInt(item.completed),
                    }));

                    const doctors = [...new Set(groupedData.map(item => item.doctorName))];
                    const categories = [...new Set(groupedData.map(item => `Tháng ${item.month}`))];
                    const seriesData = doctors.map(doctor => ({
                        name: doctor,
                        data: categories.map(month => {
                            const completed = groupedData.find(item => item.doctorName === doctor && item.month === month.split(' ')[1]);
                            return completed ? completed.completed : 0;
                        }),
                    }));

                    setTableData(groupedData);
                    setChartSeries(seriesData);
                    setChartOptions(prevOptions => ({
                        ...prevOptions,
                        xaxis: {
                            categories: categories,
                        },
                    }));
                } else {
                    setTableData([]);
                    setChartSeries([]);
                }
            })
            .catch(error => {
                console.error('Error fetching doctor stats', error);
                setTableData([]);
                setChartSeries([]);
            });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(tableData.length / itemsPerPage);

    return (
        <div className='main-content'>

            <h2 className="manage-doctor-chart">
                <FormattedMessage id="manage-appointment-statisticst.title" defaultMessage="Quản lý thống kê lịch hẹn" />
            </h2>
            <div className='all'>
                {/* Hiển thị biểu đồ */}
                {chartSeries.length > 0 ? (
                    <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="line"
                        height={350}
                    />
                ) : (
                    <p>Đang tải...</p>
                )}

                {/* Hiển thị bảng dữ liệu */}
                {currentItems.length > 0 ? (
                    <div>
                        <table id="TableManageUser">
                            <thead>
                                <tr>
                                    <th>Tháng</th>
                                    <th>Tên bác sĩ</th>
                                    <th>Số lịch hẹn hoàn thành</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((row, index) => (
                                    <tr key={index}>
                                        <td>Tháng {row.month}</td>
                                        <td>{row.doctorName}</td>
                                        <td>{row.completed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &laquo; Trước
                            </button>
                            <span>{`Trang ${currentPage} / ${totalPages}`}</span>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Tiếp &raquo;
                            </button>
                        </div>
                    </div>

                ) : (
                    <div class="loading-container main-content">
                        <div class="loading-spinner"></div>
                        <p class="loading-text">Đang tải, vui lòng chờ...</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ManageChartDoctor;
