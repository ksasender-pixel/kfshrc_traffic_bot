# 🚦 بوت خدمات قسم المرور — KFSHRC

## تشغيل البوت محلياً
```bash
npm install
node bot.js
```

## رفعه على Railway.app (مجاني)
1. أنشئ حساب على railway.app
2. اضغط "New Project" → "Deploy from GitHub"
3. ارفع هذا المجلد على GitHub
4. اربطه بـ Railway
5. Start Command: `node bot.js`

## رفعه على Render.com (مجاني)
1. أنشئ حساب على render.com
2. "New Web Service" → ارفع المجلد
3. Start Command: `node bot.js`

## كيف يعمل البوت
1. الموظف يفتح البوت ويكتب /start
2. يدخل كوده الوظيفي (مثال: Kfshrc-101)
3. يختار نوع التقرير من الأزرار
4. يؤكد التاريخ والوقت التلقائي أو يعدله
5. يختار الوردية
6. يملأ بيانات التقرير خطوة بخطوة
7. يرسل الصور (اختياري)
8. يضغط "إرسال التقرير"
9. يُحفظ في Google Sheets ويصل إشعار للمدير على Telegram
