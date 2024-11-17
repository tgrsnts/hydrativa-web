import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Transaksi from '@/lib/interfaces/Transaksi'; // Sesuaikan import jika perlu

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TransactionChartProps {
  transactions: Transaksi[];
}

const Transaction4MonthsChart: React.FC<TransactionChartProps> = ({ transactions }) => {
  const [chartData, setChartData] = useState<any>({});

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

    // Hitung transaksi dalam 4 bulan terakhir
    const monthCounts: number[] = [0, 0, 0, 0];
    const monthLabels: string[] = [];

    for (let i = 0; i < 4; i++) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      monthLabels.unshift(getMonthName(monthIndex)); // Masukkan nama bulan di awal array

      // Hitung jumlah transaksi di bulan ini
      monthCounts[3 - i] = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.created_at); // Ganti dengan field tanggal transaksi yang sesuai
        return (
          transactionDate.getMonth() === monthIndex &&
          transactionDate.getFullYear() === year
        );
      }).length;
    }

    // Atur data grafik
    setChartData({
      labels: monthLabels,
      datasets: [
        {
          label: 'Jumlah Transaksi',
          data: monthCounts,
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

export default Transaction4MonthsChart;
