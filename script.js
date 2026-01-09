// بيانات التطبيق
const appData = {
    user: {
        name: "سعيد المرسلي",
        role: "مدير العمليات الرئيسي",
        rating: 4.5
    },
    stats: {
        activeShipments: 245,
        successRate: 98,
        activeTrips: 12,
        remainingTime: "18:22:45",
        nextMealTime: "03:45",
        journeyProgress: 85
    },
    meals: [
        { time: "07:00", type: "فطور", status: "completed" },
        { time: "13:30", type: "غداء", status: "upcoming" },
        { time: "20:00", type: "عشاء", status: "planned" }
    ],
    notifications: [
        { type: "fuel", title: "تذكير الوقود", message: "مستوى الوقود: 35% - يوصى بالتزود", time: "منذ 15 دقيقة" },
        { type: "meal", title: "وجبة قريبة", message: "وجبة الغداء في استراحة القصيم", time: "بعد 45 دقيقة" },
        { type: "checkpoint", title: "نقطة تفتيش", message: "تجهيز مستندات المركبة", time: "بعد 30 دقيقة" }
    ],
    journeyClock: {
        hours: 18,
        minutes: 22,
        seconds: 45,
        isPaused: false
    }
};

// تهيئة الخريطة
let map, busMarker;

function initMap() {
    map = L.map('trackingMap').setView([24.7136, 46.6753], 8);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // إضافة الحافلة
    const busIcon = L.divIcon({
        html: '<div style="background: #667eea; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">🚌</div>',
        className: 'bus-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    busMarker = L.marker([24.7136, 46.6753], { icon: busIcon }).addTo(map)
        .bindPopup('الحافلة رقم 245 - السائق: سعيد المرسلي');
    
    // إضافة المسار
    L.polyline([
        [24.7136, 46.6753],
        [25.0, 45.0],
        [26.0, 44.0],
        [27.0, 43.0],
        [28.4, 45.6]
    ], {
        color: '#667eea',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);
}

// تحديث بيانات الإحصائيات
function updateStats() {
    document.getElementById('activeShipments').textContent = appData.stats.activeShipments;
    document.getElementById('successRate').textContent = appData.stats.successRate + '%';
    document.getElementById('activeTripsCount').textContent = appData.stats.activeTrips;
    document.getElementById('remainingTime').textContent = appData.stats.remainingTime.split(':')[0] + ':' + appData.stats.remainingTime.split(':')[1];
    document.getElementById('nextMealTime').textContent = appData.stats.nextMealTime;
    document.getElementById('journeyProgress').textContent = appData.stats.journeyProgress + '%';
    document.getElementById('mealProgress').style.width = appData.stats.journeyProgress + '%';
}

// تحديث ساعة الرحلة
function updateJourneyClock() {
    if (!appData.journeyClock.isPaused) {
        let seconds = appData.journeyClock.seconds;
        let minutes = appData.journeyClock.minutes;
        let hours = appData.journeyClock.hours;
        
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    hours = 0;
                    minutes = 0;
                    seconds = 0;
                }
            }
        }
        
        appData.journeyClock.seconds = seconds;
        appData.journeyClock.minutes = minutes;
        appData.journeyClock.hours = hours;
        
        const clockDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('journeyClock').textContent = clockDisplay;
        
        // تحديث الوقت المتبقي
        appData.stats.remainingTime = clockDisplay;
        document.getElementById('remainingTime').textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // تغيير اللون عند انخفاض الوقت
        if (hours === 0 && minutes < 30) {
            document.getElementById('journeyClock').style.background = 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)';
            document.getElementById('journeyClock').style.webkitBackgroundClip = 'text';
            document.getElementById('journeyClock').style.webkitTextFillColor = 'transparent';
        }
    }
}

