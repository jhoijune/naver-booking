function createArticle(){
    const article = document.createElement("article");
    const anchor = document.createElement("a");
    article.appendChild(anchor);
    const itemImg = document.createElement("div");
    itemImg.className = "photo";
    const headPart = document.createElement("div");
    headPart.className = "head";
    const itemName = document.createElement("h1");
    const itemPlace = document.createElement("h2");
    headPart.appendChild(itemName);
    headPart.appendChild(itemPlace);
    const textPart = document.createElement("div");
    textPart.className = "mainText";
    const itemTextSimple = document.createElement("p");
    itemTextSimple.setAttribute("class","simple");
    const itemTextDetail = document.createElement("p");
    itemTextDetail.setAttribute("class","detail");
    textPart.appendChild(itemTextSimple);
    textPart.appendChild(itemTextDetail);
    anchor.appendChild(itemImg);
    anchor.appendChild(headPart);
    anchor.appendChild(textPart);
    return article;
}

function updateArticle(article,itemInfo){
    article.querySelector("a").href = `detail/${itemInfo.displayInfoId}`;
    article.querySelector(".photo").style.backgroundImage = `url("${itemInfo.productImageUrl}")`;
    article.querySelector("h1").innerText = itemInfo.productDescription;
    article.querySelector("h2").innerText = itemInfo.placeName;
    const paragraphSimple = article.querySelector("p.simple");
    const textObj = splitText(itemInfo.productContent);
    paragraphSimple.innerText = textObj.simple;
    paragraphSimple.innerHTML = paragraphSimple.innerHTML.replace(/\<br\>/g,"");
    if(textObj.detail){
        const paragraphDetail = article.querySelector("p.detail");
        paragraphDetail.innerText = textObj.detail;
        paragraphDetail.innerHTML = paragraphDetail.innerHTML.replace(/\<br\>/g,"");
    }
}

function splitText(text,limit=100){
    text = text.trim();
    text = text.replace("\n","");
    let textObj;
    if(text.length > limit){
        textSimple = text.slice(0,limit);
        textSimple += "...";
        textDetail = text.slice(limit);
        textObj = {simple:textSimple,detail:textDetail};
    }
    else{
        textObj = {simple:text,detail:""};
    }
    return textObj;
}

function filterProduct(products,categoryId){
    let specificProducts;
    if(categoryId === 0){
        specificProducts = products;
    }
    else{
        specificProducts = [];
        products.forEach(element=>{
            if(element.categoryId === categoryId){
                specificProducts.push(element);
            }
        });
    }
    return specificProducts;
}

