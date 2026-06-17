const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// ===== إعدادات =====
const TOKEN = '7972579610:AAHJmQZFKm0adMmLJObcLsTxUmZ5p4xxBlw';
const MANAGER_CHAT_ID = '1691033646';
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyEWQ0rYZ_JqwEjTY-4oktfiIatWCLnKufTZ6vr1mIpGKNbgKj0j_roURk_M4OxIz926w/exec';

const bot = new TelegramBot(TOKEN, { polling: true });

// ===== بيانات الموظفين =====
const EMPLOYEES = {
  'Kfshrc-101': 'عبد الله احمد علي الأسمري',
  'Kfshrc-102': 'احمد سالم عبد الله البيشي',
  'Kfshrc-103': 'حمدان عبد الله ناصر البيشي',
  'Kfshrc-104': 'باسل فهد راشد الوادي',
  'Kfshrc-105': 'محمد عائش عبد الله البيشي',
  'Kfshrc-106': 'فايز محمد رشيد الصامل',
  'Kfshrc-107': 'سعد عبد الله محمد توفيق',
  'Kfshrc-108': 'محمد ساحب عبده مكبش',
  'Kfshrc-109': 'منصور احمد محمد عسيري',
  'Kfshrc-110': 'علي محبوب مبارك البيشي',
  'Kfshrc-111': 'سلطان حمد هادي القحطاني',
  'Kfshrc-112': 'فيصل صالح سليمان المريشد',
  'Kfshrc-113': 'عبدالعزيز علي احمد الأحمري',
  'Kfshrc-114': 'احمد اسماعيل يحي طواشي',
  'Kfshrc-115': 'علي عبد الله علي الخضير',
  'Kfshrc-116': 'سامي عايض مطلق الشيباني',
  'Kfshrc-117': 'فيصل سالم سعيد القرني',
  'Kfshrc-118': 'بندر ربيع سالم العنزي',
  'Kfshrc-119': 'علي حسن محمد الأحمدي',
  'Kfshrc-120': 'بسام مبارك محمد الشهراني',
  'Kfshrc-121': 'بندر مطلق شويمي الشيباني',
  'Kfshrc-122': 'احمد علي احمد عنقي',
  'Kfshrc-123': 'نواف مطلق عبد الله العصيمي',
  'Kfshrc-124': 'فيصل عوض طنف الحزيمي',
  'Kfshrc-125': 'سلطان ظافر محمد القرني',
  'Kfshrc-126': 'الوليد محمد سالم الهواملة',
  'Kfshrc-127': 'عبد الله سعد عبد الله الشهراني',
  'Kfshrc-128': 'فهد عيد',
  'Kfshrc-129': 'عبدالمجيد الحربي',
  'Kfshrc-130': 'عبد الله لغبي',
  'Kfshrc-131': 'مشعل العنزي',
  'Kfshrc-132': 'احمد المحبوب',
  'Kfshrc-133': 'أيوب العنزي',
  'Kfshrc-134': 'حسن شراحيلي',
  'Kfshrc-135': 'عبدالعزيز الشهراني',
  'Kfshrc-136': 'بدر الدوسري',
  'Kfshrc-137': 'فهد الهويمل',
  'Kfshrc-138': 'بدران الناعس',
  'Kfshrc-139': 'مقرن الدوسري',
  'Kfshrc-140': 'محمد جمعان',
  'Kfshrc-141': 'عبدالعزيز المقيطيب',
  'Kfshrc-142': 'حزام الشهري',
  'Kfshrc-143': 'ماهر الحربي',
  'Kfshrc-144': 'سلطان الدوسري',
  'Kfshrc-145': 'سلطان العصيمي',
  'Kfshrc-146': 'عبد الله الحربي',
  'Kfshrc-147': 'خالد محمد إلياس',
  'Kfshrc-148': 'احمد الشهيل',
};

// ===== حالات المستخدمين =====
const sessions = {};

// ===== دوال مساعدة =====
function getDateTime() {
  const now = new Date();
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const d = now.getDate().toString().padStart(2, '0');
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const y = now.getFullYear();
  const h = now.getHours().toString().padStart(2, '0');
  const min = now.getMinutes().toString().padStart(2, '0');
  return {
    date: `${d}/${m}/${y}`,
    day: days[now.getDay()],
    time: `${h}:${min}`,
  };
}

