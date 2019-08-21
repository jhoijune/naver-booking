document.addEventListener("DOMContentLoaded",()=>{
    const toUsedSection = document.querySelector(".reservationInfo .toUsed");
    const toUsedList = document.querySelector(".reservationInfo .toUsed ul");
    const toUsedCount = document.querySelector(".reservationCount .toUsed h1");
    const canceledList = document.querySelector(".reservationInfo .canceled ul");
    const canceledReservation = canceledList.querySelectorAll("li");
    const canceledCount = document.querySelector(".reservationCount .canceled h1");
    toUsedSection.addEventListener("click",event=> {
        if(event.target.localName === "button"){    
            if(confirm("한번 취소하시면 다시 되돌릴 수 없습니다 그래도 하시겠습니까?")){
                const button = event.target;
                const xhr = new XMLHttpRequest();
                xhr.onload = () =>{
                    alert("예약이 취소되었습니다");
                    const specificReservation = button.closest("li"); 
                    specificReservation.removeChild(button);
                    toUsedList.removeChild(specificReservation);
                    if(canceledReservation.length === 0){
                        canceledList.appendChild(specificReservation);
                    }
                    else{
                        const rawAddReservationId = specificReservation.querySelector(".topSection h2");
                        const addReservationId = parseInt(rawAddReservationId.innerText.slice(3));
                        let beforeReservationId;
                        for(let index = 0,len=canceledReservation.length; index < len ; index++){
                            const rawReservationId = canceledReservation[index].querySelector(".topSection h2");
                            const reservationId = parseInt(rawReservationId.innerText.slice(3));
                            if(addReservationId < reservationId && index === 0){
                                // 처음 삽입
                                canceledList.insertBefore(specificReservation,canceledReservation[index]);
                                break;
                            }
                            if(beforeReservationId < addReservationId && addReservationId < reservationId){
                                // 중간 삽입
                                canceledList.insertBefore(specificReservation,canceledReservation[index]);
                                break;
                            }
                            if(addReservationId > reservationId && index === canceledReservation.length -1){
                                // 끝 삽입
                                canceledList.appendChild(specificReservation);
                                break;
                            }
                            beforeReservationId = reservationId;
                        }
                    }
                    toUsedCount.innerText = Number(toUsedCount.innerText) - 1;
                    canceledCount.innerText = Number(canceledCount.innerText) + 1;
                }
                xhr.open("PUT",`/api/reservations/${button.dataset.reservationInfoId}`);
                xhr.send();
            }
            else{
                return;
            }
        }
    });
});