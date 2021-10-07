#!/usr/bin/env python3

# Apply metadata from `metadata.json` to the FLAC files.
# Requires mutagen.

# -- Import --
import json
import os
from mutagen.flac import FLAC

# -- Constants --
METADATA_PATH = "music/_data.json"
MUSIC_PATH =  os.environ["HOME"] + "/archive/finished_music/music"

TAGS = ["title", "artist", "comment"]

# -- Main --
def main():
    with open(METADATA_PATH) as f:
        metadata = json.load(f)

    for song in metadata["music"]:
        # Allows not updating last modified time if tags didn't change.
        tags_changed = False

        audio_path = "{}/{}.flac".format(MUSIC_PATH, song["basename"])
        print(audio_path)
        audio = FLAC(audio_path)

        for tag in TAGS:
            value = None
            if tag in song:
                value = song[tag]
            else:
                value = ""

            if tag not in audio or audio[tag] != [value]:
                audio[tag] = value
                tags_changed = True

        if tags_changed:
            print("  Changed")
            audio.save()

if __name__ == "__main__":
    main()
