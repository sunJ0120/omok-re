let isIdChecked = false;

document.addEventListener('DOMContentLoaded', function () {
    const checkButton = document.getElementById('id_check_button');
    const userIdInput = document.getElementById('userId');
    const idNotice = document.getElementById('id_notice');

    // 공백 입력시 공백 제거 (공백 못 들어가게)
    userIdInput.addEventListener('input', function () {
        this.value = this.value.replace(/\s/g, '');  // 모든 공백 제거
    });

    checkButton.addEventListener('click', function () {
        const userId = userIdInput.value;
        const regex = /^[a-zA-Z0-9]*$/;

        //빈 값일시 클릭 전에 막아준다.
        if (userId === "") {
            idNotice.textContent = "아이디를 입력해주세요.";
            idNotice.className = "form-notice no-match";
            isIdChecked = false;
            return;
        }

        // 정규식 유효성 검사 실패 시 중단
        if (!regex.test(userId)) {
            idNotice.textContent = "영문자와 숫자만 입력해주세요.";
            idNotice.className = "form-notice no-match";
            isIdChecked = false;
            return;
        }

        fetch(`/check-id?userId=${encodeURIComponent(userId)}`)
            .then(res => res.json())
            .then(data => {
                if (data.exists) {
                    idNotice.textContent = '이미 사용 중인 아이디입니다.';
                    idNotice.className = 'form-notice no-match';
                    isIdChecked = false;
                } else {
                    idNotice.textContent = '사용 가능한 아이디입니다!';
                    idNotice.className = 'form-notice match';
                    isIdChecked = true;
                }
            });
    });
    userIdInput.addEventListener('input', function () {
        idNotice.textContent = "영문자, 숫자 조합 12자 이내";
        idNotice.classList.remove("match", "no-match");
        idNotice.classList.add("guide");

        // 중복확인 결과를 무효화
        isIdChecked = false;  // 전역 변수로 관리
    });
});