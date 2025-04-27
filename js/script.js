// Global storage for calculation data
const calcData = {
    gp: 0,
    hourlyRate: 0,
    regularPay: 0,
    holidayPay: 0,
    totalPay: 0,
    totalIncome: 0,
    regularHours: 0,
    workingDays: 0,
    holidayHours: []
};

function calculateOvertime() {
    // Get input values
    calcData.gp = parseFloat(document.getElementById('gp').value);
    calcData.workingDays = parseFloat(document.getElementById('working_days').value);
    calcData.regularHours = parseFloat(document.getElementById('regular_overtime_hours').value);
    const holidayInput = document.getElementById('holiday_overtime_hours_daily').value;
    calcData.holidayHours = holidayInput.split(',').map(h => parseFloat(h.trim())).filter(h => !isNaN(h));

    // Validate inputs
    if (isNaN(calcData.gp) || isNaN(calcData.workingDays) || isNaN(calcData.regularHours)) {
        alert('Harap isi semua field wajib dengan benar');
        return;
    }

    // Show Najwal popup first
    document.getElementById('popup').style.display = 'flex';

    // Setup popup buttons
    document.getElementById('yesBtn').onclick = function() {
        document.getElementById('popup').style.display = 'none';
        continueCalculation();
    };

    document.getElementById('noBtn').onclick = function() {
        alert('Coba lagi! Is Najwal Handsome?');
        document.getElementById('popup').style.display = 'none';
    };
}

function continueCalculation() {
    // Calculate hourly rate
    calcData.hourlyRate = calcData.gp / 173;
    
    // Calculate payments
    calcData.regularPay = calculateRegularPay();
    calcData.holidayPay = calculateHolidayPay();
    calcData.totalPay = calcData.regularPay + calcData.holidayPay;
    calcData.totalIncome = calcData.gp + calcData.totalPay;

    // Show results
    showMainResult();
}

function calculateRegularPay() {
    if (calcData.regularHours <= 0) return 0;
    
    const firstHourPay = 1.5 * calcData.hourlyRate * calcData.workingDays;
    const additionalHours = Math.max(0, calcData.regularHours - calcData.workingDays);
    const additionalPay = 2 * calcData.hourlyRate * additionalHours;
    
    return firstHourPay + additionalPay;
}

function calculateHolidayPay() {
    if (calcData.holidayHours.length === 0) return 0;
    
    let total = 0;
    calcData.holidayHours.forEach(hours => {
        if (hours <= 0) return;
        
        // Jam 1-7
        const first7 = Math.min(hours, 7) * 2 * calcData.hourlyRate;
        // Jam ke-8
        const hour8 = (hours > 7 && hours <= 8) ? 3 * calcData.hourlyRate : 0;
        // Jam ke-9+
        const remaining = hours > 8 ? (hours - 8) * 4 * calcData.hourlyRate : 0;
        
        total += first7 + hour8 + remaining;
    });
    
    return total;
}

function showMainResult() {
    const resultHTML = `
        <div class="result-box">
            <div class="result-item">
                <span>Gaji Pokok:</span>
                <span>Rp ${calcData.gp.toLocaleString('id-ID')}</span>
            </div>
            <div class="result-item">
                <span>Lembur Hari Kerja:</span>
                <span>Rp ${Math.round(calcData.regularPay).toLocaleString('id-ID')}</span>
            </div>
            <div class="result-item">
                <span>Lembur Hari Libur:</span>
                <span>Rp ${Math.round(calcData.holidayPay).toLocaleString('id-ID')}</span>
            </div>
            <div class="result-item result-total">
                <span>Total Pendapatan:</span>
                <span>Rp ${Math.round(calcData.totalIncome).toLocaleString('id-ID')}</span>
            </div>
        </div>
    `;
    
    document.getElementById('result').innerHTML = resultHTML;
    document.getElementById('detailBtn').style.display = 'flex';
    document.getElementById('detailBtn').onclick = showDetailCalculation;
}

function showDetailCalculation() {
    let detailHTML = `
        <div class="detail-step">
            <h4><i class="fas fa-info-circle"></i> Informasi Dasar</h4>
            <p>Gaji Pokok: <span class="detail-value">Rp ${calcData.gp.toLocaleString('id-ID')}</span></p>
            <p>Tarif Per Jam: <span class="detail-formula">${calcData.gp} ÷ 173 = Rp ${Math.round(calcData.hourlyRate).toLocaleString('id-ID')}/jam</span></p>
        </div>
        
        <div class="detail-step">
            <h4><i class="fas fa-briefcase"></i> Lembur Hari Kerja</h4>
            <p>Total Jam: ${calcData.regularHours} jam</p>
            <p>Hari Kerja: ${calcData.workingDays} hari</p>
            <p>Perhitungan:</p>
            <p class="detail-formula">
                ${calcData.workingDays} jam × 1.5 × Rp ${Math.round(calcData.hourlyRate)} = Rp ${Math.round(1.5 * calcData.hourlyRate * calcData.workingDays).toLocaleString('id-ID')}<br>
                ${Math.max(0, calcData.regularHours - calcData.workingDays)} jam × 2 × Rp ${Math.round(calcData.hourlyRate)} = Rp ${Math.round(2 * calcData.hourlyRate * Math.max(0, calcData.regularHours - calcData.workingDays)).toLocaleString('id-ID')}<br>
                <strong>Total: Rp ${Math.round(calcData.regularPay).toLocaleString('id-ID')}</strong>
            </p>
        </div>
    `;
    
    // Holiday overtime details with sub-totals
    if (calcData.holidayPay > 0) {
        detailHTML += `
            <div class="detail-step">
                <h4><i class="fas fa-umbrella-beach"></i> Lembur Hari Libur</h4>
                <p>Total Hari: ${calcData.holidayHours.length} hari</p>
        `;
        
        calcData.holidayHours.forEach((hours, index) => {
            const first7 = Math.min(hours, 7);
            const hour8 = hours > 7 ? 1 : 0;
            const remaining = hours > 8 ? hours - 8 : 0;
            
            const first7Amount = first7 * 2 * calcData.hourlyRate;
            const hour8Amount = hour8 * 3 * calcData.hourlyRate;
            const remainingAmount = remaining * 4 * calcData.hourlyRate;
            const dailyTotal = first7Amount + hour8Amount + remainingAmount;
            
            detailHTML += `
                <p><strong>Hari ${index + 1} (${hours} jam):</strong></p>
                <p class="detail-formula">
                    ${first7} jam × 2 × Rp ${Math.round(calcData.hourlyRate)} = Rp ${Math.round(first7Amount).toLocaleString('id-ID')}<br>
                    ${hour8 ? `${hour8} jam × 3 × Rp ${Math.round(calcData.hourlyRate)} = Rp ${Math.round(hour8Amount).toLocaleString('id-ID')}<br>` : ''}
                    ${remaining ? `${remaining} jam × 4 × Rp ${Math.round(calcData.hourlyRate)} = Rp ${Math.round(remainingAmount).toLocaleString('id-ID')}<br>` : ''}
                    <strong>Sub-total: Rp ${Math.round(dailyTotal).toLocaleString('id-ID')}</strong>
                </p>
            `;
        });
        
        detailHTML += `
                <p><strong>Total Lembur Hari Libur: Rp ${Math.round(calcData.holidayPay).toLocaleString('id-ID')}</strong></p>
            </div>
        `;
    }
    
    document.getElementById('detailContent').innerHTML = detailHTML;
    document.getElementById('detailPopup').style.display = 'flex';
}

function closeDetailPopup() {
    document.getElementById('detailPopup').style.display = 'none';
}