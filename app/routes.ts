import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// "app/routes" ディレクトリをスキャンしてルーティング設定を自動生成
// 引数を指定しないと、デフォルトで "app/routes" を見てくれます
export default flatRoutes() satisfies RouteConfig;