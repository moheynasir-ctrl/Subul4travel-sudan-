const tripsData = [
    {
        id: 1,
        company: "النقل السريع",
        companyLogo: "NT",
        fromCity: "الرياض",
        toCity: "الخرطوم",
        departureTime: "08:00",
        arrivalTime: "20:00",
        duration: "12 ساعة",
        busType: "VIP",
        seats: 45,
        availableSeats: 20,
        price: 350,
        features: ["واي فاي", "مقاعد مريحة", "وجبات خفيفة"],
        meetingPoints: ["ميدان الملك فهد", "حي العليا"],
        restStops: ["مفرق كذا", "مطعم الأصالة"]
    },
    {
        id: 2,
        company: "أبناء السودان",
        companyLogo: "اس",
        fromCity: "جدة",
        toCity: "بورتسودان",
        departureTime: "06:00",
        arrivalTime: "18:00",
        duration: "12 ساعة",
        busType: "عادية",
        seats: 50,
        availableSeats: 35,
        price: 250,
        features: ["تكييف", "مياه مجانية"],
        meetingPoints: ["سوق البهارات", "ميدان الكورنيش"],
        restStops: ["مطعم النخيل", "استراحة السلام"]
    },
    {
        id: 3,
        company: "الرفاعي للنقل",
        companyLogo: "رف",
        fromCity: "الدمام",
        toCity: "الخرطوم",
        departureTime: "10:00",
        arrivalTime: "22:00",
        duration: "12 ساعة",
        busType: "VIP",
        seats: 40,
        availableSeats: 12,
        price: 400,
        features: ["واي فاي", "شاشات ترفيه", "وجبات ساخنة"],
        meetingPoints: ["الواجهة البحرية", "حي النخيل"],
        restStops: ["مطعم الواحة", "استراحة الفجر"]
    }
];

function displayTrips() {
    const tripList = document.getElementById('tripList');
    tripList.innerHTML = '';

    tripsData.forEach(trip => {
        const seatsPercentage = (trip.availableSeats / trip.seats) * 100;
        let seatsColor = '#4caf50';
        if (seatsPercentage < 30) seatsColor = '#f44336';
        else if (seatsPercentage < 60) seatsColor = '#ff9800';

        const tripCard = document.createElement('div');
        tripCard.className = 'trip-card';
        tripCard.innerHTML = `
            <div class="trip-header">
                <div class="company-info">
                    <div class="company-logo">${trip.companyLogo}</div>
                    <div>
                        <h4>${trip.company}</h4>
                        <div class="rating">
                            <i class="fas fa-star" style="color: #ffc107;"></i>
                            <span>4.5</span>
                        </div>
                    </div>
                </div>
                <span class="bus-type">${trip.busType}</span>
            </div>
            <div class="trip-body">
                <div class="route-info">
                    <div class="route-from">
                        <div class="route-time">${trip.departureTime}</div>
                        <div class="route-city">${trip.fromCity}</div>
                    </div>
                    <div class="route-arrow">
                        <i class="fas fa-long-arrow-alt-right" style="font-size: 24px; color: #2e7d32;"></i>
                        <div class="duration">${trip.duration}</div>
                    </div>
                    <div class="route-to">
                        <div class="route-time">${trip.arrivalTime}</div>
                        <div class="route-city">${trip.toCity}</div>
                    </div>
                </div>
                <div class="trip-details">
                    <div class="detail-item">
                        <i class="fas fa-chair"></i>
                        <span>المقاعد: ${trip.availableSeats}/${trip.seats}</span>
                        <div class="seats-bar">
                            <div class="seats-fill" style="width: ${seatsPercentage}%; background: ${seatsColor};"></div>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>نقاط التلاقي: ${trip.meetingPoints.length}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-utensils"></i>
                        <span>محطات استراحة: ${trip.restStops.length}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-wifi"></i>
                        <span>${trip.features.join('، ')}</span>
                    </div>
                </div>
                <div class="trip-price">
                    <span>السعر:</span>
                    <div class="price">${trip.price} ريال</div>
                    <small>شخص واحد</small>
                </div>
            </div>
            <div class="trip-footer">
                <button class="btn btn-primary btn-book" onclick="bookTrip(${trip.id})">
                    <i class="fas fa-ticket-alt"></i> احجز الآن
                </button>
            </div>
        `;
        tripList.appendChild(tripCard);
    });
}

function bookTrip(tripId) {
    const trip = tripsData.find(t => t.id === tripId);
    if (trip && trip.availableSeats > 0) {
        alert(`حجز رحلة مع ${trip.company}\nمن ${trip.fromCity} إلى ${trip.toCity}\nالسعر: ${trip.price} ريال`);
        trip.availableSeats -= 1;
        displayTrips();
        console.log('تم الحجز:', { tripId: trip.id, company: trip.company });
    } else {
        alert('عذراً، لا توجد مقاعد متاحة في هذه الرحلة.');
    }
}

function searchTrips() {
    const fromCity = document.getElementById('from').value.toLowerCase();
    const date = document.getElementById('date').value;
    const passengers = document.getElementById('passengers').value;
    
    if (fromCity) {
        const filteredTrips = tripsData.filter(trip => trip.fromCity.toLowerCase().includes(fromCity));
        if (filteredTrips.length === 0) {
            document.getElementById('tripList').innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 48px; color: #ccc;"></i>
                    <h3 style="color: #666; margin-top: 20px;">لا توجد رحلات من "${fromCity}"</h3>
                </div>
            `;
        } else {
            // في التطبيق الحقيقي هنا ستعرض الرحلات المصفاة
            alert(`بحث عن رحلات من: ${fromCity}\nتم العثور على ${filteredTrips.length} رحلة`);
        }
    } else {
        alert('الرجاء إدخال مدينة المغادرة للبحث');
    }
}

function initPage() {
    displayTrips();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
    document.getElementById('date').value = today;
    
    document.querySelector('.btn-search').addEventListener('click', searchTrips);
    
    document.querySelectorAll('#from, #date, #passengers').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchTrips();
        });
    });
    
    document.querySelector('.btn-login').addEventListener('click', function(e) {
        e.preventDefault();
        alert('صفحة تسجيل الدخول قيد التطوير');
    });
    
    console.log('🚌 مرحباً بكم في منصة سُبُل');
}

document.addEventListener('DOMContentLoaded', initPage);
