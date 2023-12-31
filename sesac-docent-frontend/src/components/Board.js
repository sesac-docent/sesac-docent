import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Search } from "lucide-react";

import api from "apis/api";
import { cn } from "utils/tailwind-merge";
import { useAppSelector } from "store/store";
import { numberToDate } from "utils/format-date";
import { searchPosts } from "apis/requests";

const pageGroupSize = 10;
const pageSize = 10;

export const Board = ({ categoryKOR, categoryENG, categoryNUM, admin }) => {
  const navigate = useNavigate();
  const params = useParams();
  const pageNumberParams = params.pageNumber;

  const state = useAppSelector((state) => state.authReducer);

  // http://localhost:3000/notice 접속 시
  // http://localhost:3000/notice/page/1 리다이렉트
  useEffect(() => {
    if (!pageNumberParams || pageNumberParams < 0) {
      admin
        ? navigate(`/admin/${categoryENG}/page/1`)
        : navigate(`/${categoryENG}/page/1`);
    }
  }, [navigate, pageNumberParams, categoryENG, admin]);

  const [posts, setPosts] = useState([]);
  const [lastPage, setLastPage] = useState(120);
  const [pageStart, setPageStart] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setCurrentPage(pageNumberParams);

    // page group 첫 페이지
    const currentPageStart =
      pageNumberParams % pageGroupSize === 0
        ? pageNumberParams - pageGroupSize + 1
        : pageNumberParams - (pageNumberParams % pageGroupSize) + 1;

    // page group 마지막 페이지
    const currentPageEnd = Math.min(
      currentPageStart + pageGroupSize - 1,
      lastPage
    );

    // page group
    const currentPageGroup = Array.from(
      { length: currentPageEnd - currentPageStart + 1 },
      (_, index) => currentPageStart + index
    );

    setPageStart(currentPageStart);
    setPageGroup(currentPageGroup);
  }, [pageNumberParams, lastPage]);

  // 해당 페이지에 맞는 게시물 받아오기
  useEffect(() => {
    if (!pageNumberParams) {
      return;
    }

    if (searchParams.get("search")) {
      const func = async () => {
        const data = await searchPosts(
          parseInt(categoryNUM),
          pageSize,
          pageNumberParams,
          searchCriteria
        );
        const updatedData = data.map((post) => {
          return {
            ...post,
            v_post_updated_at: numberToDate(post.v_post_updated_at),
          };
        });
        console.log("here");
        setLastPage(updatedData[0].v_last_page);
        setPosts(updatedData);
      };

      func();
      return;
    }

    setCurrentPage(pageNumberParams);

    // 즉시 실행 함수
    (async () => {
      // REST API
      const response = await api.get(
        `/posts/list/${categoryNUM}/${pageSize}/${pageNumberParams}`
      );

      // 날짜 포맷 변환
      const updatedPosts = response.data.map((post) => {
        return {
          ...post,
          v_post_updated_at: numberToDate(post.v_post_updated_at),
        };
      });
      console.log(updatedPosts);

      // 현재 페이지 posts 설정
      setLastPage(updatedPosts[0].v_last_page);
      setPosts(updatedPosts);
    })();

    // 페이지가 바뀔 때마다 수행
  }, [pageNumberParams, categoryNUM, searchParams]);

  // 다음 페이지
  const handleNextPageGroup = () => {
    const newPage = pageStart + pageGroupSize;
    navigate(`/${categoryENG}/page/${newPage}`);
  };

  // 이전 페이지
  const handlePrevPageGroup = () => {
    const newPage = pageStart - pageGroupSize;
    navigate(`/${categoryENG}/page/${newPage}`);
  };

  const rowClickHandler = (postId) => {
    navigate(`/${categoryENG}/post/${postId}`, {
      state: { categoryENG, categoryKOR },
    });
  };

  const writeClickHandler = () => {
    navigate(`/${categoryENG}/write`);
  };

  const searchValueHandler = (event) => {
    setSearchCriteria(event.target.value);
  };

  const searchHandler = async (event) => {
    event.preventDefault();
    navigate(
      admin
        ? `/admin/${categoryENG}/page/${pageNumberParams}?search=${searchCriteria}`
        : `/${categoryENG}/page/${pageNumberParams}?search=${searchCriteria}`
    );
  };

  const showWrite =
    (categoryENG !== "notice" && state.role) ||
    (categoryENG === "notice" && state.role === "ROLE_ADMIN");

  return (
    <div className="w-full h-full flex justify-center items-start p-5 my-20">
      <div className="w-full max-w-[1300px] h-full px-10 py-5 rounded-xl bg-white flex flex-col justify-start items-center gap-6">
        <div className="w-full flex justify-between items-end">
          <p className="w-1/5 text-start"></p>
          <p className="w-3/5 text-center text-4xl font-semibold">
            {categoryKOR}
          </p>
          <div className="w-1/5 flex justify-end">
            {showWrite && (
              <button
                className="w-fit h-fit px-4 py-2 border border-black text-lg font-bold hover:bg-black hover:text-white transition"
                onClick={writeClickHandler}
              >
                글쓰기
              </button>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col relative">
          <table className="w-full relative z-20">
            <colgroup>
              <col width="10%" />
              <col width="15%" />
              <col width="50%" />
              <col width="25%" />
            </colgroup>
            <thead>
              <tr className="border-b border-t border-zinc-400 bg-zinc-100">
                <th scope="col" className="py-2 px-4 text-start">
                  번호
                </th>
                <th scope="col" className="py-2 px-4 text-start">
                  이름
                </th>
                <th scope="col" className="py-2 px-4 text-start">
                  제목
                </th>
                <th scope="col" className="py-2 px-4 text-start">
                  날짜
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.v_post_id}
                  className="py-2 px-4 border-b border-zinc-400 cursor-pointer hover:bg-zinc-100 transition"
                  onClick={() => rowClickHandler(post.v_post_id)}
                >
                  <td className="py-2 px-4">{post.v_post_rank}</td>
                  <td className="py-2 px-4 font-medium text-teal-500">
                    {post.v_user_name}
                  </td>
                  <td className="py-2 px-4">{post.v_post_title}</td>
                  <td className="py-2 px-4">{post.v_post_updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex justify-between items-center gap-4 mt-2 pr-4">
          <div className="h-12 flex justify-center items-center gap-4 p-4">
            <select id="searchType" className="h-10 border border-black p-2">
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="name">글쓴이</option>
            </select>
            <div className="flex gap-2">
              <form onSubmit={searchHandler}>
                <input
                  type="text"
                  className="h-10 border-b border-black p-1 px-4"
                  onChange={searchValueHandler}
                />
                <button type="submit">
                  <Search />
                </button>
              </form>
            </div>
          </div>
          <div className="flex gap-5 text-xl w-fit">
            {pageStart > 10 && (
              <button onClick={handlePrevPageGroup} className="hover:underline">
                이전
              </button>
            )}
            {pageGroup.map((_, index) => {
              const pageNumber = pageStart + index;
              const isCurrentPage = pageNumber === parseInt(currentPage);

              return (
                <Link
                  key={pageNumber}
                  to={`/${categoryENG}/page/${pageNumber}${
                    searchParams.get("search")
                      ? `?search=${searchParams.get("search")}`
                      : ""
                  }`}
                  className={cn(
                    "text-xl hover:underline",
                    isCurrentPage && "font-semibold text-teal-600 underline"
                  )}
                >
                  {pageNumber}
                </Link>
              );
            })}
            {pageStart + pageGroupSize < lastPage && (
              <button onClick={handleNextPageGroup} className="hover:underline">
                다음
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
