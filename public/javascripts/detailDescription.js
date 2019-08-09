document.addEventListener("DOMContentLoaded",()=>{
    function changeInfo(event){
        if(event.target.className === "unselected"){
            selectedInfo.setAttribute("class","unselected");
            infoList[selectedInfo.getAttribute("id")].style.display = "none";
            selectedInfo = event.target;
            selectedInfo.setAttribute("class","selected");
            infoList[selectedInfo.getAttribute("id")].style.display = "block";
        }
    } 
    const tabUI = document.querySelector(".detailDescription ul");
    let selectedInfo = tabUI.querySelector(".selected");
    const infoList = {
        productInfo: document.querySelector(".detailDescription article.productInfo"),
        locInfo: document.querySelector(".detailDescription article.locInfo"),
    }
    tabUI.addEventListener("click",changeInfo);
});