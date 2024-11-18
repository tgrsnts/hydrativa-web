import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import Transaksi from '@/lib/interfaces/Transaksi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TransactionChartProps {
  transactions: Transaksi[];
}

const RevenueChart: React.FC<TransactionChartProps> = ({ transactions }) => {
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return;

    // Fungsi untuk mendapatkan nama bulan
    const getMonthName = (monthIndex: number) => {
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return monthNames[monthIndex];
    };

    // Dapatkan tanggal saat ini dan bulan
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Hitung total pendapatan dalam 4 bulan terakhir
    const monthRevenue: number[] = [0, 0, 0, 0];
    const monthLabels: string[] = [];

    for (let i = 0; i < 4; i++) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      monthLabels.unshift(getMonthName(monthIndex)); // Masukkan nama bulan di awal array

      // Hitung total pendapatan di bulan ini
      monthRevenue[3 - i] = transactions
        .filter((transaction) => {
          const transactionDate = new Date(transaction.created_at); // Ganti dengan field tanggal transaksi yang sesuai
          return (
            transactionDate.getMonth() === monthIndex &&
            transactionDate.getFullYear() === year
          );
        })
        .reduce((total, transaction) => total + transaction.total_harga, 0); // Ganti `amount` dengan field jumlah pendapatan yang sesuai
    }

    // Atur data grafik
    setChartData({
      labels: monthLabels,
      datasets: [
        {
          label: 'Total Pendapatan',
          data: monthRevenue,
          backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336'],
          borderColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336'],
          borderWidth: 1,
        },
      ],
    });
  }, [transactions]);

  if (!chartData.datasets) return null;

  return (
      <Bar data={chartData} options={{ responsive: true }} />
  );
};

export default RevenueChart;