document.addEventListener("DOMContentLoaded",()=>{
    const xhrCategories = new XMLHttpRequest();
    const categoryClassification = {allList:0,exhibition:1,musical:2,concert:3,classic:4,acting:5};
    xhrCategories.onload = function(){
        const category = JSON.parse(xhrCategories.responseText).items;
        let categoryLen = 0;
        category.forEach(element =>{
            categoryLen += element.count;
        });
        category.unshift({count:categoryLen,id:0,name:"전체"});
        const xhrProducts = new XMLHttpRequest();
        xhrProducts.onload = function(){
            function fillArticle(){
                if(listInfo.left.fillCount === listInfo.right.fillCount){
                    updateArticle(leftArticle[listInfo.left.fillCount],specificProducts[listInfo.all.fillCount]);
                    listInfo.all.fillCount += 1;
                    listInfo.left.fillCount += 1;
                }
                else{
                    updateArticle(rightArticle[listInfo.right.fillCount],specificProducts[listInfo.all.fillCount]);
                    listInfo.all.fillCount += 1;
                    listInfo.right.fillCount += 1;
                }  
            }
            function showArticle(){
                listInfo.all.noneCount -= 1;
                if(listInfo.left.fillCount + listInfo.left.noneCount !== listInfo.left.count){
                    listInfo.left.noneCount -= 1;
                    leftArticle[listInfo.left.fillCount-1].style.display = "block";
                }
                else{
                    listInfo.right.noneCount -= 1;
                    rightArticle[listInfo.right.fillCount-1].style.display ="block";
                }
            }
            function showMoreProduct(){
                if(listInfo.all.fillCount === specificProducts.length){
                    return;
                }
                let requiredCount; 
                if(listInfo.all.fillCount + basisCount <= specificProducts.length){
                    requiredCount = basisCount;
                }
                else{
                    requiredCount = specificProducts.length - listInfo.all.fillCount;
                }
                if(listInfo.all.noneCount >= requiredCount){
                    for(let i=0;i<requiredCount;i++){
                        fillArticle();
                        showArticle();
                    }
                }
                else if(listInfo.all.noneCount === 0){
                    for(let i=0;i<requiredCount;i++){
                        // 갱신 안하려면 childNodes로 바꿔야함
                        if(listInfo.left.fillCount === listInfo.right.fillCount){
                            leftContainer.appendChild(createArticle());
                            listInfo.all.count += 1;
                            listInfo.left.count += 1;
                            leftArticle = leftContainer.querySelectorAll("article");
                            fillArticle();
                        }
                        else{
                            rightContainer.appendChild(createArticle());
                            listInfo.all.count += 1;
                            listInfo.right.count += 1;
                            rightArticle = rightContainer.querySelectorAll("article");
                            fillArticle();
                        }
                    }
                }
                else {
                    for(let i=0;i<listInfo.all.noneCount;i++){
                        fillArticle();
                        showArticle();
                    }
                    for(let i=0;i<requiredCount-listInfo.all.noneCount;i++){
                        if(listInfo.left.fillCount === listInfo.right.fillCount){
                            leftContainer.appendChild(createArticle());
                            listInfo.all.count += 1;
                            listInfo.left.count += 1;
                            leftArticle = leftContainer.querySelectorAll("article");
                            fillArticle();
                        }
                        else{
                            rightContainer.appendChild(createArticle());
                            listInfo.all.count += 1;
                            listInfo.right.count += 1;
                            rightArticle = rightContainer.querySelectorAll("article");
                            fillArticle();
                        }
                    }
                }
            }
            function changeCategory(event){
                if(event.target.className === "selected"){
                    return;
                }
                selectedCategory.setAttribute("class","unselected");
                selectedCategory = event.target;
                selectedCategory.setAttribute("class","selected");
                categoryName = selectedCategory.getAttribute("id"); 
                categoryId = categoryClassification[categoryName]; 
                categoryInfo = category[categoryId];
                specificProducts = filterProduct(products,categoryId);
                count.textContent = `${specificProducts.length}개`;
                listInfo.all.fillCount = 0;
                listInfo.left.fillCount = 0;
                listInfo.right.fillCount = 0;
                listInfo.all.noneCount = listInfo.all.count - basisCount;
                listInfo.left.noneCount = listInfo.left.count - Math.ceil(basisCount/2);
                listInfo.right.noneCount = listInfo.right.count - Math.floor(basisCount/2);
                if(listInfo.left.noneCount !== 0){
                    for(let i=(listInfo.left.count-1);i>=listInfo.left.count-listInfo.left.noneCount;i--){
                        leftArticle[i].style.display = "none";
                    }
                }
                if(listInfo.right.noneCount !== 0){
                    for(let i=(listInfo.right.count-1);i>=listInfo.right.count-listInfo.right.noneCount;i--){
                        rightArticle[i].style.display = "none";
                    }
                }
                for(let i=0;i<basisCount;i++){
                    fillArticle();
                }                     
            } 
            function showDetailText(event){
                if(event.target.className === "simple"){
                    const simpleText = event.target;
                    const previousText = simpleText.innerText;
                    const detailText = event.target.nextElementSibling;
                    // previousText에 ... 있으면 제거하고 합침
                    if(previousText.slice(-3) === "..."){
                        simpleText.innerText = previousText.slice(0,-3);
                    }
                    simpleText.innerText += detailText.innerText;
                    event.target.parentElement.addEventListener("mouseleave",()=>{
                        simpleText.innerText = previousText;
                    });
                }
            }
            const products = JSON.parse(xhrProducts.responseText).items;
            let selectedCategory = document.querySelector(".selected");
            let categoryName = selectedCategory.getAttribute("id"); 
            let categoryId = categoryClassification[categoryName]; // 무슨 카테고리가 선택되었는지
            let categoryInfo = category[categoryId];
            const count = document.querySelector(".totalCount strong");
            let specificProducts = filterProduct(products,categoryId);
            count.textContent = `${specificProducts.length}개`;
            const itemList = document.querySelector(".itemList");
            const leftContainer = document.querySelector(".itemList .leftContainer");
            let leftArticle = leftContainer.querySelectorAll("article");
            const rightContainer = document.querySelector(".itemList .rightContainer");
            let rightArticle = rightContainer.querySelectorAll("article");
            const basisCount = itemList.querySelectorAll(".itemList article").length;
            const listInfo = {
                all: {
                    count: itemList.querySelectorAll(".itemList article").length,
                    fillCount:0,
                    noneCount: 0,
                },
                left:{
                    count: leftArticle.length,
                    fillCount: 0,
                    noneCount:0,
                },
                right:{
                    count: rightArticle.length,
                    fillCount: 0,
                    noneCount: 0,
                },
            }
            for(let i=0;i<basisCount;i++){
                fillArticle();
            }
            const tabUI = document.querySelector(".category ul");
            const moreButton = document.querySelector(".helping .more");
            tabUI.addEventListener("click",changeCategory);
            moreButton.addEventListener("click",showMoreProduct);
            itemList.addEventListener("mouseover",showDetailText);
        };
        xhrProducts.onerror = function(){
            console.error(xhrProducts.responseText);
        }
        xhrProducts.open("GET","/api/products");
        xhrProducts.send();
    };
    xhrCategories.onerror = function(){
        console.error(xhrCategories.responseText);
    }
    xhrCategories.open("GET","/api/categories");
    xhrCategories.send();
});



