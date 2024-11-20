function calculateTotalHolidayOvertimeHours() {
    const holidayOvertimeHoursInput = document.getElementById('holiday_overtime_hours_daily').value;
    const hoursArray = holidayOvertimeHoursInput.split(',').map(num => parseFloat(num.trim()));

    if (hoursArray.some(isNaN)) {
        alert('Masukkan angka yang valid dalam format desimal, dipisahkan dengan koma.');
        return 0;
    }

    return hoursArray.reduce((total, hours) => total + hours, 0); // Totalkan semua jam lembur
}

function calculateOvertime() {
    const gp = parseFloat(document.getElementById('gp').value);
    const working_days = parseFloat(document.getElementById('working_days').value);
    const regular_overtime_hours = parseFloat(document.getElementById('regular_overtime_hours').value);
    const sunday_work_days = parseFloat(document.getElementById('sunday_work_days').value);
    const totalHolidayOvertimeHours = calculateTotalHolidayOvertimeHours();

    if (
        isNaN(gp) ||
        isNaN(working_days) ||
        isNaN(regular_overtime_hours) ||
        isNaN(sunday_work_days) ||
        totalHolidayOvertimeHours === 0
    ) {
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
    const holidayOvertimeHoursDaily = document
        .getElementById('holiday_overtime_hours_daily')
        .value.split(',')
        .map(num => parseFloat(num.trim()));

    holidayOvertimeHoursDaily.forEach(hours => {
        let daily_overtime_pay = 0;

        if (hours > 0) {
            // Jam 1-7
            const first_seven_hours = Math.min(hours, 7);
            daily_overtime_pay += first_seven_hours * 2 * hourly_rate;

            // Jam 8
            if (hours > 7) {
                const eighth_hour = Math.min(hours - 7, 1);
                daily_overtime_pay += eighth_hour * 3 * hourly_rate;
            }

            // Jam 9 ke atas
            if (hours > 8) {
                const remaining_hours = hours - 8;
                daily_overtime_pay += remaining_hours * 4 * hourly_rate;
            }
        }

        total_overtime_pay += daily_overtime_pay;
    });

    const total_income = gp + total_overtime_pay;

    // Tampilkan pop-up "Is Najwal Handsome?"
    const popup = document.getElementById('popup');
    popup.style.display = 'flex';

    document.getElementById('yesBtn').onclick = function () {
        popup.style.display = 'none';
        document.getElementById('result').innerHTML = `
            Total Upah Lembur Bulanan: Rp ${total_overtime_pay.toLocaleString('id-ID')}<br>
            Total Pendapatan Bulanan (belum termasuk insentif dan potongan pajak, dll.): Rp ${total_income.toLocaleString('id-ID')}
        `;
    };

    document.getElementById('noBtn').onclick = function () {
        alert('Coba lagi! Is Najwal Handsome?');
        popup.style.display = 'none';
        calculateOvertime(); // Memanggil ulang jika pilih "No"
    };
}
