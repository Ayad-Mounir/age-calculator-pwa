// ============================================================
// 🎂 حاسبة العمر الدقيقة — Age Calculator PWA v1.1.0
// ============================================================

// ===== عناصر DOM الأساسية =====
const birthdateInput = document.getElementById('birthdate');
const resultDiv = document.getElementById('result');
const countdownSection = document.getElementById('countdown-section');
const shareSection = document.getElementById('share-section');
const calcBtn = document.getElementById('calc-btn');
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');

// ===== متغيرات عامة =====
let countdownInterval = null;
let lastAgeResult = null; // تخزين آخر نتيجة للمشاركة

// ============================================================
// 🧮 دالة حساب العمر — محسّنة بدقة كاملة
// ============================================================
function calculateAge() {
    const input = birthdateInput.value;

    if (!input) {
        resultDiv.innerHTML = '<p class="error-msg">⚠️ ' + t('noInput') + '</p>';
        hideExtras();
        return;
    }

    const birthdate = new Date(input);
    const now = new Date();

    if (birthdate > now) {
        resultDiv.innerHTML = '<p class="error-msg">⚠️ ' + t('future') + '</p>';
        hideExtras();
        return;
    }

    // إظهار تأثير التحميل
    resultDiv.innerHTML = '<div class="loading-spinner">⏳ جارٍ الحساب...</div>';

    // تأخير بسيط للـ UX (للسماح برؤية الـ spinner)
    setTimeout(() => {
        computeAndDisplay(birthdate, now);
    }, 150);
}

function computeAndDisplay(birthdate, now) {
    const diffMs = now - birthdate;

    // ===== القيم الإجمالية =====
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);

    // ===== حساب دقيق للسنوات والأشهر والأيام =====
    let years = now.getFullYear() - birthdate.getFullYear();
    let months = now.getMonth() - birthdate.getMonth();
    let days = now.getDate() - birthdate.getDate();
    let hours = now.getHours() - birthdate.getHours();
    let minutes = now.getMinutes() - birthdate.getMinutes();
    let seconds = now.getSeconds() - birthdate.getSeconds();

    // تصحيح القيم السالبة (من الأسفل للأعلى)
    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0)   { hours += 24;   days--; }

    // تصحيح الأيام: استخدام عدد أيام الشهر السابق
    if (days < 0) {
        // الشهر السابق = الشهر الحالي - 1 (مع مراعاة شهر يناير)
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }

    // 🔧 الإصلاح الرئيسي: تصحيح الأشهر والسنوات بعد تصحيح الأيام
    if (months < 0) {
        months += 12;
        years--;
    }

    // التحقق من عيد الميلاد
    const isBirthday = now.getDate() === birthdate.getDate() && now.getMonth() === birthdate.getMonth();
    const birthdayMsg = isBirthday
        ? '<div class="birthday-message" role="alert">🎉🎂 ' + t('birthday') + ' 🎂🎉</div>'
        : '';

    // بناء نتيجة منسقة
    const ageLines = [
        { icon: '📅', label: t('years'),   value: years },
        { icon: '📆', label: t('months'),  value: months },
        { icon: '📅', label: t('weeks'),   value: totalWeeks.toLocaleString() },
        { icon: '☀️', label: t('days'),    value: totalDays.toLocaleString() },
        { icon: '⏰', label: t('hours'),   value: totalHours.toLocaleString() },
        { icon: '⏱️', label: t('minutes'), value: totalMinutes.toLocaleString() },
        { icon: '⏲️', label: t('seconds'), value: totalSeconds.toLocaleString() },
        { icon: '🕰️', label: t('hours'),   value: hours,   suffix: '(متبقية)' },
        { icon: '⏳', label: t('minutes'), value: minutes,  suffix: '(متبقية)' },
        { icon: '⌛', label: t('seconds'), value: seconds,  suffix: '(متبقية)' },
    ];

    // تخزين النتيجة للمشاركة
    const shareTextParts = ageLines.slice(0, 7).map(l =>
        `${l.icon} ${l.label}: ${l.value}`
    );
    lastAgeResult = {
        text: shareTextParts.join('\n'),
        years, months, totalDays
    };

    // العرض في DOM
    resultDiv.innerHTML = `
        ${birthdayMsg}
        <div class="age-result-grid">
            ${ageLines.slice(0, 7).map(l => `
                <div class="age-line">
                    <span class="age-icon">${l.icon}</span>
                    <span class="label">${l.label}:</span>
                    <span class="value">${l.value}</span>
                </div>
            `).join('')}
        </div>
        <div class="age-detail">
            ${ageLines.slice(7).map(l => `
                <span class="detail-item">${l.icon} ${l.value} ${l.label} ${l.suffix || ''}</span>
            `).join(' · ')}
        </div>
    `;

    // إظهار الأقسام الإضافية
    showExtras();

    // بدء العد التنازلي
    startCountdown(birthdate);

    // حفظ آخر تاريخ
    localStorage.setItem('lastBirthdate', input);
    localStorage.setItem('lastBirthdateLabel',
        `${years} ${t('years').replace(/^./, c => c)}${months > 0 ? `، ${months} ${t('months').replace(/^./, c => c)}` : ''}`);
}

