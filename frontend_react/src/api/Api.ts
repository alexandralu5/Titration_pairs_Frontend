/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterDto {
  /**
   * Логин, уникальный
   * @maxLength 50
   * @example "ivanov"
   */
  username: string;
  /**
   * Пароль
   * @minLength 6
   * @maxLength 72
   * @example "secret123"
   */
  password: string;
}

export interface UserDto {
  /** @example 1 */
  id: number;
  /** @example "admin" */
  username: string;
  /** @example "user" */
  role: "user" | "moderator";
  /** @format date-time */
  created_at: string | null;
}

export interface LoginDto {
  /**
   * Логин
   * @example "admin"
   */
  username: string;
  /**
   * Пароль
   * @example "admin123"
   */
  password: string;
}

export interface IdDto {
  /** @example 1 */
  id: number;
}

export interface ListServiceDto {
  /** @example 1 */
  id: number;
  /** @example "HCl + NaOH" */
  title: string;
  /** @example "Точка эквивалентности при pH 7.0" */
  description: string | null;
  /** @example 7 */
  ph: number | null;
  /** @example 0.1 */
  concentration: number | null;
  /**
   * Публичный URL картинки или пустая строка
   * @example "http://localhost:9000/titration/img_1.jpg"
   */
  image_url: string;
  /**
   * Публичный URL видео или пустая строка
   * @example "http://localhost:9000/titration/video_1.mp4"
   */
  video_url: string;
  /** @example 3 */
  likes_count: number;
  /** @format date-time */
  created_at: string | null;
  /**
   * Дата публикации; null у черновика
   * @format date-time
   */
  formed_at: string | null;
  /**
   * 1 — текущий пользователь создал услугу; для гостя всегда 0
   * @example 0
   */
  is_mine: 0 | 1;
}

export interface FeedServiceDto {
  /** @example 1 */
  id: number;
  /** @example "HCl + NaOH" */
  title: string;
  /** @example "Точка эквивалентности при pH 7.0" */
  description: string | null;
  /** @example 7 */
  ph: number | null;
  /** @example 0.1 */
  concentration: number | null;
  /**
   * Публичный URL картинки или пустая строка
   * @example "http://localhost:9000/titration/img_1.jpg"
   */
  image_url: string;
  /**
   * Публичный URL видео или пустая строка
   * @example "http://localhost:9000/titration/video_1.mp4"
   */
  video_url: string;
  /** @example 3 */
  likes_count: number;
  /** @format date-time */
  created_at: string | null;
  /**
   * Дата публикации; null у черновика
   * @format date-time
   */
  formed_at: string | null;
  /**
   * 1 — текущий пользователь поставил лайк; для гостя всегда 0
   * @example 1
   */
  is_liked: 0 | 1;
}

export interface ServiceDto {
  /** @example 1 */
  id: number;
  /** @example "HCl + NaOH" */
  title: string;
  /** @example "Точка эквивалентности при pH 7.0" */
  description: string | null;
  /** @example 7 */
  ph: number | null;
  /** @example 0.1 */
  concentration: number | null;
  /**
   * Публичный URL картинки или пустая строка
   * @example "http://localhost:9000/titration/img_1.jpg"
   */
  image_url: string;
  /**
   * Публичный URL видео или пустая строка
   * @example "http://localhost:9000/titration/video_1.mp4"
   */
  video_url: string;
  /** @example 3 */
  likes_count: number;
  /** @format date-time */
  created_at: string | null;
  /**
   * Дата публикации; null у черновика
   * @format date-time
   */
  formed_at: string | null;
}

export interface UpdateServiceDto {
  /** @example "Точка эквивалентности при pH 7.0" */
  description?: string;
  /**
   * @min 0
   * @max 14
   * @example 7
   */
  ph?: number;
  /**
   * @min 0
   * @example 0.1
   */
  concentration?: number;
}

export interface LikeDto {
  /**
   * 1 — поставить лайк, 0 — снять
   * @example 1
   */
  value: 0 | 1;
}

export interface LikeResultDto {
  /** @example true */
  liked: boolean;
  /** @example 4 */
  likes_count: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export type ContentType =
  | "application/json"
  | "application/vnd.api+json"
  | "multipart/form-data"
  | "application/x-www-form-urlencoded"
  | "text/plain";

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === "multipart/form-data" &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === "text/plain" &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Titration Pairs API
 * @version 1.0
 * @contact
 *
 * Веб-сервис пар титрования. Без авторизации доступно только чтение (список и лента). Методы создателя требуют сессию: выполните POST /api/titration_pairs/users/login — сервер поставит куку sessionId.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Создаёт пользователя с ролью user. Пароль хранится в виде хеша.
     *
     * @tags Пользователи
     * @name UsersControllerRegister
     * @summary Регистрация
     * @request POST:/api/titration_pairs/users
     */
    usersControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
      this.request<UserDto, void>({
        path: `/api/titration_pairs/users`,
        method: "POST",
        body: data,
        type: "application/json",
        format: "json",
        ...params,
      }),

