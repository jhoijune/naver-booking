document.addEventListener("DOMContentLoaded",()=>{
    const xhrPromotion = new XMLHttpRequest();
    xhrPromotion.onload = function(){
        if(xhrPromotion.status === 200){
            function autoScroll(delay = 1){
                setInterval(()=> {
                    if(scrollAble){
                        if(degree === (promotionLen-1)){
                            promotionList.style.transitionDuration = "0s";
                            promotionList.style.transform = "translateX(0px)";
                            degree = 0;
                        }
                        degree = degree + 1;
                        const interval = firstItem.clientWidth;
                        if(degree === 1){
                            // transform이 바로 적용이 안되서 임시로 여기에다가 둠
                            promotionList.style.transitionDuration = originalTransitionDuration;
                        }
                        promotionList.style.transform = `translateX(-${interval*degree}px)`;
                    }
                },delay*1000);
            }
            function debounce(func){
                let timer;
                return function(event){
                    if(timer) clearTimeout(timer);
                    timer = setTimeout(func,100,event);
                };
            }
            const datas = JSON.parse(xhrPromotion.responseText).items;
            const promotionList = document.createElement("ul");
            const originalTransitionDuration = promotionList.style.transitionDuration;
            for(let i=0,promotionLen=datas.length;i<=promotionLen;i++){
                const index = i % promotionLen;
                const item = document.createElement("li");
                const anchor = document.createElement("a");
                anchor.href = `detail?productID=${datas[index].productID}`; // redirect로
                const image = document.createElement("img");
                image.src = datas[index].productImageUrl;
                anchor.appendChild(image);
                item.appendChild(anchor);
                promotionList.appendChild(item);
            }
            const promotionContainer = document.querySelector(".promotion .container");
            promotionContainer.appendChild(promotionList);
            let degree = 0;
            const promotionLen = promotionList.querySelectorAll("li").length;
            const firstItem = promotionList.firstElementChild;
            let scrollAble = true;
            autoScroll(2);
            window.addEventListener("resieze",()=>{
                // resize 시작했을 때
                scrollAble = false;
            });
            window.addEventListener("resize",debounce((event)=>{
                // resize 끝났을 때
                scrollAble = true;
            }));
            promotionList.addEventListener("mouseover",()=>{
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