function hideExtras() {
    countdownSection.style.display = 'none';
    shareSection.style.display = 'none';
}

function showExtras() {
    countdownSection.style.display = 'block';
    shareSection.style.display = 'flex';
    document.getElementById('save-btn').style.display = 'block';
}

// ============================================================
// ⏳ العد التنازلي لعيد الميلاد
// ============================================================
function startCountdown(birthdate) {
    if (countdownInterval) clearInterval(countdownInterval);

    const isFeb29 = birthdate.getMonth() === 1 && birthdate.getDate() === 29;

    function getNextBirthday(fromDate) {
        let year = fromDate.getFullYear();
        let month = birthdate.getMonth();
        let day = birthdate.getDate();

        // معالجة 29 فبراير: في السنوات غير الكبيسة، نستخدم 28 فبراير
        if (isFeb29 && !isLeapYear(year)) {
            day = 28;
        }

        let next = new Date(year, month, day,
            birthdate.getHours(), birthdate.getMinutes(), birthdate.getSeconds());

        if (next <= fromDate) {
            year++;
            if (isFeb29 && !isLeapYear(year)) {
                day = 28;
            }
            next = new Date(year, month, day,
                birthdate.getHours(), birthdate.getMinutes(), birthdate.getSeconds());
        }

        return next;
    }

    function isLeapYear(y) {
        return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    }

    function tick() {
        const now = new Date();
        const nextBirthday = getNextBirthday(now);

        const diff = nextBirthday - now;
        if (diff <= 0) {
            document.getElementById('cd-days').textContent = '🎉';
            document.getElementById('cd-hours').textContent = '🎂';
            document.getElementById('cd-mins').textContent = '🥳';
            document.getElementById('cd-secs').textContent = '🎈';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cd-days').textContent = days;
        document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cd-mins').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cd-secs').textContent = String(seconds).padStart(2, '0');

        // تحديث تسميات العد التنازلي حسب اللغة
        updateCountdownLabels();
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
}

function updateCountdownLabels() {
    const labels = document.querySelectorAll('.countdown-label');
    const keys = ['day', 'hour', 'min', 'sec'];
    labels.forEach((el, i) => {
        if (keys[i]) el.textContent = t(keys[i]);
    });
}

// ============================================================
// 🌙 الوضع الليلي
// ============================================================
(function initTheme() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        themeToggle.setAttribute('aria-label', 'تفعيل الوضع النهاري');
    } else {
        themeToggle.setAttribute('aria-label', 'تفعيل الوضع الليلي');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
            themeToggle.setAttribute('aria-label', 'تفعيل الوضع الليلي');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
            themeToggle.setAttribute('aria-label', 'تفعيل الوضع النهاري');
        }
    });
})();

