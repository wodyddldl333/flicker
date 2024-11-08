package com.flicker.user.common.status;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor

public enum StatusCode {

    SUCCESS(HttpStatus.OK, 200, "정상적으로 요청이 완료되었습니다."),

    BAD_REQUEST(HttpStatus.BAD_REQUEST, 400, "잘못된 요청입니다."),
    NO_SUCH_ELEMENT(HttpStatus.OK,401,"정상적으로 요청이 완료되었지만, 요청 정보를 찾을 수 없습니다."),
    UNAUTHORIZED_REQUEST(HttpStatus.BAD_REQUEST, 402, "로그인되지 않은 사용자입니다."),
    FORBIDDEN_ACCESS(HttpStatus.BAD_REQUEST, 403, "권한이 없는 사용자입니다."),
    NOT_FOUND(HttpStatus.NOT_FOUND, 404, "요청 정보를 찾을 수 없습니다."),
    DUPLICATE_EMAIL(HttpStatus.BAD_REQUEST, 405, "중복된 이메일 입니다."),
    DUPLICATE_ID(HttpStatus.BAD_REQUEST, 406, "중복된 아이디 입니다."),
    INVALID_ID_OR_PASSWORD(HttpStatus.BAD_REQUEST, 407, "아이디/비밀번호가 일치하지 않습니다."),
    VALUE_CANT_NULL(HttpStatus.BAD_REQUEST, 408, "값을 반드시 입력해야 합니다."),
    INVALID_INPUT_DATA_TYPE(HttpStatus.BAD_REQUEST, 409, "잘못된 데이터 형식입니다."),
    CAN_NOT_FIND_USER(HttpStatus.BAD_REQUEST, 410, "사용자를 찾을 수 없습니다."),
    INACTIVE_USER(HttpStatus.BAD_REQUEST, 411, "탈퇴한 사용자 입니다."),
    DUPLICATED_REVIEW(HttpStatus.BAD_REQUEST, 412, "리뷰는 한번만 작성 가능합니다"),
    CAN_NOT_FIND_REVIEW(HttpStatus.BAD_REQUEST, 413, "리뷰를 찾을 수 없습니다."),


    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, 500, "서버에서 처리 중 에러가 발생했습니다."),
    SERVICE_STOP(HttpStatus.INTERNAL_SERVER_ERROR, 501, "현재 서버가 이용 불가능 상태입니다.");



    private final HttpStatus httpStatus;
    private final int serviceStatus;
    private final String message;
}