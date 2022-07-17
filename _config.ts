import lume from "https:/deno.land/x/lume@v1.10.1/mod.ts";
import postcss from "https:/deno.land/x/lume@v1.10.1/plugins/postcss.ts";

const site = lume();

site.use(postcss());

site.copy("CNAME");
site.copy("static");

site.copy("music/music-viewer.js");

export default site;
