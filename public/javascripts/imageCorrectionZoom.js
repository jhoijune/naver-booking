function showImage(comment){
    const image = comment.querySelector(".topContainer .rightContainer img");
    if(image && image.src){
        const paragraph = comment.querySelector(".topContainer .leftContainer p");
        const topHeight = paragraph.offsetHeight;
        image.style.height = `${topHeight}px`;
        if(image.src.split(":")[0] === "blob"){
            image.onload = function(){
                const scaleValue = image.height / topHeight;
                image.style.display = "inline";
                image.addEventListener("mouseenter",()=>{
                    image.style.transform = `scale(${scaleValue})`;
                });
                image.addEventListener("mouseleave",()=>{
                    image.style.transform = `scale(1)`;
                });
            }
        }
        else{
            const scaleValue = image.height / topHeight;
            image.style.display = "inline";
            image.addEventListener("mouseenter",()=>{
                image.style.transform = `scale(${scaleValue})`;
            });
            image.addEventListener("mouseleave",()=>{
                image.style.transform = `scale(1)`;
            });
        }
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    const comments = document.querySelectorAll(".comment .eachComment");
    comments.forEach(showImage);
});