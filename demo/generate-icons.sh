#!/usr/bin/env bash

mkdir -p icon-sources
cd icon-sources

if command -v gm >/dev/null 2>&1; then
  convert_command="gm convert"
elif command -v convert >/dev/null 2>&1; then
  convert_command="convert"
else
  echo "Neither ImageMagick nor GraphicsMagick appears to be installed" >&2
  echo "Cannot generate icons"
  exit 1
fi

for size in 16 32 57 60 72 76 96 114 120 144 152 180 192; do
  mkdir -p "$size"
  for minutes in {0..59}; do
    minutes=`printf %02i $minutes`
    $convert_command -size "${size}x${size}" -pointsize "$size" \
      "label:$minutes" "$size/$minutes.png"
  done
done
