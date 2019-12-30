import * as $ from "jquery";
import { FanficMark as FanficMark, Marks } from "./models/mark";
import { Paths } from "./paths";

/**
 * Клиент API fanfics.me
 */
export class ApiClient {

    /**
     * Добавляет метку пользователя на фанфик
     * @param internalFanficId Идентификатор фанфика с сайта fanfics.me
     * @param mark Метка пользователя
     */
    public async AddMark(internalFanficId: number, mark: Marks): Promise<boolean> {
        const requestPath = Paths.AddFavoriteMarkUrl
            .replace("{fanficId}", internalFanficId.toString())
            .replace("{mark}", mark.toString());

        const request = $.get({
            url: requestPath,
            xhrFields: {
                withCredentials: true,
            },
        });
        await request.promise();

        return request.status === 200;
    }

    /**
     * Удаляет метку пользователя с фанфика
     * @param internalFanficId Идентификатор фанфика с сайта fanfics.me
     * @param mark Метка пользователя
     */
    public async RemoveMark(internalFanficId: number, mark: Marks) {
        const requestPath  = Paths.RemoveFavoriteMarkUrl
            .replace("{fanficId}", internalFanficId.toString())
            .replace("{mark}", mark.toString());

        const request = $.get({
            url: requestPath,
            xhrFields: {
                withCredentials: true,
            },
        });
        await request.promise();

        return request.status === 200;
    }

    /**
     * Запрос всех меток пользователя с сайта fanfics.me
     */
    public async GetMarks(): Promise<FanficMark[]> {
        const requestPath = Paths.GetUserFavoritesUrl;
        try {
            const request = $.get({
                url: requestPath,
                xhrFields: {
                    withCredentials: true,
                },
            });
            const response  = await request.promise();

            if (request.status !== 200) {
                console.warn("Не удалось запросить метки фанфиков: сервер ответил " + request.status);
                return new Array<FanficMark>();
            }

            const responseData = Object.keys(response);
            console.info("Запрос меток пользователя вернул " + responseData.length + " меток фанфиков");

            const fanficMarks = new Array<FanficMark>();
            for (const fanficId of responseData) {
                const data = response[fanficId];
                const marks = data.mark.split(",").map((x: string) => (+x));
                const fanficMark = new FanficMark(+fanficId, data.site_id, data.default_id, marks);
                fanficMarks.push(fanficMark);
            }
            return fanficMarks;
        } catch (ex) {
            console.error("Ошибка при запросе всех отметок пользователя\n", ex);
            return new Array<FanficMark>();
        }
    }

    /**
     * Запрашивает внутренний идентификатор фанфика по идентификату сайта и внешнему идентификатору сайта
     * @param siteId Идентификатор сайта
     * @param externalFanficId Внешний идентификатор фанфика с исходного сайта
     * @returns Внутренний идентификатор фанфика с сайта fanfics.me или -1 если запрос неудачен
     */
    public async GetInternalFanficId(siteId: number, externalFanficId: string): Promise<number> {
        const requestPath = Paths.GetFanficIdUrl
            .replace("{siteId}", siteId.toString())
            .replace("{siteFanficId}",  externalFanficId);

        const request = $.get({
            url: requestPath,
            xhrFields: {
                withCredentials: true,
            },
        });
        const response = await request.promise();

        if (request.status !== 200) {
            console.warn("Не удалось получить внутренний идентификатор фанфика для сайта " + siteId + " и внешнего идентификатора " + externalFanficId
                + ": сервер ответил " + request.status);
            return -1;
        }

        if (!response.hasOwnProperty("fic_id")) {
            console.warn("Не удалось внутренний идентификатор фанфика для сайта " + siteId + " и внешнего идентификатора " + externalFanficId
                + ": некорректный ответ от сервера\n" + response);
            return -1;
        }

        return +(response.fic_id);
    }
}
