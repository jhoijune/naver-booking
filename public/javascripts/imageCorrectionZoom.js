function showImage(comment){
    const image = comment.querySelector(".topContainer .rightContainer img");
    if(image && image.src){
        const paragraph = comment.querySelector(".topContainer .leftContainer p");
        const topHeight = paragraph.offsetHeight;
        const scaleValue = image.height / topHeight;
        image.style.height = `${topHeight}px`;
        image.style.display = "inline";
        image.addEventListener("mouseenter",()=>{
            image.style.transform = `scale(${scaleValue})`;
        });
        image.addEventListener("mouseleave",()=>{
            image.style.transform = `scale(1)`;
        });
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    const comments = document.querySelectorAll(".comment .eachComment");
    comments.forEach(showImage);
});