// ============================================================
// 🌐 نظام الترجمة واللغات
// ============================================================
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
        noInput: 'الرجاء إدخال تاريخ الميلاد',
        future: 'تاريخ الميلاد لا يمكن أن يكون في المستقبل',
        birthday: 'كل عام وأنت بخير!',
        install: '📲 تثبيت التطبيق',
        installHint: 'ثبّت التطبيق على جهازك لاستخدامه دون إنترنت',
        savedTitle: '📂 تواريخ محفوظة',
        shareText: '🎂 عمري:',
        copySuccess: 'تم نسخ النتيجة!',
        savePrompt: 'أدخل اسماً لهذا التاريخ',
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
        noInput: 'Please enter your birth date',
        future: 'Birth date cannot be in the future',
        birthday: 'Happy Birthday!',
        install: '📲 Install App',
        installHint: 'Install this app on your device for offline use',
        savedTitle: '📂 Saved Dates',
        shareText: '🎂 My Age:',
        copySuccess: 'Result copied!',
        savePrompt: 'Enter a name for this date',
    },
    fr: {
        title: "🎂 Calcul d'Âge",
        subtitle: 'Entrez votre date de naissance pour calculer votre âge',
        calc: "🔍 Calculer l'Âge",
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
        noInput: 'Veuillez entrer votre date de naissance',
        future: 'La date de naissance ne peut pas être dans le futur',
        birthday: 'Joyeux Anniversaire!',
        install: "📲 Installer l'App",
        installHint: "Installez cette application pour l'utiliser hors ligne",
        savedTitle: '📂 Dates Sauvegardées',
        shareText: '🎂 Mon Âge:',
        copySuccess: 'Résultat copié!',
        savePrompt: 'Entrez un nom pour cette date',
    }
};

let currentLang = localStorage.getItem('lang') || 'ar';

function t(key) {
    return (translations[currentLang] || translations.ar)[key] || key;
}

function applyLang(lang) {
    const tr = translations[lang] || translations.ar;

    document.querySelector('h1').textContent = tr.title;
    document.getElementById('subtitle').textContent = tr.subtitle;
    calcBtn.textContent = tr.calc;
    document.getElementById('share-btn').textContent = tr.share;
    document.getElementById('save-btn').textContent = tr.save;

    // تحديث عنوان قسم العد التنازلي
    const cdTitle = document.querySelector('.countdown-section .section-title');
    if (cdTitle) cdTitle.textContent = tr.cdTitle;

    // تحديث عنوان قسم المحفوظات
    const savedTitle = document.querySelector('.saved-section .section-title');
    if (savedTitle) savedTitle.textContent = tr.savedTitle;

    // تحديث تلميح التثبيت
    const installHint = document.querySelector('.install-hint');
    if (installHint) installHint.textContent = tr.installHint;
    const installBtn = document.getElementById('install-btn');
    if (installBtn) installBtn.textContent = tr.install;

    // RTL/LTR
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
        langToggle.textContent = 'EN';
        langToggle.setAttribute('aria-label', 'Switch to English');
    } else if (lang === 'en') {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        langToggle.textContent = 'FR';
        langToggle.setAttribute('aria-label', 'Passer en Français');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'fr');
        langToggle.textContent = 'AR';
        langToggle.setAttribute('aria-label', 'التبديل إلى العربية');
    }

    // 🔧 تبديل manifest الديناميكي
    switchManifest(lang);

    // تحديث تسميات العد التنازلي
    updateCountdownLabels();

    currentLang = lang;
    localStorage.setItem('lang', lang);

    // تحديث عنوان الصفحة
    document.title = tr.title;
}

function switchManifest(lang) {
    const manifestMap = {
        ar: 'manifest.json',
        en: 'manifest-en.json',
        fr: 'manifest-fr.json'
    };
    const manifestHref = manifestMap[lang] || 'manifest.json';

    let link = document.querySelector('link[rel="manifest"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'manifest';
        document.head.appendChild(link);
    }
    link.href = manifestHref;
}

langToggle.addEventListener('click', () => {
    const next = currentLang === 'ar' ? 'en' : currentLang === 'en' ? 'fr' : 'ar';
    applyLang(next);
});

// تطبيق اللغة المحفوظة عند التحميل
applyLang(currentLang);

