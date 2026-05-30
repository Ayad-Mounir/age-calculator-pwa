
<p align="center">
  <img src="icon.svg" alt="حاسبة العمر" width="120" height="120">
</p>

<h1 align="center">🎂 حاسبة العمر الدقيقة</h1>
<p align="center">
  <strong>Progressive Web App</strong> — احسب عمرك بالسنوات والأشهر والأسابيع والأيام والساعات والدقائق والثواني
</p>

<p align="center">
  <img src="https://img.shields.io/badge/الحالة-نشط-success?style=flat-square">
  <img src="https://img.shields.io/badge/PWA-✓-blue?style=flat-square">
  <img src="https://img.shields.io/badge/اللغة-العربية-green?style=flat-square">
  <img src="https://img.shields.io/badge/ترخيص-MIT-yellow?style=flat-square">
</p>

---

## ✨ الميزات

| الميزة | الوصف |
|---|---|
| 📅 **حساب تفصيلي** | السنوات، الأشهر، الأسابيع، الأيام، الساعات، الدقائق والثواني |
| 📱 **PWA كامل** | يعمل كتطبيق أصلي على الهاتف والحاسوب |
| 🌐 **بدون إنترنت** | يدعم التصفح دون اتصال بفضل Service Worker |
| 🎨 **تصميم عصري** | واجهة جميلة بتدرج أزرق-بنفسجي مع خطوط واضحة |
| 🇸🇦 **واجهة عربية** | دعم كامل للغة العربية والاتجاه من اليمين لليسار |
| ⚡ **سريع وخفيف** | لا يحتاج أي مكتبات خارجية — HTML + CSS + JS نقية |

---

## 🚀 بدء الاستخدام

### 🌐 عبر الإنترنت

افتح الرابط التالي في متصفحك:

```
https://ayad-mounir.github.io/Gemini/
```

### 📲 التثبيت كتطبيق (PWA)

1. افتح الرابط في متصفح **Chrome** أو **Edge** أو **Safari**
2. ستظهر لك رسالة "تثبيت التطبيق" (Install App)
3. اضغط على تثبيت — سيتم تثبيت حاسبة العمر كتطبيق مستقل على جهازك

---

## 🛠️ التقنيات المستخدمة

<div align="center">

| التقنية | الاستخدام |
|---|---|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | هيكل الصفحة |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | التصميم والتنسيق |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | منطق التطبيق وحساب العمر |
| ![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white) | تطبيق ويب تقدمي (Offline + Install) |

</div>

---

## 📂 هيكل المشروع

```
Gemini/
├── 📄 index.html      # الصفحة الرئيسية (RTL — عربي)
├── 🎨 style.css       # التصميم والتنسيق
├── ⚙️ script.js       # منطق حساب العمر
├── 📱 manifest.json   # إعدادات PWA
├── 🔄 sw.js           # Service Worker (دعم عدم الاتصال)
├── 🖼️ icon.svg        # أيقونة التطبيق
└── 📖 README.md       # هذا الملف
```

---

## 🧮 طريقة الحساب

يقوم التطبيق بحساب عمرك بدقة عن طريق:

1. أخذ **تاريخ الميلاد** المُدخل
2. مقارنته بـ **التاريخ والوقت الحاليين**
3. حساب الفرق بالسنوات ← الأشهر ← الأيام ← الساعات ← الدقائق ← الثواني
4. عرض النتائج بطريقة تفصيلية سهلة القراءة

> يقوم التطبيق بضبط القيم السالبة تلقائياً (مثلاً: إذا كانت الثواني سالبة، يتم استلاف دقيقة كاملة).

---

## 🤝 المساهمة

نرحب بمساهماتك! يمكنك:

1. **Fork** المستودع
2. إنشاء فرع للميزة: `git checkout -b feature/ميزة-جديدة`
3. تنفيذ التعديلات
4. رفع التعديلات: `git push origin feature/ميزة-جديدة`
5. فتح **Pull Request**

---

## 📄 الترخيص

تم تطوير هذا المشروع بواسطة **Mounir Ayad**  
مرخص تحت رخصة **MIT** — راجع ملف [LICENSE](LICENSE) للمزيد من التفاصيل.

---

<p align="center">
  <strong>بـ ❤️ من المغرب</strong><br>
  <sub>صُنع بواسطة <a href="https://github.com/Ayad-Mounir">Mounir Ayad</a></sub>
</p>
