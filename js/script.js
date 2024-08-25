function calculateOvertime() {
    const gp = parseFloat(document.getElementById('gp').value);
    const working_days = parseFloat(document.getElementById('working_days').value);
    const regular_overtime_hours = parseFloat(document.getElementById('regular_overtime_hours').value);
    const holiday_overtime_hours = parseFloat(document.getElementById('holiday_overtime_hours').value);

    if (isNaN(gp) || isNaN(working_days) || isNaN(regular_overtime_hours) || isNaN(holiday_overtime_hours)) {
        alert('Harap masukkan nilai yang valid.');
        return;
    }

    const hourly_rate = gp / 173;
    let total_overtime_pay = 0;

    // Menghitung lembur untuk hari kerja
    if (regular_overtime_hours > 0) {
        const first_hour_pay = 1.5 * hourly_rate;
        const additional_hours_pay = 2 * hourly_rate;
        
        const first_hour_total = first_hour_pay * working_days;
        const remaining_hours = regular_overtime_hours - working_days;
        const additional_total = Math.max(0, remaining_hours) * additional_hours_pay;
        
        total_overtime_pay += first_hour_total + additional_total;
    }

    // Menghitung lembur untuk hari libur
    if (holiday_overtime_hours > 0) {
        total_overtime_pay += holiday_overtime_hours * 2 * hourly_rate;
    }

    // Menampilkan pop-up custom
    const popup = document.getElementById('popup');
    popup.style.display = 'flex';

    document.getElementById('yesBtn').onclick = function() {
        popup.style.display = 'none';
        document.getElementById('result').textContent = `Total Upah Lembur Bulanan: Rp ${total_overtime_pay.toFixed(2)}`;
    };

    document.getElementById('noBtn').onclick = function() {
        alert("Coba lagi! Is Najwal Handsome?");
        popup.style.display = 'none';
        calculateOvertime(); // Memanggil fungsi lagi jika pilih No
    };
}
