document.addEventListener("DOMContentLoaded",()=>{
    const xhrPromotion = new XMLHttpRequest();
    xhrPromotion.onload = function(){
        if(xhrPromotion.status === 200){
            function autoScroll(delay = 1){
                let degree = 0;
                setInterval(()=> {
                    if(scrollAble){
                        degree = (degree + 1) % len;
                        const interval = firstItem.clientWidth;
                        promotionList.style.transform = `translateX(-${interval*degree}px)`;
                    }
                },delay*1000);
            }
            const datas = JSON.parse(xhrPromotion.responseText).items;
            const promotionList = document.createElement("ul");
            for(let i=0,len=datas.length;i<len;i++){
                const item = document.createElement("li");
                const anchor = document.createElement("a");
                anchor.href = datas[i].productID; // 임시
                const image = document.createElement("img");
                image.src = datas[i].productImageUrl;
                anchor.appendChild(image);
                item.appendChild(anchor);
                promotionList.appendChild(item);
            }
            const promotionContainer = document.querySelector(".promotion .container");
            promotionContainer.appendChild(promotionList);
            const len = promotionList.querySelectorAll("li").length;
            const firstItem = promotionList.firstElementChild;
            let scrollAble = true;
            autoScroll(2);
            window.addEventListener("resize",()=>{
                // 즉시 멈추고 resize한 width에 맞게 translateX를 바꿔야 함
                // resize 끝나면 다시 autoScroll
                scrollAble = false;
            });
            promotionList.addEventListener("mousemove",()=>{
                scrollAble = false;
            });
            promotionList.addEventListener("mouseleave",()=>{
                scrollAble = true;
                // 즉시 스크롤 되게 바꿔야함
            });
        }    
        else{
            console.error(xhrPromotion.responseText);
        }
    };
    xhrPromotion.onerror = function(){
        console.error(xhrPromotion.responseText);
    }
    xhrPromotion.open("GET","/api/promotions");
    xhrPromotion.send();
});