/**
 * Запросы к API fanfics.me
 */
export class Paths {
    /**
     * Запрос всех отметок пользователя
     */
    public static GetUserFavoritesUrl = "http://fanfics.me/api.php?action=member_favorite_ftf_list";

    /**
     * Запрос идентификатор фанфика в системе ФвФ по идентификатору сайта и идентификатору фанфика с сайта
     * @param siteId Идентификатор сайта
     * @param siteFanficId Идентификатор фанфика на сайте
     */
    public static GetFanficIdUrl = "http://fanfics.me/api.php?action=ftf_check&site_id={siteId}&default_id={siteFanficId}";

    /**
     * Добавление отметки на фанфик
     * @param fanficId Идентификатор фанфика
     * @param mark Метка фанфика
     */
    public static AddFavoriteMarkUrl = "http://fanfics.me/api.php?action=member_favorite_mark_add&fic_type=ftf&fic_id={fanficId}&mark={mark}";

    /**
     * Удаление отметки с фанфика
     * @param fanficId Идентификатор фанфика
     * @param mark Метка фанфика
     */
    public static RemoveFavoriteMarkUrl = "http://fanfics.me/api.php?action=member_favorite_mark_del&fic_type=ftf&fic_id={fanficId}&mark={mark}";
}
