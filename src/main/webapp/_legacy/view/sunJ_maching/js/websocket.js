/*
WebSocket 연결 및 메시지 수신 처리

엔드포인트는, 우리 오목 프로젝트의 모든 소켓 구현물들이 다 여기 들어가므로 "/min-value"로 설정
ajax에서 부르기 위해 함수로 구성
이건 웹 소켓 서버가 메세지를 보낼때만 실행되므로, 여기서 waited랑 상태를 받아서 반영해야 한다.
 */
import * as Omok from "../../game/board/board.js";
import * as Modal from "../js/match/modal-ui.js";
// 접속자, 상대방 정보 저장용 전역변수
let youCache = null;
let opponentCache = null;
import { cache } from "./match/match-init.js";
import * as Chat from "../../game/chat/chatwindow/chatscript.js";
import { showPlayer2Info } from "./match/match-init.js";

// // 접속자, 상대방 정보 저장용 전역변수
// let youCache = null;
// let opponentCache = null;

export let currentTurn = 1;  // 1=흑돌(선공), 2=백돌(후공)
export let myRole = 0;// 0=미할당, 1=흑, 2=백

export function openWebSocket(gameId) {
    const socket = new WebSocket(`ws://localhost:8080/min-value?gameId=${gameId}`);

    //확인용 로그
    socket.onopen = () => console.log("✅ WebSocket 연결됨");
    socket.onerror = (e) => console.error("❌ WebSocket 오류", e);
    socket.onclose = () => console.warn("⚠️ WebSocket 연결 종료");

    //소켓 수신 메세지 처리
    //data.status의 경우는 matching 로직만 사용한다.
    //data.type의 경우는 채팅과 돌 놓는 로직에서 사용한다.
    //채팅 메세지 처리할때 사용하는 socket.onmessage 내부 로직과, 돌 놓을때 처리하는 socket.onmessage 내부 로직은 맡은 사람이 여기에 메서드로 구현해야 한다.
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.status === "WAITING") {
            // 이건 매칭에 쓰임. 상대방이 아직 없는 상태
            handleWaitingStatus(data);
        } else if (data.status === "MATCHED") {

            // 내가 보낸 userId 기준으로 나와 youJson 비교 한 번 해줘야 한다.
            const myId = cache.youCache.id; //매칭시 저장된 내 현재 세션 아이디
            const isYou = (data.you.id === myId);

            if (isYou) { //내가 you가 맞을 경우
                cache.youCache = data.you;
                cache.opponentCache = data.opponent;

                //혹시 data를 쓰는게 있을수도 있으니 교체
                data.you = cache.youCache;
                data.opponent = cache.opponentCache;
            } else {
                // 서버가 반대로 줬을 수도 있으니까 교체
                cache.youCache = data.opponent;
                cache.opponentCache = data.you;

                //혹시 data를 쓰는게 있을수도 있으니 교체
                data.you = cache.youCache;
                data.opponent = cache.opponentCache;
            }

            myRole = (cache.youCache.id.trim() === data.player1.trim()) ? 1 : 2;
            currentTurn = 1;
            updateTurnIndicator(currentTurn === myRole);
            loadMsg(Chat.mid);
            // 이건 매칭에 쓰임. 상대방이 들어와서 matched 된 상태
            handleMatchedStatus(data);
            loadMsg(Chat.mid);
        } else if (data.type === 'chat') {
            appendBubble(Chat.mid, data.senderId, data.text);
            saveMsg(data.senderId, data.text);
        } else if (data.type === 'move') {
            drawStone(data);
        } else if (data.type === "gameover") {
            gameOver(data);

        }
    };

    // 돌을 놓는 메시지 처리 처리용 js인 drawStone(data.x, data.y, data.userId); 구현 필요
    // 마우스 클릭하여 돌 두기
    // 돌을 놓는 메시지 처리
    function drawStone(data) {
        const { x, y, userId } = data;

        if (Omok.board[x][y] !== 0) return; // 이미 돌이 있으면 무시

        // 사용자 아이디가 내 아이디면 내 역할, 아니면 상대 역할
        const stone = (userId === cache.youCache.id) ? myRole : (myRole === 1 ? 2 : 1);

        Omok.board[x][y] = stone;
        Omok.renderStone(x, y, stone);
        // 턴 교체
        currentTurn = (stone === 1) ? 2 : 1;
        updateTurnIndicator(currentTurn === myRole);

        saveBoardToSession();

        // 내 턴이면 hover 돌 유지, 아니면 숨김
        if (Omok.hoverStone) {
            Omok.hoverStone.style.display = (currentTurn === myRole) ? 'block' : 'none';
        }
    }


    // 돌 놓기 요청 시 호출
    function placeStone(row, col) {
        if (!cache.youCache || myRole === 0) {
            alert("아직 역할이 할당되지 않았습니다.");
            return;
        }

        if (currentTurn !== myRole) {
            alert("현재 당신 차례가 아닙니다.");
            return;
        }

        if (Omok.board[row][col] !== 0) {
            alert("이미 돌이 놓여있는 자리입니다.");
            return;
        }
        const stoneSound = new Audio("../../../music/stonesound.mp3");
        stoneSound.play();

        const message = {
            type: "move",
            x: row,
            y: col,
            userId: cache.youCache.id,
        };

        socket.send(JSON.stringify(message));
    }

    // 턴 UI 업데이트 함수 (예: 알림, 턴 표시)
    function updateTurnIndicator(isMyTurn) {
        const turnIndicator = document.getElementById("turn-indicator");
        if (turnIndicator) {
            turnIndicator.textContent = isMyTurn ? "당신의 턴입니다." : "상대방의 턴입니다.";
        }
    }

    // 클릭 이벤트 등록: 돌 놓기
    Omok.boardElement.addEventListener("click", (e) => {
        const rect = Omok.boardImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cell = Omok.getCellFromMousePosition(x, y);
        if (!cell) return;

        placeStone(cell.row, cell.col);

        if (Omok.checkWin(cell.row, cell.col, currentTurn)) {
            setTimeout(() => {
                console.log((currentTurn === 1 ? "흑" : "백") + " 승리!");
                // location.reload();
            }, 100);

            const message = {
                type: "gameover",
                userId: cache.youCache.id,
            };
            socket.send(JSON.stringify(message));
        }

    });

    // 마우스 이동 시 hover 돌 표시
    Omok.boardElement.addEventListener("mousemove", (e) => {
        if (!Omok.hoverStone) Omok.createHoverStone();

        if (myRole !== currentTurn) {
            if (Omok.hoverStone) Omok.hoverStone.style.display = 'none';
            return;
        }

        const rect = Omok.boardImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cell = Omok.getCellFromMousePosition(x, y);

        if (!cell || Omok.board[cell.row][cell.col] !== 0) {
            Omok.hoverStone.style.display = 'none';
            return;
        }

        Omok.hoverStone.style.display = 'block';
        // 위치 맞춤 (gridStartX, cellSizeX 등은 board/board.js에 정의되어 있어야 함)
        const left = Omok.gridStartX + cell.col * Omok.cellSizeX;
        const top = Omok.gridStartY + cell.row * Omok.cellSizeY;
        Omok.hoverStone.style.left = `${left}px`;
        Omok.hoverStone.style.top = `${top}px`;
        Omok.hoverStone.className = `stone hover ${currentTurn === 1 ? 'black' : 'white'}`;
    });

    Omok.boardElement.addEventListener("mouseleave", () => {
        if (Omok.hoverStone) Omok.hoverStone.style.display = 'none';
    });

    // 윈도우 리사이즈 시 보드 재계산 및 재렌더링
    window.addEventListener("resize", () => {
        Omok.calculateGridMetrics();
        Omok.rerenderStones();
        if (Omok.hoverStone) Omok.hoverStone.style.display = 'none';
    });

    // 페이지 로드 시 세션스토리지에서 보드 정보 복원
    window.onload = () => {
        Omok.calculateGridMetrics();

        const savedBoard = sessionStorage.getItem('board');
        const savedTurn = sessionStorage.getItem('turn');

        if (savedBoard) {
            const parsedBoard = JSON.parse(savedBoard);
            for (let r = 0; r < Omok.boardSize; r++) {
                for (let c = 0; c < Omok.boardSize; c++) {
                    Omok.board[r][c] = parsedBoard[r][c];
                    if (Omok.board[r][c] !== 0) {
                        Omok.renderStone(r, c, Omok.board[r][c]);
                    }
                }
            }
        }

        if (savedTurn) {
            currentTurn = parseInt(savedTurn);
            updateTurnIndicator(currentTurn === myRole);
        }
    };

    // 보드 상태 저장 함수
    function saveBoardToSession() {
        sessionStorage.setItem('board', JSON.stringify(Omok.board));
        sessionStorage.setItem('turn', currentTurn);
    }

    //gameover
    function gameOver(data) {
        if (Omok.hoverStone) Omok.hoverStone.style.display = 'none';

        const resultMessage = (data.winnerId === cache.youCache.id)
            ? "🎉 당신이 승리했습니다!"
            : "😢 패배하셨습니다.";

        removeChat();
        sessionStorage.removeItem('board');
        sessionStorage.removeItem('turn');
        const gameId = getGameIdFromURL();
        const resultSound = new Audio((data.winnerId === cache.youCache.id)?"../../../music/Power up.wav":"../../../music/Power down.wav");
        resultSound.play();
        // 2초 후에 결과 모달 표시
        setTimeout(() => {
            showResultModal(gameId, data.winnerId);
        }, 1000);
    }

    function showResultModal(gameId, winnerId) {
        const payload = {
            gameId: gameId,
            winnerId: winnerId
        };

        fetch('/isWin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                console.log("data : " + JSON.stringify(data));
                if (data.result === "success") {
                    // 파생 데이터 계산
                    const resultImage = data.isWinner ? "/img/win_text.png" : "/img/lose_text.png";
                    const userImgUrl = data.isWinner ? `/img/profile/${data.image}.png` : `/img/profile/${data.image}_sad.png`;
                    const total = data.win + data.lose;
                    const winRate = total > 0 ? Math.round(data.win / total * 100) : 0;
                    const loseRate = total > 0 ? 100 - winRate : 0;

                    const modalHtml = `
                <div id="modal" style="position: absolute;
                        background-color: rgba(0, 0, 0, 0.6);
                        height: 100vh;
                        width: 100vw;
                        display: none;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;">
                    <div id="board" style="width: 50vw;
                            aspect-ratio: 4 / 3; /* ← 예시: 4:3 비율 */
                            background: url('/img/modal_background.png') no-repeat center center;
                            background-size: contain;
                            min-width: 100px;">
                        <div id="text" style="background: url('${resultImage}') no-repeat center center; background-size: contain; height: 25%; margin-top: 9%; margin-bottom: 4%"></div>
                        <div id="info" style="display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 5%;
                                padding: 0 17%;
                                overflow: hidden; /* ← 튀어나오는 거 방지 */">
                            <div id="user_img" style="flex-basis: 35%; aspect-ratio: 1 / 1; background: url('${userImgUrl}') no-repeat center center; background-size: contain; min-width: 80px;"></div>
                            <div id="explanation" style="flex: 1;
                                font-size: clamp(12px, 2vw, 28px);
                                word-break: keep-all;
                                min-width: 120px;
                                align-self: flex-start;
                                padding: 4% 0;">
                                <div>아이디: ${data.userId}</div>
                                <div>${total}전 ${data.win}승 ${data.lose}패</div>
                                <div id="bar" style="display:flex; height:23px; background-color:#ddd; border-radius:10px; overflow:hidden; margin-top:10px; border:3px solid #333;">
                                    <div id="win_bar" style="width: ${winRate}%; height: 23px; background-color:#4a68c3; color:#fff; display:flex; align-items:center; justify-content:center; font-size:clamp(8px,1.5vw,13px);">${data.win}</div>
                                    <div id="lose_bar" style="width: ${loseRate}%; height: 23px; background-color:#f44336; color:#fff; display:flex; align-items:center; justify-content:center; font-size:clamp(8px,1.5vw,13px);">${data.lose}</div>
                                </div>
                                <div id="bar_label" style="display:flex; justify-content:space-between; margin-top:4%; font-size:clamp(10px,1.5vw,15px); padding: 0 5px;">
                                    <div id="win_label">승 (${winRate}%)</div>
                                    <div id="lose_label">패 (${loseRate}%)</div>
                                </div>
                            </div>
                        </div>
                        <div id="btn" style="height: 20%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-wrap: wrap;
                            padding: 0 2%;
                            gap: 4%;">
                            <button id="go_main_btn" style="height: 45%;
                                width: 25%;
                                background-color: #d9d9d9;
                                border-radius: 10px;
                                border-color: #d9d9d9;
                                font-size: clamp(8px, 1.5vw, 25px);
                                transition: background-color 0.2s ease, border-color 0.2s ease;">메인 메뉴</button>
<!--                            <button id="re_btn" style = "height: 45%;-->
<!--                                width: 25%;-->
<!--                                background-color: #d9d9d9;-->
<!--                                border-radius: 10px;-->
<!--                                border-color: #d9d9d9;-->
<!--                                font-size: clamp(8px, 1.5vw, 25px);-->
<!--                                transition: background-color 0.2s ease, border-color 0.2s ease;">다시 시작</button>-->
                        </div>
                    </div>
                </div>
            `;

                    // 모달 삽입
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = modalHtml;
                    document.body.appendChild(tempDiv.firstElementChild);

                    // 버튼 이벤트 등록
                    const modal = document.querySelector('#modal');
                    modal.querySelector('#go_main_btn').addEventListener("click", () => {
                        location.href = "main"; // 메인 이동 시 주석 해제
                    });
                    // modal.querySelector('#re_btn').addEventListener("click", () => {
                    //     modal.style.display = "none";
                    //     // 다시 시작 기능 구현
                    // });
                } else {
                    console.error("서버 응답 실패:", data);
                }
                modal.style.display = "flex";
            })
            .catch(error => {
                console.error("결과 처리 실패", error);
            });
    }


    // 게임 아이디 받기
    function getGameIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('gameId');
    }


    /* -------여기 아래 두개는 매칭용으로 개발 완료된 것임. 건들면 안된다!!!------- */
    function handleWaitingStatus(data) {
        Modal.renderPlayer("you", cache.youCache);
        // document.querySelector(".vs-text").style.display = "none";
        // document.getElementById("player2-wrapper").style.display = "none";

        // ✅ youCache에서 내 정보 가져와서 돌 배치
        Modal.setStones(cache.youCache.id, cache.youCache.id); // player1 === you

        Modal.openModal();
    }

    function handleMatchedStatus(data) {
        cache.opponentCache = data.opponent;

        const opponent = data.opponent;
        window.addEventListener('DOMContentLoaded', () => {
            document.querySelector('.game-profile-image2').style.backgroundImage = `url('${contextPath}/img/profile/${opponent.image}.png')`;
        });

        Modal.renderPlayer("you", data.you);
        Modal.renderPlayer("opponent", data.opponent);

        //로그 찍어서 확인
        console.log("내정보:", data.you);
        console.log("상대방과 매칭되었습니다:", data.opponent);

        showPlayer2Info(data.opponent, data.player1, data.you);  // UI 업데이트 함수 호출
        /*
        ✅ WebSocket 연결됨
            game.jsp?gameId=63:124 내정보: {id: 'sunJ', rate: 0, img: 6}id: "sunJ"img: 6rate: 0[[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()__proto__: (...)get __proto__: ƒ __proto__()set __proto__: ƒ __proto__()
            game.jsp?gameId=63:125 상대방과 매칭되었습니다:
            rate가 안날라와서 확인 필요.
         */

        Modal.setStones(data.you.id, data.player1);

        document.querySelector(".vs-text").style.display = "block";
        document.getElementById("player2-wrapper").style.display = "flex";
        Modal.openModal();

        setTimeout(() => {
            Modal.hideModal();
        }, 4000);
    }

    // 채팅 입력 이벤트 바인딩
    Chat.btn.addEventListener('click', () => sendMsg(socket, Chat.input));
    Chat.input.addEventListener('keydown', e => {
        if (e.key === 'Enter') sendMsg(socket, Chat.input);
    });
}

