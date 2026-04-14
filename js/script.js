function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

function saveUtmFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    utmParams.forEach(function(param) {
        const value = urlParams.get(param);
        if (value && !getCookie(param)) {
            setCookie(param, value, 30);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    saveUtmFromUrl();

    const urlParams = new URLSearchParams(window.location.search);
    const isOrda = urlParams.get('type') === 'orda';

    const heroImage = document.getElementById('heroImage');
    const mainTitle = document.getElementById('mainTitle');

    if (isOrda) {
        heroImage.src = 'images/MedSkillsResidency.jpg';
        mainTitle.textContent = 'Ординатура «МедСкиллс»';
    } else {
        heroImage.src = 'images/MedSkillsCollege.jpg';
        mainTitle.textContent = 'Медицинский колледж «МедСкиллс»';
    }

    const infoGrid = document.getElementById('infoGrid');

    const collegeGrid = `
        <div class="info-item">
            <span class="label">Специальности</span>
            <p>сестринское дело, фармация</p>
        </div>
        <div class="info-item">
            <span class="label">Форма обучения</span>
            <p>очная, очно-заочная</p>
        </div>
        <div class="info-item">
            <span class="label">После</span>
            <p>9, 11, колледжа, ВУЗа</p>
        </div>
        <div class="info-item">
            <span class="label">Адреса</span>
            <p>Пушкинская 106, Садовая 76</p>
        </div>
    `;

    const ordaGrid = `
        <div class="info-item info-item-wide">
            <span class="label">Специальности ординатуры</span>
            <div class="specialties-list">
                <span>Дерматовенерология</span>
                <span>Ультразвуковая диагностика</span>
                <span>Остеопатия</span>
                <span>Рентгенология</span>
                <span>Организация здравоохранения и общественное здоровье</span>
                <span>Врач-стажер (получение допуска)</span>
                <span>Стоматология общей практики</span>
            </div>
        </div>
        <div class="info-item info-item-wide">
            <span class="label">Адреса</span>
            <p>Пушкинская 106</p>
        </div>
    `;

    infoGrid.innerHTML = isOrda ? ordaGrid : collegeGrid;

    const form = document.getElementById('leadForm');
    const fioInput = document.getElementById('fio');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.getElementById('submitBtn');
    const agreement = document.getElementById('agreement');

    const popup = document.getElementById('popup');
    const openPopup = document.getElementById('openPopup');
    const closePopup = document.getElementById('closePopup');
    const acceptBtn = document.getElementById('acceptBtn');
    const declineBtn = document.getElementById('declineBtn');

    if (typeof Inputmask !== 'undefined') {
        const phoneMask = new Inputmask("+7 (999) 999-99-99");
        phoneMask.mask(phoneInput);
    }

    const validateFio = (val) => val.trim().split(/\s+/).length >= 2;

    const validatePhone = () => {
        const digits = phoneInput.value.replace(/\D/g, '');
        return digits.length === 11;
    };

    const validateAgreement = () => agreement.checked;

    const toggleError = (input, errorId, isValid) => {
        const error = document.getElementById(errorId);
        if (isValid) {
            input?.classList.remove('invalid');
            error.style.display = 'none';
        } else {
            input?.classList.add('invalid');
            error.style.display = 'block';
        }
    };

    openPopup.onclick = () => popup.style.display = 'flex';
    closePopup.onclick = () => popup.style.display = 'none';
    declineBtn.onclick = () => popup.style.display = 'none';

    acceptBtn.onclick = () => {
        agreement.checked = true;
        popup.style.display = 'none';
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const isFioValid = validateFio(fioInput.value);
        const isPhoneValid = validatePhone();
        const isAgreementValid = validateAgreement();

        toggleError(fioInput, 'fioError', isFioValid);
        toggleError(phoneInput, 'phoneError', isPhoneValid);
        toggleError(null, 'agreementError', isAgreementValid);

        if (!isFioValid || !isPhoneValid || !isAgreementValid) return;

        submitBtn.disabled = true;
        submitBtn.innerText = 'Отправка...';

        const phoneDigits = phoneInput.value.replace(/\D/g, '');
        const currentUrl = window.location.href;

        const params = new URLSearchParams(window.location.search);

        const utmSource = getCookie('utm_source') || params.get('utm_source') || '';
        const utmCampaign = getCookie('utm_campaign') || params.get('utm_campaign') || '';
        const utmMedium = getCookie('utm_medium') || params.get('utm_medium') || '';
        const utmContent = getCookie('utm_content') || params.get('utm_content') || '';
        const utmTerm = getCookie('utm_term') || params.get('utm_term') || '';

        const formData = new FormData();
        formData.append('name', fioInput.value);
        formData.append('phone', phoneDigits);
        formData.append('comment', 'Отправлено со страницы: ' + currentUrl);

        formData.append('source', '79094027264');

        const dealName = isOrda
            ? 'Заявка на ординатуру'
            : 'Заявка на колледж';

        formData.append('deal', dealName);

        formData.append('UTM_SOURCE', utmSource);
        formData.append('UTM_CAMPAIGN', utmCampaign);
        formData.append('UTM_MEDIUM', utmMedium);
        formData.append('UTM_CONTENT', utmContent);
        formData.append('UTM_TERM', utmTerm);

        fetch('https://web-apkipp.ru/b24connect/', {
            method: 'POST',
            body: formData
        })
        .then(res => {
            if (!res.ok) throw new Error('Ошибка сети');
            return res.text();
        })
        .then(() => {
            window.location.href = '/thankyou.html';
        })
        .catch(() => {
            alert('Ошибка отправки. Попробуйте ещё раз.');
            submitBtn.disabled = false;
            submitBtn.innerText = 'Отправить заявку';
        });
    });
});