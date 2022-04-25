function main() {
    // Sync all volumes.
    window.addEventListener("volumechange", function(evt) {
        let newVolume = evt.target.volume;

        for (element of document.getElementsByClassName("song-audio")) {
            element.volume = newVolume;
        }
    }, true);

    // Pause currently playing audio when the next
    // https://stackoverflow.com/a/37764796
    window.addEventListener("play", function(evt) {
        if(window.$_currentlyPlaying && window.$_currentlyPlaying != evt.target) {
            window.$_currentlyPlaying.pause();
        }

        window.$_currentlyPlaying = evt.target;
    }, true);

    // Play the next song once the current has finished.
    /*
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
    */
}

main();
