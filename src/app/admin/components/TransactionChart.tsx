import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Transaksi from '@/lib/interfaces/Transaksi'; // Adjust import if necessary

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TransactionChartProps {
    transactions: Transaksi[];
}

const TransactionChart: React.FC<TransactionChartProps> = ({ transactions }) => {
    const [chartData, setChartData] = useState<any>({});  // Ensure chartData is always an object

    useEffect(() => {
        if (!Array.isArray(transactions) || transactions.length === 0) return; // Guard clause to handle empty or invalid data

        const statusCount = {
            delivered: 0,
            delivering: 0,
            success: 0,
            pending: 0,
            unknown: 0,
        };

        // Count transactions by status
        transactions.forEach((transaction) => {
            if (transaction.status === 'delivered') {
                statusCount.delivered++;
            } else if (transaction.status === 'delivering') {
                statusCount.delivering++;
            } else if (transaction.status === 'success') {
                statusCount.success++;
            } else if (transaction.status === 'pending') {
                statusCount.pending++;
            } else {
                statusCount.unknown++;
            }
        });

        // Set up chart data
        setChartData({
            labels: ['Terkirim', 'Sedang Dikirim', 'Sudah Bayar', 'Belum Bayar'],
            datasets: [
                {
                    label: 'Status Pesanan',
                    data: [
                        statusCount.delivered,
                        statusCount.delivering,
                        statusCount.success,
                        statusCount.unknown,
                    ],
                    backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336'],
                    borderColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336'],
                    borderWidth: 1,
                },
            ],
        });
    }, [transactions]);

    // Avoid rendering until chartData is properly set
    if (!chartData.datasets) return null;

    return (
        <Bar data={chartData} options={{ responsive: true }} />        
    );
};

export default TransactionChart;