// ============================================================
// 📤 مشاركة النتيجة
// ============================================================
document.getElementById('share-btn').addEventListener('click', async () => {
    if (!lastAgeResult) return;

    const shareText = `${t('shareText')}\n${lastAgeResult.text}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: t('title'),
                text: shareText
            });
        } catch (err) {
            // المستخدم ألغى المشاركة — لا نفعل شيئاً
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareText);
            showToast('✅ ' + t('copySuccess'));
        } catch (err) {
            showToast('❌ فشل النسخ — حاول مرة أخرى');
        }
    }
});

// ===== Toast notification =====
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ============================================================
// 💾 حفظ التواريخ
// ============================================================
document.getElementById('save-btn').addEventListener('click', () => {
    const input = birthdateInput.value;
    if (!input) return;

    const name = prompt('📝 ' + t('savePrompt') + ':');
    if (!name) return;

    const saved = JSON.parse(localStorage.getItem('savedDates') || '[]');
    saved.push({ name, date: input, id: Date.now() });
    localStorage.setItem('savedDates', JSON.stringify(saved));

    renderSavedDates();
    showToast('✅ تم حفظ: ' + name);
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
        <div class="saved-item" role="listitem">
            <span class="saved-name">👤 ${escapeHTML(item.name)}</span>
            <span class="saved-date">${item.date}</span>
            <button class="saved-action-btn" onclick="loadSavedDate(${item.id})" title="اختيار" aria-label="تحميل ${escapeHTML(item.name)}">📂</button>
            <button class="saved-action-btn delete-btn" onclick="deleteSavedDate(${item.id})" title="حذف" aria-label="حذف ${escapeHTML(item.name)}">🗑️</button>
        </div>
    `).join('');
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function loadSavedDate(id) {
    const saved = JSON.parse(localStorage.getItem('savedDates') || '[]');
    const item = saved.find(d => d.id === id);
    if (item) {
        birthdateInput.value = item.date;
        calculateAge();
        // تمرير سلس للأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function deleteSavedDate(id) {
    let saved = JSON.parse(localStorage.getItem('savedDates') || '[]');
    const item = saved.find(d => d.id === id);
    saved = saved.filter(d => d.id !== id);
    localStorage.setItem('savedDates', JSON.stringify(saved));
    renderSavedDates();
    if (item) showToast('🗑️ تم حذف: ' + item.name);
}

// ============================================================
// 📲 PWA — تثبيت التطبيق
// ============================================================
let deferredPrompt = null;
const installContainer = document.getElementById('install-container');
const installBtn = document.getElementById('install-btn');

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installContainer.style.display = 'block';
});

if (isIOS) {
    const hint = document.createElement('div');
    hint.className = 'ios-install-hint';
    hint.innerHTML = '📱 <strong>لتثبيت التطبيق على iPhone/iPad:</strong><br>1. اضغط زر المشاركة 📤<br>2. اختر "إضافة إلى الشاشة الرئيسية" ➕<br>3. اضغط "إضافة" ✅';
    installContainer.appendChild(hint);
    hint.style.display = 'block';
}

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
            // للمتصفحات اللي ما تدعم beforeinstallprompt — نعرض تعليمات
            showToast('📱 استخدم قائمة المتصفح ← "تثبيت التطبيق" أو "إضافة للشاشة الرئيسية"');
            return;
        }
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
            installContainer.style.display = 'none';
            showToast('✅ تم تثبيت التطبيق بنجاح!');
        }
        deferredPrompt = null;
    });
}

window.addEventListener('appinstalled', () => {
    installContainer.style.display = 'none';
    deferredPrompt = null;
});

// ============================================================
// 🔄 تحميل تلقائي لآخر تاريخ
// ============================================================
(function loadLastDate() {
    const lastDate = localStorage.getItem('lastBirthdate');
    if (lastDate) {
        birthdateInput.value = lastDate;
        calculateAge();
    }
    renderSavedDates();
})();

// ============================================================
// 🔌 Service Worker — مع معالجة أخطاء
// ============================================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('✅ Service Worker مسجل:', registration.scope);

            // الاستماع للتحديثات
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // نسخة جديدة متاحة — نعرض إشعار للمستخدم
                            showToast('🔄 تحديث جديد متاح — سيتم التفعيل تلقائياً');
                        }
                    });
                }
            });
        })
        .catch(err => {
            console.warn('⚠️ فشل تسجيل Service Worker:', err.message);
            // التطبيق يعمل بشكل طبيعي بدون Service Worker
        });
}