    /**
     * @description Проверяет логин и пароль, создаёт сессию в Redis и ставит HttpOnly-куку sessionId. После 5 неудачных попыток вход под этим логином блокируется на 15 минут.
     *
     * @tags Пользователи
     * @name UsersControllerLogin
     * @summary Аутентификация
     * @request POST:/api/titration_pairs/users/login
     */
    usersControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<UserDto, void>({
        path: `/api/titration_pairs/users/login`,
        method: "POST",
        body: data,
        type: "application/json",
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет сессию из Redis и очищает куку sessionId.
     *
     * @tags Пользователи
     * @name UsersControllerLogout
     * @summary Деавторизация
     * @request POST:/api/titration_pairs/users/logout
     * @secure
     */
    usersControllerLogout: (params: RequestParams = {}) =>
      this.request<IdDto, void>({
        path: `/api/titration_pairs/users/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Доступно без авторизации. Признак is_mine считается по сессии, для гостя он равен 0.
     *
     * @tags Услуги
     * @name ServicesControllerList
     * @summary Список опубликованных услуг
     * @request GET:/api/titration_pairs
     */
    servicesControllerList: (
      query?: {
        /**
         * Минимальная концентрация, М
         * @min 0
         * @example 0.1
         */
        minConcentration?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListServiceDto[], void>({
        path: `/api/titration_pairs`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создатель заполняется автоматически пользователем из сессии. Файлы сохраняются в MinIO.
     *
     * @tags Услуги
     * @name ServicesControllerCreate
     * @summary Создать услугу (черновик)
     * @request POST:/api/titration_pairs
     * @secure
     */
    servicesControllerCreate: (
      data: {
        /** @example "HCl + NaOH" */
        title: string;
        /**
         * jpg, jpeg, png, gif, webp; до 10 МБ
         * @format binary
         */
        image?: File;
        /**
         * mp4, webm, mov; до 10 МБ
         * @format binary
         */
        video?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServiceDto, void>({
        path: `/api/titration_pairs`,
        method: "POST",
        body: data,
        secure: true,
        type: "multipart/form-data",
        format: "json",
        ...params,
      }),

    /**
     * @description Доступно без авторизации. Признак is_liked считается по сессии, для гостя он равен 0.
     *
     * @tags Услуги
     * @name ServicesControllerFeed
     * @summary Лента: первая опубликованная услуга
     * @request GET:/api/titration_pairs/feed
     */
    servicesControllerFeed: (params: RequestParams = {}) =>
      this.request<FeedServiceDto, void>({
        path: `/api/titration_pairs/feed`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Доступно без авторизации. С ?next=true возвращает следующую за ней опубликованную запись.
     *
     * @tags Услуги
     * @name ServicesControllerFeedItem
     * @summary Запись ленты по id
     * @request GET:/api/titration_pairs/feed/{id}
     */
    servicesControllerFeedItem: (
      id: number,
      query?: {
        /** true — вернуть следующую запись ленты */
        next?: "true" | "false";
      },
      params: RequestParams = {},
    ) =>
      this.request<FeedServiceDto, void>({
        path: `/api/titration_pairs/feed/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Пользователь берётся из сессии, id не указывается.
     *
     * @tags Услуги
     * @name ServicesControllerDraft
     * @summary Черновик текущего пользователя
     * @request GET:/api/titration_pairs/draft
     * @secure
     */
    servicesControllerDraft: (params: RequestParams = {}) =>
      this.request<ServiceDto, void>({
        path: `/api/titration_pairs/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Только создатель услуги или модератор. Старый файл удаляется из MinIO.
     *
     * @tags Услуги
     * @name ServicesControllerUploadImage
     * @summary Заменить изображение услуги
     * @request PUT:/api/titration_pairs/{id}/image
     * @secure
     */
    servicesControllerUploadImage: (
      id: number,
      data: {
        /**
         * jpg, jpeg, png, gif, webp; до 10 МБ
         * @format binary
         */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<ServiceDto, void>({
        path: `/api/titration_pairs/${id}/image`,
        method: "PUT",
        body: data,
        secure: true,
        type: "multipart/form-data",
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет поля черновика и переводит его в published. Только создатель услуги или модератор.
     *
     * @tags Услуги
     * @name ServicesControllerUpdate
     * @summary Опубликовать услугу
     * @request PUT:/api/titration_pairs/{id}
     * @secure
     */
    servicesControllerUpdate: (
      id: number,
      data: UpdateServiceDto,
      params: RequestParams = {},
    ) =>
      this.request<ServiceDto, void>({
        path: `/api/titration_pairs/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: "application/json",
        format: "json",
        ...params,
      }),

    /**
     * @description Логическое удаление (status = deleted). Только создатель услуги или модератор.
     *
     * @tags Услуги
     * @name ServicesControllerRemove
     * @summary Удалить услугу
     * @request DELETE:/api/titration_pairs/{id}
     * @secure
     */
    servicesControllerRemove: (id: number, params: RequestParams = {}) =>
      this.request<IdDto, void>({
        path: `/api/titration_pairs/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Лайк ставится от имени пользователя сессии: value 1 — поставить, 0 — снять.
     *
     * @tags Услуги
     * @name ServicesControllerLike
     * @summary Поставить или снять лайк
     * @request POST:/api/titration_pairs/{id}/like
     * @secure
     */
    servicesControllerLike: (
      id: number,
      data: LikeDto,
      params: RequestParams = {},
    ) =>
      this.request<LikeResultDto, void>({
        path: `/api/titration_pairs/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: "application/json",
        format: "json",
        ...params,
      }),
  };
}
