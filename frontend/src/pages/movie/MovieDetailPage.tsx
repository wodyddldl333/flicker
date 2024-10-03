import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // useParams 사용
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Navbar from "../../components/common/Navbar";
import { useQuery } from "@tanstack/react-query";
import {
  addDislikeMovies,
  addfavoriteMovies,
  deleteDislikeMovies,
  deletefavoriteMovies,
  fetchMovieDetail,
} from "../../apis/axios";
import PlotModal from "../../components/PlotModal";
import { MovieDetail } from "../../type";
import Review from "../../components/Review";
import MoviesList from "../../components/MoviesList";
import { IoBan } from "react-icons/io5";
import { useUserQuery } from "../../hooks/useUserQuery";

const MovieDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { movieSeq } = useParams<{ movieSeq: string }>(); // URL에서 movieSeq를 가져옴
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [interestOption, setInterestOption] = useState("관심 없음");
  const [isLiked, setIsLiked] = useState(false);
  const [disLiked, setDisLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("배우");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = useUserQuery();

  const userSeq = userData?.userSeq // 예시로 userSeq 고정값 사용

  // useQuery를 통해 movieDetail API 호출
  const {
    data: movieData,
    error: movieError,
    isLoading: movieIsLoading,
  } = useQuery<MovieDetail, Error>({
    queryKey: ["movieDetail", movieSeq],
    queryFn: async () => {
      if (userSeq) {
        const movieDetail = await fetchMovieDetail(Number(movieSeq), userSeq);
        return movieDetail;
      }
    },
    enabled: !!userSeq && !!movieSeq, // `userSeq`와 `movieSeq`가 존재할 때만 쿼리 실행
  });
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (movieData) {
      setIsLiked(bookMarkedMovie); // 초기 상태 설정
    }
  }, [movieData]);

  useEffect(() => {
    if (movieData) {
      setDisLiked(unlikedMovie); // 초기 상태 설정
    }
  }, [movieData]);

  if (movieIsLoading) return <div>Loading...</div>;
  if (movieError) return <div>유저 정보를 불러오는데 실패했습니다.</div>;
  if (!movieData) return null; // data가 undefined일 경우를 처리

  if (!userData) return null;
  if (userIsLoading) return <p>Loading...</p>;
  if (userError) return <p>유저 정보를 불러오는데 실패했습니다.</p>;

  const {
    movieDetailResponse: {
      movieTitle,
      director,
      genre,
      // country,
      moviePlot,
      audienceRating,
      movieYear,
      runningTime,
      moviePosterUrl,
      trailerUrl,
      backgroundUrl,
      movieRating,
      actors,
    } = {}, // movieDetailResponse가 없을 경우를 대비해 기본값으로 빈 객체 설정
    bookMarkedMovie = false,
    unlikedMovie = false,
    reviews = [],
    similarMovies = [],
  } = movieData;

  // console.log(data);

  const MAX_LENGTH = 250;
  const isLongText = moviePlot && moviePlot.length > MAX_LENGTH;
  const displayedText = moviePlot ? moviePlot.slice(0, MAX_LENGTH) : ""; // movieDetailResponse가 없으면 빈 문자열 반환
  const extractVideoId = (url: string) => {
    const videoIdMatch = url.match(
      /(?:\?v=|\/embed\/|\.be\/|\/v\/|\/e\/|watch\?v=|watch\?.+&v=)([^&\n?#]+)/
    );
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const videoId = trailerUrl ? extractVideoId(trailerUrl) : null;

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

const toggleHeart = async () => {
  if (!userSeq) {
    console.error("User sequence is not available."); // userSeq가 없을 때 에러 처리
    return;
  }

  setIsLiked((prev) => !prev);

  try {
    if (isLiked) {
      await deletefavoriteMovies(userSeq, Number(movieSeq));
      console.log("찜목록에서 삭제");
    } else {
      await addfavoriteMovies(userSeq, Number(movieSeq));
      console.log("찜목록에 추가");
    }
  } catch (error) {
    console.error("즐겨찾기 API 호출 중 오류 발생:", error);
  }
};

  const toggleDislike = async () => {
      if (!userSeq) {
        console.error("User sequence is not available."); // userSeq가 없을 때 에러 처리
        return;
      }
    setDisLiked((prev) => !prev);

    try {
      if (disLiked) {
        await deleteDislikeMovies(userSeq, Number(movieSeq));
        console.log("관심없음 목록에서 삭제");
      } else {
        await addDislikeMovies(userSeq, Number(movieSeq));
        console.log("관심없음 목록에 추가");
      }
    } catch (error) {
      console.error("즐겨찾기 API 호출 중 오류 발생:", error);
    }
  };

  const goToReview = () => {
    navigate(`/review/${movieSeq}`);
  };

  // const toggleDropdown = () => {
  //   setIsDropdownOpen((prev) => !prev);
  // };

  // const handleOptionClick = () => {
  //   setInterestOption((prev) =>
  //     prev === "관심 없음" ? "관심 없음 취소" : "관심 없음"
  //   );
  //   setIsDropdownOpen(false);
  // };

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case "배우":
        return (
          <div className="flex flex-wrap gap-2 mt-6">
            {(actors || []).map((actor, index) => (
              <span
                key={index}
                className="relative px-3 py-1 text-[15px] rounded-[5px] text-white bg-black bg-opacity-70 z-10"
              >
                {actor.actorName}
              </span>
            ))}
          </div>
        );
      case "감독":
        return (
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="relative px-3 py-1 text-[15px] rounded-[5px] text-white bg-black bg-opacity-70 z-10">
              {director}
            </span>
          </div>
        );
      case "장르":
        return (
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="relative px-3 py-1 text-[15px] rounded-[5px] text-white bg-black bg-opacity-70 z-10">
              {genre}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-black h-screen overflow-y-auto">
      {/* 영화 세부 정보 */}
      <div className="relative h-auto">
        <div
          className="absolute inset-0 h-[650px] w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>

        {/* Header with Navbar */}
        <header className="sticky top-0 bg-transparent z-20">
          <Navbar />
        </header>

        {/* Top section */}
        <div className="relative flex items-end text-white p-3 w-[1100px] h-[480px] bg-transparent ml-[50px] mt-[120px] overflow-hidden">
          {/* Left Section: Movie Poster and Details */}
          <div className="flex flex-col lg:flex-row">
            <img
              src={moviePosterUrl}
              alt="Movie Poster"
              className="w-[270px] h-[410px] shadow-md border"
            />
            <div className="mt-4 ml-[60px] flex-1">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-4xl font-bold flex-1 flex items-center overflow-hidden">
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {movieTitle}
                  </span>
                  <span className="flex items-end ml-4 flex-shrink-0">
                    <span className="text-blue-500 text-2xl">⭐</span>
                    <span className="text-2xl">{movieRating}</span>
                  </span>
                </h2>

                {/* Heart icon */}
                <div
                  className="flex items-end ml-auto relative flex-shrink-0"
                  ref={dropdownRef}
                >
                  <svg
                    className="w-6 h-6 cursor-pointer"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={toggleHeart}
                    fill={isLiked ? "red" : "none"}
                    stroke={isLiked ? "none" : "red"}
                    strokeWidth="2"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>

                  <IoBan
                    className="w-6 h-6 ml-3 opacity-60 hover:opacity-100"
                    onClick={toggleDislike}
                  />
                </div>
              </div>

              {/* Movie details */}
              <div className="flex mt-4 text-white text-[16px]">
                <span>{movieYear}</span>
                <span className="px-4 text-gray-200">|</span>
                <span>{runningTime}</span>
                <span className="px-4 text-gray-200">|</span>
                <span>{audienceRating}</span>
              </div>
              <p className="mt-4 text-lg">
                {displayedText}
                {isLongText && (
                  <button className="text-gray-400 ml-2" onClick={openModal}>
                    더보기
                  </button>
                )}
              </p>
              <PlotModal
                isopen={isModalOpen}
                onClose={closeModal}
                movieDetail={movieData}
              />
              <div>
                <div className="flex w-full h-[40px] bg-transparent border-b border-opacity-50 border-white text-white justify-start items-center space-x-4 mt-4 cursor-pointer">
                  {["배우", "감독", "장르"].map((category) => (
                    <div
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`font-bold text-[18px] mt-[10px] cursor-pointer ${
                        selectedCategory === category
                          ? "border-b-2 border-white"
                          : ""
                      }`}
                    >
                      {category}
                    </div>
                  ))}
                </div>
                {renderCategoryContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="flex">
        <div className="p-1 bg-black text-black w-[800px] h-[400px] mt-[100px] ml-[150px] border-white">
          <div className="flex w-full justify-between items-center">
            <h3 className="text-[38px] font-bold text-white">Reviews</h3>
            <button
              className="text-white flex ml-auto items-center cursor-pointer text-[16px] italic h-[30px] w-[60px] bg-[#455467] rounded-md justify-center hover:bg-gray-500"
              onClick={goToReview}
            >
              more
            </button>
          </div>
          <div className="mt-4 space-y-4 text-white text-[14px]">
            {reviews.map((review) => (
              <Review
                key={review.reviewSeq}
                review={{ ...review, top: false }} // review 객체로 모든 데이터를 전달
                // onLikeToggle={handleLikeToggle}
              />
            ))}
          </div>
        </div>

        {/* Trailer */}
        <div className="w-[700px] bg-black text-white flex justify-center items-center m-4 p-4 h-[450px] ml-[50px] mt-[100px]">
          <div className="relative w-full max-w-4xl h-full">
            <iframe
              src={`${trailerUrl}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
              title="YouTube video player"
              className="w-full h-full rounded-lg shadow-md"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button className="absolute inset-0 flex items-center justify-center text-white pointer-events-none">
              <svg className="w-12 h-12" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended movies */}
      <div className="h-[300px] w-[1700px] flex-shrink-0 mb-[100px] mt-[20px]">
        <MoviesList
          category={`${movieTitle}과 유사한 장르 작품들`}
          movies={similarMovies}
        />
      </div>
    </div>
  );
};

export default MovieDetailPage;