function mainMenu(chatId, name) {
  bot.sendMessage(chatId,
    `👋 أهلاً *${name}*\n\nاختر نوع التقرير:`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [
          [{ text: '🚨 حادث مروري' }, { text: '🔧 خدمة مرورية' }],
          [{ text: '👮 تقرير رجل المرور' }],
        ],
        resize_keyboard: true,
      }
    }
  );
}

function confirmDateTime(chatId, dt) {
  bot.sendMessage(chatId,
    `📅 *التاريخ:* ${dt.date}\n📆 *اليوم:* ${dt.day}\n🕐 *الوقت:* ${dt.time}\n\nهل البيانات صحيحة؟`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ صحيح', callback_data: 'dt_confirm' },
            { text: '✏️ تعديل', callback_data: 'dt_edit' },
          ]
        ]
      }
    }
  );
}

async function sendToSheets(data) {
  try {
    await axios.post(SHEET_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return true;
  } catch (e) {
    return false;
  }
}

function notifyManager(message) {
  bot.sendMessage(MANAGER_CHAT_ID, message, { parse_mode: 'HTML' });
}

// ===== بدء المحادثة =====
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sessions[chatId] = { step: 'login' };
  bot.sendMessage(chatId,
    '🚦 *خدمات قسم المرور — KFSHRC*\n\nمرحباً! أدخل كودك الوظيفي للدخول:',
    {
      parse_mode: 'Markdown',
      reply_markup: { remove_keyboard: true }
    }
  );
});

