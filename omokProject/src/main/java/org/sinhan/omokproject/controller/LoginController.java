package org.sinhan.omokproject.controller;

import lombok.extern.log4j.Log4j2;
import org.sinhan.omokproject.domain.UserVO;
import org.sinhan.omokproject.service.LoginService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Log4j2
@WebServlet(displayName = "loginController", urlPatterns = "/login")
public class LoginController extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //바로 jsp로 전송
        req.getRequestDispatcher("/WEB-INF/view/login/login.jsp").forward(req,resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String userId = req.getParameter("userId");
        String userPw = req.getParameter("userPw");

        LoginService service = LoginService.INSTANCE; //싱글톤으로 서비스 객체를 가져온다.
        UserVO user = service.login(userId, userPw);

        //로그인 실패시 대응 만들기
        //세션에 메세지를 잠시 담아둔다.
        //여기서 sendRedirect 해도 js에서 파라미터 지워 주기 때문에 error=1 남는거 해결 된다.
        if (user == null) {
            HttpSession session = req.getSession();
            session.setAttribute("error", "아이디 또는 비밀번호가 잘못되었습니다.");
            resp.sendRedirect( "/login?error=1"); //error 파라미터를 넘긴다.
            return;
        }

        log.info("Session에 추가할 user 객체 : {}", user.toString());

        //세션에 저장
        HttpSession session = req.getSession();
        session.setAttribute("loginInfo", user); //세션에 저장

        //세션에서 불러와보자.
        log.info("session에서 가져온 객체 : {}", session.getAttribute("loginInfo").toString());
        //로그 확인 완료 : 14:52:54.440 [http-nio-8090-exec-8] INFO  org.sinhan.omokproject.filter.LoginCheckFilter - session loginInfo 객체 확인 : UserVO(userId=sunJ, userPW=pass6789, bio=오선정 입니다~, image=6, win=2, lose=2, rate=50)
        resp.sendRedirect("/omok/main");
    }
}
