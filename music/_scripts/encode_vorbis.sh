#!/usr/bin/env bash

MUSIC_DIR=~/archive/finished_music/music

process_limit=16

# TODO: Re-encode if tags have changed.

# ---

pushd ${MUSIC_DIR}

for src in *.flac; do
    OGG_PATH=$(echo ${src} | sed 's/\.flac$/\.ogg/')
    if [ ! -e $OGG_PATH -o ${src} -nt $OGG_PATH ]; then
        ffmpeg -y -i ${src} $OGG_PATH &
    fi

    while test $(pgrep -cx ffmpeg) -ge ${process_limit}; do
        sleep 1
    done
done

popd
