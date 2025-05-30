import instance from "src/apis/instance";
import {
  WalkwayParams,
  CreateWalkwayType,
  UpdateWalkwayType,
  MyWalkwaysResponse,
  FetchWalkwaysOptions,
  WalkwayHistoryResponse,
  WalkwaysResponse,
  WalkwayDetail,
  WalkwayListResponse,
  AllWalkwayParams,
  likedWalkwayType,
} from "./walkway.type";
import { ApiErrorResponse } from "src/apis/api.type";
import { AxiosError } from "axios";

/**
 * 산책로 검색 API 호출
 */
export const searchWalkways = async (params: WalkwayParams) => {
  try {
    const { data: response } = await instance.get<WalkwaysResponse>(
      "/walkways",
      {
        params: {
          sort: params.sort,
          latitude: params.latitude,
          longitude: params.longitude,
          distance: params.distance,
          lastId: params.lastId,
          size: params.size || 10,
        },
      }
    );

    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "산책로 검색에 실패했습니다."
    );
  }
};

/**
 * 모든 산책로 조회 API 호출 (위치 기반 X)
 */
export const getAllWalkways = async (params: AllWalkwayParams) => {
  try {
    const { data: response } = await instance.get<WalkwaysResponse>(
      "/walkways/all",
      {
        params: {
          sort: params.sort,
          lastId: params.lastId,
          size: params.size || 10,
        },
      }
    );

    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "모든 산책로 조회에 실패했습니다."
    );
  }
};


/**
 * 산책로 단건 조회 API 호출
 */
export const getWalkwayDetail = async (walkwayId: number) => {
  try {
    const { data: response } = await instance.get<WalkwayDetail>(
      `/walkways/${walkwayId}`
    );

    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "산책로 상세 조회에 실패했습니다."
    );
  }
};

/**
 * 산책로 코스 이미지 등록 API 호출
 */
export const uploadCourseImage = async (courseImage: File) => {
  try {
    const formData = new FormData();
    formData.append("courseImage", courseImage);

    const { data: response } = await instance.post
      <{ courseImageId: number }>
    ("/walkways/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.courseImageId;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "이미지 등록에 실패했습니다."
    );
  }
};

/**
 * 산책로 등록 API 호출
 */
export const createWalkway = async (walkwayData: CreateWalkwayType) => {
  try {
    const { data: response } = await instance.post<{ walkwayId: number }>
    ("/walkways", walkwayData);
    return response.walkwayId;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "산책로 등록에 실패했습니다."
    );
  }
};

/**
 * 산책로 수정 API 호출
 */
export const updateWalkway = async (
  walkwayId: number,
  walkwayData: UpdateWalkwayType
) => {
  try {
    const response = await instance.put<number>(
      `/walkways/${walkwayId}`,
      walkwayData
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "등록한 산책로 수정에 실패했습니다."
    );
  }
};

/**
 * 등록한 산책로 조회 API 호출
 */
export const getMyWalkways = async ({
  size = 10,
  lastId,
  preview = false,
}: FetchWalkwaysOptions = {}): Promise<WalkwayListResponse> => {
  try {
    const { data: response } = await instance.get<MyWalkwaysResponse>(
      "/users/walkways/upload",
      {
        params: {
          size: preview ? 3 : size, // preview면 3개만(마이페이지 프리뷰로 보여줄 것), 아니면 요청된 size
          lastId,
        },
      }
    );

    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "등록한 산책로 조회에 실패했습니다."
    );
  }
};

/**
 * 산책로 좋아요 API 호출
 */
export const toggleLike = async ({
  walkwayId,
  isLiked,
}: likedWalkwayType
): Promise<{}> => {
  try {
    const response = isLiked //하트에 따라 처리
      ? await instance.delete( //산책로 좋아요 취소 api
          `/walkways/${walkwayId}/likes`
        )
      : await instance.post( //산책로 좋아요 선택 api
          `/walkways/${walkwayId}/likes`
        );
    return response;
  } catch (error) {
    console.error("Failed to toggle like:", error);
    throw error;
  }
};


/**
 * 좋아요한 산책로 조회 API 호출
 */
export const getLikedWalkways = async ({
  size = 10,
  lastId,
}: {
  size?: number;
  lastId?: number;
}): Promise<WalkwayListResponse> => {
  try {
    const { data: response } = await instance.get<MyWalkwaysResponse>(
      "/users/walkways/like",
      {
        params: {
          size,
          lastId,
        },
      }
    );
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "좋아요한 산책로 조회에 실패했습니다."
    );
  }
};

/**
* 산책로 이용기록 전송 API 호출
* @param walkwayId - 산책로 ID 
* @param historyData - 산책 이용 데이터 
* @returns {WalkwayHistoryResponse} 
* - walkwayHistoryId: 리뷰작성 가능 여부와 상관없이 history Id는 항상 반환됨
* - canReview: 리뷰작성 가능 여부
*/
export const createWalkwayHistory = async (
  walkwayId: number,
  historyData: { time: number; distance: number }
) => {
  try {
    const { data: response } = await instance.post
      <WalkwayHistoryResponse>
    (`/walkways/${walkwayId}/history`, historyData);

    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "산책로 이용 기록 등록에 실패했습니다."
    );
  }
};

/**
 * 산책로 삭제하기
 */
export const deleteWalkway = async (walkwayId: number) => {
  try {
    const {data: response} = await instance.delete(`/walkways/${walkwayId}`);
    return response;
  } catch(error) {
    throw new Error(
      "산책로 삭제에 실패했습니다."
    );
  }
}