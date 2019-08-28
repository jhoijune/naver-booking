function validImageType(image) {
	const result = ([ 'image/jpeg',
					  'image/png',
					  'image/jpg' ].indexOf(image.type) > -1);
	return result;
}

document.addEventListener("DOMContentLoaded",()=>{
    const comments = document.querySelector(".comment");
    const commentsContainer = comments.querySelector(".innerContainer");
    comments.addEventListener("click",event =>{
        if(event.target.classList.contains("edit")){
            const comment = event.target.closest(".eachComment");
            const xhr = new XMLHttpRequest();
            xhr.onload = () =>{
                if(xhr.status === 400){
                    return alert(xhr.responseText);
                }
                const image = comment.querySelector(".topContainer .rightContainer img")
                const exData = {
                    comment: comment.querySelector(".topContainer .leftContainer p").innerText,
                    imageSrc: image ? image.src : null,
                    score: Number(comment.querySelector(".score").innerText),
                    email: comment.querySelector(".email").innerText,
                    visitDate: comment.querySelector(".visitDate").innerText,
                }
                const star = ["notGetStar","notGetStar","notGetStar","notGetStar","notGetStar"];
                for(let i=0;i<exData.score;i++){
                    star[i] = "getStar";
                } 
                const boundData = {
                    commentId:comment.dataset.commentId,
                    star:star,
                    score: exData.score,
                    exComment:exData.comment,
                    exCommentLength: exData.comment.length,
                } 
                const editReviewTemplate = document.querySelector("#editReviewTemplate").innerHTML;
                const reviewTemplate = document.querySelector("#reviewTemplate").innerHTML;
                const bindEditTemplate = Handlebars.compile(editReviewTemplate);
                comment.innerHTML = bindEditTemplate(boundData);
                const form = document.forms["reviewForm"];
                const starContainer = document.querySelector(".writeReview .ratingStar");
                const scoreCount = form["score"];
                const commentInput = form["comment"];
                const commentCount = document.querySelector(".writeReview .postImage .commentCount span");
                const imageInput = form["image"];
                const thumbnailImage = document.querySelector(".writeReview .thumbnailImage");
                const imageUploadCancel = thumbnailImage.querySelector("i");
                const thumbnailWidth = 200;
                const submitButton = form["change"];
                const cancelButton = form["cancel"];
                let newImage = 0; // -1: 제거함 0: 그대로 1: 추가함
                if(exData.imageSrc){
                    const imageMeasurement = new Image();
                    imageMeasurement.src = exData.imageSrc;
                    imageMeasurement.onload = function() {
                        const ratio = this.height / this.width;
                        thumbnailImage.style.display = "flex";
                        thumbnailImage.style.height = `${thumbnailWidth * ratio}px`
                        thumbnailImage.style.backgroundImage = `url("${exData.imageSrc}")`;
                    }
                }
                starContainer.addEventListener("click",event => {
                    if(event.target.localName !== "i") return;
                    let currentPosition = event.target;
                    let score = 0;
                    while(currentPosition){
                        currentPosition.classList.remove("notGetStar");
                        currentPosition.classList.add("getStar");
                        score += 1;
                        currentPosition = currentPosition.previousElementSibling;
                    }
                    scoreCount.value = score;
                    currentPosition = event.target.nextElementSibling;
                    while(currentPosition.localName !== "input"){
                        currentPosition.classList.remove("getStar");
                        currentPosition.classList.add("notGetStar");
                        currentPosition = currentPosition.nextElementSibling;
                    }
                });
                commentInput.addEventListener("input",()=>{
                    commentCount.innerText = commentInput.value.length;
                })
                imageInput.addEventListener("change",event => {
                    const image = event.target.files[0];
                    if(!validImageType(image)) { 
                        alert("이미지는 jpg,jpeg,png 파일만 가능합니다");
                        event.target.value = "";
                        return;
                    }
                    const imageMeasurement = new Image();
                    imageMeasurement.src = window.URL.createObjectURL(image);
                    imageMeasurement.onload = function() {
                        const ratio = this.height / this.width;
                        thumbnailImage.style.display = "flex";
                        thumbnailImage.style.height = `${thumbnailWidth * ratio}px`
                        thumbnailImage.style.backgroundImage = `url(${window.URL.createObjectURL(image)})`;
                        newImage = 1;
                    }
                });
                imageUploadCancel.addEventListener("click",()=>{
                    imageInput.value = "";
                    thumbnailImage.style.display = "none";
                    thumbnailImage.style.backgroundImage = "";
                    newImage = -1;
                });
                submitButton.addEventListener("click",event =>{
                    event.preventDefault();
                    if(confirm("리뷰를 수정하시겠습니까?")){
                        if(Number(scoreCount.value) <= 0 || Number(scoreCount.value) > 5 || !Number.isInteger(Number(scoreCount.value))){
                            return alert("별점 개수가 올바르지 않습니다");
                        }
                        if(commentInput.value.length < 5 || commentInput.value.length > 400){
                            return alert("리뷰 글자수가 맞지 않습니다.");
                        }
                        if(imageInput.files.length && !validImageType(imageInput.files[0])){
                            return alert("이미지는 jpg,jpeg,png 파일만 가능합니다");
                        }
                        const formObj = new FormData(form);
                        formObj.append("exImage",!!exData.imageSrc);
                        formObj.append("newImage",newImage)
                        const xhr = new XMLHttpRequest();
                        xhr.onload = () => {
                            if(xhr.status === 400){
                                alert(xhr.responseText);
                            }
                            else if(xhr.status === 201){
                                alert("리뷰가 수정되었습니다");
                                const bindReviewTemplate = Handlebars.compile(reviewTemplate);
                                const newData = {
                                    comment: commentInput.value,
                                    score: scoreCount.value,
                                    email: exData.email,
                                    visitDate: exData.visitDate,
                                };
                                if(newImage > 0){
                                    newData.imageSrc = window.URL.createObjectURL(imageInput.files[0])
                                }
                                else if(newImage + Number(!!exData.imageSrc) === 0){
                                    newData.imageSrc = null;
                                }
                                else{
                                    newData.imageSrc = exData.imageSrc;
                                }
                                comment.innerHTML = bindReviewTemplate(newData);
                                showImage(comment);
                            }
                        }
                        xhr.open("PUT",form.action);
                        xhr.send(formObj);
                    }
                });
                cancelButton.addEventListener("click",()=>{
                    if(confirm("리뷰 수정을 취소하시겠습니까?")){
                        const bindReviewTemplate = Handlebars.compile(reviewTemplate);
                        comment.innerHTML = bindReviewTemplate(exData);
                        showImage(comment);
                    }
                });
            }
            xhr.open("GET",`/auth/edit/comments/${comment.dataset.commentId}`);
            xhr.send();
        }
        else if(event.target.classList.contains("delete")){
            const comment = event.target.closest(".eachComment");
            const xhr = new XMLHttpRequest();
            xhr.onload = () =>{
                if(xhr.status === 400){
                    alert(xhr.responseText);
                }
                else if(xhr.status === 201){
                    alert("리뷰가 삭제되었습니다");
                    commentsContainer.removeChild(comment);
                }
            }
            xhr.open("DELETE",`/api/reservations/comments/${comment.dataset.commentId}`);
            xhr.send();
        }
        else{
            return;
        }
    });
});