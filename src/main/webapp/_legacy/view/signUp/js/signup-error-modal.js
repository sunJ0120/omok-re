/*
http://톰캣서버/login?error=1 로 error param이 올 경우
param이 = 1이면 hidden 클래스를 없애서 modal을 띄우도록 구성
 */
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error === "1") {
        showAlert("회원가입에 실패했습니다."); //이를 통해 alertMsg 내부의 text를 받은 message로 설정
    }

    function showAlert(message){
        document.getElementById("alertMsg").innerText = message; //innertext를 변경
        document.getElementById("customAlert").classList.remove("hidden");
    }

    window.closeAlert = function (){
        document.getElementById("customAlert").classList.add("hidden");
    }
});