// ===== معالجة الرسائل =====
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const session = sessions[chatId];

  if (!text) return;
  if (text === '/start') return;

  // لا يوجد session
  if (!session) {
    sessions[chatId] = { step: 'login' };
    bot.sendMessage(chatId, 'أدخل كودك الوظيفي للدخول:');
    return;
  }

  // ===== تسجيل الدخول =====
  if (session.step === 'login') {
    const code = text.trim();
    const empName = EMPLOYEES[code];
    if (!empName) {
      bot.sendMessage(chatId, '❌ كود غير صحيح. حاول مرة أخرى:');
      return;
    }
    session.code = code;
    session.name = empName;
    session.step = 'main';
    mainMenu(chatId, empName);
    return;
  }

  // ===== القائمة الرئيسية =====
  if (session.step === 'main') {
    const dt = getDateTime();
    session.dt = dt;

    if (text === '🚨 حادث مروري') {
      session.type = 'حادث مروري';
      session.data = {};
      session.step = 'dt_confirm';
      confirmDateTime(chatId, dt);
    } else if (text === '🔧 خدمة مرورية') {
      session.type = 'خدمة مرورية';
      session.data = {};
      session.step = 'dt_confirm';
      confirmDateTime(chatId, dt);
    } else if (text === '👮 تقرير رجل المرور') {
      session.type = 'تقرير رجل مرور';
      session.data = {};
      session.step = 'dt_confirm';
      confirmDateTime(chatId, dt);
    }
    return;
  }

  // ===== تعديل التاريخ =====
  if (session.step === 'dt_edit_date') {
    session.dt.date = text.trim();
    session.step = 'dt_edit_time';
    bot.sendMessage(chatId, '🕐 أدخل الوقت (مثال: 09:30):');
    return;
  }

  if (session.step === 'dt_edit_time') {
    session.dt.time = text.trim();
    session.step = 'dt_edit_shift';
    bot.sendMessage(chatId, '🔄 اختر الوردية:', {
      reply_markup: {
        keyboard: [
          [{ text: '🌅 صباح' }, { text: '🌆 مساء' }, { text: '🌙 ليل' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    });
    return;
  }

  if (session.step === 'dt_edit_shift') {
    session.dt.shift = text.replace(/[🌅🌆🌙]\s*/, '').trim();
    session.step = 'report_start';
    startReport(chatId, session);
    return;
  }

  // ===== اختيار الوردية المباشر =====
  if (session.step === 'shift_select') {
    session.dt.shift = text.replace(/[🌅🌆🌙]\s*/, '').trim();
    session.step = 'report_start';
    startReport(chatId, session);
    return;
  }

  // ===== مراحل الحادث =====
  if (session.type === 'حادث مروري') {
    await handleAccident(chatId, session, text, msg);
  } else if (session.type === 'خدمة مرورية') {
    await handleService(chatId, session, text, msg);
  } else if (session.type === 'تقرير رجل المرور') {
    await handleOfficerReport(chatId, session, text, msg);
  }
});

// ===== اختيار الوردية =====
function startReport(chatId, session) {
  if (!session.dt.shift) {
    session.step = 'shift_select';
    bot.sendMessage(chatId, '🔄 اختر الوردية:', {
      reply_markup: {
        keyboard: [
          [{ text: '🌅 صباح' }, { text: '🌆 مساء' }, { text: '🌙 ليل' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    });
    return;
  }
  beginReport(chatId, session);
}

function beginReport(chatId, session) {
  if (session.type === 'حادث مروري') {
    session.step = 'acc_type';
    bot.sendMessage(chatId, '⚠️ اختر نوع الحادث:', {
      reply_markup: {
        keyboard: [
          [{ text: 'ممتلكات - نجم' }, { text: 'ممتلكات - مرور 911' }],
          [{ text: 'دهس - مرور 911' }, { text: 'بين مركبات (مع تأمين) - نجم' }],
          [{ text: 'بين مركبات (بدون تأمين) - مرور 911' }],
          [{ text: 'كارثة طبيعية / تسرب - دفاع مدني 911' }],
          [{ text: 'تنازل بين الأطراف' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    });
  } else if (session.type === 'خدمة مرورية') {
    session.step = 'svc_type';
    bot.sendMessage(chatId, '🛠️ اختر نوع الخدمة:', {
      reply_markup: {
        keyboard: [
          [{ text: '🔓 فتح مركبة' }, { text: '💨 نفخ كفر' }],
          [{ text: '🚛 سطحة' }, { text: '🔋 اشتراك بطارية' }],
          [{ text: '🔗 كلبشة (فتح)' }, { text: '🔗 كلبشة (قفل)' }],
          [{ text: '🚜 سحب مركبة' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    });
  } else if (session.type === 'تقرير رجل المرور') {
    session.step = 'off_location';
    bot.sendMessage(chatId, '📍 أدخل الموقع:', {
      reply_markup: { remove_keyboard: true }
    });
  }
}

// ===== معالجة الحادث =====
async function handleAccident(chatId, session, text, msg) {
  const d = session.data;

  if (session.step === 'acc_type') {
    d.نوع_الحادث = text;
    session.step = 'acc_location';
    bot.sendMessage(chatId, '📍 أدخل موقع الحادث:', { reply_markup: { remove_keyboard: true } });
  } else if (session.step === 'acc_location') {
    d.موقع_الحادث = text;
    session.step = 'acc_parties';
    bot.sendMessage(chatId, '👥 كم عدد أطراف الحادث؟', {
      reply_markup: {
        keyboard: [
          [{ text: '1' }, { text: '2' }, { text: '3' }],
          [{ text: '4' }, { text: '5' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    });
  } else if (session.step === 'acc_parties') {
    const n = parseInt(text) || 1;
    d.عدد_الأطراف = n;
    d.currentParty = 1;
    d.parties = {};
    session.step = 'acc_party_plate';
    bot.sendMessage(chatId, `🚗 الطرف الأول — رقم اللوحة:`, { reply_markup: { remove_keyboard: true } });
  } else if (session.step === 'acc_party_plate') {
    const i = d.currentParty;
    d.parties[`ط${i}_رقم_اللوحة`] = text;
    session.step = 'acc_party_driver';
    bot.sendMessage(chatId, `👤 الطرف ${i} — اسم السائق:`);
  } else if (session.step === 'acc_party_driver') {
    const i = d.currentParty;
    d.parties[`ط${i}_السائق`] = text;
    session.step = 'acc_party_phone';
    bot.sendMessage(chatId, `📱 الطرف ${i} — رقم التواصل:`);
  } else if (session.step === 'acc_party_phone') {
    const i = d.currentParty;
    d.parties[`ط${i}_التواصل`] = text;
    session.step = 'acc_party_id';
    bot.sendMessage(chatId, `🪪 الطرف ${i} — رقم الهوية:`);
  } else if (session.step === 'acc_party_id') {
    const i = d.currentParty;
    d.parties[`ط${i}_الهوية`] = text;
    if (i < d.عدد_الأطراف) {
      d.currentParty++;
      session.step = 'acc_party_plate';
      bot.sendMessage(chatId, `🚗 الطرف ${d.currentParty} — رقم اللوحة:`);
    } else {
      session.step = 'acc_tow';
      bot.sendMessage(chatId, '🚛 هل تحتاج سطحة؟', {
        reply_markup: {
          keyboard: [[{ text: '✅ نعم' }, { text: '❌ لا' }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        }
      });
    }
  } else if (session.step === 'acc_tow') {
    if (text === '✅ نعم') {
      session.step = 'acc_tow_count';
      bot.sendMessage(chatId, '🚛 كم سطحة تحتاج؟', {
        reply_markup: {
          keyboard: [[{ text: '1' }, { text: '2' }, { text: '3' }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        }
      });
    } else {
      session.step = 'acc_supervisor';
      bot.sendMessage(chatId, '👮 اسم مشرف الفترة:', { reply_markup: { remove_keyboard: true } });
    }
  } else if (session.step === 'acc_tow_count') {
    d.عدد_السطحات = parseInt(text) || 1;
    d.currentTow = 1;
    d.tows = {};
    session.step = 'acc_tow_plate';
    bot.sendMessage(chatId, `🚛 السطحة الأولى — رقم اللوحة:`, { reply_markup: { remove_keyboard: true } });
  } else if (session.step === 'acc_tow_plate') {
    const i = d.currentTow;
    d.tows[`س${i}_اللوحة`] = text;
    session.step = 'acc_tow_driver';
    bot.sendMessage(chatId, `🚛 السطحة ${i} — اسم السائق:`);
  } else if (session.step === 'acc_tow_driver') {
    const i = d.currentTow;
    d.tows[`س${i}_الاسم`] = text;
    if (i < d.عدد_السطحات) {
      d.currentTow++;
      session.step = 'acc_tow_plate';
      bot.sendMessage(chatId, `🚛 السطحة ${d.currentTow} — رقم اللوحة:`);
    } else {
      session.step = 'acc_supervisor';
      bot.sendMessage(chatId, '👮 اسم مشرف الفترة:', { reply_markup: { remove_keyboard: true } });
    }
  } else if (session.step === 'acc_supervisor') {
    d.مشرف_الفترة = text;
    session.step = 'acc_photos';
    bot.sendMessage(chatId, '📷 أرسل صور الحادث (حتى 5 صور) ثم اضغط "إرسال التقرير":', {
      reply_markup: {
        keyboard: [[{ text: '✅ إرسال التقرير' }]],
        resize_keyboard: true,
      }
    });
    session.photos = [];
  } else if (session.step === 'acc_photos') {
    if (text === '✅ إرسال التقرير') {
      await submitAccident(chatId, session);
    }
  }
}

// ===== معالجة الصور للحوادث =====
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const session = sessions[chatId];
  if (!session) return;
  if (!session.photos) session.photos = [];

  if (session.step === 'acc_photos' || session.step === 'svc_photos' || session.step === 'off_photos') {
    if (session.photos.length >= 5) {
      bot.sendMessage(chatId, '⚠️ وصلت للحد الأقصى (5 صور)');
      return;
    }
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    session.photos.push(fileId);
    bot.sendMessage(chatId, `✅ تم استلام الصورة ${session.photos.length}/5`);
  }
});

// ===== إرسال الحادث =====
async function submitAccident(chatId, session) {
  const d = session.data;
  const dt = session.dt;

  const formData = {
    نوع_التقرير: 'حادث مروري',
    التاريخ: dt.date,
    اليوم: dt.day,
    الوقت: dt.time,
    الوردية: dt.shift || '',
    نوع_الحادث: d.نوع_الحادث,
    موقع_الحادث: d.موقع_الحادث,
    عدد_الأطراف: d.عدد_الأطراف,
    منفذ_الخدمة: session.name,
    مشرف_الفترة: d.مشرف_الفترة || '',
    ...d.parties,
    ...(d.tows || {}),
    الصور: [],
  };

  bot.sendMessage(chatId, '⏳ جاري إرسال التقرير...');
  const ok = await sendToSheets(formData);

  if (ok) {
    bot.sendMessage(chatId, '✅ تم إرسال تقرير الحادث بنجاح!', {
      reply_markup: { remove_keyboard: true }
    });
    notifyManager(
      `🚨 <b>حادث مروري جديد</b>\n` +
      `📅 ${dt.date} — ${dt.day}\n` +
      `🕐 ${dt.time} | الوردية: ${dt.shift || '—'}\n` +
      `⚠️ نوع الحادث: ${d.نوع_الحادث}\n` +
      `📍 الموقع: ${d.موقع_الحادث}\n` +
      `👥 الأطراف: ${d.عدد_الأطراف}\n` +
      `👮 المنفذ: ${session.name}`
    );
  } else {
    bot.sendMessage(chatId, '❌ خطأ في الإرسال، حاول مرة أخرى');
  }

  session.step = 'main';
  setTimeout(() => mainMenu(chatId, session.name), 2000);
}

// ===== معالجة الخدمة =====
async function handleService(chatId, session, text, msg) {
  const d = session.data;

  if (session.step === 'svc_type') {
    d.نوع_الخدمة = text.replace(/[🔓💨🚛🔋🔗🚜]\s*/, '').trim();
    session.step = 'svc_location';
    bot.sendMessage(chatId, '📍 أدخل موقع الخدمة:', { reply_markup: { remove_keyboard: true } });
  } else if (session.step === 'svc_location') {
    d.موقع_الخدمة = text;
    session.step = 'svc_plate';
    bot.sendMessage(chatId, '🚗 رقم لوحة المركبة:');
  } else if (session.step === 'svc_plate') {
    d.رقم_اللوحة = text;
    session.step = 'svc_driver';
    bot.sendMessage(chatId, '👤 اسم السائق:');
  } else if (session.step === 'svc_driver') {
    d.اسم_السائق = text;
    session.step = 'svc_phone';
    bot.sendMessage(chatId, '📱 رقم التواصل:');
  } else if (session.step === 'svc_phone') {
    d.رقم_التواصل = text;
    session.step = 'svc_id';
    bot.sendMessage(chatId, '🪪 رقم هوية السائق:');
  } else if (session.step === 'svc_id') {
    d.رقم_الهوية = text;
    session.step = 'svc_supervisor';
    bot.sendMessage(chatId, '👮 اسم مشرف الفترة:');
  } else if (session.step === 'svc_supervisor') {
    d.مشرف_الفترة = text;
    session.step = 'svc_photos';
    session.photos = [];
    bot.sendMessage(chatId, '📷 أرسل صور الخدمة (اختياري) ثم اضغط "إرسال التقرير":', {
      reply_markup: {
        keyboard: [[{ text: '✅ إرسال التقرير' }]],
        resize_keyboard: true,
      }
    });
  } else if (session.step === 'svc_photos') {
    if (text === '✅ إرسال التقرير') {
      await submitService(chatId, session);
    }
  }
}

// ===== إرسال الخدمة =====
async function submitService(chatId, session) {
  const d = session.data;
  const dt = session.dt;

  const formData = {
    نوع_التقرير: 'خدمة مرورية',
    التاريخ: dt.date,
    اليوم: dt.day,
    الوقت: dt.time,
    الوردية: dt.shift || '',
    نوع_الخدمة: d.نوع_الخدمة,
    موقع_الخدمة: d.موقع_الخدمة,
    رقم_اللوحة: d.رقم_اللوحة,
    اسم_السائق: d.اسم_السائق,
    رقم_التواصل: d.رقم_التواصل,
    رقم_الهوية: d.رقم_الهوية || '',
    منفذ_الخدمة: session.name,
    مشرف_الفترة: d.مشرف_الفترة || '',
    الصور: [],
  };

  bot.sendMessage(chatId, '⏳ جاري إرسال التقرير...');
  const ok = await sendToSheets(formData);

  if (ok) {
    bot.sendMessage(chatId, '✅ تم إرسال تقرير الخدمة بنجاح!', {
      reply_markup: { remove_keyboard: true }
    });
    notifyManager(
      `🔧 <b>خدمة مرورية جديدة</b>\n` +
      `📅 ${dt.date} — ${dt.day}\n` +
      `🕐 ${dt.time} | الوردية: ${dt.shift || '—'}\n` +
      `🛠️ نوع الخدمة: ${d.نوع_الخدمة}\n` +
      `📍 الموقع: ${d.موقع_الخدمة}\n` +
      `🚗 اللوحة: ${d.رقم_اللوحة}\n` +
      `👮 المنفذ: ${session.name}`
    );
  } else {
    bot.sendMessage(chatId, '❌ خطأ في الإرسال، حاول مرة أخرى');
  }

  session.step = 'main';
  setTimeout(() => mainMenu(chatId, session.name), 2000);
}

// ===== معالجة تقرير رجل المرور =====
async function handleOfficerReport(chatId, session, text, msg) {
  const d = session.data;

  if (session.step === 'off_location') {
    d.الموقع = text;
    session.step = 'off_subject';
    bot.sendMessage(chatId, '📝 اكتب موضوع التقرير:');
  } else if (session.step === 'off_subject') {
    d.الموضوع = text;
    session.step = 'off_photos';
    session.photos = [];
    bot.sendMessage(chatId, '📷 أرسل صور التقرير (اختياري) ثم اضغط "إرسال التقرير":', {
      reply_markup: {
        keyboard: [[{ text: '✅ إرسال التقرير' }]],
        resize_keyboard: true,
      }
    });
  } else if (session.step === 'off_photos') {
    if (text === '✅ إرسال التقرير') {
      await submitOfficerReport(chatId, session);
    }
  }
}

// ===== إرسال تقرير رجل المرور =====
async function submitOfficerReport(chatId, session) {
  const d = session.data;
  const dt = session.dt;

  const formData = {
    نوع_التقرير: 'تقرير رجل مرور',
    التاريخ: dt.date,
    اليوم: dt.day,
    الوقت: dt.time,
    الوردية: dt.shift || '',
    اسم_معد_التقرير: session.name,
    الموقع: d.الموقع,
    محتوى_التقرير: d.الموضوع,
    مقدم_التقرير: session.name,
    الصور: [],
  };

  bot.sendMessage(chatId, '⏳ جاري إرسال التقرير...');
  const ok = await sendToSheets(formData);

  if (ok) {
    bot.sendMessage(chatId, '✅ تم إرسال التقرير بنجاح!', {
      reply_markup: { remove_keyboard: true }
    });
    notifyManager(
      `👮 <b>تقرير رجل مرور جديد</b>\n` +
      `📅 ${dt.date} — ${dt.day}\n` +
      `🕐 ${dt.time} | الوردية: ${dt.shift || '—'}\n` +
      `📍 الموقع: ${d.الموقع}\n` +
      `📝 الموضوع: ${d.الموضوع}\n` +
      `👤 معد التقرير: ${session.name}`
    );
  } else {
    bot.sendMessage(chatId, '❌ خطأ في الإرسال، حاول مرة أخرى');
  }

  session.step = 'main';
  setTimeout(() => mainMenu(chatId, session.name), 2000);
}

// ===== Callback Queries (أزرار inline) =====
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const session = sessions[chatId];
  if (!session) return;

  bot.answerCallbackQuery(query.id);

  if (query.data === 'dt_confirm') {
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: query.message.message_id
    });
    session.step = 'shift_select';
    bot.sendMessage(chatId, '🔄 اختر الوردية:', {
      reply_markup: {
        keyboard: [
          [{ text: '🌅 صباح' }, { text: '🌆 مساء' }, { text: '🌙 ليل' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    });
  } else if (query.data === 'dt_edit') {
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: query.message.message_id
    });
    session.step = 'dt_edit_date';
    bot.sendMessage(chatId, '📅 أدخل التاريخ (مثال: 16/06/2026):',
      { reply_markup: { remove_keyboard: true } }
    );
  }
});

console.log('🚦 KFSH Traffic Bot يعمل...');
// ===== HTTP Server (مطلوب لـ Render) =====
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('🚦 KFSH Traffic Bot يعمل');
}).listen(PORT, () => {
  console.log(`HTTP server on port ${PORT}`);
});

