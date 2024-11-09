let dropDowns = document.querySelectorAll(".dropdown select");

const getExchangeBtn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const note = document.querySelector("#note-value");

const updateFlag = (evt) => {
  let currCode = evt.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let image = evt.parentElement.querySelector("img");
  image.src = newSrc;
};

dropDowns.forEach((select) => {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD")
      newOption.selected = "selected";
    else if (select.name === "to" && currCode === "INR")
      newOption.selected = "selected";
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
});

const calculateExchangeRate = (amtVal, exchangeRate) => {
  let finalAmount = amtVal * exchangeRate;
  finalAmount = finalAmount.toFixed(3);
  msg.innerText = `${finalAmount} ${toCurr.value}`;
  note.innerText = `1 ${fromCurr.value} = ${exchangeRate} ${toCurr.value}`;
};

const fetchExchangeRate = async (fromCurrCode, toCurrCode) => {
  fromCurrCode = fromCurrCode.toLowerCase();
  toCurrCode = toCurrCode.toLowerCase();
  let url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrCode}.json`;
  let response = await fetch(url);
  let responseJson = await response.json();
  let val = responseJson[fromCurrCode][toCurrCode];
  return val;
};

getExchangeBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal < 1 || amtVal === "") {
    amount.innerText = 1;
    amount.value = 1;
  }

  let exchangeRate = await fetchExchangeRate(fromCurr.value, toCurr.value);

  calculateExchangeRate(amtVal, exchangeRate);
  //ASYNC FUNC RETURN PROMISE We should use .then or await
  // fetchExchangeRate(fromCurr.value, toCurr.value).then((exchangeRate) => {
  //   calculateExchangeRate(amtVal, exchangeRate);
  // });
});

window.addEventListener("load", async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  let exchangeRate = await fetchExchangeRate(fromCurr.value, toCurr.value);

  calculateExchangeRate(amtVal, exchangeRate);
});
