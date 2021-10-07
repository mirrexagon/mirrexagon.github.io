const CONTENT_URL = "https://s3-ap-southeast-2.amazonaws.com/lmirx.net";

const MUSIC_CONTENT_URL = CONTENT_URL + "/music";

const MUSIC_DATA_URL = "music.json";

// -- Globals --
var music_search_input = document.getElementById("music-search-input");
var global_music_data;

var global_audios = [];
var global_visible_songs = [];

music_search_input.value = "";

// -- Search stuff --
function set_search_to(tag) {
    music_search_input.value = tag;
    on_search_key_up();
}

function on_search_key_up() {
    // Set query string in URL.
    // https://stackoverflow.com/a/19279428
    if (history.pushState) {
        // var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?s=" + music_search_input.value;
        // window.history.pushState({path:newurl}, '', newurl);
    }

    // Now let us search.
    let filter = music_search_input.value.toUpperCase();
    let ul = document.getElementById("music-list");

    // Only get immediate children li.
    let li = [];
    {
        let children = ul.childNodes;

        for(let i = 0; i < children.length; i++) {
            if(children[i].nodeName == "LI") {
                li.push(children[i]);
            }
        }
    }

    for (let li_i = 0; li_i < li.length; li_i++) {
        let song_data = global_music_data[li_i];
        let found = false;

        if (song_data.artist.toUpperCase().indexOf(filter) > -1) {
            found = true;
        } else if (song_data.title.toUpperCase().indexOf(filter) > -1) {
            li[li_i].style.display = "";
            found = true;
        }

        // Only check tags if we haven't found the string already.
        if (!found) {
            for (let tag_i = 0; tag_i < song_data.tags.length; ++tag_i) {
                if (song_data.tags[tag_i].toUpperCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
        }

        if (found) {
            li[li_i].style.display = "";
            global_visible_songs[li_i] = true;
        } else {
            li[li_i].style.display = "none";
            global_visible_songs[li_i] = false;
        }
    }
}

// -- Main --
function main() {
    get_music_data()
    .then(music_data => {
        global_music_data = music_data;
        document.getElementById("music-viewer").appendChild(make_list_from_music_data(music_data));
        set_search_to_query_string();
    })
    .catch(err => {
        console.log(err);
    });

    // Sync all volumes.
    window.addEventListener("volumechange", function(evt) {
        let newVolume = evt.target.volume;

        for (element of global_audios) {
            element.volume = newVolume;
        }
    }, true)

    // https://stackoverflow.com/a/37764796
    window.addEventListener("play", function(evt) {
        if(window.$_currentlyPlaying && window.$_currentlyPlaying != evt.target) {
            window.$_currentlyPlaying.pause();
        }

        window.$_currentlyPlaying = evt.target;
    }, true);

    window.addEventListener("ended", function(evt) {
        let index = global_audios.findIndex(audio => audio == window.$_currentlyPlaying);

        // Scroll to and play next visible song.
        for (let i = index + 1; i < global_audios.length; ++i) {
            if (global_visible_songs[i]) {
                window.location.hash = "#song-" + i;

                global_audios[i].play();
                window.$_currentlyPlaying = global_audios[i];

                break;
            }
        }
    }, true);

    window.addEventListener("popstate", function(evt) {
        // set_search_to_query_string(evt.state.path);
    })
}

function set_search_to_query_string(url) {
    // If search is in query string, set up that search.
    // Hack from https://developer.mozilla.org/en-US/docs/Web/API/Location
    var url_holder = document.createElement('a');
    url_holder.href = url;

    const urlParams = new URLSearchParams(url ? url_holder.search : window.location.search);
    const search = urlParams.get('s');
    if (search !== null) {
        set_search_to(search);
    }
}

function make_list_from_music_data(music_data) {
    let list = document.getElementById("music-list");

    console.log("Number of songs: " + music_data.length);

    for (let i = 0; i < music_data.length; ++i) {
        let item = document.createElement('li');
        item.appendChild(make_song_item(music_data[i], i));
        list.appendChild(item);
    }

    return list;
}

function make_song_item(song_data, index) {
    let item = document.getElementById("song-item").content.cloneNode(true);
    item.querySelector(".song-item").id = "song-" + index;

    let base_url = MUSIC_CONTENT_URL + "/" + song_data.basename;

    let flac_url = base_url + ".flac";
    let ogg_url = base_url + ".ogg";

    let project_url;
    if (song_data.project_extension !== undefined) {
        project_url = base_url + song_data.project_extension;
    }

    // ---

    item.querySelector(".song-title").textContent = song_data.artist + " - " + song_data.title;

    item.querySelector(".song-audio-source").setAttribute("src", ogg_url);

    global_visible_songs.push(true);
    global_audios.push(item.querySelector(".song-audio"));

    {
        let downloads = item.querySelector(".song-downloads");
        let download_item_template = document.getElementById("song-downloads-item");

        let downloads_array = [
            [ "FLAC", flac_url ],
            [ "Ogg Vorbis", ogg_url ]
        ];

        if (song_data.project_extension !== undefined) {
            downloads_array.push([ "Project file (." + song_data.project_extension + ")", base_url + "." + song_data.project_extension ]);
        }

        for (let i = 0; i < downloads_array.length; ++i) {
            let download_item = download_item_template.content.cloneNode(true);
            let anchor = download_item.querySelector("a");

            anchor.textContent = downloads_array[i][0];
            anchor.setAttribute("href", downloads_array[i][1]);

            downloads.appendChild(download_item);
        }
    }

    if (song_data.comment !== undefined) {
        item.querySelector(".song-comment").textContent = song_data.comment;
    } else {
        item.querySelector(".song-comment").remove();
    }

    {
        let tags = item.querySelector(".song-tags");
        let tags_item_template = document.getElementById("song-tags-item");

        for (let i = 0; i < song_data.tags.length; ++i) {
            let tag_item = tags_item_template.content.cloneNode(true);
            let button = tag_item.querySelector("button");

            button.onclick = function() { set_search_to(song_data.tags[i]); };
            button.textContent = song_data.tags[i];

            tags.appendChild(tag_item);
        }
    }

    return item;
}

async function get_music_data() {
    let json_string = await fetch(MUSIC_DATA_URL);
    let music_data = json_string.json();
    return music_data;
}

main();
