document.addEventListener("DOMContentLoaded",()=>{
    const collectionUseButton = document.querySelector(".reserveSection .TOS .collectionUseAgreement");
    const collectionUseTerm = document.querySelector(".reserveSection .TOS .collectionUseTerm");
    const offerButton = document.querySelector(".reserveSection .TOS .offerAgreement");
    const offerTerm = document.querySelector(".reserveSection .TOS .offerTerm");
    collectionUseButton.addEventListener("click",()=>{
        if(collectionUseTerm.style.display === "none"){
            $(".collectionUseTerm").slideDown();
            collectionUseButton.innerHTML = "접기 <i class='fn fn-up2'></i>"
        }
        else{
            $(".collectionUseTerm").slideUp();
            collectionUseButton.innerHTML = "보기 <i class='fn fn-down2'></i>"     
        }
        
    });
    offerButton.addEventListener("click",()=>{
        if(offerTerm.style.display === "none"){
            $(".offerTerm").slideDown();
            offerButton.innerHTML = "접기 <i class='fn fn-up2'></i>"
        }
        else{
            $(".offerTerm").slideUp();
            offerButton.innerHTML = "보기 <i class='fn fn-down2'></i>"     
        }
    });
});