document.addEventListener("DOMContentLoaded",()=>{
    const comments = document.querySelectorAll(".comment .eachComment");
    comments.forEach(comment =>{
        const image = comment.querySelector(".topContainer .rightContainer img");
        if(image){
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
    });
});