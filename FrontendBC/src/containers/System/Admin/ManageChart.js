import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { getStatsByMonth } from "../../../services/userService";
import './ManageChart.scss';
import { FormattedMessage } from 'react-intl';

const ManageChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getStatsByMonth()
            .then(response => {
                console.log('API Response:', response);
                if (response && Array.isArray(response)) {
                    setData(response);
                } else {
                    console.error('Invalid response format:', response);
                }
            })
            .catch(error => {
                console.error('Error fetching appointment stats', error);
            });
    }, []);

    const months = Array.from({ length: 12 }, (_, index) => ({
        month: (index + 1).toString(),
        new: 0,
        confirmed: 0,
        completed: 0,
        canceled: 0,
    }));

    const combinedData = months.map(month => {
        const found = data.find(item => item && item.month === month.month);
        if (!found) {
            console.warn(`No data found for month: ${month.month}`);
        }
        return {
            month: month.month,
            new: found ? Number(found.new) : 0,
            confirmed: found ? Number(found.confirmed) : 0,
            completed: found ? Number(found.completed) : 0,
            canceled: found ? Number(found.canceled) : 0,
        };
    });

    const chartOptions = {
        chart: {
            id: 'appointment-chart',
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        xaxis: {
            categories: combinedData.map(item => `Tháng ${item.month}`),
        },
        yaxis: {
            min: 0,
            max: 20,
            tickAmount: 10,
            labels: {
                formatter: (value) => parseInt(value),
            },
        },
        title: {
            text: 'Thống kê trạng thái lịch hẹn theo tháng',
            align: 'left',
        },
        colors: ['#00E396', '#FF4560', '#008FFB', '#775DD0'],
        stroke: {
            curve: 'smooth',
        },
    };

    // const chartOptions = {
    //     chart: {
    //         id: 'appointment-chart',
    //         type: 'line',
    //         zoom: {
    //             enabled: false,
    //         },
    //     },
    //     xaxis: {
    //         categories: combinedData.map(item => `Tháng ${item.month}`),
    //     },
    //     yaxis: {
    //         min: 0,
    //         max: 50,  // Đặt max là 50 để chia thành 10, 20, 30, 40, 50
    //         tickAmount: 5,  // Số lượng tick (nhãn) trên trục y là 5, tương ứng với các giá trị 0, 10, 20, 30, 40, 50
    //         labels: {
    //             formatter: (value) => parseInt(value),  // Hiển thị giá trị là số nguyên
    //         },
    //     },
    //     title: {
    //         text: 'Thống kê trạng thái lịch hẹn theo tháng',
    //         align: 'center',
    //     },
    //     colors: ['#00E396', '#FF4560', '#008FFB', '#775DD0'],
    //     stroke: {
    //         curve: 'smooth',  // Đường cong mượt
    //     },
    // };

    const chartSeries = [
        {
            name: 'Mới',
            data: combinedData.map(item => item.new),
        },
        {
            name: 'Đã xác nhận',
            data: combinedData.map(item => item.confirmed),
        },
        {
            name: 'Đã khám xong',
            data: combinedData.map(item => item.completed),
        },
        {
            name: 'Đã hủy',
            data: combinedData.map(item => item.canceled),
        },
    ];

    return (
        <div className='main-content'>
            <h2 className="manage-doctor-chart">
                <FormattedMessage id="manage-statisticst.title" defaultMessage="Quản lý thống kê lịch hẹn" />
            </h2>
            <div className='all'>
                {combinedData.length > 0 ? (
                    <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="line"
                        width="100%"
                        height="400"
                    // className="main-content"
                    />
                ) : (
                    <p>Không có dữ liệu để hiển thị.</p>
                )}
            </div>
        </div>
    );
};

export default ManageChart;