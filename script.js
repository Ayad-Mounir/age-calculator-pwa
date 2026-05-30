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
    
    let years = now.getFullYear() - birthdate.getFullYear();
    let months = now.getMonth() - birthdate.getMonth();
    let days = now.getDate() - birthdate.getDate();
    let hours = now.getHours() - birthdate.getHours();
    let minutes = now.getMinutes() - birthdate.getMinutes();
    let seconds = now.getSeconds() - birthdate.getSeconds();
    
    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) { months += 12; years--; }
    
    // التحقق من تاريخ الميلاد — رسالة عيد ميلاد
    const isBirthday = now.getDate() === birthdate.getDate() && now.getMonth() === birthdate.getMonth();
    const birthdayMsg = isBirthday ? '<div class="birthday-message">🎉🎂 كل عام وأنت بخير! 🎂🎉</div>' : '';
    
    resultDiv.innerHTML = `
        ${birthdayMsg}
        <div class="age-line">📅 <span class="label">السنوات:</span> <span class="value">${years}</span></div>
        <div class="age-line">📆 <span class="label">الأشهر:</span> <span class="value">${months}</span></div>
        <div class="age-line">📅 <span class="label">الأسابيع:</span> <span class="value">${totalWeeks.toLocaleString()}</span></div>
        <div class="age-line">☀️ <span class="label">الأيام:</span> <span class="value">${totalDays.toLocaleString()}</span></div>
        <div class="age-line">⏰ <span class="label">الساعات:</span> <span class="value">${totalHours.toLocaleString()}</span></div>
        <div class="age-line">⏱️ <span class="label">الدقائق:</span> <span class="value">${totalMinutes.toLocaleString()}</span></div>
        <div class="age-line">⏲️ <span class="label">الثواني:</span> <span class="value">${totalSeconds.toLocaleString()}</span></div>
    `;
    
    // إظهار العد التنازلي وأزرار المشاركة
    document.getElementById('countdown-section').style.display = 'block';
    document.getElementById('share-section').style.display = 'flex';
    
    // بدء العد التنازلي
    startCountdown(birthdate);
    
    // حفظ آخر تاريخ للحساب
    localStorage.setItem('lastBirthdate', input);
    localStorage.setItem('lastBirthdateLabel', 
        `${years} سنة${months > 0 ? ` و${months} شهر` : ''}`);
}

// ===== العد التنازلي لعيد الميلاد =====
let countdownInterval = null;

function startCountdown(birthdate) {
    if (countdownInterval) clearInterval(countdownInterval);
    
    function tick() {
        const now = new Date();
        let nextBirthday = new Date(now.getFullYear(), birthdate.getMonth(), birthdate.getDate());
        
        if (nextBirthday <= now) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        
        const diff = nextBirthday - now;
        if (diff <= 0) return;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('cd-days').textContent = days;
        document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cd-mins').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cd-secs').textContent = String(seconds).padStart(2, '0');
    }
    
    tick();
    countdownInterval = setInterval(tick, 1000);
}

// ===== الوضع الليلي =====
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    }
});

// ===== تبديل اللغة =====
let currentLang = localStorage.getItem('lang') || 'ar';
const langToggle = document.getElementById('lang-toggle');

const translations = {
    ar: {
        title: '🎂 حاسبة العمر الدقيقة',
        subtitle: 'أدخل تاريخ ميلادك لحساب عمرك بالتفصيل',
        calc: '🔍 احسب العمر',
        cdTitle: '🎉 العد التنازلي لعيد ميلادك القادم',
        day: 'يوم',
        hour: 'ساعة',
        min: 'دقيقة',
        sec: 'ثانية',
        share: '📤 شارك عمرك',
        save: '💾 حفظ',
        years: 'السنوات',
        months: 'الأشهر',
        weeks: 'الأسابيع',
        days: 'الأيام',
        hours: 'الساعات',
        minutes: 'الدقائق',
        seconds: 'الثواني',
        noInput: '⚠️ الرجاء إدخال تاريخ الميلاد',
        future: '⚠️ تاريخ الميلاد لا يمكن أن يكون في المستقبل',
        birthday: '🎉🎂 كل عام وأنت بخير! 🎂🎉'
    },
    en: {
        title: '🎂 Age Calculator',
        subtitle: 'Enter your birth date to calculate your exact age',
        calc: '🔍 Calculate Age',
        cdTitle: '🎉 Countdown to Your Next Birthday',
        day: 'Day',
        hour: 'Hour',
        min: 'Min',
        sec: 'Sec',
        share: '📤 Share Your Age',
        save: '💾 Save',
        years: 'Years',
        months: 'Months',
        weeks: 'Weeks',
        days: 'Days',
        hours: 'Hours',
        minutes: 'Minutes',
        seconds: 'Seconds',
        noInput: '⚠️ Please enter your birth date',
        future: '⚠️ Birth date cannot be in the future',
        birthday: '🎉🎂 Happy Birthday! 🎂🎉'
    },
    fr: {
        title: '🎂 Calcul d\'Âge',
        subtitle: 'Entrez votre date de naissance pour calculer votre âge',
        calc: '🔍 Calculer l\'Âge',
        cdTitle: '🎉 Compte à Rebours pour Votre Anniversaire',
        day: 'Jour',
        hour: 'Heure',
        min: 'Min',
        sec: 'Sec',
        share: '📤 Partager Votre Âge',
        save: '💾 Sauvegarder',
        years: 'Années',
        months: 'Mois',
        weeks: 'Semaines',
        days: 'Jours',
        hours: 'Heures',
        minutes: 'Minutes',
        seconds: 'Secondes',
        noInput: '⚠️ Veuillez entrer votre date de naissance',
        future: '⚠️ La date de naissance ne peut pas être dans le futur',
        birthday: '🎉🎂 Joyeux Anniversaire! 🎂🎉'
    }
};

