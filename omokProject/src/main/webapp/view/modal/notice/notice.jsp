
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title>Title</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
<div id="modal">
  <div id="board">
    <div id="text"></div>
    <div id="info">
      <div class="explanation">게임 중 나가시면 <span class="highlight">패배</span>하게 됩니다.</div>
      <div class="explanation">정말로 나가시겠습니까?</div>
    </div>
    <div id="btn">
      <button id="go_main_btn">계속하기</button>
      <button id="re_btn">나가기</button>
    </div>
  </div>
</div>
<button id="btn-open-modal">모달 열기</button>

<script>
  const modal = document.querySelector('#modal');
  const btnOpenModal=document.querySelector('#btn-open-modal');
  const closeModal = document.querySelector('#go_main_btn');
  const closeModal2 = document.querySelector('#re_btn');

  btnOpenModal.addEventListener("click", ()=>{
    modal.style.display="flex";
  });
  closeModal.addEventListener("click", ()=>{
    modal.style.display="none";
  });
  closeModal2.addEventListener("click", ()=>{
    modal.style.display="none";
  });
</script>
</body>
</html>
