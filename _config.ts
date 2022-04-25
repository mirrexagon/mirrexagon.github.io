import lume from "https:/deno.land/x/lume@v1.1.0/mod.ts";
import postcss from "https:/deno.land/x/lume@v1.1.0/plugins/postcss.ts";

const site = lume();

site.use(postcss());

site.copy("CNAME");
site.copy("static");

site.copy("music/music-viewer.js");

export default site;