function applyLang(lang) {
    const t = translations[lang] || translations.ar;
    document.querySelector('h1').textContent = t.title;
    document.getElementById('subtitle').textContent = t.subtitle;
    document.getElementById('calc-btn').textContent = t.calc;
    
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
        langToggle.textContent = 'EN';
    } else if (lang === 'en') {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        langToggle.textContent = 'FR';
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'fr');
        langToggle.textContent = 'AR';
    }
    
    currentLang = lang;
    localStorage.setItem('lang', lang);
}

langToggle.addEventListener('click', () => {
    const next = currentLang === 'ar' ? 'en' : currentLang === 'en' ? 'fr' : 'ar';
    applyLang(next);
});

// تطبيق اللغة المحفوظة
applyLang(currentLang);

// ===== مشاركة العمر =====
document.getElementById('share-btn').addEventListener('click', () => {
    const result = document.getElementById('result').innerText;
    const text = `🎂 عمري:\n${result}`;
    
    if (navigator.share) {
        navigator.share({ title: 'حاسبة العمر', text: text });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ تم نسخ النتيجة!');
        });
    }
});

// ===== حفظ التواريخ =====
document.getElementById('save-btn').addEventListener('click', () => {
    const input = document.getElementById('birthdate').value;
    if (!input) return;
    
    const name = prompt('📝 أدخل اسمًا لهذا التاريخ (مثال: "أمي" أو "أبي"):');
    if (!name) return;
    
    const saved = JSON.parse(localStorage.getItem('savedDates') || '[]');
    saved.push({ name, date: input, id: Date.now() });
    localStorage.setItem('savedDates', JSON.stringify(saved));
    
    renderSavedDates();
});

function renderSavedDates() {
    const saved = JSON.parse(localStorage.getItem('savedDates') || '[]');
    const list = document.getElementById('saved-list');
    const section = document.getElementById('saved-section');
    
    if (saved.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    list.innerHTML = saved.map(item => `
        <div class="saved-item">
            <span class="saved-name">👤 ${item.name}</span>
            <span class="saved-date">${item.date}</span>
            <button class="delete-btn" onclick="loadSavedDate(${item.id})" title="اختيار">📂</button>
            <button class="delete-btn" onclick="deleteSavedDate(${item.id})" title="حذف">❌</button>
        </div>
    `).join('');
}

function loadSavedDate(id) {
    const saved = JSON.parse(localStorage.getItem('savedDates') || '[]');
    const item = saved.find(d => d.id === id);
    if (item) {
        document.getElementById('birthdate').value = item.date;
        calculateAge();
    }
}

function deleteSavedDate(id) {
    let saved = JSON.parse(localStorage.getItem('savedDates') || '[]');
    saved = saved.filter(d => d.id !== id);
    localStorage.setItem('savedDates', JSON.stringify(saved));
    renderSavedDates();
}

// ===== تحميل آخر تاريخ محسوب =====
const lastDate = localStorage.getItem('lastBirthdate');
if (lastDate) {
    document.getElementById('birthdate').value = lastDate;
    calculateAge();
}

// عرض التواريخ المحفوظة عند التحميل
renderSavedDates();

// إظهار زر الحفظ بعد الحساب
const observer = new MutationObserver(() => {
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn && document.getElementById('result').innerHTML.trim()) {
        saveBtn.style.display = 'block';
    }
});
observer.observe(document.getElementById('result'), { childList: true, subtree: true });

// ===== PWA Install Prompt =====
let deferredPrompt = null;
const installContainer = document.getElementById('install-container');
const installBtn = document.getElementById('install-btn');

// كشف iOS Safari لعرض تعليمات التثبيت اليدوي
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installContainer.style.display = 'block';
});

// iOS: لا يدعم beforeinstallprompt — نضيف تلميح يدوي
if (isIOS) {
    const hint = document.createElement('div');
    hint.className = 'ios-install-hint';
    hint.innerHTML = '📱 <strong>لتثبيت التطبيق على iPhone/iPad:</strong><br>1. اضغط زر المشاركة 📤<br>2. اختر "إضافة إلى الشاشة الرئيسية" ➕<br>3. اضغط "إضافة" ✅';
    installContainer.appendChild(hint);
    hint.style.display = 'block';
}

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
            installContainer.style.display = 'none';
        }
        deferredPrompt = null;
    });
}

window.addEventListener('appinstalled', () => {
    installContainer.style.display = 'none';
    deferredPrompt = null;
});
