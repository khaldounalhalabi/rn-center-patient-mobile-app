import { RoleEnum } from "@/enums/RoleEnum";
import { deleteRole, deleteTokens } from "@/helpers/helpers";
import { DELETE, GET, POST, PUT } from "@/http/Http";
import { ApiResponse } from "@/http/Response";
import { Router, useRouter } from "expo-router";

export function BaseService<SERVICE, MODEL>() {
  return class BaseService {
    protected static instance?: SERVICE;
    public baseUrl = "/";
    public role: string = "customer";
    protected headers: Record<string, any> = {};
    public router: Router;

    protected constructor() {
      this.router = useRouter();
    }

    public static make(role: RoleEnum = RoleEnum.ADMIN): SERVICE {
      if (!this.instance) {
        // @ts-ignore
        this.instance = new this();
      }
      // @ts-ignore
      this.instance.role = role;

      // @ts-ignore
      this.instance.baseUrl = this.instance.getBaseUrl();

      // @ts-ignore
      return this.instance as SERVICE;
    }

    public setHeaders(headers: Record<string, any> = {}) {
      this.headers = headers;
      return this;
    }

    public getBaseUrl() {
      return "/";
    }

    public setBaseUrl(url: string): SERVICE {
      this.baseUrl = url;
      // @ts-ignore
      return this;
    }

    public async all(): Promise<ApiResponse<MODEL[]>> {
      const res: ApiResponse<MODEL[]> = await GET<MODEL[]>(
        this.baseUrl + "/all",
        undefined,
        this.headers,
      );
      return await this.errorHandler(res);
    }

    public async indexWithPagination(
      page: number = 0,
      search?: string,
      sortCol?: string,
      sortDir?: string,
      per_page?: number,
      params?: object,
    ): Promise<ApiResponse<MODEL[]>> {
      const res: ApiResponse<MODEL[]> = await GET<MODEL[]>(
        this.baseUrl,
        {
          page: page,
          search: search,
          sort_col: sortCol,
          sort_dir: sortDir,
          per_page: per_page,
          ...params,
        },
        this.headers,
      );

      return await this.errorHandler(res);
    }

    public async store(
      data: any,
      headers?: object,
    ): Promise<ApiResponse<MODEL>> {
      const res: ApiResponse<MODEL> = await POST<MODEL>(this.baseUrl, data, {
        ...headers,
        ...this.headers,
      });
      return await this.errorHandler(res);
    }

    public async delete(id?: number): Promise<ApiResponse<boolean>> {
      let res: ApiResponse<boolean>;
      if (id) {
        res = await DELETE<boolean>(
          this.baseUrl + "/" + id,
          undefined,
          this.headers,
        );
      } else res = await DELETE<boolean>(this.baseUrl, undefined, this.headers);
      return await this.errorHandler(res);
    }

    public async show(id?: number): Promise<ApiResponse<MODEL>> {
      if (!id) {
        this.router.replace("/+not-found");
      }
      const res = await GET<MODEL>(
        this.baseUrl + "/" + id,
        undefined,
        this.headers,
      );
      if (res.code == 404) {
        this.router.replace("/+not-found");
      }
      return await this.errorHandler(res);
    }

    public async import(data: any) {
      const response = await POST<string>(`${this.baseUrl}/import`, data);
      return await this.errorHandler(response);
    }

    public async update(
      id?: number,
      data?: any,
      headers?: object,
    ): Promise<ApiResponse<MODEL>> {
      if (!id) {
        this.router.replace("/+not-found");
      }
      const res = await PUT<MODEL>(this.baseUrl + "/" + id, data, {
        ...headers,
        ...this.headers,
      });
      if (res.code == 404) {
        this.router.replace("/+not-found");
      }
      return await this.errorHandler(res);
    }

    public async errorHandler<ResType>(
      res: ApiResponse<ResType>,
    ): Promise<Promise<ApiResponse<ResType>>>;

    public async errorHandler<ResType>(
      res: ApiResponse<ResType[]>,
    ): Promise<Promise<ApiResponse<ResType[]>>>;

    public async errorHandler(
      res: ApiResponse<MODEL> | ApiResponse<MODEL[]>,
    ): Promise<Promise<ApiResponse<MODEL>> | Promise<ApiResponse<MODEL[]>>> {
      if (res.code == 401 || res.code == 403) {
        deleteTokens();
        deleteRole();
        this.router.replace("/role-select");
      } else if (res.code == 407) {
        this.router.replace("/role-select");
      }

      if (res.notVerified()) {
        this.router.replace("/verify-phone");
      }

      return res;
    }
  };
}