// تحديث موقع الحافلة
function updateBusLocation() {
    if (busMarker) {
        const currentLatLng = busMarker.getLatLng();
        const newLat = currentLatLng.lat + (Math.random() - 0.5) * 0.01;
        const newLng = currentLatLng.lng + (Math.random() - 0.5) * 0.01;
        busMarker.setLatLng([newLat, newLng]);
        
        // تحديث الموقع الحالي
        const locations = [
            'الرياض - الطريق السريع',
            'الخرج - محطة الوقود',
            'القرينة - نقطة التفتيش',
            'القصيم - طريق الملك فهد',
            'حائل - المنطقة الشمالية'
        ];
        
        const progress = (18 - appData.journeyClock.hours) / 18;
        const locationIndex = Math.floor(progress * locations.length);
        document.getElementById('currentLocation').textContent = 
            locations[Math.min(locationIndex, locations.length - 1)];
    }
}

// تحديث عشوائي للإحصائيات
function randomizeStats() {
    const change = Math.floor(Math.random() * 5) - 2;
    appData.stats.activeShipments = Math.max(0, appData.stats.activeShipments + change);
    
    const progressChange = Math.floor(Math.random() * 3) - 1;
    appData.stats.journeyProgress = Math.max(0, Math.min(100, appData.stats.journeyProgress + progressChange));
    
    updateStats();
    
    // تأثير التحديث
    document.querySelectorAll('.stat-value').forEach(stat => {
        stat.style.transform = 'scale(1.1)';
        setTimeout(() => {
            stat.style.transform = 'scale(1)';
        }, 300);
    });
}

// إضافة تأثير النقر للأزرار
function setupButtonEffects() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // تأثير النقر
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // تأثير الريبل
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// معالجة أحداث القائمة
function setupMenuEvents() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // إزالة النشط من الجميع
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            
            // إضافة النشط للعنصر المحدد
            this.classList.add('active');
            
            const section = this.getAttribute('data-section');
            showNotification(`تم التبديل إلى قسم ${getSectionName(section)}`);
        });
    });
}

// معالجة أحداث الأزرار الرئيسية
function setupButtonEvents() {
    // زر البحث
    document.getElementById('searchBtn').addEventListener('click', () => {
        const fromCity = document.getElementById('fromCity').value;
        const toCity = document.getElementById('toCity').value;
        const shipmentDate = document.getElementById('shipmentDate').value;
        const weight = document.getElementById('weight').value;
        
        showNotification(`بحث عن شحنات من ${fromCity} إلى ${toCity} بتاريخ ${shipmentDate}`);
    });
    
    // زر إضافة شحنة جديدة
    document.getElementById('addShipmentBtn').addEventListener('click', () => {
        showNotification('فتح نموذج إضافة شحنة جديدة', 'success');
    });
    
    // زر إضافة وجبة
    document.getElementById('addMealBtn').addEventListener('click', () => {
        showNotification('فتح نموذج إضافة وجبة جديدة', 'success');
    });
    
    // زر تحديث الساعة
    document.getElementById('refreshClockBtn').addEventListener('click', () => {
        appData.journeyClock.hours = 18;
        appData.journeyClock.minutes = 22;
        appData.journeyClock.seconds = 45;
        updateJourneyClock();
        showNotification('تم تحديث ساعة الرحلة', 'info');
    });
    
    // زر إيقاف الرحلة مؤقتاً
    document.getElementById('pauseJourneyBtn').addEventListener('click', () => {
        appData.journeyClock.isPaused = true;
        showNotification('تم إيقاف الرحلة مؤقتاً', 'warning');
    });
    
    // زر استئناف الرحلة
    document.getElementById('resumeJourneyBtn').addEventListener('click', () => {
        appData.journeyClock.isPaused = false;
        showNotification('تم استئناف الرحلة', 'success');
    });
    
    // أزرار التحكم بالخريطة
    document.getElementById('zoomInBtn').addEventListener('click', () => {
        map.zoomIn();
        showNotification('تم تكبير الخريطة', 'info');
    });
    
    document.getElementById('zoomOutBtn').addEventListener('click', () => {
        map.zoomOut();
        showNotification('تم تصغير الخريطة', 'info');
    });
    
    document.getElementById('centerMapBtn').addEventListener('click', () => {
        if (busMarker) {
            map.setView(busMarker.getLatLng(), 12);
            showNotification('تم التركيز على موقع الحافلة', 'info');
        }
    });
    
    document.getElementById('showRouteBtn').addEventListener('click', () => {
        map.setView([26.0, 44.0], 6);
        showNotification('عرض المسار الكامل', 'info');
    });
    
    // الأزرار الرئيسية
    document.getElementById('startJourneyBtn').addEventListener('click', () => {
        showNotification('بدء رحلة جديدة - قم بتعبئة بيانات الرحلة', 'success');
    });
    
    document.getElementById('createInvoiceBtn').addEventListener('click', () => {
        showNotification('فتح نموذج إنشاء فاتورة', 'success');
    });
    
    document.getElementById('viewReportsBtn').addEventListener('click', () => {
        showNotification('عرض التقارير والإحصائيات', 'info');
    });
    
    document.getElementById('systemSettingsBtn').addEventListener('click', () => {
        showNotification('فتح إعدادات النظام', 'info');
    });
    
    document.getElementById('contactSupportBtn').addEventListener('click', () => {
        showNotification('الاتصال بالدعم الفني - رقم الهاتف: 0112345678', 'info');
    });
    
    // الأزرار الصغيرة
    document.getElementById('quickAdd').addEventListener('click', () => {
        showNotification('إضافة سريعة - اختر ما تريد إضافته', 'info');
    });
    
    document.getElementById('notificationsBtn').addEventListener('click', () => {
        showNotification('عرض جميع التنبيهات', 'info');
    });
    
    document.getElementById('settingsBtn').addEventListener('click', () => {
        showNotification('فتح الإعدادات السريعة', 'info');
    });
}

