import lume from "https://deno.land/x/lume@v0.15.0/mod.js";

const site = lume();

site.ignore("README.md");

site.copy("styles.css");
site.copy("favicon.png");
site.copy("logo.svg");

export default site;
