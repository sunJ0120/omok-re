package org.sinhan.omokproject.service;

import lombok.extern.log4j.Log4j2;
import org.sinhan.omokproject.domain.UserVO;
import org.sinhan.omokproject.repository.LoginDAO;

@Log4j2
public enum LoginService {
    INSTANCE;
    // 사용하는건 미리 빼두기
    private LoginDAO dao;

    LoginService(){
        dao = LoginDAO.INSTANCE;
    }

    //로그인 결과로 vo를 return 하도록 한다.
    public UserVO login(String userId, String userPw){
        return dao.getUserByIdAndPassword(userId, userPw);
    }

    //아이디 중복 체크를 위함
    public boolean isExistId(String userId){
        return dao.isExistUserById(userId);
    }

    //회원가입을 위함
    public int signUp(UserVO vo){
        try {
            return dao.insertUser(vo);
        } catch (Exception e) {
            //여기서 받아서 exception 처리하기
            throw new RuntimeException("회원가입 처리 중 오류 발생", e);  // 또는 custom 예외로 감싸기
        }
    }
}
