document.addEventListener("DOMContentLoaded",()=>{
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
        return {
            verifyTicket(){
                const ticketList = document.querySelectorAll(".eachTicket input");
                for(const ticket of ticketList){
                    if(Number(ticket.value) > 0){
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
                    // 공백이 있다고 알려야 함
                    verifyThing.name = false;
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
                const telRe = /0\d{2}-\d{3,4}-\d{4}/;
                if(telRe.test(telephone)){
                    verifyThing.telephone = true;
                } 
                else{
                    // 형식에 맞지 않다고 내보냄
                    verifyThing.telephone = false;
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
                    // 형식에 맞지 않다고 내보냄
                    verifyThing.email = false;
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
            getAbleSubmit(){
                return verifyThing.submit;
            },
        };
    })();
    const reservationForm = document.forms["reservationForm"];
    const ticketList = document.querySelectorAll(".eachTicket input");
    const ticketContainer = document.querySelector(".reserveSection .inputTicket");
    const inputName = document.querySelector("input[name='reservationName']");
    const inputTel = document.querySelector("input[name='reservationTelephone']");
    const inputEmail = document.querySelector("input[name='reservationEmail']");
    const checkTOS = document.querySelector("input[name='TOSCheck']");
    const submitButton = document.querySelector("button[type='submit']");
    ticketContainer.addEventListener("click",event => {
        event.preventDefault();
        const classes = event.target.className.split(/\s/);
        if(classes.include("ico_minus3") || classes.include("ico_plus3")){
            
            // -나 +에 맞게 input 찾아서 
        }
        return;
    });
    inputName.addEventListener("blur",()=>{
        verificationFun.verifyName();
        verificationFun.verifySubmit();        
    });
    inputTel.addEventListener("blur",()=>{
        verificationFun.verifyTel();
        verificationFun.verifySubmit();
    });
    inputEmail.addEventListener("blur",()=>{
        verificationFun.verifyEmail();
        verificationFun.verifySubmit();
    })
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
        if(!verificationFun.getAbleSubmit()) return;
        const reservationInfo = {
            displayInfoId: Number(reservationForm.dataset.displayInfoId),
            prices: [],
            productId: Number(reservationForm.dataset.productId),
            reservationEmail: reservationForm["reservationEmail"],
            reservationName: reservationForm["reservationName"],
            reservationTelephone: reservationForm["reservationTelephone"],
            reservationYearMonthDay: "string"
        }
        for(const ticket of ticketList){
            reservationInfo.prices.push({count:Number(ticket.value),productPriceId:ticket.dataset.priceId});
        }
        const xhr = new XMLHttpRequest();
        xhr.open("POST","../api/tempFormHandle");
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(reservationInfo));
    });
});

