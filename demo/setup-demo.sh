#!/usr/bin/env bash

demo_base="${BASH_SOURCE[0]}"
demo_base="${demo_base##*/}"

demo_runtime="$HOME/freshicon-demo"
demo_www="$HOME/public_html/freshicon"

mkdir -p "$demo_runtime"
cd "$demo_runtime"
"$demo_base/generate-icons.sh"
cp "$demo_base/update-symlinks.sh" "$demo_runtime/update-symlinks.sh"

mkdir -p "$demo_www"
cp "$demo_base/index.html" "$demo_www/index.html"
cp "$demo_base/../freshicon.js" "$demo_www/freshicon.js"

crontab "$demo_base/cronjob"