// عرض الإشعارات
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'floating-notification';
    
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    
    const colors = {
        info: '#3498db',
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c'
    };
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px; background: white; padding: 15px 20px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border-right: 4px solid ${colors[type]};">
            <i class="fas fa-${icons[type]}" style="color: ${colors[type]}; font-size: 20px;"></i>
            <div>
                <strong style="color: #2c3e50;">${message}</strong>
                <p style="margin: 5px 0 0; font-size: 12px; color: #666;">${new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
        </div>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 20px;
        z-index: 9999;
        transform: translateX(-100%);
        transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // عرض الإشعار
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // إخفاء الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.style.transform = 'translateX(-100%)';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
    
    // تحديث عدد التنبيهات
    const notificationCount = document.getElementById('notificationCount');
    if (notificationCount) {
        let count = parseInt(notificationCount.textContent) || 0;
        count++;
        notificationCount.textContent = count + ' جديد';
    }
}

// الحصول على اسم القسم بالعربية
function getSectionName(section) {
    const sections = {
        dashboard: 'لوحة التحكم',
        trips: 'الرحلات النشطة',
        tracking: 'تتبع الشحنات',
        meals: 'مواعيد الأكل',
        customers: 'العملاء',
        reports: 'التقارير والإحصائيات',
        billing: 'الفواتير والمدفوعات',
        settings: 'الإعدادات',
        support: 'الدعم الفني',
        logout: 'تسجيل الخروج'
    };
    
    return sections[section] || section;
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 تطبيق خاتم المرسلين للشحن جاهز للعمل!');
    
    // تهيئة البيانات
    updateStats();
    initMap();
    
    // إعداد الأحداث
    setupButtonEffects();
    setupMenuEvents();
    setupButtonEvents();
    
    // تحديث الساعة كل ثانية
    setInterval(updateJourneyClock, 1000);
    
    // تحديث موقع الحافلة كل 10 ثواني
    setInterval(updateBusLocation, 10000);
    
    // تحديث الإحصائيات كل 15 ثانية
    setInterval(randomizeStats, 15000);
    
    // إضافة أنماط الريبل
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .floating-notification {
            animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // إضافة تأثيرات للعناصر الطافية
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach(el => {
        el.style.animationDelay = `${Math.random() * 20}s`;
        el.style.fontSize = `${20 + Math.random() * 20}px`;
    });
    
    // رسالة ترحيبية
    setTimeout(() => {
        showNotification('مرحباً بك في نظام خاتم المرسلين للشحن!', 'success');
    }, 1000);
});