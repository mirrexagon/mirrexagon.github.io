#!/usr/bin/env bash

aws s3 sync ~/archive/finished_music/music s3://lmirx.net/music --delete
