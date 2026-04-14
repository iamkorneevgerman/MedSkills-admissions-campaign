document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isOrda = urlParams.get('type') === 'orda';

    const heroImage = document.getElementById('heroImage');
    const mainTitle = document.getElementById('mainTitle');
    
    if (isOrda) {
        heroImage.src = 'image1.jpg';
        mainTitle.textContent = 'Ординатура «МедСкиллс»';
    } else {
        heroImage.src = 'image2.jpg';
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
    
    if (isOrda) {
        infoGrid.innerHTML = ordaGrid;
    } else {
        infoGrid.innerHTML = collegeGrid;
    }
    const form = document.getElementById('leadForm');
    const fioInput = document.getElementById('fio');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.getElementById('submitBtn');
    const successState = document.getElementById('successState');
    const card = document.querySelector('.card');

    const agreement = document.getElementById('agreement');

    const popup = document.getElementById('popup');
    const openPopup = document.getElementById('openPopup');
    const closePopup = document.getElementById('closePopup');
    const acceptBtn = document.getElementById('acceptBtn');
    const declineBtn = document.getElementById('declineBtn');

    const phoneMask = new Inputmask("+7 (999) 999-99-99");
    phoneMask.mask(phoneInput);

    const validateFio = (val) => {
        const words = val.trim().split(/\s+/);
        return words.length >= 2;
    };

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

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isFioValid = validateFio(fioInput.value);
        const isPhoneValid = validatePhone();
        const isAgreementValid = validateAgreement();

        toggleError(fioInput, 'fioError', isFioValid);
        toggleError(phoneInput, 'phoneError', isPhoneValid);
        toggleError(null, 'agreementError', isAgreementValid);

        if (isFioValid && isPhoneValid && isAgreementValid) {
            submitBtn.disabled = true;
            submitBtn.innerText = 'Отправка...';

            setTimeout(() => {
                card.innerHTML = '';
                successState.style.display = 'block';
                document.querySelector('.container').appendChild(successState);

            }, 800);
        }
    });
});