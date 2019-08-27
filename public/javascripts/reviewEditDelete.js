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
                // form 보여줘야 함
                // eachComment를 innerContainer에서 빼고 
                // eachComment의 정보를 담아야 함
                const editReview = document.querySelector("#editReviewTemplate");
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