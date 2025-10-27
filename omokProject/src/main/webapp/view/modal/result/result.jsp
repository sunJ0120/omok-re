
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import ="org.sinhan.omokproject.domain.UserVO"%>
<%@ page import ="org.sinhan.omokproject.domain.GameVO"%>
<%@ page import="org.sinhan.omokproject.repository.sunJMatchingDAO.GameDAO" %>
<%

    // 로그인 유저 정보
    UserVO loginUser = (UserVO) session.getAttribute("loginInfo");
    String userId = loginUser != null? loginUser.getUserId() : "unknown";
    int win = loginUser != null ? loginUser.getWin() : 0;
    int lose = loginUser != null ? loginUser.getLose() : 0;
    int imgNumber = loginUser != null ? loginUser.getImage() : -1;

    String gameIdParam = request.getParameter("gameId"); // URL에서 gameId 가져오기
    int gameId = -1;
    String resultImage = "/img/lose_text.png";

    if (gameIdParam  != null) {
        GameVO game = GameDAO.INSTANCE.getGameById(gameId);
        if (game != null && userId.equals(game.getWinnerId())) {
            resultImage = "/img/win_text.png";
        }
    }

    int total = win + lose;
    int winRate = total > 0 ? (int)((double) win / total * 100) : 0;
%>
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
                <div id="user_img"></div>
                <div id="explanation">
                    <div>아이디: <%=userId%></div><br>
                    <div><%=win+lose%>전 <%=win%>승 <%=lose%>패</div>
                    <div id="bar">
                        <div id="win_bar"></div>
                        <div id="lose_bar"></div>
                    </div>
                    <div id="bar_label">
                        <div id="win_label">승 (<%=(win*100/(win+lose))%>%)</div>
                        <div id="lose_label">패 (<%=(lose*100/(win+lose))%>%)</div>
                    </div>
                </div>
            </div>
            <div id="btn">
                <button id="go_main_btn">메인 메뉴</button>
                <button id="re_btn">다시 시작</button>
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
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            document.getElementById("text").style.background = "url('<%= resultImage %>') no-repeat center center";
            document.getElementById("text").style.cssText = `
                background-size: contain;
                height: 25%;
                margin-top: 9%;
            `;

            document.getElementById("user_img").style.background = "url('/img/profile/<%= imgNumber %>.png') no-repeat center center";
            document.getElementById("user_img").style.cssText = `
                flex-basis: 35%;
                aspect-ratio: 1 / 1;
                background-size: contain;
                min-width: 80px;
            `;

            const win = <%= win %>;
            const lose = <%= lose %>;
            const total = win + lose;

            const winRate = total > 0 ? (win / total) * 100 : 0;
            const loseRate = total > 0 ? (lose / total) * 100 : 0;

            // document.getElementById("bar").style.width = "100%";
            document.getElementById("bar").style.cssText = `
                width = "100%";
                display: flex;
                height: 23px;
                background-color: #ddd; /* 전체 바 배경 */
                border-radius: 10px;
                overflow: hidden;
                margin-top: 10%;
                border: 3px solid #333;
            `;
            document.getElementById("win_bar").style.cssText = `
                height: 23px;
                 background-color: #4a68c3;
                 font-size: clamp(8px, 1.5vw, 13px);
                 display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            `;
            document.getElementById("lose_bar").style.cssText = `
                height: 23px;
                background-color: #f44336;
                font-size: clamp(8px, 1.5vw, 13px);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            `;
            document.getElementById("bar_label").style.cssText = `
                display: flex;
                justify-content: space-between;
                margin-top: 4%;
                font-size: clamp(10px, 1.5vw, 15px);
                padding: 0 5px;
            `;
            document.getElementById("win_bar").style.width = winRate + "%";
            // document.getElementById("win_bar").style.height = "10px";
            document.getElementById("lose_bar").style.width = loseRate + "%";
            // document.getElementById("lose_bar").style.height = "10px";
        });
    </script>
</body>
</html>