// 1) 채팅 히스토리 렌더링
function loadMsg(mid) {
    const myIds = cache.youCache.id;
    mid.innerHTML = '';
    const history = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
    history.forEach(({ senderId, text }) => {
        const div = document.createElement('div');
        div.className = senderId === (cache.youCache.id) ? 'my-message' : 'other-message';
        div.innerText = text;
        mid.appendChild(div);
    });
    mid.scrollTop = mid.scrollHeight;
}

// 2) 채팅 저장
function saveMsg(senderId, text) {
    const history = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
    history.push({ senderId, text });
    sessionStorage.setItem('chatHistory', JSON.stringify(history));
}

// 3)  서버에 채팅 전송
function sendMsg(socket, input) {
    const text = input.value.trim();
    if (!text) return;
    const payload = {
        type : 'chat',
        senderId : cache.youCache.id || '',
        message : text
    };
    socket.send(JSON.stringify(payload));
    console.log(payload);
    input.value = '';
}
// 채팅 화면에 렌더링
function appendBubble(mid, senderId, text) {
    const div = document.createElement('div');
    // senderId 가 내 ID 면 .my-message, 아니면 .other-message
    div.className = (senderId === cache.youCache.id) ? 'my-message' : 'other-message';
    div.innerText = text;
    mid.appendChild(div);
    mid.scrollTop = mid.scrollHeight;
}
// 채팅 삭제
function removeChat() {
    sessionStorage.removeItem('chatHistory');
    Chat.mid.innerHTML = "";
}



