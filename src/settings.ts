import "./styles/settings.scss";

let form = document.getElementsByTagName('form')[0];

/**
 * При изменении значения выводим время в удобном виде.
 */

let getTimeStr = (time: number): string => {
        let date = new Date(0);
        date.setMilliseconds(time);

        let str = ' '
        if (date.getUTCHours() > 0)
            str += `${date.getUTCHours()}ч. `;

        if (date.getUTCMinutes() > 0)
            str += `${date.getUTCMinutes()}мин. `;

        if (date.getUTCSeconds() > 0)
            str += `${date.getUTCSeconds()}сек. `;

        if (date.getUTCMilliseconds() > 0)
            str += `${date.getUTCMilliseconds()}мс. `;

        return str;
    },

    changeTimeHandler = function (): void {
        let span = <HTMLElement>(this.nextElementSibling.lastElementChild);
        span.innerText = `(${getTimeStr(+this.value)})`
    };

Array.from(document.getElementsByClassName('time')).forEach(span => {
    let timeInput = <HTMLInputElement>(span.parentElement.previousElementSibling);
    timeInput.addEventListener('change', changeTimeHandler);
});


/**
 * сохранить настройки
 */
let saveData = function (): void {
    let inputs = form.getElementsByTagName('input'),
        settings = new Map();
    for (let input of Array.from(inputs)) {
        if (input.type === 'submit')
            continue;
        settings.set(input.name, input.value);
    }
    localStorage.setItem('ant_settings', JSON.stringify(Array.from(settings)));
};

/**
 * Сохранение настроек и редирект
 */
form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveData();
    let homeLink = document.getElementsByTagName('a')[0];
    if (homeLink)
        location.href = homeLink.href;
});

/**
 * Подгружаем настройки, если они были сохранены и сохраняем значения по умолчанию в противном случае.
 */
let settingsStr = localStorage.getItem('ant_settings');
if (settingsStr) {
    let settings = JSON.parse(settingsStr);
    for (let [key, value] of settings) {
        let input = <HTMLInputElement>(form[key]);
        input.value = value;

        let event = new Event("change");
        input.dispatchEvent(event);
    }
} else
    saveData();