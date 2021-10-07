#!/usr/bin/env python3

# Compare the list of FLAC files present in `music/` to the list of metadata and print the difference.

# -- Import --
import json
import os
import os.path

# -- Constants --
METADATA_PATH = "music/_data.json"
MUSIC_DIR =  os.environ["HOME"] + "/archive/finished_music/music/"

# -- Main --
def main():
    with open(METADATA_PATH, "r") as f:
        metadata = json.load(f)

    basenames_in_metadata = set()
    for song in metadata["music"]:
        basenames_in_metadata.add(song["basename"])

    file_list = [x[:-5] for x in os.listdir(MUSIC_DIR) if x.endswith(".flac")]
    basenames_of_flacs = set(file_list)

    print(basenames_of_flacs - basenames_in_metadata)


if __name__ == "__main__":
    main()
