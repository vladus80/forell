
'use strict';
window.addEventListener("load", (ev)=>{


    // Все инпуты принимающее массу
    let inputs = document.querySelectorAll("input[type='number']");
    // элемент куда помещается общая масса
    let massa  = document.querySelector("#allMassa");
    // элемент куда будем помещать общую стоимость
    let amount = document.querySelector("#amount");

    // элемент куда будем помещать стоимость доставки общую
    let delivery = document.querySelector("#dostavka_price");
    let deliveryEls = document.querySelectorAll(".dostavka_price");
    let mass_delivery = document.querySelector("#massa_price_dostavka");
    // Чекбокс для учета или не учета доставки
    let chboxDostavka = document.querySelector("#isDostavka");
    // радиокнопки которые устанавливают способ расчета доставки
    let radios = document.querySelectorAll("input[type='radio']");
    let radioPosition = document.querySelector("#for_position") ;
    let radioAllMass = document.querySelector("#for_all_massa");
    let radioNotDostavka = document.querySelector("#not_dostavka");
    // Кнопка очищения
    let btnClear = document.querySelector("#button_clear");

    // Ячейка с общем итогом по строке
    let inputTotalPrices = document.querySelectorAll(".total_price");

    // Функция подсчитывает Общий итог по колонке 'общая стоимость c доставкой'
    // проходя по всем ячейкам
    function priceTotal(){

        let arrVal = [];
        inputTotalPrices.forEach(val => {
            arrVal.push(parseFloat(val.textContent));

        })
        // взовращаем сумму в массиве фильтруя Nan
        let res = arrVal.filter(value => !isNaN(value))
                        .reduce((sum, current) => parseFloat(sum) + parseFloat(current), 0);

        return res.toFixed(2);

    }

    // Функция подсчитывает общую сумму доставки
    function itogPriceDostavka(){

        let arrVal = [];
        deliveryEls.forEach(el => {
            let mass = el.parentElement.querySelector("input[type='number']").value;
            arrVal.push(parseFloat(el.textContent)*parseFloat(mass));
        })

        // взовращаем сумму в массиве фильтруя Nan
        let res = arrVal.filter(value => !isNaN(value))
            .reduce((sum, current) => parseFloat(sum) + parseFloat(current), 0);

        return res;
    }

    // Функция возвращает Общую массу введеных пользователем проходя по инпутам
    function allMass(){
        let arrVal = [];
        inputs.forEach(val => {arrVal.push(val.value);})
        let res = arrVal.reduce((sum, current) => parseFloat(sum) + parseFloat(current), 0);
        return res;

    }

    // Функция вычисляет и возвращает стоимость доставки для каждого инпута (el)
    function priceDelivery(el = null){
        // если el не указан то берется общая масса
        // Например, если не указан el до возвращается стоимость доставки исходя из общей массы,
        // если указан то стоимость для каждого инпута где пользоватль ввел значение
        let resultMass = 0;

        if (el == null){
            resultMass = allMass();
        }else{
            resultMass = el.value;
        }

        let kf = 0;
        switch (true) {
            case resultMass < 2:
                kf = 25;
                break;
            case resultMass >= 2 && resultMass < 5:
                kf = 20;
                break;
            case resultMass >= 5 && resultMass < 10:
                kf = 15;
                break;
            case resultMass >= 10:
                kf = 10;
                break;
        }
        return kf;
    }

    // Функция рассчитывает и возвращает общий итог по каждой позиции включая стоимость доставки,
    // Если не указывать stDost то будет рассчитываться стоимость без доставки
    // mas - масса в инпуте введеная пользователем
    // price - цена в ячейки
    // stDost - стоимость доставки в строке в ячейке
    function totalPriceForPosition(mas,price,stDelivery = 0){

        let res = 0;

        if(stDelivery == 0){

            res = parseFloat(mas)*(parseFloat( price));
        }else {
            res = parseFloat(mas)*(parseFloat( price)+ parseFloat(stDelivery));
        }

        return res;
    }

   // триггер при вводе значения в инпуте ввода пользователем массы
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            // регулярка  - только цифры
            //input.value = input.value.replace(/[^0-9\.]/g, '').replace(/,/g, '.').replace(/NaN/g,"0");
            //input.value = input.value.replace(/NaN/g,"0");
            render(input);
            updateDate();

        })
    })

    // триггер при покидании фокуса  в инпуте ввода пользователем массы
    inputs.forEach(input => {
        input.addEventListener("blur", () => {

            if(input.value === "" || isNaN(input.value) ){
                input.value = 0;
                render(input);
            }

        })
    })

    // Тригер на радиокнопки
    document.addEventListener("change",event =>{

        inputs.forEach(item =>{

            let row = item.parentElement.parentElement;
            let pr = row.querySelector(".price").textContent;
            let delivery = row.querySelector(".dostavka_price");
            let total = row.querySelector(".total_price");
            let mass = item.value;
            let deliv = priceDelivery();

            //Если выбрана радиокнопка расчета по каждой позиции
            if(event.target.value === "for_position" && item.value !=0){
                    delivery.textContent = priceDelivery(item);
                    total.textContent = totalPriceForPosition(item.value, pr, priceDelivery(item));
            //Если выбрана радиокнопка расчета по общей массе
            }else if(event.target.value === "for_all_massa" && item.value !=0){
                    delivery.textContent = deliv;
                    total.textContent = parseFloat(mass)*(parseFloat(deliv)+parseFloat(pr)) ;
            //Если выбрана радиокнопка без расчета доставки
            }else if(event.target.value === "not_dostavka" && item.value !=0){
                    delivery.textContent = "";
                    total.textContent = parseFloat((mass * pr));
            }
            updateDate()

        })
    })

    // Тригер на очищение данных
    btnClear.addEventListener("click", evt => {

        evt.preventDefault();
        inputs.forEach(input => {

            input.value = 0
            radioAllMass.checked = true;
            render(input);

        })

    })

    function render(el){

        let rowEl = el.parentElement.parentElement; //строка с инпутом
        let devilEl = rowEl.querySelector(".dostavka_price"); // ячейка стоимость доставки за 1 кг
        let totalPrice = rowEl.querySelector(".total_price");    // получаем элемент куда будем писать общую стоимость

        let price = rowEl.querySelector(".price").textContent; // берем цену из ячейки с ценой
        let massa = el.value;

            // Если считаем доставку по каждой позиции (стоит переключатель radioPosition)
            if (radioPosition.checked === true){
                devilEl.textContent = priceDelivery(el);
                let dost = devilEl.textContent;
                totalPrice.textContent = +totalPriceForPosition(massa, price, dost);
            // Если считаем по всей массе
            }else if (radioAllMass.checked === true) {
                deliveryEls.forEach(el => el.textContent = priceDelivery());
                let dost = devilEl.textContent;
                totalPrice.textContent = +totalPriceForPosition(massa, price, dost);
            //Если не счтаем доставку
            }else{
                totalPrice.textContent = +parseFloat(price * massa).toFixed(2);
            }

        clearNullData();
        updateDate();
    }

    function clearNullData(){

        inputs.forEach(input =>{
            let rowEl = input.parentElement.parentElement; //строка
            let devilInputEl = rowEl.querySelector(".dostavka_price"); // ячейка доставка
            let priceInputEl= rowEl.querySelector(".total_price"); // ячейка стоимость

            if(input.value === "0" || input.value ===""){

                devilInputEl.textContent = "";
                priceInputEl.textContent= "";
                rowEl.classList.remove("selectActive");

            }else {
                rowEl.classList.add("selectActive");
            }
        })
    }

    function updateDate(){

        amount.textContent =`${priceTotal()}  руб.`; //Итоговая стоимость
        if(!isNaN( allMass())){
            mass_delivery.textContent = `${allMass()} кг/ ${itogPriceDostavka()} руб `
        }else {
            mass_delivery.textContent = `0 кг/ ${itogPriceDostavka()} руб `
        }
    }
})