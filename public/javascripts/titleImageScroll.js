document.addEventListener("DOMContentLoaded",()=>{
    const leftArrow = document.querySelector(".titleText .leftSection i");
    const rightArrow = document.querySelector(".titleText .rightSection i");
    if(leftArrow){
        function leftScroll(){
            if(degree === 0) return;
            degree = (degree - 1);
            const interval = firstItem.clientWidth;
            imageList.style.transform = `translateX(-${interval*degree}px)`;
            imageCounting.innerText = ` ${degree + 1} `;
        }
        function rightScroll(){
            if(degree === imageLen-1) return;
            degree = (degree + 1) % imageLen;
            const interval = firstItem.clientWidth;
            imageList.style.transform = `translateX(-${interval*degree}px)`;
            imageCounting.innerText = ` ${degree + 1} `;
        }
        let degree = 0;
        const imageList = document.querySelector(".titleImage ul");
        const firstItem = imageList.firstElementChild;
        const imageLen = imageList.querySelectorAll("li").length;
        const imageCounting = document.querySelector(".titleText .topSection .bright");
        leftArrow.addEventListener("click",leftScroll);
        rightArrow.addEventListener("click",rightScroll);
    } 
});
