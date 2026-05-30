function calculateAge() {
    const input = document.getElementById('birthdate').value;
    const resultDiv = document.getElementById('result');
    
    if (!input) {
        resultDiv.innerHTML = '<p style="color:red;">⚠️ الرجاء إدخال تاريخ الميلاد</p>';
        return;
    }
    
    const birthdate = new Date(input);
    const now = new Date();
    
    if (birthdate > now) {
        resultDiv.innerHTML = '<p style="color:red;">⚠️ تاريخ الميلاد لا يمكن أن يكون في المستقبل</p>';
        return;
    }
    
    const diffMs = now - birthdate;
    
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    
    // Calculate exact components
    let years = now.getFullYear() - birthdate.getFullYear();
    let months = now.getMonth() - birthdate.getMonth();
    let days = now.getDate() - birthdate.getDate();
    let hours = now.getHours() - birthdate.getHours();
    let minutes = now.getMinutes() - birthdate.getMinutes();
    let seconds = now.getSeconds() - birthdate.getSeconds();
    
    // Adjust for negative values
    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        // Get days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }
    
    resultDiv.innerHTML = `
        <div class="age-line">📅 <span class="label">السنوات:</span> <span class="value">${years}</span></div>
        <div class="age-line">📆 <span class="label">الأشهر:</span> <span class="value">${months}</span></div>
        <div class="age-line">📅 <span class="label">الأسابيع:</span> <span class="value">${totalWeeks.toLocaleString()}</span></div>
        <div class="age-line">☀️ <span class="label">الأيام:</span> <span class="value">${totalDays.toLocaleString()}</span></div>
        <div class="age-line">⏰ <span class="label">الساعات:</span> <span class="value">${totalHours.toLocaleString()}</span></div>
        <div class="age-line">⏱️ <span class="label">الدقائق:</span> <span class="value">${totalMinutes.toLocaleString()}</span></div>
        <div class="age-line">⏲️ <span class="label">الثواني:</span> <span class="value">${totalSeconds.toLocaleString()}</span></div>
    `;
}