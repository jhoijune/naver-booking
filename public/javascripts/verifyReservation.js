document.addEventListener("DOMContentLoaded",()=>{
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        const verificationFun = (() => {
            const verifyThing = {
                ticket: false,
                name: false,
                telephone: false,
                email: false,
                TOS: false,
                submit: false,
            };
            const reservationForm = document.forms["reservationForm"];
            const reservationContainer = document.querySelector(".reserveSection .inputInfo .tableContainer");
            const inputTel = document.querySelector("#inputTel");
            const inputEmail = document.querySelector("#inputEmail");
            const overallReservation = document.querySelector("#overallReservation");
            function makeAlert(){
                const container = document.createElement("div");
                container.setAttribute("class","tableRow");
                container.style.display = "none";
                const emptyParagraph = document.createElement("p");
                const messageParagraph = document.createElement("p");
                messageParagraph.setAttribute("class","alertMessage");
                container.appendChild(emptyParagraph);
                container.appendChild(messageParagraph);
                return container;
            }
            return {
                verifyTicket(){
                    const eachTicketInput = document.querySelectorAll(".eachTicket input");
                    for(const input of eachTicketInput){
                        if(Number(input.value) > 0){
                            verifyThing.ticket = true;
                            return;
                        }
                    }
                    verifyThing.ticket = false;
                },
                verifyName(){
                    const name = reservationForm["reservationName"].value;
                    if(name.length === 0) {
                        verifyThing.name = false;
                        return;
                    }
                    if(/\s/.test(name)){
                        verifyThing.name = false;
                        const alertContainer = makeAlert();
                        alertContainer.setAttribute("id","alertWrongName");
                        alertContainer.querySelector(".alertMessage").innerText = "이름에는 공백이 있어서는 안됩니다.";
                        reservationContainer.insertBefore(alertContainer,inputTel);
                        $("#alertWrongName").slideDown(1000);
                        return;
                    }
                    verifyThing.name = true;
                },
                verifyTel(){
                    const telephone = reservationForm["reservationTelephone"].value;
                    if(telephone.length === 0){
                        verifyThing.telephone = false;
                        return;
                    }
                    const telRe = /0\d{2}-[1-9]\d{2,3}-\d{4}/;
                    if(telRe.test(telephone)){
                        verifyThing.telephone = true;
                    } 
                    else{
                        verifyThing.telephone = false;
                        const alertContainer = makeAlert();
                        alertContainer.setAttribute("id","alertWrongTel");
                        alertContainer.querySelector(".alertMessage").innerText = "전화번호 형식이 맞지 않습니다.";
                        reservationContainer.insertBefore(alertContainer,inputEmail);
                        $("#alertWrongTel").slideDown(1000);
                    }
                },
                verifyEmail(){
                    const email = reservationForm["reservationEmail"].value;
                    if(email.length === 0){
                        verifyThing.email = false;
                        return;
                    }
                    const emailRe = /[a-zA-Z]\w{2,}@[a-zA-Z]{3,}\.[a-zA-Z]{2,}/;
                    if(emailRe.test(email)){
                        verifyThing.email = true;
                    }
                    else{
                        verifyThing.email = false;
                        const alertContainer = makeAlert();
                        alertContainer.setAttribute("id","alertWrongEmail");
                        alertContainer.querySelector(".alertMessage").innerText = "이메일 형식이 맞지 않습니다.";
                        reservationContainer.insertBefore(alertContainer,overallReservation);
                        $("#alertWrongEmail").slideDown(1000);
                    }
                },
                verifyTOS(){
                    const TOS = reservationForm["TOSCheck"];
                    if(TOS.checked){
                        verifyThing.TOS = true;
                    }
                    else{
                        verifyThing.TOS = false;
                    }
                },
                verifySubmit(){
                    for(const thing in verifyThing){
                        if(!verifyThing.hasOwnProperty(thing)) continue;
                        if(thing !== "submit" && !verifyThing[thing]){
                            verifyThing.submit = false;
                            document.dispatchEvent(new Event("submitUnable"));
                            return;
                        }
                    }
                    verifyThing.submit = true;
                    document.dispatchEvent(new Event("submitAble"));
                },
                getSubmitAble(){
                    return verifyThing.submit;
                },
            };
        })();
        function transformMoneyUnit(num){
            let transformed = "";
            num = num.toString();
            const numLen = num.length;
            for(let i = 1 ; i <= numLen ; i++){ 
                if(i>3 && i % 3 === 1){
                    transformed = "," + transformed;
                }
                transformed = num.charAt(numLen - i) + transformed;
            }
            return transformed
        }
        const productInfo = JSON.parse(xhr.responseText);
        const reservationForm = document.forms["reservationForm"];
        const eachTicketInput = document.querySelectorAll(".eachTicket input");
        const eachTicket = document.querySelectorAll(".inputTicket .eachTicket");
        const ticketContainer = document.querySelector(".reserveSection .inputTicket");
        const inputName = document.querySelector("input[name='reservationName']");
        const inputTel = document.querySelector("input[name='reservationTelephone']");
        const inputEmail = document.querySelector("input[name='reservationEmail']");
        const checkTOS = document.querySelector("input[name='TOSCheck']");
        const submitButton = document.querySelector("button[type='submit']");
        const reservationDate = document.querySelector(".inputInfo .reservationDate");
        const totalTicket = document.querySelector(".inputInfo .totalTicket");
        ticketContainer.addEventListener("click",event => {
            event.preventDefault();
            const classes = event.target.className.split(/\s/);
            if(!classes.includes("disabled") && (classes.includes("ico_minus3") || classes.includes("ico_plus3"))){
                const adjustTicketContainer = event.target.parentElement;
                const ticketInput = adjustTicketContainer.querySelector("input");
                const productOrder = Number(ticketInput.name.match(/\d+/)[0]);
                if(classes.includes("ico_minus3")){                
                    ticketInput.value = Number(ticketInput.value) - 1;
                    eachTicket[productOrder-1].querySelector(".totalAmount").innerText =
                        transformMoneyUnit(productInfo.productPrices[productOrder-1].price * Number(ticketInput.value));
                    totalTicket.innerText = Number(totalTicket.innerText) - 1;
                    if(ticketInput.value === "0"){
                        adjustTicketContainer.querySelector(".ico_minus3").classList.add("disabled");
                        ticketInput.classList.add("disabled");
                    }
                }
                else{
                    ticketInput.value = Number(ticketInput.value) + 1;
                    eachTicket[productOrder-1].querySelector(".totalAmount").innerText = 
                        transformMoneyUnit(productInfo.productPrices[productOrder-1].price * Number(ticketInput.value));
                    totalTicket.innerText = Number(totalTicket.innerText) + 1;
                    if(ticketInput.value === "1"){
                        adjustTicketContainer.querySelector(".ico_minus3").classList.remove("disabled");
                        ticketInput.classList.remove("disabled");
                    }
                }
                verificationFun.verifyTicket();
                verificationFun.verifySubmit();
            }
            return;
        });
        inputName.addEventListener("blur",()=>{
            verificationFun.verifyName();
            verificationFun.verifySubmit();        
        });
        inputName.addEventListener("focus",()=>{
            if($("#alertWrongName").length){
                $("#alertWrongName").hide();
            }
        });
        inputTel.addEventListener("blur",()=>{
            verificationFun.verifyTel();
            verificationFun.verifySubmit();
        });
        inputTel.addEventListener("focus",()=>{
            if($("#alertWrongTel").length){
                $("#alertWrongTel").hide();
            }
        });
        inputEmail.addEventListener("blur",()=>{
            verificationFun.verifyEmail();
            verificationFun.verifySubmit();
        })
        inputEmail.addEventListener("focus",()=>{
            if($("#alertWrongEmail").length){
                $("#alertWrongEmail").hide();
            }
        });
        checkTOS.addEventListener("click",()=>{
            verificationFun.verifyTOS();
            verificationFun.verifySubmit();
        })
        document.addEventListener("submitAble",()=>{
            submitButton.style.backgroundColor = "#1EC900";
        });
        document.addEventListener("submitUnable",()=>{
            submitButton.style.backgroundColor = "#D1D1D1";
        });
        submitButton.addEventListener("click",event=>{
            event.preventDefault();
            if(!verificationFun.getSubmitAble()) return;
            const reservationInfo = {
                displayInfoId: productInfo.displayInfo.displayInfoId,
                prices: [],
                productId: productInfo.displayInfo.productId,
                reservationEmail: reservationForm["reservationEmail"].value,
                reservationName: reservationForm["reservationName"].value,
                reservationTelephone: reservationForm["reservationTelephone"].value,
                reservationYearMonthDay: `${reservationDate.innerText} ${reservationDate.dataset.time}`,
            }
            for(let i=0,len=eachTicketInput.length;i<len;i++){
                reservationInfo.prices.push({count:Number(eachTicketInput[i].value),productPriceId:productInfo.productPrices[i].productPriceID});
            }
            const xhr = new XMLHttpRequest();
            xhr.open("POST","../api/tempFormHandle");
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(reservationInfo));
        });
    }
    const path = document.location.pathname;
    const displayInfoId = path.split("/")[2];  // /products/displayInfoId
    xhr.open("GET",`../api/products/${displayInfoId}`);
    xhr.send();
});

