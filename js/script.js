function calculateOvertime() {
    const gp = parseFloat(document.getElementById('gp').value);
    const working_days = parseFloat(document.getElementById('working_days').value);
    const regular_overtime_hours = parseFloat(document.getElementById('regular_overtime_hours').value);
    const sunday_work_days = parseFloat(document.getElementById('sunday_work_days').value);
    const holiday_overtime_hours = parseFloat(document.getElementById('holiday_overtime_hours').value);

    if (isNaN(gp) || isNaN(working_days) || isNaN(regular_overtime_hours) || isNaN(sunday_work_days) || isNaN(holiday_overtime_hours)) {
        alert('Harap masukkan nilai yang valid.');
        return;
    }

    const hourly_rate = gp / 173; // Tarif per jam normal
    let total_overtime_pay = 0;

    // Menghitung lembur pada hari kerja
    if (regular_overtime_hours > 0) {
        const first_hour_pay = 1.5 * hourly_rate;
        const additional_hours_pay = 2 * hourly_rate;
        const first_hour_total = first_hour_pay * working_days;
        const remaining_hours = regular_overtime_hours - working_days;
        const additional_total = Math.max(0, remaining_hours) * additional_hours_pay;
        total_overtime_pay += first_hour_total + additional_total;
    }

    // Menghitung lembur pada hari libur
    if (holiday_overtime_hours > 0) {
        const sunday_hours_rate = (hours) => {
            if (hours <= 7) return hours * 2 * hourly_rate;
            if (hours === 8) return 7 * 2 * hourly_rate + 3 * hourly_rate;
            return 7 * 2 * hourly_rate + 3 * hourly_rate + (hours - 8) * 4 * hourly_rate;
        };
        total_overtime_pay += sunday_hours_rate(holiday_overtime_hours) * sunday_work_days;
    }

    const total_income = gp + total_overtime_pay;

    const popup = document.getElementById('popup');
    popup.style.display = 'flex';

    document.getElementById('yesBtn').onclick = function () {
        popup.style.display = 'none';
        document.getElementById('result').innerHTML = `
            Total Upah Lembur Bulanan: Rp ${total_overtime_pay.toFixed(2)}<br>
            Total Pendapatan Bulanan (belum termasuk insentif dan potongan pajak, dll.): Rp ${total_income.toFixed(2)}
        `;
    };

    document.getElementById('noBtn').onclick = function () {
        alert('Coba lagi! Is Najwal Handsome?');
        popup.style.display = 'none';
        calculateOvertime(); // Memanggil ulang jika pilih No
    };


    
}
