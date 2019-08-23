/*
placeHolder 설정
*/


function validImageType(image) {
	const result = ([ 'image/jpeg',
					  'image/png',
					  'image/jpg' ].indexOf(image.type) > -1);
	return result;
}

document.addEventListener("DOMContentLoaded",()=>{
    const form = document.forms["reviewForm"];
    const starContainer = document.querySelector(".writeReview .ratingStar");
    const scoreCount = form["score"];
    const commentInput = form["comment"];
    const commentCount = document.querySelector(".writeReview .postImage .commentCount span");
    const imageInput = form["image"];
    const thumbnailImage = document.querySelector(".writeReview .thumbnailImage");
    const imageUploadCancel = thumbnailImage.querySelector("i");
    const thumbnailWidth = 200;
    const submitButton = form["submit"];
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
        scoreCount.style.color = "#000";
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
        }
    });
    imageUploadCancel.addEventListener("click",()=>{
        imageInput.value = "";
        thumbnailImage.style.display = "none";
        thumbnailImage.style.backgroundImage = "";
    });
    submitButton.addEventListener("click",event => {
        event.preventDefault();
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
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if(xhr.status === 400){
                alert(xhr.responseText);
            }
            else if(xhr.status === 201){
                alert("한줄평이 등록되었습니다");
                window.location.href = "/myreservation";
            }
        }
        xhr.open("POST",form.action);
        xhr.send(formObj);
    });
});