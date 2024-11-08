package com.flicker.movie.movie.domain.entity;

import com.flicker.movie.common.module.exception.RestApiException;
import com.flicker.movie.common.module.status.StatusCode;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.transaction.annotation.Transactional;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 기본 생성자를 protected로 제한하여 외부에서 직접 호출하지 못하게 함
@AllArgsConstructor // 모든 필드를 매개변수로 갖는 생성자 자동 생성
@Builder // Builder 패턴을 통해 객체를 생성할 수 있도록 설정
@Getter // 모든 필드에 대해 getter 메서드 자동 생성
public class Actor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int actorSeq; // 배우의 고유 식별자 (자동 생성됨)

    @Column(nullable = false)
    private String actorName; // 배우 이름

    @Column
    private String role; // 영화에서 배우가 맡은 역할

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_seq", nullable = false) // 외래키 설정, 영화와의 관계를 나타냄
    private Movie movie; // 다대일 관계로 연결된 Movie 엔티티, 배우는 한 영화에만 속할 수 있음

    // 양방향 관계 설정을 위한 메서드
    protected void setMovie(Movie movie) {
        try {
            this.movie = movie; // 영화와 배우 간의 양방향 관계 설정
        } catch (Exception e) {
            throw new RestApiException(StatusCode.INTERNAL_SERVER_ERROR, "영화와 배우 간의 관계 설정 중 오류가 발생했습니다.");
        }
    }

    // 배우 정보 변경 메서드 (비즈니스 로직)
    @Transactional
    public void updateActor(String newActorName, String newRole) {
        try {
            // 유효성 검증
            validate(newActorName, newRole);
            // 배우 역할 및 이름 업데이트
            this.role = newRole;
            this.actorName = newActorName;
        } catch (Exception e) {
            throw new RestApiException(StatusCode.INTERNAL_SERVER_ERROR, "배우 정보 업데이트 중 오류가 발생했습니다.");
        }
    }

    // 빌더 내부에서 유효성 검증
    public static class ActorBuilder {
        public Actor build() {
            validate(actorName, role);  // 빌드 시 유효성 검증 수행
            return new Actor(actorSeq, actorName, role, movie);
        }
    }

    // 유효성 검증 메서드
    private static void validate(String actorName, String role) {
        if (actorName == null || actorName.length() > 255) {
            throw new RestApiException(StatusCode.BAD_REQUEST, "배우 이름을 확인해주세요 (길이초과 또는 null)");
        } else if (role != null && role.length() > 255) {
            throw new RestApiException(StatusCode.BAD_REQUEST, "배우 역할을 확인해주세요 (길이초과)");
        }
    }
}
