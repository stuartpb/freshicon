#!/usr/bin/env bash

minutes=`date +%M`
demo_dir=$HOME/public_html/freshicon

for sourcedir in $HOME/freshicon-demo/icon-sources/*; do
  sourcesize="${sourcedir##*/}"
  ln -sf "$sourcedir/$minutes.png" "$demo_dir/icon-$sourcesize.png"
done
