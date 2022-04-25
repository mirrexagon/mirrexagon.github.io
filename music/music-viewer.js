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
    window.addEventListener("ended", function(evt) {
        let all_audios = Array.prototype.slice.call(document.getElementsByClassName("song-audio"));
        let index = all_audios.findIndex(audio => audio == window.$_currentlyPlaying);

        let next_audio = all_audios[index + 1];
        if (next_audio) {
            next_audio.parentElement.scrollIntoView();
            next_audio.play();
            window.$_currentlyPlaying = next_audio;
        }
    }, true);
}

main();