/*
function createArticle(){
    const article = document.createElement("article");
    const anchor = document.createElement("a");
    article.appendChild(anchor);
    const itemImg = document.createElement("div");
    itemImg.className = "photo";
    const headPart = document.createElement("div");
    headPart.className = "head";
    const itemName = document.createElement("h1");
    const itemPlace = document.createElement("h2");
    headPart.appendChild(itemName);
    headPart.appendChild(itemPlace);
    const textPart = document.createElement("div");
    textPart.className = "mainText";
    const itemTextSimple = document.createElement("p");
    itemTextSimple.setAttribute("class","simple");
    const itemTextDetail = document.createElement("p");
    itemTextDetail.setAttribute("class","detail");
    textPart.appendChild(itemTextSimple);
    textPart.appendChild(itemTextDetail);
    anchor.appendChild(itemImg);
    anchor.appendChild(headPart);
    anchor.appendChild(textPart);
    return article;
}

function updateArticle(article,itemInfo){
    article.querySelector("a").href = itemInfo.productId;
    article.querySelector(".photo").style.backgroundImage = `url("${itemInfo.productImageUrl}")`;
    article.querySelector("h1").innerText = itemInfo.productDescription;
    article.querySelector("h2").innerText = itemInfo.placeName;
    const paragraphSimple = article.querySelector("p.simple");
    const textObj = splitText(itemInfo.productContent);
    paragraphSimple.innerText = textObj.simple;
    paragraphSimple.innerHTML = paragraphSimple.innerHTML.replace(/\<br\>/g,"");
    if(textObj.detail){
        const paragraphDetail = article.querySelector("p.detail");
        paragraphDetail.innerText = textObj.detail;
        paragraphDetail.innerHTML = paragraphDetail.innerHTML.replace(/\<br\>/g,"");
    }
}

function splitText(text,limit=100){
    text = text.trim();
    text = text.replace("\n","");
    let textObj;
    if(text.length > limit){
        textSimple = text.slice(0,limit);
        textSimple += "...";
        textDetail = text.slice(limit);
        textObj = {simple:textSimple,detail:textDetail};
    }
    else{
        textObj = {simple:text,detail:""};
    }
    return textObj;
}

function filterProduct(products,categoryId){
    let rawSpecificProducts;
    if(categoryId === 0){
        rawSpecificProducts = products;
    }
    else{
        rawSpecificProducts = [];
        products.forEach(element=>{
            if(element.categoryId === categoryId){
                rawSpecificProducts.push(element);
            }
        });
    }
    // productId 같으면 placeName이어 붙임
    const specificProducts = [];
    let productLen = 0;
    let currentId;
    rawSpecificProducts.forEach(element=>{
        if(currentId && currentId === element.productId){
            specificProducts[productLen - 1].placeName += `,${element.placeName.trim()}`;
        }
        else{
            currentId = element.productId;
            element.placeName = element.placeName.trim();
            specificProducts.push(element);
            productLen += 1;
        }
    });
    return specificProducts;
}

document.addEventListener("DOMContentLoaded",()=>{
    const xhrCategories = new XMLHttpRequest();
    //const categoryClassification = ["ALLLIST","EXHIBITION","MUSICAL","CONCERT","CLASSIC","ACTING"];
    const categoryClassification = {allList:0,exhibition:1,musical:2,concert:3,classic:4,acting:5};
    xhrCategories.onload = function(){
        const category = JSON.parse(xhrCategories.responseText).items;
        let categoryLen = 0;
        category.forEach(element =>{
            categoryLen += element.count;
        });
        category.unshift({count:categoryLen,id:0,name:"전체"});
        const xhrProducts = new XMLHttpRequest();
        xhrProducts.onload = function(){
            function fillArticle(){
                if(listInfo.left.fillCount === listInfo.right.fillCount){
                    updateArticle(leftArticle[listInfo.left.fillCount],specificProducts[listInfo.all.fillCount]);
                    listInfo.all.fillCount += 1;
                    listInfo.left.fillCount += 1;
                }
                else{
                    updateArticle(rightArticle[listInfo.right.fillCount],specificProducts[listInfo.all.fillCount]);
                    listInfo.all.fillCount += 1;
                    listInfo.right.fillCount += 1;
                }  
            }
            function showArticle(){
                listInfo.all.noneCount -= 1;
                if(listInfo.left.fillCount + listInfo.left.noneCount !== listInfo.left.count){
                    listInfo.left.noneCount -= 1;
                    leftArticle[listInfo.left.fillCount-1].style.display = "block";
                }
                else{
                    listInfo.right.noneCount -= 1;
                    rightArticle[listInfo.right.fillCount-1].style.display ="block";
                }
            }
            function showMoreProduct(){
                if(listInfo.all.fillCount === specificProducts.length){
                    return;
                }
                let requiredCount; 
                if(listInfo.all.fillCount + basisCount <= specificProducts.length){
                    requiredCount = basisCount;
                }
                else{
                    requiredCount = specificProducts.length - listInfo.all.fillCount;
                }
                if(listInfo.all.noneCount >= requiredCount){
                    for(let i=0;i<requiredCount;i++){
                        fillArticle();
                        showArticle();
                    }
                }
                else if(listInfo.all.noneCount === 0){
                    for(let i=0;i<requiredCount;i++){
                        // 갱신 안하려면 childNodes로 바꿔야함
                        if(listInfo.left.fillCount === listInfo.right.fillCount){
                            leftContainer.appendChild(createArticle());
                            listInfo.all.count += 1;
                            listInfo.left.count += 1;
                            leftArticle = leftContainer.querySelectorAll("article");
                            fillArticle();
                        }
                        else{
                            rightContainer.appendChild(createArticle());
                            listInfo.all.count += 1;
                            listInfo.right.count += 1;
                            rightArticle = rightContainer.querySelectorAll("article");
                            fillArticle();
                        }
                    }
                }
                else {
                    for(let i=0;i<listInfo.all.noneCount;i++){
                        fillArticle();
                        showArticle();
                    }
                    for(let i=0;i<requiredCount-listInfo.all.noneCount;i++){
                        if(listInfo.left.fillCount === listInfo.right.fillCount){
                            leftContainer.appendChild(createArticle());
                            listInfo.all.count += 1;
                            listInfo.left.count += 1;
                            leftArticle = leftContainer.querySelectorAll("article");
                            fillArticle();
                        }
                        else{
                            rightContainer.appendChild(createArticle());
                            listInfo.all.count += 1;
                            listInfo.right.count += 1;
                            rightArticle = rightContainer.querySelectorAll("article");
                            fillArticle();
                        }
                    }
                }
            }
            function changeCategory(event){
                if(event.target.className === "selected"){
                    return;
                }
                selectedCategory.setAttribute("class","unselected");
                selectedCategory = event.target;
                selectedCategory.setAttribute("class","selected");
                categoryName = selectedCategory.getAttribute("id"); 
                categoryId = categoryClassification[categoryName]; 
                categoryInfo = category[categoryId];
                count.textContent = `${categoryInfo.count}개`;
                specificProducts = filterProduct(products,categoryId);
                listInfo.all.fillCount = 0;
                listInfo.left.fillCount = 0;
                listInfo.right.fillCount = 0;
                listInfo.all.noneCount = listInfo.all.count - basisCount;
                listInfo.left.noneCount = listInfo.left.count - Math.ceil(basisCount/2);
                listInfo.right.noneCount = listInfo.right.count - Math.floor(basisCount/2);
                if(listInfo.left.noneCount !== 0){
                    for(let i=(listInfo.left.count-1);i>=listInfo.left.count-listInfo.left.noneCount;i--){
                        leftArticle[i].style.display = "none";
                    }
                }
                if(listInfo.right.noneCount !== 0){
                    for(let i=(listInfo.right.count-1);i>=listInfo.right.count-listInfo.right.noneCount;i--){
                        rightArticle[i].style.display = "none";
                    }
                }
                for(let i=0;i<basisCount;i++){
                    fillArticle();
                }                     
            } 
            function showDetailText(event){
                if(event.target.className === "simple"){
                    const simpleText = event.target;
                    const previousText = simpleText.innerText;
                    const detailText = event.target.nextElementSibling;
                    // previousText에 ... 있으면 제거하고 합침
                    if(previousText.slice(-3) === "..."){
                        simpleText.innerText = previousText.slice(0,-3);
                    }
                    simpleText.innerText += detailText.innerText;
                    event.target.parentElement.addEventListener("mouseleave",()=>{
                        simpleText.innerText = previousText;
                    });
                }
            }
            const products = JSON.parse(xhrProducts.responseText).items;
            let selectedCategory = document.querySelector(".selected");
            let categoryName = selectedCategory.getAttribute("id"); 
            let categoryId = categoryClassification[categoryName]; // 무슨 카테고리가 선택되었는지
            let categoryInfo = category[categoryId];
            const count = document.querySelector(".totalCount strong");
            count.textContent = `${categoryInfo.count}개`;
            const itemList = document.querySelector(".itemList");
            const leftContainer = document.querySelector(".itemList .leftContainer");
            let leftArticle = leftContainer.querySelectorAll("article");
            const rightContainer = document.querySelector(".itemList .rightContainer");
            let rightArticle = rightContainer.querySelectorAll("article");
            const basisCount = itemList.querySelectorAll(".itemList article").length;
            const listInfo = {
                all: {
                    count: itemList.querySelectorAll(".itemList article").length,
                    fillCount:0,
                    noneCount: 0,
                },
                left:{
                    count: leftArticle.length,
                    fillCount: 0,
                    noneCount:0,
                },
                right:{
                    count: rightArticle.length,
                    fillCount: 0,
                    noneCount: 0,
                },
            }
            let specificProducts = filterProduct(products,categoryId);
            for(let i=0;i<basisCount;i++){
                fillArticle();
            }
            const tabUI = document.querySelector(".category ul");
            const moreButton = document.querySelector(".helping .more");
            tabUI.addEventListener("click",changeCategory);
            moreButton.addEventListener("click",showMoreProduct);
            itemList.addEventListener("mouseover",showDetailText);
        };
        xhrProducts.onerror = function(){
            console.error(xhrProducts.responseText);
        }
        xhrProducts.open("GET","/api/products");
        xhrProducts.send();
    };
    xhrCategories.onerror = function(){
        console.error(xhrCategories.responseText);
    }
    xhrCategories.open("GET","/api/categories");
    xhrCategories.send();
});

*/